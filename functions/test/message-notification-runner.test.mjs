import assert from 'node:assert/strict';
import test from 'node:test';

import {
  runMessageNotificationCreatedEvent,
} from '../lib/message-notification-runner.js';

function createFirestoreDouble(
  initialDocuments = {}
) {
  const documents =
    new Map(
      Object.entries(initialDocuments)
    );

  const calls = {
    gets: [],
    getAll: [],
    collectionGets: [],
    deletes: [],
  };

  function createDocumentReference(
    path
  ) {
    return {
      path,

      collection(
        collectionId
      ) {
        return createCollectionReference(
          `${path}/${collectionId}`
        );
      },

      async get() {
        calls.gets.push(path);

        const exists =
          documents.has(path);

        return {
          exists,

          data() {
            return exists
              ? documents.get(path)
              : undefined;
          },
        };
      },

      async delete() {
        calls.deletes.push(path);
        documents.delete(path);
      },
    };
  }

  function createCollectionReference(
    path
  ) {
    return {
      path,

      doc(documentId) {
        return createDocumentReference(
          `${path}/${documentId}`
        );
      },

      async get() {
        calls.collectionGets.push(
          path
        );

        const prefix =
          `${path}/`;

        const matchingDocuments =
          [];

        for (
          const [
            documentPath,
            data,
          ]
          of documents.entries()
        ) {
          if (
            !documentPath.startsWith(
              prefix
            )
          ) {
            continue;
          }

          const remainingPath =
            documentPath.slice(
              prefix.length
            );

          if (
            remainingPath.length === 0 ||
            remainingPath.includes('/')
          ) {
            continue;
          }

          matchingDocuments.push({
            id:
              remainingPath,
            data() {
              return data;
            },
          });
        }

        return {
          docs:
            matchingDocuments,
        };
      },
    };
  }

  const firestore = {
    collection(
      collectionId
    ) {
      return createCollectionReference(
        collectionId
      );
    },

    async getAll(
      ...references
    ) {
      calls.getAll.push(
        references.map(
          (reference) =>
            reference.path
        )
      );

      return Promise.all(
        references.map(
          (reference) =>
            reference.get()
        )
      );
    },
  };

  return {
    firestore,
    calls,
    documents,
  };
}

const createdAt =
  new Date(
    '2026-10-04T00:00:00.000Z'
  );

function createValidDocuments(
  installationData = {
    token:
      'ExponentPushToken[token-one]',
    platform:
      'android',
    enabled:
      true,
  }
) {
  return {
    'conversations/connection-one': {
      connectionId:
        'connection-one',
      participants: [
        'user-one',
        'user-two',
      ],
      createdAt,
      updatedAt:
        createdAt,
    },

    'users/user-one': {
      blockedUserIds: [],
    },

    'users/user-two': {
      blockedUserIds: [],
    },

    'userNotificationTokens/user-two/installations/installation-one':
      installationData,
  };
}

const validEventInput = {
  conversationId:
    'connection-one',
  messageId:
    'message-one',
  messageData: {
    senderId:
      'user-one',
    text:
      'private message text',
    createdAt,
    readAt:
      null,
  },
};

test(
  'a valid event completes the full notification workflow',
  async () => {
    const {
      firestore,
      calls,
    } = createFirestoreDouble(
      createValidDocuments()
    );

    const pushCalls = [];

    const pushFetch =
      async (
        url,
        init
      ) => {
        pushCalls.push({
          url,
          init,
        });

        return {
          ok:
            true,
          status:
            200,
          async json() {
            return {
              data: [
                {
                  status:
                    'ok',
                  id:
                    'ticket-one',
                },
              ],
            };
          },
        };
      };

    const result =
      await runMessageNotificationCreatedEvent(
        validEventInput,
        {
          firestore,
          pushFetch,
        }
      );

    assert.deepEqual(
      result,
      {
        status:
          'processed',
        conversationId:
          'connection-one',
        messageId:
          'message-one',
        workflowResult: {
          status:
            'completed',
          acceptedCount:
            1,
          rejectedCount:
            0,
          temporarilyUnavailableCount:
            0,
          invalidInstallationCount:
            0,
          cleanupFailureCount:
            0,
        },
      }
    );

    assert.equal(
      pushCalls.length,
      1
    );

    const sentMessages =
      JSON.parse(
        pushCalls[0].init.body
      );

    assert.deepEqual(
      sentMessages,
      [
        {
          to:
            'ExponentPushToken[token-one]',
          title:
            'Nuevo mensaje',
          body:
            'Tienes un mensaje nuevo en LangBridge.',
          sound:
            'default',
          priority:
            'high',
          channelId:
            'messages',
          data: {
            type:
              'chat-message',
            conversationId:
              'connection-one',
            senderId:
              'user-one',
          },
        },
      ]
    );

    assert.equal(
      JSON.stringify(
        pushCalls
      ).includes(
        'private message text'
      ),
      false
    );

    assert.deepEqual(
      calls.collectionGets,
      [
        'userNotificationTokens/user-two/installations',
      ]
    );
  }
);

test(
  'a private block stops the workflow before reading installations',
  async () => {
    const documents =
      createValidDocuments();

    documents[
      'userBlocks/user-two/blockedUsers/user-one'
    ] = {
      blockedId:
        'user-one',
      createdAt,
    };

    const {
      firestore,
      calls,
    } = createFirestoreDouble(
      documents
    );

    let pushCallCount =
      0;

    const result =
      await runMessageNotificationCreatedEvent(
        validEventInput,
        {
          firestore,
          pushFetch:
            async () => {
              pushCallCount +=
                1;

              throw new Error(
                'Push must not be called.'
              );
            },
        }
      );

    assert.equal(
      result.status,
      'processed'
    );

    assert.equal(
      result.workflowResult.status,
      'blocked'
    );

    assert.equal(
      pushCallCount,
      0
    );

    assert.deepEqual(
      calls.collectionGets,
      []
    );
  }
);

test(
  'no valid destinations skips the Expo adapter',
  async () => {
    const {
      firestore,
    } = createFirestoreDouble(
      createValidDocuments({
        token:
          'invalid-token',
        platform:
          'android',
        enabled:
          true,
      })
    );

    let pushCallCount =
      0;

    const result =
      await runMessageNotificationCreatedEvent(
        validEventInput,
        {
          firestore,
          pushFetch:
            async () => {
              pushCallCount +=
                1;

              throw new Error(
                'Push must not be called.'
              );
            },
        }
      );

    assert.deepEqual(
      result,
      {
        status:
          'processed',
        conversationId:
          'connection-one',
        messageId:
          'message-one',
        workflowResult: {
          status:
            'no-destinations',
        },
      }
    );

    assert.equal(
      pushCallCount,
      0
    );
  }
);

test(
  'DeviceNotRegistered removes only the invalid installation',
  async () => {
    const installationPath =
      'userNotificationTokens/user-two/installations/installation-one';

    const {
      firestore,
      calls,
      documents,
    } = createFirestoreDouble(
      createValidDocuments()
    );

    const result =
      await runMessageNotificationCreatedEvent(
        validEventInput,
        {
          firestore,
          pushFetch:
            async () => ({
              ok:
                true,
              status:
                200,
              async json() {
                return {
                  data: [
                    {
                      status:
                        'error',
                      details: {
                        error:
                          'DeviceNotRegistered',
                      },
                    },
                  ],
                };
              },
            }),
        }
      );

    assert.deepEqual(
      result,
      {
        status:
          'processed',
        conversationId:
          'connection-one',
        messageId:
          'message-one',
        workflowResult: {
          status:
            'completed',
          acceptedCount:
            0,
          rejectedCount:
            0,
          temporarilyUnavailableCount:
            0,
          invalidInstallationCount:
            1,
          cleanupFailureCount:
            0,
        },
      }
    );

    assert.deepEqual(
      calls.deletes,
      [
        installationPath,
      ]
    );

    assert.equal(
      documents.has(
        installationPath
      ),
      false
    );
  }
);

test(
  'an invalid event stops before accessing Firestore or Expo',
  async () => {
    const {
      firestore,
      calls,
    } = createFirestoreDouble(
      createValidDocuments()
    );

    let pushCallCount =
      0;

    const result =
      await runMessageNotificationCreatedEvent(
        {
          conversationId:
            '',
          messageId:
            'message-one',
          messageData:
            validEventInput.messageData,
        },
        {
          firestore,
          pushFetch:
            async () => {
              pushCallCount +=
                1;

              throw new Error(
                'Push must not be called.'
              );
            },
        }
      );

    assert.deepEqual(
      result,
      {
        status:
          'invalid-event',
      }
    );

    assert.equal(
      pushCallCount,
      0
    );

    assert.deepEqual(
      calls.gets,
      []
    );

    assert.deepEqual(
      calls.getAll,
      []
    );

    assert.deepEqual(
      calls.collectionGets,
      []
    );
  }
);

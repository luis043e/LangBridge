import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createMessageNotificationFirestoreDependencies,
} from '../lib/message-notification-firestore.js';

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

test(
  'readConversation returns conversation data when it exists',
  async () => {
    const conversationData = {
      connectionId:
        'connection-one',
      participants: [
        'user-one',
        'user-two',
      ],
    };

    const {
      firestore,
      calls,
    } = createFirestoreDouble({
      'conversations/connection-one':
        conversationData,
    });

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    const result =
      await dependencies
        .readConversation(
          'connection-one'
        );

    assert.deepEqual(
      result,
      conversationData
    );

    assert.deepEqual(
      calls.gets,
      [
        'conversations/connection-one',
      ]
    );
  }
);

test(
  'readConversation returns null when the conversation does not exist',
  async () => {
    const {
      firestore,
    } = createFirestoreDouble();

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    const result =
      await dependencies
        .readConversation(
          'missing-conversation'
        );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'readBlockState reads private and legacy blocks in both directions',
  async () => {
    const {
      firestore,
      calls,
    } = createFirestoreDouble({
      'userBlocks/user-one/blockedUsers/user-two':
        {
          blockedId:
            'user-two',
        },
      'users/user-one':
        {
          blockedUserIds: [
            'user-two',
          ],
        },
      'users/user-two':
        {
          blockedUserIds: [
            'user-three',
          ],
        },
    });

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    const result =
      await dependencies
        .readBlockState(
          'user-one',
          'user-two'
        );

    assert.deepEqual(
      result,
      {
        privateSenderBlocksRecipient:
          true,
        privateRecipientBlocksSender:
          false,
        senderBlockedUserIds: [
          'user-two',
        ],
        recipientBlockedUserIds: [
          'user-three',
        ],
      }
    );

    assert.deepEqual(
      calls.getAll,
      [
        [
          'userBlocks/user-one/blockedUsers/user-two',
          'userBlocks/user-two/blockedUsers/user-one',
          'users/user-one',
          'users/user-two',
        ],
      ]
    );
  }
);

test(
  'readBlockState tolerates missing user documents',
  async () => {
    const {
      firestore,
    } = createFirestoreDouble();

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    const result =
      await dependencies
        .readBlockState(
          'user-one',
          'user-two'
        );

    assert.deepEqual(
      result,
      {
        privateSenderBlocksRecipient:
          false,
        privateRecipientBlocksSender:
          false,
        senderBlockedUserIds:
          undefined,
        recipientBlockedUserIds:
          undefined,
      }
    );
  }
);

test(
  'readInstallations returns installation ids and unmodified data',
  async () => {
    const firstInstallation = {
      token:
        'ExponentPushToken[token-one]',
      platform:
        'android',
      enabled:
        true,
    };

    const secondInstallation = {
      token:
        'ExpoPushToken[token-two]',
      platform:
        'ios',
      enabled:
        false,
    };

    const {
      firestore,
      calls,
    } = createFirestoreDouble({
      'userNotificationTokens/user-two/installations/installation-one':
        firstInstallation,
      'userNotificationTokens/user-two/installations/installation-two':
        secondInstallation,
    });

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    const result =
      await dependencies
        .readInstallations(
          'user-two'
        );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-one',
          data:
            firstInstallation,
        },
        {
          installationId:
            'installation-two',
          data:
            secondInstallation,
        },
      ]
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
  'removeInvalidInstallation deletes an existing installation',
  async () => {
    const installationPath =
      'userNotificationTokens/user-two/installations/installation-one';

    const {
      firestore,
      calls,
      documents,
    } = createFirestoreDouble({
      [installationPath]: {
        token:
          'ExponentPushToken[token-one]',
        platform:
          'android',
        enabled:
          true,
      },
    });

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    await dependencies
      .removeInvalidInstallation(
        'user-two',
        'installation-one'
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
  'removeInvalidInstallation tolerates an installation that no longer exists',
  async () => {
    const {
      firestore,
      calls,
    } = createFirestoreDouble();

    const dependencies =
      createMessageNotificationFirestoreDependencies(
        firestore
      );

    await dependencies
      .removeInvalidInstallation(
        'user-two',
        'missing-installation'
      );

    assert.deepEqual(
      calls.deletes,
      []
    );
  }
);
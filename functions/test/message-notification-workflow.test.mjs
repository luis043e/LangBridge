import assert from 'node:assert/strict';
import test from 'node:test';

import {
    runMessageNotificationWorkflow,
} from '../lib/message-notification-workflow.js';

const createdAt =
  new Date(
    '2026-10-03T00:00:00.000Z'
  );

const validMessage = () => ({
  senderId: 'user-one',
  text: 'Hello from LangBridge',
  createdAt,
  readAt: null,
});

const validConversation = () => ({
  connectionId: 'connection-one',
  participants: [
    'user-one',
    'user-two',
  ],
  createdAt,
  updatedAt: createdAt,
});

const validInstallation = (
  installationId = 'installation-one',
  token = 'ExponentPushToken[token-one]'
) => ({
  installationId,
  data: {
    token,
    platform: 'android',
    enabled: true,
    createdAt,
    updatedAt: createdAt,
  },
});

const workflowInput = {
  conversationId: 'connection-one',
  messageData: validMessage(),
};

const createDependencies = (
  overrides = {}
) => {
  const calls = {
    readConversation: [],
    readBlockState: [],
    readInstallations: [],
    sendPush: [],
    removeInvalidInstallation: [],
  };

  const dependencies = {
    readConversation:
      async (conversationId) => {
        calls.readConversation.push(
          conversationId
        );

        return validConversation();
      },

    readBlockState:
      async (
        senderId,
        recipientId
      ) => {
        calls.readBlockState.push({
          senderId,
          recipientId,
        });

        return {
          privateSenderBlocksRecipient:
            false,
          privateRecipientBlocksSender:
            false,
          senderBlockedUserIds: [],
          recipientBlockedUserIds: [],
        };
      },

    readInstallations:
      async (recipientId) => {
        calls.readInstallations.push(
          recipientId
        );

        return [
          validInstallation(),
        ];
      },

    sendPush:
      async (
        destinations,
        payload
      ) => {
        calls.sendPush.push({
          destinations,
          payload,
        });

        return [
          {
            installationId:
              'installation-one',
            status: 'accepted',
            ticketId: 'ticket-one',
          },
        ];
      },

    removeInvalidInstallation:
      async (
        recipientId,
        installationId
      ) => {
        calls
          .removeInvalidInstallation
          .push({
            recipientId,
            installationId,
          });
      },

    ...overrides,
  };

  return {
    calls,
    dependencies,
  };
};

test(
  'a valid workflow sends a neutral notification to the recipient',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies();

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'completed',
      acceptedCount: 1,
      rejectedCount: 0,
      temporarilyUnavailableCount: 0,
      invalidInstallationCount: 0,
      cleanupFailureCount: 0,
    });

    assert.deepEqual(
      calls.readConversation,
      [
        'connection-one',
      ]
    );

    assert.deepEqual(
      calls.readBlockState,
      [
        {
          senderId: 'user-one',
          recipientId: 'user-two',
        },
      ]
    );

    assert.deepEqual(
      calls.readInstallations,
      [
        'user-two',
      ]
    );

    assert.equal(
      calls.sendPush.length,
      1
    );

    assert.equal(
      calls.sendPush[0].payload.body,
      'Tienes un mensaje nuevo en LangBridge.'
    );

    assert.deepEqual(
      calls.removeInvalidInstallation,
      []
    );
  }
);

test(
  'an invalid message stops before reading the conversation',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies();

    const result =
      await runMessageNotificationWorkflow(
        {
          conversationId:
            'connection-one',
          messageData: {
            senderId: 'user-one',
            text: '',
            createdAt,
            readAt: null,
          },
        },
        dependencies
      );

    assert.deepEqual(result, {
      status: 'invalid-message',
    });

    assert.deepEqual(
      calls.readConversation,
      []
    );

    assert.deepEqual(
      calls.sendPush,
      []
    );
  }
);

test(
  'a missing conversation stops the workflow',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readConversation:
        async (conversationId) => {
          calls.readConversation.push(
            conversationId
          );

          return null;
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'conversation-not-found',
    });

    assert.deepEqual(
      calls.readBlockState,
      []
    );

    assert.deepEqual(
      calls.sendPush,
      []
    );
  }
);

test(
  'an invalid conversation stops before reading block state',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readConversation:
        async (conversationId) => {
          calls.readConversation.push(
            conversationId
          );

          return {
            ...validConversation(),
            participants: [
              'user-two',
              'user-three',
            ],
          };
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'invalid-conversation',
    });

    assert.deepEqual(
      calls.readBlockState,
      []
    );

    assert.deepEqual(
      calls.sendPush,
      []
    );
  }
);

test(
  'a private recipient block stops before reading installations',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readBlockState:
        async (
          senderId,
          recipientId
        ) => {
          calls.readBlockState.push({
            senderId,
            recipientId,
          });

          return {
            privateSenderBlocksRecipient:
              false,
            privateRecipientBlocksSender:
              true,
            senderBlockedUserIds: [],
            recipientBlockedUserIds: [],
          };
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'blocked',
      reason:
        'blocked-private-recipient',
    });

    assert.deepEqual(
      calls.readInstallations,
      []
    );

    assert.deepEqual(
      calls.sendPush,
      []
    );
  }
);

test(
  'a legacy sender block stops before reading installations',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readBlockState:
        async (
          senderId,
          recipientId
        ) => {
          calls.readBlockState.push({
            senderId,
            recipientId,
          });

          return {
            privateSenderBlocksRecipient:
              false,
            privateRecipientBlocksSender:
              false,
            senderBlockedUserIds: [
              'user-two',
            ],
            recipientBlockedUserIds: [],
          };
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'blocked',
      reason:
        'blocked-legacy-sender',
    });

    assert.deepEqual(
      calls.readInstallations,
      []
    );
  }
);

test(
  'no valid destinations skips the push adapter',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readInstallations:
        async (recipientId) => {
          calls.readInstallations.push(
            recipientId
          );

          return [
            {
              installationId:
                'installation-one',
              data: {
                token:
                  'not-an-expo-token',
                platform: 'android',
                enabled: true,
              },
            },
          ];
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'no-destinations',
    });

    assert.deepEqual(
      calls.sendPush,
      []
    );
  }
);

test(
  'mixed push results produce accurate counts and cleanup',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      readInstallations:
        async (recipientId) => {
          calls.readInstallations.push(
            recipientId
          );

          return [
            validInstallation(
              'installation-accepted',
              'ExponentPushToken[accepted]'
            ),
            validInstallation(
              'installation-invalid',
              'ExponentPushToken[invalid]'
            ),
            validInstallation(
              'installation-rejected',
              'ExponentPushToken[rejected]'
            ),
            validInstallation(
              'installation-temporary',
              'ExponentPushToken[temporary]'
            ),
          ];
        },

      sendPush:
        async (
          destinations,
          payload
        ) => {
          calls.sendPush.push({
            destinations,
            payload,
          });

          return [
            {
              installationId:
                'installation-accepted',
              status: 'accepted',
              ticketId:
                'ticket-accepted',
            },
            {
              installationId:
                'installation-invalid',
              status: 'invalid-token',
            },
            {
              installationId:
                'installation-rejected',
              status: 'rejected',
            },
            {
              installationId:
                'installation-temporary',
              status:
                'temporarily-unavailable',
            },
          ];
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'completed',
      acceptedCount: 1,
      rejectedCount: 1,
      temporarilyUnavailableCount: 1,
      invalidInstallationCount: 1,
      cleanupFailureCount: 0,
    });

    assert.deepEqual(
      calls.removeInvalidInstallation,
      [
        {
          recipientId: 'user-two',
          installationId:
            'installation-invalid',
        },
      ]
    );
  }
);

test(
  'a cleanup failure does not fail push processing',
  async () => {
    const {
      dependencies,
    } = createDependencies({
      sendPush:
        async () => [
          {
            installationId:
              'installation-one',
            status: 'invalid-token',
          },
        ],

      removeInvalidInstallation:
        async () => {
          throw new Error(
            'Simulated cleanup failure'
          );
        },
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.deepEqual(result, {
      status: 'completed',
      acceptedCount: 0,
      rejectedCount: 0,
      temporarilyUnavailableCount: 0,
      invalidInstallationCount: 1,
      cleanupFailureCount: 1,
    });
  }
);

test(
  'temporary push failures never remove installations',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      sendPush:
        async () => [
          {
            installationId:
              'installation-one',
            status:
              'temporarily-unavailable',
          },
        ],
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.equal(
      result.status,
      'completed'
    );

    assert.deepEqual(
      calls.removeInvalidInstallation,
      []
    );
  }
);

test(
  'rejected push messages never remove installations',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies({
      sendPush:
        async () => [
          {
            installationId:
              'installation-one',
            status: 'rejected',
          },
        ],
    });

    const result =
      await runMessageNotificationWorkflow(
        workflowInput,
        dependencies
      );

    assert.equal(
      result.status,
      'completed'
    );

    assert.deepEqual(
      calls.removeInvalidInstallation,
      []
    );
  }
);

test(
  'the workflow never passes message text to the push adapter',
  async () => {
    const {
      calls,
      dependencies,
    } = createDependencies();

    await runMessageNotificationWorkflow(
      {
        conversationId:
          'connection-one',
        messageData: {
          senderId: 'user-one',
          text:
            'private message text',
          createdAt,
          readAt: null,
        },
      },
      dependencies
    );

    const serializedPushCall =
      JSON.stringify(
        calls.sendPush
      );

    assert.equal(
      serializedPushCall.includes(
        'private message text'
      ),
      false
    );
  }
);
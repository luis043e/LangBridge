import assert from 'node:assert/strict';
import test from 'node:test';

import {
  expoPushEndpoint,
  maximumDestinationsPerRequest,
  sendMessageNotificationPush,
} from '../lib/message-notification-push.js';

const payload = {
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
};

const createDestination = (
  number
) => ({
  installationId:
    `installation-${number}`,
  token:
    `ExponentPushToken[token-${number}]`,
  platform:
    'android',
});

const createSuccessfulResponse = (
  data
) => ({
  ok: true,
  status: 200,
  json: async () => ({
    data,
  }),
});

test(
  'an empty destination list does not call Expo',
  async () => {
    let fetchCallCount = 0;

    const pushFetch =
      async () => {
        fetchCallCount += 1;

        return createSuccessfulResponse(
          []
        );
      };

    const result =
      await sendMessageNotificationPush(
        [],
        payload,
        pushFetch
      );

    assert.deepEqual(
      result,
      []
    );

    assert.equal(
      fetchCallCount,
      0
    );
  }
);

test(
  'an accepted Expo ticket is associated with its installation',
  async () => {
    const destination =
      createDestination(1);

    const pushFetch =
      async (
        url,
        init
      ) => {
        assert.equal(
          url,
          expoPushEndpoint
        );

        assert.equal(
          init.method,
          'POST'
        );

        assert.deepEqual(
          init.headers,
          {
            Accept:
              'application/json',
            'Content-Type':
              'application/json',
            'Accept-Encoding':
              'gzip, deflate',
          }
        );

        const messages =
          JSON.parse(
            init.body
          );

        assert.deepEqual(
          messages,
          [
            {
              to:
                destination.token,
              ...payload,
            },
          ]
        );

        return createSuccessfulResponse(
          [
            {
              status: 'ok',
              id: 'ticket-one',
            },
          ]
        );
      };

    const result =
      await sendMessageNotificationPush(
        [
          destination,
        ],
        payload,
        pushFetch
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'accepted',
          ticketId:
            'ticket-one',
        },
      ]
    );
  }
);

test(
  'an accepted ticket without an id remains accepted',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status: 'ok',
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'accepted',
          ticketId:
            null,
        },
      ]
    );
  }
);

test(
  'DeviceNotRegistered marks the installation token as invalid',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'error',
                details: {
                  error:
                    'DeviceNotRegistered',
                },
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'invalid-token',
        },
      ]
    );
  }
);

test(
  'InvalidCredentials marks the installation token as invalid',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'error',
                details: {
                  error:
                    'InvalidCredentials',
                },
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'invalid-token',
        },
      ]
    );
  }
);

test(
  'MessageTooBig is classified as rejected',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'error',
                details: {
                  error:
                    'MessageTooBig',
                },
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'rejected',
        },
      ]
    );
  }
);

test(
  'MessageRateExceeded is classified as rejected',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'error',
                details: {
                  error:
                    'MessageRateExceeded',
                },
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'rejected',
        },
      ]
    );
  }
);

test(
  'an unknown Expo error is treated as temporarily unavailable',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'error',
                details: {
                  error:
                    'UnknownExpoError',
                },
              },
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'temporarily-unavailable',
        },
      ]
    );
  }
);

test(
  'a network failure preserves all installations',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
          createDestination(2),
        ],
        payload,
        async () => {
          throw new Error(
            'Simulated network failure'
          );
        }
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'temporarily-unavailable',
        },
        {
          installationId:
            'installation-2',
          status:
            'temporarily-unavailable',
        },
      ]
    );
  }
);

test(
  'an unsuccessful HTTP response preserves all installations',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
          createDestination(2),
        ],
        payload,
        async () => ({
          ok: false,
          status: 503,
          json: async () => ({
            error:
              'Service unavailable',
          }),
        })
      );

    assert.deepEqual(
      result.map(
        (item) =>
          item.status
      ),
      [
        'temporarily-unavailable',
        'temporarily-unavailable',
      ]
    );
  }
);

test(
  'invalid JSON preserves all installations',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () => ({
          ok: true,
          status: 200,
          json: async () => {
            throw new Error(
              'Invalid JSON'
            );
          },
        })
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'temporarily-unavailable',
        },
      ]
    );
  }
);

test(
  'a mismatched ticket count preserves the entire batch',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
          createDestination(2),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'ok',
                id:
                  'only-one-ticket',
              },
            ]
          )
      );

    assert.deepEqual(
      result.map(
        (item) =>
          item.status
      ),
      [
        'temporarily-unavailable',
        'temporarily-unavailable',
      ]
    );
  }
);

test(
  'an invalid ticket object is temporarily unavailable',
  async () => {
    const result =
      await sendMessageNotificationPush(
        [
          createDestination(1),
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              null,
            ]
          )
      );

    assert.deepEqual(
      result,
      [
        {
          installationId:
            'installation-1',
          status:
            'temporarily-unavailable',
        },
      ]
    );
  }
);

test(
  'more than one hundred destinations are split into batches',
  async () => {
    const destinations =
      Array.from(
        {
          length: 102,
        },
        (
          _value,
          index
        ) =>
          createDestination(
            index + 1
          )
      );

    const batchSizes = [];

    const result =
      await sendMessageNotificationPush(
        destinations,
        payload,
        async (
          _url,
          init
        ) => {
          const messages =
            JSON.parse(
              init.body
            );

          batchSizes.push(
            messages.length
          );

          return createSuccessfulResponse(
            messages.map(
              (
                _message,
                index
              ) => ({
                status:
                  'ok',
                id:
                  `ticket-${index}`,
              })
            )
          );
        }
      );

    assert.equal(
      maximumDestinationsPerRequest,
      100
    );

    assert.deepEqual(
      batchSizes,
      [
        100,
        2,
      ]
    );

    assert.equal(
      result.length,
      102
    );

    assert.equal(
      result.every(
        (item) =>
          item.status ===
          'accepted'
      ),
      true
    );
  }
);

test(
  'push results never expose destination tokens',
  async () => {
    const destination =
      createDestination(1);

    const result =
      await sendMessageNotificationPush(
        [
          destination,
        ],
        payload,
        async () =>
          createSuccessfulResponse(
            [
              {
                status:
                  'ok',
                id:
                  'ticket-one',
              },
            ]
          )
      );

    const serializedResult =
      JSON.stringify(
        result
      );

    assert.equal(
      serializedResult.includes(
        destination.token
      ),
      false
    );
  }
);
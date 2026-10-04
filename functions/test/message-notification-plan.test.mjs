import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createMessageNotificationPlan,
} from '../lib/message-notification-plan.js';

const createInstallation = (
  installationId,
  token,
  platform = 'android',
  enabled = true
) => ({
  installationId,
  data: {
    token,
    platform,
    enabled,
    createdAt:
      new Date(
        '2026-10-03T00:00:00.000Z'
      ),
    updatedAt:
      new Date(
        '2026-10-03T00:00:00.000Z'
      ),
  },
});

test(
  'a valid installation creates a neutral notification plan',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[token-one]'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result,
      {
        destinations: [
          {
            installationId:
              'installation-one',
            token:
              'ExponentPushToken[token-one]',
            platform:
              'android',
          },
        ],
        payload: {
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
      }
    );
  }
);

test(
  'android and ios installations are accepted',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-android',
            'ExponentPushToken[android-token]',
            'android'
          ),
          createInstallation(
            'installation-ios',
            'ExpoPushToken[ios-token]',
            'ios'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.equal(
      result?.destinations.length,
      2
    );

    assert.deepEqual(
      result?.destinations.map(
        (destination) =>
          destination.platform
      ),
      [
        'android',
        'ios',
      ]
    );
  }
);

test(
  'a disabled installation is ignored',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[token-one]',
            'android',
            false
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      []
    );
  }
);

test(
  'a non-expo token is ignored',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'not-an-expo-token'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      []
    );
  }
);

test(
  'a token containing spaces is ignored',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[token one]'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      []
    );
  }
);

test(
  'an unsupported platform is ignored',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[token-one]',
            'web'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      []
    );
  }
);

test(
  'an installation without object data is ignored',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          {
            installationId:
              'installation-one',
            data:
              null,
          },
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      []
    );
  }
);

test(
  'duplicate tokens are removed while preserving the first installation',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[duplicate-token]'
          ),
          createInstallation(
            'installation-two',
            'ExponentPushToken[duplicate-token]'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations,
      [
        {
          installationId:
            'installation-one',
          token:
            'ExponentPushToken[duplicate-token]',
          platform:
            'android',
        },
      ]
    );
  }
);

test(
  'different valid tokens remain independent destinations',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'phone-installation',
            'ExponentPushToken[phone-token]'
          ),
          createInstallation(
            'tablet-installation',
            'ExponentPushToken[tablet-token]'
          ),
        ],
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result?.destinations.map(
        (destination) =>
          destination.installationId
      ),
      [
        'phone-installation',
        'tablet-installation',
      ]
    );
  }
);

test(
  'an empty conversation id rejects the entire plan',
  () => {
    const result =
      createMessageNotificationPlan(
        [],
        '',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'an empty sender id rejects the entire plan',
  () => {
    const result =
      createMessageNotificationPlan(
        [],
        'connection-one',
        ''
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a plan never includes message text or recipient identity',
  () => {
    const result =
      createMessageNotificationPlan(
        [
          createInstallation(
            'installation-one',
            'ExponentPushToken[token-one]'
          ),
        ],
        'connection-one',
        'user-one'
      );

    const serializedResult =
      JSON.stringify(
        result
      );

    assert.equal(
      serializedResult.includes(
        'private message text'
      ),
      false
    );

    assert.equal(
      serializedResult.includes(
        'recipientId'
      ),
      false
    );

    assert.equal(
      serializedResult.includes(
        'email'
      ),
      false
    );
  }
);
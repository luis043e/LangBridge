import assert from 'node:assert/strict';
import test from 'node:test';

import {
    evaluateMessageNotificationBlockState,
} from '../lib/message-notification-block-state.js';

const createAllowedInput = () => ({
  senderId: 'user-one',
  recipientId: 'user-two',
  privateSenderBlocksRecipient: false,
  privateRecipientBlocksSender: false,
  senderBlockedUserIds: [],
  recipientBlockedUserIds: [],
});

test(
  'a notification without an active block is allowed',
  () => {
    const result =
      evaluateMessageNotificationBlockState(
        createAllowedInput()
      );

    assert.equal(
      result,
      'allowed'
    );
  }
);

test(
  'a private sender block prevents the notification',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        privateSenderBlocksRecipient: true,
      });

    assert.equal(
      result,
      'blocked-private-sender'
    );
  }
);

test(
  'a private recipient block prevents the notification',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        privateRecipientBlocksSender: true,
      });

    assert.equal(
      result,
      'blocked-private-recipient'
    );
  }
);

test(
  'a legacy sender block prevents the notification',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        senderBlockedUserIds: [
          'user-two',
        ],
      });

    assert.equal(
      result,
      'blocked-legacy-sender'
    );
  }
);

test(
  'a legacy recipient block prevents the notification',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        recipientBlockedUserIds: [
          'user-one',
        ],
      });

    assert.equal(
      result,
      'blocked-legacy-recipient'
    );
  }
);

test(
  'a private sender block takes priority over legacy blocks',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        privateSenderBlocksRecipient: true,
        privateRecipientBlocksSender: true,
        senderBlockedUserIds: [
          'user-two',
        ],
        recipientBlockedUserIds: [
          'user-one',
        ],
      });

    assert.equal(
      result,
      'blocked-private-sender'
    );
  }
);

test(
  'a private recipient block takes priority over legacy blocks',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        privateRecipientBlocksSender: true,
        senderBlockedUserIds: [
          'user-two',
        ],
        recipientBlockedUserIds: [
          'user-one',
        ],
      });

    assert.equal(
      result,
      'blocked-private-recipient'
    );
  }
);

test(
  'a non-array legacy sender value is ignored',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        senderBlockedUserIds: {
          invalid: true,
        },
      });

    assert.equal(
      result,
      'allowed'
    );
  }
);

test(
  'a non-array legacy recipient value is ignored',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        recipientBlockedUserIds:
          'user-one',
      });

    assert.equal(
      result,
      'allowed'
    );
  }
);

test(
  'invalid and duplicate legacy ids do not create a false block',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        senderBlockedUserIds: [
          '',
          '',
          42,
          null,
          'another-user',
          'another-user',
        ],
        recipientBlockedUserIds: [
          false,
          'different-user',
        ],
      });

    assert.equal(
      result,
      'allowed'
    );
  }
);

test(
  'an empty sender id fails closed',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        senderId: '',
      });

    assert.equal(
      result,
      'blocked-private-sender'
    );
  }
);

test(
  'an empty recipient id fails closed',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        recipientId: '',
      });

    assert.equal(
      result,
      'blocked-private-sender'
    );
  }
);

test(
  'matching sender and recipient ids fail closed',
  () => {
    const result =
      evaluateMessageNotificationBlockState({
        ...createAllowedInput(),
        recipientId: 'user-one',
      });

    assert.equal(
      result,
      'blocked-private-sender'
    );
  }
);
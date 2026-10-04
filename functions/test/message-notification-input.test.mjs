import assert from 'node:assert/strict';
import test from 'node:test';

import {
  parseMessageNotificationConversation,
  parseMessageNotificationInput,
} from '../lib/message-notification-input.js';

const createdAt =
  new Date(
    '2026-10-03T00:00:00.000Z'
  );

const createValidMessage = () => ({
  senderId: 'user-one',
  text: 'Hello from LangBridge',
  createdAt,
  readAt: null,
});

const createValidConversation = () => ({
  connectionId: 'connection-one',
  participants: [
    'user-one',
    'user-two',
  ],
  createdAt,
  updatedAt: createdAt,
});

test(
  'a valid message notification input is accepted',
  () => {
    const result =
      parseMessageNotificationInput(
        createValidMessage()
      );

    assert.deepEqual(
      result,
      {
        senderId: 'user-one',
        text: 'Hello from LangBridge',
      }
    );
  }
);

test(
  'a message notification input with an unknown field is rejected',
  () => {
    const result =
      parseMessageNotificationInput({
        ...createValidMessage(),
        unexpectedField: true,
      });

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a message notification input without createdAt is rejected',
  () => {
    const {
      createdAt:
        _createdAt,
      ...messageWithoutCreatedAt
    } = createValidMessage();

    const result =
      parseMessageNotificationInput(
        messageWithoutCreatedAt
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a message notification input with a non-null readAt is rejected',
  () => {
    const result =
      parseMessageNotificationInput({
        ...createValidMessage(),
        readAt: createdAt,
      });

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a message notification input with empty text is rejected',
  () => {
    const result =
      parseMessageNotificationInput({
        ...createValidMessage(),
        text: '',
      });

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a message notification input longer than one thousand characters is rejected',
  () => {
    const result =
      parseMessageNotificationInput({
        ...createValidMessage(),
        text: 'a'.repeat(1001),
      });

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a valid notification conversation identifies the recipient',
  () => {
    const result =
      parseMessageNotificationConversation(
        createValidConversation(),
        'connection-one',
        'user-one'
      );

    assert.deepEqual(
      result,
      {
        connectionId:
          'connection-one',
        senderId:
          'user-one',
        recipientId:
          'user-two',
      }
    );
  }
);

test(
  'a notification conversation with three participants is rejected',
  () => {
    const result =
      parseMessageNotificationConversation(
        {
          ...createValidConversation(),
          participants: [
            'user-one',
            'user-two',
            'user-three',
          ],
        },
        'connection-one',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a notification conversation with duplicate participants is rejected',
  () => {
    const result =
      parseMessageNotificationConversation(
        {
          ...createValidConversation(),
          participants: [
            'user-one',
            'user-one',
          ],
        },
        'connection-one',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a notification conversation without the sender is rejected',
  () => {
    const result =
      parseMessageNotificationConversation(
        {
          ...createValidConversation(),
          participants: [
            'user-two',
            'user-three',
          ],
        },
        'connection-one',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a notification conversation with a mismatched connection id is rejected',
  () => {
    const result =
      parseMessageNotificationConversation(
        createValidConversation(),
        'another-connection',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);

test(
  'a notification conversation with an unknown field is rejected',
  () => {
    const result =
      parseMessageNotificationConversation(
        {
          ...createValidConversation(),
          unexpectedField: true,
        },
        'connection-one',
        'user-one'
      );

    assert.equal(
      result,
      null
    );
  }
);
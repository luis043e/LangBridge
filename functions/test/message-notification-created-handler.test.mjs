import assert from 'node:assert/strict';
import test from 'node:test';

import {
    runMessageNotificationCreatedHandler,
} from '../lib/message-notification-created-handler.js';

const validMessageData = {
  senderId: 'user-one',
  text: 'private message text',
  createdAt: new Date(
    '2026-10-04T00:00:00.000Z'
  ),
  readAt: null,
};

test(
  'a valid event passes the conversation and message data to the workflow',
  async () => {
    const workflowCalls = [];

    const runWorkflow =
      async (input) => {
        workflowCalls.push(input);

        return {
          status: 'completed',
          acceptedCount: 1,
          rejectedCount: 0,
          temporarilyUnavailableCount: 0,
          invalidInstallationCount: 0,
          cleanupFailureCount: 0,
        };
      };

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'connection-one',
          messageId:
            'message-one',
          messageData:
            validMessageData,
        },
        runWorkflow
      );

    assert.deepEqual(
      workflowCalls,
      [
        {
          conversationId:
            'connection-one',
          messageData:
            validMessageData,
        },
      ]
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
          acceptedCount: 1,
          rejectedCount: 0,
          temporarilyUnavailableCount: 0,
          invalidInstallationCount: 0,
          cleanupFailureCount: 0,
        },
      }
    );
  }
);

test(
  'an invalid conversation id stops before calling the workflow',
  async () => {
    let workflowCallCount = 0;

    const runWorkflow =
      async () => {
        workflowCallCount += 1;

        return {
          status:
            'invalid-message',
        };
      };

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            '',
          messageId:
            'message-one',
          messageData:
            validMessageData,
        },
        runWorkflow
      );

    assert.deepEqual(
      result,
      {
        status:
          'invalid-event',
      }
    );

    assert.equal(
      workflowCallCount,
      0
    );
  }
);

test(
  'an invalid message id stops before calling the workflow',
  async () => {
    let workflowCallCount = 0;

    const runWorkflow =
      async () => {
        workflowCallCount += 1;

        return {
          status:
            'invalid-message',
        };
      };

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'connection-one',
          messageId:
            null,
          messageData:
            validMessageData,
        },
        runWorkflow
      );

    assert.deepEqual(
      result,
      {
        status:
          'invalid-event',
      }
    );

    assert.equal(
      workflowCallCount,
      0
    );
  }
);

test(
  'an oversized conversation id is rejected',
  async () => {
    let workflowCallCount = 0;

    const runWorkflow =
      async () => {
        workflowCallCount += 1;

        return {
          status:
            'invalid-message',
        };
      };

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'c'.repeat(257),
          messageId:
            'message-one',
          messageData:
            validMessageData,
        },
        runWorkflow
      );

    assert.deepEqual(
      result,
      {
        status:
          'invalid-event',
      }
    );

    assert.equal(
      workflowCallCount,
      0
    );
  }
);

test(
  'an oversized message id is rejected',
  async () => {
    let workflowCallCount = 0;

    const runWorkflow =
      async () => {
        workflowCallCount += 1;

        return {
          status:
            'invalid-message',
        };
      };

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'connection-one',
          messageId:
            'm'.repeat(257),
          messageData:
            validMessageData,
        },
        runWorkflow
      );

    assert.deepEqual(
      result,
      {
        status:
          'invalid-event',
      }
    );

    assert.equal(
      workflowCallCount,
      0
    );
  }
);

test(
  'the handler preserves a non-completed workflow result',
  async () => {
    const runWorkflow =
      async () => ({
        status:
          'blocked',
        reason:
          'recipient-blocks-sender',
      });

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'connection-one',
          messageId:
            'message-one',
          messageData:
            validMessageData,
        },
        runWorkflow
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
            'blocked',
          reason:
            'recipient-blocks-sender',
        },
      }
    );
  }
);

test(
  'the handler does not serialize or copy private message text into its result',
  async () => {
    const runWorkflow =
      async () => ({
        status:
          'no-destinations',
      });

    const result =
      await runMessageNotificationCreatedHandler(
        {
          conversationId:
            'connection-one',
          messageId:
            'message-one',
          messageData: {
            ...validMessageData,
            text:
              'private message text',
          },
        },
        runWorkflow
      );

    const serializedResult =
      JSON.stringify(result);

    assert.equal(
      serializedResult.includes(
        'private message text'
      ),
      false
    );
  }
);
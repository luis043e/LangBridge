import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    evaluateCancellationRecordState,
} from '../functions/lib/cancellation-record-state.js';

const cancelledAt =
  new Date(
    '2026-09-22T16:00:00.000Z'
  );

const expiresAt =
  new Date(
    '2026-10-22T16:00:00.000Z'
  );

function createRecord(
  overrides = {}
) {
  return {
    status:
      'cancelled',
    cancelledAt:
      new Date(
        cancelledAt.getTime()
      ),
    expiresAt:
      new Date(
        expiresAt.getTime()
      ),
    procedureVersion:
      'account-deletion-cancellation-v1',
    verificationMethod:
      'recent-session',
    restorationResult:
      'restored',
    ...overrides,
  };
}

test(
  'a minimum cancellation record is valid',
  () => {
    const result =
      evaluateCancellationRecordState(
        createRecord()
      );

    assert.equal(
      result.status,
      'valid'
    );

    assert.equal(
      result.cancelledAt.toISOString(),
      cancelledAt.toISOString()
    );

    assert.equal(
      result.expiresAt.toISOString(),
      expiresAt.toISOString()
    );
  }
);

test(
  'Firestore-like timestamps are accepted',
  () => {
    const result =
      evaluateCancellationRecordState(
        createRecord({
          cancelledAt: {
            toDate() {
              return new Date(
                cancelledAt.getTime()
              );
            },
          },
          expiresAt: {
            toDate() {
              return new Date(
                expiresAt.getTime()
              );
            },
          },
        })
      );

    assert.equal(
      result.status,
      'valid'
    );
  }
);

test(
  'the returned dates are independent',
  () => {
    const record =
      createRecord();

    const result =
      evaluateCancellationRecordState(
        record
      );

    assert.notEqual(
      result.cancelledAt,
      record.cancelledAt
    );

    assert.notEqual(
      result.expiresAt,
      record.expiresAt
    );
  }
);

test(
  'a record with an identifying field is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRecordState(
        createRecord({
          userId:
            'user-one',
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a record with a temporary restoration field is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRecordState(
        createRecord({
          previousProfileVisibility:
            true,
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a record missing a required field is inconsistent',
  () => {
    const record =
      createRecord();

    delete record
      .restorationResult;

    assert.deepEqual(
      evaluateCancellationRecordState(
        record
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an invalid closed value is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRecordState(
        createRecord({
          status:
            'completed',
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an invalid cancellation date is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRecordState(
        createRecord({
          cancelledAt:
            'invalid-date',
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an incorrect expiry is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRecordState(
        createRecord({
          expiresAt:
            new Date(
              '2026-10-21T16:00:00.000Z'
            ),
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'missing and malformed records are inconsistent',
  () => {
    const malformedRecords = [
      undefined,
      null,
      '',
      0,
      false,
      [],
      {},
    ];

    for (
      const value of
      malformedRecords
    ) {
      assert.deepEqual(
        evaluateCancellationRecordState(
          value
        ),
        {
          status:
            'inconsistent-state',
        }
      );
    }
  }
);
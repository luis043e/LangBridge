import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    calculateCancellationExpiry,
    createCancellationPlan,
} from '../functions/lib/cancellation-plan.js';

const cancelledAt =
  new Date(
    '2026-09-20T18:00:00.000Z'
  );

test(
  'the cancellation plan restores a previously visible profile',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.deepEqual(
      plan.profileUpdate,
      {
        isProfileVisible:
          true,
      }
    );
  }
);

test(
  'the cancellation plan preserves a previously hidden profile',
  () => {
    const plan =
      createCancellationPlan(
        false,
        cancelledAt
      );

    assert.deepEqual(
      plan.profileUpdate,
      {
        isProfileVisible:
          false,
      }
    );
  }
);

test(
  'the cancellation plan removes both temporary profile fields',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.deepEqual(
      plan.profileFieldsToDelete,
      [
        'deletionRequested',
        'deletionRequestedAt',
      ]
    );
  }
);

test(
  'the cancellation record contains only the required minimum fields',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.deepEqual(
      Object.keys(
        plan.cancelledRecord
      ).sort(),
      [
        'cancelledAt',
        'expiresAt',
        'procedureVersion',
        'restorationResult',
        'status',
        'verificationMethod',
      ].sort()
    );
  }
);

test(
  'the cancellation record uses the approved closed values',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.equal(
      plan.cancelledRecord.status,
      'cancelled'
    );

    assert.equal(
      plan.cancelledRecord.procedureVersion,
      'account-deletion-cancellation-v1'
    );

    assert.equal(
      plan.cancelledRecord.verificationMethod,
      'recent-session'
    );

    assert.equal(
      plan.cancelledRecord.restorationResult,
      'restored'
    );
  }
);

test(
  'the cancellation plan calculates exactly 30 calendar days',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.equal(
      plan.cancelledRecord.cancelledAt.toISOString(),
      '2026-09-20T18:00:00.000Z'
    );

    assert.equal(
      plan.cancelledRecord.expiresAt.toISOString(),
      '2026-10-20T18:00:00.000Z'
    );
  }
);

test(
  'the expiry calculator handles a month boundary',
  () => {
    const result =
      calculateCancellationExpiry(
        new Date(
          '2026-01-31T12:30:00.000Z'
        )
      );

    assert.equal(
      result.toISOString(),
      '2026-03-02T12:30:00.000Z'
    );
  }
);

test(
  'the cancellation plan does not mutate the supplied date',
  () => {
    const original =
      new Date(
        cancelledAt.getTime()
      );

    createCancellationPlan(
      true,
      original
    );

    assert.equal(
      original.toISOString(),
      cancelledAt.toISOString()
    );
  }
);

test(
  'the cancellation plan uses independent date objects',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.notEqual(
      plan.cancelledRecord.cancelledAt,
      cancelledAt
    );

    assert.notEqual(
      plan.cancelledRecord.expiresAt,
      cancelledAt
    );

    assert.notEqual(
      plan.cancelledRecord.expiresAt,
      plan.cancelledRecord.cancelledAt
    );
  }
);

test(
  'the cancellation plan rejects an invalid date',
  () => {
    assert.throws(
      () => {
        createCancellationPlan(
          true,
          new Date(
            Number.NaN
          )
        );
      },
      {
        name:
          'TypeError',
        message:
          'cancelledAt must be a valid Date.',
      }
    );
  }
);

test(
  'the expiry calculator rejects an invalid date',
  () => {
    assert.throws(
      () => {
        calculateCancellationExpiry(
          new Date(
            Number.NaN
          )
        );
      },
      {
        name:
          'TypeError',
        message:
          'cancelledAt must be a valid Date.',
      }
    );
  }
);

test(
  'the cancellation plan marks the active request for deletion',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.equal(
      plan.deleteActiveRequest,
      true
    );
  }
);

test(
  'the cancellation plan explicitly prohibits creating a deletion receipt',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    assert.equal(
      plan.createDeletionReceipt,
      false
    );
  }
);

test(
  'the cancellation plan contains no identifying or temporary data',
  () => {
    const plan =
      createCancellationPlan(
        true,
        cancelledAt
      );

    const serialized =
      JSON.stringify(
        plan.cancelledRecord
      );

    assert.equal(
      serialized.includes(
        'userId'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'userEmail'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'previousProfileVisibility'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'cancellationRecordId'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'DEL-S2'
      ),
      false
    );
  }
);
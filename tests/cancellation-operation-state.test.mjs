import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    CANCELLATION_OPERATION_PHASES,
    advanceCancellationOperationPhase,
    createCancellationOperationState,
    isCancellationOperationPhase,
} from '../functions/lib/cancellation-operation-state.js';

const operationKey =
  'operation-key-value-with-at-least-32-characters';

const cancellationRecordId =
  'cancellation-record-value-1234567890';

const requestCreatedAt =
  new Date(
    '2026-09-20T14:00:00.000Z'
  );

const cancelledAt =
  new Date(
    '2026-09-20T15:00:00.000Z'
  );

const expiresAt =
  new Date(
    '2026-10-20T15:00:00.000Z'
  );

function createState() {
  return createCancellationOperationState(
    operationKey,
    requestCreatedAt,
    cancellationRecordId,
    cancelledAt,
    expiresAt
  );
}

test(
  'the cancellation operation uses the complete closed phase list',
  () => {
    assert.deepEqual(
      CANCELLATION_OPERATION_PHASES,
      [
        'not-started',
        'restoration-in-progress',
        'profile-restored',
        'cancelled-record-created',
        'active-request-removed',
        'temporary-restoration-data-removed',
        'completed',
      ]
    );
  }
);

test(
  'a new cancellation operation starts at not-started',
  () => {
    const state =
      createState();

    assert.equal(
      state.phase,
      'not-started'
    );
  }
);

test(
  'the coordinator preserves separate opaque identifiers',
  () => {
    const state =
      createState();

    assert.equal(
      state.operationKey,
      operationKey
    );

    assert.equal(
      state.cancellationRecordId,
      cancellationRecordId
    );

    assert.notEqual(
      state.operationKey,
      state.cancellationRecordId
    );
  }
);

test(
  'the coordinator preserves the request creation timestamp',
  () => {
    const state =
      createState();

    assert.equal(
      state.requestCreatedAt.toISOString(),
      '2026-09-20T14:00:00.000Z'
    );
  }
);

test(
  'the coordinator preserves cancellation timestamps',
  () => {
    const state =
      createState();

    assert.equal(
      state.cancelledAt.toISOString(),
      '2026-09-20T15:00:00.000Z'
    );

    assert.equal(
      state.expiresAt.toISOString(),
      '2026-10-20T15:00:00.000Z'
    );

    assert.equal(
      state.operationExpiresAt.toISOString(),
      '2026-10-20T15:00:00.000Z'
    );
  }
);

test(
  'the coordinator uses independent date objects',
  () => {
    const state =
      createState();

    assert.notEqual(
      state.requestCreatedAt,
      requestCreatedAt
    );

    assert.notEqual(
      state.cancelledAt,
      cancelledAt
    );

    assert.notEqual(
      state.expiresAt,
      expiresAt
    );

    assert.notEqual(
      state.operationExpiresAt,
      state.cancelledAt
    );
  }
);

test(
  'the coordinator does not mutate supplied dates',
  () => {
    const originalRequestCreatedAt =
      new Date(
        requestCreatedAt.getTime()
      );

    const originalCancelledAt =
      new Date(
        cancelledAt.getTime()
      );

    const originalExpiresAt =
      new Date(
        expiresAt.getTime()
      );

    createCancellationOperationState(
      operationKey,
      originalRequestCreatedAt,
      cancellationRecordId,
      originalCancelledAt,
      originalExpiresAt
    );

    assert.equal(
      originalRequestCreatedAt.toISOString(),
      requestCreatedAt.toISOString()
    );

    assert.equal(
      originalCancelledAt.toISOString(),
      cancelledAt.toISOString()
    );

    assert.equal(
      originalExpiresAt.toISOString(),
      expiresAt.toISOString()
    );
  }
);

test(
  'the coordinator rejects equal internal identifiers',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          requestCreatedAt,
          operationKey,
          cancelledAt,
          expiresAt
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationKey and cancellationRecordId must be different.',
      }
    );
  }
);

test(
  'the coordinator rejects a short operation key',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          'short-operation-key',
          requestCreatedAt,
          cancellationRecordId,
          cancelledAt,
          expiresAt
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationKey must contain at least 32 characters.',
      }
    );
  }
);

test(
  'the coordinator rejects a short cancellation record id',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          requestCreatedAt,
          'short-record-id',
          cancelledAt,
          expiresAt
        );
      },
      {
        name:
          'TypeError',
        message:
          'cancellationRecordId must contain at least 32 characters.',
      }
    );
  }
);

test(
  'the coordinator rejects an invalid request creation date',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          new Date(
            Number.NaN
          ),
          cancellationRecordId,
          cancelledAt,
          expiresAt
        );
      },
      {
        name:
          'TypeError',
        message:
          'requestCreatedAt must be a valid Date.',
      }
    );
  }
);

test(
  'the coordinator rejects an invalid cancellation date',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          requestCreatedAt,
          cancellationRecordId,
          new Date(
            Number.NaN
          ),
          expiresAt
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
  'the coordinator rejects an invalid expiration date',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          requestCreatedAt,
          cancellationRecordId,
          cancelledAt,
          new Date(
            Number.NaN
          )
        );
      },
      {
        name:
          'TypeError',
        message:
          'expiresAt must be a valid Date.',
      }
    );
  }
);

test(
  'the coordinator rejects an expiration different from 30 calendar days',
  () => {
    assert.throws(
      () => {
        createCancellationOperationState(
          operationKey,
          requestCreatedAt,
          cancellationRecordId,
          cancelledAt,
          new Date(
            '2026-10-21T15:00:00.000Z'
          )
        );
      },
      {
        name:
          'TypeError',
        message:
          'expiresAt must be exactly 30 calendar days after cancelledAt.',
      }
    );
  }
);

test(
  'all declared operation phases are recognized',
  () => {
    for (
      const phase of
      CANCELLATION_OPERATION_PHASES
    ) {
      assert.equal(
        isCancellationOperationPhase(
          phase
        ),
        true
      );
    }
  }
);

test(
  'unknown operation phases are rejected',
  () => {
    assert.equal(
      isCancellationOperationPhase(
        'unknown-phase'
      ),
      false
    );

    assert.equal(
      isCancellationOperationPhase(
        null
      ),
      false
    );
  }
);

test(
  'the coordinator permits the next sequential phase',
  () => {
    assert.equal(
      advanceCancellationOperationPhase(
        'not-started',
        'restoration-in-progress'
      ),
      'restoration-in-progress'
    );
  }
);

test(
  'the coordinator permits the same phase during an idempotent retry',
  () => {
    assert.equal(
      advanceCancellationOperationPhase(
        'profile-restored',
        'profile-restored'
      ),
      'profile-restored'
    );
  }
);

test(
  'the coordinator rejects skipping a phase',
  () => {
    assert.throws(
      () => {
        advanceCancellationOperationPhase(
          'not-started',
          'profile-restored'
        );
      },
      {
        name:
          'TypeError',
        message:
          'The cancellation operation phase transition is invalid.',
      }
    );
  }
);

test(
  'the coordinator rejects moving backward',
  () => {
    assert.throws(
      () => {
        advanceCancellationOperationPhase(
          'profile-restored',
          'restoration-in-progress'
        );
      },
      {
        name:
          'TypeError',
        message:
          'The cancellation operation phase transition is invalid.',
      }
    );
  }
);

test(
  'the coordinator contains no directly identifying fields',
  () => {
    const state =
      createState();

    const keys =
      Object.keys(
        state
      );

    assert.equal(
      keys.includes(
        'uid'
      ),
      false
    );

    assert.equal(
      keys.includes(
        'userId'
      ),
      false
    );

    assert.equal(
      keys.includes(
        'userEmail'
      ),
      false
    );

    assert.equal(
      keys.includes(
        'previousProfileVisibility'
      ),
      false
    );

    assert.equal(
      keys.includes(
        'deletionReceipt'
      ),
      false
    );
  }
);
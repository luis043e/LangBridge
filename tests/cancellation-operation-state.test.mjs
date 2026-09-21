import assert from 'node:assert/strict';
import {
  test,
} from 'node:test';

import {
  CANCELLATION_OPERATION_PHASES,
  advanceCancellationOperationPhase,
  createInitialCancellationOperationState,
  isCancellationOperationPhase,
} from '../functions/lib/cancellation-operation-state.js';

const operationKey =
  'a'.repeat(64);

const cancellationRecordId =
  'b'.repeat(32);

const requestCreatedAt =
  new Date(
    '2026-09-20T14:00:00.000Z'
  );

const operationStartedAt =
  new Date(
    '2026-09-20T15:00:00.000Z'
  );

function createState() {
  return createInitialCancellationOperationState(
    operationKey,
    requestCreatedAt,
    operationStartedAt,
    cancellationRecordId
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
  'a persisted cancellation operation begins with restoration in progress',
  () => {
    assert.equal(
      createState().phase,
      'restoration-in-progress'
    );
  }
);

test(
  'the initial coordinator preserves separate opaque identifiers',
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
  'the initial coordinator preserves request and operation timestamps',
  () => {
    const state =
      createState();

    assert.equal(
      state.requestCreatedAt.toISOString(),
      '2026-09-20T14:00:00.000Z'
    );

    assert.equal(
      state.operationStartedAt.toISOString(),
      '2026-09-20T15:00:00.000Z'
    );
  }
);

test(
  'the initial coordinator uses independent date objects',
  () => {
    const state =
      createState();

    assert.notEqual(
      state.requestCreatedAt,
      requestCreatedAt
    );

    assert.notEqual(
      state.operationStartedAt,
      operationStartedAt
    );
  }
);

test(
  'the initial coordinator does not mutate supplied dates',
  () => {
    const suppliedRequestCreatedAt =
      new Date(
        requestCreatedAt.getTime()
      );

    const suppliedOperationStartedAt =
      new Date(
        operationStartedAt.getTime()
      );

    createInitialCancellationOperationState(
      operationKey,
      suppliedRequestCreatedAt,
      suppliedOperationStartedAt,
      cancellationRecordId
    );

    assert.equal(
      suppliedRequestCreatedAt.toISOString(),
      requestCreatedAt.toISOString()
    );

    assert.equal(
      suppliedOperationStartedAt.toISOString(),
      operationStartedAt.toISOString()
    );
  }
);

test(
  'the initial coordinator does not contain completion timestamps',
  () => {
    const state =
      createState();

    assert.equal(
      Object.hasOwn(
        state,
        'cancelledAt'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        state,
        'expiresAt'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        state,
        'operationExpiresAt'
      ),
      false
    );
  }
);

test(
  'the initial coordinator rejects equal internal identifiers',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          requestCreatedAt,
          operationStartedAt,
          operationKey
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
  'the initial coordinator rejects short opaque identifiers',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          'short-operation-key',
          requestCreatedAt,
          operationStartedAt,
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationKey must contain at least 32 characters.',
      }
    );

    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          requestCreatedAt,
          operationStartedAt,
          'short-record-id'
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
  'the initial coordinator rejects path separators in opaque identifiers',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          `${operationKey}/forged`,
          requestCreatedAt,
          operationStartedAt,
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationKey cannot contain path separators.',
      }
    );

    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          requestCreatedAt,
          operationStartedAt,
          `${cancellationRecordId}\\forged`
        );
      },
      {
        name:
          'TypeError',
        message:
          'cancellationRecordId cannot contain path separators.',
      }
    );
  }
);

test(
  'the initial coordinator rejects invalid dates',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          new Date(
            Number.NaN
          ),
          operationStartedAt,
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'requestCreatedAt must be a valid Date.',
      }
    );

    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          requestCreatedAt,
          new Date(
            Number.NaN
          ),
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationStartedAt must be a valid Date.',
      }
    );
  }
);

test(
  'operation start cannot precede request creation',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          operationKey,
          requestCreatedAt,
          new Date(
            '2026-09-20T13:59:59.999Z'
          ),
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationStartedAt cannot be earlier than requestCreatedAt.',
      }
    );
  }
);

test(
  'operation start may equal request creation',
  () => {
    const state =
      createInitialCancellationOperationState(
        operationKey,
        requestCreatedAt,
        requestCreatedAt,
        cancellationRecordId
      );

    assert.equal(
      state.operationStartedAt.toISOString(),
      requestCreatedAt.toISOString()
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
        'restoration-in-progress',
        'profile-restored'
      ),
      'profile-restored'
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
          'restoration-in-progress',
          'cancelled-record-created'
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
  'the initial coordinator contains no directly identifying fields',
  () => {
    const state =
      createState();

    const forbiddenFields = [
      'uid',
      'userId',
      'userEmail',
      'previousProfileVisibility',
      'deletionReceipt',
    ];

    for (
      const field of
      forbiddenFields
    ) {
      assert.equal(
        Object.hasOwn(
          state,
          field
        ),
        false
      );
    }
  }
);
test(
  'the initial coordinator rejects a non-hexadecimal operation key',
  () => {
    assert.throws(
      () => {
        createInitialCancellationOperationState(
          'g'.repeat(64),
          requestCreatedAt,
          operationStartedAt,
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'operationKey must be a 64-character lowercase hexadecimal lookup key.',
      }
    );
  }
);
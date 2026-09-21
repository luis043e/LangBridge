import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    evaluateCancellationReadState,
} from '../functions/lib/cancellation-read-state.js';

const authenticatedUid =
  'user-one';

const operationKey =
  'operation-key-value-with-at-least-32-characters';

const cancellationRecordId =
  'cancellation-record-value-1234567890';

function createActiveRequest(
  overrides = {}
) {
  return {
    userId:
      authenticatedUid,
    status:
      'pending',
    previousProfileVisibility:
      true,
    ...overrides,
  };
}

function createOperation(
  overrides = {}
) {
  return {
    operationKey,
    cancellationRecordId,
    phase:
      'not-started',
    ...overrides,
  };
}

test(
  'a valid active request without prior operation is ready',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        false,
        undefined,
        false
      ),
      {
        status:
          'ready',
        previousProfileVisibility:
          true,
      }
    );
  }
);

test(
  'a ready request preserves false profile visibility',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest({
          previousProfileVisibility:
            false,
        }),
        false,
        undefined,
        false
      ),
      {
        status:
          'ready',
        previousProfileVisibility:
          false,
      }
    );
  }
);

test(
  'a missing profile is classified as profile-not-found',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        false,
        true,
        createActiveRequest(),
        false,
        undefined,
        false
      ),
      {
        status:
          'profile-not-found',
      }
    );
  }
);

test(
  'a missing request without operation is request-not-found',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        false,
        undefined,
        false,
        undefined,
        false
      ),
      {
        status:
          'request-not-found',
      }
    );
  }
);

test(
  'a malformed active request is not cancellable',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        null,
        false,
        undefined,
        false
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'an active request for another user is not cancellable',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest({
          userId:
            'user-two',
        }),
        false,
        undefined,
        false
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'a point of no return remains authoritative',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest({
          status:
            'processing',
          pointOfNoReturnAt:
            {
              seconds:
                1_000,
            },
        }),
        false,
        undefined,
        false
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );
  }
);

test(
  'a non-completed valid operation requires restoration recovery',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        createOperation({
          phase:
            'profile-restored',
        }),
        false
      ),
      {
        status:
          'restoration-pending',
      }
    );
  }
);

test(
  'all valid non-completed phases require restoration recovery',
  () => {
    const pendingPhases = [
      'not-started',
      'restoration-in-progress',
      'profile-restored',
      'cancelled-record-created',
      'active-request-removed',
      'temporary-restoration-data-removed',
    ];

    for (
      const phase of
      pendingPhases
    ) {
      assert.deepEqual(
        evaluateCancellationReadState(
          authenticatedUid,
          true,
          true,
          createActiveRequest(),
          true,
          createOperation({
            phase,
          }),
          false
        ),
        {
          status:
            'restoration-pending',
        }
      );
    }
  }
);

test(
  'a completed operation with its cancelled record is cancelled',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        false,
        undefined,
        true,
        createOperation({
          phase:
            'completed',
        }),
        true
      ),
      {
        status:
          'cancelled',
      }
    );
  }
);

test(
  'a completed operation without its cancelled record is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        false,
        undefined,
        true,
        createOperation({
          phase:
            'completed',
        }),
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a cancelled record without a coordinator is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        false,
        undefined,
        false,
        undefined,
        true
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a malformed coordinator is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        null,
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an unknown coordinator phase is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        createOperation({
          phase:
            'unknown-phase',
        }),
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a coordinator with a short operation key is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        createOperation({
          operationKey:
            'short-key',
        }),
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a coordinator with a short cancellation record id is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        createOperation({
          cancellationRecordId:
            'short-record-id',
        }),
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'equal coordinator identifiers are inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        true,
        createActiveRequest(),
        true,
        createOperation({
          cancellationRecordId:
            operationKey,
        }),
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an empty authenticated uid is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        '',
        true,
        true,
        createActiveRequest(),
        false,
        undefined,
        false
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an existing coordinator takes precedence over a missing profile',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        false,
        false,
        undefined,
        true,
        createOperation({
          phase:
            'profile-restored',
        }),
        false
      ),
      {
        status:
          'restoration-pending',
      }
    );
  }
);

test(
  'an existing completed coordinator returns cancelled after active request removal',
  () => {
    assert.deepEqual(
      evaluateCancellationReadState(
        authenticatedUid,
        true,
        false,
        undefined,
        true,
        createOperation({
          phase:
            'completed',
        }),
        true
      ),
      {
        status:
          'cancelled',
      }
    );
  }
);
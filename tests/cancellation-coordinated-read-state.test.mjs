import assert from 'node:assert/strict';
import {
  test,
} from 'node:test';

import {
  evaluateCoordinatedCancellationReadState,
} from '../functions/lib/cancellation-coordinated-read-state.js';

const authenticatedUid =
  'user-one';

const expectedOperationKey =
  'a'.repeat(64);

const cancellationRecordId =
  'b'.repeat(32);

const requestCreatedAt =
  new Date(
    '2026-09-21T14:00:00.000Z'
  );

const operationStartedAt =
  new Date(
    '2026-09-21T15:00:00.000Z'
  );

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

function createConfirmedRequest(
  overrides = {}
) {
  return createActiveRequest({
    cancellationConfirmedAt:
      new Date(
        operationStartedAt.getTime()
      ),
    cancellationOperationKey:
      expectedOperationKey,
    ...overrides,
  });
}

function createOperation(
  overrides = {}
) {
  const phase =
    overrides.phase ??
    'restoration-in-progress';

  const operation = {
    operationKey:
      expectedOperationKey,
    cancellationRecordId,
    requestCreatedAt:
      new Date(
        requestCreatedAt.getTime()
      ),
    operationStartedAt:
      new Date(
        operationStartedAt.getTime()
      ),
    phase,
  };

  if (
    [
      'cancelled-record-created',
      'active-request-removed',
      'temporary-restoration-data-removed',
      'completed',
    ].includes(
      phase
    )
  ) {
    operation.cancelledAt =
      new Date(
        '2026-09-21T16:00:00.000Z'
      );

    operation.expiresAt =
      new Date(
        '2026-10-21T16:00:00.000Z'
      );
  }

  if (phase === 'completed') {
    operation.operationExpiresAt =
      new Date(
        '2026-10-21T16:00:00.000Z'
      );
  }

  return {
    ...operation,
    ...overrides,
  };
}

function createInput(
  overrides = {}
) {
  return {
    authenticatedUid,
    expectedOperationKey,
    profileExists:
      true,
    activeRequestExists:
      true,
    activeRequestData:
      createActiveRequest(),
    operationExists:
      false,
    operationData:
      undefined,
    cancelledRecordExists:
      false,
    ...overrides,
  };
}

test(
  'an unconfirmed request without a coordinator remains ready',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput()
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
  'a confirmed request without its coordinator is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createConfirmedRequest(),
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
  'an early coordinator requires a confirmed active request',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          operationExists:
            true,
          operationData:
            createOperation(),
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
  'a matching confirmation and early coordinator require restoration',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createConfirmedRequest(),
          operationExists:
            true,
          operationData:
            createOperation(),
        })
      ),
      {
        status:
          'restoration-pending',
      }
    );
  }
);

test(
  'a coordinator with a different lookup key is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createConfirmedRequest(),
          operationExists:
            true,
          operationData:
            createOperation({
              operationKey:
                'c'.repeat(64),
            }),
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
  'different confirmation and operation timestamps are inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createConfirmedRequest({
              cancellationConfirmedAt:
                new Date(
                  '2026-09-21T15:00:01.000Z'
                ),
            }),
          operationExists:
            true,
          operationData:
            createOperation(),
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
  'a point of no return with a cancellation coordinator is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createActiveRequest({
              pointOfNoReturnAt:
                new Date(
                  operationStartedAt.getTime()
                ),
              pointOfNoReturnOperation:
                'authentication',
            }),
          operationExists:
            true,
          operationData:
            createOperation(),
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
  'an early coordinator without its active request is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestExists:
            false,
          activeRequestData:
            undefined,
          operationExists:
            true,
          operationData:
            createOperation({
              phase:
                'profile-restored',
            }),
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
  'a removed-request phase rejects an existing active request',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestData:
            createConfirmedRequest(),
          operationExists:
            true,
          operationData:
            createOperation({
              phase:
                'active-request-removed',
            }),
          cancelledRecordExists:
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
  'a removed-request phase accepts an absent active request',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestExists:
            false,
          activeRequestData:
            undefined,
          operationExists:
            true,
          operationData:
            createOperation({
              phase:
                'active-request-removed',
            }),
          cancelledRecordExists:
            true,
        })
      ),
      {
        status:
          'restoration-pending',
      }
    );
  }
);

test(
  'a completed coordinator with its record returns cancelled',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestExists:
            false,
          activeRequestData:
            undefined,
          operationExists:
            true,
          operationData:
            createOperation({
              phase:
                'completed',
            }),
          cancelledRecordExists:
            true,
        })
      ),
      {
        status:
          'cancelled',
      }
    );
  }
);

test(
  'a completed coordinator without its record is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          activeRequestExists:
            false,
          activeRequestData:
            undefined,
          operationExists:
            true,
          operationData:
            createOperation({
              phase:
                'completed',
            }),
          cancelledRecordExists:
            false,
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
  'the coordinated classifier rejects an invalid expected key',
  () => {
    assert.deepEqual(
      evaluateCoordinatedCancellationReadState(
        createInput({
          expectedOperationKey:
            'short-key',
        })
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);
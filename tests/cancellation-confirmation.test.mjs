import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    CANCELLATION_CONFIRMATION_FIELDS,
    createCancellationConfirmationPlan,
} from '../functions/lib/cancellation-confirmation.js';

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

function createPlan() {
  return createCancellationConfirmationPlan(
    operationKey,
    requestCreatedAt,
    operationStartedAt,
    cancellationRecordId
  );
}

test(
  'the confirmation contract uses the approved protected field names',
  () => {
    assert.deepEqual(
      CANCELLATION_CONFIRMATION_FIELDS,
      {
        confirmedAt:
          'cancellationConfirmedAt',
        operationKey:
          'cancellationOperationKey',
      }
    );
  }
);

test(
  'the confirmation update contains only the protected winner fields',
  () => {
    const plan =
      createPlan();

    assert.deepEqual(
      Object.keys(
        plan.activeRequestUpdate
      ).sort(),
      [
        'cancellationConfirmedAt',
        'cancellationOperationKey',
      ]
    );
  }
);

test(
  'the confirmation timestamp equals the operation start timestamp',
  () => {
    const plan =
      createPlan();

    assert.equal(
      plan.activeRequestUpdate
        .cancellationConfirmedAt
        .toISOString(),
      operationStartedAt.toISOString()
    );

    assert.equal(
      plan.operationState
        .operationStartedAt
        .toISOString(),
      operationStartedAt.toISOString()
    );
  }
);

test(
  'the active request and coordinator use the same operation key',
  () => {
    const plan =
      createPlan();

    assert.equal(
      plan.activeRequestUpdate
        .cancellationOperationKey,
      operationKey
    );

    assert.equal(
      plan.operationState
        .operationKey,
      operationKey
    );
  }
);

test(
  'the initial confirmation begins restoration without completion dates',
  () => {
    const plan =
      createPlan();

    assert.equal(
      plan.operationState.phase,
      'restoration-in-progress'
    );

    assert.equal(
      Object.hasOwn(
        plan.operationState,
        'cancelledAt'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        plan.operationState,
        'expiresAt'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        plan.operationState,
        'operationExpiresAt'
      ),
      false
    );
  }
);

test(
  'the confirmation plan uses independent date objects',
  () => {
    const plan =
      createPlan();

    assert.notEqual(
      plan.activeRequestUpdate
        .cancellationConfirmedAt,
      operationStartedAt
    );

    assert.notEqual(
      plan.operationState
        .operationStartedAt,
      operationStartedAt
    );

    assert.notEqual(
      plan.activeRequestUpdate
        .cancellationConfirmedAt,
      plan.operationState
        .operationStartedAt
    );
  }
);

test(
  'the confirmation plan does not mutate supplied dates',
  () => {
    const suppliedRequestCreatedAt =
      new Date(
        requestCreatedAt.getTime()
      );

    const suppliedOperationStartedAt =
      new Date(
        operationStartedAt.getTime()
      );

    createCancellationConfirmationPlan(
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
  'the confirmation plan rejects an invalid operation start timestamp',
  () => {
    assert.throws(
      () => {
        createCancellationConfirmationPlan(
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
  'the confirmation plan rejects equal internal identifiers',
  () => {
    assert.throws(
      () => {
        createCancellationConfirmationPlan(
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
  'the confirmation plan contains no completion or irreversible fields',
  () => {
    const serialized =
      JSON.stringify(
        createPlan()
      );

    const forbiddenFields = [
      'pointOfNoReturnAt',
      'pointOfNoReturnOperation',
      'cancelledAt',
      'expiresAt',
      'operationExpiresAt',
      'DEL-S2',
      'authentication',
      'messages',
      'conversations',
      'reports',
    ];

    for (
      const field of
      forbiddenFields
    ) {
      assert.equal(
        serialized.includes(
          field
        ),
        false
      );
    }
  }
);
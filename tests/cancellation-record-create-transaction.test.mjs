import assert from 'node:assert/strict';
import {
  createRequire,
} from 'node:module';
import {
  after,
  test,
} from 'node:test';

import {
  confirmCancellationInTransaction,
} from '../functions/lib/cancellation-confirm-transaction.js';

import {
  restoreCancellationProfileInTransaction,
} from '../functions/lib/cancellation-profile-restore-transaction.js';

import {
  createCancellationRecordInTransaction,
} from '../functions/lib/cancellation-record-create-transaction.js';

const requireFromFunctions =
  createRequire(
    new URL(
      '../functions/package.json',
      import.meta.url
    )
  );

const {
  deleteApp,
  getApps,
  initializeApp,
} =
  requireFromFunctions(
    'firebase-admin/app'
  );

const {
  getFirestore,
} =
  requireFromFunctions(
    'firebase-admin/firestore'
  );

const projectId =
  'demo-langbridge-local';

const app =
  getApps().length === 0
    ? initializeApp({
        projectId,
      })
    : getApps()[0];

const firestore =
  getFirestore(app);

const requestCreatedAt =
  new Date(
    '2026-09-22T14:00:00.000Z'
  );

const operationStartedAt =
  new Date(
    '2026-09-22T15:00:00.000Z'
  );

const cancelledAt =
  new Date(
    '2026-09-22T16:00:00.000Z'
  );

const expectedExpiresAt =
  new Date(
    '2026-10-22T16:00:00.000Z'
  );

function createOperationKey(
  character
) {
  return character.repeat(64);
}

function createRecordId(
  character
) {
  return character.repeat(32);
}

function userReference(
  uid
) {
  return firestore
    .collection(
      'users'
    )
    .doc(uid);
}

function activeRequestReference(
  uid
) {
  return firestore
    .collection(
      'accountDeletionRequests'
    )
    .doc(uid);
}

function operationReference(
  operationKey
) {
  return firestore
    .collection(
      'accountDeletionCancellationOperations'
    )
    .doc(operationKey);
}

function cancelledRecordReference(
  cancellationRecordId
) {
  return firestore
    .collection(
      'cancelledDeletionRequests'
    )
    .doc(cancellationRecordId);
}

async function createProfile(
  uid
) {
  await userReference(
    uid
  ).set({
    uid,
    displayName:
      'Preserved profile field',
    isProfileVisible:
      false,
    deletionRequested:
      true,
    deletionRequestedAt:
      new Date(
        requestCreatedAt.getTime()
      ),
  });
}

async function createActiveRequest(
  uid,
  previousProfileVisibility = true
) {
  await activeRequestReference(
    uid
  ).set({
    userId:
      uid,
    status:
      'pending',
    previousProfileVisibility,
    createdAt:
      new Date(
        requestCreatedAt.getTime()
      ),
    updatedAt:
      new Date(
        requestCreatedAt.getTime()
      ),
  });
}

async function prepareRestoredCancellation(
  uid,
  operationKey,
  cancellationRecordId,
  previousProfileVisibility = true
) {
  await createProfile(
    uid
  );

  await createActiveRequest(
    uid,
    previousProfileVisibility
  );

  assert.deepEqual(
    await confirmCancellationInTransaction(
      firestore,
      uid,
      operationKey,
      cancellationRecordId,
      new Date(
        operationStartedAt.getTime()
      )
    ),
    {
      status:
        'confirmed',
    }
  );

  assert.deepEqual(
    await restoreCancellationProfileInTransaction(
      firestore,
      uid,
      operationKey,
      cancellationRecordId
    ),
    {
      status:
        'profile-restored',
    }
  );
}

async function createMinimumRecord(
  uid,
  operationKey,
  cancellationRecordId
) {
  return createCancellationRecordInTransaction(
    firestore,
    uid,
    operationKey,
    cancellationRecordId,
    new Date(
      cancelledAt.getTime()
    )
  );
}

after(
  async () => {
    await deleteApp(
      app
    );
  }
);

test(
  'record creation stores only the minimum record and advances the coordinator',
  async () => {
    const uid =
      'create-cancellation-record-success';

    const operationKey =
      createOperationKey(
        '1'
      );

    const cancellationRecordId =
      createRecordId(
        'a'
      );

    await prepareRestoredCancellation(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'cancelled-record-created',
      }
    );

    const [
      profileSnapshot,
      activeRequestSnapshot,
      operationSnapshot,
      cancelledRecordSnapshot,
    ] =
      await Promise.all([
        userReference(
          uid
        ).get(),
        activeRequestReference(
          uid
        ).get(),
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
      ]);

    assert.equal(
      profileSnapshot.exists,
      true
    );

    assert.equal(
      activeRequestSnapshot.exists,
      true
    );

    assert.equal(
      operationSnapshot.exists,
      true
    );

    assert.equal(
      cancelledRecordSnapshot.exists,
      true
    );

    const operationData =
      operationSnapshot.data();

    const cancelledRecordData =
      cancelledRecordSnapshot.data();

    assert.equal(
      operationData.phase,
      'cancelled-record-created'
    );

    assert.equal(
      operationData
        .cancelledAt
        .toDate()
        .toISOString(),
      cancelledAt.toISOString()
    );

    assert.equal(
      operationData
        .expiresAt
        .toDate()
        .toISOString(),
      expectedExpiresAt.toISOString()
    );

    assert.deepEqual(
      Object.keys(
        cancelledRecordData
      ).sort(),
      [
        'status',
        'cancelledAt',
        'expiresAt',
        'procedureVersion',
        'verificationMethod',
        'restorationResult',
      ].sort()
    );

    assert.equal(
      cancelledRecordData.status,
      'cancelled'
    );

    assert.equal(
      cancelledRecordData
        .procedureVersion,
      'account-deletion-cancellation-v1'
    );

    assert.equal(
      cancelledRecordData
        .verificationMethod,
      'recent-session'
    );

    assert.equal(
      cancelledRecordData
        .restorationResult,
      'restored'
    );

    assert.equal(
      cancelledRecordData
        .cancelledAt
        .toDate()
        .toISOString(),
      cancelledAt.toISOString()
    );

    assert.equal(
      cancelledRecordData
        .expiresAt
        .toDate()
        .toISOString(),
      expectedExpiresAt.toISOString()
    );

    assert.equal(
      operationData
        .cancelledAt
        .toDate()
        .getTime(),
      cancelledRecordData
        .cancelledAt
        .toDate()
        .getTime()
    );

    assert.equal(
      operationData
        .expiresAt
        .toDate()
        .getTime(),
      cancelledRecordData
        .expiresAt
        .toDate()
        .getTime()
    );
  }
);

test(
  'the minimum record contains no identifying or temporary fields',
  async () => {
    const uid =
      'create-cancellation-record-private';

    const operationKey =
      createOperationKey(
        '2'
      );

    const cancellationRecordId =
      createRecordId(
        'b'
      );

    await prepareRestoredCancellation(
      uid,
      operationKey,
      cancellationRecordId,
      false
    );

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'cancelled-record-created',
      }
    );

    const recordSnapshot =
      await cancelledRecordReference(
        cancellationRecordId
      ).get();

    const serialized =
      JSON.stringify(
        recordSnapshot.data()
      );

    const prohibitedValues = [
      'userId',
      'userEmail',
      'email',
      'displayName',
      'previousProfileVisibility',
      'cancellationOperationKey',
      'cancellationRecordId',
      'DEL-S2',
    ];

    for (
      const prohibitedValue of
      prohibitedValues
    ) {
      assert.equal(
        serialized.includes(
          prohibitedValue
        ),
        false
      );
    }

    assert.equal(
      (
        await activeRequestReference(
          uid
        ).get()
      ).exists,
      true
    );
  }
);
test(
  'a retry after record creation performs no additional writes',
  async () => {
    const uid =
      'create-cancellation-record-retry';

    const operationKey =
      createOperationKey(
        '3'
      );

    const cancellationRecordId =
      createRecordId(
        'c'
      );

    await prepareRestoredCancellation(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'cancelled-record-created',
      }
    );

    const [
      operationBefore,
      recordBefore,
      requestBefore,
    ] =
      await Promise.all([
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
        activeRequestReference(
          uid
        ).get(),
      ]);

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'already-created',
      }
    );

    const [
      operationAfter,
      recordAfter,
      requestAfter,
    ] =
      await Promise.all([
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
        activeRequestReference(
          uid
        ).get(),
      ]);

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );
  }
);

test(
  'an existing valid record recovers a coordinator still at profile-restored',
  async () => {
    const uid =
      'create-cancellation-record-recovery';

    const operationKey =
      createOperationKey(
        '4'
      );

    const cancellationRecordId =
      createRecordId(
        'd'
      );

    await prepareRestoredCancellation(
      uid,
      operationKey,
      cancellationRecordId
    );

    await cancelledRecordReference(
      cancellationRecordId
    ).create({
      status:
        'cancelled',
      cancelledAt:
        new Date(
          cancelledAt.getTime()
        ),
      expiresAt:
        new Date(
          expectedExpiresAt.getTime()
        ),
      procedureVersion:
        'account-deletion-cancellation-v1',
      verificationMethod:
        'recent-session',
      restorationResult:
        'restored',
    });

    const recordBefore =
      await cancelledRecordReference(
        cancellationRecordId
      ).get();

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'cancelled-record-recovered',
      }
    );

    const [
      operationAfter,
      recordAfter,
      requestAfter,
    ] =
      await Promise.all([
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
        activeRequestReference(
          uid
        ).get(),
      ]);

    const operationData =
      operationAfter.data();

    assert.equal(
      operationData.phase,
      'cancelled-record-created'
    );

    assert.equal(
      operationData
        .cancelledAt
        .toDate()
        .getTime(),
      cancelledAt.getTime()
    );

    assert.equal(
      operationData
        .expiresAt
        .toDate()
        .getTime(),
      expectedExpiresAt.getTime()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );

    assert.equal(
      requestAfter.exists,
      true
    );
  }
);

test(
  'different coordinator and record dates are inconsistent',
  async () => {
    const uid =
      'create-cancellation-record-date-mismatch';

    const operationKey =
      createOperationKey(
        '5'
      );

    const cancellationRecordId =
      createRecordId(
        'e'
      );

    await prepareRestoredCancellation(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'cancelled-record-created',
      }
    );

    const differentCancelledAt =
      new Date(
        '2026-09-23T16:00:00.000Z'
      );

    const differentExpiresAt =
      new Date(
        '2026-10-23T16:00:00.000Z'
      );

    await cancelledRecordReference(
      cancellationRecordId
    ).set({
      status:
        'cancelled',
      cancelledAt:
        differentCancelledAt,
      expiresAt:
        differentExpiresAt,
      procedureVersion:
        'account-deletion-cancellation-v1',
      verificationMethod:
        'recent-session',
      restorationResult:
        'restored',
    });

    const [
      operationBefore,
      recordBefore,
      requestBefore,
    ] =
      await Promise.all([
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
        activeRequestReference(
          uid
        ).get(),
      ]);

    assert.deepEqual(
      await createMinimumRecord(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'inconsistent-state',
      }
    );

    const [
      operationAfter,
      recordAfter,
      requestAfter,
    ] =
      await Promise.all([
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
        activeRequestReference(
          uid
        ).get(),
      ]);

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );
  }
);
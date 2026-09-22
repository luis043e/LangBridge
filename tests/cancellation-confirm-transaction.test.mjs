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

const operationKey =
  'a'.repeat(64);

const cancellationRecordId =
  'b'.repeat(32);

const requestCreatedAt =
  new Date(
    '2026-09-22T14:00:00.000Z'
  );

const operationStartedAt =
  new Date(
    '2026-09-22T15:00:00.000Z'
  );

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
  key = operationKey
) {
  return firestore
    .collection(
      'accountDeletionCancellationOperations'
    )
    .doc(key);
}

async function createProfile(
  uid
) {
  await userReference(
    uid
  ).set({
    uid,
    isProfileVisible:
      false,
    deletionRequested:
      true,
  });
}

async function createActiveRequest(
  uid,
  overrides = {}
) {
  await activeRequestReference(
    uid
  ).set({
    userId:
      uid,
    status:
      'pending',
    previousProfileVisibility:
      true,
    createdAt:
      new Date(
        requestCreatedAt.getTime()
      ),
    updatedAt:
      new Date(
        requestCreatedAt.getTime()
      ),
    ...overrides,
  });
}

async function confirm(
  uid,
  overrides = {}
) {
  return confirmCancellationInTransaction(
    firestore,
    uid,
    overrides.operationKey ??
      operationKey,
    overrides.cancellationRecordId ??
      cancellationRecordId,
    overrides.operationStartedAt ??
      new Date(
        operationStartedAt.getTime()
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
  'confirmation atomically updates the request and creates the coordinator',
  async () => {
    const uid =
      'confirm-transaction-success';

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid
    );

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'confirmed',
      }
    );

    const [
      requestSnapshot,
      operationSnapshot,
    ] =
      await Promise.all([
        activeRequestReference(
          uid
        ).get(),
        operationReference().get(),
      ]);

    assert.equal(
      requestSnapshot.exists,
      true
    );

    assert.equal(
      operationSnapshot.exists,
      true
    );

    const requestData =
      requestSnapshot.data();

    const operationData =
      operationSnapshot.data();

    assert.equal(
      requestData
        .cancellationOperationKey,
      operationKey
    );

    assert.equal(
      operationData.operationKey,
      operationKey
    );

    assert.equal(
      operationData
        .cancellationRecordId,
      cancellationRecordId
    );

    assert.equal(
      operationData.phase,
      'restoration-in-progress'
    );

    assert.equal(
      requestData
        .cancellationConfirmedAt
        .toDate()
        .toISOString(),
      operationStartedAt.toISOString()
    );

    assert.equal(
      operationData
        .operationStartedAt
        .toDate()
        .toISOString(),
      operationStartedAt.toISOString()
    );

    assert.equal(
      operationData
        .requestCreatedAt
        .toDate()
        .toISOString(),
      requestCreatedAt.toISOString()
    );

    assert.equal(
      requestData
        .cancellationConfirmedAt
        .toDate()
        .getTime(),
      operationData
        .operationStartedAt
        .toDate()
        .getTime()
    );
  }
);

test(
  'a retry after confirmation performs no duplicate creation',
  async () => {
    const uid =
      'confirm-transaction-retry';

    await operationReference().delete();

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid
    );

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'confirmed',
      }
    );

    const operationBefore =
      await operationReference().get();

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'already-confirmed',
      }
    );

    const operationAfter =
      await operationReference().get();

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );
  }
);


test(
  'an invalid request creation timestamp writes nothing',
  async () => {
    const uid =
      'confirm-transaction-invalid-created-at';

    await operationReference().delete();

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid,
      {
        createdAt:
          'invalid-date',
      }
    );

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'inconsistent-state',
      }
    );

    const requestAfter =
      await activeRequestReference(
        uid
      ).get();

    const operationAfter =
      await operationReference().get();

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.equal(
      operationAfter.exists,
      false
    );
  }
);

test(
  'the point of no return prevents both confirmation writes',
  async () => {
    const uid =
      'confirm-transaction-point-of-no-return';

    await operationReference().delete();

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid,
      {
        status:
          'processing',
        pointOfNoReturnAt:
          new Date(
            operationStartedAt.getTime()
          ),
        pointOfNoReturnOperation:
          'delete-authentication',
      }
    );

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );

    const requestAfter =
      await activeRequestReference(
        uid
      ).get();

    const operationAfter =
      await operationReference().get();

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.equal(
      operationAfter.exists,
      false
    );
  }
);

test(
  'a missing profile prevents both confirmation writes',
  async () => {
    const uid =
      'confirm-transaction-missing-profile';

    await operationReference().delete();

    await createActiveRequest(
      uid
    );

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'profile-not-found',
      }
    );

    const requestAfter =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.equal(
      (
        await operationReference().get()
      ).exists,
      false
    );
  }
);

test(
  'a missing active request creates no coordinator',
  async () => {
    const uid =
      'confirm-transaction-missing-request';

    await operationReference().delete();

    await createProfile(
      uid
    );

    assert.deepEqual(
      await confirm(
        uid
      ),
      {
        status:
          'request-not-found',
      }
    );

    assert.equal(
      (
        await operationReference().get()
      ).exists,
      false
    );
  }
);

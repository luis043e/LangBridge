import assert from 'node:assert/strict';
import {
  createRequire,
} from 'node:module';
import {
  after,
  test,
} from 'node:test';

import {
  readCancellationStateInTransaction,
} from '../functions/lib/cancellation-transaction.js';

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

const opaqueLookupKey =
  'a'.repeat(64);

const candidateCancellationRecordId =
  'b'.repeat(32);

const storedCancellationRecordId =
  'c'.repeat(32);

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

function operationReference() {
  return firestore
    .collection(
      'accountDeletionCancellationOperations'
    )
    .doc(
      opaqueLookupKey
    );
}

function cancelledRecordReference(
  cancellationRecordId
) {
  return firestore
    .collection(
      'cancelledDeletionRequests'
    )
    .doc(
      cancellationRecordId
    );
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
    ...overrides,
  });
}

async function createOperation(
  overrides = {}
) {
  const phase =
    overrides.phase ??
    'restoration-in-progress';

  const operation = {
    operationKey:
      opaqueLookupKey,
    cancellationRecordId:
      storedCancellationRecordId,
    requestCreatedAt:
      new Date(
        '2026-09-20T14:00:00.000Z'
      ),
    operationStartedAt:
      new Date(
        '2026-09-20T15:00:00.000Z'
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
        '2026-09-20T16:00:00.000Z'
      );

    operation.expiresAt =
      new Date(
        '2026-10-20T16:00:00.000Z'
      );
  }

  if (phase === 'completed') {
    operation.operationExpiresAt =
      new Date(
        '2026-10-20T16:00:00.000Z'
      );
  }

  await operationReference().set({
    ...operation,
    ...overrides,
  });
}

async function readState(
  uid
) {
  return readCancellationStateInTransaction(
    firestore,
    uid,
    opaqueLookupKey,
    candidateCancellationRecordId
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
  'the read transaction returns ready for a valid active request',
  async () => {
    const uid =
      'transaction-ready-user';

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid
    );

    assert.deepEqual(
      await readState(
        uid
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
  'the read transaction preserves false previous visibility',
  async () => {
    const uid =
      'transaction-hidden-user';

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid,
      {
        previousProfileVisibility:
          false,
      }
    );

    assert.deepEqual(
      await readState(
        uid
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
  'the read transaction returns profile-not-found when the profile is absent',
  async () => {
    const uid =
      'transaction-missing-profile';

    await createActiveRequest(
      uid
    );

    assert.deepEqual(
      await readState(
        uid
      ),
      {
        status:
          'profile-not-found',
      }
    );
  }
);

test(
  'the read transaction preserves the point of no return',
  async () => {
    const uid =
      'transaction-point-of-no-return';

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
        '2026-09-20T15:00:00.000Z'
      ),
    pointOfNoReturnOperation:
      'delete-authentication',
  }
);

    assert.deepEqual(
      await readState(
        uid
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );
  }
);

test(
  'the read transaction returns restoration-pending for an incomplete operation',
  async () => {
    const uid =
      'transaction-restoration-pending';

    await createProfile(
      uid
    );

    await createActiveRequest(
  uid,
  {
    cancellationConfirmedAt:
      new Date(
        '2026-09-20T15:00:00.000Z'
      ),
    cancellationOperationKey:
      opaqueLookupKey,
  }
);

    await createOperation({
      phase:
        'profile-restored',
    });

    assert.deepEqual(
      await readState(
        uid
      ),
      {
        status:
          'restoration-pending',
      }
    );
  }
);

test(
  'the stored cancellation record id prevails over the candidate id',
  async () => {
    const uid =
      'transaction-stored-record-id';

    await createProfile(
      uid
    );

    await createOperation({
      phase:
        'completed',
    });

    await cancelledRecordReference(
      storedCancellationRecordId
    ).set({
      status:
        'cancelled',
    });

    assert.deepEqual(
      await readState(
        uid
      ),
      {
        status:
          'cancelled',
      }
    );

    const candidateSnapshot =
      await cancelledRecordReference(
        candidateCancellationRecordId
      ).get();

    assert.equal(
      candidateSnapshot.exists,
      false
    );
  }
);

test(
  'a completed operation without its stored record is inconsistent',
  async () => {
    const uid =
      'transaction-missing-cancelled-record';

    await createProfile(
      uid
    );

    await createOperation({
      phase:
        'completed',
      cancellationRecordId:
        'd'.repeat(32),
    });

    assert.deepEqual(
      await readState(
        uid
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'the transaction does not modify the documents it reads',
  async () => {
    const uid =
      'transaction-read-only-user';

    await operationReference().delete();

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid,
      {
        previousProfileVisibility:
          false,
      }
    );

    const profileBefore =
      await userReference(
        uid
      ).get();

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    const result =
      await readState(
        uid
      );

    const profileAfter =
      await userReference(
        uid
      ).get();

    const requestAfter =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      result,
      {
        status:
          'ready',
        previousProfileVisibility:
          false,
      }
    );

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

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

    assert.equal(
      (
        await cancelledRecordReference(
          candidateCancellationRecordId
        ).get()
      ).exists,
      false
    );
  }
);
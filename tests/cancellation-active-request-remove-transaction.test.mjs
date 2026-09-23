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

import {
    removeActiveCancellationRequestInTransaction,
} from '../functions/lib/cancellation-active-request-remove-transaction.js';

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
  uid
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
  });
}

async function prepareCreatedRecord(
  uid,
  operationKey,
  cancellationRecordId
) {
  await createProfile(
    uid
  );

  await createActiveRequest(
    uid
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

  assert.deepEqual(
    await createCancellationRecordInTransaction(
      firestore,
      uid,
      operationKey,
      cancellationRecordId,
      new Date(
        cancelledAt.getTime()
      )
    ),
    {
      status:
        'cancelled-record-created',
    }
  );
}

async function removeActiveRequest(
  uid,
  operationKey,
  cancellationRecordId
) {
  return removeActiveCancellationRequestInTransaction(
    firestore,
    uid,
    operationKey,
    cancellationRecordId
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
  'active request removal deletes only the request and advances the coordinator',
  async () => {
    const uid =
      'remove-active-request-success';

    const operationKey =
      createOperationKey(
        '1'
      );

    const cancellationRecordId =
      createRecordId(
        'a'
      );

    await prepareCreatedRecord(
      uid,
      operationKey,
      cancellationRecordId
    );

    const profileBefore =
      await userReference(
        uid
      ).get();

    const recordBefore =
      await cancelledRecordReference(
        cancellationRecordId
      ).get();

    assert.deepEqual(
      await removeActiveRequest(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'active-request-removed',
      }
    );

    const [
      profileAfter,
      requestAfter,
      operationAfter,
      recordAfter,
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
      requestAfter.exists,
      false
    );

    assert.equal(
      operationAfter.data().phase,
      'active-request-removed'
    );

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );
  }
);

test(
  'a retry after active request removal performs no additional writes',
  async () => {
    const uid =
      'remove-active-request-retry';

    const operationKey =
      createOperationKey(
        '2'
      );

    const cancellationRecordId =
      createRecordId(
        'b'
      );

    await prepareCreatedRecord(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await removeActiveRequest(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'active-request-removed',
      }
    );

    const [
      profileBefore,
      operationBefore,
      recordBefore,
    ] =
      await Promise.all([
        userReference(
          uid
        ).get(),
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
      ]);

    assert.deepEqual(
      await removeActiveRequest(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'already-removed',
      }
    );

    const [
      profileAfter,
      requestAfter,
      operationAfter,
      recordAfter,
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
      requestAfter.exists,
      false
    );

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );
  }
);

test(
  'a missing request before the approved phase is inconsistent',
  async () => {
    const uid =
      'remove-active-request-missing-too-early';

    const operationKey =
      createOperationKey(
        '3'
      );

    const cancellationRecordId =
      createRecordId(
        'c'
      );

    await prepareCreatedRecord(
      uid,
      operationKey,
      cancellationRecordId
    );

    await activeRequestReference(
      uid
    ).delete();

    const [
      profileBefore,
      operationBefore,
      recordBefore,
    ] =
      await Promise.all([
        userReference(
          uid
        ).get(),
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
      ]);

    assert.deepEqual(
      await removeActiveRequest(
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
      profileAfter,
      operationAfter,
      recordAfter,
    ] =
      await Promise.all([
        userReference(
          uid
        ).get(),
        operationReference(
          operationKey
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
      ]);

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );

    assert.deepEqual(
      recordAfter.data(),
      recordBefore.data()
    );
  }
);

test(
  'a malformed cancellation record prevents request removal',
  async () => {
    const uid =
      'remove-active-request-malformed-record';

    const operationKey =
      createOperationKey(
        '4'
      );

    const cancellationRecordId =
      createRecordId(
        'd'
      );

    await prepareCreatedRecord(
      uid,
      operationKey,
      cancellationRecordId
    );

    await cancelledRecordReference(
      cancellationRecordId
    ).update({
      userId:
        uid,
    });

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    const operationBefore =
      await operationReference(
        operationKey
      ).get();

    assert.deepEqual(
      await removeActiveRequest(
        uid,
        operationKey,
        cancellationRecordId
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
      await operationReference(
        operationKey
      ).get();

    assert.equal(
      requestAfter.exists,
      true
    );

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );
  }
);
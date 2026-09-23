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

import {
    removeTemporaryRestorationDataInTransaction,
} from '../functions/lib/cancellation-temporary-data-remove-transaction.js';

import {
    completeCancellationOperationInTransaction,
} from '../functions/lib/cancellation-operation-complete-transaction.js';

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

async function prepareTemporaryDataRemoved(
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

  assert.deepEqual(
    await removeActiveCancellationRequestInTransaction(
      firestore,
      uid,
      operationKey,
      cancellationRecordId
    ),
    {
      status:
        'active-request-removed',
    }
  );

  assert.deepEqual(
    await removeTemporaryRestorationDataInTransaction(
      firestore,
      uid,
      operationKey,
      cancellationRecordId
    ),
    {
      status:
        'temporary-restoration-data-removed',
    }
  );
}

async function completeOperation(
  uid,
  operationKey,
  cancellationRecordId
) {
  return completeCancellationOperationInTransaction(
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
  'completion advances the coordinator and preserves retained documents',
  async () => {
    const uid =
      'complete-cancellation-success';

    const operationKey =
      createOperationKey(
        '1'
      );

    const cancellationRecordId =
      createRecordId(
        'a'
      );

    await prepareTemporaryDataRemoved(
      uid,
      operationKey,
      cancellationRecordId
    );

    const [
      profileBefore,
      recordBefore,
    ] =
      await Promise.all([
        userReference(
          uid
        ).get(),
        cancelledRecordReference(
          cancellationRecordId
        ).get(),
      ]);

    assert.deepEqual(
      await completeOperation(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
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

    const operationData =
      operationAfter.data();

    assert.equal(
      requestAfter.exists,
      false
    );

    assert.equal(
      operationData.phase,
      'completed'
    );

    assert.equal(
      operationData
        .operationExpiresAt
        .toDate()
        .toISOString(),
      expectedExpiresAt.toISOString()
    );

    assert.equal(
      operationData
        .operationExpiresAt
        .toDate()
        .getTime(),
      operationData
        .expiresAt
        .toDate()
        .getTime()
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
  'a completion retry performs no additional writes',
  async () => {
    const uid =
      'complete-cancellation-retry';

    const operationKey =
      createOperationKey(
        '2'
      );

    const cancellationRecordId =
      createRecordId(
        'b'
      );

    await prepareTemporaryDataRemoved(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await completeOperation(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
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
      await completeOperation(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'already-completed',
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
  'an incorrect operation expiry makes a completed retry inconsistent',
  async () => {
    const uid =
      'complete-cancellation-invalid-expiry';

    const operationKey =
      createOperationKey(
        '3'
      );

    const cancellationRecordId =
      createRecordId(
        'c'
      );

    await prepareTemporaryDataRemoved(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await completeOperation(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
      }
    );

    await operationReference(
      operationKey
    ).update({
      operationExpiresAt:
        new Date(
          '2026-10-21T16:00:00.000Z'
        ),
    });

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
      await completeOperation(
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
  'a recreated active request prevents completion',
  async () => {
    const uid =
      'complete-cancellation-recreated-request';

    const operationKey =
      createOperationKey(
        '4'
      );

    const cancellationRecordId =
      createRecordId(
        'd'
      );

    await prepareTemporaryDataRemoved(
      uid,
      operationKey,
      cancellationRecordId
    );

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

    const [
      requestBefore,
      operationBefore,
      recordBefore,
    ] =
      await Promise.all([
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

    assert.deepEqual(
      await completeOperation(
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
      requestAfter,
      operationAfter,
      recordAfter,
    ] =
      await Promise.all([
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

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
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
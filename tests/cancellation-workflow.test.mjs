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
    runCancellationWorkflow,
} from '../functions/lib/cancellation-workflow.js';

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
  uid,
  isProfileVisible = true
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
    expectedRestoredVisibility:
      isProfileVisible,
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

async function prepareReadyCancellation(
  uid,
  previousProfileVisibility = true
) {
  await createProfile(
    uid,
    previousProfileVisibility
  );

  await createActiveRequest(
    uid,
    previousProfileVisibility
  );
}

async function runWorkflow(
  uid,
  operationKey,
  cancellationRecordId
) {
  return runCancellationWorkflow(
    firestore,
    uid,
    operationKey,
    cancellationRecordId,
    new Date(
      operationStartedAt.getTime()
    ),
    new Date(
      cancelledAt.getTime()
    )
  );
}

async function prepareProfileRestored(
  uid,
  operationKey,
  cancellationRecordId
) {
  await prepareReadyCancellation(
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
}

after(
  async () => {
    await deleteApp(
      app
    );
  }
);

test(
  'the workflow completes all six phases from a ready request',
  async () => {
    const uid =
      'workflow-complete-from-ready';

    const operationKey =
      createOperationKey(
        '1'
      );

    const cancellationRecordId =
      createRecordId(
        'a'
      );

    await prepareReadyCancellation(
      uid,
      true
    );

    assert.deepEqual(
      await runWorkflow(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
        stepsExecuted:
          6,
      }
    );

    const [
      profileSnapshot,
      requestSnapshot,
      operationSnapshot,
      recordSnapshot,
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

    const profileData =
      profileSnapshot.data();

    const operationData =
      operationSnapshot.data();

    const recordData =
      recordSnapshot.data();

    assert.equal(
      profileSnapshot.exists,
      true
    );

    assert.equal(
      profileData.isProfileVisible,
      true
    );

    assert.equal(
      Object.hasOwn(
        profileData,
        'deletionRequested'
      ),
      false
    );

    assert.equal(
      Object.hasOwn(
        profileData,
        'deletionRequestedAt'
      ),
      false
    );

    assert.equal(
      requestSnapshot.exists,
      false
    );

    assert.equal(
      operationData.phase,
      'completed'
    );

    assert.equal(
      recordSnapshot.exists,
      true
    );

    assert.equal(
      recordData.status,
      'cancelled'
    );

    assert.equal(
      operationData
        .operationExpiresAt
        .toDate()
        .toISOString(),
      expectedExpiresAt.toISOString()
    );

    assert.equal(
      recordData
        .expiresAt
        .toDate()
        .toISOString(),
      expectedExpiresAt.toISOString()
    );
  }
);

test(
  'the workflow resumes from profile-restored in four steps',
  async () => {
    const uid =
      'workflow-resume-profile-restored';

    const operationKey =
      createOperationKey(
        '2'
      );

    const cancellationRecordId =
      createRecordId(
        'b'
      );

    await prepareProfileRestored(
      uid,
      operationKey,
      cancellationRecordId
    );

    assert.deepEqual(
      await runWorkflow(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
        stepsExecuted:
          4,
      }
    );

    const operationSnapshot =
      await operationReference(
        operationKey
      ).get();

    assert.equal(
      operationSnapshot.data().phase,
      'completed'
    );

    assert.equal(
      (
        await activeRequestReference(
          uid
        ).get()
      ).exists,
      false
    );

    assert.equal(
      (
        await cancelledRecordReference(
          cancellationRecordId
        ).get()
      ).exists,
      true
    );
  }
);

test(
  'the workflow returns completed with zero steps after completion',
  async () => {
    const uid =
      'workflow-already-completed';

    const operationKey =
      createOperationKey(
        '3'
      );

    const cancellationRecordId =
      createRecordId(
        'c'
      );

    await prepareReadyCancellation(
      uid
    );

    assert.deepEqual(
      await runWorkflow(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
        stepsExecuted:
          6,
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
      await runWorkflow(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'completed',
        stepsExecuted:
          0,
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
  'the workflow stops before writing when the stored record id is contradictory',
  async () => {
    const uid =
      'workflow-contradictory-record-id';

    const operationKey =
      createOperationKey(
        '4'
      );

    const cancellationRecordId =
      createRecordId(
        'd'
      );

    await prepareProfileRestored(
      uid,
      operationKey,
      cancellationRecordId
    );

    await operationReference(
      operationKey
    ).update({
      cancellationRecordId:
        createRecordId(
          'e'
        ),
    });

    const [
      profileBefore,
      requestBefore,
      operationBefore,
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
      ]);

    assert.deepEqual(
      await runWorkflow(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'inconsistent-state',
        stepsExecuted:
          0,
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

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );

    assert.equal(
      recordAfter.exists,
      false
    );
  }
);
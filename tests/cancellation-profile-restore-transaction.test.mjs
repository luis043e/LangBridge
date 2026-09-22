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
  previousProfileVisibility
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

async function confirm(
  uid,
  operationKey,
  cancellationRecordId
) {
  return confirmCancellationInTransaction(
    firestore,
    uid,
    operationKey,
    cancellationRecordId,
    new Date(
      operationStartedAt.getTime()
    )
  );
}

async function restore(
  uid,
  operationKey,
  cancellationRecordId
) {
  return restoreCancellationProfileInTransaction(
    firestore,
    uid,
    operationKey,
    cancellationRecordId
  );
}

async function prepareConfirmedCancellation(
  uid,
  operationKey,
  cancellationRecordId,
  previousProfileVisibility
) {
  await createProfile(
    uid
  );

  await createActiveRequest(
    uid,
    previousProfileVisibility
  );

  assert.deepEqual(
    await confirm(
      uid,
      operationKey,
      cancellationRecordId
    ),
    {
      status:
        'confirmed',
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
  'restoration restores a previously visible profile and advances the phase',
  async () => {
    const uid =
      'restore-visible-profile';

    const operationKey =
      createOperationKey(
        '1'
      );

    const cancellationRecordId =
      createRecordId(
        'a'
      );

    await prepareConfirmedCancellation(
      uid,
      operationKey,
      cancellationRecordId,
      true
    );

    assert.deepEqual(
      await restore(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'profile-restored',
      }
    );

    const [
      profileSnapshot,
      requestSnapshot,
      operationSnapshot,
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

    const profileData =
      profileSnapshot.data();

    const operationData =
      operationSnapshot.data();

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
      profileData.displayName,
      'Preserved profile field'
    );

    assert.equal(
      requestSnapshot.exists,
      true
    );

    assert.equal(
      operationData.phase,
      'profile-restored'
    );
  }
);

test(
  'restoration preserves a previously hidden profile',
  async () => {
    const uid =
      'restore-hidden-profile';

    const operationKey =
      createOperationKey(
        '2'
      );

    const cancellationRecordId =
      createRecordId(
        'b'
      );

    await prepareConfirmedCancellation(
      uid,
      operationKey,
      cancellationRecordId,
      false
    );

    assert.deepEqual(
      await restore(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'profile-restored',
      }
    );

    const profileSnapshot =
      await userReference(
        uid
      ).get();

    const profileData =
      profileSnapshot.data();

    assert.equal(
      profileData.isProfileVisible,
      false
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
  }
);

test(
  'a restoration retry performs no additional changes',
  async () => {
    const uid =
      'restore-profile-retry';

    const operationKey =
      createOperationKey(
        '3'
      );

    const cancellationRecordId =
      createRecordId(
        'c'
      );

    await prepareConfirmedCancellation(
      uid,
      operationKey,
      cancellationRecordId,
      true
    );

    assert.deepEqual(
      await restore(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'profile-restored',
      }
    );

    const profileBefore =
      await userReference(
        uid
      ).get();

    const operationBefore =
      await operationReference(
        operationKey
      ).get();

    assert.deepEqual(
      await restore(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'already-restored',
      }
    );

    const profileAfter =
      await userReference(
        uid
      ).get();

    const operationAfter =
      await operationReference(
        operationKey
      ).get();

    assert.deepEqual(
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );
  }
);

test(
  'restoration without a coordinator writes nothing',
  async () => {
    const uid =
      'restore-missing-coordinator';

    const operationKey =
      createOperationKey(
        '4'
      );

    const cancellationRecordId =
      createRecordId(
        'd'
      );

    await createProfile(
      uid
    );

    await createActiveRequest(
      uid,
      true
    );

    const profileBefore =
      await userReference(
        uid
      ).get();

    const requestBefore =
      await activeRequestReference(
        uid
      ).get();

    assert.deepEqual(
      await restore(
        uid,
        operationKey,
        cancellationRecordId
      ),
      {
        status:
          'inconsistent-state',
      }
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
      profileAfter.data(),
      profileBefore.data()
    );

    assert.deepEqual(
      requestAfter.data(),
      requestBefore.data()
    );

    assert.equal(
      (
        await operationReference(
          operationKey
        ).get()
      ).exists,
      false
    );
  }
);
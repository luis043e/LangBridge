import assert from 'node:assert/strict';
import {
    createRequire,
} from 'node:module';
import {
    after,
    test,
} from 'node:test';

import {
    createCancellationOperationLookupKey,
} from '../functions/lib/cancellation-operation-key.js';

import {
    runCancellationCallableWorkflow,
} from '../functions/lib/cancellation-callable-runner.js';

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

const secret =
  'langbridge-local-cancellation-secret-1234567890';

const requestCreatedAt =
  new Date(
    '2026-09-22T14:00:00.000Z'
  );

const requestedAt =
  new Date(
    '2026-09-22T16:00:00.000Z'
  );

function activeRequestReference(
  uid
) {
  return firestore
    .collection(
      'accountDeletionRequests'
    )
    .doc(uid);
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

function operationReference(
  uid
) {
  const operationKey =
    createCancellationOperationLookupKey(
      uid,
      secret
    );

  return firestore
    .collection(
      'accountDeletionCancellationOperations'
    )
    .doc(operationKey);
}

async function prepareReadyCancellation(
  uid,
  previousProfileVisibility = true
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

async function runCallable(
  uid
) {
  return runCancellationCallableWorkflow(
    firestore,
    uid,
    secret,
    new Date(
      requestedAt.getTime()
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
  'the callable runner completes a ready cancellation',
  async () => {
    const uid =
      'callable-runner-complete';

    await prepareReadyCancellation(
      uid,
      true
    );

    assert.deepEqual(
      await runCallable(
        uid
      ),
      {
        status:
          'completed',
      }
    );

    const operationSnapshot =
      await operationReference(
        uid
      ).get();

    assert.equal(
      operationSnapshot.exists,
      true
    );

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
  }
);

test(
  'a completed cancellation returns only the public completed status',
  async () => {
    const uid =
      'callable-runner-completed-retry';

    await prepareReadyCancellation(
      uid
    );

    assert.deepEqual(
      await runCallable(
        uid
      ),
      {
        status:
          'completed',
      }
    );

    const operationBefore =
      await operationReference(
        uid
      ).get();

    const result =
      await runCallable(
        uid
      );

    assert.deepEqual(
      result,
      {
        status:
          'completed',
      }
    );

    assert.deepEqual(
      Object.keys(
        result
      ),
      [
        'status',
      ]
    );

    const operationAfter =
      await operationReference(
        uid
      ).get();

    assert.deepEqual(
      operationAfter.data(),
      operationBefore.data()
    );
  }
);

test(
  'a missing active request is publicly not cancellable',
  async () => {
    const uid =
      'callable-runner-request-missing';

    await userReference(
      uid
    ).set({
      uid,
      displayName:
        'Existing profile',
      isProfileVisible:
        true,
    });

    assert.deepEqual(
      await runCallable(
        uid
      ),
      {
        status:
          'not-cancellable',
      }
    );

    assert.equal(
      (
        await operationReference(
          uid
        ).get()
      ).exists,
      false
    );
  }
);

test(
  'a missing profile produces the closed profile-not-found result',
  async () => {
    const uid =
      'callable-runner-profile-missing';

    assert.deepEqual(
      await runCallable(
        uid
      ),
      {
        status:
          'profile-not-found',
      }
    );

    assert.equal(
      (
        await operationReference(
          uid
        ).get()
      ).exists,
      false
    );
  }
);

test(
  'a contradictory coordinator produces no exposed identifiers',
  async () => {
    const uid =
      'callable-runner-inconsistent';

    await prepareReadyCancellation(
      uid
    );

    const operationKey =
      createCancellationOperationLookupKey(
        uid,
        secret
      );

    await operationReference(
      uid
    ).set({
      operationKey:
        'f'.repeat(
          64
        ),
      cancellationRecordId:
        'a'.repeat(
          32
        ),
      phase:
        'restoration-in-progress',
    });

    const result =
      await runCallable(
        uid
      );

    assert.deepEqual(
      result,
      {
        status:
          'inconsistent-state',
      }
    );

    const serialized =
      JSON.stringify(
        result
      );

    assert.equal(
      serialized.includes(
        uid
      ),
      false
    );

    assert.equal(
      serialized.includes(
        operationKey
      ),
      false
    );

    assert.equal(
  serialized.includes(
    'a'.repeat(
      32
    )
  ),
  false
);
  }
);
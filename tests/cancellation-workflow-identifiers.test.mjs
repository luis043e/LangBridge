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
  resolveCancellationWorkflowIdentifiers,
} from '../functions/lib/cancellation-workflow-identifiers.js';

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

function operationReference(
  opaqueLookupKey
) {
  return firestore
    .collection(
      'accountDeletionCancellationOperations'
    )
    .doc(
      opaqueLookupKey
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
  'a missing coordinator produces new valid identifiers',
  async () => {
    const uid =
      'identifier-resolver-new';

    const result =
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      );

    assert.equal(
      result.status,
      'new'
    );

    assert.match(
      result.opaqueLookupKey,
      /^[a-f0-9]{64}$/
    );

    assert.match(
      result.cancellationRecordId,
      /^[A-Za-z0-9_-]{32}$/
    );

    assert.notEqual(
      result.opaqueLookupKey,
      result.cancellationRecordId
    );

    assert.equal(
      result.opaqueLookupKey,
      createCancellationOperationLookupKey(
        uid,
        secret
      )
    );
  }
);

test(
  'an existing coordinator reuses its cancellation record id',
  async () => {
    const uid =
      'identifier-resolver-existing';

    const opaqueLookupKey =
      createCancellationOperationLookupKey(
        uid,
        secret
      );

    const cancellationRecordId =
      'a'.repeat(
        32
      );

    await operationReference(
      opaqueLookupKey
    ).set({
      operationKey:
        opaqueLookupKey,
      cancellationRecordId,
      phase:
        'restoration-in-progress',
    });

    assert.deepEqual(
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      ),
      {
        status:
          'existing',
        opaqueLookupKey,
        cancellationRecordId,
      }
    );
  }
);

test(
  'the lookup key remains stable for repeated calls',
  async () => {
    const uid =
      'identifier-resolver-stable';

    const first =
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      );

    const second =
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      );

    assert.equal(
      first.status,
      'new'
    );

    assert.equal(
      second.status,
      'new'
    );

    assert.equal(
      first.opaqueLookupKey,
      second.opaqueLookupKey
    );

    assert.notEqual(
      first.cancellationRecordId,
      second.cancellationRecordId
    );
  }
);

test(
  'a coordinator with a different operation key is inconsistent',
  async () => {
    const uid =
      'identifier-resolver-key-mismatch';

    const opaqueLookupKey =
      createCancellationOperationLookupKey(
        uid,
        secret
      );

    await operationReference(
      opaqueLookupKey
    ).set({
      operationKey:
        'f'.repeat(
          64
        ),
      cancellationRecordId:
        'b'.repeat(
          32
        ),
      phase:
        'restoration-in-progress',
    });

    assert.deepEqual(
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a malformed persisted record id is inconsistent',
  async () => {
    const uid =
      'identifier-resolver-malformed-record';

    const opaqueLookupKey =
      createCancellationOperationLookupKey(
        uid,
        secret
      );

    await operationReference(
      opaqueLookupKey
    ).set({
      operationKey:
        opaqueLookupKey,
      cancellationRecordId:
        'invalid/id',
      phase:
        'restoration-in-progress',
    });

    assert.deepEqual(
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a malformed coordinator is inconsistent',
  async () => {
    const uid =
      'identifier-resolver-malformed-operation';

    const opaqueLookupKey =
      createCancellationOperationLookupKey(
        uid,
        secret
      );

    await operationReference(
      opaqueLookupKey
    ).set({
      unexpected:
        true,
    });

    assert.deepEqual(
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        uid,
        secret
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);
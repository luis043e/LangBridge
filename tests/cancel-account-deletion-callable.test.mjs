import assert from 'node:assert/strict';
import {
  readFile,
} from 'node:fs/promises';
import {
  createRequire,
} from 'node:module';
import {
  test,
} from 'node:test';

import {
  createCancellationOperationLookupKey,
} from '../functions/lib/cancellation-operation-key.js';

const projectId =
  'demo-langbridge-local';

const authUrl =
  'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key';

const functionUrl =
  `http://127.0.0.1:5001/${projectId}/us-central1/cancelAccountDeletion`;

const firestoreBaseUrl =
  `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents`;

const requestCreatedAt =
  new Date(
    '2026-09-22T14:00:00.000Z'
  );

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

const app =
  getApps().length === 0
    ? initializeApp({
        projectId,
      })
    : getApps()[0];

const firestore =
  getFirestore(app);

async function readLocalSecret() {
  const content =
    await readFile(
      new URL(
        '../functions/.secret.local',
        import.meta.url
      ),
      'utf8'
    );

    const normalizedContent =
    content.replace(
      /^\uFEFF/u,
      ''
    );

  const line =
    normalizedContent
      .split(/\r?\n/u)
      .find(
        (candidate) =>
          candidate.startsWith(
            'CANCELLATION_OPERATION_SECRET='
          )
      );

  assert.notEqual(
    line,
    undefined
  );

  const secret =
    line.slice(
      'CANCELLATION_OPERATION_SECRET='
        .length
    );

  assert.equal(
    secret.length >= 32,
    true
  );

  return secret;
}

async function createEmulatorUser(
  email
) {
  const response =
    await fetch(
      authUrl,
      {
        method:
          'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body:
          JSON.stringify({
            email,
            password:
              'LocalTestPassword123!',
            returnSecureToken:
              true,
          }),
      }
    );

  if (!response.ok) {
    const errorBody =
      await response.text();

    assert.fail(
      `Could not create the emulator user. HTTP ${response.status}: ${errorBody}`
    );
  }

  const body =
    await response.json();

  assert.equal(
    typeof body.idToken,
    'string'
  );

  assert.equal(
    typeof body.localId,
    'string'
  );

  return body;
}

async function writeFirestoreDocument(
  collection,
  documentId,
  fields
) {
  const documentUrl =
    `${firestoreBaseUrl}/${collection}/${documentId}`;

  const response =
    await fetch(
      documentUrl,
      {
        method:
          'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            'Bearer owner',
        },
        body:
          JSON.stringify({
            fields,
          }),
      }
    );

  if (!response.ok) {
    const errorBody =
      await response.text();

    assert.fail(
      `Could not create ${collection}/${documentId}. HTTP ${response.status}: ${errorBody}`
    );
  }
}

async function createProfile(
  uid
) {
  await writeFirestoreDocument(
    'users',
    uid,
    {
      uid: {
        stringValue:
          uid,
      },
      displayName: {
        stringValue:
          'Preserved callable profile',
      },
      isProfileVisible: {
        booleanValue:
          false,
      },
      deletionRequested: {
        booleanValue:
          true,
      },
      deletionRequestedAt: {
        timestampValue:
          requestCreatedAt
            .toISOString(),
      },
    }
  );
}

async function createDeletionRequest(
  uid
) {
  await writeFirestoreDocument(
    'accountDeletionRequests',
    uid,
    {
      userId: {
        stringValue:
          uid,
      },
      status: {
        stringValue:
          'pending',
      },
      previousProfileVisibility: {
        booleanValue:
          true,
      },
      createdAt: {
        timestampValue:
          requestCreatedAt
            .toISOString(),
      },
      updatedAt: {
        timestampValue:
          requestCreatedAt
            .toISOString(),
      },
    }
  );
}

async function invokeCancellation(
  idToken,
  data = {}
) {
  const headers = {
    'Content-Type':
      'application/json',
  };

  if (
    idToken !== undefined
  ) {
    headers.Authorization =
      `Bearer ${idToken}`;
  }

  return fetch(
    functionUrl,
    {
      method:
        'POST',
      headers,
      body:
        JSON.stringify({
          data,
        }),
    }
  );
}

test(
  'cancelAccountDeletion rejects an unauthenticated call',
  async () => {
    const response =
      await invokeCancellation();

    const body =
      await response.json();

    assert.equal(
      response.ok,
      false
    );

    assert.equal(
      body.error.status,
      'UNAUTHENTICATED'
    );

    assert.equal(
      JSON.stringify(
        body
      ).includes(
        'cancellationRecordId'
      ),
      false
    );
  }
);

test(
  'cancelAccountDeletion rejects a client supplied uid',
  async () => {
    const authBody =
      await createEmulatorUser(
        'cancel-callable-forged-uid@example.com'
      );

    const response =
      await invokeCancellation(
        authBody.idToken,
        {
          uid:
            'forged-user',
        }
      );

    const body =
      await response.json();

    assert.equal(
      response.ok,
      false
    );

    assert.equal(
      body.error.status,
      'INVALID_ARGUMENT'
    );
  }
);

test(
  'cancelAccountDeletion rejects any unsupported input',
  async () => {
    const authBody =
      await createEmulatorUser(
        'cancel-callable-input@example.com'
      );

    const response =
      await invokeCancellation(
        authBody.idToken,
        {
          unexpected:
            true,
        }
      );

    const body =
      await response.json();

    assert.equal(
      response.ok,
      false
    );

    assert.equal(
      body.error.status,
      'INVALID_ARGUMENT'
    );
  }
);

test(
  'cancelAccountDeletion returns not-cancellable when the active request is absent',
  async () => {
    const authBody =
      await createEmulatorUser(
        'cancel-callable-no-request@example.com'
      );

    await createProfile(
      authBody.localId
    );

    const response =
      await invokeCancellation(
        authBody.idToken
      );

    const body =
      await response.json();

    assert.equal(
      response.status,
      200
    );

    assert.deepEqual(
      body,
      {
        result: {
          status:
            'not-cancellable',
        },
      }
    );
  }
);

test(
  'cancelAccountDeletion maps a missing profile to failed-precondition',
  async () => {
    const authBody =
      await createEmulatorUser(
        'cancel-callable-no-profile@example.com'
      );

    await createDeletionRequest(
      authBody.localId
    );

    const response =
      await invokeCancellation(
        authBody.idToken
      );

    const body =
      await response.json();

    assert.equal(
      response.ok,
      false
    );

    assert.equal(
      body.error.status,
      'FAILED_PRECONDITION'
    );

    assert.equal(
      JSON.stringify(
        body
      ).includes(
        authBody.localId
      ),
      false
    );
  }
);

test(
  'cancelAccountDeletion completes the authenticated cancellation with a minimal response',
  async () => {
    const email =
      'cancel-callable-complete@example.com';

    const authBody =
      await createEmulatorUser(
        email
      );

    await createProfile(
      authBody.localId
    );

    await createDeletionRequest(
      authBody.localId
    );

    const response =
      await invokeCancellation(
        authBody.idToken
      );

    const body =
      await response.json();

    assert.equal(
      response.status,
      200
    );

    assert.deepEqual(
      body,
      {
        result: {
          status:
            'completed',
        },
      }
    );

    assert.deepEqual(
      Object.keys(
        body.result
      ),
      [
        'status',
      ]
    );

    const secret =
      await readLocalSecret();

    const operationKey =
      createCancellationOperationLookupKey(
        authBody.localId,
        secret
      );

    const operationSnapshot =
      await firestore
        .collection(
          'accountDeletionCancellationOperations'
        )
        .doc(
          operationKey
        )
        .get();

    assert.equal(
      operationSnapshot.exists,
      true
    );

    const operationData =
      operationSnapshot.data();

    assert.equal(
      operationData.phase,
      'completed'
    );

    assert.equal(
      (
        await firestore
          .collection(
            'accountDeletionRequests'
          )
          .doc(
            authBody.localId
          )
          .get()
      ).exists,
      false
    );

    const recordSnapshot =
      await firestore
        .collection(
          'cancelledDeletionRequests'
        )
        .doc(
          operationData
            .cancellationRecordId
        )
        .get();

    assert.equal(
      recordSnapshot.exists,
      true
    );

    const serializedResponse =
      JSON.stringify(
        body
      );

    assert.equal(
      serializedResponse.includes(
        authBody.localId
      ),
      false
    );

    assert.equal(
      serializedResponse.includes(
        operationKey
      ),
      false
    );

    assert.equal(
      serializedResponse.includes(
        operationData
          .cancellationRecordId
      ),
      false
    );

    assert.equal(
      serializedResponse.includes(
        secret
      ),
      false
    );
  }
);
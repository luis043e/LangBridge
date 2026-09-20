import assert from 'node:assert/strict';
import {
  test,
} from 'node:test';

const projectId =
  'demo-langbridge-local';

const authUrl =
  'http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key';

const functionUrl =
  `http://127.0.0.1:5001/${projectId}/us-central1/cancellationBackendProbe`;

const stateFunctionUrl =
  `http://127.0.0.1:5001/${projectId}/us-central1/cancellationRequestStateProbe`;

async function createDeletionRequest(
  uid,
  email
) {
  const documentUrl =
    `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/accountDeletionRequests/${uid}`;

  const response =
    await fetch(
      documentUrl,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
          Authorization:
            'Bearer owner',
        },
        body: JSON.stringify({
          fields: {
            userId: {
              stringValue:
                uid,
            },
            userEmail: {
              stringValue:
                email,
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
                new Date().toISOString(),
            },
            updatedAt: {
              timestampValue:
                new Date().toISOString(),
            },
          },
        }),
      }
    );

  if (!response.ok) {
    const errorBody =
      await response.text();

    assert.fail(
      `Could not create the synthetic deletion request. HTTP ${response.status}: ${errorBody}`
    );
  }
}

async function createEmulatorUser(
  email
) {
  const response =
    await fetch(
      authUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
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

async function invokeProbe(
  idToken,
  data = {}
) {
  const headers = {
    'Content-Type':
      'application/json',
  };

  if (idToken !== undefined) {
    headers.Authorization =
      `Bearer ${idToken}`;
  }

  return fetch(
    functionUrl,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({
        data,
      }),
    }
  );
}

async function invokeStateProbe(
  idToken
) {
  return fetch(
    stateFunctionUrl,
    {
      method: 'POST',
      headers: {
        'Content-Type':
          'application/json',
        Authorization:
          `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        data: {},
      }),
    }
  );
}

test(
  'the cancellation backend probe rejects an unauthenticated call',
  async () => {
    const response =
      await invokeProbe();

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
  }
);

test(
  'the request state probe returns request-not-found for an authenticated user without a request',
  async () => {
    const authBody =
      await createEmulatorUser(
        'state-missing@example.com'
      );

    const response =
      await invokeStateProbe(
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
            'request-not-found',
        },
      }
    );
  }
);

test(
  'the request state probe returns cancellable for a pending emulator request',
  async () => {
    const email =
      'state-pending@example.com';

    const authBody =
      await createEmulatorUser(
        email
      );

    await createDeletionRequest(
      authBody.localId,
      email
    );

    const response =
      await invokeStateProbe(
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
            'cancellable',
        },
      }
    );
  }
);

test(
  'the cancellation backend probe accepts an authenticated emulator user',
  async () => {
    const authBody =
      await createEmulatorUser(
        'backend-probe@example.com'
      );

    const response =
      await invokeProbe(
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
            'ready',
        },
      }
    );
  }
);

test(
  'the cancellation backend probe rejects unsupported authenticated input',
  async () => {
    const authBody =
      await createEmulatorUser(
        'backend-probe-input@example.com'
      );

    const response =
      await invokeProbe(
        authBody.idToken,
        {
          userId:
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
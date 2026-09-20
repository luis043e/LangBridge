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

async function invokeProbe(
  idToken,
  data = {}
) {
  const headers = {
    'Content-Type': 'application/json',
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
  'the cancellation backend probe accepts an authenticated emulator user',
  async () => {
    const authResponse =
      await fetch(
        authUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email:
              'backend-probe@example.com',
            password:
              'LocalTestPassword123!',
            returnSecureToken:
              true,
          }),
        }
      );

    assert.equal(
      authResponse.ok,
      true
    );

    const authBody =
      await authResponse.json();

    assert.equal(
      typeof authBody.idToken,
      'string'
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
          status: 'ready',
        },
      }
    );
  }
);
test(
  'the cancellation backend probe rejects unsupported authenticated input',
  async () => {
    const authResponse =
      await fetch(
        authUrl,
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            email:
              'backend-probe-input@example.com',
            password:
              'LocalTestPassword123!',
            returnSecureToken:
              true,
          }),
        }
      );

    assert.equal(
      authResponse.ok,
      true
    );

    const authBody =
      await authResponse.json();

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
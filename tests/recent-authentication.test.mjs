import assert from 'node:assert/strict';
import {
  test,
} from 'node:test';

import {
  evaluateRecentAuthentication,
} from '../functions/lib/recent-authentication.js';

const serverTime = 1_000;

test(
  'recent authentication rejects a missing auth_time',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        undefined,
        serverTime
      ),
      {
        valid: false,
        reason:
          'identity-verification-required',
      }
    );
  }
);

test(
  'recent authentication rejects an invalid auth_time type',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        '700',
        serverTime
      ),
      {
        valid: false,
        reason:
          'identity-verification-required',
      }
    );
  }
);

test(
  'recent authentication rejects auth_time equal to zero',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        0,
        serverTime
      ),
      {
        valid: false,
        reason:
          'identity-verification-required',
      }
    );
  }
);

test(
  'recent authentication accepts a current session',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime,
        serverTime
      ),
      {
        valid: true,
      }
    );
  }
);

test(
  'recent authentication accepts a session at 299 seconds',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime - 299,
        serverTime
      ),
      {
        valid: true,
      }
    );
  }
);

test(
  'recent authentication accepts the exact 300 second limit',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime - 300,
        serverTime
      ),
      {
        valid: true,
      }
    );
  }
);

test(
  'recent authentication rejects a session at 301 seconds',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime - 301,
        serverTime
      ),
      {
        valid: false,
        reason:
          'recent-session-required',
      }
    );
  }
);

test(
  'recent authentication accepts a future value within tolerance',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime + 30,
        serverTime
      ),
      {
        valid: true,
      }
    );
  }
);

test(
  'recent authentication rejects a future value beyond tolerance',
  () => {
    assert.deepEqual(
      evaluateRecentAuthentication(
        serverTime + 31,
        serverTime
      ),
      {
        valid: false,
        reason:
          'identity-verification-required',
      }
    );
  }
);
import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    evaluateDeletionRequest,
} from '../functions/lib/deletion-request-state.js';

const authenticatedUid =
  'user-one';

test(
  'a missing deletion request is classified as request-not-found',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        false,
        undefined,
        authenticatedUid
      ),
      {
        status:
          'request-not-found',
      }
    );
  }
);

test(
  'a malformed deletion request is not cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        null,
        authenticatedUid
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'a deletion request belonging to another user is not cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            'user-two',
          status:
            'pending',
          previousProfileVisibility:
            true,
        },
        authenticatedUid
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'a pending deletion request with visible profile is cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'pending',
          previousProfileVisibility:
            true,
        },
        authenticatedUid
      ),
      {
        status:
          'cancellable',
        previousProfileVisibility:
          true,
      }
    );
  }
);

test(
  'a pending deletion request preserves false profile visibility',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'pending',
          previousProfileVisibility:
            false,
        },
        authenticatedUid
      ),
      {
        status:
          'cancellable',
        previousProfileVisibility:
          false,
      }
    );
  }
);

test(
  'a processing request without a point of no return is cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'processing',
          previousProfileVisibility:
            true,
        },
        authenticatedUid
      ),
      {
        status:
          'cancellable',
        previousProfileVisibility:
          true,
      }
    );
  }
);

test(
  'a request with pointOfNoReturnAt is rejected',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'processing',
          previousProfileVisibility:
            true,
          pointOfNoReturnAt:
            {
              seconds:
                1_000,
            },
        },
        authenticatedUid
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );
  }
);

test(
  'a request with pointOfNoReturnOperation is rejected',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'processing',
          previousProfileVisibility:
            true,
          pointOfNoReturnOperation:
            'delete-authentication',
        },
        authenticatedUid
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );
  }
);

test(
  'a cancelled request is not cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'cancelled',
          previousProfileVisibility:
            true,
        },
        authenticatedUid
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'a request without previousProfileVisibility is not cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'pending',
        },
        authenticatedUid
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);

test(
  'a request with invalid previousProfileVisibility is not cancellable',
  () => {
    assert.deepEqual(
      evaluateDeletionRequest(
        true,
        {
          userId:
            authenticatedUid,
          status:
            'pending',
          previousProfileVisibility:
            'true',
        },
        authenticatedUid
      ),
      {
        status:
          'not-cancellable',
      }
    );
  }
);
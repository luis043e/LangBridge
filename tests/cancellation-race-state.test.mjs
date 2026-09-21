import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    evaluateCancellationRaceState,
} from '../functions/lib/cancellation-race-state.js';

const expectedOperationKey =
  'a'.repeat(64);

const confirmedAt =
  new Date(
    '2026-09-21T18:30:00.000Z'
  );

function createTimestampProbe(
  date
) {
  return {
    toDate() {
      return new Date(
        date.getTime()
      );
    },
  };
}

test(
  'a request without a confirmed winner is unconfirmed',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          status:
            'pending',
        },
        expectedOperationKey
      ),
      {
        status:
          'unconfirmed',
      }
    );
  }
);

test(
  'a valid cancellation confirmation is confirmed',
  () => {
    const result =
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            confirmedAt,
          cancellationOperationKey:
            expectedOperationKey,
        },
        expectedOperationKey
      );

    assert.equal(
      result.status,
      'confirmed'
    );

    assert.equal(
      result.confirmedAt.toISOString(),
      confirmedAt.toISOString()
    );
  }
);

test(
  'a Firestore-like confirmation timestamp is accepted',
  () => {
    const result =
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            createTimestampProbe(
              confirmedAt
            ),
          cancellationOperationKey:
            expectedOperationKey,
        },
        expectedOperationKey
      );

    assert.equal(
      result.status,
      'confirmed'
    );

    assert.equal(
      result.confirmedAt.toISOString(),
      confirmedAt.toISOString()
    );
  }
);

test(
  'the returned confirmation date is independent',
  () => {
    const result =
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            confirmedAt,
          cancellationOperationKey:
            expectedOperationKey,
        },
        expectedOperationKey
      );

    assert.equal(
      result.status,
      'confirmed'
    );

    assert.notEqual(
      result.confirmedAt,
      confirmedAt
    );
  }
);

test(
  'a partial cancellation confirmation is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            confirmedAt,
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );

    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          cancellationOperationKey:
            expectedOperationKey,
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a confirmation with a different operation key is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            confirmedAt,
          cancellationOperationKey:
            'b'.repeat(64),
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an invalid confirmation timestamp is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            'invalid-date',
          cancellationOperationKey:
            expectedOperationKey,
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a complete point of no return wins the race',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          pointOfNoReturnAt:
            createTimestampProbe(
              confirmedAt
            ),
          pointOfNoReturnOperation:
            'authentication',
        },
        expectedOperationKey
      ),
      {
        status:
          'point-of-no-return-reached',
      }
    );
  }
);

test(
  'a partial point of no return is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          pointOfNoReturnAt:
            confirmedAt,
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );

    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          pointOfNoReturnOperation:
            'authentication',
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'an invalid point of no return is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          pointOfNoReturnAt:
            'invalid-date',
          pointOfNoReturnOperation:
            '',
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'both race winners cannot be confirmed simultaneously',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        {
          cancellationConfirmedAt:
            confirmedAt,
          cancellationOperationKey:
            expectedOperationKey,
          pointOfNoReturnAt:
            confirmedAt,
          pointOfNoReturnOperation:
            'authentication',
        },
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);

test(
  'a malformed request or expected key is inconsistent',
  () => {
    assert.deepEqual(
      evaluateCancellationRaceState(
        null,
        expectedOperationKey
      ),
      {
        status:
          'inconsistent-state',
      }
    );

    assert.deepEqual(
      evaluateCancellationRaceState(
        {},
        'short-key'
      ),
      {
        status:
          'inconsistent-state',
      }
    );
  }
);
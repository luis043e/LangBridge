import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
    createCancellationOperationLookupKey,
} from '../functions/lib/cancellation-operation-key.js';

const firstSecret =
  'local-test-secret-with-at-least-32-characters';

const secondSecret =
  'another-local-secret-with-at-least-32-chars';

test(
  'the operation lookup key has exactly 64 hexadecimal characters',
  () => {
    const key =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    assert.equal(
      key.length,
      64
    );

    assert.equal(
      CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
        key
      ),
      true
    );
  }
);

test(
  'the same uid and secret produce the same lookup key',
  () => {
    const first =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    const second =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    assert.equal(
      first,
      second
    );
  }
);

test(
  'different uids produce different lookup keys',
  () => {
    const first =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    const second =
      createCancellationOperationLookupKey(
        'user-two',
        firstSecret
      );

    assert.notEqual(
      first,
      second
    );
  }
);

test(
  'different secrets produce different lookup keys',
  () => {
    const first =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    const second =
      createCancellationOperationLookupKey(
        'user-one',
        secondSecret
      );

    assert.notEqual(
      first,
      second
    );
  }
);

test(
  'the lookup key does not contain the uid',
  () => {
    const uid =
      'visible-user-identifier';

    const key =
      createCancellationOperationLookupKey(
        uid,
        firstSecret
      );

    assert.equal(
      key.includes(uid),
      false
    );
  }
);

test(
  'the lookup key does not contain the secret',
  () => {
    const key =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    assert.equal(
      key.includes(firstSecret),
      false
    );
  }
);

test(
  'the lookup key does not use a DEL-S2 prefix',
  () => {
    const key =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    assert.equal(
      key.startsWith('DEL-S2'),
      false
    );
  }
);

test(
  'the lookup key rejects an empty uid',
  () => {
    assert.throws(
      () => {
        createCancellationOperationLookupKey(
          '',
          firstSecret
        );
      },
      {
        name:
          'TypeError',
        message:
          'uid must be a non-empty string.',
      }
    );
  }
);

test(
  'the lookup key rejects a short secret',
  () => {
    assert.throws(
      () => {
        createCancellationOperationLookupKey(
          'user-one',
          'short-secret'
        );
      },
      {
        name:
          'TypeError',
        message:
          'secret must contain at least 32 characters.',
      }
    );
  }
);

test(
  'the lookup key contains no spaces or path separators',
  () => {
    const key =
      createCancellationOperationLookupKey(
        'user-one',
        firstSecret
      );

    assert.equal(
      key.includes(' '),
      false
    );

    assert.equal(
      key.includes('/'),
      false
    );

    assert.equal(
      key.includes('\\'),
      false
    );
  }
);
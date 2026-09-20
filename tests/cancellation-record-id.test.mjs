import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    CANCELLATION_RECORD_ID_PATTERN,
    createCancellationRecordId,
} from '../functions/lib/cancellation-record-id.js';

test(
  'a cancellation record id has exactly 32 characters',
  () => {
    const id =
      createCancellationRecordId();

    assert.equal(
      id.length,
      32
    );
  }
);

test(
  'a cancellation record id uses only base64url characters',
  () => {
    const id =
      createCancellationRecordId();

    assert.equal(
      CANCELLATION_RECORD_ID_PATTERN.test(
        id
      ),
      true
    );
  }
);

test(
  'a cancellation record id has no padding',
  () => {
    const id =
      createCancellationRecordId();

    assert.equal(
      id.includes('='),
      false
    );
  }
);

test(
  'two cancellation record ids are different',
  () => {
    const first =
      createCancellationRecordId();

    const second =
      createCancellationRecordId();

    assert.notEqual(
      first,
      second
    );
  }
);

test(
  'one thousand generated cancellation record ids are unique',
  () => {
    const ids =
      new Set();

    for (
      let index = 0;
      index < 1_000;
      index += 1
    ) {
      ids.add(
        createCancellationRecordId()
      );
    }

    assert.equal(
      ids.size,
      1_000
    );
  }
);

test(
  'generated cancellation record ids never contain spaces',
  () => {
    for (
      let index = 0;
      index < 100;
      index += 1
    ) {
      const id =
        createCancellationRecordId();

      assert.equal(
        id.includes(' '),
        false
      );
    }
  }
);

test(
  'generated cancellation record ids do not contain path separators',
  () => {
    for (
      let index = 0;
      index < 100;
      index += 1
    ) {
      const id =
        createCancellationRecordId();

      assert.equal(
        id.includes('/'),
        false
      );

      assert.equal(
        id.includes('\\'),
        false
      );
    }
  }
);

test(
  'the generator does not accept identifying input',
  () => {
    assert.equal(
      createCancellationRecordId.length,
      0
    );
  }
);

test(
  'a cancellation record id does not use a DEL-S2 prefix',
  () => {
    const id =
      createCancellationRecordId();

    assert.equal(
      id.startsWith('DEL-S2'),
      false
    );
  }
);
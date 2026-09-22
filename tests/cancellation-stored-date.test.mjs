import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    readCancellationStoredDate,
} from '../functions/lib/cancellation-stored-date.js';

const storedDate =
  new Date(
    '2026-09-21T14:00:00.000Z'
  );

test(
  'a valid Date is read as an independent Date',
  () => {
    const result =
      readCancellationStoredDate(
        storedDate
      );

    assert.equal(
      result.toISOString(),
      storedDate.toISOString()
    );

    assert.notEqual(
      result,
      storedDate
    );
  }
);

test(
  'a Firestore-like timestamp is converted with toDate',
  () => {
    const timestamp = {
      toDate() {
        return new Date(
          storedDate.getTime()
        );
      },
    };

    const result =
      readCancellationStoredDate(
        timestamp
      );

    assert.equal(
      result.toISOString(),
      storedDate.toISOString()
    );

    assert.notEqual(
      result,
      timestamp
    );
  }
);

test(
  'the returned Firestore-like date is independent',
  () => {
    const convertedDate =
      new Date(
        storedDate.getTime()
      );

    const timestamp = {
      toDate() {
        return convertedDate;
      },
    };

    const result =
      readCancellationStoredDate(
        timestamp
      );

    assert.notEqual(
      result,
      convertedDate
    );

    assert.equal(
      result.toISOString(),
      convertedDate.toISOString()
    );
  }
);

test(
  'an invalid Date is rejected',
  () => {
    assert.equal(
      readCancellationStoredDate(
        new Date(
          Number.NaN
        )
      ),
      undefined
    );
  }
);

test(
  'an invalid converted Date is rejected',
  () => {
    assert.equal(
      readCancellationStoredDate({
        toDate() {
          return new Date(
            Number.NaN
          );
        },
      }),
      undefined
    );
  }
);

test(
  'a non-Date conversion result is rejected',
  () => {
    assert.equal(
      readCancellationStoredDate({
        toDate() {
          return '2026-09-21';
        },
      }),
      undefined
    );
  }
);

test(
  'a throwing timestamp conversion is rejected',
  () => {
    assert.equal(
      readCancellationStoredDate({
        toDate() {
          throw new Error(
            'conversion failed'
          );
        },
      }),
      undefined
    );
  }
);

test(
  'missing and malformed values are rejected',
  () => {
    const malformedValues = [
      undefined,
      null,
      '',
      0,
      false,
      [],
      {},
      {
        toDate:
          'not-a-function',
      },
    ];

    for (
      const value of
      malformedValues
    ) {
      assert.equal(
        readCancellationStoredDate(
          value
        ),
        undefined
      );
    }
  }
);
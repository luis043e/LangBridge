import assert from 'node:assert/strict';
import {
    test,
} from 'node:test';

import {
    CANCELLATION_COLLECTIONS,
    createCancellationDocumentReferences,
} from '../functions/lib/cancellation-transaction.js';

function createFirestoreProbe() {
  return {
    collection(collectionName) {
      return {
        doc(documentId) {
          return {
            path:
              `${collectionName}/${documentId}`,
          };
        },
      };
    },
  };
}

const uid =
  'user-one';

const opaqueLookupKey =
  'a'.repeat(64);

const cancellationRecordId =
  'b'.repeat(32);

function createReferences() {
  return createCancellationDocumentReferences(
    createFirestoreProbe(),
    uid,
    opaqueLookupKey,
    cancellationRecordId
  );
}

test(
  'the cancellation transaction declares only the approved collections',
  () => {
    assert.deepEqual(
      CANCELLATION_COLLECTIONS,
      {
        users:
          'users',
        activeRequests:
          'accountDeletionRequests',
        operations:
          'accountDeletionCancellationOperations',
        cancelledRequests:
          'cancelledDeletionRequests',
      }
    );
  }
);

test(
  'the authenticated uid selects the user profile',
  () => {
    const references =
      createReferences();

    assert.equal(
      references.user.path,
      'users/user-one'
    );
  }
);

test(
  'the authenticated uid selects the active deletion request',
  () => {
    const references =
      createReferences();

    assert.equal(
      references.activeRequest.path,
      'accountDeletionRequests/user-one'
    );
  }
);

test(
  'the opaque lookup key selects the protected coordinator',
  () => {
    const references =
      createReferences();

    assert.equal(
      references.operation.path,
      `accountDeletionCancellationOperations/${opaqueLookupKey}`
    );
  }
);

test(
  'the cancellation record id selects the minimum cancelled record',
  () => {
    const references =
      createReferences();

    assert.equal(
      references.cancelledRequest.path,
      `cancelledDeletionRequests/${cancellationRecordId}`
    );
  }
);

test(
  'the transaction rejects an empty uid',
  () => {
    assert.throws(
      () => {
        createCancellationDocumentReferences(
          createFirestoreProbe(),
          '',
          opaqueLookupKey,
          cancellationRecordId
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
  'the transaction rejects path separators in identifiers',
  () => {
    assert.throws(
      () => {
        createCancellationDocumentReferences(
          createFirestoreProbe(),
          'users/forged-user',
          opaqueLookupKey,
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'uid cannot contain path separators.',
      }
    );

    assert.throws(
      () => {
        createCancellationDocumentReferences(
          createFirestoreProbe(),
          uid,
          'operations\\forged-operation',
          cancellationRecordId
        );
      },
      {
        name:
          'TypeError',
        message:
          'opaqueLookupKey cannot contain path separators.',
      }
    );

    assert.throws(
      () => {
        createCancellationDocumentReferences(
          createFirestoreProbe(),
          uid,
          opaqueLookupKey,
          'records/forged-record'
        );
      },
      {
        name:
          'TypeError',
        message:
          'cancellationRecordId cannot contain path separators.',
      }
    );
  }
);

test(
  'the transaction rejects equal internal identifiers',
  () => {
    assert.throws(
      () => {
        createCancellationDocumentReferences(
          createFirestoreProbe(),
          uid,
          opaqueLookupKey,
          opaqueLookupKey
        );
      },
      {
        name:
          'TypeError',
        message:
          'opaqueLookupKey and cancellationRecordId must be different.',
      }
    );
  }
);

test(
  'the generated references do not include unrelated collections',
  () => {
    const references =
      createReferences();

    const serialized =
      JSON.stringify(
        references
      );

    assert.equal(
      serialized.includes(
        'conversations'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'messages'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'reports'
      ),
      false
    );

    assert.equal(
      serialized.includes(
        'DEL-S2'
      ),
      false
    );
  }
);
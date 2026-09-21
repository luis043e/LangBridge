import type {
    DocumentReference,
    Firestore,
} from "firebase-admin/firestore";

export const CANCELLATION_COLLECTIONS = {
  users:
    "users",
  activeRequests:
    "accountDeletionRequests",
  operations:
    "accountDeletionCancellationOperations",
  cancelledRequests:
    "cancelledDeletionRequests",
} as const;

export type CancellationDocumentReferences = {
  user:
    DocumentReference;
  activeRequest:
    DocumentReference;
  operation:
    DocumentReference;
  cancelledRequest:
    DocumentReference;
};

function requireDocumentIdentifier(
  value: string,
  name: string
): void {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    throw new TypeError(
      `${name} must be a non-empty string.`
    );
  }

  if (
    value.includes("/") ||
    value.includes("\\")
  ) {
    throw new TypeError(
      `${name} cannot contain path separators.`
    );
  }
}

export function createCancellationDocumentReferences(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string
): CancellationDocumentReferences {
  requireDocumentIdentifier(
    uid,
    "uid"
  );

  requireDocumentIdentifier(
    opaqueLookupKey,
    "opaqueLookupKey"
  );

  requireDocumentIdentifier(
    cancellationRecordId,
    "cancellationRecordId"
  );

  if (
    opaqueLookupKey ===
    cancellationRecordId
  ) {
    throw new TypeError(
      "opaqueLookupKey and cancellationRecordId must be different."
    );
  }

  return {
    user:
      firestore
        .collection(
          CANCELLATION_COLLECTIONS.users
        )
        .doc(uid),
    activeRequest:
      firestore
        .collection(
          CANCELLATION_COLLECTIONS.activeRequests
        )
        .doc(uid),
    operation:
      firestore
        .collection(
          CANCELLATION_COLLECTIONS.operations
        )
        .doc(
          opaqueLookupKey
        ),
    cancelledRequest:
      firestore
        .collection(
          CANCELLATION_COLLECTIONS.cancelledRequests
        )
        .doc(
          cancellationRecordId
        ),
  };
}
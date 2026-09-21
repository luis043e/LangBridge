import type {
  DocumentReference,
  Firestore,
} from "firebase-admin/firestore";

import {
  evaluateCancellationReadState,
  type CancellationReadState,
} from "./cancellation-read-state.js";

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

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

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

function getStoredCancellationRecordId(
  operationExists: boolean,
  operationData: unknown,
  candidateCancellationRecordId: string
): string | undefined {
  if (!operationExists) {
    return candidateCancellationRecordId;
  }

  if (!isRecord(operationData)) {
    return undefined;
  }

  const storedCancellationRecordId =
    operationData.cancellationRecordId;

  if (
    typeof storedCancellationRecordId !==
      "string" ||
    storedCancellationRecordId.length <
      32 ||
    storedCancellationRecordId.includes(
      "/"
    ) ||
    storedCancellationRecordId.includes(
      "\\"
    )
  ) {
    return undefined;
  }

  return storedCancellationRecordId;
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

export async function readCancellationStateInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  candidateCancellationRecordId: string
): Promise<CancellationReadState> {
  const initialReferences =
    createCancellationDocumentReferences(
      firestore,
      uid,
      opaqueLookupKey,
      candidateCancellationRecordId
    );

  return firestore.runTransaction(
    async (transaction) => {
      const [
        profileSnapshot,
        activeRequestSnapshot,
        operationSnapshot,
      ] =
        await transaction.getAll(
          initialReferences.user,
          initialReferences.activeRequest,
          initialReferences.operation
        );

      const operationData =
        operationSnapshot.exists
          ? operationSnapshot.data()
          : undefined;

      const resolvedCancellationRecordId =
        getStoredCancellationRecordId(
          operationSnapshot.exists,
          operationData,
          candidateCancellationRecordId
        );

      if (
        resolvedCancellationRecordId ===
        undefined
      ) {
        return evaluateCancellationReadState(
          uid,
          profileSnapshot.exists,
          activeRequestSnapshot.exists,
          activeRequestSnapshot.exists
            ? activeRequestSnapshot.data()
            : undefined,
          operationSnapshot.exists,
          operationData,
          false
        );
      }

      if (
        resolvedCancellationRecordId ===
        opaqueLookupKey
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const resolvedReferences =
        createCancellationDocumentReferences(
          firestore,
          uid,
          opaqueLookupKey,
          resolvedCancellationRecordId
        );

      const cancelledRecordSnapshot =
        await transaction.get(
          resolvedReferences.cancelledRequest
        );

      return evaluateCancellationReadState(
        uid,
        profileSnapshot.exists,
        activeRequestSnapshot.exists,
        activeRequestSnapshot.exists
          ? activeRequestSnapshot.data()
          : undefined,
        operationSnapshot.exists,
        operationData,
        cancelledRecordSnapshot.exists
      );
    }
  );
}
import type {
    Firestore,
} from "firebase-admin/firestore";

import {
    evaluateCoordinatedCancellationReadState,
} from "./cancellation-coordinated-read-state.js";

import {
    advanceCancellationOperationPhase,
    isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

import {
    evaluateCancellationRecordState,
} from "./cancellation-record-state.js";

import type {
    CancellationReadState,
} from "./cancellation-read-state.js";

import {
    readCancellationStoredDate,
} from "./cancellation-stored-date.js";

import {
    createCancellationDocumentReferences,
} from "./cancellation-transaction.js";

export type TemporaryRestorationDataRemoveTransactionResult =
  | {
      status:
        | "temporary-restoration-data-removed"
        | "already-removed";
    }
  | {
      status:
        | "profile-not-found"
        | "request-not-found"
        | "not-cancellable"
        | "point-of-no-return-reached"
        | "inconsistent-state";
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

function hasOwn(
  value: Record<string, unknown>,
  field: string
): boolean {
  return Object.prototype.hasOwnProperty.call(
    value,
    field
  );
}

function mapCoordinatedFailure(
  status: CancellationReadState["status"]
): TemporaryRestorationDataRemoveTransactionResult {
  switch (status) {
    case "profile-not-found":
    case "request-not-found":
    case "not-cancellable":
    case "point-of-no-return-reached":
    case "inconsistent-state":
      return {
        status,
      };

    default:
      return {
        status:
          "inconsistent-state",
      };
  }
}

function recordMatchesOperation(
  operationData: Record<string, unknown>,
  cancelledRecordData: unknown
): boolean {
  const recordState =
    evaluateCancellationRecordState(
      cancelledRecordData
    );

  if (
    recordState.status !==
    "valid"
  ) {
    return false;
  }

  const operationCancelledAt =
    readCancellationStoredDate(
      operationData.cancelledAt
    );

  const operationExpiresAt =
    readCancellationStoredDate(
      operationData.expiresAt
    );

  return (
    operationCancelledAt !== undefined &&
    operationExpiresAt !== undefined &&
    operationCancelledAt.getTime() ===
      recordState.cancelledAt.getTime() &&
    operationExpiresAt.getTime() ===
      recordState.expiresAt.getTime()
  );
}

export async function removeTemporaryRestorationDataInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string
): Promise<TemporaryRestorationDataRemoveTransactionResult> {
  const references =
    createCancellationDocumentReferences(
      firestore,
      uid,
      opaqueLookupKey,
      cancellationRecordId
    );

  return firestore.runTransaction(
    async (transaction) => {
      const [
        profileSnapshot,
        activeRequestSnapshot,
        operationSnapshot,
        cancelledRecordSnapshot,
      ] =
        await transaction.getAll(
          references.user,
          references.activeRequest,
          references.operation,
          references.cancelledRequest
        );

      const profileData =
        profileSnapshot.exists
          ? profileSnapshot.data()
          : undefined;

      const operationData =
        operationSnapshot.exists
          ? operationSnapshot.data()
          : undefined;

      const cancelledRecordData =
        cancelledRecordSnapshot.exists
          ? cancelledRecordSnapshot.data()
          : undefined;

      if (
        !isRecord(
          operationData
        ) ||
        !isCancellationOperationPhase(
          operationData.phase
        ) ||
        operationData.cancellationRecordId !==
          cancellationRecordId
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const coordinatedState =
        evaluateCoordinatedCancellationReadState({
          authenticatedUid:
            uid,
          expectedOperationKey:
            opaqueLookupKey,
          profileExists:
            profileSnapshot.exists,
          activeRequestExists:
            activeRequestSnapshot.exists,
          activeRequestData:
            activeRequestSnapshot.exists
              ? activeRequestSnapshot.data()
              : undefined,
          operationExists:
            operationSnapshot.exists,
          operationData,
          cancelledRecordExists:
            cancelledRecordSnapshot.exists,
        });

      if (
        coordinatedState.status !==
        "restoration-pending"
      ) {
        return mapCoordinatedFailure(
          coordinatedState.status
        );
      }

      if (
        !profileSnapshot.exists ||
        !isRecord(
          profileData
        ) ||
        activeRequestSnapshot.exists ||
        !cancelledRecordSnapshot.exists ||
        !recordMatchesOperation(
          operationData,
          cancelledRecordData
        )
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      if (
        hasOwn(
          profileData,
          "deletionRequested"
        ) ||
        hasOwn(
          profileData,
          "deletionRequestedAt"
        )
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      if (
        operationData.phase ===
        "temporary-restoration-data-removed"
      ) {
        return {
          status:
            "already-removed",
        };
      }

      if (
        operationData.phase !==
        "active-request-removed"
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const nextPhase =
        advanceCancellationOperationPhase(
          operationData.phase,
          "temporary-restoration-data-removed"
        );

      transaction.update(
        references.operation,
        {
          phase:
            nextPhase,
        }
      );

      return {
        status:
          "temporary-restoration-data-removed",
      };
    }
  );
}
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

export type CancellationOperationCompleteTransactionResult =
  | {
      status:
        | "completed"
        | "already-completed";
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
): CancellationOperationCompleteTransactionResult {
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

function readMatchingRecordExpiry(
  operationData: Record<string, unknown>,
  cancelledRecordData: unknown
): Date | undefined {
  const recordState =
    evaluateCancellationRecordState(
      cancelledRecordData
    );

  if (
    recordState.status !==
    "valid"
  ) {
    return undefined;
  }

  const operationCancelledAt =
    readCancellationStoredDate(
      operationData.cancelledAt
    );

  const operationExpiresAt =
    readCancellationStoredDate(
      operationData.expiresAt
    );

  if (
    operationCancelledAt === undefined ||
    operationExpiresAt === undefined ||
    operationCancelledAt.getTime() !==
      recordState.cancelledAt.getTime() ||
    operationExpiresAt.getTime() !==
      recordState.expiresAt.getTime()
  ) {
    return undefined;
  }

  return new Date(
    recordState.expiresAt.getTime()
  );
}

export async function completeCancellationOperationInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string
): Promise<CancellationOperationCompleteTransactionResult> {
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

      const activeRequestData =
        activeRequestSnapshot.exists
          ? activeRequestSnapshot.data()
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
        operationData.operationKey !==
          opaqueLookupKey ||
        operationData.cancellationRecordId !==
          cancellationRecordId
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      if (
        operationData.phase ===
        "completed"
      ) {
        const completedState =
          evaluateCoordinatedCancellationReadState({
            authenticatedUid:
              uid,
            expectedOperationKey:
              opaqueLookupKey,
            profileExists:
              profileSnapshot.exists,
            activeRequestExists:
              activeRequestSnapshot.exists,
            activeRequestData,
            operationExists:
              operationSnapshot.exists,
            operationData,
            cancelledRecordExists:
              cancelledRecordSnapshot.exists,
          });

        if (
          completedState.status !==
          "cancelled"
        ) {
          return mapCoordinatedFailure(
            completedState.status
          );
        }

        if (
          !profileSnapshot.exists ||
          !isRecord(
            profileData
          ) ||
          activeRequestSnapshot.exists ||
          !cancelledRecordSnapshot.exists ||
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

        const matchingExpiry =
          readMatchingRecordExpiry(
            operationData,
            cancelledRecordData
          );

        const operationExpiresAt =
          readCancellationStoredDate(
            operationData.operationExpiresAt
          );

        if (
          matchingExpiry === undefined ||
          operationExpiresAt === undefined ||
          operationExpiresAt.getTime() !==
            matchingExpiry.getTime()
        ) {
          return {
            status:
              "inconsistent-state",
          };
        }

        return {
          status:
            "already-completed",
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
          activeRequestData,
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
        operationData.phase !==
        "temporary-restoration-data-removed" ||
        !profileSnapshot.exists ||
        !isRecord(
          profileData
        ) ||
        activeRequestSnapshot.exists ||
        !cancelledRecordSnapshot.exists ||
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

      const matchingExpiry =
        readMatchingRecordExpiry(
          operationData,
          cancelledRecordData
        );

      if (
        matchingExpiry === undefined
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const nextPhase =
        advanceCancellationOperationPhase(
          operationData.phase,
          "completed"
        );

      transaction.update(
        references.operation,
        {
          phase:
            nextPhase,
          operationExpiresAt:
            matchingExpiry,
        }
      );

      return {
        status:
          "completed",
      };
    }
  );
}
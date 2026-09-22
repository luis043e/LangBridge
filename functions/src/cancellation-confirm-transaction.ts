import type {
  Firestore,
} from "firebase-admin/firestore";

import {
  createCancellationConfirmationPlan,
} from "./cancellation-confirmation.js";

import {
  evaluateCoordinatedCancellationReadState,
} from "./cancellation-coordinated-read-state.js";

import {
  readCancellationStoredDate,
} from "./cancellation-stored-date.js";

import {
  createCancellationDocumentReferences,
} from "./cancellation-transaction.js";

export type CancellationConfirmationTransactionResult =
  | {
      status: "confirmed";
    }
  | {
      status: "already-confirmed";
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

function requireValidDate(
  value: Date,
  name: string
): Date {
  if (
    !(value instanceof Date) ||
    Number.isNaN(
      value.getTime()
    )
  ) {
    throw new TypeError(
      `${name} must be a valid Date.`
    );
  }

  return new Date(
    value.getTime()
  );
}

export async function confirmCancellationInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string,
  operationStartedAt: Date
): Promise<CancellationConfirmationTransactionResult> {
  const normalizedOperationStartedAt =
    requireValidDate(
      operationStartedAt,
      "operationStartedAt"
    );

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
      ] =
        await transaction.getAll(
          references.user,
          references.activeRequest,
          references.operation
        );

      const activeRequestData =
        activeRequestSnapshot.exists
          ? activeRequestSnapshot.data()
          : undefined;

      const operationData =
        operationSnapshot.exists
          ? operationSnapshot.data()
          : undefined;

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
            false,
        });

      if (
  coordinatedState.status ===
    "restoration-pending" ||
  coordinatedState.status ===
    "cancelled"
) {
  return {
    status:
      "already-confirmed",
  };
}

      if (
        coordinatedState.status !==
        "ready"
      ) {
        return {
          status:
            coordinatedState.status,
        };
      }

      if (
        !isRecord(
          activeRequestData
        )
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const requestCreatedAt =
        readCancellationStoredDate(
          activeRequestData.createdAt
        );

      if (
        requestCreatedAt ===
        undefined
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const confirmationPlan =
        createCancellationConfirmationPlan(
          opaqueLookupKey,
          requestCreatedAt,
          normalizedOperationStartedAt,
          cancellationRecordId
        );

      transaction.update(
        references.activeRequest,
        confirmationPlan.activeRequestUpdate
      );

      transaction.create(
        references.operation,
        confirmationPlan.operationState
      );

      return {
        status:
          "confirmed",
      };
    }
  );
}
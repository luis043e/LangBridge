import type {
  Firestore,
} from "firebase-admin/firestore";

import {
  createCancellationPlan,
} from "./cancellation-plan.js";

import {
  evaluateCancellationRecordState,
} from "./cancellation-record-state.js";

import {
  evaluateCoordinatedCancellationReadState,
} from "./cancellation-coordinated-read-state.js";

import {
  advanceCancellationOperationPhase,
  isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

import type {
  CancellationReadState,
} from "./cancellation-read-state.js";

import {
  readCancellationStoredDate,
} from "./cancellation-stored-date.js";

import {
  createCancellationDocumentReferences,
} from "./cancellation-transaction.js";

export type CancellationRecordCreateTransactionResult =
  | {
      status:
        | "cancelled-record-created"
        | "cancelled-record-recovered"
        | "already-created";
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

function mapCoordinatedFailure(
  status: CancellationReadState["status"]
): CancellationRecordCreateTransactionResult {
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

export async function createCancellationRecordInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string,
  cancelledAt: Date
): Promise<CancellationRecordCreateTransactionResult> {
  const normalizedCancelledAt =
    requireValidDate(
      cancelledAt,
      "cancelledAt"
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
        cancelledRecordSnapshot,
      ] =
        await transaction.getAll(
          references.user,
          references.activeRequest,
          references.operation,
          references.cancelledRequest
        );

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
        )
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
        operationData.phase ===
        "cancelled-record-created"
      ) {

        if (
          !cancelledRecordSnapshot.exists
        ) {
          return {
            status:
              "inconsistent-state",
          };
        }

        const recordState =
          evaluateCancellationRecordState(
            cancelledRecordData
          );

        if (
          recordState.status !==
          "valid"
        ) {
          return {
            status:
              "inconsistent-state",
          };
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
  return {
    status:
      "inconsistent-state",
  };
}
        return {
          status:
            "already-created",
        };
      }

      if (
        operationData.phase !==
        "profile-restored"
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      if (
        !isRecord(
          activeRequestData
        ) ||
        typeof activeRequestData
          .previousProfileVisibility !==
          "boolean"
      ) {
        return {
          status:
            "inconsistent-state",
        };
      }

      const nextPhase =
        advanceCancellationOperationPhase(
          operationData.phase,
          "cancelled-record-created"
        );

      if (
        cancelledRecordSnapshot.exists
      ) {
        const recordState =
          evaluateCancellationRecordState(
            cancelledRecordData
          );

        if (
          recordState.status !==
          "valid"
        ) {
          return {
            status:
              "inconsistent-state",
          };
        }

        transaction.update(
          references.operation,
          {
            phase:
              nextPhase,
            cancelledAt:
              recordState.cancelledAt,
            expiresAt:
              recordState.expiresAt,
          }
        );

        return {
          status:
            "cancelled-record-recovered",
        };
      }

      const cancellationPlan =
        createCancellationPlan(
          activeRequestData
            .previousProfileVisibility,
          normalizedCancelledAt
        );

      transaction.create(
        references.cancelledRequest,
        cancellationPlan.cancelledRecord
      );

      transaction.update(
        references.operation,
        {
          phase:
            nextPhase,
          cancelledAt:
            cancellationPlan
              .cancelledRecord
              .cancelledAt,
          expiresAt:
            cancellationPlan
              .cancelledRecord
              .expiresAt,
        }
      );

      return {
        status:
          "cancelled-record-created",
      };
    }
  );
}
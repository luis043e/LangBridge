import {
  FieldValue,
} from "firebase-admin/firestore";

import type {
  Firestore,
} from "firebase-admin/firestore";

import {
  evaluateCoordinatedCancellationReadState,
} from "./cancellation-coordinated-read-state.js";

import type {
  CancellationReadState,
} from "./cancellation-read-state.js";

import {
  advanceCancellationOperationPhase,
  isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

import {
  createCancellationDocumentReferences,
} from "./cancellation-transaction.js";

export type CancellationProfileRestoreTransactionResult =
  | {
      status:
        | "profile-restored"
        | "already-restored";
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

function mapCoordinatedFailure(
  status: CancellationReadState["status"]
): CancellationProfileRestoreTransactionResult {
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

export async function restoreCancellationProfileInTransaction(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string
): Promise<CancellationProfileRestoreTransactionResult> {
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

      if (
        operationData.phase ===
        "profile-restored"
      ) {
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
  coordinatedState.status !==
  "restoration-pending"
) {
  return mapCoordinatedFailure(
    coordinatedState.status
  );
}

        return {
          status:
            "already-restored",
        };
      }

      if (
        operationData.phase !==
        "restoration-in-progress"
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
            false,
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
          "profile-restored"
        );

      transaction.update(
        references.user,
        {
          isProfileVisible:
            activeRequestData
              .previousProfileVisibility,
          deletionRequested:
            FieldValue.delete(),
          deletionRequestedAt:
            FieldValue.delete(),
        }
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
          "profile-restored",
      };
    }
  );
}
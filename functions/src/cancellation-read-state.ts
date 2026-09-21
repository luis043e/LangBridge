import {
    evaluateDeletionRequest,
} from "./deletion-request-state.js";

import {
    isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

export type CancellationReadState =
  | {
      status: "ready";
      previousProfileVisibility: boolean;
    }
  | {
      status:
        | "cancelled"
        | "restoration-pending"
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

export function evaluateCancellationReadState(
  authenticatedUid: string,
  profileExists: boolean,
  activeRequestExists: boolean,
  activeRequestData: unknown,
  operationExists: boolean,
  operationData: unknown,
  cancelledRecordExists: boolean
): CancellationReadState {
  if (
    typeof authenticatedUid !== "string" ||
    authenticatedUid.length === 0
  ) {
    return {
      status: "inconsistent-state",
    };
  }

  if (operationExists) {
    if (
      !isRecord(operationData) ||
      !isCancellationOperationPhase(
        operationData.phase
      )
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    if (
      typeof operationData.operationKey !==
        "string" ||
      operationData.operationKey.length < 32 ||
      typeof operationData.cancellationRecordId !==
        "string" ||
      operationData.cancellationRecordId.length < 32 ||
      operationData.operationKey ===
        operationData.cancellationRecordId
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    if (
      operationData.phase ===
      "completed"
    ) {
      if (!cancelledRecordExists) {
        return {
          status: "inconsistent-state",
        };
      }

      return {
        status: "cancelled",
      };
    }

    return {
      status: "restoration-pending",
    };
  }

  if (cancelledRecordExists) {
    return {
      status: "inconsistent-state",
    };
  }

  if (!profileExists) {
    return {
      status: "profile-not-found",
    };
  }

  const requestResult =
    evaluateDeletionRequest(
      activeRequestExists,
      activeRequestData,
      authenticatedUid
    );

  if (
    requestResult.status ===
    "cancellable"
  ) {
    return {
      status: "ready",
      previousProfileVisibility:
        requestResult.previousProfileVisibility,
    };
  }

  return {
    status:
      requestResult.status,
  };
}
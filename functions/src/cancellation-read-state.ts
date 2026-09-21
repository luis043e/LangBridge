import {
  CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
} from "./cancellation-operation-key.js";

import {
  CANCELLATION_RECORD_ID_PATTERN,
} from "./cancellation-record-id.js";

import {
  evaluateDeletionRequest,
} from "./deletion-request-state.js";

import {
  isCancellationOperationPhase,
  type CancellationOperationPhase,
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

function hasOwn(
  value: Record<string, unknown>,
  field: string
): boolean {
  return Object.prototype.hasOwnProperty.call(
    value,
    field
  );
}

function readStoredDate(
  value: unknown
): Date | undefined {
  if (value instanceof Date) {
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return undefined;
    }

    return new Date(
      value.getTime()
    );
  }

  if (
    !isRecord(value) ||
    typeof value.toDate !==
      "function"
  ) {
    return undefined;
  }

  try {
    const converted =
      value.toDate.call(
        value
      );

    if (
      !(converted instanceof Date) ||
      Number.isNaN(
        converted.getTime()
      )
    ) {
      return undefined;
    }

    return new Date(
      converted.getTime()
    );
  } catch {
    return undefined;
  }
}

function isValidOperationKey(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      value
    )
  );
}

function isValidCancellationRecordId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    CANCELLATION_RECORD_ID_PATTERN.test(
      value
    )
  );
}

function calculateExpectedExpiry(
  cancelledAt: Date
): Date {
  const expectedExpiry =
    new Date(
      cancelledAt.getTime()
    );

  expectedExpiry.setUTCDate(
    expectedExpiry.getUTCDate() +
      30
  );

  return expectedExpiry;
}

function phaseRequiresCancelledRecord(
  phase: CancellationOperationPhase
): boolean {
  return (
    phase ===
      "cancelled-record-created" ||
    phase ===
      "active-request-removed" ||
    phase ===
      "temporary-restoration-data-removed" ||
    phase ===
      "completed"
  );
}

function hasValidOperationDates(
  operationData: Record<string, unknown>,
  phase: CancellationOperationPhase
): boolean {
  const requestCreatedAt =
    readStoredDate(
      operationData.requestCreatedAt
    );

  const operationStartedAt =
    readStoredDate(
      operationData.operationStartedAt
    );

  if (
    requestCreatedAt === undefined ||
    operationStartedAt === undefined ||
    operationStartedAt.getTime() <
      requestCreatedAt.getTime()
  ) {
    return false;
  }

  const requiresCancelledRecord =
    phaseRequiresCancelledRecord(
      phase
    );

  if (!requiresCancelledRecord) {
    return (
      !hasOwn(
        operationData,
        "cancelledAt"
      ) &&
      !hasOwn(
        operationData,
        "expiresAt"
      ) &&
      !hasOwn(
        operationData,
        "operationExpiresAt"
      )
    );
  }

  const cancelledAt =
    readStoredDate(
      operationData.cancelledAt
    );

  const expiresAt =
    readStoredDate(
      operationData.expiresAt
    );

  if (
    cancelledAt === undefined ||
    expiresAt === undefined
  ) {
    return false;
  }

  const expectedExpiry =
    calculateExpectedExpiry(
      cancelledAt
    );

  if (
    expiresAt.getTime() !==
    expectedExpiry.getTime()
  ) {
    return false;
  }

  if (phase !== "completed") {
    return !hasOwn(
      operationData,
      "operationExpiresAt"
    );
  }

  const operationExpiresAt =
    readStoredDate(
      operationData.operationExpiresAt
    );

  return (
    operationExpiresAt !== undefined &&
    operationExpiresAt.getTime() ===
      expiresAt.getTime()
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
      !isRecord(
        operationData
      ) ||
      !isCancellationOperationPhase(
        operationData.phase
      )
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    const phase =
      operationData.phase;

    if (
      phase === "not-started" ||
      !isValidOperationKey(
  operationData.operationKey
) ||
!isValidCancellationRecordId(
  operationData.cancellationRecordId
) ||
      operationData.operationKey ===
        operationData.cancellationRecordId ||
      !hasValidOperationDates(
        operationData,
        phase
      )
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    if (
      phase ===
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

    if (
      phaseRequiresCancelledRecord(
        phase
      ) &&
      !cancelledRecordExists
    ) {
      return {
        status: "inconsistent-state",
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
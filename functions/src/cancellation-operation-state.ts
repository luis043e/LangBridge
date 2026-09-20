export const CANCELLATION_OPERATION_PHASES = [
  "not-started",
  "restoration-in-progress",
  "profile-restored",
  "cancelled-record-created",
  "active-request-removed",
  "temporary-restoration-data-removed",
  "completed",
] as const;

export type CancellationOperationPhase =
  typeof CANCELLATION_OPERATION_PHASES[number];

export type CancellationOperationState = {
  operationKey: string;
  requestCreatedAt: Date;
  phase: CancellationOperationPhase;
  cancellationRecordId: string;
  cancelledAt: Date;
  expiresAt: Date;
  operationExpiresAt: Date;
};

const OPERATION_RETENTION_DAYS = 30;

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

function requireOpaqueValue(
  value: string,
  name: string
): void {
  if (
    typeof value !== "string" ||
    value.length < 32
  ) {
    throw new TypeError(
      `${name} must contain at least 32 characters.`
    );
  }
}

export function createCancellationOperationState(
  operationKey: string,
  requestCreatedAt: Date,
  cancellationRecordId: string,
  cancelledAt: Date,
  expiresAt: Date
): CancellationOperationState {
  requireOpaqueValue(
    operationKey,
    "operationKey"
  );

  requireOpaqueValue(
    cancellationRecordId,
    "cancellationRecordId"
  );

  if (
    operationKey ===
    cancellationRecordId
  ) {
    throw new TypeError(
      "operationKey and cancellationRecordId must be different."
    );
  }

  const normalizedRequestCreatedAt =
    requireValidDate(
      requestCreatedAt,
      "requestCreatedAt"
    );

  const normalizedCancelledAt =
    requireValidDate(
      cancelledAt,
      "cancelledAt"
    );

  const normalizedExpiresAt =
    requireValidDate(
      expiresAt,
      "expiresAt"
    );

  const operationExpiresAt =
    new Date(
      normalizedCancelledAt.getTime()
    );

  operationExpiresAt.setUTCDate(
    operationExpiresAt.getUTCDate() +
      OPERATION_RETENTION_DAYS
  );

  if (
    normalizedExpiresAt.getTime() !==
    operationExpiresAt.getTime()
  ) {
    throw new TypeError(
      "expiresAt must be exactly 30 calendar days after cancelledAt."
    );
  }

  return {
    operationKey,
    requestCreatedAt:
      normalizedRequestCreatedAt,
    phase:
      "not-started",
    cancellationRecordId,
    cancelledAt:
      normalizedCancelledAt,
    expiresAt:
      normalizedExpiresAt,
    operationExpiresAt,
  };
}

export function isCancellationOperationPhase(
  value: unknown
): value is CancellationOperationPhase {
  return (
    typeof value === "string" &&
    CANCELLATION_OPERATION_PHASES.includes(
      value as CancellationOperationPhase
    )
  );
}

export function advanceCancellationOperationPhase(
  currentPhase: CancellationOperationPhase,
  nextPhase: CancellationOperationPhase
): CancellationOperationPhase {
  const currentIndex =
    CANCELLATION_OPERATION_PHASES.indexOf(
      currentPhase
    );

  const nextIndex =
    CANCELLATION_OPERATION_PHASES.indexOf(
      nextPhase
    );

  if (
    nextIndex < currentIndex ||
    nextIndex > currentIndex + 1
  ) {
    throw new TypeError(
      "The cancellation operation phase transition is invalid."
    );
  }

  return nextPhase;
}
import {
  CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
} from "./cancellation-operation-key.js";

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

export type InitialCancellationOperationState = {
  operationKey: string;
  requestCreatedAt: Date;
  operationStartedAt: Date;
  phase: "restoration-in-progress";
  cancellationRecordId: string;
};

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

  if (
    value.includes("/") ||
    value.includes("\\")
  ) {
    throw new TypeError(
      `${name} cannot contain path separators.`
    );
  }
}

function requireOperationKey(
  value: string
): void {
  if (
    typeof value !== "string" ||
    value.length < 32
  ) {
    throw new TypeError(
      "operationKey must contain at least 32 characters."
    );
  }

  if (
    value.includes("/") ||
    value.includes("\\")
  ) {
    throw new TypeError(
      "operationKey cannot contain path separators."
    );
  }

  if (
    !CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      value
    )
  ) {
    throw new TypeError(
      "operationKey must be a 64-character lowercase hexadecimal lookup key."
    );
  }
}

export function createInitialCancellationOperationState(
  operationKey: string,
  requestCreatedAt: Date,
  operationStartedAt: Date,
  cancellationRecordId: string
): InitialCancellationOperationState {
    requireOperationKey(
    operationKey
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

  const normalizedOperationStartedAt =
    requireValidDate(
      operationStartedAt,
      "operationStartedAt"
    );

  if (
    normalizedOperationStartedAt.getTime() <
    normalizedRequestCreatedAt.getTime()
  ) {
    throw new TypeError(
      "operationStartedAt cannot be earlier than requestCreatedAt."
    );
  }

  return {
    operationKey,
    requestCreatedAt:
      normalizedRequestCreatedAt,
    operationStartedAt:
      normalizedOperationStartedAt,
    phase:
      "restoration-in-progress",
    cancellationRecordId,
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
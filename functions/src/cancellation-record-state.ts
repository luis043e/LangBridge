import {
    CANCELLATION_PROCEDURE_VERSION,
    CANCELLATION_RESTORATION_RESULT,
    CANCELLATION_VERIFICATION_METHOD,
    calculateCancellationExpiry,
} from "./cancellation-plan.js";

import {
    readCancellationStoredDate,
} from "./cancellation-stored-date.js";

export type CancellationRecordState =
  | {
      status:
        "valid";
      cancelledAt:
        Date;
      expiresAt:
        Date;
    }
  | {
      status:
        "inconsistent-state";
    };

const REQUIRED_CANCELLATION_RECORD_FIELDS = [
  "status",
  "cancelledAt",
  "expiresAt",
  "procedureVersion",
  "verificationMethod",
  "restorationResult",
] as const;

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function evaluateCancellationRecordState(
  value: unknown
): CancellationRecordState {
  if (!isRecord(value)) {
    return {
      status:
        "inconsistent-state",
    };
  }

  const keys =
    Object.keys(
      value
    ).sort();

  const requiredKeys =
    [
      ...REQUIRED_CANCELLATION_RECORD_FIELDS,
    ].sort();

  if (
    keys.length !==
      requiredKeys.length ||
    keys.some(
      (
        key,
        index
      ) =>
        key !==
        requiredKeys[index]
    )
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  if (
    value.status !==
      "cancelled" ||
    value.procedureVersion !==
      CANCELLATION_PROCEDURE_VERSION ||
    value.verificationMethod !==
      CANCELLATION_VERIFICATION_METHOD ||
    value.restorationResult !==
      CANCELLATION_RESTORATION_RESULT
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  const cancelledAt =
    readCancellationStoredDate(
      value.cancelledAt
    );

  const expiresAt =
    readCancellationStoredDate(
      value.expiresAt
    );

  if (
    cancelledAt === undefined ||
    expiresAt === undefined
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  const expectedExpiry =
    calculateCancellationExpiry(
      cancelledAt
    );

  if (
    expiresAt.getTime() !==
    expectedExpiry.getTime()
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  return {
    status:
      "valid",
    cancelledAt,
    expiresAt,
  };
}
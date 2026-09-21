import {
    CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
} from "./cancellation-operation-key.js";

export type CancellationRaceState =
  | {
      status: "unconfirmed";
    }
  | {
      status: "confirmed";
      confirmedAt: Date;
    }
  | {
      status: "point-of-no-return-reached";
    }
  | {
      status: "inconsistent-state";
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

export function evaluateCancellationRaceState(
  requestData: unknown,
  expectedOperationKey: string
): CancellationRaceState {
  if (
    !CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      expectedOperationKey
    ) ||
    !isRecord(
      requestData
    )
  ) {
    return {
      status: "inconsistent-state",
    };
  }

  const hasCancellationConfirmedAt =
    hasOwn(
      requestData,
      "cancellationConfirmedAt"
    );

  const hasCancellationOperationKey =
    hasOwn(
      requestData,
      "cancellationOperationKey"
    );

  const hasPointOfNoReturnAt =
    hasOwn(
      requestData,
      "pointOfNoReturnAt"
    );

  const hasPointOfNoReturnOperation =
    hasOwn(
      requestData,
      "pointOfNoReturnOperation"
    );

  const hasAnyCancellationConfirmation =
    hasCancellationConfirmedAt ||
    hasCancellationOperationKey;

  const hasAnyPointOfNoReturn =
    hasPointOfNoReturnAt ||
    hasPointOfNoReturnOperation;

  if (
    hasAnyCancellationConfirmation &&
    hasAnyPointOfNoReturn
  ) {
    return {
      status: "inconsistent-state",
    };
  }

  if (hasAnyCancellationConfirmation) {
    if (
      !hasCancellationConfirmedAt ||
      !hasCancellationOperationKey
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    const confirmedAt =
      readStoredDate(
        requestData.cancellationConfirmedAt
      );

    if (
      confirmedAt === undefined ||
      requestData.cancellationOperationKey !==
        expectedOperationKey
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    return {
      status: "confirmed",
      confirmedAt,
    };
  }

  if (hasAnyPointOfNoReturn) {
    if (
      !hasPointOfNoReturnAt ||
      !hasPointOfNoReturnOperation
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    const pointOfNoReturnAt =
      readStoredDate(
        requestData.pointOfNoReturnAt
      );

    if (
      pointOfNoReturnAt === undefined ||
      typeof requestData.pointOfNoReturnOperation !==
        "string" ||
      requestData.pointOfNoReturnOperation.length ===
        0
    ) {
      return {
        status: "inconsistent-state",
      };
    }

    return {
      status:
        "point-of-no-return-reached",
    };
  }

  return {
    status: "unconfirmed",
  };
}
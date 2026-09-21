import {
    createInitialCancellationOperationState,
    type InitialCancellationOperationState,
} from "./cancellation-operation-state.js";

export const CANCELLATION_CONFIRMATION_FIELDS = {
  confirmedAt:
    "cancellationConfirmedAt",
  operationKey:
    "cancellationOperationKey",
} as const;

export type CancellationConfirmationPlan = {
  activeRequestUpdate: {
    cancellationConfirmedAt: Date;
    cancellationOperationKey: string;
  };
  operationState:
    InitialCancellationOperationState;
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

export function createCancellationConfirmationPlan(
  operationKey: string,
  requestCreatedAt: Date,
  operationStartedAt: Date,
  cancellationRecordId: string
): CancellationConfirmationPlan {
  const normalizedOperationStartedAt =
    requireValidDate(
      operationStartedAt,
      "operationStartedAt"
    );

  const operationState =
    createInitialCancellationOperationState(
      operationKey,
      requestCreatedAt,
      normalizedOperationStartedAt,
      cancellationRecordId
    );

  return {
    activeRequestUpdate: {
      cancellationConfirmedAt:
        new Date(
          normalizedOperationStartedAt.getTime()
        ),
      cancellationOperationKey:
        operationKey,
    },
    operationState,
  };
}
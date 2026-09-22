import {
    CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
} from "./cancellation-operation-key.js";

import {
    isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

import {
    evaluateCancellationRaceState,
} from "./cancellation-race-state.js";

import {
    evaluateCancellationReadState,
    type CancellationReadState,
} from "./cancellation-read-state.js";

export type CoordinatedCancellationReadInput = {
  authenticatedUid: string;
  expectedOperationKey: string;
  profileExists: boolean;
  activeRequestExists: boolean;
  activeRequestData: unknown;
  operationExists: boolean;
  operationData: unknown;
  cancelledRecordExists: boolean;
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

function phaseRequiresActiveRequest(
  phase: unknown
): boolean {
  return (
    phase ===
      "restoration-in-progress" ||
    phase ===
      "profile-restored" ||
    phase ===
      "cancelled-record-created"
  );
}

function phaseRequiresRemovedActiveRequest(
  phase: unknown
): boolean {
  return (
    phase ===
      "active-request-removed" ||
    phase ===
      "temporary-restoration-data-removed" ||
    phase ===
      "completed"
  );
}

function inconsistentState():
CancellationReadState {
  return {
    status:
      "inconsistent-state",
  };
}

export function evaluateCoordinatedCancellationReadState(
  input: CoordinatedCancellationReadInput
): CancellationReadState {
  const {
    authenticatedUid,
    expectedOperationKey,
    profileExists,
    activeRequestExists,
    activeRequestData,
    operationExists,
    operationData,
    cancelledRecordExists,
  } = input;

  if (
    typeof authenticatedUid !== "string" ||
    authenticatedUid.length === 0 ||
    !CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      expectedOperationKey
    )
  ) {
    return inconsistentState();
  }

  if (!operationExists) {
    if (activeRequestExists) {
      const raceState =
        evaluateCancellationRaceState(
          activeRequestData,
          expectedOperationKey
        );

      if (
        raceState.status ===
        "confirmed" ||
        raceState.status ===
        "inconsistent-state"
      ) {
        return inconsistentState();
      }

      if (
        raceState.status ===
        "point-of-no-return-reached"
      ) {
        return {
          status:
            "point-of-no-return-reached",
        };
      }
    }

    return evaluateCancellationReadState(
      authenticatedUid,
      profileExists,
      activeRequestExists,
      activeRequestData,
      false,
      undefined,
      cancelledRecordExists
    );
  }

  if (
    !isRecord(
      operationData
    ) ||
    !isCancellationOperationPhase(
      operationData.phase
    ) ||
    operationData.operationKey !==
      expectedOperationKey
  ) {
    return inconsistentState();
  }

  const phase =
    operationData.phase;

  if (
    phase === "not-started"
  ) {
    return inconsistentState();
  }

  if (
    phaseRequiresActiveRequest(
      phase
    )
  ) {
    if (!activeRequestExists) {
      return inconsistentState();
    }

    const raceState =
      evaluateCancellationRaceState(
        activeRequestData,
        expectedOperationKey
      );

    if (
      raceState.status !==
      "confirmed"
    ) {
      return inconsistentState();
    }

    const operationStartedAt =
      readStoredDate(
        operationData.operationStartedAt
      );

    if (
      operationStartedAt === undefined ||
      raceState.confirmedAt.getTime() !==
        operationStartedAt.getTime()
    ) {
      return inconsistentState();
    }
  }

  if (
    phaseRequiresRemovedActiveRequest(
      phase
    ) &&
    activeRequestExists
  ) {
    return inconsistentState();
  }

  return evaluateCancellationReadState(
    authenticatedUid,
    profileExists,
    activeRequestExists,
    activeRequestData,
    true,
    operationData,
    cancelledRecordExists
  );
}
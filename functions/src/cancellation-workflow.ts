import type {
    Firestore,
} from "firebase-admin/firestore";

import {
    removeActiveCancellationRequestInTransaction,
} from "./cancellation-active-request-remove-transaction.js";

import {
    confirmCancellationInTransaction,
} from "./cancellation-confirm-transaction.js";

import {
    isCancellationOperationPhase,
} from "./cancellation-operation-state.js";

import {
    completeCancellationOperationInTransaction,
} from "./cancellation-operation-complete-transaction.js";

import {
    restoreCancellationProfileInTransaction,
} from "./cancellation-profile-restore-transaction.js";

import {
    createCancellationRecordInTransaction,
} from "./cancellation-record-create-transaction.js";

import {
    removeTemporaryRestorationDataInTransaction,
} from "./cancellation-temporary-data-remove-transaction.js";

import {
    createCancellationDocumentReferences,
    readCancellationStateInTransaction,
} from "./cancellation-transaction.js";

export const MAX_CANCELLATION_WORKFLOW_STEPS =
  6;

export type CancellationWorkflowResult =
  | {
      status:
        "completed";
      stepsExecuted:
        number;
    }
  | {
      status:
        | "profile-not-found"
        | "request-not-found"
        | "not-cancellable"
        | "point-of-no-return-reached"
        | "inconsistent-state"
        | "iteration-limit-reached";
      stepsExecuted:
        number;
    };

type WorkflowFailureStatus =
  Exclude<
    CancellationWorkflowResult["status"],
    "completed" |
      "iteration-limit-reached"
  >;

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function mapFailureStatus(
  status: string
): WorkflowFailureStatus {
  switch (status) {
    case "profile-not-found":
    case "request-not-found":
    case "not-cancellable":
    case "point-of-no-return-reached":
    case "inconsistent-state":
      return status;

    default:
      return "inconsistent-state";
  }
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

export async function runCancellationWorkflow(
  firestore: Firestore,
  uid: string,
  opaqueLookupKey: string,
  cancellationRecordId: string,
  operationStartedAt: Date,
  cancelledAt: Date
): Promise<CancellationWorkflowResult> {
  const normalizedOperationStartedAt =
    requireValidDate(
      operationStartedAt,
      "operationStartedAt"
    );

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

  let stepsExecuted =
    0;

  while (
    stepsExecuted <
    MAX_CANCELLATION_WORKFLOW_STEPS
  ) {
    const readState =
      await readCancellationStateInTransaction(
        firestore,
        uid,
        opaqueLookupKey,
        cancellationRecordId
      );

    if (
      readState.status ===
      "cancelled"
    ) {
      return {
        status:
          "completed",
        stepsExecuted,
      };
    }

    if (
      readState.status ===
      "ready"
    ) {
      const result =
        await confirmCancellationInTransaction(
          firestore,
          uid,
          opaqueLookupKey,
          cancellationRecordId,
          new Date(
            normalizedOperationStartedAt
              .getTime()
          )
        );

      stepsExecuted +=
        1;

      if (
        result.status !==
          "confirmed" &&
        result.status !==
          "already-confirmed"
      ) {
        return {
          status:
            mapFailureStatus(
              result.status
            ),
          stepsExecuted,
        };
      }

      continue;
    }

    if (
      readState.status !==
      "restoration-pending"
    ) {
      return {
        status:
          mapFailureStatus(
            readState.status
          ),
        stepsExecuted,
      };
    }

    const operationSnapshot =
      await references.operation.get();

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
      ) ||
      operationData.operationKey !==
        opaqueLookupKey ||
      operationData.cancellationRecordId !==
        cancellationRecordId
    ) {
      return {
        status:
          "inconsistent-state",
        stepsExecuted,
      };
    }

    switch (
      operationData.phase
    ) {
      case "restoration-in-progress": {
        const result =
          await restoreCancellationProfileInTransaction(
            firestore,
            uid,
            opaqueLookupKey,
            cancellationRecordId
          );

        stepsExecuted +=
          1;

        if (
          result.status !==
            "profile-restored" &&
          result.status !==
            "already-restored"
        ) {
          return {
            status:
              mapFailureStatus(
                result.status
              ),
            stepsExecuted,
          };
        }

        break;
      }

      case "profile-restored": {
        const result =
          await createCancellationRecordInTransaction(
            firestore,
            uid,
            opaqueLookupKey,
            cancellationRecordId,
            new Date(
              normalizedCancelledAt
                .getTime()
            )
          );

        stepsExecuted +=
          1;

        if (
          result.status !==
            "cancelled-record-created" &&
          result.status !==
            "cancelled-record-recovered" &&
          result.status !==
            "already-created"
        ) {
          return {
            status:
              mapFailureStatus(
                result.status
              ),
            stepsExecuted,
          };
        }

        break;
      }

      case "cancelled-record-created": {
        const result =
          await removeActiveCancellationRequestInTransaction(
            firestore,
            uid,
            opaqueLookupKey,
            cancellationRecordId
          );

        stepsExecuted +=
          1;

        if (
          result.status !==
            "active-request-removed" &&
          result.status !==
            "already-removed"
        ) {
          return {
            status:
              mapFailureStatus(
                result.status
              ),
            stepsExecuted,
          };
        }

        break;
      }

      case "active-request-removed": {
        const result =
          await removeTemporaryRestorationDataInTransaction(
            firestore,
            uid,
            opaqueLookupKey,
            cancellationRecordId
          );

        stepsExecuted +=
          1;

        if (
          result.status !==
            "temporary-restoration-data-removed" &&
          result.status !==
            "already-removed"
        ) {
          return {
            status:
              mapFailureStatus(
                result.status
              ),
            stepsExecuted,
          };
        }

        break;
      }

      case "temporary-restoration-data-removed": {
        const result =
          await completeCancellationOperationInTransaction(
            firestore,
            uid,
            opaqueLookupKey,
            cancellationRecordId
          );

        stepsExecuted +=
          1;

        if (
          result.status ===
            "completed" ||
          result.status ===
            "already-completed"
        ) {
          return {
            status:
              "completed",
            stepsExecuted,
          };
        }

        return {
          status:
            mapFailureStatus(
              result.status
            ),
          stepsExecuted,
        };
      }

      case "completed":
        return {
          status:
            "completed",
          stepsExecuted,
        };

      default:
        return {
          status:
            "inconsistent-state",
          stepsExecuted,
        };
    }
  }

  return {
    status:
      "iteration-limit-reached",
    stepsExecuted,
  };
}
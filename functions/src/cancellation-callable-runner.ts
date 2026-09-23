import type {
  Firestore,
} from "firebase-admin/firestore";

import {
  runCancellationWorkflow,
} from "./cancellation-workflow.js";

import {
  resolveCancellationWorkflowIdentifiers,
} from "./cancellation-workflow-identifiers.js";

export const MAX_CANCELLATION_CALLABLE_ATTEMPTS =
  2;

export type CancellationCallableRunnerResult =
  | {
      status:
        "completed";
    }
  | {
      status:
        "not-cancellable";
    }
  | {
      status:
        | "profile-not-found"
        | "inconsistent-state"
        | "temporarily-unavailable";
    };

function requireNonEmptyString(
  value: string,
  name: string
): string {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    throw new TypeError(
      `${name} must be a non-empty string.`
    );
  }

  return value;
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

export async function runCancellationCallableWorkflow(
  firestore: Firestore,
  uid: string,
  secret: string,
  requestedAt: Date
): Promise<CancellationCallableRunnerResult> {
  const normalizedUid =
    requireNonEmptyString(
      uid,
      "uid"
    );

  const normalizedSecret =
    requireNonEmptyString(
      secret,
      "secret"
    );

  const normalizedRequestedAt =
    requireValidDate(
      requestedAt,
      "requestedAt"
    );

  for (
    let attempt = 1;
    attempt <=
      MAX_CANCELLATION_CALLABLE_ATTEMPTS;
    attempt += 1
  ) {
    const identifiers =
      await resolveCancellationWorkflowIdentifiers(
        firestore,
        normalizedUid,
        normalizedSecret
      );

    if (
      identifiers.status ===
      "inconsistent-state"
    ) {
      return {
        status:
          "inconsistent-state",
      };
    }

    const workflowResult =
      await runCancellationWorkflow(
        firestore,
        normalizedUid,
        identifiers.opaqueLookupKey,
        identifiers.cancellationRecordId,
        new Date(
          normalizedRequestedAt.getTime()
        ),
        new Date(
          normalizedRequestedAt.getTime()
        )
      );

    switch (
      workflowResult.status
    ) {
      case "completed":
        return {
          status:
            "completed",
        };

      case "request-not-found":
      case "not-cancellable":
      case "point-of-no-return-reached":
        return {
          status:
            "not-cancellable",
        };

      case "profile-not-found":
        return {
          status:
            "profile-not-found",
        };

      case "iteration-limit-reached":
        return {
          status:
            "temporarily-unavailable",
        };

      case "inconsistent-state":
        if (
          attempt <
            MAX_CANCELLATION_CALLABLE_ATTEMPTS &&
          identifiers.status ===
            "new"
        ) {
          continue;
        }

        return {
          status:
            "inconsistent-state",
        };
    }
  }

  return {
    status:
      "temporarily-unavailable",
  };
}
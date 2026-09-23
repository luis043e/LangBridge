import {
  getApps,
  initializeApp,
} from "firebase-admin/app";
import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  evaluateDeletionRequest,
} from "./deletion-request-state.js";
import {
  evaluateRecentAuthentication,
} from "./recent-authentication.js";

import {
  runCancellationCallableWorkflow,
} from "./cancellation-callable-runner.js";

import { setGlobalOptions } from "firebase-functions/v2";

import {
  defineSecret,
} from "firebase-functions/params";

import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

if (getApps().length === 0) {
  initializeApp();
}

const firestore =
  getFirestore();

export const cancellationOperationSecret =
  defineSecret(
    "CANCELLATION_OPERATION_SECRET"
  );

setGlobalOptions({
  region: "us-central1",
  maxInstances: 1,
  concurrency: 1,
});

function hasUnknownInput(
  data: unknown
): boolean {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return true;
  }

  return (
    Object.keys(
      data as Record<string, unknown>
    ).length !== 0
  );
}

function requireRecentAuthentication(
  authTime: unknown
): void {
  const serverTime =
    Math.floor(
      Date.now() / 1000
    );

  const result =
    evaluateRecentAuthentication(
      authTime,
      serverTime
    );

  if (result.valid) {
    return;
  }

  throw new HttpsError(
    "failed-precondition",
    "Recent authentication is required.",
    {
      reason: result.reason,
    }
  );
}

async function executeCancelAccountDeletion(
  uid: string
): Promise<{
  status:
    | "completed"
    | "not-cancellable";
}> {
  try {
    const result =
      await runCancellationCallableWorkflow(
        firestore,
        uid,
        cancellationOperationSecret.value(),
        new Date()
      );

    switch (
      result.status
    ) {
      case "completed":
        return {
          status:
            "completed",
        };

      case "not-cancellable":
        return {
          status:
            "not-cancellable",
        };

      case "profile-not-found":
        throw new HttpsError(
          "failed-precondition",
          "The account profile is unavailable."
        );

      case "temporarily-unavailable":
        throw new HttpsError(
          "unavailable",
          "The cancellation could not be completed at this time."
        );

      case "inconsistent-state":
        throw new HttpsError(
          "internal",
          "The cancellation could not be completed."
        );
    }
  } catch (error: unknown) {
    if (
      error instanceof HttpsError
    ) {
      throw error;
    }

    console.error(
      "cancelAccountDeletion failed.",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",
      }
    );

    throw new HttpsError(
      "internal",
      "The cancellation could not be completed."
    );
  }
}

function validateCallableRequest(
  request: {
    auth?: {
      uid: string;
      token: {
        auth_time?: unknown;
      };
    };
    data: unknown;
  }
): {
  uid: string;
} {
  if (request.auth === undefined) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication is required."
    );
  }

  if (hasUnknownInput(request.data)) {
    throw new HttpsError(
      "invalid-argument",
      "The request contains unsupported data."
    );
  }

  requireRecentAuthentication(
    request.auth.token.auth_time
  );

  return {
    uid: request.auth.uid,
  };
}

export const cancellationBackendProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  (request) => {
    validateCallableRequest(
      request
    );

    return {
      status: "ready",
    };
  }
);

export const cancellationRequestStateProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  async (request) => {
    const {
      uid,
    } = validateCallableRequest(
      request
    );

    const snapshot =
      await firestore
        .collection(
          "accountDeletionRequests"
        )
        .doc(uid)
        .get();

    const result =
      evaluateDeletionRequest(
        snapshot.exists,
        snapshot.exists
          ? snapshot.data()
          : undefined,
        uid
      );

    return {
      status: result.status,
    };
  }
);
export const cancelAccountDeletion =
  onCall(
    {
      timeoutSeconds:
        60,
      secrets: [
        cancellationOperationSecret,
      ],
    },
    async (request) => {
      const {
        uid,
      } = validateCallableRequest(
        request
      );

      return executeCancelAccountDeletion(
        uid
      );
    }
  );
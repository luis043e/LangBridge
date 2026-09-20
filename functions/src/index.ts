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

import { setGlobalOptions } from "firebase-functions/v2";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

if (getApps().length === 0) {
  initializeApp();
}

const firestore =
  getFirestore();

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
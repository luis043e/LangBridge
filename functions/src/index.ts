import {
  evaluateRecentAuthentication,
} from "./recent-authentication.js";

import { setGlobalOptions } from "firebase-functions/v2";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

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

export const cancellationBackendProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  (request) => {
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
      status: "ready",
    };
  }
);
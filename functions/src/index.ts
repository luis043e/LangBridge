import { setGlobalOptions } from "firebase-functions/v2";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

const RECENT_AUTH_WINDOW_SECONDS = 5 * 60;
const FUTURE_AUTH_TOLERANCE_SECONDS = 30;

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
  if (
    typeof authTime !== "number" ||
    !Number.isFinite(authTime) ||
    !Number.isInteger(authTime) ||
    authTime <= 0
  ) {
    throw new HttpsError(
      "failed-precondition",
      "Recent authentication is required.",
      {
        reason:
          "identity-verification-required",
      }
    );
  }

  const serverTime =
    Math.floor(
      Date.now() / 1000
    );

  const authenticationAge =
    serverTime - authTime;

  if (
    authenticationAge <
    -FUTURE_AUTH_TOLERANCE_SECONDS
  ) {
    throw new HttpsError(
      "failed-precondition",
      "Recent authentication is required.",
      {
        reason:
          "identity-verification-required",
      }
    );
  }

  if (
    authenticationAge >
    RECENT_AUTH_WINDOW_SECONDS
  ) {
    throw new HttpsError(
      "failed-precondition",
      "Recent authentication is required.",
      {
        reason:
          "recent-session-required",
      }
    );
  }
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
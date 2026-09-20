export const RECENT_AUTH_WINDOW_SECONDS =
  5 * 60;

export const FUTURE_AUTH_TOLERANCE_SECONDS =
  30;

export type RecentAuthenticationResult =
  | {
      valid: true;
    }
  | {
      valid: false;
      reason:
        | "identity-verification-required"
        | "recent-session-required";
    };

export function evaluateRecentAuthentication(
  authTime: unknown,
  serverTime: number
): RecentAuthenticationResult {
  if (
    typeof authTime !== "number" ||
    !Number.isFinite(authTime) ||
    !Number.isInteger(authTime) ||
    authTime <= 0
  ) {
    return {
      valid: false,
      reason:
        "identity-verification-required",
    };
  }

  if (
    !Number.isFinite(serverTime) ||
    !Number.isInteger(serverTime) ||
    serverTime <= 0
  ) {
    return {
      valid: false,
      reason:
        "identity-verification-required",
    };
  }

  const authenticationAge =
    serverTime - authTime;

  if (
    authenticationAge <
    -FUTURE_AUTH_TOLERANCE_SECONDS
  ) {
    return {
      valid: false,
      reason:
        "identity-verification-required",
    };
  }

  if (
    authenticationAge >
    RECENT_AUTH_WINDOW_SECONDS
  ) {
    return {
      valid: false,
      reason:
        "recent-session-required",
    };
  }

  return {
    valid: true,
  };
}
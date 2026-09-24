export type AccountDeletionErrorCategory =
  | 'unauthenticated'
  | 'recent-authentication-required'
  | 'invalid-credential'
  | 'temporarily-unavailable'
  | 'internal'
  | 'unknown';

function readErrorCode(
  error: unknown
): string | null {
  if (
    typeof error !== 'object' ||
    error === null ||
    !('code' in error)
  ) {
    return null;
  }

  const code =
    error.code;

  return typeof code === 'string'
    ? code
    : null;
}

export function classifyAccountDeletionError(
  error: unknown
): AccountDeletionErrorCategory {
  const code =
    readErrorCode(error);

  switch (code) {
    case 'functions/unauthenticated':
    case 'auth/user-token-expired':
    case 'auth/user-disabled':
      return 'unauthenticated';

    case 'functions/failed-precondition':
    case 'auth/requires-recent-login':
      return 'recent-authentication-required';

    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-mismatch':
      return 'invalid-credential';

    case 'functions/unavailable':
    case 'functions/deadline-exceeded':
    case 'auth/network-request-failed':
    case 'auth/too-many-requests':
      return 'temporarily-unavailable';

    case 'functions/internal':
      return 'internal';

    default:
      return 'unknown';
  }
}
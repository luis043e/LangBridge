import {
    createHmac,
} from "node:crypto";

const MINIMUM_SECRET_LENGTH = 32;

export const CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN =
  /^[a-f0-9]{64}$/;

function validateNonEmptyString(
  value: string,
  name: string
): void {
  if (
    typeof value !== "string" ||
    value.length === 0
  ) {
    throw new TypeError(
      `${name} must be a non-empty string.`
    );
  }
}

export function createCancellationOperationLookupKey(
  uid: string,
  secret: string
): string {
  validateNonEmptyString(
    uid,
    "uid"
  );

  if (
    typeof secret !== "string" ||
    secret.length <
      MINIMUM_SECRET_LENGTH
  ) {
    throw new TypeError(
      "secret must contain at least 32 characters."
    );
  }

  const lookupKey =
    createHmac(
      "sha256",
      secret
    )
      .update(
        `langbridge-account-deletion-cancellation:${uid}`,
        "utf8"
      )
      .digest(
        "hex"
      );

  if (
    !CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      lookupKey
    )
  ) {
    throw new Error(
      "Could not generate a valid cancellation operation lookup key."
    );
  }

  return lookupKey;
}
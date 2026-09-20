import {
    randomBytes,
} from "node:crypto";

const RANDOM_BYTE_LENGTH = 24;

export const CANCELLATION_RECORD_ID_PATTERN =
  /^[A-Za-z0-9_-]{32}$/;

export function createCancellationRecordId(): string {
  const cancellationRecordId =
    randomBytes(
      RANDOM_BYTE_LENGTH
    ).toString(
      "base64url"
    );

  if (
    !CANCELLATION_RECORD_ID_PATTERN.test(
      cancellationRecordId
    )
  ) {
    throw new Error(
      "Could not generate a valid cancellation record id."
    );
  }

  return cancellationRecordId;
}
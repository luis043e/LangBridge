export type MessageNotificationInput = {
  senderId: string;
  text: string;
};

export type MessageNotificationConversation = {
  connectionId: string;
  senderId: string;
  recipientId: string;
};

const maximumUserIdLength =
  128;

const maximumConversationIdLength =
  256;

const maximumMessageLength =
  1000;

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[]
): boolean {
  const receivedKeys =
    Object.keys(value).sort();

  const normalizedExpectedKeys =
    [...expectedKeys].sort();

  return (
    receivedKeys.length ===
      normalizedExpectedKeys.length &&
    receivedKeys.every(
      (key, index) =>
        key ===
        normalizedExpectedKeys[index]
    )
  );
}

function isBoundedNonEmptyString(
  value: unknown,
  maximumLength: number
): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximumLength
  );
}

function hasDuplicateValues(
  values: readonly string[]
): boolean {
  return (
    new Set(values).size !==
    values.length
  );
}

export function parseMessageNotificationInput(
  value: unknown
): MessageNotificationInput | null {
  if (!isPlainObject(value)) {
    return null;
  }

  if (
    !hasExactKeys(
      value,
      [
        "senderId",
        "text",
        "createdAt",
        "readAt",
      ]
    )
  ) {
    return null;
  }

  if (
    !isBoundedNonEmptyString(
      value.senderId,
      maximumUserIdLength
    )
  ) {
    return null;
  }

  if (
    !isBoundedNonEmptyString(
      value.text,
      maximumMessageLength
    )
  ) {
    return null;
  }

  if (
    value.createdAt === null ||
    value.createdAt === undefined
  ) {
    return null;
  }

  if (value.readAt !== null) {
    return null;
  }

  return {
    senderId:
      value.senderId,
    text:
      value.text,
  };
}

export function parseMessageNotificationConversation(
  value: unknown,
  conversationId: string,
  senderId: string
): MessageNotificationConversation | null {
  if (
    !isBoundedNonEmptyString(
      conversationId,
      maximumConversationIdLength
    ) ||
    !isBoundedNonEmptyString(
      senderId,
      maximumUserIdLength
    )
  ) {
    return null;
  }

  if (!isPlainObject(value)) {
    return null;
  }

  if (
    !hasExactKeys(
      value,
      [
        "connectionId",
        "participants",
        "createdAt",
        "updatedAt",
      ]
    )
  ) {
    return null;
  }

  if (
    value.connectionId !==
    conversationId
  ) {
    return null;
  }

  if (
    !Array.isArray(
      value.participants
    ) ||
    value.participants.length !== 2
  ) {
    return null;
  }

  const participants =
    value.participants;

  if (
    !participants.every(
      (participantId) =>
        isBoundedNonEmptyString(
          participantId,
          maximumUserIdLength
        )
    )
  ) {
    return null;
  }

  const normalizedParticipants =
    participants as string[];

  if (
    hasDuplicateValues(
      normalizedParticipants
    ) ||
    !normalizedParticipants.includes(
      senderId
    )
  ) {
    return null;
  }

  const recipientId =
    normalizedParticipants.find(
      (participantId) =>
        participantId !== senderId
    );

  if (!recipientId) {
    return null;
  }

  return {
    connectionId:
      conversationId,
    senderId,
    recipientId,
  };
}

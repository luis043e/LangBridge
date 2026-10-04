export type MessageNotificationBlockReason =
  | "allowed"
  | "blocked-private-sender"
  | "blocked-private-recipient"
  | "blocked-legacy-sender"
  | "blocked-legacy-recipient";

export type MessageNotificationBlockStateInput = {
  senderId: string;
  recipientId: string;
  privateSenderBlocksRecipient: boolean;
  privateRecipientBlocksSender: boolean;
  senderBlockedUserIds: unknown;
  recipientBlockedUserIds: unknown;
};

const maximumUserIdLength =
  128;

function isValidUserId(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.length <= maximumUserIdLength
  );
}

function normalizeBlockedUserIds(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalizedIds =
    value.filter(
      (blockedUserId):
        blockedUserId is string =>
          isValidUserId(
            blockedUserId
          )
    );

  return [
    ...new Set(
      normalizedIds
    ),
  ];
}

export function evaluateMessageNotificationBlockState(
  input: MessageNotificationBlockStateInput
): MessageNotificationBlockReason {
  if (
    !isValidUserId(
      input.senderId
    ) ||
    !isValidUserId(
      input.recipientId
    ) ||
    input.senderId ===
      input.recipientId
  ) {
    return "blocked-private-sender";
  }

  if (
    input
      .privateSenderBlocksRecipient
  ) {
    return "blocked-private-sender";
  }

  if (
    input
      .privateRecipientBlocksSender
  ) {
    return "blocked-private-recipient";
  }

  const senderBlockedUserIds =
    normalizeBlockedUserIds(
      input.senderBlockedUserIds
    );

  if (
    senderBlockedUserIds.includes(
      input.recipientId
    )
  ) {
    return "blocked-legacy-sender";
  }

  const recipientBlockedUserIds =
    normalizeBlockedUserIds(
      input.recipientBlockedUserIds
    );

  if (
    recipientBlockedUserIds.includes(
      input.senderId
    )
  ) {
    return "blocked-legacy-recipient";
  }

  return "allowed";
}
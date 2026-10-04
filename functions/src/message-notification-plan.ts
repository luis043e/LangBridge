export type MessageNotificationPlatform =
  | "android"
  | "ios";

export type MessageNotificationInstallationInput = {
  installationId: string;
  data: unknown;
};

export type MessageNotificationDestination = {
  installationId: string;
  token: string;
  platform: MessageNotificationPlatform;
};

export type MessageNotificationPayload = {
  title: string;
  body: string;
  sound: "default";
  priority: "high";
  channelId: "messages";
  data: {
    type: "chat-message";
    conversationId: string;
    senderId: string;
  };
};

export type MessageNotificationPlan = {
  destinations:
    MessageNotificationDestination[];
  payload:
    MessageNotificationPayload;
};

const maximumInstallationIdLength =
  128;

const maximumTokenLength =
  512;

const maximumUserIdLength =
  128;

const maximumConversationIdLength =
  256;

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
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

function isNotificationPlatform(
  value: unknown
): value is MessageNotificationPlatform {
  return (
    value === "android" ||
    value === "ios"
  );
}

function isExpoPushToken(
  value: unknown
): value is string {
  if (
    !isBoundedNonEmptyString(
      value,
      maximumTokenLength
    )
  ) {
    return false;
  }

  return (
    /^ExponentPushToken\[[^\]\s]+\]$/.test(
      value
    ) ||
    /^ExpoPushToken\[[^\]\s]+\]$/.test(
      value
    )
  );
}

function parseNotificationDestination(
  installation:
    MessageNotificationInstallationInput
): MessageNotificationDestination | null {
  if (
    !isBoundedNonEmptyString(
      installation.installationId,
      maximumInstallationIdLength
    )
  ) {
    return null;
  }

  if (!isPlainObject(installation.data)) {
    return null;
  }

  if (
    installation.data.enabled !== true ||
    !isExpoPushToken(
      installation.data.token
    ) ||
    !isNotificationPlatform(
      installation.data.platform
    )
  ) {
    return null;
  }

  return {
    installationId:
      installation.installationId,
    token:
      installation.data.token,
    platform:
      installation.data.platform,
  };
}

export function createMessageNotificationPlan(
  installations:
    readonly MessageNotificationInstallationInput[],
  conversationId: string,
  senderId: string
): MessageNotificationPlan | null {
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

  const destinations:
    MessageNotificationDestination[] =
      [];

  const usedTokens =
    new Set<string>();

  for (const installation of installations) {
    const destination =
      parseNotificationDestination(
        installation
      );

    if (
      !destination ||
      usedTokens.has(
        destination.token
      )
    ) {
      continue;
    }

    usedTokens.add(
      destination.token
    );

    destinations.push(
      destination
    );
  }

  return {
    destinations,
    payload: {
      title:
        "Nuevo mensaje",
      body:
        "Tienes un mensaje nuevo en LangBridge.",
      sound:
        "default",
      priority:
        "high",
      channelId:
        "messages",
      data: {
        type:
          "chat-message",
        conversationId,
        senderId,
      },
    },
  };
}
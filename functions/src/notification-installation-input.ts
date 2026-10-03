export type NotificationPlatform =
  | "android"
  | "ios";

export type RegisterNotificationInstallationInput = {
  installationId: string;
  token: string;
  platform: NotificationPlatform;
};

export type RemoveNotificationInstallationInput = {
  installationId: string;
};

function requirePlainObject(
  data: unknown
): Record<string, unknown> {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    throw new Error(
      "The notification installation input must be an object."
    );
  }

  return data as Record<string, unknown>;
}

function requireExactKeys(
  data: Record<string, unknown>,
  expectedKeys: readonly string[]
): void {
  const receivedKeys =
    Object.keys(data).sort();

  const normalizedExpectedKeys =
    [...expectedKeys].sort();

  if (
    receivedKeys.length !==
      normalizedExpectedKeys.length ||
    receivedKeys.some(
      (key, index) =>
        key !==
        normalizedExpectedKeys[index]
    )
  ) {
    throw new Error(
      "The notification installation input contains unsupported fields."
    );
  }
}

function requireBoundedString(
  value: unknown,
  fieldName: string,
  maximumLength: number
): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length > maximumLength
  ) {
    throw new Error(
      `${fieldName} is invalid.`
    );
  }

  return value;
}

function requireInstallationId(
  value: unknown
): string {
  const installationId =
    requireBoundedString(
      value,
      "installationId",
      128
    );

  if (
    !/^[A-Za-z0-9_-]+$/.test(
      installationId
    )
  ) {
    throw new Error(
      "installationId is invalid."
    );
  }

  return installationId;
}

function requireNotificationToken(
  value: unknown
): string {
  return requireBoundedString(
    value,
    "token",
    512
  );
}

function requireNotificationPlatform(
  value: unknown
): NotificationPlatform {
  if (
    value !== "android" &&
    value !== "ios"
  ) {
    throw new Error(
      "platform is invalid."
    );
  }

  return value;
}

export function parseRegisterNotificationInstallationInput(
  data: unknown
): RegisterNotificationInstallationInput {
  const input =
    requirePlainObject(data);

  requireExactKeys(
    input,
    [
      "installationId",
      "token",
      "platform",
    ]
  );

  return {
    installationId:
      requireInstallationId(
        input.installationId
      ),
    token:
      requireNotificationToken(
        input.token
      ),
    platform:
      requireNotificationPlatform(
        input.platform
      ),
  };
}

export function parseRemoveNotificationInstallationInput(
  data: unknown
): RemoveNotificationInstallationInput {
  const input =
    requirePlainObject(data);

  requireExactKeys(
    input,
    [
      "installationId",
    ]
  );

  return {
    installationId:
      requireInstallationId(
        input.installationId
      ),
  };
}
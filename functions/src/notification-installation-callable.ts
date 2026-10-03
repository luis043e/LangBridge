import type {
    Firestore,
} from "firebase-admin/firestore";

import {
    HttpsError,
} from "firebase-functions/v2/https";

import {
    parseRegisterNotificationInstallationInput,
    parseRemoveNotificationInstallationInput,
} from "./notification-installation-input.js";

import {
    registerNotificationInstallationInStore,
    removeNotificationInstallationFromStore,
} from "./notification-installation-store.js";

export type RegisterNotificationInstallationPublicResult = {
  status: "registered";
};

export type RemoveNotificationInstallationPublicResult = {
  status:
    | "removed"
    | "not-found";
};

function convertInputError(
  error: unknown
): never {
  if (error instanceof Error) {
    throw new HttpsError(
      "invalid-argument",
      error.message
    );
  }

  throw new HttpsError(
    "invalid-argument",
    "The notification installation input is invalid."
  );
}

export async function runRegisterNotificationInstallationCallable(
  firestore: Firestore,
  uid: string,
  data: unknown
): Promise<RegisterNotificationInstallationPublicResult> {
  let input:
    ReturnType<
      typeof parseRegisterNotificationInstallationInput
    >;

  try {
    input =
      parseRegisterNotificationInstallationInput(
        data
      );
  } catch (error: unknown) {
    return convertInputError(
      error
    );
  }

  try {
    return await registerNotificationInstallationInStore(
      firestore,
      {
        uid,
        installationId:
          input.installationId,
        token:
          input.token,
        platform:
          input.platform,
      }
    );
  } catch (error: unknown) {
    console.error(
      "registerNotificationInstallation failed.",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",
      }
    );

    throw new HttpsError(
      "internal",
      "The notification installation could not be registered."
    );
  }
}

export async function runRemoveNotificationInstallationCallable(
  firestore: Firestore,
  uid: string,
  data: unknown
): Promise<RemoveNotificationInstallationPublicResult> {
  let input:
    ReturnType<
      typeof parseRemoveNotificationInstallationInput
    >;

  try {
    input =
      parseRemoveNotificationInstallationInput(
        data
      );
  } catch (error: unknown) {
    return convertInputError(
      error
    );
  }

  try {
    return await removeNotificationInstallationFromStore(
      firestore,
      {
        uid,
        installationId:
          input.installationId,
      }
    );
  } catch (error: unknown) {
    console.error(
      "removeNotificationInstallation failed.",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",
      }
    );

    throw new HttpsError(
      "internal",
      "The notification installation could not be removed."
    );
  }
}
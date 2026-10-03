import {
  FieldValue,
  Firestore,
} from "firebase-admin/firestore";

import {
  NotificationPlatform,
} from "./notification-installation-input.js";

export type RegisterNotificationInstallationStoreInput = {
  uid: string;
  installationId: string;
  token: string;
  platform: NotificationPlatform;
};

export type RemoveNotificationInstallationStoreInput = {
  uid: string;
  installationId: string;
};

export type RegisterNotificationInstallationStoreResult = {
  status: "registered";
};

export type RemoveNotificationInstallationStoreResult = {
  status:
    | "removed"
    | "not-found";
};

function getInstallationReference(
  firestore: Firestore,
  uid: string,
  installationId: string
) {
  return firestore
    .collection(
      "userNotificationTokens"
    )
    .doc(uid)
    .collection(
      "installations"
    )
    .doc(installationId);
}

export async function registerNotificationInstallationInStore(
  firestore: Firestore,
  input: RegisterNotificationInstallationStoreInput
): Promise<RegisterNotificationInstallationStoreResult> {
  const installationReference =
    getInstallationReference(
      firestore,
      input.uid,
      input.installationId
    );

  await firestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(
          installationReference
        );

      if (snapshot.exists) {
        transaction.update(
          installationReference,
          {
            token: input.token,
            platform: input.platform,
            enabled: true,
            updatedAt:
              FieldValue.serverTimestamp(),
          }
        );

        return;
      }

      transaction.create(
        installationReference,
        {
          token: input.token,
          platform: input.platform,
          enabled: true,
          createdAt:
            FieldValue.serverTimestamp(),
          updatedAt:
            FieldValue.serverTimestamp(),
        }
      );
    }
  );

  return {
    status: "registered",
  };
}

export async function removeNotificationInstallationFromStore(
  firestore: Firestore,
  input: RemoveNotificationInstallationStoreInput
): Promise<RemoveNotificationInstallationStoreResult> {
  const installationReference =
    getInstallationReference(
      firestore,
      input.uid,
      input.installationId
    );

  const snapshot =
    await installationReference.get();

  if (!snapshot.exists) {
    return {
      status: "not-found",
    };
  }

  await installationReference.delete();

  return {
    status: "removed",
  };
}
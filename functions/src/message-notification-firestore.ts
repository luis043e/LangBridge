import {
  Firestore,
} from "firebase-admin/firestore";

import {
  type MessageNotificationInstallationInput,
} from "./message-notification-plan.js";

import {
  type MessageNotificationBlockReadResult,
} from "./message-notification-workflow.js";

import {
  removeNotificationInstallationFromStore,
} from "./notification-installation-store.js";

export type MessageNotificationFirestoreDependencies = {
  readConversation: (
    conversationId: string
  ) => Promise<unknown | null>;

  readBlockState: (
    senderId: string,
    recipientId: string
  ) => Promise<
    MessageNotificationBlockReadResult
  >;

  readInstallations: (
    recipientId: string
  ) => Promise<
    MessageNotificationInstallationInput[]
  >;

  removeInvalidInstallation: (
    recipientId: string,
    installationId: string
  ) => Promise<void>;
};

export function createMessageNotificationFirestoreDependencies(
  firestore: Firestore
): MessageNotificationFirestoreDependencies {
  return {
    readConversation:
      async (
        conversationId: string
      ): Promise<unknown | null> => {
        const conversationSnapshot =
          await firestore
            .collection(
              "conversations"
            )
            .doc(conversationId)
            .get();

        if (
          !conversationSnapshot.exists
        ) {
          return null;
        }

        return conversationSnapshot.data();
      },

    readBlockState:
      async (
        senderId: string,
        recipientId: string
      ): Promise<
        MessageNotificationBlockReadResult
      > => {
        const privateSenderBlockReference =
          firestore
            .collection(
              "userBlocks"
            )
            .doc(senderId)
            .collection(
              "blockedUsers"
            )
            .doc(recipientId);

        const privateRecipientBlockReference =
          firestore
            .collection(
              "userBlocks"
            )
            .doc(recipientId)
            .collection(
              "blockedUsers"
            )
            .doc(senderId);

        const senderUserReference =
          firestore
            .collection(
              "users"
            )
            .doc(senderId);

        const recipientUserReference =
          firestore
            .collection(
              "users"
            )
            .doc(recipientId);

        const [
          privateSenderBlockSnapshot,
          privateRecipientBlockSnapshot,
          senderUserSnapshot,
          recipientUserSnapshot,
        ] =
          await firestore.getAll(
            privateSenderBlockReference,
            privateRecipientBlockReference,
            senderUserReference,
            recipientUserReference
          );

        return {
          privateSenderBlocksRecipient:
            privateSenderBlockSnapshot.exists,
          privateRecipientBlocksSender:
            privateRecipientBlockSnapshot.exists,
          senderBlockedUserIds:
            senderUserSnapshot.exists
              ? senderUserSnapshot
                  .data()
                  ?.blockedUserIds
              : undefined,
          recipientBlockedUserIds:
            recipientUserSnapshot.exists
              ? recipientUserSnapshot
                  .data()
                  ?.blockedUserIds
              : undefined,
        };
      },

    readInstallations:
      async (
        recipientId: string
      ): Promise<
        MessageNotificationInstallationInput[]
      > => {
        const installationsSnapshot =
          await firestore
            .collection(
              "userNotificationTokens"
            )
            .doc(recipientId)
            .collection(
              "installations"
            )
            .get();

        return installationsSnapshot
          .docs
          .map(
            (
              installationDocument
            ): MessageNotificationInstallationInput => ({
              installationId:
                installationDocument.id,
              data:
                installationDocument.data(),
            })
          );
      },

    removeInvalidInstallation:
      async (
        recipientId: string,
        installationId: string
      ): Promise<void> => {
        await removeNotificationInstallationFromStore(
          firestore,
          {
            uid:
              recipientId,
            installationId,
          }
        );
      },
  };
}
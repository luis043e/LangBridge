import {
    evaluateMessageNotificationBlockState,
    type MessageNotificationBlockStateInput,
} from "./message-notification-block-state.js";

import {
    parseMessageNotificationConversation,
    parseMessageNotificationInput,
} from "./message-notification-input.js";

import {
    createMessageNotificationPlan,
    type MessageNotificationInstallationInput,
} from "./message-notification-plan.js";

import {
    type MessageNotificationPushResult,
} from "./message-notification-push.js";

export type MessageNotificationWorkflowInput = {
  conversationId: string;
  messageData: unknown;
};

export type MessageNotificationBlockReadResult = {
  privateSenderBlocksRecipient:
    boolean;
  privateRecipientBlocksSender:
    boolean;
  senderBlockedUserIds:
    unknown;
  recipientBlockedUserIds:
    unknown;
};

export type MessageNotificationWorkflowDependencies = {
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

  sendPush: (
    destinations:
      NonNullable<
        ReturnType<
          typeof createMessageNotificationPlan
        >
      >["destinations"],
    payload:
      NonNullable<
        ReturnType<
          typeof createMessageNotificationPlan
        >
      >["payload"]
  ) => Promise<
    MessageNotificationPushResult[]
  >;

  removeInvalidInstallation: (
    recipientId: string,
    installationId: string
  ) => Promise<void>;
};

export type MessageNotificationWorkflowResult =
  | {
      status:
        "invalid-message";
    }
  | {
      status:
        "conversation-not-found";
    }
  | {
      status:
        "invalid-conversation";
    }
  | {
      status:
        "blocked";
      reason:
        Exclude<
          ReturnType<
            typeof evaluateMessageNotificationBlockState
          >,
          "allowed"
        >;
    }
  | {
      status:
        "no-destinations";
    }
  | {
      status:
        "completed";
      acceptedCount: number;
      rejectedCount: number;
      temporarilyUnavailableCount:
        number;
      invalidInstallationCount:
        number;
      cleanupFailureCount:
        number;
    };

export async function runMessageNotificationWorkflow(
  input:
    MessageNotificationWorkflowInput,
  dependencies:
    MessageNotificationWorkflowDependencies
): Promise<
  MessageNotificationWorkflowResult
> {
  const message =
    parseMessageNotificationInput(
      input.messageData
    );

  if (!message) {
    return {
      status:
        "invalid-message",
    };
  }

  const conversationData =
    await dependencies.readConversation(
      input.conversationId
    );

  if (conversationData === null) {
    return {
      status:
        "conversation-not-found",
    };
  }

  const conversation =
    parseMessageNotificationConversation(
      conversationData,
      input.conversationId,
      message.senderId
    );

  if (!conversation) {
    return {
      status:
        "invalid-conversation",
    };
  }

  const blockReadResult =
    await dependencies.readBlockState(
      conversation.senderId,
      conversation.recipientId
    );

  const blockStateInput:
    MessageNotificationBlockStateInput =
      {
        senderId:
          conversation.senderId,
        recipientId:
          conversation.recipientId,
        privateSenderBlocksRecipient:
          blockReadResult
            .privateSenderBlocksRecipient,
        privateRecipientBlocksSender:
          blockReadResult
            .privateRecipientBlocksSender,
        senderBlockedUserIds:
          blockReadResult
            .senderBlockedUserIds,
        recipientBlockedUserIds:
          blockReadResult
            .recipientBlockedUserIds,
      };

  const blockReason =
    evaluateMessageNotificationBlockState(
      blockStateInput
    );

  if (blockReason !== "allowed") {
    return {
      status:
        "blocked",
      reason:
        blockReason,
    };
  }

  const installations =
    await dependencies.readInstallations(
      conversation.recipientId
    );

  const plan =
    createMessageNotificationPlan(
      installations,
      conversation.connectionId,
      conversation.senderId
    );

  if (
    !plan ||
    plan.destinations.length === 0
  ) {
    return {
      status:
        "no-destinations",
    };
  }

  const pushResults =
    await dependencies.sendPush(
      plan.destinations,
      plan.payload
    );

  let acceptedCount =
    0;

  let rejectedCount =
    0;

  let temporarilyUnavailableCount =
    0;

  const invalidInstallationIds:
    string[] =
      [];

  for (const pushResult of pushResults) {
    switch (pushResult.status) {
      case "accepted":
        acceptedCount += 1;
        break;

      case "rejected":
        rejectedCount += 1;
        break;

      case "temporarily-unavailable":
        temporarilyUnavailableCount +=
          1;
        break;

      case "invalid-token":
        invalidInstallationIds.push(
          pushResult.installationId
        );
        break;
    }
  }

  let cleanupFailureCount =
    0;

  for (
    const installationId
    of invalidInstallationIds
  ) {
    try {
      await dependencies
        .removeInvalidInstallation(
          conversation.recipientId,
          installationId
        );
    } catch {
      cleanupFailureCount += 1;
    }
  }

  return {
    status:
      "completed",
    acceptedCount,
    rejectedCount,
    temporarilyUnavailableCount,
    invalidInstallationCount:
      invalidInstallationIds.length,
    cleanupFailureCount,
  };
}
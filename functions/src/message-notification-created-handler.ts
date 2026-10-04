import {
    type MessageNotificationWorkflowInput,
    type MessageNotificationWorkflowResult,
} from "./message-notification-workflow.js";

const maximumConversationIdLength =
  256;

const maximumMessageIdLength =
  256;

export type MessageNotificationCreatedEventInput = {
  conversationId: unknown;
  messageId: unknown;
  messageData: unknown;
};

export type MessageNotificationWorkflowRunner = (
  input: MessageNotificationWorkflowInput
) => Promise<
  MessageNotificationWorkflowResult
>;

export type MessageNotificationCreatedHandlerResult =
  | {
      status:
        "invalid-event";
    }
  | {
      status:
        "processed";
      conversationId: string;
      messageId: string;
      workflowResult:
        MessageNotificationWorkflowResult;
    };

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

export async function runMessageNotificationCreatedHandler(
  input:
    MessageNotificationCreatedEventInput,
  runWorkflow:
    MessageNotificationWorkflowRunner
): Promise<
  MessageNotificationCreatedHandlerResult
> {
  if (
    !isBoundedNonEmptyString(
      input.conversationId,
      maximumConversationIdLength
    ) ||
    !isBoundedNonEmptyString(
      input.messageId,
      maximumMessageIdLength
    )
  ) {
    return {
      status:
        "invalid-event",
    };
  }

  const workflowResult =
    await runWorkflow({
      conversationId:
        input.conversationId,
      messageData:
        input.messageData,
    });

  return {
    status:
      "processed",
    conversationId:
      input.conversationId,
    messageId:
      input.messageId,
    workflowResult,
  };
}
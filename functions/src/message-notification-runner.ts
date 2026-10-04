import {
  type Firestore,
} from "firebase-admin/firestore";

import {
  runMessageNotificationCreatedHandler,
  type MessageNotificationCreatedEventInput,
  type MessageNotificationCreatedHandlerResult,
} from "./message-notification-created-handler.js";

import {
  createMessageNotificationFirestoreDependencies,
} from "./message-notification-firestore.js";

import {
  sendMessageNotificationPush,
  type PushFetch,
} from "./message-notification-push.js";

import {
  runMessageNotificationWorkflow,
} from "./message-notification-workflow.js";

export type MessageNotificationRunnerDependencies = {
  firestore: Firestore;
  pushFetch: PushFetch;
};

export async function runMessageNotificationCreatedEvent(
  input:
    MessageNotificationCreatedEventInput,
  dependencies:
    MessageNotificationRunnerDependencies
): Promise<
  MessageNotificationCreatedHandlerResult
> {
  const firestoreDependencies =
    createMessageNotificationFirestoreDependencies(
      dependencies.firestore
    );

  return runMessageNotificationCreatedHandler(
    input,
    async (workflowInput) =>
      runMessageNotificationWorkflow(
        workflowInput,
        {
          ...firestoreDependencies,

          sendPush:
            async (
              destinations,
              payload
            ) =>
              sendMessageNotificationPush(
                destinations,
                payload,
                dependencies.pushFetch
              ),
        }
      )
  );
}
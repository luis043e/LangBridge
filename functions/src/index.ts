import {
  getApps,
  initializeApp,
} from "firebase-admin/app";
import {
  getFirestore,
} from "firebase-admin/firestore";

import {
  evaluateDeletionRequest,
} from "./deletion-request-state.js";
import {
  evaluateRecentAuthentication,
} from "./recent-authentication.js";

import {
  runCancellationCallableWorkflow,
} from "./cancellation-callable-runner.js";

import {
  runRegisterNotificationInstallationCallable,
  runRemoveNotificationInstallationCallable,
} from "./notification-installation-callable.js";

import { setGlobalOptions } from "firebase-functions/v2";

import {
  defineSecret,
} from "firebase-functions/params";

import {
  onDocumentCreated,
} from "firebase-functions/v2/firestore";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

import {
  runMessageNotificationCreatedEvent,
} from "./message-notification-runner.js";

import {
  type PushFetch,
} from "./message-notification-push.js";

if (getApps().length === 0) {
  initializeApp();
}

const firestore =
  getFirestore();

const messageNotificationPushFetch:
  PushFetch =
    async (
      url,
      init
    ) => {
      const response =
        await fetch(
          url,
          init
        );

      return {
        ok:
          response.ok,
        status:
          response.status,
        json:
          async () =>
            response.json(),
      };
    };
export const cancellationOperationSecret =
  defineSecret(
    "CANCELLATION_OPERATION_SECRET"
  );

setGlobalOptions({
  region: "us-central1",
  maxInstances: 1,
  concurrency: 1,
});

function hasUnknownInput(
  data: unknown
): boolean {
  if (
    typeof data !== "object" ||
    data === null ||
    Array.isArray(data)
  ) {
    return true;
  }

  return (
    Object.keys(
      data as Record<string, unknown>
    ).length !== 0
  );
}

function requireRecentAuthentication(
  authTime: unknown
): void {
  const serverTime =
    Math.floor(
      Date.now() / 1000
    );

  const result =
    evaluateRecentAuthentication(
      authTime,
      serverTime
    );

  if (result.valid) {
    return;
  }

  throw new HttpsError(
    "failed-precondition",
    "Recent authentication is required.",
    {
      reason: result.reason,
    }
  );
}

async function executeCancelAccountDeletion(
  uid: string
): Promise<{
  status:
    | "completed"
    | "not-cancellable";
}> {
  try {
    const result =
      await runCancellationCallableWorkflow(
        firestore,
        uid,
        cancellationOperationSecret.value(),
        new Date()
      );

    switch (
      result.status
    ) {
      case "completed":
        return {
          status:
            "completed",
        };

      case "not-cancellable":
        return {
          status:
            "not-cancellable",
        };

      case "profile-not-found":
        throw new HttpsError(
          "failed-precondition",
          "The account profile is unavailable."
        );

      case "temporarily-unavailable":
        throw new HttpsError(
          "unavailable",
          "The cancellation could not be completed at this time."
        );

      case "inconsistent-state":
        throw new HttpsError(
          "internal",
          "The cancellation could not be completed."
        );
    }
  } catch (error: unknown) {
    if (
      error instanceof HttpsError
    ) {
      throw error;
    }

    console.error(
      "cancelAccountDeletion failed.",
      {
        errorName:
          error instanceof Error
            ? error.name
            : "UnknownError",
      }
    );

    throw new HttpsError(
      "internal",
      "The cancellation could not be completed."
    );
  }
}

function validateCallableRequest(
  request: {
    auth?: {
      uid: string;
      token: {
        auth_time?: unknown;
      };
    };
    data: unknown;
  },
  requireRecentAuth = true
): {
  uid: string;
} {
  if (request.auth === undefined) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication is required."
    );
  }

  if (hasUnknownInput(request.data)) {
    throw new HttpsError(
      "invalid-argument",
      "The request contains unsupported data."
    );
  }

  if (requireRecentAuth) {
    requireRecentAuthentication(
      request.auth.token.auth_time
    );
  }

  return {
    uid: request.auth.uid,
  };
}

export const cancellationBackendProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  (request) => {
    validateCallableRequest(
      request
    );

    return {
      status: "ready",
    };
  }
);

export const cancellationRequestStateProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  async (request) => {
    const {
      uid,
    } = validateCallableRequest(
      request,
      false
    );

    const snapshot =
      await firestore
        .collection(
          "accountDeletionRequests"
        )
        .doc(uid)
        .get();

    const result =
      evaluateDeletionRequest(
        snapshot.exists,
        snapshot.exists
          ? snapshot.data()
          : undefined,
        uid
      );

    return {
      status: result.status,
    };
  }
);
export const cancelAccountDeletion =
  onCall(
    {
      timeoutSeconds:
        60,
      secrets: [
        cancellationOperationSecret,
      ],
    },
    async (request) => {
      const {
        uid,
      } = validateCallableRequest(
        request
      );

      return executeCancelAccountDeletion(
        uid
      );
    }
  );
export const registerNotificationInstallation =
  onCall(
    {
      timeoutSeconds: 30,
    },
    async (request) => {
      if (request.auth === undefined) {
        throw new HttpsError(
          "unauthenticated",
          "Authentication is required."
        );
      }

      return runRegisterNotificationInstallationCallable(
        firestore,
        request.auth.uid,
        request.data
      );
    }
  );

export const removeNotificationInstallation =
  onCall(
    {
      timeoutSeconds: 30,
    },
    async (request) => {
      if (request.auth === undefined) {
        throw new HttpsError(
          "unauthenticated",
          "Authentication is required."
        );
      }

      return runRemoveNotificationInstallationCallable(
        firestore,
        request.auth.uid,
        request.data
      );
    }
  );

export const notifyMessageCreated =
  onDocumentCreated(
    "conversations/{conversationId}/messages/{messageId}",
    async (event) => {
      const conversationId =
        event.params
          .conversationId;

      const messageId =
        event.params
          .messageId;

      const messageSnapshot =
        event.data;

      if (!messageSnapshot) {
        console.warn(
          "Message notification event has no document snapshot.",
          {
            conversationId,
            messageId,
          }
        );

        return;
      }

      try {
        const result =
          await runMessageNotificationCreatedEvent(
            {
              conversationId,
              messageId,
              messageData:
                messageSnapshot.data(),
            },
            {
              firestore,
              pushFetch:
                messageNotificationPushFetch,
            }
          );

        if (
          result.status ===
          "invalid-event"
        ) {
          console.warn(
            "Message notification event was rejected.",
            {
              conversationId,
              messageId,
              status:
                result.status,
            }
          );

          return;
        }

        console.info(
          "Message notification event processed.",
          {
            conversationId:
              result.conversationId,
            messageId:
              result.messageId,
            workflowStatus:
              result.workflowResult.status,
          }
        );
      } catch (error) {
        console.error(
          "Message notification event failed.",
          {
            conversationId,
            messageId,
            errorName:
              error instanceof Error
                ? error.name
                : "UnknownError",
          }
        );
      }
    }
  );
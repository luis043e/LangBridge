import type {
  MessageNotificationDestination,
  MessageNotificationPayload,
} from "./message-notification-plan.js";

const expoPushEndpoint =
  "https://exp.host/--/api/v2/push/send";

const maximumDestinationsPerRequest =
  100;

type PushFetchResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
};

export type PushFetch = (
  url: string,
  init: {
    method: "POST";
    headers: {
      Accept: "application/json";
      "Content-Type": "application/json";
      "Accept-Encoding": "gzip, deflate";
    };
    body: string;
  }
) => Promise<PushFetchResponse>;

export type MessageNotificationPushResult =
  | {
      installationId: string;
      status: "accepted";
      ticketId: string | null;
    }
  | {
      installationId: string;
      status: "invalid-token";
    }
  | {
      installationId: string;
      status: "rejected";
    }
  | {
      installationId: string;
      status: "temporarily-unavailable";
    };

type ExpoPushMessage = {
  to: string;
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

function isPlainObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function createExpoPushMessage(
  destination:
    MessageNotificationDestination,
  payload:
    MessageNotificationPayload
): ExpoPushMessage {
  return {
    to:
      destination.token,
    title:
      payload.title,
    body:
      payload.body,
    sound:
      payload.sound,
    priority:
      payload.priority,
    channelId:
      payload.channelId,
    data:
      payload.data,
  };
}

function isPermanentlyInvalidTokenError(
  value: unknown
): boolean {
  return (
    value ===
      "DeviceNotRegistered" ||
    value ===
      "InvalidCredentials"
  );
}

function parseExpoTicket(
  destination:
    MessageNotificationDestination,
  ticket: unknown
): MessageNotificationPushResult {
  if (!isPlainObject(ticket)) {
    return {
      installationId:
        destination.installationId,
      status:
        "temporarily-unavailable",
    };
  }

  if (ticket.status === "ok") {
    return {
      installationId:
        destination.installationId,
      status:
        "accepted",
      ticketId:
        typeof ticket.id === "string" &&
        ticket.id.length > 0
          ? ticket.id
          : null,
    };
  }

  if (ticket.status !== "error") {
    return {
      installationId:
        destination.installationId,
      status:
        "temporarily-unavailable",
    };
  }

  const details =
    isPlainObject(ticket.details)
      ? ticket.details
      : null;

  const errorCode =
    details?.error;

  if (
    isPermanentlyInvalidTokenError(
      errorCode
    )
  ) {
    return {
      installationId:
        destination.installationId,
      status:
        "invalid-token",
    };
  }

  if (
    errorCode ===
      "MessageTooBig" ||
    errorCode ===
      "MessageRateExceeded"
  ) {
    return {
      installationId:
        destination.installationId,
      status:
        "rejected",
    };
  }

  return {
    installationId:
      destination.installationId,
    status:
      "temporarily-unavailable",
  };
}

function createUnavailableResults(
  destinations:
    readonly MessageNotificationDestination[]
): MessageNotificationPushResult[] {
  return destinations.map(
    (destination) => ({
      installationId:
        destination.installationId,
      status:
        "temporarily-unavailable",
    })
  );
}

export async function sendMessageNotificationPush(
  destinations:
    readonly MessageNotificationDestination[],
  payload:
    MessageNotificationPayload,
  pushFetch: PushFetch
): Promise<MessageNotificationPushResult[]> {
  if (destinations.length === 0) {
    return [];
  }

  const results:
    MessageNotificationPushResult[] =
      [];

  for (
    let index = 0;
    index < destinations.length;
    index += maximumDestinationsPerRequest
  ) {
    const destinationBatch =
      destinations.slice(
        index,
        index +
          maximumDestinationsPerRequest
      );

    const messages =
      destinationBatch.map(
        (destination) =>
          createExpoPushMessage(
            destination,
            payload
          )
      );

    let response:
      PushFetchResponse;

    try {
      response =
        await pushFetch(
          expoPushEndpoint,
          {
            method: "POST",
            headers: {
              Accept:
                "application/json",
              "Content-Type":
                "application/json",
              "Accept-Encoding":
                "gzip, deflate",
            },
            body:
              JSON.stringify(
                messages
              ),
          }
        );
    } catch {
      results.push(
        ...createUnavailableResults(
          destinationBatch
        )
      );

      continue;
    }

    if (!response.ok) {
      results.push(
        ...createUnavailableResults(
          destinationBatch
        )
      );

      continue;
    }

    let responseBody:
      unknown;

    try {
      responseBody =
        await response.json();
    } catch {
      results.push(
        ...createUnavailableResults(
          destinationBatch
        )
      );

      continue;
    }

    if (
      !isPlainObject(responseBody) ||
      !Array.isArray(
        responseBody.data
      ) ||
      responseBody.data.length !==
        destinationBatch.length
    ) {
      results.push(
        ...createUnavailableResults(
          destinationBatch
        )
      );

      continue;
    }

    responseBody.data.forEach(
      (ticket, ticketIndex) => {
        const destination =
          destinationBatch[
            ticketIndex
          ];

        if (!destination) {
          return;
        }

        results.push(
          parseExpoTicket(
            destination,
            ticket
          )
        );
      }
    );
  }

  return results;
}

export {
  expoPushEndpoint,
  maximumDestinationsPerRequest
};


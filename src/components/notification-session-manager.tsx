import {
  useRouter,
} from 'expo-router';
import {
  onAuthStateChanged,
} from 'firebase/auth';
import {
  useEffect,
  useRef,
} from 'react';

import {
  useLanguage,
} from '../contexts/language-context';
import {
  auth,
} from '../firebaseConfig';
import {
  addNotificationResponseListener,
  configureForegroundNotifications,
  getLastNotificationResponse,
  registerNotificationInstallation,
} from '../services/notification-service';

type NotificationChatData = {
  type: 'chat-message';
  conversationId: string;
  senderId: string;
};

const isBoundedString = (
  value: unknown,
  maximumLength: number
): value is string => {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= maximumLength
  );
};

const parseNotificationChatData = (
  value: unknown
): NotificationChatData | null => {
  if (
    typeof value !== 'object' ||
    value === null ||
    Array.isArray(value)
  ) {
    return null;
  }

  const data =
    value as Record<string, unknown>;

  if (
    data.type !== 'chat-message' ||
    !isBoundedString(
      data.conversationId,
      256
    ) ||
    !isBoundedString(
      data.senderId,
      128
    )
  ) {
    return null;
  }

  return {
    type: 'chat-message',
    conversationId:
      data.conversationId,
    senderId:
      data.senderId,
  };
};

export function NotificationSessionManager() {
  const router = useRouter();

  const {
    language,
  } = useLanguage();

  configureForegroundNotifications();

  const registeredUserIdRef =
    useRef<string | null>(
      null
    );

  const registrationInProgressRef =
    useRef(false);

  const lastHandledNotificationIdRef =
    useRef<string | null>(
      null
    );

  useEffect(() => {
    let isActive = true;

    const handleNotificationResponse =
      (
        response: Awaited<
          ReturnType<
            typeof getLastNotificationResponse
          >
        >
      ) => {
        if (
          !isActive ||
          !response ||
          !auth.currentUser
        ) {
          return;
        }

        const notificationId =
          response.notification.request
            .identifier;

        if (
          lastHandledNotificationIdRef
            .current === notificationId
        ) {
          return;
        }

        const notificationData =
          parseNotificationChatData(
            response.notification.request
              .content.data
          );

        if (!notificationData) {
          return;
        }

        if (
          notificationData.senderId ===
          auth.currentUser.uid
        ) {
          return;
        }

        lastHandledNotificationIdRef
          .current = notificationId;

        router.push({
          pathname: '/chat',
          params: {
            lang: language,
            connectionId:
              notificationData
                .conversationId,
            partnerId:
              notificationData.senderId,
          },
        });
      };

    const responseSubscription =
      addNotificationResponseListener(
        handleNotificationResponse
      );

    const authUnsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          if (!isActive) {
            return;
          }

          if (!currentUser) {
            registeredUserIdRef.current =
              null;
            registrationInProgressRef
              .current = false;

            return;
          }

          if (
            registeredUserIdRef.current ===
              currentUser.uid ||
            registrationInProgressRef.current
          ) {
            return;
          }

          registrationInProgressRef
            .current = true;

          try {
            const registrationResult =
              await registerNotificationInstallation();

            if (
              !isActive ||
              auth.currentUser?.uid !==
                currentUser.uid
            ) {
              return;
            }

            if (
              registrationResult.status ===
              'registered'
            ) {
              registeredUserIdRef.current =
                currentUser.uid;
            }
          } catch (error) {
            console.error(
              'Notification registration failed.',
              error
            );
          } finally {
            registrationInProgressRef
              .current = false;
          }

          try {
            const lastResponse =
              await getLastNotificationResponse();

            handleNotificationResponse(
              lastResponse
            );
          } catch (error) {
            console.error(
              'Last notification response could not be processed.',
              error
            );
          }
        }
      );

    return () => {
      isActive = false;
      authUnsubscribe();
      responseSubscription.remove();
    };
  }, [
    language,
    router,
  ]);

  return null;
}
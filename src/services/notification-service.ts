import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {
  httpsCallable,
} from 'firebase/functions';
import {
  Platform,
} from 'react-native';

import {
  auth,
  functions,
} from '../firebaseConfig';

const notificationInstallationIdKey =
  'notificationInstallationId';

const messageNotificationChannelId =
  'messages';

type RegisterNotificationInstallationInput = {
  installationId: string;
  token: string;
  platform:
    | 'android'
    | 'ios';
};

type RegisterNotificationInstallationResult = {
  status: 'registered';
};

type RemoveNotificationInstallationInput = {
  installationId: string;
};

type RemoveNotificationInstallationResult = {
  status:
    | 'removed'
    | 'not-found';
};

const registerNotificationInstallationCallable =
  httpsCallable<
    RegisterNotificationInstallationInput,
    RegisterNotificationInstallationResult
  >(
    functions,
    'registerNotificationInstallation'
  );

const removeNotificationInstallationCallable =
  httpsCallable<
    RemoveNotificationInstallationInput,
    RemoveNotificationInstallationResult
  >(
    functions,
    'removeNotificationInstallation'
  );

type NotificationRegistrationResult =
  | {
      status: 'registered';
      installationId: string;
      expoPushToken: string;
    }
  | {
      status:
        | 'not-authenticated'
        | 'not-physical-device'
        | 'permission-denied'
        | 'missing-project-id'
        | 'unsupported-platform'
        | 'registration-failed';
    };

const createLocalInstallationId = () => {
  const randomPart =
    Math.random()
      .toString(36)
      .slice(2);

  const timePart =
    Date.now()
      .toString(36);

  return `${timePart}_${randomPart}`;
};

const getOrCreateInstallationId =
  async () => {
    const storedInstallationId =
      await AsyncStorage.getItem(
        notificationInstallationIdKey
      );

    if (storedInstallationId) {
      return storedInstallationId;
    }

    const installationId =
      createLocalInstallationId();

    await AsyncStorage.setItem(
      notificationInstallationIdKey,
      installationId
    );

    return installationId;
  };

const configureAndroidNotificationChannel =
  async () => {
    if (Platform.OS !== 'android') {
      return;
    }

    await Notifications
      .setNotificationChannelAsync(
        messageNotificationChannelId,
        {
          name: 'Messages',
          description:
            'Notifications for new LangBridge messages',
          importance:
            Notifications.AndroidImportance.HIGH,
          vibrationPattern: [
            0,
            250,
            250,
            250,
          ],
          lightColor: '#22D3EE',
        }
      );
  };

const getEasProjectId = () => {
  return (
    Constants.easConfig?.projectId ??
    Constants.expoConfig?.extra?.eas
      ?.projectId ??
    null
  );
};

const requestNotificationPermission =
  async () => {
    const existingPermissions =
      await Notifications.getPermissionsAsync();

    if (
      existingPermissions.status ===
      Notifications.PermissionStatus.GRANTED
    ) {
      return true;
    }

    const requestedPermissions =
      await Notifications
        .requestPermissionsAsync();

    return (
      requestedPermissions.status ===
      Notifications.PermissionStatus.GRANTED
    );
  };

export const registerNotificationInstallation =
  async (): Promise<
    NotificationRegistrationResult
  > => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return {
        status: 'not-authenticated',
      };
    }

    if (!Device.isDevice) {
      return {
        status: 'not-physical-device',
      };
    }

    if (
      Platform.OS !== 'android' &&
      Platform.OS !== 'ios'
    ) {
      return {
        status: 'unsupported-platform',
      };
    }

    const projectId = getEasProjectId();

    if (!projectId) {
      return {
        status: 'missing-project-id',
      };
    }

    try {
      await configureAndroidNotificationChannel();

      const permissionGranted =
        await requestNotificationPermission();

      if (!permissionGranted) {
        return {
          status: 'permission-denied',
        };
      }

      const expoPushTokenResponse =
        await Notifications
          .getExpoPushTokenAsync({
            projectId,
          });

      const expoPushToken =
        expoPushTokenResponse.data;

      if (!expoPushToken) {
        return {
          status: 'registration-failed',
        };
      }

      const installationId =
        await getOrCreateInstallationId();

            const registrationResponse =
        await registerNotificationInstallationCallable(
          {
            installationId,
            token: expoPushToken,
            platform: Platform.OS,
          }
        );

      if (
        registrationResponse.data.status !==
        'registered'
      ) {
        return {
          status: 'registration-failed',
        };
      }

      return {
        status: 'registered',
        installationId,
        expoPushToken,
      };
    } catch {
      return {
        status: 'registration-failed',
      };
    }
  };

export const removeNotificationInstallation =
  async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    const installationId =
      await AsyncStorage.getItem(
        notificationInstallationIdKey
      );

    if (!installationId) {
      return;
    }

        const removalResponse =
      await removeNotificationInstallationCallable(
        {
          installationId,
        }
      );

    if (
      removalResponse.data.status !==
        'removed' &&
      removalResponse.data.status !==
        'not-found'
    ) {
      throw new Error(
        'Unexpected notification removal response.'
      );
    }
  };
export const configureForegroundNotifications =
  () => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        priority:
          Notifications
            .AndroidNotificationPriority
            .HIGH,
      }),
    });
  };
export const getLastNotificationResponse =
  async () => {
    return Notifications
      .getLastNotificationResponseAsync();
  };

export const addNotificationResponseListener =
  (
    listener: (
      response:
        Notifications.NotificationResponse
    ) => void
  ) => {
    return Notifications
      .addNotificationResponseReceivedListener(
        listener
      );
  };

export {
  messageNotificationChannelId
};


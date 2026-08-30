import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

import { auth } from '../firebaseConfig';
import { isAppLanguage } from '../translations';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    let isActive = true;

    const authUnsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!isActive) {
          return;
        }

        const savedLanguage =
          await AsyncStorage.getItem('appLanguage');

        const language = isAppLanguage(savedLanguage)
  ? savedLanguage
  : 'en';

        if (currentUser) {
          router.replace({
            pathname: '/home',
            params: {
              lang: language,
            },
          });
          return;
        }

        if (isAppLanguage(savedLanguage)) {
  router.replace({
    pathname: '/welcome',
    params: {
      lang: savedLanguage,
    },
  });
  return;
}

        router.replace('/choose-language');
      }
    );

    return () => {
      isActive = false;
      authUnsubscribe();
    };
  }, [router]);

  return null;
}
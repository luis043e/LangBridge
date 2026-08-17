import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
  const openInitialScreen = async () => {
    const savedLanguage = await AsyncStorage.getItem('appLanguage');

    if (savedLanguage === 'en' || savedLanguage === 'es') {
      router.replace({
        pathname: './welcome',
        params: { lang: savedLanguage },
      });
    } else {
      router.replace('./choose-language');
    }
  };

  openInitialScreen();
}, [router]);
}
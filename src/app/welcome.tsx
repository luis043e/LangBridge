import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { translations, type AppLanguage } from '../translations';

export default function WelcomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

const [isLanguageListOpen, setIsLanguageListOpen] =
  useState(false);

const [isSavingLanguage, setIsSavingLanguage] =
  useState(false);

  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  const toggleLanguageList = () => {
  if (isSavingLanguage) {
    return;
  }

  setIsLanguageListOpen(
    (currentValue) => !currentValue
  );
};
const handleLanguageChange = async (
  newLanguage: AppLanguage
) => {
  if (isSavingLanguage || newLanguage === language) {
    setIsLanguageListOpen(false);
    return;
  }

  try {
    setIsSavingLanguage(true);

    await AsyncStorage.setItem(
      'appLanguage',
      newLanguage
    );

    setIsLanguageListOpen(false);

    router.setParams({
      lang: newLanguage,
    });
  } catch (error) {
    console.error(
      'Error changing interface language:',
      error
    );
  } finally {
    setIsSavingLanguage(false);
  }
};
  const goToRegister = () => {
    router.push({
      pathname: '/register',
      params: { lang: language },
    });
  };

  const goToLogin = () => {
    router.push({
      pathname: '/login',
      params: { lang: language },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <TouchableOpacity
  style={styles.languageButton}
  onPress={toggleLanguageList}
  activeOpacity={0.8}
  disabled={isSavingLanguage}
  accessibilityRole="button"
  accessibilityLabel={
    language === 'es'
      ? 'Cambiar idioma de la interfaz'
      : 'Change interface language'
  }
  accessibilityState={{
    expanded: isLanguageListOpen,
    disabled: isSavingLanguage,
  }}
>
  <Text style={styles.languageButtonText}>
    {language === 'es'
      ? `🌐 Español ${isLanguageListOpen ? '▲' : '▼'}`
      : `🌐 English ${isLanguageListOpen ? '▲' : '▼'}`}
  </Text>
</TouchableOpacity>
{isLanguageListOpen && (
  <View style={styles.languageDropdown}>
    <TouchableOpacity
      style={[
        styles.languageOption,
        language === 'en' &&
          styles.selectedLanguageOption,
      ]}
      onPress={() => handleLanguageChange('en')}
      activeOpacity={0.8}
      disabled={isSavingLanguage}
      accessibilityRole="button"
      accessibilityLabel="English"
      accessibilityState={{
        selected: language === 'en',
        disabled: isSavingLanguage,
      }}
    >
      <Text style={styles.languageOptionText}>
        🇺🇸 English
      </Text>

      {language === 'en' && (
        <Text style={styles.languageCheck}>
          ✓
        </Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        styles.languageOption,
        language === 'es' &&
          styles.selectedLanguageOption,
      ]}
      onPress={() => handleLanguageChange('es')}
      activeOpacity={0.8}
      disabled={isSavingLanguage}
      accessibilityRole="button"
      accessibilityLabel="Español"
      accessibilityState={{
        selected: language === 'es',
        disabled: isSavingLanguage,
      }}
    >
      <Text style={styles.languageOptionText}>
        🇪🇸 Español
      </Text>

      {language === 'es' && (
        <Text style={styles.languageCheck}>
          ✓
        </Text>
      )}
    </TouchableOpacity>
  </View>
)}
      <View style={styles.content}>
        <View style={styles.logo}>
  <Image
    source={require('../../assets/images/langbridge-logo.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
<View style={styles.brandName}>
  <Text style={styles.titleWhite}>Lang</Text>
  <Text style={styles.titleBlue}>Bridge</Text>
</View>

        <Text style={styles.slogan}>
          {text.welcome.slogan}
        </Text>

        <Text style={styles.description}>
          {text.welcome.description}
        </Text>

        <TouchableOpacity
  style={styles.primaryButton}
  onPress={goToRegister}
  activeOpacity={0.85}
>
  <LinearGradient
    colors={['#8B5CF6', '#4F46E5', '#22D3EE']}
    start={{ x: 0, y: 0.5 }}
    end={{ x: 1, y: 0.5 }}
    style={styles.primaryButtonGradient}
  >
    <Text style={styles.primaryButtonText}>
      {text.welcome.getStarted}
    </Text>
  </LinearGradient>
</TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={goToLogin}
          activeOpacity={0.85}
        >
          <Text style={styles.secondaryButtonText}>
            {text.welcome.login}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>
        {text.welcome.footer}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#050B24',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
},

  content: {
  width: '100%',
  maxWidth: 420,
  alignItems: 'center',
  paddingHorizontal: 6,
},

  languageButton: {
  position: 'absolute',
  top: 18,
  right: 0,
  minHeight: 42,
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 21,
  backgroundColor: 'rgba(17, 28, 58, 0.92)',
  borderWidth: 1,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
},

  languageButtonText: {
  color: '#A7F3D0',
  fontSize: 14,
  fontWeight: '700',
  letterSpacing: 0.2,
},
languageDropdown: {
  position: 'absolute',
  top: 58,
  right: 0,
  width: 210,
  backgroundColor: '#0B1430',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 16,
  padding: 8,
  zIndex: 20,
  elevation: 12,
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.3,
  shadowRadius: 12,
},

languageOption: {
  minHeight: 48,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#111C3A',
  borderWidth: 1,
  borderColor: '#1F3158',
  borderRadius: 12,
  paddingHorizontal: 13,
  paddingVertical: 11,
  marginBottom: 6,
},

selectedLanguageOption: {
  backgroundColor: '#25356B',
  borderColor: '#22D3EE',
},

languageOptionText: {
  flex: 1,
  color: '#D7E0F5',
  fontSize: 14,
  fontWeight: '700',
},

languageCheck: {
  color: '#22D3EE',
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10,
},
  logo: {
  width: 112,
  height: 112,
  borderRadius: 34,
  backgroundColor: '#050B24',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 24,
  padding: 6,
  overflow: 'hidden',
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.35,
  shadowRadius: 16,
  elevation: 10,
},

  logoImage: {
  width: '180%',
  height: '150%',
  borderRadius: 30,
},

  brandName: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

titleWhite: {
  color: '#FFFFFF',
  fontSize: 42,
  lineHeight: 52,
  fontWeight: 'bold',
  letterSpacing: 0.3,
},

titleBlue: {
  color: '#22D3EE',
  fontSize: 42,
  lineHeight: 52,
  fontWeight: 'bold',
  letterSpacing: 0.3,
},

  slogan: {
  color: '#A7F3D0',
  fontSize: 19,
  lineHeight: 27,
  fontWeight: '700',
  marginTop: 10,
  textAlign: 'center',
  letterSpacing: 0.2,
},

  description: {
  color: '#A8B3CF',
  fontSize: 15,
  lineHeight: 23,
  textAlign: 'center',
  marginTop: 18,
  marginBottom: 32,
  maxWidth: 350,
},

  primaryButton: {
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  shadowColor: '#6366F1',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 8,
},

primaryButtonGradient: {
  width: '100%',
  minHeight: 56,
  paddingVertical: 17,
  paddingHorizontal: 20,
  alignItems: 'center',
  justifyContent: 'center',
},

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
  width: '100%',
  minHeight: 54,
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  backgroundColor: 'rgba(15, 23, 42, 0.75)',
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 14,
},

  secondaryButtonText: {
  color: '#A7F3D0',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: 0.2,
},

  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
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

  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  const goToLanguageSelection = () => {
    router.replace('/choose-language');
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
        onPress={goToLanguageSelection}
        activeOpacity={0.8}
      >
        <Text style={styles.languageButtonText}>
          {language === 'es' ? 'Idioma' : 'Language'}
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>LB</Text>
        </View>

        <Text style={styles.title}>LangBridge</Text>

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
          <Text style={styles.primaryButtonText}>
            {text.welcome.getStarted}
          </Text>
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
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  content: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },

  languageButton: {
    position: 'absolute',
    top: 54,
    right: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    zIndex: 10,
  },

  languageButtonText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '600',
  },

  logo: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  slogan: {
    color: '#A7F3D0',
    fontSize: 19,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },

  description: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 38,
    maxWidth: 340,
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },

  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
  },
});
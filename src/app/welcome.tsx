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
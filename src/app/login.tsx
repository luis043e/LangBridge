import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../firebaseConfig';
import { signInWithGoogle } from '../googleAuth';
import { translations, type AppLanguage } from '../translations';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const showAlert = (
    spanishTitle: string,
    englishTitle: string,
    spanishMessage: string,
    englishMessage: string
  ) => {
    Alert.alert(
      language === 'es' ? spanishTitle : englishTitle,
      language === 'es' ? spanishMessage : englishMessage
    );
  };

  const handleLogin = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      showAlert(
        'Campos incompletos',
        'Incomplete fields',
        'Escribe tu correo electrónico y contraseña.',
        'Enter your email address and password.'
      );
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showAlert(
        'Correo no válido',
        'Invalid email',
        'Escribe una dirección de correo electrónico válida.',
        'Enter a valid email address.'
      );
      return;
    }

    try {
      setIsLoading(true);

      await signInWithEmailAndPassword(auth, cleanEmail, password);
      router.replace({
  pathname: '/home',
  params: { lang: language },
});

    } catch (error: any) {
      console.error(
  'FIREBASE LOGIN ERROR:',
  error?.code,
  error?.message
);
      let messageEs =
        'No fue posible iniciar sesión. Verifica tus datos e inténtalo nuevamente.';

      let messageEn =
        'Unable to log in. Check your information and try again.';

      if (
        error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/wrong-password' ||
        error?.code === 'auth/user-not-found'
      ) {
        messageEs =
          'El correo electrónico o la contraseña son incorrectos.';
        messageEn =
          'The email address or password is incorrect.';
      } else if (error?.code === 'auth/invalid-email') {
        messageEs =
          'La dirección de correo electrónico no es válida.';
        messageEn =
          'The email address is not valid.';
      } else if (error?.code === 'auth/too-many-requests') {
        messageEs =
          'Se realizaron demasiados intentos. Espera unos minutos e inténtalo nuevamente.';
        messageEn =
          'Too many attempts were made. Wait a few minutes and try again.';
      } else if (error?.code === 'auth/user-disabled') {
        messageEs =
          'Esta cuenta ha sido deshabilitada.';
        messageEn =
          'This account has been disabled.';
      } else if (error?.code === 'auth/network-request-failed') {
        messageEs =
          'Revisa tu conexión a Internet e inténtalo nuevamente.';
        messageEn =
          'Check your Internet connection and try again.';
      }

      showAlert(
        'Error al iniciar sesión',
        'Login error',
        messageEs,
        messageEn
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      showAlert(
        'Correo requerido',
        'Email required',
        'Escribe primero tu dirección de correo electrónico.',
        'Enter your email address first.'
      );
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showAlert(
        'Correo no válido',
        'Invalid email',
        'Escribe una dirección de correo electrónico válida.',
        'Enter a valid email address.'
      );
      return;
    }

    try {
      setIsResettingPassword(true);

      await sendPasswordResetEmail(auth, cleanEmail);

      showAlert(
        'Correo enviado',
        'Email sent',
        'Revisa tu bandeja de entrada para restablecer tu contraseña.',
        'Check your inbox for instructions to reset your password.'
      );
    } catch (error: any) {
      let messageEs =
        'No se pudo enviar el correo de recuperación. Verifica la dirección e inténtalo nuevamente.';

      let messageEn =
        'The password reset email could not be sent. Check the address and try again.';

      if (error?.code === 'auth/invalid-email') {
        messageEs =
          'La dirección de correo electrónico no es válida.';
        messageEn =
          'The email address is not valid.';
      } else if (error?.code === 'auth/too-many-requests') {
        messageEs =
          'Se realizaron demasiadas solicitudes. Espera unos minutos e inténtalo nuevamente.';
        messageEn =
          'Too many requests were made. Wait a few minutes and try again.';
      } else if (error?.code === 'auth/network-request-failed') {
  messageEs =
    'Revisa tu conexión a Internet e inténtalo nuevamente.';
  messageEn =
    'Check your Internet connection and try again.';
}
      showAlert(
        'Error de recuperación',
        'Reset error',
        messageEs,
        messageEn
      );
    } finally {
      setIsResettingPassword(false);
    }
  };

  const goBack = () => {
    router.replace({
      pathname: '/welcome',
      params: { lang: language },
    });
  };
const handleGoogleSignIn = async () => {
  if (isBusy) {
    return;
  }

  try {
    setIsLoading(true);

    const googleResult =
      await signInWithGoogle(language);

    if (!googleResult) {
      return;
    }

    if (googleResult.isNewUser) {
      router.replace({
        pathname: '/language-profile',
        params: {
          lang: language,
        },
      });
      return;
    }

    router.replace({
      pathname: '/home',
      params: {
        lang: language,
      },
    });
  } catch (error) {
    console.error(
      'Error signing in with Google:',
      error
    );

    Alert.alert(
      language === 'es'
        ? 'No se pudo continuar con Google'
        : 'Could not continue with Google',
      error instanceof Error
        ? error.message
        : language === 'es'
          ? 'Inténtalo nuevamente.'
          : 'Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};
  const goToRegister = () => {
    router.push({
      pathname: '/register',
      params: { lang: language },
    });
  };

  const isBusy = isLoading || isResettingPassword;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
  <TouchableOpacity
    style={styles.backButton}
    onPress={goBack}
    activeOpacity={0.8}
    disabled={isBusy}
  >
    <Text style={styles.backButtonText}>
      {language === 'es' ? '‹ Atrás' : '‹ Back'}
    </Text>
  </TouchableOpacity>

            <View style={styles.logo}>
  <Image
    source={require('../../assets/images/langbridge-logo.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>

            <Text style={styles.title}>
              {text.loginScreen.title}
            </Text>

            <Text style={styles.subtitle}>
              {text.loginScreen.subtitle}
            </Text>

            <Text style={styles.label}>
              {text.loginScreen.emailLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.loginScreen.emailPlaceholder}
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              editable={!isBusy}
              returnKeyType="next"
            />

            <Text style={styles.label}>
              {text.loginScreen.passwordLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.loginScreen.passwordPlaceholder}
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="current-password"
              value={password}
              onChangeText={setPassword}
              editable={!isBusy}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
            />

            <TouchableOpacity
              style={styles.forgotButton}
              onPress={handleForgotPassword}
              activeOpacity={0.8}
              disabled={isBusy}
            >
              {isResettingPassword ? (
                <ActivityIndicator
                  color="#A7F3D0"
                  size="small"
                />
              ) : (
                <Text style={styles.forgotText}>
                  {text.loginScreen.forgotPassword}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
  style={[
    styles.primaryButton,
    isBusy && styles.disabledButton,
  ]}
  onPress={handleLogin}
  activeOpacity={0.85}
  disabled={isBusy}
>
  <LinearGradient
    colors={['#8B5CF6', '#4F46E5', '#22D3EE']}
    start={{ x: 0, y: 0.5 }}
    end={{ x: 1, y: 0.5 }}
    style={styles.primaryButtonGradient}
  >
    {isLoading ? (
      <ActivityIndicator
        color="#FFFFFF"
        size="small"
      />
    ) : (
      <Text style={styles.primaryButtonText}>
        {text.loginScreen.loginButton}
      </Text>
    )}
  </LinearGradient>
</TouchableOpacity>
<View style={styles.googleDividerContainer}>
  <View style={styles.googleDividerLine} />

  <Text style={styles.googleDividerText}>
    {language === 'es' ? 'o' : 'or'}
  </Text>

  <View style={styles.googleDividerLine} />
</View>

<TouchableOpacity
  style={[
    styles.googleButton,
    isBusy && styles.disabledButton,
  ]}
  onPress={handleGoogleSignIn}
  activeOpacity={0.85}
  disabled={isBusy}
>
  <View style={styles.googleIconContainer}>
    <Text style={styles.googleIconText}>
      G
    </Text>
  </View>

  <Text style={styles.googleButtonText}>
    {language === 'es'
      ? 'Continuar con Google'
      : 'Continue with Google'}
  </Text>
</TouchableOpacity>
            <TouchableOpacity
              style={styles.registerButton}
              onPress={goToRegister}
              activeOpacity={0.8}
              disabled={isBusy}
            >
              <Text style={styles.registerText}>
                {text.loginScreen.noAccount}{' '}
                <Text style={styles.registerLink}>
                  {text.loginScreen.createOne}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
  flex: 1,
  backgroundColor: '#050B24',
},

  container: {
  flex: 1,
  backgroundColor: '#050B24',
},

  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 18,
    paddingBottom: 36,
  },

  formContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 50,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 16,
  },

  backButtonText: {
  color: '#22D3EE',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: 0.2,
},

  logo: {
  width: 88,
  height: 88,
  borderRadius: 28,
  backgroundColor: '#050B24',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 28,
  padding: 5,
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
  width: '138%',
  height: '138%',
  borderRadius: 24,
},

  title: {
  color: '#FFFFFF',
  fontSize: 36,
  lineHeight: 42,
  fontWeight: 'bold',
  letterSpacing: -0.4,
},

  subtitle: {
  color: '#A8B3CF',
  fontSize: 15,
  lineHeight: 23,
  marginTop: 10,
  marginBottom: 34,
},

  label: {
  color: '#E8EEFF',
  fontSize: 14,
  fontWeight: '700',
  marginBottom: 9,
},

  input: {
  width: '100%',
  height: 56,
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334155',
  borderRadius: 16,
  color: '#FFFFFF',
  fontSize: 16,
  paddingHorizontal: 18,
  marginBottom: 18,
},

  forgotButton: {
    alignSelf: 'flex-end',
    minHeight: 34,
    justifyContent: 'center',
    marginTop: -4,
    marginBottom: 26,
  },

  forgotText: {
  color: '#A7F3D0',
  fontSize: 14,
  fontWeight: '700',
  letterSpacing: 0.1,
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

disabledButton: {
  opacity: 0.65,
},
primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  registerButton: {
    alignItems: 'center',
    marginTop: 26,
    paddingVertical: 8,
  },

  registerText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },

  registerLink: {
  color: '#22D3EE',
  fontWeight: 'bold',
},
googleDividerContainer: {
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 22,
  marginBottom: 16,
},

googleDividerLine: {
  flex: 1,
  height: 1,
  backgroundColor: '#334C7D',
},

googleDividerText: {
  color: '#94A3B8',
  fontSize: 13,
  fontWeight: '600',
  marginHorizontal: 12,
},

googleButton: {
  width: '100%',
  minHeight: 56,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderWidth: 1.5,
  borderColor: '#D7DEEA',
  borderRadius: 18,
  paddingHorizontal: 18,
  paddingVertical: 14,
},

googleIconContainer: {
  width: 30,
  height: 30,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#D7DEEA',
  borderRadius: 15,
  marginRight: 11,
},

googleIconText: {
  color: '#4285F4',
  fontSize: 18,
  fontWeight: 'bold',
},

googleButtonText: {
  color: '#1F2937',
  fontSize: 16,
  fontWeight: 'bold',
},
});
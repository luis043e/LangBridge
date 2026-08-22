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
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../firebaseConfig';
import { signInWithGoogle } from '../googleAuth';
import { translations, type AppLanguage } from '../translations';

export default function RegisterScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegister = async () => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      showAlert(
        'Campos incompletos',
        'Incomplete fields',
        'Completa todos los campos para crear tu cuenta.',
        'Complete all fields to create your account.'
      );
      return;
    }

    if (cleanName.length < 2) {
      showAlert(
        'Nombre no válido',
        'Invalid name',
        'Escribe tu nombre completo.',
        'Enter your full name.'
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

    if (password.length < 6) {
      showAlert(
        'Contraseña muy corta',
        'Password too short',
        'La contraseña debe tener por lo menos 6 caracteres.',
        'The password must contain at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      showAlert(
        'Las contraseñas no coinciden',
        'Passwords do not match',
        'Escribe la misma contraseña en ambos campos.',
        'Enter the same password in both fields.'
      );
      return;
    }

    try {
      setIsLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: cleanName,
      });

      Alert.alert(
        language === 'es' ? 'Cuenta creada' : 'Account created',
        language === 'es'
          ? 'Tu cuenta de LangBridge fue creada correctamente.'
          : 'Your LangBridge account was created successfully.',
        [
          {
            text: language === 'es' ? 'Continuar' : 'Continue',
            onPress: () =>
              router.replace({
                pathname: '/language-profile',
                params: { lang: language },
              }),
          },
        ]
      );
    } catch (error: any) {
      let messageEs = 'No se pudo crear la cuenta. Inténtalo nuevamente.';
      let messageEn = 'The account could not be created. Try again.';

      if (error?.code === 'auth/email-already-in-use') {
        messageEs = 'Este correo electrónico ya está registrado.';
        messageEn = 'This email address is already registered.';
      } else if (error?.code === 'auth/invalid-email') {
        messageEs = 'La dirección de correo electrónico no es válida.';
        messageEn = 'The email address is not valid.';
      } else if (error?.code === 'auth/weak-password') {
        messageEs = 'La contraseña es demasiado débil.';
        messageEn = 'The password is too weak.';
      } else if (error?.code === 'auth/network-request-failed') {
        messageEs = 'Revisa tu conexión a Internet e inténtalo nuevamente.';
        messageEn = 'Check your Internet connection and try again.';
      }

      showAlert(
        'Error de registro',
        'Registration error',
        messageEs,
        messageEn
      );
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    router.replace({
      pathname: '/welcome',
      params: { lang: language },
    });
  };
const handleGoogleSignIn = async () => {
  if (isLoading) {
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
      'Error registering with Google:',
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
  const goToLogin = () => {
    router.push({
      pathname: '/login',
      params: { lang: language },
    });
  };

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
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>
              {language === 'es' ? '‹ Atrás' : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <View style={styles.logo}>
  <Image
    source={require('../../assets/images/langbridge-logo.png')}
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>

            <Text style={styles.title}>
              {text.registerScreen.title}
            </Text>

            <Text style={styles.subtitle}>
              {text.registerScreen.subtitle}
            </Text>

            <Text style={styles.label}>
              {text.registerScreen.fullNameLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.registerScreen.fullNamePlaceholder}
              placeholderTextColor="#64748B"
              autoCapitalize="words"
              autoComplete="name"
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
              returnKeyType="next"
            />

            <Text style={styles.label}>
              {text.registerScreen.emailLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.registerScreen.emailPlaceholder}
              placeholderTextColor="#64748B"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
              returnKeyType="next"
            />

            <Text style={styles.label}>
              {text.registerScreen.passwordLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.registerScreen.passwordPlaceholder}
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
              editable={!isLoading}
              returnKeyType="next"
            />

            <Text style={styles.label}>
              {text.registerScreen.confirmPasswordLabel}
            </Text>

            <TextInput
              style={styles.input}
              placeholder={text.registerScreen.confirmPasswordPlaceholder}
              placeholderTextColor="#64748B"
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />

            <TouchableOpacity
              style={[
                styles.primaryButton,
                isLoading && styles.disabledButton,
              ]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={isLoading}
            >
              <LinearGradient
  colors={['#8B5CF6', '#4F46E5', '#22D3EE']}
  start={{ x: 0, y: 0.5 }}
  end={{ x: 1, y: 0.5 }}
  style={styles.primaryButtonGradient}
>
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {text.registerScreen.createAccount}
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
    isLoading && styles.disabledButton,
  ]}
  onPress={handleGoogleSignIn}
  activeOpacity={0.85}
  disabled={isLoading}
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
            <Text style={styles.terms}>
              {text.registerScreen.terms}
            </Text>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={goToLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <Text style={styles.loginText}>
                {text.registerScreen.hasAccount}{' '}
                <Text style={styles.loginLink}>
                  {text.registerScreen.login}
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
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 16,
    marginBottom: 18,
  },

  backButtonText: {
  color: '#22D3EE',
  fontSize: 16,
  fontWeight: '700',
  letterSpacing: 0.2,
},

  logo: {
  width: 82,
  height: 82,
  borderRadius: 26,
  backgroundColor: '#050B24',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 26,
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
  borderRadius: 22,
},

  title: {
  color: '#FFFFFF',
  fontSize: 36,
  lineHeight: 43,
  fontWeight: 'bold',
  letterSpacing: -0.4,
},

  subtitle: {
  color: '#A8B3CF',
  fontSize: 15,
  lineHeight: 23,
  marginTop: 10,
  marginBottom: 30,
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

  primaryButton: {
  width: '100%',
  borderRadius: 16,
  overflow: 'hidden',
  marginTop: 8,
  shadowColor: '#6366F1',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  elevation: 8,
},
disabledButton: {
  opacity: 0.65,
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

  terms: {
    color: '#64748B',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
  },

  loginButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 8,
  },

  loginText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
  },

  loginLink: {
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
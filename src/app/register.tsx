import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
              <Text style={styles.logoText}>LB</Text>
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
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {text.registerScreen.createAccount}
                </Text>
              )}
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
    backgroundColor: '#0F172A',
  },

  container: {
    flex: 1,
    backgroundColor: '#0F172A',
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
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '600',
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 7,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 23,
    fontWeight: 'bold',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 30,
  },

  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 16,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  primaryButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.65,
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
    color: '#A7F3D0',
    fontWeight: 'bold',
  },
});
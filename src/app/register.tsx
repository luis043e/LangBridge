import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
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

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function RegisterScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
  if (password !== confirmPassword) {
    Alert.alert(
  'Passwords do not match',
  'Please enter the same password in both fields.'
);
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email.trim(), password);
    Alert.alert(
  'Account created',
  'Your LangBridge account was created successfully.'
);
  } catch (error) {
    Alert.alert(
  'Registration error',
  'The account could not be created. The email may already be registered.'
);
  }
};

  return (

    
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
        <View style={styles.logo}>
          <Text style={styles.logoText}>LB</Text>
        </View>

        <Text style={styles.title}>Create your account</Text>

        <Text style={styles.subtitle}>
          Join LangBridge and start connecting through languages.
        </Text>

        <Text style={styles.label}>Full name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#64748B"
          autoCapitalize="words"
        />

        <Text style={styles.label}>Email address</Text>
        <TextInput
  style={styles.input}
  placeholder="Enter your email"
  placeholderTextColor="#64748B"
  keyboardType="email-address"
  autoCapitalize="none"
  value={email}
  onChangeText={setEmail}
/>

        <Text style={styles.label}>Password</Text>
        <TextInput
  style={styles.input}
  placeholder="Create a password"
  placeholderTextColor="#64748B"
  secureTextEntry
  value={password}
  onChangeText={setPassword}
/>

        <Text style={styles.label}>Confirm password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
  style={styles.primaryButton}
  onPress={handleRegister}
>
          <Text style={styles.primaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By creating an account, you agree to the Terms of Service and
          Privacy Policy.
        </Text>

        <TouchableOpacity
  style={styles.loginButton}
  onPress={() => router.push('./login')}
>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink}>Log in</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 26,
    paddingTop: 58,
    paddingBottom: 36,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 26,
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
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
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
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  loginLink: {
    color: '#A7F3D0',
    fontWeight: 'bold',
  },
});
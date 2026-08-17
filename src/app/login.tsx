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

import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
export default function LoginScreen() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
 
 const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);

    Alert.alert(
      'Login successful',
      'Welcome back to LangBridge.'
    );
    
    router.replace('./home');
  } catch (error) {
    Alert.alert(
      'Login error',
      'The email or password is incorrect.'
    );
  }
};   
const handleForgotPassword = async () => {
  if (!email.trim()) {
    Alert.alert(
      'Email required',
      'Please enter your email address first.'
    );
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email.trim());

    Alert.alert(
      'Email sent',
      'Check your inbox for instructions to reset your password.'
    );
  } catch (error) {
    Alert.alert(
      'Reset error',
      'We could not send the password reset email. Check the email address and try again.'
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

        <Text style={styles.title}>Welcome back</Text>

        <Text style={styles.subtitle}>
          Log in to continue practicing and connecting through languages.
        </Text>

        <Text style={styles.label}>Email address</Text>

        <TextInput
        value={email}
onChangeText={setEmail}
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#64748B"
          keyboardType="email-address"
          autoCapitalize="none"
          
        />

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#64748B"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
  style={styles.forgotButton}
  onPress={handleForgotPassword}
>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.primaryButton}
  onPress={handleLogin}
>
  <Text style={styles.primaryButtonText}>Log In</Text>
</TouchableOpacity>

        <TouchableOpacity
  style={styles.registerButton}
  onPress={() => router.push('./register')}
>
          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink}>Create one</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 26,
    paddingVertical: 50,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 34,
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
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -4,
    marginBottom: 26,
  },
  forgotText: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: '600',
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
  registerButton: {
    alignItems: 'center',
    marginTop: 26,
  },
  registerText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  registerLink: {
    color: '#A7F3D0',
    fontWeight: 'bold',
  },
});
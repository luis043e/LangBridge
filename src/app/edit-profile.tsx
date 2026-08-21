import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updateProfile } from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

export default function EditProfileScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const currentUser = auth.currentUser;

  const [fullName, setFullName] = useState(
    currentUser?.displayName || ''
  );

  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
  const loadProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const profileReference = doc(
        db,
        'users',
        user.uid
      );

      const profileSnapshot = await getDoc(
        profileReference
      );

      if (profileSnapshot.exists()) {
        const profileData =
          profileSnapshot.data();

        setFullName(
          profileData.fullName ||
          user.displayName ||
          ''
        );

        setCity(profileData.city || '');
        setBio(profileData.bio || '');
      }
    } catch (error) {
      console.error(
        'Error loading profile:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  loadProfile();
}, []);
const handleSaveProfile = async () => {
  if (isSaving) {
    return;
  }

  const user = auth.currentUser;
  const cleanName = fullName.trim();
  const cleanCity = city.trim();
  const cleanBio = bio.trim();

  if (!user) {
    Alert.alert(
      language === 'es'
        ? 'Sesión requerida'
        : 'Login required',
      language === 'es'
        ? 'Debes iniciar sesión nuevamente para actualizar tu perfil.'
        : 'You must log in again to update your profile.'
    );
    return;
  }

  if (!cleanName) {
    Alert.alert(
      language === 'es'
        ? 'Nombre requerido'
        : 'Name required',
      language === 'es'
        ? 'Escribe tu nombre completo para continuar.'
        : 'Enter your full name to continue.'
    );
    return;
  }

  try {
    setIsSaving(true);

    await updateProfile(user, {
      displayName: cleanName,
    });

    await setDoc(
      doc(db, 'users', user.uid),
      {
        fullName: cleanName,
        city: cleanCity,
        bio: cleanBio,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    Alert.alert(
      language === 'es'
        ? 'Perfil actualizado'
        : 'Profile updated',
      language === 'es'
        ? 'Tus cambios fueron guardados correctamente.'
        : 'Your changes were saved successfully.'
    );
  } catch (error) {
    console.error(
      'Error saving profile:',
      error
    );

    Alert.alert(
      language === 'es'
        ? 'No se pudo guardar'
        : 'Save failed',
      language === 'es'
        ? 'Revisa tu conexión e inténtalo nuevamente.'
        : 'Check your connection and try again.'
    );
  } finally {
    setIsSaving(false);
  }
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              {language === 'es'
                ? '‹ Atrás'
                : '‹ Back'}
            </Text>
          </TouchableOpacity>
          {isLoading ? (
  <ActivityIndicator
    color="#22D3EE"
    size="large"
  />
) : null}

          <Text style={styles.title}>
            {language === 'es'
              ? 'Editar perfil'
              : 'Edit profile'}
          </Text>

          <Text style={styles.subtitle}>
            {language === 'es'
              ? 'Actualiza la información que verán tus compañeros.'
              : 'Update the information your partners will see.'}
          </Text>

          <Text style={styles.label}>
            {language === 'es'
              ? 'Nombre completo'
              : 'Full name'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={
              language === 'es'
                ? 'Escribe tu nombre'
                : 'Enter your name'
            }
            placeholderTextColor="#64748B"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            maxLength={60}
          />

          <Text style={styles.label}>
            {language === 'es'
              ? 'Ciudad o ubicación'
              : 'City or location'}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={
              language === 'es'
                ? 'Ejemplo: Santo Domingo'
                : 'Example: Santo Domingo'
            }
            placeholderTextColor="#64748B"
            value={city}
            onChangeText={setCity}
            autoCapitalize="words"
            maxLength={80}
          />

          <Text style={styles.label}>
            {language === 'es'
              ? 'Acerca de mí'
              : 'About me'}
          </Text>

          <TextInput
            style={[
              styles.input,
              styles.bioInput,
            ]}
            placeholder={
              language === 'es'
                ? 'Cuéntales qué te interesa practicar.'
                : 'Tell others what you want to practice.'
            }
            placeholderTextColor="#64748B"
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
            maxLength={240}
          />

          <Text style={styles.characterCount}>
            {bio.length}/240
          </Text>

          <TouchableOpacity
  style={[
    styles.saveButton,
    isSaving && styles.disabledSaveButton,
  ]}
  onPress={handleSaveProfile}
  activeOpacity={0.85}
  disabled={isSaving || isLoading}
>
  <Text style={styles.saveButtonText}>
    {isSaving
      ? language === 'es'
        ? 'Guardando...'
        : 'Saving...'
      : language === 'es'
        ? 'Guardar cambios'
        : 'Save changes'}
  </Text>
</TouchableOpacity>

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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 38,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 14,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 9,
    marginBottom: 24,
  },

  label: {
    color: '#E8EEFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
  },

  input: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 18,
  },

  bioInput: {
    minHeight: 120,
    lineHeight: 21,
    paddingTop: 15,
    marginBottom: 7,
  },

  characterCount: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
  },

  saveButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#22D3EE',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 22,
    shadowColor: '#22D3EE',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
disabledSaveButton: {
  opacity: 0.65,
},
  saveButtonText: {
    color: '#050B24',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
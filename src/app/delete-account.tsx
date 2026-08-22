import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    addDoc,
    collection,
    doc,
    serverTimestamp,
    setDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

export default function DeleteAccountScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [confirmationText, setConfirmationText] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const requiredConfirmation =
    language === 'es' ? 'ELIMINAR' : 'DELETE';

  const canSubmit =
    confirmationText.trim().toUpperCase() ===
    requiredConfirmation;

  const handleDeleteRequest = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        language === 'es'
          ? 'Sesión no disponible'
          : 'Session unavailable',
        language === 'es'
          ? 'Inicia sesión nuevamente para continuar.'
          : 'Please log in again to continue.'
      );
      return;
    }

    if (!canSubmit) {
      Alert.alert(
        language === 'es'
          ? 'Confirmación incorrecta'
          : 'Incorrect confirmation',
        language === 'es'
          ? 'Escribe ELIMINAR para confirmar la solicitud.'
          : 'Type DELETE to confirm the request.'
      );
      return;
    }

    Alert.alert(
      language === 'es'
        ? 'Confirmar solicitud'
        : 'Confirm request',
      language === 'es'
        ? 'Tu perfil se ocultará y se registrará una solicitud de eliminación.'
        : 'Your profile will be hidden and an account deletion request will be created.',
      [
        {
          text:
            language === 'es'
              ? 'Cancelar'
              : 'Cancel',
          style: 'cancel',
        },
        {
          text:
            language === 'es'
              ? 'Continuar'
              : 'Continue',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSubmitting(true);

              await addDoc(
                collection(db, 'accountDeletionRequests'),
                {
                  userId: currentUser.uid,
                  userEmail: currentUser.email || '',
                  status: 'pending',
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                }
              );

              await setDoc(
                doc(db, 'users', currentUser.uid),
                {
                  isProfileVisible: false,
                  deletionRequested: true,
                  deletionRequestedAt:
                    serverTimestamp(),
                },
                {
                  merge: true,
                }
              );

              Alert.alert(
                language === 'es'
                  ? 'Solicitud registrada'
                  : 'Request submitted',
                language === 'es'
                  ? 'Tu perfil fue ocultado y la solicitud quedó registrada.'
                  : 'Your profile was hidden and the request was submitted.',
                [
                  {
                    text: 'OK',
                    onPress: () => router.back(),
                  },
                ]
              );
            } catch (error) {
              console.error(
                'Error requesting account deletion:',
                error
              );

              Alert.alert(
                language === 'es'
                  ? 'No se pudo registrar'
                  : 'Could not submit',
                language === 'es'
                  ? 'Revisa tu conexión e inténtalo nuevamente.'
                  : 'Check your connection and try again.'
              );
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };
    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>
                🗑️
              </Text>
            </View>

            <View style={styles.headerInformation}>
              <Text style={styles.title}>
                {language === 'es'
                  ? 'Eliminar cuenta'
                  : 'Delete account'}
              </Text>

              <Text style={styles.subtitle}>
                {language === 'es'
                  ? 'Solicita la eliminación permanente de tu cuenta de LangBridge.'
                  : 'Request the permanent deletion of your LangBridge account.'}
              </Text>
            </View>
          </View>

          <View style={styles.warningCard}>
            <Text style={styles.warningTitle}>
              {language === 'es'
                ? 'Antes de continuar'
                : 'Before continuing'}
            </Text>

            <Text style={styles.warningText}>
              {language === 'es'
                ? 'Esta solicitud ocultará inmediatamente tu perfil mientras se procesa la eliminación.'
                : 'This request will immediately hide your profile while the deletion is processed.'}
            </Text>
          </View>

          <View style={styles.consequencesCard}>
            <Text style={styles.consequencesTitle}>
              {language === 'es'
                ? 'La eliminación puede afectar:'
                : 'Deletion may affect:'}
            </Text>

            <Text style={styles.consequenceItem}>
              {language === 'es'
                ? '• Tu perfil y preferencias.'
                : '• Your profile and preferences.'}
            </Text>

            <Text style={styles.consequenceItem}>
              {language === 'es'
                ? '• Tus solicitudes y conexiones.'
                : '• Your requests and connections.'}
            </Text>

            <Text style={styles.consequenceItem}>
              {language === 'es'
                ? '• Tus conversaciones y mensajes.'
                : '• Your conversations and messages.'}
            </Text>

            <Text style={styles.consequenceItem}>
              {language === 'es'
                ? '• Tu acceso futuro a LangBridge.'
                : '• Your future access to LangBridge.'}
            </Text>
          </View>

          <Text style={styles.confirmationLabel}>
            {language === 'es'
              ? 'Para confirmar, escribe ELIMINAR'
              : 'To confirm, type DELETE'}
          </Text>

          <TextInput
            style={styles.confirmationInput}
            value={confirmationText}
            onChangeText={setConfirmationText}
            placeholder={requiredConfirmation}
            placeholderTextColor="#64748B"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
          />

          <Text style={styles.helperText}>
            {language === 'es'
              ? 'La palabra debe escribirse exactamente como aparece arriba.'
              : 'The word must be typed exactly as shown above.'}
          </Text>

          <TouchableOpacity
            style={[
              styles.deleteButton,
              (!canSubmit || isSubmitting) &&
                styles.disabledDeleteButton,
            ]}
            onPress={handleDeleteRequest}
            activeOpacity={0.85}
            disabled={!canSubmit || isSubmitting}
          >
            <Text style={styles.deleteButtonText}>
              {isSubmitting
                ? language === 'es'
                  ? 'Procesando solicitud...'
                  : 'Processing request...'
                : language === 'es'
                  ? 'Solicitar eliminación'
                  : 'Request deletion'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            <Text style={styles.cancelButtonText}>
              {language === 'es'
                ? 'Cancelar y conservar mi cuenta'
                : 'Cancel and keep my account'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.securityNote}>
            {language === 'es'
              ? 'Por seguridad, la eliminación definitiva requerirá una verificación adicional de identidad.'
              : 'For security, permanent deletion will require additional identity verification.'}
          </Text>
        </ScrollView>
      </View>
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 16,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A1D32',
    borderWidth: 1.5,
    borderColor: '#FB7185',
    marginRight: 15,
  },

  headerIconText: {
    fontSize: 28,
  },

  headerInformation: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 33,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  warningCard: {
    backgroundColor: '#3A2315',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 18,
    padding: 17,
    marginBottom: 18,
  },

  warningTitle: {
    color: '#FCD34D',
    fontSize: 16,
    fontWeight: 'bold',
  },

  warningText: {
    color: '#FDE68A',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  consequencesCard: {
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 18,
    padding: 17,
    marginBottom: 24,
  },

  consequencesTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  consequenceItem: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 22,
  },

  confirmationLabel: {
    color: '#E8EEFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  confirmationInput: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#0B1430',
    borderWidth: 1.5,
    borderColor: '#7F1D3D',
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  helperText: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 17,
    marginTop: 8,
  },

  deleteButton: {
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#BE123C',
    borderWidth: 1.5,
    borderColor: '#FB7185',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 24,
  },

  disabledDeleteButton: {
    opacity: 0.45,
  },

  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    width: '100%',
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 12,
  },

  cancelButtonText: {
    color: '#E8EEFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  securityNote: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 18,
    paddingHorizontal: 8,
  },
});
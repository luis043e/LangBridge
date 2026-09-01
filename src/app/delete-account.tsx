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
import {
  translations,
  type AppLanguage,
} from '../translations';

export default function DeleteAccountScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  const [confirmationText, setConfirmationText] =
    useState('');

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const requiredConfirmation =
  text.deleteAccountScreen.requiredConfirmation;

  const canSubmit =
    confirmationText.trim().toUpperCase() ===
    requiredConfirmation;

  const handleDeleteRequest = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
  text.deleteAccountScreen.sessionUnavailableTitle,
  text.deleteAccountScreen.sessionUnavailableMessage
);
      return;
    }

    if (!canSubmit) {
      Alert.alert(
  text.deleteAccountScreen.incorrectConfirmationTitle,
  text.deleteAccountScreen.incorrectConfirmationMessage
);
      return;
    }

    Alert.alert(
  text.deleteAccountScreen.confirmRequestTitle,
  text.deleteAccountScreen.confirmRequestMessage,
  [
    {
      text: text.deleteAccountScreen.cancel,
      style: 'cancel',
    },
    {
      text: text.deleteAccountScreen.continue,
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
  text.deleteAccountScreen.requestSubmittedTitle,
  text.deleteAccountScreen.requestSubmittedMessage,
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
  text.deleteAccountScreen.submitErrorTitle,
  text.deleteAccountScreen.connectionError
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
    {text.deleteAccountScreen.back}
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
      {text.deleteAccountScreen.title}
    </Text>

    <Text style={styles.subtitle}>
      {text.deleteAccountScreen.subtitle}
    </Text>
  </View>
</View>

          <View style={styles.warningCard}>
  <Text style={styles.warningTitle}>
    {text.deleteAccountScreen.warningTitle}
  </Text>

  <Text style={styles.warningText}>
    {text.deleteAccountScreen.warningText}
  </Text>
</View>

          <View style={styles.consequencesCard}>
  <Text style={styles.consequencesTitle}>
    {text.deleteAccountScreen.consequencesTitle}
  </Text>

  <Text style={styles.consequenceItem}>
    {text.deleteAccountScreen.profileConsequence}
  </Text>

  <Text style={styles.consequenceItem}>
    {text.deleteAccountScreen.connectionsConsequence}
  </Text>

  <Text style={styles.consequenceItem}>
    {text.deleteAccountScreen.conversationsConsequence}
  </Text>

  <Text style={styles.consequenceItem}>
    {text.deleteAccountScreen.accessConsequence}
  </Text>
</View>

          <Text style={styles.confirmationLabel}>
  {text.deleteAccountScreen.confirmationLabel}
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
  {text.deleteAccountScreen.helperText}
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
      ? text.deleteAccountScreen.processing
      : text.deleteAccountScreen.requestDeletion}
  </Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.cancelButton}
  onPress={() => router.back()}
  activeOpacity={0.85}
  disabled={isSubmitting}
>
  <Text style={styles.cancelButtonText}>
    {text.deleteAccountScreen.cancelAndKeepAccount}
  </Text>
</TouchableOpacity>

          <Text style={styles.securityNote}>
  {text.deleteAccountScreen.securityNote}
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
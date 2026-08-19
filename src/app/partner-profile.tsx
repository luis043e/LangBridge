import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  doc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

export default function PartnerProfileScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
    partnerId?: string;
    name?: string;
    initials?: string;
    city?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    level?: string;
    online?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const name =
    params.name ||
    (language === 'es'
      ? 'Usuario de LangBridge'
      : 'LangBridge user');

  const initials = params.initials || 'LB';

  const city =
    params.city ||
    (language === 'es'
      ? 'Ubicación no indicada'
      : 'Location not provided');

  const nativeLanguage =
    params.nativeLanguage ||
    (language === 'es'
      ? 'No especificado'
      : 'Not specified');

  const learningLanguage =
    params.learningLanguage ||
    (language === 'es'
      ? 'No especificado'
      : 'Not specified');

  const level =
    params.level ||
    (language === 'es'
      ? 'Nivel no especificado'
      : 'Level not specified');

  const isOnline = params.online === 'true';
  const [isSending, setIsSending] = useState(false);

  const handleConnect = async () => {
  if (isSending) {
    return;
  }

  const currentUser = auth.currentUser;
  const partnerId = params.partnerId;

  if (!currentUser) {
    Alert.alert(
      language === 'es'
        ? 'Sesión requerida'
        : 'Login required',
      language === 'es'
        ? 'Debes iniciar sesión nuevamente para enviar una solicitud.'
        : 'You must log in again to send a request.'
    );
    return;
  }

  if (!partnerId) {
    Alert.alert(
      language === 'es'
        ? 'Perfil no disponible'
        : 'Profile unavailable',
      language === 'es'
        ? 'No se pudo identificar a este compañero.'
        : 'This partner could not be identified.'
    );
    return;
  }

  if (currentUser.uid === partnerId) {
    Alert.alert(
      language === 'es'
        ? 'Solicitud no válida'
        : 'Invalid request',
      language === 'es'
        ? 'No puedes enviarte una solicitud a ti mismo.'
        : 'You cannot send a request to yourself.'
    );
    return;
  }

  const requestId =
    `${currentUser.uid}_${partnerId}`;

  const requestReference = doc(
    db,
    'connectionRequests',
    requestId
  );

  try {
    setIsSending(true);

    await setDoc(requestReference, {
      senderId: currentUser.uid,
      recipientId: partnerId,
      senderName:
        currentUser.displayName ||
        currentUser.email?.split('@')[0] ||
        'LangBridge',
      recipientName: name,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    Alert.alert(
      language === 'es'
        ? 'Solicitud enviada'
        : 'Request sent',
      language === 'es'
        ? `Tu solicitud de conexión fue enviada a ${name}.`
        : `Your connection request was sent to ${name}.`
    );
  } catch (error) {
    console.error(
      'Error sending connection request:',
      error
    );

    Alert.alert(
      language === 'es'
        ? 'Error al enviar'
        : 'Send error',
      language === 'es'
        ? 'No se pudo enviar la solicitud. Revisa tu conexión e inténtalo nuevamente.'
        : 'The request could not be sent. Check your connection and try again.'
    );
  } finally {
    setIsSending(false);
  }
};
    return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              {language === 'es' ? '‹ Atrás' : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <View style={styles.avatarWrapper}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {initials}
                </Text>
              </View>

              {isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            <Text style={styles.name}>
              {name}
            </Text>

            <Text style={styles.location}>
              📍 {city}
            </Text>

            <View
              style={[
                styles.statusBadge,
                isOnline
                  ? styles.onlineBadge
                  : styles.offlineBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  isOnline
                    ? styles.onlineText
                    : styles.offlineText,
                ]}
              >
                {isOnline
                  ? language === 'es'
                    ? 'En línea'
                    : 'Online'
                  : language === 'es'
                    ? 'Desconectado'
                    : 'Offline'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {language === 'es'
              ? 'Perfil lingüístico'
              : 'Language profile'}
          </Text>

          <View style={styles.informationCard}>
            <View style={styles.informationRow}>
              <View style={styles.informationIcon}>
                <Text style={styles.informationIconText}>
                  🌍
                </Text>
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {language === 'es'
                    ? 'Idioma nativo'
                    : 'Native language'}
                </Text>

                <Text style={styles.informationValue}>
                  {nativeLanguage}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.informationRow}>
              <View style={styles.informationIcon}>
                <Text style={styles.informationIconText}>
                  📚
                </Text>
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {language === 'es'
                    ? 'Está aprendiendo'
                    : 'Learning'}
                </Text>

                <Text style={styles.informationValue}>
                  {learningLanguage}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.informationRow}>
              <View style={styles.informationIcon}>
                <Text style={styles.informationIconText}>
                  ⭐
                </Text>
              </View>

              <View style={styles.informationContent}>
                <Text style={styles.informationLabel}>
                  {language === 'es'
                    ? 'Nivel actual'
                    : 'Current level'}
                </Text>

                <Text style={styles.informationValue}>
                  {level}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.matchCard}>
            <Text style={styles.matchTitle}>
              {language === 'es'
                ? 'Practiquen y aprendan juntos'
                : 'Practice and learn together'}
            </Text>

            <Text style={styles.matchDescription}>
              {language === 'es'
                ? 'Envía una solicitud para comenzar una conexión de intercambio lingüístico.'
                : 'Send a request to start a language exchange connection.'}
            </Text>
          </View>

          <TouchableOpacity
  style={[
    styles.connectButton,
    isSending && styles.disabledConnectButton,
  ]}
  onPress={handleConnect}
  activeOpacity={0.85}
  disabled={isSending}
>
  {isSending ? (
    <View style={styles.sendingContent}>
      <ActivityIndicator
        color="#050B24"
        size="small"
      />

      <Text style={styles.sendingText}>
        {language === 'es'
          ? 'Enviando...'
          : 'Sending...'}
      </Text>
    </View>
  ) : (
    <Text style={styles.connectButtonText}>
      {language === 'es'
        ? 'Enviar solicitud'
        : 'Send request'}
    </Text>
  )}
</TouchableOpacity>
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
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 36,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  profileHeader: {
    alignItems: 'center',
    marginTop: 18,
  },

  avatarWrapper: {
    position: 'relative',
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#111C3A',
    borderWidth: 2,
    borderColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22D3EE',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },

  avatarText: {
    color: '#22D3EE',
    fontSize: 30,
    fontWeight: 'bold',
  },

  onlineIndicator: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34D399',
    borderWidth: 4,
    borderColor: '#050B24',
  },

  name: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 34,
   fontWeight: 'bold',
textAlign: 'center',
marginTop: 18,
},

location: {
  color: '#A8B3CF',
  fontSize: 14,
  marginTop: 7,
},

statusBadge: {
  borderRadius: 14,
  paddingHorizontal: 12,
  paddingVertical: 6,
  marginTop: 12,
},

onlineBadge: {
  backgroundColor: '#123C36',
},

offlineBadge: {
  backgroundColor: '#1E293B',
},

statusText: {
  fontSize: 12,
  fontWeight: 'bold',
},

onlineText: {
  color: '#A7F3D0',
},

offlineText: {
  color: '#94A3B8',
},

sectionTitle: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 34,
  marginBottom: 14,
},

informationCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 22,
  padding: 18,
},

informationRow: {
  flexDirection: 'row',
  alignItems: 'center',
},

informationIcon: {
  width: 46,
  height: 46,
  borderRadius: 15,
  backgroundColor: '#19284A',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
},

informationIconText: {
  fontSize: 21,
},

informationContent: {
  flex: 1,
},

informationLabel: {
  color: '#A8B3CF',
  fontSize: 12,
  fontWeight: '600',
},

informationValue: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
  marginTop: 4,
},

divider: {
  height: 1,
  backgroundColor: '#263556',
  marginVertical: 16,
},

matchCard: {
  backgroundColor: '#141A3D',
  borderWidth: 1,
  borderColor: '#4F46E5',
  borderRadius: 20,
  padding: 18,
  marginTop: 20,
},

matchTitle: {
  color: '#A5F3FC',
  fontSize: 16,
  fontWeight: 'bold',
},

matchDescription: {
  color: '#A8B3CF',
  fontSize: 13,
  lineHeight: 20,
  marginTop: 7,
},

connectButton: {
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

connectButtonText: {
  color: '#050B24',
  fontSize: 17,
  fontWeight: 'bold',
},
disabledConnectButton: {
  opacity: 0.65,
},

sendingContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

sendingText: {
  color: '#050B24',
  fontSize: 16,
  fontWeight: 'bold',
  marginLeft: 10,
},
});
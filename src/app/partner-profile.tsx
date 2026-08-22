import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  arrayUnion,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
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
    preview?: string;
    name?: string;
    initials?: string;
    city?: string;
    bio?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    level?: string;
    online?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';
    const getLanguageName = (code: string) => {
  const languageNames: Record<
    string,
    { es: string; en: string }
  > = {
    es: {
      es: 'Español',
      en: 'Spanish',
    },
    en: {
      es: 'Inglés',
      en: 'English',
    },
    fr: {
      es: 'Francés',
      en: 'French',
    },
    pt: {
      es: 'Portugués',
      en: 'Portuguese',
    },
    de: {
      es: 'Alemán',
      en: 'German',
    },
    it: {
      es: 'Italiano',
      en: 'Italian',
    },
  };

  return (
    languageNames[code]?.[language] ||
    code ||
    (language === 'es'
      ? 'No especificado'
      : 'Not specified')
  );
};

const getLevelName = (levelCode: string) => {
  const levelNames: Record<
    string,
    { es: string; en: string }
  > = {
    beginner: {
      es: 'Principiante',
      en: 'Beginner',
    },
    intermediate: {
      es: 'Intermedio',
      en: 'Intermediate',
    },
    advanced: {
      es: 'Avanzado',
      en: 'Advanced',
    },
  };

  return (
    levelNames[levelCode]?.[language] ||
    levelCode ||
    (language === 'es'
      ? 'Nivel no especificado'
      : 'Level not specified')
  );
};

    const isOwnProfile = params.preview === 'true';

    const profileUserId = isOwnProfile
  ? auth.currentUser?.uid
  : params.partnerId;
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

  const bio = params.bio?.trim() || '';

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

const [loadedProfile, setLoadedProfile] = useState<{

  fullName: string;
  city: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  online: boolean;
} | null>(null);

useEffect(() => {
  const loadOwnPublicProfile = async () => {
    if (!isOwnProfile || !profileUserId) {
      return;
    }

    try {
      const profileReference = doc(
        db,
        'users',
        profileUserId
      );

      const profileSnapshot = await getDoc(
        profileReference
      );

      if (!profileSnapshot.exists()) {
        return;
      }

      const profileData = profileSnapshot.data();

      setLoadedProfile({
        fullName:
          profileData.fullName?.trim() ||
          auth.currentUser?.displayName?.trim() ||
          auth.currentUser?.email?.split('@')[0] ||
          (language === 'es'
            ? 'Usuario de LangBridge'
            : 'LangBridge user'),
        city:
          profileData.city?.trim() ||
          (language === 'es'
            ? 'Ubicación no indicada'
            : 'Location not provided'),
        bio: profileData.bio?.trim() || '',
        nativeLanguage:
          profileData.nativeLanguage || '',
        learningLanguage:
          profileData.learningLanguage || '',
        level: profileData.level || 'beginner',
        online: profileData.online === true,
      });
    } catch (error) {
      console.error(
        'Error loading public profile:',
        error
      );
    }
  };

  loadOwnPublicProfile();
}, [
  isOwnProfile,
  language,
  profileUserId,
]);

const displayedName =
  loadedProfile?.fullName || name;

const displayedInitials =
  displayedName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase()
    )
    .join('') ||
  initials;

const displayedCity =
  loadedProfile?.city || city;

  const displayedNativeLanguage =
  loadedProfile?.nativeLanguage ||
  nativeLanguage;

const displayedLearningLanguage =
  loadedProfile?.learningLanguage ||
  learningLanguage;

const displayedLevel =
  loadedProfile?.level || level;

const displayedBio =
  loadedProfile?.bio || bio;

const displayedOnline =
  loadedProfile?.online ?? isOnline;

const [isSending, setIsSending] = useState(false);
  const handleBlockUser = () => {
  const currentUser = auth.currentUser;
  const partnerId = params.partnerId;

  if (!currentUser || !partnerId) {
    Alert.alert(
      language === 'es'
        ? 'No se pudo bloquear'
        : 'Could not block',
      language === 'es'
        ? 'No encontramos la información necesaria del usuario.'
        : 'The required user information could not be found.'
    );
    return;
  }

  if (currentUser.uid === partnerId) {
    Alert.alert(
      language === 'es'
        ? 'Acción no válida'
        : 'Invalid action',
      language === 'es'
        ? 'No puedes bloquear tu propio perfil.'
        : 'You cannot block your own profile.'
    );
    return;
  }

  Alert.alert(
    language === 'es'
      ? 'Bloquear usuario'
      : 'Block user',
    language === 'es'
      ? `¿Quieres bloquear a ${name}? Esta persona dejará de aparecer en Explorar.`
      : `Do you want to block ${name}? This person will no longer appear in Explore.`,
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
            ? 'Bloquear'
            : 'Block',
        style: 'destructive',
        onPress: async () => {
          try {
            const currentUserReference = doc(
              db,
              'users',
              currentUser.uid
            );

            await setDoc(
              currentUserReference,
              {
                blockedUserIds: arrayUnion(partnerId),
              },
              {
                merge: true,
              }
            );

            Alert.alert(
              language === 'es'
                ? 'Usuario bloqueado'
                : 'User blocked',
              language === 'es'
                ? `${name} fue bloqueado correctamente.`
                : `${name} was blocked successfully.`,
              [
                {
                  text: 'OK',
                  onPress: () => router.back(),
                },
              ]
            );
          } catch (error) {
            console.error(
              'Error blocking user:',
              error
            );

            Alert.alert(
              language === 'es'
                ? 'No se pudo bloquear'
                : 'Could not block',
              language === 'es'
                ? 'Revisa tu conexión e inténtalo nuevamente.'
                : 'Check your connection and try again.'
            );
          }
        },
      },
    ]
  );
};
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
                  {displayedInitials}
                </Text>
              </View>

              {displayedOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            <Text style={styles.name}>
              {displayedName}
            </Text>

            <Text style={styles.location}>
              📍 {displayedCity}
            </Text>

            <View
              style={[
                styles.statusBadge,
                displayedOnline
                  ? styles.onlineBadge
                  : styles.offlineBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  displayedOnline
                    ? styles.onlineText
                    : styles.offlineText,
                ]}
              >
                {displayedOnline
                  ? language === 'es'
                    ? 'En línea'
                    : 'Online'
                  : language === 'es'
                    ? 'Desconectado'
                    : 'Offline'}
              </Text>
            </View>
          </View>
{bio ? (
  <>
    <Text style={styles.aboutTitle}>
      {language === 'es'
        ? 'Acerca de mí'
        : 'About me'}
    </Text>

    <View style={styles.aboutCard}>
      <Text style={styles.aboutText}>
        {bio}
      </Text>
    </View>
  </>
) : null}

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
                  {getLanguageName(displayedNativeLanguage)}
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
                  {getLanguageName(displayedLearningLanguage)}
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
                  {getLevelName(displayedLevel)}
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
          
         {!isOwnProfile ? (
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
) : null}
{!isOwnProfile ? (
  <TouchableOpacity
    style={styles.blockButton}
    onPress={handleBlockUser}
    activeOpacity={0.85}
  >
    <Text style={styles.blockButtonText}>
      {language === 'es'
        ? 'Bloquear usuario'
        : 'Block user'}
    </Text>
  </TouchableOpacity>
) : null}
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
aboutTitle: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 34,
  marginBottom: 14,
},

aboutCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  paddingHorizontal: 18,
  paddingVertical: 17,
},

aboutText: {
  color: '#D7E0F5',
  fontSize: 14,
  lineHeight: 22,
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

blockButton: {
  width: '100%',
  minHeight: 54,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#321B2B',
  borderWidth: 1.5,
  borderColor: '#FB7185',
  borderRadius: 17,
  paddingHorizontal: 18,
  paddingVertical: 15,
  marginTop: 14,
  marginBottom: 12,
},

blockButtonText: {
  color: '#FDA4AF',
  fontSize: 15,
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

type ConnectionState =
  | 'loading'
  | 'none'
  | 'sent'
  | 'received'
  | 'connected'
  | 'rejected'
  | 'blocked';

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
    a1: {
      es: 'A1 · Principiante',
      en: 'A1 · Beginner',
    },
    a2: {
      es: 'A2 · Básico',
      en: 'A2 · Elementary',
    },
    b1: {
      es: 'B1 · Intermedio',
      en: 'B1 · Intermediate',
    },
    b2: {
      es: 'B2 · Intermedio alto',
      en: 'B2 · Upper intermediate',
    },
    c1: {
      es: 'C1 · Avanzado',
      en: 'C1 · Advanced',
    },
    c2: {
      es: 'C2 · Dominio',
      en: 'C2 · Proficiency',
    },
    beginner: {
      es: 'A1 · Principiante',
      en: 'A1 · Beginner',
    },
    intermediate: {
      es: 'B1 · Intermedio',
      en: 'B1 · Intermediate',
    },
    advanced: {
      es: 'C1 · Avanzado',
      en: 'C1 · Advanced',
    },
  };

  return (
    levelNames[levelCode]?.[language] ||
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
  photoURL: string;
  countryCode: string;
  countryName: string;
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
        countryCode:
  typeof profileData.countryCode === 'string'
    ? profileData.countryCode.toUpperCase()
    : '',

countryName:
  typeof profileData.countryName === 'string'
    ? profileData.countryName.trim()
    : '',
        city:
          profileData.city?.trim() ||
          (language === 'es'
            ? 'Ubicación no indicada'
            : 'Location not provided'),
        bio: profileData.bio?.trim() || '',
        photoURL: profileData.photoURL || '',
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

const displayedPhotoURL =
  loadedProfile?.photoURL || '';

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

const displayedLocation =
  loadedProfile?.countryName ||
  loadedProfile?.city ||
  (language === 'es'
    ? 'País no indicado'
    : 'Country not provided');

const displayedCountryFlag =
  loadedProfile?.countryCode
    ? loadedProfile.countryCode
        .split('')
        .map((character) =>
          String.fromCodePoint(
            127397 +
              character.toUpperCase().charCodeAt(0)
          )
        )
        .join('')
    : '🌍';
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
const [connectionState, setConnectionState] =
  useState<ConnectionState>('loading');

const [activeConnectionId, setActiveConnectionId] =
  useState('');

const [isSending, setIsSending] = useState(false);
  useEffect(() => {
  let isMounted = true;

  const loadConnectionState = async () => {
    const currentUser = auth.currentUser;
    const partnerId = params.partnerId;

    if (isOwnProfile) {
      if (isMounted) {
        setConnectionState('none');
        setActiveConnectionId('');
      }

      return;
    }

    if (!currentUser || !partnerId) {
      if (isMounted) {
        setConnectionState('none');
        setActiveConnectionId('');
      }

      return;
    }

    try {
      if (isMounted) {
        setConnectionState('loading');
        setActiveConnectionId('');
      }

      const directRequestId =
        `${currentUser.uid}_${partnerId}`;

      const reverseRequestId =
        `${partnerId}_${currentUser.uid}`;

      const currentUserReference = doc(
        db,
        'users',
        currentUser.uid
      );

      const partnerReference = doc(
        db,
        'users',
        partnerId
      );

      const sentRequestsQuery = query(
  collection(db, 'connectionRequests'),
  where(
    'senderId',
    '==',
    currentUser.uid
  )
);

const receivedRequestsQuery = query(
  collection(db, 'connectionRequests'),
  where(
    'recipientId',
    '==',
    currentUser.uid
  )
);
      const [
  currentUserSnapshot,
  partnerSnapshot,
  sentRequestsSnapshot,
  receivedRequestsSnapshot,
] = await Promise.all([
  getDoc(currentUserReference),
  getDoc(partnerReference),
  getDocs(sentRequestsQuery),
  getDocs(receivedRequestsQuery),
]);
      const currentUserData =
        currentUserSnapshot.exists()
          ? currentUserSnapshot.data()
          : null;

      const partnerData =
        partnerSnapshot.exists()
          ? partnerSnapshot.data()
          : null;

      const currentUserBlockedIds =
        Array.isArray(
          currentUserData?.blockedUserIds
        )
          ? currentUserData.blockedUserIds
          : [];

      const partnerBlockedIds =
        Array.isArray(partnerData?.blockedUserIds)
          ? partnerData.blockedUserIds
          : [];

      const isBlocked =
        currentUserBlockedIds.includes(partnerId) ||
        partnerBlockedIds.includes(
          currentUser.uid
        );

      if (isBlocked) {
        if (isMounted) {
          setConnectionState('blocked');
          setActiveConnectionId('');
        }

        return;
      }

      const directRequestDocument =
  sentRequestsSnapshot.docs.find(
    (requestDocument) =>
      requestDocument.data().recipientId ===
      partnerId
  );

const reverseRequestDocument =
  receivedRequestsSnapshot.docs.find(
    (requestDocument) =>
      requestDocument.data().senderId ===
      partnerId
  );

const directRequestData =
  directRequestDocument?.data() || null;

const reverseRequestData =
  reverseRequestDocument?.data() || null;

      if (
        directRequestData?.status === 'accepted'
      ) {
        if (isMounted) {
          setConnectionState('connected');
          setActiveConnectionId(
            directRequestId
          );
        }

        return;
      }

      if (
        reverseRequestData?.status === 'accepted'
      ) {
        if (isMounted) {
          setConnectionState('connected');
          setActiveConnectionId(
            reverseRequestId
          );
        }

        return;
      }

      if (
        directRequestData?.status === 'pending'
      ) {
        if (isMounted) {
          setConnectionState('sent');
          setActiveConnectionId(
            directRequestId
          );
        }

        return;
      }

      if (
        reverseRequestData?.status === 'pending'
      ) {
        if (isMounted) {
          setConnectionState('received');
          setActiveConnectionId(
            reverseRequestId
          );
        }

        return;
      }

      if (
        directRequestData?.status === 'rejected' ||
        reverseRequestData?.status === 'rejected'
      ) {
        if (isMounted) {
          setConnectionState('rejected');
          setActiveConnectionId('');
        }

        return;
      }

      if (isMounted) {
        setConnectionState('none');
        setActiveConnectionId('');
      }
    } catch (error) {
      console.error(
        'Error loading connection state:',
        error
      );

      if (isMounted) {
        setConnectionState('none');
        setActiveConnectionId('');
      }
    }
  };

  loadConnectionState();

  return () => {
    isMounted = false;
  };
}, [
  isOwnProfile,
  params.partnerId,
]);
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

  try {
    setIsSending(true);

    const currentUserReference = doc(
      db,
      'users',
      currentUser.uid
    );

    const partnerReference = doc(
      db,
      'users',
      partnerId
    );

    const sentRequestsQuery = query(
      collection(db, 'connectionRequests'),
      where(
        'senderId',
        '==',
        currentUser.uid
      )
    );

    const receivedRequestsQuery = query(
      collection(db, 'connectionRequests'),
      where(
        'recipientId',
        '==',
        currentUser.uid
      )
    );

    const [
      currentUserSnapshot,
      partnerSnapshot,
      sentRequestsSnapshot,
      receivedRequestsSnapshot,
    ] = await Promise.all([
      getDoc(currentUserReference),
      getDoc(partnerReference),
      getDocs(sentRequestsQuery),
      getDocs(receivedRequestsQuery),
    ]);

    const currentUserData =
      currentUserSnapshot.exists()
        ? currentUserSnapshot.data()
        : null;

    const partnerData =
      partnerSnapshot.exists()
        ? partnerSnapshot.data()
        : null;

    const currentUserBlockedIds =
      Array.isArray(
        currentUserData?.blockedUserIds
      )
        ? currentUserData.blockedUserIds
        : [];

    const partnerBlockedIds =
      Array.isArray(partnerData?.blockedUserIds)
        ? partnerData.blockedUserIds
        : [];

    const isBlocked =
      currentUserBlockedIds.includes(partnerId) ||
      partnerBlockedIds.includes(
        currentUser.uid
      );

    if (isBlocked) {
      setConnectionState('blocked');
      setActiveConnectionId('');

      Alert.alert(
        language === 'es'
          ? 'Interacción no disponible'
          : 'Interaction unavailable',
        language === 'es'
          ? 'No es posible enviar una solicitud a este perfil.'
          : 'A request cannot be sent to this profile.'
      );
      return;
    }

    const directRequestDocument =
      sentRequestsSnapshot.docs.find(
        (requestDocument) =>
          requestDocument.data().recipientId ===
          partnerId
      );

    const reverseRequestDocument =
      receivedRequestsSnapshot.docs.find(
        (requestDocument) =>
          requestDocument.data().senderId ===
          partnerId
      );

    const directRequestData =
      directRequestDocument?.data() || null;

    const reverseRequestData =
      reverseRequestDocument?.data() || null;

    if (
      directRequestData?.status === 'accepted'
    ) {
      setConnectionState('connected');
      setActiveConnectionId(
        directRequestDocument?.id || ''
      );

      Alert.alert(
        language === 'es'
          ? 'Conexión existente'
          : 'Existing connection',
        language === 'es'
          ? `Ya estás conectado con ${displayedName}.`
          : `You are already connected with ${displayedName}.`
      );
      return;
    }

    if (
      reverseRequestData?.status === 'accepted'
    ) {
      setConnectionState('connected');
      setActiveConnectionId(
        reverseRequestDocument?.id || ''
      );

      Alert.alert(
        language === 'es'
          ? 'Conexión existente'
          : 'Existing connection',
        language === 'es'
          ? `Ya estás conectado con ${displayedName}.`
          : `You are already connected with ${displayedName}.`
      );
      return;
    }

    if (
      directRequestData?.status === 'pending'
    ) {
      setConnectionState('sent');
      setActiveConnectionId(
        directRequestDocument?.id || ''
      );

      Alert.alert(
        language === 'es'
          ? 'Solicitud ya enviada'
          : 'Request already sent',
        language === 'es'
          ? `Ya enviaste una solicitud a ${displayedName}.`
          : `You already sent a request to ${displayedName}.`
      );
      return;
    }

    if (
      reverseRequestData?.status === 'pending'
    ) {
      setConnectionState('received');
      setActiveConnectionId(
        reverseRequestDocument?.id || ''
      );

      Alert.alert(
        language === 'es'
          ? 'Solicitud recibida'
          : 'Request received',
        language === 'es'
          ? `${displayedName} ya te envió una solicitud. Revísala en Solicitudes.`
          : `${displayedName} already sent you a request. Review it in Requests.`
      );
      return;
    }

    if (
      directRequestData?.status === 'rejected' ||
      reverseRequestData?.status === 'rejected'
    ) {
      setConnectionState('rejected');
      setActiveConnectionId('');

      Alert.alert(
        language === 'es'
          ? 'Solicitud no disponible'
          : 'Request unavailable',
        language === 'es'
          ? 'Esta relación tiene una solicitud rechazada y no puede reabrirse automáticamente.'
          : 'This relationship has a rejected request and cannot be reopened automatically.'
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

    await setDoc(requestReference, {
      senderId: currentUser.uid,
      recipientId: partnerId,
      senderName:
        currentUser.displayName?.trim() ||
        currentUser.email?.split('@')[0] ||
        'LangBridge',
      recipientName: displayedName,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    setConnectionState('sent');
    setActiveConnectionId(requestId);

    Alert.alert(
      language === 'es'
        ? 'Solicitud enviada'
        : 'Request sent',
      language === 'es'
        ? `Tu solicitud de conexión fue enviada a ${displayedName}.`
        : `Your connection request was sent to ${displayedName}.`
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
const handleConnectionAction = () => {
  const partnerId = params.partnerId;

  if (connectionState === 'none') {
    handleConnect();
    return;
  }

  if (connectionState === 'received') {
    router.push({
      pathname: '/requests',
      params: {
        lang: language,
      },
    });
    return;
  }

  if (
    connectionState === 'connected' &&
    activeConnectionId &&
    partnerId
  ) {
    router.push({
      pathname: '/chat',
      params: {
        lang: language,
        connectionId: activeConnectionId,
        partnerId,
        partnerName: displayedName,
        partnerPhotoURL: displayedPhotoURL,
      },
    });
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
  {displayedPhotoURL ? (
    <Image
      source={{ uri: displayedPhotoURL }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.avatarText}>
      {displayedInitials}
    </Text>
  )}
</View>
              {displayedOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            <Text style={styles.name}>
              {displayedName}
            </Text>

            <Text style={styles.location}>
              {displayedCountryFlag} {displayedLocation}
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
          <>
  <TouchableOpacity
  style={[
    styles.connectButton,
    (
      isSending ||
      connectionState === 'loading' ||
      connectionState === 'sent' ||
      connectionState === 'rejected' ||
      connectionState === 'blocked'
    ) &&
      styles.disabledConnectButton,
    connectionState === 'connected' &&
      styles.connectedButton,
    connectionState === 'received' &&
      styles.receivedRequestButton,
  ]}
  onPress={handleConnectionAction}
  activeOpacity={0.85}
  disabled={
    isSending ||
    connectionState === 'loading' ||
    connectionState === 'sent' ||
    connectionState === 'rejected' ||
    connectionState === 'blocked'
  }
>
  {isSending ||
  connectionState === 'loading' ? (
    <View style={styles.sendingContent}>
      <ActivityIndicator
        color="#050B24"
        size="small"
      />

      <Text style={styles.sendingText}>
        {isSending
          ? language === 'es'
            ? 'Enviando...'
            : 'Sending...'
          : language === 'es'
            ? 'Comprobando relación...'
            : 'Checking connection...'}
      </Text>
    </View>
  ) : (
    <Text style={styles.connectButtonText}>
      {connectionState === 'none'
        ? language === 'es'
          ? 'Enviar solicitud'
          : 'Send request'
        : connectionState === 'sent'
          ? language === 'es'
            ? 'Solicitud enviada'
            : 'Request sent'
          : connectionState === 'received'
            ? language === 'es'
              ? 'Ver solicitud recibida'
              : 'View received request'
            : connectionState === 'connected'
              ? language === 'es'
                ? 'Abrir conversación'
                : 'Open conversation'
              : connectionState === 'rejected'
                ? language === 'es'
                  ? 'Solicitud no disponible'
                  : 'Request unavailable'
                : language === 'es'
                  ? 'Interacción no disponible'
                  : 'Interaction unavailable'}
    </Text>
  )}
</TouchableOpacity>
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
  </>
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
    overflow: 'hidden',
  },
avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 999,
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

connectedButton: {
  backgroundColor: '#22D3EE',
  borderColor: '#67E8F9',
},

receivedRequestButton: {
  backgroundColor: '#6366F1',
  borderColor: '#818CF8',
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
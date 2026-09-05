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
import { useLanguage } from '../contexts/language-context';
import { getCountryName } from '../countries';
import { auth, db } from '../firebaseConfig';
import { translations } from '../translations';

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
    countryCode?: string;
    countryName?: string;
    city?: string;
    bio?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    level?: string;
    online?: string;
  }>();

 const { language } = useLanguage();

const text = translations[language];

const getLanguageName = (code: string) => {
  const languageNames: Record<string, string> =
    text.partnerProfileScreen.languageNames;

  return (
    languageNames[code] ||
    code ||
    text.partnerProfileScreen.notSpecified
  );
};

const getLevelName = (levelCode: string) => {
  const levelNames: Record<string, string> =
    text.partnerProfileScreen.levelNames;

  return (
    levelNames[levelCode] ||
    text.partnerProfileScreen.levelNotSpecified
  );
};

    const isOwnProfile = params.preview === 'true';

    const profileUserId = isOwnProfile
  ? auth.currentUser?.uid
  : params.partnerId;
 const name =
  params.name ||
  text.partnerProfileScreen.defaultUserName;

  const initials = params.initials || 'LB';
  
  const countryCode = params.countryCode || '';

  const countryName = params.countryName || '';
  const city =
  params.city ||
  text.partnerProfileScreen.locationNotProvided;

  const bio = params.bio?.trim() || '';

  const nativeLanguage =
  params.nativeLanguage ||
  text.partnerProfileScreen.notSpecified;

  const learningLanguage =
  params.learningLanguage ||
  text.partnerProfileScreen.notSpecified;

  const level =
  params.level ||
  text.partnerProfileScreen.levelNotSpecified;

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
  text.partnerProfileScreen.defaultUserName,
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
  text.partnerProfileScreen.locationNotProvided,
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
  loadedProfile?.countryCode
    ? getCountryName(
        loadedProfile.countryCode,
        language
      )
    : countryCode
      ? getCountryName(
          countryCode,
          language
        )
      : loadedProfile?.countryName ||
        countryName ||
        loadedProfile?.city ||
        city ||
        text.partnerProfileScreen.countryNotProvided;

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
    text.partnerProfileScreen.blockUnavailableTitle,
    text.partnerProfileScreen.blockUnavailableMessage
  );
  return;
}

  if (currentUser.uid === partnerId) {
  Alert.alert(
    text.partnerProfileScreen.invalidBlockActionTitle,
    text.partnerProfileScreen.invalidBlockActionMessage
  );
  return;
}

  Alert.alert(
  text.partnerProfileScreen.blockUserTitle,
  text.partnerProfileScreen.blockConfirmationMessage.replace(
    '{name}',
    name
  ),
  [
    {
      text: text.partnerProfileScreen.cancel,
      style: 'cancel',
    },
    {
      text: text.partnerProfileScreen.block,
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
  text.partnerProfileScreen.userBlockedTitle,
  text.partnerProfileScreen.userBlockedMessage.replace(
    '{name}',
    name
  ),
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
  text.partnerProfileScreen.blockErrorTitle,
  text.partnerProfileScreen.connectionError
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
    text.partnerProfileScreen.loginRequiredTitle,
    text.partnerProfileScreen.loginRequiredMessage
  );
  return;
}

 if (!partnerId) {
  Alert.alert(
    text.partnerProfileScreen.profileUnavailableTitle,
    text.partnerProfileScreen.profileUnavailableMessage
  );
  return;
}

  if (currentUser.uid === partnerId) {
  Alert.alert(
    text.partnerProfileScreen.invalidRequestTitle,
    text.partnerProfileScreen.invalidRequestMessage
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
  text.partnerProfileScreen.interactionUnavailableTitle,
  text.partnerProfileScreen.interactionUnavailableMessage
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
  text.partnerProfileScreen.existingConnectionTitle,
  text.partnerProfileScreen.existingConnectionMessage.replace(
    '{name}',
    displayedName
  )
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
  text.partnerProfileScreen.existingConnectionTitle,
  text.partnerProfileScreen.existingConnectionMessage.replace(
    '{name}',
    displayedName
  )
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
  text.partnerProfileScreen.requestAlreadySentTitle,
  text.partnerProfileScreen.requestAlreadySentMessage.replace(
    '{name}',
    displayedName
  )
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
  text.partnerProfileScreen.requestReceivedTitle,
  text.partnerProfileScreen.requestReceivedMessage.replace(
    '{name}',
    displayedName
  )
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
  text.partnerProfileScreen.requestUnavailableTitle,
  text.partnerProfileScreen.rejectedRequestMessage
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
  text.partnerProfileScreen.requestSentTitle,
  text.partnerProfileScreen.requestSentMessage.replace(
    '{name}',
    displayedName
  )
);
  } catch (error) {
    console.error(
      'Error sending connection request:',
      error
    );

    Alert.alert(
  text.partnerProfileScreen.sendErrorTitle,
  text.partnerProfileScreen.sendErrorMessage
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
              {text.partnerProfileScreen.back}
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
  ? text.partnerProfileScreen.online
  : text.partnerProfileScreen.offline}
              </Text>
            </View>
          </View>
{bio ? (
  <>
    <Text style={styles.aboutTitle}>
      {text.partnerProfileScreen.aboutMe}
    </Text>

    <View style={styles.aboutCard}>
      <Text style={styles.aboutText}>
        {bio}
      </Text>
    </View>
  </>
) : null}

          <Text style={styles.sectionTitle}>
            {text.partnerProfileScreen.languageProfile}
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
                  {text.partnerProfileScreen.nativeLanguage}
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
                  {text.partnerProfileScreen.learning}
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
                  {text.partnerProfileScreen.currentLevel}
                </Text>

                <Text style={styles.informationValue}>
                  {getLevelName(displayedLevel)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.matchCard}>
  <Text style={styles.matchTitle}>
    {text.partnerProfileScreen.matchTitle}
  </Text>

  <Text style={styles.matchDescription}>
    {text.partnerProfileScreen.matchDescription}
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
    ? text.partnerProfileScreen.sending
    : text.partnerProfileScreen.checkingConnection}
</Text>
    </View>
  ) : (
    <Text style={styles.connectButtonText}>
  {connectionState === 'none'
    ? text.partnerProfileScreen.sendRequest
    : connectionState === 'sent'
      ? text.partnerProfileScreen.requestSent
      : connectionState === 'received'
        ? text.partnerProfileScreen.viewReceivedRequest
        : connectionState === 'connected'
          ? text.partnerProfileScreen.openConversation
          : connectionState === 'rejected'
            ? text.partnerProfileScreen.requestUnavailable
            : text.partnerProfileScreen.interactionUnavailable}
</Text>
  )}
</TouchableOpacity>
<TouchableOpacity
    style={styles.blockButton}
    onPress={handleBlockUser}
    activeOpacity={0.85}
  >
    <Text style={styles.blockButtonText}>
  {text.partnerProfileScreen.blockUser}
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
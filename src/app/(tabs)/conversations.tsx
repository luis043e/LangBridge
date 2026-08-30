import {
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/language-context';
import { auth, db } from '../../firebaseConfig';
import { translations } from '../../translations';
type ConversationItem = {
  id: string;
  partnerId: string;
  partnerName: string;
  photoURL: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
};
export default function ConversationsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
  lang?: string;
}>();

const { language } = useLanguage();
const text = translations[language];
const [conversations, setConversations] =
  useState<ConversationItem[]>([]);

const [isLoading, setIsLoading] =
  useState(true);

const [loadError, setLoadError] =
  useState<string | null>(null);
  useEffect(() => {
  const loadConversations = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoadError(
  text.conversationsScreen.loginRequired
);

      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      const conversationsQuery = query(
        collection(db, 'conversations'),
        where(
          'participants',
          'array-contains',
          currentUser.uid
        )
      );

      const conversationsSnapshot =
        await getDocs(conversationsQuery);

      const loadedConversations:
  ConversationItem[] = await Promise.all(
    conversationsSnapshot.docs.map(
      async (conversationDocument) => {
        const data =
          conversationDocument.data();

        const participants: string[] =
          data.participants || [];

        const partnerId =
          participants.find(
            (participantId) =>
              participantId !== currentUser.uid
          ) || '';

        let partnerName =
  text.conversationsScreen.defaultPartnerName;
        
        let partnerPhotoURL = '';  

        if (partnerId) {
          const partnerProfileSnapshot =
            await getDoc(
              doc(db, 'users', partnerId)
            );

          if (partnerProfileSnapshot.exists()) {
            const partnerProfile =
              partnerProfileSnapshot.data();

            partnerName =
              partnerProfile.fullName?.trim() ||
              partnerProfile.email?.split('@')[0] ||
              partnerName;

          partnerPhotoURL =
  typeof partnerProfile.photoURL === 'string'
    ? partnerProfile.photoURL
    : '';
          }
        }

        const latestMessageQuery = query(
  collection(
    db,
    'conversations',
    conversationDocument.id,
    'messages'
  ),
  orderBy('createdAt', 'desc'),
  limit(1)
);

const latestMessageSnapshot =
  await getDocs(latestMessageQuery);

const latestMessageDocument =
  latestMessageSnapshot.docs[0];

const latestMessageData =
  latestMessageDocument?.data();

const unreadMessagesQuery = query(
  collection(
    db,
    'conversations',
    conversationDocument.id,
    'messages'
  ),
  where('senderId', '==', partnerId),
  where('readAt', '==', null)
);

const unreadMessagesSnapshot =
  await getCountFromServer(unreadMessagesQuery);

const unreadCount =
  unreadMessagesSnapshot.data().count;

const latestMessageDate =
  latestMessageData?.createdAt?.toDate?.();

const formattedTime = latestMessageDate
  ? latestMessageDate.toLocaleTimeString(
      text.conversationsScreen.timeLocale,
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  : '';

return {
  id: conversationDocument.id,
  partnerId,
  partnerName,
  photoURL: partnerPhotoURL,
  lastMessage:
  latestMessageData?.text ||
  text.conversationsScreen.noMessagesYet,
  lastMessageTime: formattedTime,
  unreadCount,
};
      }
    )
  );

      setConversations(loadedConversations);
    } catch (error) {
      console.error(
        'Error loading conversations:',
        error
      );

      setLoadError(
  text.conversationsScreen.loadError
);
    } finally {
      setIsLoading(false);
    }
  };

  loadConversations();
}, [language]);
  return (
    <SafeAreaView
  style={styles.safeArea}
  edges={['top', 'left', 'right']}
>
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
              {text.conversationsScreen.back}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {text.conversationsScreen.title}
          </Text>

          <Text style={styles.subtitle}>
            {text.conversationsScreen.subtitle}
          </Text>

          {isLoading ? (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyIcon}>⏳</Text>

    <Text style={styles.emptyTitle}>
      {text.conversationsScreen.loading}
    </Text>
  </View>
) : loadError ? (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyIcon}>⚠️</Text>

    <Text style={styles.emptyTitle}>
     {text.conversationsScreen.loadErrorTitle}
    </Text>

    <Text style={styles.emptyText}>
      {loadError}
    </Text>
  </View>
) : conversations.length === 0 ? (
  <View style={styles.emptyCard}>
    <Text style={styles.emptyIcon}>💬</Text>

    <Text style={styles.emptyTitle}>
      {text.conversationsScreen.emptyTitle}
    </Text>

    <Text style={styles.emptyText}>
      {text.conversationsScreen.emptyDescription}
    </Text>
  </View>
) : (
  conversations.map((conversation) => (
    <TouchableOpacity
      key={conversation.id}
      style={styles.conversationCard}
      onPress={() =>
        router.push({
          pathname: '/chat',
          params: {
            lang: language,
            connectionId: conversation.id,
            partnerId: conversation.partnerId,
            partnerName: conversation.partnerName,
            partnerPhotoURL: conversation.photoURL,
          },
        })
      }
      activeOpacity={0.85}
    >
      <View style={styles.avatar}>
  {conversation.photoURL ? (
    <Image
      source={{ uri: conversation.photoURL }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.avatarText}>
      {conversation.partnerName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) =>
          part.charAt(0).toUpperCase()
        )
        .join('') || 'LB'}
    </Text>
  )}
</View>

      <View style={styles.conversationInformation}>
        <Text
          style={styles.partnerName}
          numberOfLines={1}
        >
          {conversation.partnerName}
        </Text>

        <Text
          style={styles.lastMessage}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>
      </View>

      <View style={styles.timeContainer}>
  <Text style={styles.lastMessageTime}>
    {conversation.lastMessageTime}
  </Text>

  {conversation.unreadCount > 0 ? (
    <View style={styles.unreadBadge}>
      <Text style={styles.unreadBadgeText}>
        {conversation.unreadCount > 99
          ? '99+'
          : conversation.unreadCount}
      </Text>
    </View>
  ) : null}

  <Text style={styles.arrow}>›</Text>
</View>
    </TouchableOpacity>
  ))
)}
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

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },

  emptyText: {
    color: '#A8B3CF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
  conversationCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  padding: 16,
  marginBottom: 14,
},

avatar: {
  width: 56,
  height: 56,
  borderRadius: 18,
  backgroundColor: '#19284A',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
  overflow: 'hidden',
},

avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 999,
},

avatarText: {
  color: '#22D3EE',
  fontSize: 18,
  fontWeight: 'bold',
},

conversationInformation: {
  flex: 1,
  minWidth: 0,
},

partnerName: {
  color: '#FFFFFF',
  fontSize: 17,
  fontWeight: 'bold',
},

lastMessage: {
  color: '#A8B3CF',
  fontSize: 13,
  lineHeight: 19,
  marginTop: 5,
},

timeContainer: {
  alignItems: 'flex-end',
  justifyContent: 'center',
  marginLeft: 10,
},

lastMessageTime: {
  color: '#94A3B8',
  fontSize: 11,
  marginBottom: 7,
},

arrow: {
  color: '#64748B',
  fontSize: 26,
},
unreadBadge: {
  minWidth: 22,
  height: 22,
  borderRadius: 11,
  paddingHorizontal: 6,
  backgroundColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 7,
},

unreadBadgeText: {
  color: '#050B24',
  fontSize: 11,
  fontWeight: 'bold',
},
});
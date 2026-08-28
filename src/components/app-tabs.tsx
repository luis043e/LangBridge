import Ionicons from '@expo/vector-icons/Ionicons';
import {
  useLocalSearchParams,
  usePathname,
  useRouter,
} from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLanguage } from '../contexts/language-context';
import { auth, db } from '../firebaseConfig';
type TabItem = {
  route:
    | '/home'
    | '/explore'
    | '/conversations'
    | '/settings';
icon: keyof typeof Ionicons.glyphMap;
labelEs: string;
labelEn: string;
iconColor: string;
iconBackground: string;
};

const tabItems: TabItem[] = [
  {
    route: '/home',
    icon: 'home',
    labelEs: 'Inicio',
    labelEn: 'Home',
    iconColor: '#22D3EE',
    iconBackground: '#123B5D',
  },
  {
    route: '/explore',
    icon: 'search',
    labelEs: 'Explorar',
    labelEn: 'Explore',
    iconColor: '#A78BFA',
    iconBackground: '#30245C',
  },
  {
    route: '/conversations',
    icon: 'chatbubbles',
    labelEs: 'Chats',
    labelEn: 'Chats',
    iconColor: '#34D399',
    iconBackground: '#123F3A',
  },
  {
    route: '/settings',
    icon: 'person',
    labelEs: 'Perfil',
    labelEn: 'Profile',
    iconColor: '#F472B6',
    iconBackground: '#4A2146',
  },
];

export default function AppTabs() {
  const router = useRouter();
  const pathname = usePathname();
    const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const { language } = useLanguage();
  
  const [unreadMessagesTotal, setUnreadMessagesTotal] =
  useState(0);

useEffect(() => {
  let conversationUnsubscribe: (() => void) | null =
    null;

  let messageUnsubscribers: Array<() => void> = [];

  const clearMessageListeners = () => {
    messageUnsubscribers.forEach((unsubscribe) => {
      unsubscribe();
    });

    messageUnsubscribers = [];
  };

  const authUnsubscribe = onAuthStateChanged(
    auth,
    (currentUser) => {
      if (conversationUnsubscribe) {
        conversationUnsubscribe();
        conversationUnsubscribe = null;
      }

      clearMessageListeners();
      setUnreadMessagesTotal(0);

      if (!currentUser) {
        return;
      }

      const conversationsQuery = query(
        collection(db, 'conversations'),
        where(
          'participants',
          'array-contains',
          currentUser.uid
        )
      );

      conversationUnsubscribe = onSnapshot(
        conversationsQuery,
        (conversationsSnapshot) => {
          clearMessageListeners();

          const unreadCounts = new Map<string, number>();

          const updateTotal = () => {
            const total = Array.from(
              unreadCounts.values()
            ).reduce(
              (sum, unreadCount) =>
                sum + unreadCount,
              0
            );

            setUnreadMessagesTotal(total);
          };

          if (conversationsSnapshot.empty) {
            setUnreadMessagesTotal(0);
            return;
          }

          conversationsSnapshot.docs.forEach(
            (conversationDocument) => {
              const unreadMessagesQuery = query(
                collection(
                  db,
                  'conversations',
                  conversationDocument.id,
                  'messages'
                ),
                where('readAt', '==', null)
              );

              const messageUnsubscribe = onSnapshot(
                unreadMessagesQuery,
                (messagesSnapshot) => {
                  const unreadCount =
                    messagesSnapshot.docs.filter(
                      (messageDocument) =>
                        messageDocument.data()
                          .senderId !== currentUser.uid
                    ).length;

                  unreadCounts.set(
                    conversationDocument.id,
                    unreadCount
                  );

                  updateTotal();
                },
                (error) => {
                  console.error(
                    'Error loading unread messages:',
                    error
                  );
                }
              );

              messageUnsubscribers.push(
                messageUnsubscribe
              );
            }
          );
        },
        (error) => {
          console.error(
            'Error loading conversations:',
            error
          );
        }
      );
    }
  );

  return () => {
    authUnsubscribe();

    if (conversationUnsubscribe) {
      conversationUnsubscribe();
    }

    clearMessageListeners();
  };
}, []);  
  const handleTabPress = (route: TabItem['route']) => {
    if (pathname === route) {
      return;
    }

    router.replace({
      pathname: route,
      params: {
        lang: language,
      },
    });
  };

  return (
    <View
  style={[
    styles.navigationContainer,
    {
      paddingBottom: Math.max(insets.bottom, 8),
      minHeight: 64 + Math.max(insets.bottom, 8),
    },
  ]}
>
      {tabItems.map((tab) => {
        const isActive = pathname === tab.route;

        return (
          <TouchableOpacity
            key={tab.route}
            style={styles.tabButton}
            onPress={() => handleTabPress(tab.route)}
            activeOpacity={0.8}
          >
            <View
  style={[
    styles.iconContainer,
    {
      backgroundColor: tab.iconBackground,
      borderColor: isActive
        ? '#22D3EE'
        : `${tab.iconColor}80`,
    },
    isActive && styles.activeIconContainer,
  ]}
>
  <Ionicons
    name={tab.icon}
    size={24}
    color={tab.iconColor}
  />

{tab.route === '/conversations' &&
unreadMessagesTotal > 0 ? (
  <View style={styles.unreadBadge}>
    <Text style={styles.unreadBadgeText}>
      {unreadMessagesTotal > 99
        ? '99+'
        : unreadMessagesTotal}
    </Text>
  </View>
) : null}
</View>

            <Text
  style={[
    styles.label,
    {
      color: isActive
        ? tab.iconColor
        : '#8B9ABA',
    },
    isActive && styles.activeLabel,
  ]}
>
              {language === 'es'
                ? tab.labelEs
                : tab.labelEn}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#0B1430',
    borderTopWidth: 1,
    borderTopColor: '#25365F',
    paddingHorizontal: 8,
    paddingTop: 8,
  },

  tabButton: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
  width: 42,
  height: 38,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 14,
  borderWidth: 1.5,
},

  activeIconContainer: {
  borderWidth: 2,
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.35,
  shadowRadius: 7,
  elevation: 6,
},

  label: {
    color: '#7485A8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 3,
  },

  activeLabel: {
    color: '#22D3EE',
    fontWeight: 'bold',
  },

  unreadBadge: {
  position: 'absolute',
  top: -7,
  right: -11,
  minWidth: 19,
  height: 19,
  borderRadius: 10,
  paddingHorizontal: 5,
  backgroundColor: '#EF4444',
  borderWidth: 2,
  borderColor: '#050B24',
  alignItems: 'center',
  justifyContent: 'center',
},

unreadBadgeText: {
  color: '#FFFFFF',
  fontSize: 10,
  lineHeight: 12,
  fontWeight: 'bold',
},
});
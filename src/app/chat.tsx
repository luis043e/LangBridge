import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  limitToLast,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../contexts/language-context';

import { auth, db } from '../firebaseConfig';
import { translations } from '../translations';

type Message = {
  id: string;
  text: string;
  isOwn: boolean;
  time: string;
  readAt: Date | null;
};

export default function ChatScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
  lang?: string;
  partnerPhotoURL?: string;
  connectionId?: string;
  partnerId?: string;
  partnerName?: string;
}>();

  const { language } = useLanguage();

const text = translations[language];

  const partnerName =
  params.partnerName ||
  text.chatScreen.defaultPartnerName;
  const partnerPhotoURL =
  params.partnerPhotoURL || '';

  const connectionId = params.connectionId || '';
 const [isPreparingChat, setIsPreparingChat] =
  useState(true);

const [chatError, setChatError] =
  useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [olderMessages, setOlderMessages] =
    useState<Message[]>([]);

  const [
    isLoadingOlderMessages,
    setIsLoadingOlderMessages,
  ] = useState(false);

  const [
    hasOlderMessages,
    setHasOlderMessages,
  ] = useState(false);

  const [
    olderMessagesError,
    setOlderMessagesError,
  ] = useState<string | null>(null);

  const messagesScrollRef =
    useRef<ScrollView>(null);
  const oldestLoadedMessageRef =
    useRef<
      QueryDocumentSnapshot<DocumentData> | null
    >(null);

  const hasLoadedOlderMessagesRef =
    useRef(false);

  const shouldScrollToEndRef =
    useRef(true);

  const recentMessagesRef =
    useRef<Message[]>([]);

  const pendingReadMessageIdsRef =
    useRef<Set<string>>(
      new Set()
    );
  useEffect(() => {
  const prepareConversation = async () => {
    const currentUser = auth.currentUser;
    const partnerId = params.partnerId;

    if (!currentUser || !connectionId || !partnerId) {
      setChatError(
  text.chatScreen.preparationError
);
      setIsPreparingChat(false);
      return;
    }

    try {
      setIsPreparingChat(true);
      setChatError(null);

      const conversationReference = doc(
        db,
        'conversations',
        connectionId
      );

      const conversationSnapshot = await getDoc(
        conversationReference
      );

      if (!conversationSnapshot.exists()) {
        await setDoc(conversationReference, {
          connectionId,
          participants: [
            currentUser.uid,
            partnerId,
          ],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(
        'Error preparing conversation:',
        error
      );

      setChatError(
  text.chatScreen.openError
);
    } finally {
      setIsPreparingChat(false);
    }
  };

  prepareConversation();
}, [
  connectionId,
  language,
  params.partnerId,
]);
  const initials = partnerName
  useEffect(() => {
    const currentUser = auth.currentUser;

    if (
      !currentUser ||
      !connectionId ||
      isPreparingChat
    ) {
      return;
    }
    setOlderMessages([]);
    setOlderMessagesError(null);
    setHasOlderMessages(false);
    setIsLoadingOlderMessages(false);

    oldestLoadedMessageRef.current =
      null;

    hasLoadedOlderMessagesRef.current =
      false;

    shouldScrollToEndRef.current =
      true;
    recentMessagesRef.current =
      [];
  const messagesQuery = query(
    collection(
      db,
      'conversations',
      connectionId,
      'messages'
    ),
    orderBy('createdAt', 'asc'),
    limitToLast(50)
  );

  const unsubscribe = onSnapshot(
    messagesQuery,
    (messagesSnapshot) => {
      const oldestRecentMessage =
        messagesSnapshot.docs[0];

      if (
        !hasLoadedOlderMessagesRef.current
      ) {
        oldestLoadedMessageRef.current =
          oldestRecentMessage ?? null;

        setHasOlderMessages(
          messagesSnapshot.size === 50
        );
      }
      const loadedMessages: Message[] =
        messagesSnapshot.docs.map(
          (messageDocument) => {
            const data = messageDocument.data();

            const messageDate =
  data.createdAt?.toDate?.();

const formattedTime = messageDate
  ? messageDate.toLocaleTimeString(
      text.chatScreen.timeLocale,
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    )
  : '';

return {
  id: messageDocument.id,
  text: data.text || '',
  isOwn:
    data.senderId === currentUser.uid,
  readAt: data.readAt?.toDate?.() ?? null,
  time: formattedTime,
};
          }
        );
      const unreadReceivedMessages =
        messagesSnapshot.docs.filter(
          (messageDocument) => {
            const data =
              messageDocument.data();

            if (data.readAt) {
              pendingReadMessageIdsRef.current.delete(
                messageDocument.id
              );

              return false;
            }

            return (
              data.senderId !== currentUser.uid &&
              !pendingReadMessageIdsRef.current.has(
                messageDocument.id
              )
            );
          }
        );

      if (unreadReceivedMessages.length > 0) {
        const readBatch = writeBatch(db);

        unreadReceivedMessages.forEach(
          (messageDocument) => {
            pendingReadMessageIdsRef.current.add(
              messageDocument.id
            );

            readBatch.update(
              messageDocument.ref,
              {
                readAt: serverTimestamp(),
              }
            );
          }
        );

        void readBatch.commit().catch(() => {
          unreadReceivedMessages.forEach(
            (messageDocument) => {
              pendingReadMessageIdsRef.current.delete(
                messageDocument.id
              );
            }
          );
        });
      }
            if (
        hasLoadedOlderMessagesRef.current
      ) {
        const recentMessageIds =
          new Set(
            loadedMessages.map(
              (message) => message.id
            )
          );

        const messagesLeavingRecentWindow =
          recentMessagesRef.current.filter(
            (message) =>
              !recentMessageIds.has(
                message.id
              )
          );

        if (
          messagesLeavingRecentWindow.length > 0
        ) {
          setOlderMessages(
            (currentOlderMessages) => {
              const currentIds =
                new Set(
                  currentOlderMessages.map(
                    (message) =>
                      message.id
                  )
                );

              return [
                ...currentOlderMessages,
                ...messagesLeavingRecentWindow.filter(
                  (message) =>
                    !currentIds.has(
                      message.id
                    )
                ),
              ];
            }
          );
        }
      }

      recentMessagesRef.current =
        loadedMessages;

      setMessages(loadedMessages);
      setChatError(null);
    },
    () => {
      setMessages([]);
      setChatError(
        text.chatScreen.messagesLoadError
      );
    }
  );

  return unsubscribe;
}, [
  connectionId,
  isPreparingChat,
  language,
]);
  const handleLoadOlderMessages =
    async () => {
      const currentUser =
        auth.currentUser;

      const oldestLoadedMessage =
        oldestLoadedMessageRef.current;

      if (
        !currentUser ||
        !connectionId ||
        !oldestLoadedMessage ||
        isLoadingOlderMessages ||
        !hasOlderMessages
      ) {
        return;
      }

      try {
        setIsLoadingOlderMessages(true);
        setOlderMessagesError(null);

        const {
          endBefore,
          getDocs,
        } = await import(
          'firebase/firestore'
        );

        const olderMessagesQuery =
          query(
            collection(
              db,
              'conversations',
              connectionId,
              'messages'
            ),
            orderBy(
              'createdAt',
              'asc'
            ),
            endBefore(
              oldestLoadedMessage
            ),
            limitToLast(50)
          );

        const olderMessagesSnapshot =
          await getDocs(
            olderMessagesQuery
          );

        const loadedOlderMessages:
          Message[] =
          olderMessagesSnapshot.docs.map(
            (messageDocument) => {
              const data =
                messageDocument.data();

              const messageDate =
                data.createdAt
                  ?.toDate?.();

              const formattedTime =
                messageDate
                  ? messageDate
                      .toLocaleTimeString(
                        text.chatScreen
                          .timeLocale,
                        {
                          hour:
                            '2-digit',
                          minute:
                            '2-digit',
                        }
                      )
                  : '';

              return {
                id:
                  messageDocument.id,
                text:
                  data.text || '',
                isOwn:
                  data.senderId ===
                  currentUser.uid,
                readAt:
                  data.readAt
                    ?.toDate?.() ??
                  null,
                time:
                  formattedTime,
              };
            }
          );

        if (
          olderMessagesSnapshot.empty
        ) {
          setHasOlderMessages(false);
          return;
        }

        const oldestOlderMessage =
          olderMessagesSnapshot.docs[0];

        oldestLoadedMessageRef.current =
          oldestOlderMessage ?? null;

        hasLoadedOlderMessagesRef.current =
          true;

        shouldScrollToEndRef.current =
          false;

        setOlderMessages(
          (currentOlderMessages) => {
            const existingIds =
              new Set([
                ...currentOlderMessages,
                ...messages,
              ].map(
                (message) =>
                  message.id
              ));

            const uniqueOlderMessages =
              loadedOlderMessages.filter(
                (message) =>
                  !existingIds.has(
                    message.id
                  )
              );

            return [
              ...uniqueOlderMessages,
              ...currentOlderMessages,
            ];
          }
        );

        setHasOlderMessages(
          olderMessagesSnapshot.size ===
            50
        );
      } catch (error) {
        console.error(
          'Error loading older chat messages:',
          error
        );

        setOlderMessagesError(
          text.chatScreen
            .olderMessagesLoadError
        );
      } finally {
        setIsLoadingOlderMessages(false);
      }
    };
  const handleSendMessage = async () => {
  const cleanMessage = messageText.trim();
  const currentUser = auth.currentUser;

  if (
    !cleanMessage ||
    isSending ||
    isPreparingChat
  ) {
    return;
  }
  if (!currentUser || !connectionId) {
    setChatError(
  text.chatScreen.identificationError
);
    return;
  }

  try {
    setIsSending(true);
    setChatError(null);

    await addDoc(
      collection(
        db,
        'conversations',
        connectionId,
        'messages'
      ),
      {
        senderId: currentUser.uid,
        text: cleanMessage,
        createdAt: serverTimestamp(),
        readAt: null,
      }
    );

    setMessageText('');
  } catch (error) {
    console.error(
      'Error sending chat message:',
      error
    );

    setChatError(
  text.chatScreen.sendError
);
  } finally {
    setIsSending(false);
  }
};
  const displayedMessages = [
    ...olderMessages,
    ...messages,
  ].filter(
    (message, index, allMessages) =>
      allMessages.findIndex(
        (candidateMessage) =>
          candidateMessage.id === message.id
      ) === index
  );
  return (
  <SafeAreaView style={styles.safeArea}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
      keyboardVerticalOffset={0}
    >
        <StatusBar style="light" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
  router.replace('/conversations');
}}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              ‹
            </Text>
          </TouchableOpacity>

          <View style={styles.avatar}>
  {partnerPhotoURL ? (
    <Image
      source={{ uri: partnerPhotoURL }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.avatarText}>
      {initials || 'LB'}
    </Text>
  )}
</View>
          <View style={styles.headerInformation}>
            <Text
              style={styles.partnerName}
              numberOfLines={1}
            >
              {partnerName}
            </Text>

            <Text style={styles.statusText}>
              {text.chatScreen.connectionStatus}
            </Text>
          </View>
        </View>

        <ScrollView
  ref={messagesScrollRef}
  style={styles.messagesArea}
  contentContainerStyle={styles.messagesContent}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
    maintainVisibleContentPosition={{
    minIndexForVisible: 0,
  }}
  onContentSizeChange={() => {
    if (
      !shouldScrollToEndRef.current
    ) {
      shouldScrollToEndRef.current =
        true;

      return;
    }

    messagesScrollRef.current?.scrollToEnd({
      animated: true,
    });
  }}
>
          {hasOlderMessages ? (
            <TouchableOpacity
              style={
                styles.loadOlderMessagesButton
              }
              onPress={
                handleLoadOlderMessages
              }
              activeOpacity={0.8}
              disabled={
                isLoadingOlderMessages
              }
            >
              <Text
                style={
                  styles.loadOlderMessagesText
                }
              >
                {isLoadingOlderMessages
                  ? text.chatScreen
                      .loadingOlderMessages
                  : text.chatScreen
                      .loadOlderMessages}
              </Text>
            </TouchableOpacity>
          ) : olderMessages.length > 0 ? (
            <Text
              style={
                styles.noOlderMessagesText
              }
            >
              {
                text.chatScreen
                  .noOlderMessages
              }
            </Text>
          ) : null}

          {olderMessagesError ? (
            <View
              style={
                styles.olderMessagesErrorBox
              }
            >
              <Text
                style={
                  styles.olderMessagesErrorText
                }
              >
                {olderMessagesError}
              </Text>

              {hasOlderMessages ? (
                <TouchableOpacity
                  onPress={
                    handleLoadOlderMessages
                  }
                  disabled={
                    isLoadingOlderMessages
                  }
                >
                  <Text
                    style={
                      styles.olderMessagesRetryText
                    }
                  >
                    {
                      text.chatScreen
                        .loadOlderMessages
                    }
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}
          {displayedMessages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                💬
              </Text>

              <Text style={styles.emptyTitle}>
                {text.chatScreen.emptyTitle}
              </Text>

              <Text style={styles.emptyText}>
                {text.chatScreen.emptyDescription.replace(
  '{partnerName}',
  partnerName
)}
              </Text>
            </View>
          ) : (
            displayedMessages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isOwn
                    ? styles.ownMessage
                    : styles.partnerMessage,
                ]}
              >
                <Text style={styles.messageText}>
  {message.text}
</Text>

{message.time ? (
  <Text
    style={[
      styles.messageTime,
      message.isOwn
        ? styles.ownMessageTime
        : styles.partnerMessageTime,
    ]}
  >
    {message.time}
    {message.isOwn
      ? ` · ${
          message.readAt
  ? text.chatScreen.seen
  : text.chatScreen.sent
        }`
      : ''}
  </Text>
) : null}
              </View>
            ))
          )}
        </ScrollView>

        <View style={styles.composer}>
  <TextInput
    style={styles.messageInput}
    placeholder={
  text.chatScreen.messagePlaceholder
}
    placeholderTextColor="#64748B"
    value={messageText}
    onChangeText={setMessageText}
    multiline
    maxLength={1000}
    editable={!isSending}
  />

  <TouchableOpacity
    style={[
      styles.sendButton,
      (!messageText.trim() ||
        isSending ||
        isPreparingChat) &&
        styles.disabledSendButton,
    ]}
    onPress={handleSendMessage}
    activeOpacity={0.85}
    disabled={
      !messageText.trim() ||
      isSending ||
      isPreparingChat
    }
  >
    <Text style={styles.sendButtonText}>
      {isSending ? '…' : '➤'}
    </Text>
  </TouchableOpacity>
</View>
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

  header: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#0B1430',
    borderBottomWidth: 1,
    borderBottomColor: '#263556',
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 34,
    lineHeight: 36,
    fontWeight: '400',
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#19284A',
    borderWidth: 1.5,
    borderColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },

  avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 999,
},

  avatarText: {
    color: '#22D3EE',
    fontSize: 15,
    fontWeight: 'bold',
  },

  headerInformation: {
    flex: 1,
    minWidth: 0,
  },

  partnerName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  statusText: {
    color: '#A7F3D0',
    fontSize: 12,
    marginTop: 3,
  },

  messagesArea: {
    flex: 1,
  },

  messagesContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
  },
    loadOlderMessagesButton: {
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 14,
    marginBottom: 16,
    backgroundColor: '#172554',
    borderWidth: 1,
    borderColor: '#334E82',
  },

  loadOlderMessagesText: {
    color: '#67E8F9',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  noOlderMessagesText: {
    color: '#7D8BA8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },

  olderMessagesErrorBox: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
  },

  olderMessagesErrorText: {
    color: '#FCA5A5',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },

  olderMessagesRetryText: {
    color: '#67E8F9',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },

  emptyText: {
    color: '#A8B3CF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
  },

  messageBubble: {
    maxWidth: '82%',
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 11,
    marginBottom: 10,
  },

  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
    borderBottomRightRadius: 6,
  },

  partnerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#111C3A',
    borderWidth: 1,
    borderColor: '#334C7D',
    borderBottomLeftRadius: 6,
  },

  messageText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
  },

  messageTime: {
  fontSize: 10,
  marginTop: 5,
  alignSelf: 'flex-end',
},

ownMessageTime: {
  color: '#C7D2FE',
},

partnerMessageTime: {
  color: '#94A3B8',
},

  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: '#0B1430',
    borderTopWidth: 1,
    borderTopColor: '#263556',
  },

  messageInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 120,
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 18,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
    paddingHorizontal: 16,
    paddingTop: 13,
    paddingBottom: 12,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  disabledSendButton: {
    backgroundColor: '#263556',
  },

  sendButtonText: {
    color: '#050B24',
    fontSize: 21,
    fontWeight: 'bold',
  },
});
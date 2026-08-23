import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
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

import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

type Message = {
  id: string;
  text: string;
  isOwn: boolean;
  time: string;
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

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const partnerName =
    params.partnerName ||
    (language === 'es'
      ? 'Compañero de LangBridge'
      : 'LangBridge partner');
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

  const messagesScrollRef =
  useRef<ScrollView>(null);
useEffect(() => {
  const prepareConversation = async () => {
    const currentUser = auth.currentUser;
    const partnerId = params.partnerId;

    if (!currentUser || !connectionId || !partnerId) {
      setChatError(
        language === 'es'
          ? 'No se pudo preparar esta conversación.'
          : 'This conversation could not be prepared.'
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
        language === 'es'
          ? 'No se pudo abrir la conversación. Inténtalo nuevamente.'
          : 'The conversation could not be opened. Try again.'
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

  if (!currentUser || !connectionId) {
    return;
  }

  const messagesQuery = query(
    collection(
      db,
      'conversations',
      connectionId,
      'messages'
    ),
    orderBy('createdAt', 'asc')
  );

  const unsubscribe = onSnapshot(
    messagesQuery,
    (messagesSnapshot) => {
      const loadedMessages: Message[] =
        messagesSnapshot.docs.map(
          (messageDocument) => {
            const data = messageDocument.data();

            const messageDate =
  data.createdAt?.toDate?.();

const formattedTime = messageDate
  ? messageDate.toLocaleTimeString(
      language === 'es' ? 'es-DO' : 'en-US',
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
  time: formattedTime,
};
          }
        );

      setMessages(loadedMessages);
    },
    (error) => {
      console.error(
        'Error loading chat messages:',
        error
      );

      setChatError(
        language === 'es'
          ? 'No se pudieron cargar los mensajes.'
          : 'Messages could not be loaded.'
      );
    }
  );

  return unsubscribe;
}, [connectionId, language]);
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
      language === 'es'
        ? 'No se pudo identificar esta conversación.'
        : 'This conversation could not be identified.'
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
      }
    );

    setMessageText('');
  } catch (error) {
    console.error(
      'Error sending chat message:',
      error
    );

    setChatError(
      language === 'es'
        ? 'No se pudo enviar el mensaje. Revisa tu conexión e inténtalo nuevamente.'
        : 'The message could not be sent. Check your connection and try again.'
    );
  } finally {
    setIsSending(false);
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
      keyboardVerticalOffset={0}
    >
        <StatusBar style="light" />

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
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
              {language === 'es'
                ? 'Conexión de idiomas'
                : 'Language connection'}
            </Text>
          </View>
        </View>

        <ScrollView
  ref={messagesScrollRef}
  style={styles.messagesArea}
  contentContainerStyle={styles.messagesContent}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  onContentSizeChange={() =>
    messagesScrollRef.current?.scrollToEnd({
      animated: true,
    })
  }
>
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>
                💬
              </Text>

              <Text style={styles.emptyTitle}>
                {language === 'es'
                  ? 'Comienza la conversación'
                  : 'Start the conversation'}
              </Text>

              <Text style={styles.emptyText}>
                {language === 'es'
                  ? `Envía un mensaje a ${partnerName} para comenzar a practicar.`
                  : `Send a message to ${partnerName} to start practicing.`}
              </Text>
            </View>
          ) : (
            messages.map((message) => (
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
      language === 'es'
        ? 'Escribe un mensaje...'
        : 'Write a message...'
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
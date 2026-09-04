import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
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
import { useLanguage } from '../contexts/language-context';

import { auth, db } from '../firebaseConfig';
import { translations } from '../translations';

type ConnectionRequest = {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  status: 'pending' | 'accepted' | 'rejected';
};

export default function RequestsScreen() {
  const router = useRouter();

const { language } = useLanguage();

const text = translations[language];
    
  const [requests, setRequests] =
    useState<ConnectionRequest[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [processingRequestId, setProcessingRequestId] =
  useState<string | null>(null);

  useEffect(() => {
    const loadRequests = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setLoadError(
  text.requestsScreen.loginRequired
);

        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadError(null);

        const requestsQuery = query(
          collection(db, 'connectionRequests'),
          where(
            'recipientId',
            '==',
            currentUser.uid
          )
        );

        const requestSnapshot =
          await getDocs(requestsQuery);

        const receivedRequests:
          ConnectionRequest[] =
          requestSnapshot.docs
            .map((requestDocument) => {
              const data =
                requestDocument.data();

              return {
                id: requestDocument.id,
                senderId:
                  data.senderId || '',
                recipientId:
                  data.recipientId || '',
                senderName:
  data.senderName ||
  text.requestsScreen.defaultUserName,
                recipientName:
                  data.recipientName || '',
                status:
                  data.status || 'pending',
              };
            })
            .filter((request) => {
              return request.status === 'pending';
            });

        setRequests(receivedRequests);
      } catch (error) {
        console.error(
          'Error loading connection requests:',
          error
        );

        setLoadError(
  text.requestsScreen.loadError
);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [language]);
const handleRequestResponse = async (
  requestId: string,
  newStatus: 'accepted' | 'rejected'
) => {
  if (processingRequestId) {
    return;
  }

  try {
    setProcessingRequestId(requestId);

    const requestReference = doc(
      db,
      'connectionRequests',
      requestId
    );

    await updateDoc(requestReference, {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });

    setRequests((currentRequests) =>
      currentRequests.filter(
        (request) => request.id !== requestId
      )
    );

    Alert.alert(
  newStatus === 'accepted'
    ? text.requestsScreen.acceptedTitle
    : text.requestsScreen.rejectedTitle,
  newStatus === 'accepted'
    ? text.requestsScreen.acceptedMessage
    : text.requestsScreen.rejectedMessage
);
  } catch (error) {
    console.error(
      'Error updating connection request:',
      error
    );

    Alert.alert(
  text.requestsScreen.responseErrorTitle,
  text.requestsScreen.responseErrorMessage
  );
  } finally {
    
    setProcessingRequestId(null);
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
              {text.requestsScreen.back}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {text.requestsScreen.title}
          </Text>

          <Text style={styles.subtitle}>
            {text.requestsScreen.subtitle}
          </Text>

          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator
                color="#22D3EE"
                size="large"
              />

              <Text style={styles.stateTitle}>
                {text.requestsScreen.loading}
              </Text>
            </View>
          ) : loadError ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>
                ⚠️
              </Text>

              <Text style={styles.stateTitle}>
                {text.requestsScreen.loadErrorTitle}
              </Text>

              <Text style={styles.stateText}>
                {loadError}
              </Text>
            </View>
          ) : requests.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>
                🤝
              </Text>

              <Text style={styles.stateTitle}>
                <Text style={styles.stateTitle}>
  {text.requestsScreen.emptyTitle}
</Text>
              </Text>

              <Text style={styles.stateText}>
                {text.requestsScreen.emptyDescription}
              </Text>
            </View>
          ) : (
            requests.map((request) => (
              <View
                key={request.id}
                style={styles.requestCard}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {request.senderName
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) =>
                        part
                          .charAt(0)
                          .toUpperCase()
                      )
                      .join('') || 'LB'}
                  </Text>
                </View>

                <View style={styles.requestInformation}>
                  <Text style={styles.requestName}>
                    {request.senderName}
                  </Text>

                  <Text style={styles.requestDescription}>
                    {text.requestsScreen.wantsToConnect}
                  </Text>

                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>
                      {text.requestsScreen.pending}
                    </Text>
                  </View>
                  <View style={styles.requestActions}>
  <TouchableOpacity
    style={[
      styles.acceptButton,
      processingRequestId === request.id &&
        styles.disabledActionButton,
    ]}
    onPress={() =>
      handleRequestResponse(request.id, 'accepted')
    }
    activeOpacity={0.85}
    disabled={processingRequestId !== null}
  >
    <Text style={styles.acceptButtonText}>
      {processingRequestId === request.id
  ? text.requestsScreen.processing
  : text.requestsScreen.accept}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[
      styles.rejectButton,
      processingRequestId === request.id &&
        styles.disabledActionButton,
    ]}
    onPress={() =>
      handleRequestResponse(request.id, 'rejected')
    }
    activeOpacity={0.85}
    disabled={processingRequestId !== null}
  >
    <Text style={styles.rejectButtonText}>
      {text.requestsScreen.reject}
    </Text>
  </TouchableOpacity>
</View>
                </View>
              </View>
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

  stateCard: {
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 22,
    paddingHorizontal: 22,
    paddingVertical: 34,
  },

  stateIcon: {
    fontSize: 36,
  },

  stateTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 14,
  },

  stateText: {
    color: '#A8B3CF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },

  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#19284A',
    borderWidth: 1.5,
    borderColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarText: {
    color: '#22D3EE',
    fontSize: 18,
    fontWeight: 'bold',
  },

  requestInformation: {
    flex: 1,
  },

  requestName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  requestDescription: {
    color: '#A8B3CF',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4,
  },

  pendingBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#252052',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 9,
  },

  pendingBadgeText: {
    color: '#C4B5FD',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
requestActions: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 14,
},

acceptButton: {
  flex: 1,
  minHeight: 44,
  backgroundColor: '#22D3EE',
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
  paddingVertical: 11,
  marginRight: 10,
},

acceptButtonText: {
  color: '#050B24',
  fontSize: 14,
  fontWeight: 'bold',
},

rejectButton: {
  flex: 1,
  minHeight: 44,
  backgroundColor: '#1B2948',
  borderWidth: 1.5,
  borderColor: '#64748B',
  borderRadius: 14,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 12,
  paddingVertical: 11,
},

rejectButtonText: {
  color: '#E8EEFF',
  fontSize: 14,
  fontWeight: '700',
},

disabledActionButton: {
  opacity: 0.55,
},
});
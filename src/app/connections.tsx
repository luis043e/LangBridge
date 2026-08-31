import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../firebaseConfig';
import {
  translations,
  type AppLanguage,
} from '../translations';

type Connection = {
  id: string;
  partnerId: string;
  partnerName: string;
};

export default function ConnectionsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';
  
  const text = translations[language];
    
  const [connections, setConnections] =
  useState<Connection[]>([]);

const [isLoading, setIsLoading] =
  useState(true);

const [loadError, setLoadError] =
  useState<string | null>(null);
  useEffect(() => {
  const loadConnections = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setLoadError(
  text.connectionsScreen.loginRequired
);

      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setLoadError(null);

      const sentRequestsQuery = query(
        collection(db, 'connectionRequests'),
        where('senderId', '==', currentUser.uid)
      );

      const receivedRequestsQuery = query(
        collection(db, 'connectionRequests'),
        where('recipientId', '==', currentUser.uid)
      );

      const [
        sentRequestsSnapshot,
        receivedRequestsSnapshot,
      ] = await Promise.all([
        getDocs(sentRequestsQuery),
        getDocs(receivedRequestsQuery),
      ]);

      const acceptedConnections: Connection[] = [
        ...sentRequestsSnapshot.docs
          .filter((requestDocument) => {
            return (
              requestDocument.data().status ===
              'accepted'
            );
          })
          .map((requestDocument) => {
            const data = requestDocument.data();

            return {
              id: requestDocument.id,
              partnerId: data.recipientId || '',
              partnerName:
                data.recipientName ||
text.connectionsScreen.defaultUserName
            };
          }),

        ...receivedRequestsSnapshot.docs
          .filter((requestDocument) => {
            return (
              requestDocument.data().status ===
              'accepted'
            );
          })
          .map((requestDocument) => {
            const data = requestDocument.data();

            return {
  id: requestDocument.id,
  partnerId: data.senderId || '',
  partnerName:
    data.senderName ||
    text.connectionsScreen.defaultUserName,
};
          }),
      ];

      const uniqueConnections =
        acceptedConnections.filter(
          (connection, index, allConnections) => {
            return (
              allConnections.findIndex(
                (item) =>
                  item.partnerId ===
                  connection.partnerId
              ) === index
            );
          }
        );

      setConnections(uniqueConnections);
    } catch (error) {
      console.error(
        'Error loading accepted connections:',
        error
      );

      setLoadError(
  text.connectionsScreen.loadError
);
    } finally {
      setIsLoading(false);
    }
  };

  loadConnections();
}, [language]);

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
              {text.connectionsScreen.back}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {text.connectionsScreen.title}
          </Text>

          <Text style={styles.subtitle}>
            {text.connectionsScreen.subtitle}
          </Text>

          {isLoading ? (
            <View style={styles.stateCard}>
              <ActivityIndicator
                color="#22D3EE"
                size="large"
              />

              <Text style={styles.stateTitle}>
                {text.connectionsScreen.loading}
              </Text>
            </View>
          ) : connections.length === 0 ? (
            <View style={styles.stateCard}>
              <Text style={styles.stateIcon}>🤝</Text>

              <Text style={styles.stateTitle}>
                {text.connectionsScreen.emptyTitle}
              </Text>

              <Text style={styles.stateText}>
                {text.connectionsScreen.emptyDescription}
              </Text>
            </View>
          ) : (
            connections.map((connection) => (
              <TouchableOpacity
  key={connection.id}
  style={styles.connectionCard}
  onPress={() =>
    router.push({
      pathname: '/chat',
      params: {
        lang: language,
        connectionId: connection.id,
        partnerId: connection.partnerId,
        partnerName: connection.partnerName,
      },
    })
  }
  activeOpacity={0.85}
>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {connection.partnerName
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) =>
                        part.charAt(0).toUpperCase()
                      )
                      .join('') || 'LB'}
                  </Text>
                </View>

                <View style={styles.connectionInformation}>
                  <Text style={styles.connectionName}>
                    {connection.partnerName}
                  </Text>

                  <Text style={styles.connectionDescription}>
                    {text.connectionsScreen.acceptedConnection}
                  </Text>
                </View>

                <Text style={styles.arrow}>›</Text>
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

  connectionCard: {
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
  },

  avatarText: {
    color: '#22D3EE',
    fontSize: 18,
    fontWeight: 'bold',
  },

  connectionInformation: {
    flex: 1,
  },

  connectionName: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
connectionDescription: {
  color: '#A8B3CF',
  fontSize: 13,
  marginTop: 5,
},

arrow: {
  color: '#64748B',
  fontSize: 28,
  marginLeft: 8,
},
});
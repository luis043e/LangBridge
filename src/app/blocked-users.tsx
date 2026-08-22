import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    arrayRemove,
    doc,
    getDoc,
    updateDoc,
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

type BlockedUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
};

export default function BlockedUsersScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [blockedUsers, setBlockedUsers] =
    useState<BlockedUser[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadBlockedUsers = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const currentUserReference = doc(
        db,
        'users',
        currentUser.uid
      );

      const currentUserSnapshot = await getDoc(
        currentUserReference
      );

      if (!currentUserSnapshot.exists()) {
        setBlockedUsers([]);
        return;
      }

      const currentUserData =
        currentUserSnapshot.data();

      const blockedUserIds: string[] =
        Array.isArray(currentUserData.blockedUserIds)
          ? currentUserData.blockedUserIds
          : [];

      const loadedUsers = await Promise.all(
        blockedUserIds.map(async (blockedUserId) => {
          const blockedUserReference = doc(
            db,
            'users',
            blockedUserId
          );

          const blockedUserSnapshot = await getDoc(
            blockedUserReference
          );

          if (!blockedUserSnapshot.exists()) {
            return null;
          }

          const userData = blockedUserSnapshot.data();

          const displayName =
            userData.fullName?.trim() ||
            userData.email?.split('@')[0] ||
            (language === 'es'
              ? 'Usuario de LangBridge'
              : 'LangBridge user');

          const initials = displayName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) =>
              part.charAt(0).toUpperCase()
            )
            .join('');

          return {
            id: blockedUserSnapshot.id,
            name: displayName,
            initials: initials || 'LB',
            email: userData.email || '',
          };
        })
      );

      setBlockedUsers(
        loadedUsers.filter(
          (user): user is BlockedUser =>
            user !== null
        )
      );
    } catch (error) {
      console.error(
        'Error loading blocked users:',
        error
      );

      Alert.alert(
        language === 'es'
          ? 'No se pudieron cargar'
          : 'Could not load',
        language === 'es'
          ? 'Revisa tu conexión e inténtalo nuevamente.'
          : 'Check your connection and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const handleUnblock = (blockedUser: BlockedUser) => {
    Alert.alert(
      language === 'es'
        ? 'Desbloquear usuario'
        : 'Unblock user',
      language === 'es'
        ? `¿Quieres desbloquear a ${blockedUser.name}?`
        : `Do you want to unblock ${blockedUser.name}?`,
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
              ? 'Desbloquear'
              : 'Unblock',
          onPress: async () => {
            const currentUser = auth.currentUser;

            if (!currentUser) {
              return;
            }

            try {
              const currentUserReference = doc(
                db,
                'users',
                currentUser.uid
              );

              await updateDoc(currentUserReference, {
                blockedUserIds: arrayRemove(
                  blockedUser.id
                ),
              });

              setBlockedUsers((currentUsers) =>
                currentUsers.filter(
                  (user) =>
                    user.id !== blockedUser.id
                )
              );

              Alert.alert(
                language === 'es'
                  ? 'Usuario desbloqueado'
                  : 'User unblocked',
                language === 'es'
                  ? `${blockedUser.name} fue desbloqueado.`
                  : `${blockedUser.name} was unblocked.`
              );
            } catch (error) {
              console.error(
                'Error unblocking user:',
                error
              );

              Alert.alert(
                language === 'es'
                  ? 'No se pudo desbloquear'
                  : 'Could not unblock',
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
              {language === 'es'
                ? '‹ Atrás'
                : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {language === 'es'
              ? 'Usuarios bloqueados'
              : 'Blocked users'}
          </Text>

          <Text style={styles.subtitle}>
            {language === 'es'
              ? 'Administra las cuentas que bloqueaste en LangBridge.'
              : 'Manage the accounts you blocked on LangBridge.'}
          </Text>

          {isLoading ? (
            <View style={styles.emptyCard}>
              <ActivityIndicator
                size="large"
                color="#22D3EE"
              />

              <Text style={styles.emptyText}>
                {language === 'es'
                  ? 'Cargando usuarios bloqueados...'
                  : 'Loading blocked users...'}
              </Text>
            </View>
          ) : blockedUsers.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>🛡️</Text>

              <Text style={styles.emptyTitle}>
                {language === 'es'
                  ? 'No tienes usuarios bloqueados'
                  : 'You have no blocked users'}
              </Text>

              <Text style={styles.emptyText}>
                {language === 'es'
                  ? 'Las cuentas que bloquees aparecerán aquí.'
                  : 'Accounts you block will appear here.'}
              </Text>
            </View>
          ) : (
            blockedUsers.map((blockedUser) => (
              <View
                key={blockedUser.id}
                style={styles.userCard}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {blockedUser.initials}
                  </Text>
                </View>

                <View style={styles.userInformation}>
                  <Text style={styles.userName}>
                    {blockedUser.name}
                  </Text>

                  {!!blockedUser.email && (
                    <Text style={styles.userEmail}>
                      {blockedUser.email}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.unblockButton}
                  onPress={() =>
                    handleUnblock(blockedUser)
                  }
                  activeOpacity={0.85}
                >
                  <Text style={styles.unblockButtonText}>
                    {language === 'es'
                      ? 'Desbloquear'
                      : 'Unblock'}
                  </Text>
                </TouchableOpacity>
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
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 16,
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
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 24,
  },

  emptyCard: {
    minHeight: 230,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 22,
    padding: 24,
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 9,
  },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30245C',
    borderWidth: 1,
    borderColor: '#A78BFA',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  userInformation: {
    flex: 1,
    paddingRight: 10,
  },

  userName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  userEmail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },

  unblockButton: {
    backgroundColor: '#17385C',
    borderWidth: 1,
    borderColor: '#22D3EE',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  unblockButtonText: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
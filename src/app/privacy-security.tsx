import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';
import { type AppLanguage } from '../translations';

export default function PrivacySecurityScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [isProfileVisible, setIsProfileVisible] =
    useState(true);
  useEffect(() => {
  let isMounted = true;

  const loadPrivacySettings = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      return;
    }

    try {
      const userReference = doc(
        db,
        'users',
        currentUser.uid
      );

      const userSnapshot = await getDoc(userReference);

      if (!isMounted || !userSnapshot.exists()) {
        return;
      }

      const userData = userSnapshot.data();

      if (typeof userData.isProfileVisible === 'boolean') {
        setIsProfileVisible(userData.isProfileVisible);
      }
    } catch (error) {
      console.error(
        'Error loading privacy settings:',
        error
      );
    }
  };

  loadPrivacySettings();

  return () => {
    isMounted = false;
  };
}, []);
const handleChangePassword = async () => {
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email;

  if (!userEmail) {
    Alert.alert(
      language === 'es'
        ? 'Correo no disponible'
        : 'Email unavailable',
      language === 'es'
        ? 'No encontramos un correo asociado a esta cuenta.'
        : 'No email address was found for this account.'
    );
    return;
  }

  Alert.alert(
    language === 'es'
      ? 'Cambiar contraseña'
      : 'Change password',
    language === 'es'
      ? `Enviaremos un enlace de cambio de contraseña a ${userEmail}.`
      : `We will send a password change link to ${userEmail}.`,
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
            ? 'Enviar correo'
            : 'Send email',
        onPress: async () => {
          try {
            await sendPasswordResetEmail(
              auth,
              userEmail
            );

            Alert.alert(
              language === 'es'
                ? 'Correo enviado'
                : 'Email sent',
              language === 'es'
                ? 'Revisa tu bandeja de entrada y la carpeta de correo no deseado.'
                : 'Check your inbox and spam folder.'
            );
          } catch (error) {
            console.error(
              'Error sending password reset email:',
              error
            );

            Alert.alert(
              language === 'es'
                ? 'No se pudo enviar'
                : 'Could not send',
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
  const showComingSoon = () => {
    Alert.alert(
      language === 'es'
        ? 'Función en desarrollo'
        : 'Feature in development',
      language === 'es'
        ? 'Esta opción estará disponible próximamente.'
        : 'This option will be available soon.'
    );
  };

  const handleVisibilityChange = async (
  newValue: boolean
) => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    Alert.alert(
      language === 'es'
        ? 'Sesión no disponible'
        : 'Session unavailable',
      language === 'es'
        ? 'Inicia sesión nuevamente para cambiar esta opción.'
        : 'Please log in again to change this option.'
    );
    return;
  }

  const previousValue = isProfileVisible;

  setIsProfileVisible(newValue);

  try {
    const userReference = doc(
      db,
      'users',
      currentUser.uid
    );

    await setDoc(
      userReference,
      {
        isProfileVisible: newValue,
      },
      {
        merge: true,
      }
    );

    Alert.alert(
      language === 'es'
        ? 'Visibilidad actualizada'
        : 'Visibility updated',
      newValue
        ? language === 'es'
          ? 'Otras personas podrán encontrar tu perfil.'
          : 'Other people will be able to find your profile.'
        : language === 'es'
          ? 'Tu perfil dejará de aparecer en las búsquedas.'
          : 'Your profile will no longer appear in searches.'
    );
  } catch (error) {
    console.error(
      'Error saving privacy settings:',
      error
    );

    setIsProfileVisible(previousValue);

    Alert.alert(
      language === 'es'
        ? 'No se pudo guardar'
        : 'Could not save',
      language === 'es'
        ? 'Revisa tu conexión e inténtalo nuevamente.'
        : 'Check your connection and try again.'
    );
  }
};
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
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
              {language === 'es'
                ? '‹ Atrás'
                : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>
                🔒
              </Text>
            </View>

            <View style={styles.headerInformation}>
              <Text style={styles.title}>
                {language === 'es'
                  ? 'Privacidad y seguridad'
                  : 'Privacy and security'}
              </Text>

              <Text style={styles.subtitle}>
                {language === 'es'
                  ? 'Administra la seguridad y privacidad de tu cuenta.'
                  : 'Manage your account security and privacy.'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {language === 'es'
              ? 'Seguridad de la cuenta'
              : 'Account security'}
          </Text>

          <View style={styles.card}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleChangePassword}
              activeOpacity={0.85}
            >
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>
                  🔑
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.settingTitle}>
                  {language === 'es'
                    ? 'Cambiar contraseña'
                    : 'Change password'}
                </Text>

                <Text style={styles.settingDescription}>
                  {language === 'es'
                    ? 'Actualiza la contraseña de acceso.'
                    : 'Update your account password.'}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={() =>
  router.push({
    pathname: '/blocked-users',
    params: {
      lang: language,
    },
  })
}
              activeOpacity={0.85}
            >
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>
                  🚫
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.settingTitle}>
                  {language === 'es'
                    ? 'Usuarios bloqueados'
                    : 'Blocked users'}
                </Text>

                <Text style={styles.settingDescription}>
                  {language === 'es'
                    ? 'Administra las cuentas que bloqueaste.'
                    : 'Manage the accounts you blocked.'}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>
            {language === 'es'
              ? 'Privacidad del perfil'
              : 'Profile privacy'}
          </Text>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>
                  👁️
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.settingTitle}>
                  {language === 'es'
                    ? 'Perfil visible'
                    : 'Visible profile'}
                </Text>

                <Text style={styles.settingDescription}>
                  {language === 'es'
                    ? 'Permite que otras personas encuentren tu perfil.'
                    : 'Allow other people to find your profile.'}
                </Text>
              </View>

              <Switch
                value={isProfileVisible}
                onValueChange={handleVisibilityChange}
                trackColor={{
                  false: '#334155',
                  true: '#164E63',
                }}
                thumbColor={
                  isProfileVisible
                    ? '#22D3EE'
                    : '#94A3B8'
                }
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            {language === 'es'
              ? 'Ayuda y control'
              : 'Help and control'}
          </Text>

          <View style={styles.card}>
            <TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/report-problem',
      params: {
        lang: language,
      },
    })
  }
  activeOpacity={0.85}
>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>
                  ⚠️
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.settingTitle}>
                  {language === 'es'
                    ? 'Reportar un problema'
                    : 'Report a problem'}
                </Text>

                <Text style={styles.settingDescription}>
                  {language === 'es'
                    ? 'Reporta comportamientos inapropiados o fallos.'
                    : 'Report inappropriate behavior or application issues.'}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dangerCard}>
            <TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/delete-account',
      params: {
        lang: language,
      },
    })
  }
  activeOpacity={0.85}
>
              <View style={styles.dangerIcon}>
                <Text style={styles.settingIconText}>
                  🗑️
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.dangerTitle}>
                  {language === 'es'
                    ? 'Eliminar cuenta'
                    : 'Delete account'}
                </Text>

                <Text style={styles.settingDescription}>
                  {language === 'es'
                    ? 'Elimina permanentemente tu cuenta y tus datos.'
                    : 'Permanently delete your account and data.'}
                </Text>
              </View>

              <Text style={styles.dangerArrow}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30245C',
    borderWidth: 1.5,
    borderColor: '#A78BFA',
    marginRight: 15,
  },

  headerIconText: {
    fontSize: 28,
  },

  headerInformation: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 33,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  sectionTitle: {
  color: '#FFFFFF',
  fontSize: 17,
  fontWeight: 'bold',
  marginTop: 6,
  marginBottom: 12,
},

card: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  paddingHorizontal: 16,
  marginBottom: 24,
},

dangerCard: {
  backgroundColor: '#321B2B',
  borderWidth: 1.5,
  borderColor: '#7F1D3D',
  borderRadius: 20,
  paddingHorizontal: 16,
  marginTop: 2,
  marginBottom: 18,
},

settingRow: {
  minHeight: 82,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: 14,
},

settingIcon: {
  width: 46,
  height: 46,
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#19284A',
  borderWidth: 1,
  borderColor: '#334C7D',
  marginRight: 13,
},

dangerIcon: {
  width: 46,
  height: 46,
  borderRadius: 15,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#4A1D32',
  borderWidth: 1,
  borderColor: '#9F284F',
  marginRight: 13,
},

settingIconText: {
  fontSize: 21,
},

settingInformation: {
  flex: 1,
  paddingRight: 10,
},

settingTitle: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 'bold',
},

dangerTitle: {
  color: '#FDA4AF',
  fontSize: 15,
  fontWeight: 'bold',
},

settingDescription: {
  color: '#94A3B8',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 5,
},

divider: {
  height: 1,
  backgroundColor: '#26395F',
},

arrow: {
  color: '#64748B',
  fontSize: 26,
  marginLeft: 6,
},

dangerArrow: {
  color: '#FB7185',
  fontSize: 26,
  marginLeft: 6,
},
});
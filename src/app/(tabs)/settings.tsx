import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import { useCallback, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../contexts/language-context';
import { auth } from '../../firebaseConfig';
import { translations } from '../../translations';
export default function SettingsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const { language } = useLanguage();
  const text = translations[language];

  const currentUser = auth.currentUser;

const getCurrentDisplayName = () =>
  auth.currentUser?.displayName?.trim() ||
  auth.currentUser?.email?.split('@')[0] ||
  text.settingsScreen.defaultUserName

const [displayName, setDisplayName] =
  useState(getCurrentDisplayName);

const [photoURL, setPhotoURL] = useState(
  auth.currentUser?.photoURL || ''
);

useFocusEffect(
  useCallback(() => {
    setDisplayName(getCurrentDisplayName());

    setPhotoURL(
      auth.currentUser?.photoURL || ''
    );
  }, [language])
);

  const email =
    currentUser?.email ||
    text.settingsScreen.emailUnavailable

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');

  const handleSignOut = () => {
    Alert.alert(
  text.settingsScreen.signOutTitle,
  text.settingsScreen.signOutConfirmation,
      [
        {
  text: text.settingsScreen.cancel,
  style: 'cancel',
},
        {
  text: text.settingsScreen.signOut,
  style: 'destructive',
  onPress: async () => {
            try {
              await signOut(auth);

              router.replace({
                pathname: '/welcome',
                params: { lang: language },
              });
            } catch (error) {
              console.error(
                'Error signing out:',
                error
              );

              Alert.alert(
  text.settingsScreen.signOutErrorTitle,
  text.settingsScreen.tryAgain
);
            }
          },
        },
      ]
    );
  };

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
              {text.settingsScreen.back}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {text.settingsScreen.title}
          </Text>

          <Text style={styles.subtitle}>
            {text.settingsScreen.subtitle}
          </Text>
          <View style={styles.profileCard}>
          <View style={styles.avatar}>
  {photoURL ? (
    <Image
      source={{ uri: photoURL }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Text style={styles.avatarText}>
      {initials || 'LB'}
    </Text>
  )}
</View>
            <Text style={styles.name}>
              {displayName}
            </Text>

            <Text style={styles.email}>
              {email}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {text.settingsScreen.accountSection}
          </Text>

          <View style={styles.settingsCard}>
            <TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/edit-profile',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
              <View style={styles.settingIcon}>
                <Text style={styles.settingIconText}>
                  👤
                </Text>
              </View>

              <View style={styles.settingInformation}>
                <Text style={styles.settingTitle}>
                  {text.settingsScreen.editProfile}
                </Text>

                <Text style={styles.settingDescription}>
                  {text.settingsScreen.editProfileDescription}
                </Text>
              </View>
              
            </TouchableOpacity>

            <View style={styles.divider} />

<TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/partner-profile',
      params: {
        lang: language,
        preview: 'true',
      },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.settingIcon}>
    <Text style={styles.settingIconText}>
      👁️
    </Text>
  </View>

  <View style={styles.settingInformation}>
    <Text style={styles.settingTitle}>
      {text.settingsScreen.viewPublicProfile}
    </Text>

    <Text style={styles.settingDescription}>
      {text.settingsScreen.viewPublicProfileDescription}
    </Text>
  </View>

  <Text style={styles.settingArrow}>
    ›
  </Text>
</TouchableOpacity>

<View style={styles.divider} />

<TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/home',
      params: {
        lang: language,
        openLanguageSelector: 'true',
      },
    })
  }
  activeOpacity={0.85}
  accessibilityRole="button"
  accessibilityLabel={
  text.settingsScreen.changeInterfaceLanguage
}
>
  <View style={styles.settingIcon}>
    <Text style={styles.settingIconText}>
      🌐
    </Text>
  </View>

  <View style={styles.settingInformation}>
    <Text style={styles.settingTitle}>
      {text.settingsScreen.interfaceLanguage}
    </Text>

    <Text style={styles.settingDescription}>
      {text.settingsScreen.interfaceLanguageDescription}
    </Text>
  </View>

  <Text style={styles.settingArrow}>
    ›
  </Text>
</TouchableOpacity>

<View style={styles.divider} />

<TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/language-settings',
      params: {
        lang: language,
      },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.settingIcon}>
    <Text style={styles.settingIconText}>
      🌍
    </Text>
  </View>

  <View style={styles.settingInformation}>
    <Text style={styles.settingTitle}>
      {text.settingsScreen.languagesAndLevel}
    </Text>

    <Text style={styles.settingDescription}>
      {text.settingsScreen.languagesAndLevelDescription}
    </Text>
  </View>

  <Text style={styles.settingArrow}>
    ›
  </Text>
</TouchableOpacity>

<View style={styles.divider} />

            <TouchableOpacity
  style={styles.settingRow}
  onPress={() =>
    router.push({
      pathname: '/privacy-security',
      params: {
        lang: language,
      },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.settingIcon}>
    <Text style={styles.settingIconText}>
      🔒
    </Text>
  </View>

  <View style={styles.settingInformation}>
    <Text style={styles.settingTitle}>
      {text.settingsScreen.privacyAndSecurity}
    </Text>

    <Text style={styles.settingDescription}>
      {text.settingsScreen.privacyAndSecurityDescription}
    </Text>
  </View>

  <Text style={styles.settingArrow}>
    ›
  </Text>
</TouchableOpacity>
</View>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <Text style={styles.signOutButtonText}>
              {text.settingsScreen.signOut}
            </Text>
          </TouchableOpacity>

          <Text style={styles.versionText}>
            LangBridge 1.0.0
          </Text>
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
    paddingBottom: 38,
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

  profileCard: {
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 26,
  },

  avatar: {
    width: 82,
    height: 82,
    borderRadius: 27,
    backgroundColor: '#19284A',
    borderWidth: 2,
    borderColor: '#22D3EE',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22D3EE',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
    overflow: 'hidden',
  },
avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 999,
},
  avatarText: {
    color: '#22D3EE',
    fontSize: 27,
    fontWeight: 'bold',
  },

  name: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 17,
  },

  email: {
    color: '#A8B3CF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
  },

  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 13,
  },

  settingsCard: {
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 22,
    paddingHorizontal: 18,
  },

  settingRow: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  settingIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: '#19284A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  settingIconText: {
    fontSize: 21,
  },

  settingInformation: {
    flex: 1,
    minWidth: 0,
  },

  settingTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },

  settingDescription: {
    color: '#A8B3CF',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
settingArrow: {
  color: '#64748B',
  fontSize: 26,
  marginLeft: 8,
},

  comingSoon: {
    color: '#C4B5FD',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginLeft: 8,
  },

  divider: {
    height: 1,
    backgroundColor: '#263556',
  },

  signOutButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: '#2A1520',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 26,
  },

  signOutButtonText: {
    color: '#FCA5A5',
    fontSize: 16,
    fontWeight: 'bold',
  },

  versionText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 22,
  },
});
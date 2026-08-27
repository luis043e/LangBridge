import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useLanguage } from '../../contexts/language-context';
import { auth, db } from '../../firebaseConfig';
import {
  isActiveLanguage,
  languageCatalog,
} from '../../language-catalog';
import {
  translations,
  type AppLanguage,
} from '../../translations';

export default function HomeScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
    openLanguageSelector?: string;
  }>();

  const {
    language,
    changeLanguage,
  } = useLanguage();

  const text = translations[language];

    const [profileProgress, setProfileProgress] =
  useState(0);

  const [userName, setUserName] = useState('');
const [userPhotoURL, setUserPhotoURL] =
  useState('');

  const [isLanguageListOpen, setIsLanguageListOpen] =
  useState(false);

const [isSavingLanguage, setIsSavingLanguage] =
  useState(false);

  useEffect(() => {
  if (params.openLanguageSelector === 'true') {
    setIsLanguageListOpen(true);

    router.setParams({
      openLanguageSelector: undefined,
    });
  }
}, [params.openLanguageSelector, router]);

  const toggleLanguageList = () => {
  if (isSavingLanguage) {
    return;
  }

  setIsLanguageListOpen(
    (currentValue) => !currentValue
  );
};

const handleLanguageChange = async (
  newLanguage: AppLanguage
) => {
  if (
    isSavingLanguage ||
    newLanguage === language
  ) {
    setIsLanguageListOpen(false);
    return;
  }

  try {
    setIsSavingLanguage(true);

    await changeLanguage(newLanguage);

    setIsLanguageListOpen(false);
  } catch (error) {
    console.error(
      'Error changing global interface language:',
      error
    );
  } finally {
    setIsSavingLanguage(false);
  }
};

  useEffect(() => {
  const loadProfileProgress = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setProfileProgress(0);
      return;
    }

    try {
      const userReference = doc(
        db,
        'users',
        currentUser.uid
      );

      const userSnapshot = await getDoc(userReference);

      if (!userSnapshot.exists()) {
        setProfileProgress(0);
        return;
      }

      const userData = userSnapshot.data();      
      const profileFields = [
        userData.fullName,
        userData.city,
        userData.bio,
        userData.nativeLanguage,
        userData.learningLanguage,
        userData.level,
      ];

      const completedFields = profileFields.filter(
        (field) =>
          typeof field === 'string' &&
          field.trim().length > 0
      ).length;

      const calculatedProgress = Math.round(
        (completedFields / profileFields.length) * 100
      );

      setProfileProgress(calculatedProgress);
    } catch (error) {
      console.error(
        'Error loading profile progress:',
        error
      );

      setProfileProgress(0);
    }
  };

  loadProfileProgress();
}, []); 
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
  {text.homeScreen.welcome}
</Text>

<Text style={styles.subtitle}>
  {text.homeScreen.subtitle}
</Text>
          </View>

          <View style={styles.avatar}>
  <Image
    source={require('../../../assets/images/langbridge-logo.png')}
    style={styles.avatarImage}
    resizeMode="contain"
  />
</View>
                </View>

               <View style={styles.languageSelectorContainer}>
          <TouchableOpacity
            style={[
              styles.languageButton,
              isLanguageListOpen &&
                styles.openLanguageButton,
            ]}
            onPress={toggleLanguageList}
            activeOpacity={0.8}
            disabled={isSavingLanguage}
            accessibilityRole="button"
            accessibilityLabel={
              language === 'es'
                ? 'Cambiar idioma de la interfaz'
                : 'Change interface language'
            }
            accessibilityState={{
              expanded: isLanguageListOpen,
              disabled: isSavingLanguage,
            }}
          >
            <Text style={styles.languageButtonText}>
              {language === 'es'
                ? `🌐 Español ${
                    isLanguageListOpen ? '▲' : '▼'
                  }`
                : `🌐 English ${
                    isLanguageListOpen ? '▲' : '▼'
                  }`}
            </Text>
          </TouchableOpacity>

          {isLanguageListOpen && (
            <View style={styles.languageDropdown}>
              <ScrollView
                style={styles.languageDropdownScroll}
                contentContainerStyle={
                  styles.languageDropdownContent
                }
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {languageCatalog.map((option) => {
                  const isAvailable =
                    isActiveLanguage(option.code);

                  const isSelected =
                    language === option.code;

                  return (
                    <TouchableOpacity
                      key={option.code}
                      style={[
                        styles.languageOption,
                        isSelected &&
                          styles.selectedLanguageOption,
                        !isAvailable &&
                          styles.unavailableLanguageOption,
                      ]}
                      onPress={() => {
                        if (
                          isActiveLanguage(option.code)
                        ) {
                          handleLanguageChange(
                            option.code
                          );
                        }
                      }}
                      activeOpacity={
                        isAvailable ? 0.8 : 1
                      }
                      disabled={
                        !isAvailable ||
                        isSavingLanguage
                      }
                      accessibilityRole="button"
                      accessibilityLabel={
                        option.nativeName
                      }
                      accessibilityState={{
                        selected: isSelected,
                        disabled:
                          !isAvailable ||
                          isSavingLanguage,
                      }}
                    >
                      <View
                        style={
                          styles.languageOptionInformation
                        }
                      >
                        <Text
                          style={
                            styles.languageOptionText
                          }
                          numberOfLines={1}
                        >
                          {option.flag}{' '}
                          {option.nativeName}
                        </Text>

                        <Text
                          style={
                            styles.languageOptionDescription
                          }
                          numberOfLines={2}
                        >
                          {language === 'es'
                            ? option.descriptionEs
                            : option.descriptionEn}
                        </Text>
                      </View>

                      {isSelected ? (
                        <Text
                          style={styles.languageCheck}
                        >
                          ✓
                        </Text>
                      ) : !isAvailable ? (
                        <View
                          style={
                            styles.comingSoonBadge
                          }
                        >
                          <Text
                            style={
                              styles.comingSoonText
                            }
                          >
                            {language === 'es'
                              ? 'PRONTO'
                              : 'SOON'}
                          </Text>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardLabel}>
  {text.homeScreen.weeklyGoal}
</Text>
        <Text style={styles.progressTitle}>
  {text.homeScreen.startPracticing}
</Text>

          <Text style={styles.progressDescription}>
  {text.homeScreen.profileDescription}
</Text>
          <View style={styles.progressBar}>
  <View
    style={[
      styles.progressValue,
      {
        width: `${Math.min(
          Math.max(profileProgress, 0),
          100
        )}%`,
      },
    ]}
  />
</View>

<Text style={styles.progressText}>
  {text.homeScreen.profileProgress}: {profileProgress}%
</Text>
        </View>

       <Text style={styles.sectionTitle}>
  {text.homeScreen.quickActions}
</Text>
<TouchableOpacity
  style={[styles.actionCard, styles.learnCard]}
  onPress={() =>
  router.push({
    pathname: '/learn',
    params: { lang: language },
  })
}
  activeOpacity={0.85}
>
  <View style={[styles.actionIcon, styles.learnIcon]}>
    <Text style={styles.actionIconText}>📚</Text>
  </View>

  <View style={styles.actionContent}>
    <View style={styles.learnTitleRow}>
      <Text style={styles.actionTitle}>
        {language === 'es' ? 'Aprender' : 'Learn'}
      </Text>

      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>
          {language === 'es' ? 'NUEVO' : 'NEW'}
        </Text>
      </View>
    </View>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Lecciones, niveles, puntos y práctica diaria.'
        : 'Lessons, levels, points, and daily practice.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>
        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/language-profile',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
<View style={[styles.actionIcon, styles.profileIcon]}>
  <Text style={styles.actionIconText}>🌍</Text>
</View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
  {text.homeScreen.completeProfile}
  </Text>
            <Text style={styles.actionDescription}>
  {text.homeScreen.completeProfileDescription}
</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/explore',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
<View style={[styles.actionIcon, styles.exploreIcon]}>
  <Text style={styles.actionIconText}>🔎</Text>
</View>

    <View style={styles.actionContent}>
  <Text style={styles.actionTitle}>
    {text.homeScreen.findPartners}
  </Text>

  <Text style={styles.actionDescription}>
  {text.homeScreen.findPartnersDescription}
</Text>
</View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
<TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/requests',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.actionIcon}>
    <Text style={styles.actionIconText}>🔔</Text>
  </View>

  <View style={styles.actionContent}>
    <Text style={styles.actionTitle}>
      {language === 'es'
        ? 'Solicitudes'
        : 'Requests'}
    </Text>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Revisa y responde tus solicitudes de conexión.'
        : 'Review and respond to your connection requests.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

  <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/connections',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.actionIcon}>
    <Text style={styles.actionIconText}>🤝</Text>
  </View>

  <View style={styles.actionContent}>
    <Text style={styles.actionTitle}>
      {language === 'es'
        ? 'Mis conexiones'
        : 'My connections'}
    </Text>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Consulta las personas con quienes ya puedes practicar.'
        : 'View the people you can already practice with.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/conversations',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
<View style={[styles.actionIcon, styles.conversationsIcon]}>
  <Text style={styles.actionIconText}>💬</Text>
</View>
          <View style={styles.actionContent}>
  <Text style={styles.actionTitle}>
    {text.homeScreen.conversations}
  </Text>

  <Text style={styles.actionDescription}>
    {text.homeScreen.conversationsDescription}
  </Text>
</View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/settings',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.actionIcon}>
    <Text style={styles.actionIconText}>⚙️</Text>
  </View>

  <View style={styles.actionContent}>
    <Text style={styles.actionTitle}>
      {language === 'es'
        ? 'Perfil y configuración'
        : 'Profile and settings'}
    </Text>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Administra tu cuenta, preferencias y sesión.'
        : 'Manage your account, preferences, and session.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>
  {text.homeScreen.tipLabel}
</Text>
          <Text style={styles.tipText}>
  {text.homeScreen.tipText}
</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#050B24',
},
languageSelectorContainer: {
  width: '100%',
  alignItems: 'flex-end',
  marginBottom: 22,
  zIndex: 20,
},

languageButton: {
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 16,
  paddingHorizontal: 16,
  paddingVertical: 10,
},

openLanguageButton: {
  backgroundColor: '#141F42',
  borderColor: '#22D3EE',
},

languageButtonText: {
  color: '#D7E0F5',
  fontSize: 15,
  fontWeight: 'bold',
},

languageDropdown: {
  width: '100%',
  maxHeight: 340,
  backgroundColor: '#0B1430',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 18,
  padding: 8,
  marginTop: 10,
  overflow: 'hidden',
  elevation: 12,
  shadowColor: '#000000',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.3,
  shadowRadius: 12,
},

languageDropdownScroll: {
  width: '100%',
},

languageDropdownContent: {
  paddingBottom: 2,
},

languageOption: {
  width: '100%',
  minHeight: 62,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#111C3A',
  borderWidth: 1,
  borderColor: '#1F3158',
  borderRadius: 13,
  paddingHorizontal: 12,
  paddingVertical: 9,
  marginBottom: 6,
},

selectedLanguageOption: {
  backgroundColor: '#25356B',
  borderColor: '#22D3EE',
},

unavailableLanguageOption: {
  backgroundColor: '#0D1630',
  borderColor: '#1C2A4D',
  opacity: 0.72,
},

languageOptionInformation: {
  flex: 1,
  minWidth: 0,
  justifyContent: 'center',
  paddingRight: 8,
},

languageOptionText: {
  color: '#D7E0F5',
  fontSize: 15,
  lineHeight: 20,
  fontWeight: '700',
},

languageOptionDescription: {
  color: '#8492B0',
  fontSize: 11,
  lineHeight: 15,
  marginTop: 3,
},

languageCheck: {
  color: '#22D3EE',
  fontSize: 18,
  fontWeight: 'bold',
  marginLeft: 10,
},

comingSoonBadge: {
  minWidth: 48,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#30245C',
  borderWidth: 1,
  borderColor: '#A78BFA',
  borderRadius: 9,
  paddingHorizontal: 7,
  paddingVertical: 5,
  marginLeft: 8,
},

comingSoonText: {
  color: '#DDD6FE',
  fontSize: 8,
  fontWeight: 'bold',
  letterSpacing: 0.4,
},
  content: {
  width: '100%',
  maxWidth: 520,
  alignSelf: 'center',
  paddingHorizontal: 22,
  paddingTop: 58,
  paddingBottom: 40,
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerText: {
  flex: 1,
  minWidth: 0,
  paddingRight: 14,
},
  greeting: {
  color: '#FFFFFF',
  fontSize: 24,
  lineHeight: 31,
  fontWeight: 'bold',
  letterSpacing: -0.3,
  flexShrink: 1,
},
  subtitle: {
  color: '#A8B3CF',
  fontSize: 14,
  lineHeight: 21,
  marginTop: 6,
  flexShrink: 1,
},
 avatar: {
  width: 76,
  height: 76,
  borderRadius: 24,
  backgroundColor: '#0B1430',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  padding: 5,
  overflow: 'hidden',
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 7,
},

avatarImage: {
  width: '100%',
  height: '100%',
  borderRadius: 20,
},
  avatarText: {
  color: '#22D3EE',
  fontSize: 17,
  fontWeight: 'bold',
  letterSpacing: 0.5,
},
  progressCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 24,
  padding: 22,
  marginBottom: 32,
  shadowColor: '#4F46E5',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.22,
  shadowRadius: 16,
  elevation: 7,
},
  cardLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  progressBar: {
  width: '100%',
  height: 8,
  backgroundColor: '#334155',
  borderRadius: 8,
  marginTop: 22,
  overflow: 'hidden',
},
  progressValue: {
  height: '100%',
  backgroundColor: '#22D3EE',
  borderRadius: 8,
},
  progressText: {
  color: '#A8B3CF',
  fontSize: 12,
  fontWeight: '600',
  marginTop: 10,
},
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  learnCard: {
  borderColor: '#4F46E5',
  backgroundColor: '#141A3D',
  shadowColor: '#4F46E5',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 6,
},

learnIcon: {
  backgroundColor: '#252052',
  borderWidth: 1,
  borderColor: '#8B5CF6',
},
profileIcon: {
  backgroundColor: '#123B5D',
  borderWidth: 1,
  borderColor: '#22D3EE',
},
exploreIcon: {
  backgroundColor: '#30245C',
  borderWidth: 1,
  borderColor: '#A78BFA',
},
conversationsIcon: {
  backgroundColor: '#123F3A',
  borderWidth: 1,
  borderColor: '#34D399',
},
learnTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
},

newBadge: {
  backgroundColor: '#22D3EE',
  borderRadius: 9,
  paddingHorizontal: 8,
  paddingVertical: 3,
  marginLeft: 8,
},

newBadgeText: {
  color: '#050B24',
  fontSize: 9,
  fontWeight: 'bold',
  letterSpacing: 0.6,
},
  actionCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  padding: 16,
  marginBottom: 14,
},
  actionIcon: {
  width: 50,
  height: 50,
  borderRadius: 16,
  backgroundColor: '#19284A',
  borderWidth: 1,
  borderColor: '#334C7D',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
},
  actionIconText: {
    fontSize: 23,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  arrow: {
    color: '#64748B',
    fontSize: 28,
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
  },
  tipLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tipText: {
    color: '#D1FAE5',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});
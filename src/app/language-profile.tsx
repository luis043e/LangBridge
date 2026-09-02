import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';
import {
  translations,
  type AppLanguage,
} from '../translations';

type LanguageOption = {
  code: string;
  es: string;
  en: string;
};

type LevelId =
  | 'a1'
  | 'a2'
  | 'b1'
  | 'b2'
  | 'c1'
  | 'c2';

type LevelOption = {
  id: LevelId;
  code: string;
  es: string;
  en: string;
};

const languageOptions: LanguageOption[] = [
  {
    code: 'es',
    es: 'Español',
    en: 'Spanish',
  },
  {
    code: 'en',
    es: 'Inglés',
    en: 'English',
  },
  {
    code: 'fr',
    es: 'Francés',
    en: 'French',
  },
  {
    code: 'pt',
    es: 'Portugués',
    en: 'Portuguese',
  },
  {
    code: 'de',
    es: 'Alemán',
    en: 'German',
  },
  {
    code: 'it',
    es: 'Italiano',
    en: 'Italian',
  },
];

const levelOptions: LevelOption[] = [
  {
    id: 'a1',
    code: 'A1',
    es: 'A1 · Principiante',
    en: 'A1 · Beginner',
  },
  {
    id: 'a2',
    code: 'A2',
    es: 'A2 · Básico',
    en: 'A2 · Elementary',
  },
  {
    id: 'b1',
    code: 'B1',
    es: 'B1 · Intermedio',
    en: 'B1 · Intermediate',
  },
  {
    id: 'b2',
    code: 'B2',
    es: 'B2 · Intermedio alto',
    en: 'B2 · Upper intermediate',
  },
  {
    id: 'c1',
    code: 'C1',
    es: 'C1 · Avanzado',
    en: 'C1 · Advanced',
  },
  {
    id: 'c2',
    code: 'C2',
    es: 'C2 · Dominio',
    en: 'C2 · Proficiency',
  },
];

export default function LanguageProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage =
  params.lang === 'es' ? 'es' : 'en';

const text = translations[language];

const [nativeLanguage, setNativeLanguage] =
  useState<LanguageOption | null>(null);
const [isNativeLanguageOpen, setIsNativeLanguageOpen] =
  useState(false);
  const [learningLanguage, setLearningLanguage] =
    useState<LanguageOption | null>(null);
  
    const [isLearningLanguageOpen, setIsLearningLanguageOpen] =
  useState(false);

  const [selectedLevel, setSelectedLevel] =
    useState<LevelOption['id'] | null>(null);

  const [isLevelOpen, setIsLevelOpen] =
  useState(false);

    const [isSaving, setIsSaving] = useState(false);
  
  const [isLoadingProfile, setIsLoadingProfile] =
  useState(true);
  
  const [hasLoadingError, setHasLoadingError] =
  useState(false);

  const [loadingAttempt, setLoadingAttempt] =
  useState(0);

  const [existingUserData, setExistingUserData] =
  useState<Record<string, unknown> | null>(null);
  
  const isEditingProfile =
  existingUserData?.profileCompleted === true;

   useEffect(() => {
  let isActive = true;

  const loadLanguageProfile = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      if (isActive) {
        setIsLoadingProfile(false);
      }

      return;
    }

    try {
      const userSnapshot = await getDoc(
        doc(db, 'users', currentUser.uid)
      );

      if (!userSnapshot.exists() || !isActive) {
        return;
      }

      const userData = userSnapshot.data();

setExistingUserData(userData);

const savedNativeLanguage = languageOptions.find(
        (option) =>
          option.code === userData.nativeLanguage
      );

      const savedLearningLanguage = languageOptions.find(
        (option) =>
          option.code === userData.learningLanguage
      );

      const legacyLevelMap: Record<string, LevelId> = {
  beginner: 'a1',
  intermediate: 'b1',
  advanced: 'c1',
};

const savedLevelId =
  typeof userData.level === 'string'
    ? legacyLevelMap[userData.level] ??
      userData.level
    : null;

const savedLevel = levelOptions.find(
  (option) => option.id === savedLevelId
);

      if (savedNativeLanguage) {
        setNativeLanguage(savedNativeLanguage);
      }

      if (savedLearningLanguage) {
        setLearningLanguage(savedLearningLanguage);
      }

      if (savedLevel) {
        setSelectedLevel(savedLevel.id);
      }
    } catch (error) {
  console.error(
    'Error loading language profile:',
    error
  );

  if (isActive) {
    setHasLoadingError(true);
  }
} finally {
      if (isActive) {
        setIsLoadingProfile(false);
      }
    }
  };

  loadLanguageProfile();

    return () => {
    isActive = false;
  };
}, [loadingAttempt]);

  const getLanguageName = (option: LanguageOption) => {
  const languageNames: Record<string, string> =
    text.languageProfileScreen.languageNames;

  return languageNames[option.code] || option.code;
};

const getLevelName = (option?: LevelOption) => {
  if (!option) {
    return text.languageProfileScreen.selectCurrentLevel;
  }

  const levelNames: Record<string, string> =
    text.languageProfileScreen.levelNames;

  return levelNames[option.id] || option.code;
};

  const showNativeLanguageSelector = () => {
  setIsNativeLanguageOpen((currentValue) => !currentValue);
};

  const showLearningLanguageSelector = () => {
  setIsLearningLanguageOpen(
    (currentValue) => !currentValue
  );
};
  const handleContinue = async () => {
  if (isSaving) {
    return;
  }

  if (!nativeLanguage) {
  Alert.alert(
    text.languageProfileScreen.nativeLanguageRequiredTitle,
    text.languageProfileScreen.nativeLanguageRequiredMessage
  );
  return;
}

 if (!learningLanguage) {
  Alert.alert(
    text.languageProfileScreen.learningLanguageRequiredTitle,
    text.languageProfileScreen.learningLanguageRequiredMessage
  );
  return;
}

  if (nativeLanguage.code === learningLanguage.code) {
  Alert.alert(
    text.languageProfileScreen.differentLanguagesTitle,
    text.languageProfileScreen.differentLanguagesMessage
  );
  return;
}

 if (!selectedLevel) {
  Alert.alert(
    text.languageProfileScreen.levelRequiredTitle,
    text.languageProfileScreen.levelRequiredMessage
  );
  return;
}

  const currentUser = auth.currentUser;

  if (!currentUser) {
  Alert.alert(
    text.languageProfileScreen.loginRequiredTitle,
    text.languageProfileScreen.loginRequiredMessage
  );
  return;
}

  try {
    setIsSaving(true);

    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        uid: currentUser.uid,
        fullName:
  currentUser.displayName ||
  (typeof existingUserData?.fullName === 'string'
    ? existingUserData.fullName
    : ''),
email:
  currentUser.email ||
  (typeof existingUserData?.email === 'string'
    ? existingUserData.email
    : ''),
        interfaceLanguage: language,
        nativeLanguage: nativeLanguage.code,
        learningLanguage: learningLanguage.code,
        level: selectedLevel,
        profileCompleted: true,
        online: false,
        accountCreatedAt:
          currentUser.metadata.creationTime ?? null,
        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    Alert.alert(
  isEditingProfile
    ? text.languageProfileScreen.changesSavedTitle
    : text.languageProfileScreen.profileSavedTitle,
  isEditingProfile
    ? text.languageProfileScreen.changesSavedMessage
    : text.languageProfileScreen.profileSavedMessage,
  [
    {
      text: text.languageProfileScreen.continue,
      onPress: () =>
        router.replace({
          pathname: '/home',
          params: {
            lang: language,
            nativeLanguage: nativeLanguage.code,
            learningLanguage: learningLanguage.code,
            level: selectedLevel,
          },
        }),
    },
  ]
);

  } catch (error) {
    console.error(
      'Error saving language profile:',
      error
    );

    Alert.alert(
  text.languageProfileScreen.saveErrorTitle,
  text.languageProfileScreen.saveErrorMessage
);
  } finally {
    setIsSaving(false);
  }
};
const handleRetryLoading = () => {
  setHasLoadingError(false);
  setIsLoadingProfile(true);
  setLoadingAttempt(
    (currentAttempt) => currentAttempt + 1
  );
};
const goBack = () => {
  router.back();
};

if (isLoadingProfile) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          },
        ]}
      >
        <StatusBar style="light" />

        <ActivityIndicator
          color="#22D3EE"
          size="large"
        />

        <Text
  style={{
    color: '#E2E8F0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  }}
>
  {text.languageProfileScreen.loadingProfile}
</Text>
      </View>
    </SafeAreaView>
  );
}
if (hasLoadingError) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.container,
          {
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          },
        ]}
      >
        <StatusBar style="light" />

        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 22,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {text.languageProfileScreen.loadErrorTitle}
        </Text>

        <Text
          style={{
            color: '#94A3B8',
            fontSize: 15,
            lineHeight: 22,
            marginTop: 12,
            textAlign: 'center',
          }}
        >
          {text.languageProfileScreen.loadErrorMessage}
        </Text>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              marginTop: 28,
              maxWidth: 320,
            },
          ]}
          onPress={handleRetryLoading}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryButtonText}>
            {text.languageProfileScreen.tryAgain}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            marginTop: 18,
            paddingHorizontal: 20,
            paddingVertical: 12,
          }}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>
  {text.languageProfileScreen.goBack}
</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
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
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              {text.languageProfileScreen.back}
            </Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.step}>
              {text.languageProfileScreen.step}
            </Text>

            <Text style={styles.title}>
  {isEditingProfile
  ? text.languageProfileScreen.editTitle
  : text.languageProfileScreen.createTitle}
</Text>

            <Text style={styles.subtitle}>
 {isEditingProfile
  ? text.languageProfileScreen.editSubtitle
  : text.languageProfileScreen.createSubtitle}
</Text>

            <Text style={styles.label}>
              {text.languageProfileScreen.nativeLanguageQuestion}
            </Text>

            <TouchableOpacity
              style={[
                styles.selector,
                nativeLanguage && styles.selectedSelector,
              ]}
              onPress={showNativeLanguageSelector}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.selectorText,
                  nativeLanguage && styles.selectedSelectorText,
                ]}
              >
                {nativeLanguage
  ? getLanguageName(nativeLanguage)
  : text.languageProfileScreen.selectNativeLanguage}
              </Text>

              <Text style={styles.arrow}>⌄</Text>
            </TouchableOpacity>

           <Text style={styles.label}>
  {text.languageProfileScreen.learningLanguageQuestion}
</Text>

<TouchableOpacity
  style={[
    styles.selector,
    learningLanguage && styles.selectedSelector,
  ]}
  onPress={showLearningLanguageSelector}
  activeOpacity={0.85}
>
  <Text
    style={[
      styles.selectorText,
      learningLanguage && styles.selectedSelectorText,
    ]}
  >
    {learningLanguage
      ? getLanguageName(learningLanguage)
      : text.languageProfileScreen.selectLearningLanguage}
  </Text>

              <Text style={styles.arrow}>⌄</Text>
            </TouchableOpacity>
   {isLearningLanguageOpen && (
  <View
    style={{
      backgroundColor: '#0B1430',
      borderWidth: 1.5,
      borderColor: '#334C7D',
      borderRadius: 16,
      padding: 10,
      marginTop: -10,
      marginBottom: 20,
      maxHeight: 280,
    }}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      {languageOptions.map((option) => {
        const isSelected =
          option.code === learningLanguage?.code;

        const isDisabled =
          option.code === nativeLanguage?.code;

        return (
          <TouchableOpacity
            key={option.code}
            style={{
              minHeight: 48,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isSelected
                ? '#25356B'
                : 'transparent',
              borderWidth: isSelected ? 1.5 : 0,
              borderColor: '#22D3EE',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 11,
              marginBottom: 6,
              opacity: isDisabled ? 0.4 : 1,
            }}
            onPress={() => {
              setLearningLanguage(option);
              setIsLearningLanguageOpen(false);
            }}
            activeOpacity={0.8}
            disabled={isDisabled}
          >
            <Text
              style={{
                flex: 1,
                color: isSelected
                  ? '#FFFFFF'
                  : '#D7E0F5',
                fontSize: 15,
                fontWeight: isSelected
                  ? 'bold'
                  : '600',
              }}
            >
              {getLanguageName(option)}
            </Text>

            {isSelected && (
              <Text
                style={{
                  color: '#22D3EE',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 12,
                }}
              >
                ✓
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}         
{isNativeLanguageOpen && (
  <View
    style={{
      backgroundColor: '#0B1430',
      borderWidth: 1.5,
      borderColor: '#334C7D',
      borderRadius: 16,
      padding: 10,
      marginTop: -10,
      marginBottom: 20,
      maxHeight: 280,
    }}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      {languageOptions.map((option) => {
        const isSelected =
          option === nativeLanguage;

        const isDisabled =
          option === learningLanguage;

        return (
          <TouchableOpacity
            key={option.code}
            style={{
              minHeight: 48,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isSelected
                ? '#25356B'
                : 'transparent',
              borderWidth: isSelected ? 1.5 : 0,
              borderColor: '#22D3EE',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 11,
              marginBottom: 6,
              opacity: isDisabled ? 0.4 : 1,
            }}
            onPress={() => {
              setNativeLanguage(option);
              setIsNativeLanguageOpen(false);
            }}
            activeOpacity={0.8}
            disabled={isDisabled}
          >
            <Text
              style={{
                flex: 1,
                color: isSelected
                  ? '#FFFFFF'
                  : '#D7E0F5',
                fontSize: 15,
                fontWeight: isSelected
                  ? 'bold'
                  : '600',
              }}
            >
              {getLanguageName(option)}
            </Text>

            {isSelected && (
              <Text
                style={{
                  color: '#22D3EE',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 12,
                }}
              >
                ✓
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}
            <Text style={styles.label}>
  {text.languageProfileScreen.currentLevelQuestion}
</Text>

            <TouchableOpacity
  style={[
    styles.selector,
    selectedLevel && styles.selectedSelector,
  ]}
  onPress={() =>
    setIsLevelOpen((currentValue) => !currentValue)
  }
  activeOpacity={0.85}
>
  <Text
    style={[
      styles.selectorText,
      selectedLevel && styles.selectedSelectorText,
    ]}
  >
    {selectedLevel
  ? getLevelName(
      levelOptions.find(
        (option) => option.id === selectedLevel
      )!
    )
  : text.languageProfileScreen.selectCurrentLevel}
  </Text>

  <Text style={styles.arrow}>
    {isLevelOpen ? '▲' : '▼'}
  </Text>
</TouchableOpacity>

{isLevelOpen && (
  <View
    style={{
      backgroundColor: '#0B1430',
      borderWidth: 1.5,
      borderColor: '#334C7D',
      borderRadius: 16,
      padding: 10,
      marginTop: -10,
      marginBottom: 20,
      maxHeight: 280,
    }}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      {levelOptions.map((option) => {
        const isSelected =
          selectedLevel === option.id;

        return (
          <TouchableOpacity
            key={option.id}
            style={{
              minHeight: 48,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: isSelected
                ? '#25356B'
                : 'transparent',
              borderWidth: isSelected ? 1.5 : 0,
              borderColor: '#22D3EE',
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 11,
              marginBottom: 6,
            }}
            onPress={() => {
              setSelectedLevel(option.id);
              setIsLevelOpen(false);
            }}
            activeOpacity={0.8}
          >
            <Text
              style={{
                flex: 1,
                color: isSelected
                  ? '#FFFFFF'
                  : '#D7E0F5',
                fontSize: 15,
                fontWeight: isSelected
                  ? 'bold'
                  : '600',
              }}
            >
              {getLevelName(option)}
            </Text>

            {isSelected && (
              <Text
                style={{
                  color: '#22D3EE',
                  fontSize: 18,
                  fontWeight: 'bold',
                  marginLeft: 12,
                }}
              >
                ✓
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
)}

            <View style={styles.infoCard}>
  <Text style={styles.infoTitle}>
    {text.languageProfileScreen.informationTitle}
  </Text>

  <Text style={styles.infoText}>
    {text.languageProfileScreen.informationText}
  </Text>
</View>

            <TouchableOpacity
  style={[
    styles.primaryButton,
    isSaving && styles.disabledButton,
  ]}
  onPress={handleContinue}
  activeOpacity={0.85}
  disabled={isSaving}
>
  {isSaving ? (
    <View style={styles.savingContent}>
      <ActivityIndicator
        color="#FFFFFF"
        size="small"
      />

      <Text style={styles.savingText}>
  {text.languageProfileScreen.saving}
</Text>
    </View>
  ) : (
    <Text style={styles.primaryButtonText}>
  {isEditingProfile
    ? text.languageProfileScreen.saveChanges
    : text.languageProfileScreen.continue}
</Text>
  )}
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
    backgroundColor: '#0F172A',
  },

  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 38,
  },

  formContainer: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 16,
  },

  backButtonText: {
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '600',
  },

  step: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
    marginTop: 12,
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 34,
  },

  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },

  selector: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
    selectedSelector: {
    borderColor: '#6366F1',
    backgroundColor: '#222B46',
  },

  selectorText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 15,
    paddingRight: 12,
  },

  selectedSelectorText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  arrow: {
    color: '#A7F3D0',
    fontSize: 22,
  },

  levelContainer: {
    gap: 12,
    marginBottom: 26,
  },

  levelButton: {
    width: '100%',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  selectedLevelButton: {
    borderColor: '#6366F1',
    backgroundColor: '#222B46',
  },

  levelTextContainer: {
    flex: 1,
  },

  levelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  selectedLevelTitle: {
    color: '#A7F3D0',
  },

  levelCode: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },

  selectedLevelCode: {
    color: '#CBD5E1',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },

  selectedRadioOuter: {
    borderColor: '#A7F3D0',
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A7F3D0',
  },

  infoCard: {
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    marginBottom: 28,
  },

  infoTitle: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: 'bold',
  },

  infoText: {
    color: '#D1FAE5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  primaryButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
  disabledButton: {
  opacity: 0.65,
},

savingContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
},

savingText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
  marginLeft: 10,
},
});
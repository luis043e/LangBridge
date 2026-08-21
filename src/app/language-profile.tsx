import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useState } from 'react';
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
import { type AppLanguage } from '../translations';
type LanguageOption = {
  code: string;
  es: string;
  en: string;
};

type LevelOption = {
  id: 'beginner' | 'intermediate' | 'advanced';
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
    id: 'beginner',
    code: 'A1 - A2',
    es: 'Principiante',
    en: 'Beginner',
  },
  {
    id: 'intermediate',
    code: 'B1 - B2',
    es: 'Intermedio',
    en: 'Intermediate',
  },
  {
    id: 'advanced',
    code: 'C1 - C2',
    es: 'Avanzado',
    en: 'Advanced',
  },
];

export default function LanguageProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';

  const [nativeLanguage, setNativeLanguage] =
    useState<LanguageOption | null>(null);
const [isNativeLanguageOpen, setIsNativeLanguageOpen] =
  useState(false);
  const [learningLanguage, setLearningLanguage] =
    useState<LanguageOption | null>(null);

  const [selectedLevel, setSelectedLevel] =
    useState<LevelOption['id'] | null>(null);
    const [isSaving, setIsSaving] = useState(false);

  const getLanguageName = (option: LanguageOption) => {
    return language === 'es' ? option.es : option.en;
  };

  const getLevelName = (option: LevelOption) => {
    return language === 'es' ? option.es : option.en;
  };

  const showNativeLanguageSelector = () => {
  setIsNativeLanguageOpen((currentValue) => !currentValue);
};

  const showLearningLanguageSelector = () => {
    Alert.alert(
      language === 'es'
        ? 'Idioma que quieres aprender'
        : 'Language you want to learn',
      language === 'es'
        ? 'Selecciona el idioma que quieres aprender.'
        : 'Select the language you want to learn.',
      [
        ...languageOptions.map((option) => ({
          text: getLanguageName(option),
          onPress: () => setLearningLanguage(option),
        })),
        {
          text: language === 'es' ? 'Cancelar' : 'Cancel',
          style: 'cancel' as const,
        },
      ]
    );
  };
  const handleContinue = async () => {
  if (isSaving) {
    return;
  }

  if (!nativeLanguage) {
    Alert.alert(
      language === 'es'
        ? 'Idioma nativo requerido'
        : 'Native language required',
      language === 'es'
        ? 'Selecciona tu idioma nativo para continuar.'
        : 'Select your native language to continue.'
    );
    return;
  }

  if (!learningLanguage) {
    Alert.alert(
      language === 'es'
        ? 'Idioma de aprendizaje requerido'
        : 'Learning language required',
      language === 'es'
        ? 'Selecciona el idioma que quieres aprender.'
        : 'Select the language you want to learn.'
    );
    return;
  }

  if (nativeLanguage.code === learningLanguage.code) {
    Alert.alert(
      language === 'es'
        ? 'Selecciona idiomas diferentes'
        : 'Select different languages',
      language === 'es'
        ? 'El idioma nativo y el idioma que quieres aprender deben ser diferentes.'
        : 'Your native language and learning language must be different.'
    );
    return;
  }

  if (!selectedLevel) {
    Alert.alert(
      language === 'es'
        ? 'Nivel requerido'
        : 'Level required',
      language === 'es'
        ? 'Selecciona tu nivel actual para continuar.'
        : 'Select your current level to continue.'
    );
    return;
  }

  const currentUser = auth.currentUser;

  if (!currentUser) {
    Alert.alert(
      language === 'es'
        ? 'Sesión requerida'
        : 'Login required',
      language === 'es'
        ? 'Debes iniciar sesión nuevamente para guardar tu perfil.'
        : 'You must log in again to save your profile.'
    );
    return;
  }

  try {
    setIsSaving(true);

    await setDoc(
      doc(db, 'users', currentUser.uid),
      {
        uid: currentUser.uid,
        fullName: currentUser.displayName ?? '',
        email: currentUser.email ?? '',
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
      language === 'es'
        ? 'Perfil guardado'
        : 'Profile saved',
      language === 'es'
        ? 'Tu perfil lingüístico fue guardado correctamente.'
        : 'Your language profile was saved successfully.',
      [
        {
          text:
            language === 'es'
              ? 'Continuar'
              : 'Continue',
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
      language === 'es'
        ? 'Error al guardar'
        : 'Save error',
      language === 'es'
        ? 'No se pudo guardar tu perfil. Revisa tu conexión e inténtalo nuevamente.'
        : 'Your profile could not be saved. Check your connection and try again.'
    );
  } finally {
    setIsSaving(false);
  }
};
const goBack = () => {
  router.back();
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
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              {language === 'es' ? '‹ Atrás' : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <View style={styles.formContainer}>
            <Text style={styles.step}>
              {language === 'es'
                ? 'PASO 1 DE 3'
                : 'STEP 1 OF 3'}
            </Text>

            <Text style={styles.title}>
              {language === 'es'
                ? 'Crea tu perfil lingüístico'
                : 'Build your language profile'}
            </Text>

            <Text style={styles.subtitle}>
              {language === 'es'
                ? 'Cuéntanos qué idioma hablas y cuál quieres aprender.'
                : 'Tell us about the language you speak and want to learn.'}
            </Text>

            <Text style={styles.label}>
              {language === 'es'
                ? '¿Cuál es tu idioma nativo?'
                : 'What is your native language?'}
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
                  : language === 'es'
                    ? 'Selecciona tu idioma nativo'
                    : 'Select your native language'}
              </Text>

              <Text style={styles.arrow}>⌄</Text>
            </TouchableOpacity>

            <Text style={styles.label}>
              {language === 'es'
                ? '¿Qué idioma quieres aprender?'
                : 'What language do you want to learn?'}
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
                  : language === 'es'
                    ? 'Selecciona un idioma para aprender'
                    : 'Select a learning language'}
              </Text>

              <Text style={styles.arrow}>⌄</Text>
            </TouchableOpacity>
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
              {language === 'es'
                ? '¿Cuál es tu nivel actual?'
                : 'What is your current level?'}
            </Text>

            <View style={styles.levelContainer}>
              {levelOptions.map((option) => {
                const isSelected =
                  selectedLevel === option.id;

                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.levelButton,
                      isSelected &&
                        styles.selectedLevelButton,
                    ]}
                    onPress={() =>
                      setSelectedLevel(option.id)
                    }
                    activeOpacity={0.85}
                  >
                    <View style={styles.levelTextContainer}>
                      <Text
                        style={[
                          styles.levelTitle,
                          isSelected &&
                            styles.selectedLevelTitle,
                        ]}
                      >
                        {getLevelName(option)}
                      </Text>

                      <Text
                        style={[
                          styles.levelCode,
                          isSelected &&
                            styles.selectedLevelCode,
                        ]}
                      >
                        {option.code}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.radioOuter,
                        isSelected &&
                          styles.selectedRadioOuter,
                      ]}
                    >
                      {isSelected && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>
                {language === 'es'
                  ? '¿Por qué necesitamos esta información?'
                  : 'Why do we need this?'}
              </Text>

              <Text style={styles.infoText}>
                {language === 'es'
                  ? 'LangBridge utiliza tus idiomas y tu nivel para recomendarte compañeros compatibles que puedan ayudarte a alcanzar tus objetivos.'
                  : 'LangBridge uses your languages and level to recommend compatible partners who can help you reach your goals.'}
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
        {language === 'es'
          ? 'Guardando...'
          : 'Saving...'}
      </Text>
    </View>
  ) : (
    <Text style={styles.primaryButtonText}>
      {language === 'es'
        ? 'Continuar'
        : 'Continue'}
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
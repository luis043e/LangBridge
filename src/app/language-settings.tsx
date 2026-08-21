import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebaseConfig';

import { type AppLanguage } from '../translations';
type SelectorType =
  | 'native'
  | 'learning'
  | 'level'
  | null;
const languageOptions = [
  { code: 'es', nameEs: 'Español', nameEn: 'Spanish' },
  { code: 'en', nameEs: 'Inglés', nameEn: 'English' },
  { code: 'fr', nameEs: 'Francés', nameEn: 'French' },
  { code: 'pt', nameEs: 'Portugués', nameEn: 'Portuguese' },
  { code: 'de', nameEs: 'Alemán', nameEn: 'German' },
  { code: 'it', nameEs: 'Italiano', nameEn: 'Italian' },
  { code: 'nl', nameEs: 'Neerlandés', nameEn: 'Dutch' },
  { code: 'ru', nameEs: 'Ruso', nameEn: 'Russian' },
  { code: 'uk', nameEs: 'Ucraniano', nameEn: 'Ukrainian' },
  { code: 'pl', nameEs: 'Polaco', nameEn: 'Polish' },
  { code: 'tr', nameEs: 'Turco', nameEn: 'Turkish' },
  { code: 'ar', nameEs: 'Árabe', nameEn: 'Arabic' },
  { code: 'hi', nameEs: 'Hindi', nameEn: 'Hindi' },
  { code: 'bn', nameEs: 'Bengalí', nameEn: 'Bengali' },
  { code: 'zh', nameEs: 'Chino mandarín', nameEn: 'Mandarin Chinese' },
  { code: 'ja', nameEs: 'Japonés', nameEn: 'Japanese' },
  { code: 'ko', nameEs: 'Coreano', nameEn: 'Korean' },
  { code: 'id', nameEs: 'Indonesio', nameEn: 'Indonesian' },
  { code: 'vi', nameEs: 'Vietnamita', nameEn: 'Vietnamese' },
  { code: 'el', nameEs: 'Griego', nameEn: 'Greek' },
];

const levelOptions = [
  {
    code: 'a1',
    nameEs: 'A1 · Principiante',
    nameEn: 'A1 · Beginner',
  },
  {
    code: 'a2',
    nameEs: 'A2 · Básico',
    nameEn: 'A2 · Elementary',
  },
  {
    code: 'b1',
    nameEs: 'B1 · Intermedio',
    nameEn: 'B1 · Intermediate',
  },
  {
    code: 'b2',
    nameEs: 'B2 · Intermedio alto',
    nameEn: 'B2 · Upper intermediate',
  },
  {
    code: 'c1',
    nameEs: 'C1 · Avanzado',
    nameEn: 'C1 · Advanced',
  },
  {
    code: 'c2',
    nameEs: 'C2 · Dominio',
    nameEn: 'C2 · Proficiency',
  },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [nativeLanguage, setNativeLanguage] =
  useState('es');

const [learningLanguage, setLearningLanguage] =
  useState('en');

const [level, setLevel] =
  useState('a1');

const [activeSelector, setActiveSelector] =
  useState<SelectorType>(null);

  const [isLoading, setIsLoading] = useState(true);
const [isSaving, setIsSaving] = useState(false);
useEffect(() => {
  const loadLanguageSettings = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    try {
      const userReference = doc(
        db,
        'users',
        currentUser.uid
      );

      const userSnapshot = await getDoc(userReference);

      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();

        if (userData.nativeLanguage) {
          setNativeLanguage(userData.nativeLanguage);
        }

        if (userData.learningLanguage) {
          setLearningLanguage(userData.learningLanguage);
        }

        if (userData.level) {
          setLevel(userData.level);
        }
      }
    } catch (error) {
      console.error(
        'Error loading language settings:',
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  loadLanguageSettings();
}, []);
  const getLanguageName = (code: string) => {

    const languageNames: Record<string, string> = {
      es: language === 'es' ? 'Español' : 'Spanish',
      en: language === 'es' ? 'Inglés' : 'English',
      fr: language === 'es' ? 'Francés' : 'French',
      pt: language === 'es' ? 'Portugués' : 'Portuguese',
      de: language === 'es' ? 'Alemán' : 'German',
      it: language === 'es' ? 'Italiano' : 'Italian',
    };

    return languageNames[code] || code;
  };

      const getLevelName = (code: string) => {
    const levelNames: Record<string, string> = {
      a1:
        language === 'es'
          ? 'A1 · Principiante'
          : 'A1 · Beginner',
      a2:
        language === 'es'
          ? 'A2 · Básico'
          : 'A2 · Elementary',
      b1:
        language === 'es'
          ? 'B1 · Intermedio'
          : 'B1 · Intermediate',
      b2:
        language === 'es'
          ? 'B2 · Intermedio alto'
          : 'B2 · Upper intermediate',
      c1:
        language === 'es'
          ? 'C1 · Avanzado'
          : 'C1 · Advanced',
      c2:
        language === 'es'
          ? 'C2 · Dominio'
          : 'C2 · Proficiency',
    };

    return levelNames[code] || code;
  };

  const activeOptions =
    activeSelector === 'level'
      ? levelOptions
      : languageOptions;

  const selectorTitle =
    activeSelector === 'native'
      ? language === 'es'
        ? 'Selecciona tu idioma nativo'
        : 'Select your native language'
      : activeSelector === 'learning'
        ? language === 'es'
          ? 'Selecciona el idioma que quieres aprender'
          : 'Select the language you want to learn'
        : language === 'es'
          ? 'Selecciona tu nivel'
          : 'Select your level';

  const selectedCode =
    activeSelector === 'native'
      ? nativeLanguage
      : activeSelector === 'learning'
        ? learningLanguage
        : level;

  const handleOptionSelect = (code: string) => {
    if (activeSelector === 'native') {
      if (code === learningLanguage) {
        return;
      }

      setNativeLanguage(code);
    }

    if (activeSelector === 'learning') {
      if (code === nativeLanguage) {
        return;
      }

      setLearningLanguage(code);
    }

    if (activeSelector === 'level') {
      setLevel(code);
    }

    setActiveSelector(null);
  };
const handleSaveChanges = async () => {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    Alert.alert(
      language === 'es'
        ? 'Sesión no disponible'
        : 'Session unavailable',
      language === 'es'
        ? 'Inicia sesión nuevamente para guardar los cambios.'
        : 'Please log in again to save your changes.'
    );
    return;
  }

  try {
    setIsSaving(true);

    const userReference = doc(
      db,
      'users',
      currentUser.uid
    );

    await setDoc(
      userReference,
      {
        nativeLanguage,
        learningLanguage,
        level,
      },
      {
        merge: true,
      }
    );

    Alert.alert(
      language === 'es'
        ? 'Cambios guardados'
        : 'Changes saved',
      language === 'es'
        ? 'Tus idiomas y nivel se actualizaron correctamente.'
        : 'Your languages and level were updated successfully.'
    );
  } catch (error) {
    console.error(
      'Error saving language settings:',
      error
    );

    Alert.alert(
      language === 'es'
        ? 'No se pudieron guardar los cambios'
        : 'Changes could not be saved',
      language === 'es'
        ? 'Revisa tu conexión e inténtalo nuevamente.'
        : 'Check your connection and try again.'
    );
  } finally {
    setIsSaving(false);
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
              {language === 'es'
                ? '‹ Atrás'
                : '‹ Back'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            {language === 'es'
              ? 'Idiomas y nivel'
              : 'Languages and level'}
          </Text>

          <Text style={styles.subtitle}>
            {language === 'es'
              ? 'Configura los idiomas que hablas y deseas aprender.'
              : 'Set the languages you speak and want to learn.'}
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>
              {language === 'es'
                ? 'Idioma nativo'
                : 'Native language'}
            </Text>

            <TouchableOpacity
  style={styles.selectorButton}
  onPress={() =>
  setActiveSelector((currentSelector) =>
    currentSelector === 'native' ? null : 'native'
  )
}
  activeOpacity={0.85}
>
  <Text style={styles.selectorText}>
    {getLanguageName(nativeLanguage)}
  </Text>

  <Text style={styles.selectorArrow}>
    ▼
  </Text>
</TouchableOpacity>
{activeSelector === 'native' && (
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
          option.code === nativeLanguage;

        const isDisabled =
          option.code === learningLanguage;

        const optionName =
          language === 'es'
            ? option.nameEs
            : option.nameEn;

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
            onPress={() =>
              handleOptionSelect(option.code)
            }
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
              {optionName}
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
                ? 'Quiero aprender'
                : 'I want to learn'}
            </Text>

            <TouchableOpacity
  style={styles.selectorButton}
  onPress={() =>
  setActiveSelector((currentSelector) =>
    currentSelector === 'learning'
      ? null
      : 'learning'
  )
}
  activeOpacity={0.85}
>
  <Text style={styles.selectorText}>
    {getLanguageName(learningLanguage)}
  </Text>

  <Text style={styles.selectorArrow}>
    ▼
  </Text>
</TouchableOpacity>
{activeSelector === 'learning' && (
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
          option.code === learningLanguage;

        const isDisabled =
          option.code === nativeLanguage;

        const optionName =
          language === 'es'
            ? option.nameEs
            : option.nameEn;

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
            onPress={() =>
              handleOptionSelect(option.code)
            }
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
              {optionName}
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
                ? 'Mi nivel actual'
                : 'My current level'}
            </Text>

            <TouchableOpacity
  style={styles.selectorButton}
  onPress={() =>
  setActiveSelector((currentSelector) =>
    currentSelector === 'level' ? null : 'level'
  )
}
  activeOpacity={0.85}
>
  <Text style={styles.selectorText}>
    {getLevelName(level)}
  </Text>

  <Text style={styles.selectorArrow}>
    ▼
  </Text>
</TouchableOpacity>
{activeSelector === 'level' && (
  <View
    style={{
      backgroundColor: '#0B1430',
      borderWidth: 1.5,
      borderColor: '#334C7D',
      borderRadius: 16,
      padding: 10,
      marginTop: -10,
      marginBottom: 4,
      maxHeight: 280,
    }}
  >
    <ScrollView
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
    >
      {levelOptions.map((option) => {
        const isSelected =
          option.code === level;

        const optionName =
          language === 'es'
            ? option.nameEs
            : option.nameEn;

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
            }}
            onPress={() =>
              handleOptionSelect(option.code)
            }
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
              {optionName}
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
          </View>

          <TouchableOpacity
  style={[
    styles.saveButton,
    (isLoading || isSaving) && {
      opacity: 0.55,
    },
  ]}
  onPress={handleSaveChanges}
  activeOpacity={0.85}
  disabled={isLoading || isSaving}
>
            <Text style={styles.saveButtonText}>
              {isLoading
  ? language === 'es'
    ? 'Cargando...'
    : 'Loading...'
  : isSaving
    ? language === 'es'
      ? 'Guardando...'
      : 'Saving...'
    : language === 'es'
      ? 'Guardar cambios'
      : 'Save changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
        <Modal
  visible={false}
  transparent
  animationType="fade"
  onRequestClose={() => setActiveSelector(null)}
>
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(5, 11, 36, 0.82)',
      paddingHorizontal: 22,
    }}
  >
    <View
      style={{
        maxHeight: '75%',
        backgroundColor: '#111C3A',
        borderWidth: 1.5,
        borderColor: '#4F46E5',
        borderRadius: 22,
        padding: 18,
      }}
    >
      <Text
        style={{
          color: '#FFFFFF',
          fontSize: 19,
          fontWeight: 'bold',
          marginBottom: 14,
        }}
      >
        {selectorTitle}
      </Text>

            <ScrollView
        style={{
          marginBottom: 14,
        }}
        showsVerticalScrollIndicator={false}
      >
        {activeOptions.map((option) => {
          const isSelected =
            option.code === selectedCode;

          const isDisabled =
            activeSelector === 'native'
              ? option.code === learningLanguage
              : activeSelector === 'learning'
                ? option.code === nativeLanguage
                : false;

          const optionName =
            language === 'es'
              ? option.nameEs
              : option.nameEn;

          return (
            <TouchableOpacity
              key={option.code}
              style={{
                minHeight: 52,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: isSelected
                  ? '#25356B'
                  : '#0B1430',
                borderWidth: 1.5,
                borderColor: isSelected
                  ? '#22D3EE'
                  : '#334C7D',
                borderRadius: 14,
                paddingHorizontal: 15,
                paddingVertical: 12,
                marginBottom: 10,
                opacity: isDisabled ? 0.4 : 1,
              }}
              onPress={() =>
                handleOptionSelect(option.code)
              }
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
                {optionName}
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

      <TouchableOpacity
        style={{
          minHeight: 48,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#263556',
          borderRadius: 14,
        }}
        onPress={() => setActiveSelector(null)}
        activeOpacity={0.85}
      >
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          {language === 'es' ? 'Cerrar' : 'Close'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
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

  formCard: {
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 22,
    padding: 18,
  },

  label: {
    color: '#E8EEFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
  },

  selectorButton: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0B1430',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 16,
    paddingHorizontal: 17,
    paddingVertical: 14,
    marginBottom: 20,
  },

  selectorText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  selectorArrow: {
    color: '#22D3EE',
    fontSize: 13,
    marginLeft: 12,
  },

  saveButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#22D3EE',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 22,
  },

  saveButtonText: {
    color: '#050B24',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
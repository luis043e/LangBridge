import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { translations } from '../translations';

type AppLanguage = 'en' | 'es';

type LanguageOption = {
  code: string;
  flag: string;
  nativeName: string;
  descriptionEs: string;
  descriptionEn: string;
  available: boolean;
};

const languageOptions: LanguageOption[] = [
  {
    code: 'en',
    flag: '🇺🇸',
    nativeName: 'English',
    descriptionEs: 'Usar LangBridge en inglés.',
    descriptionEn: 'Use LangBridge in English.',
    available: true,
  },
  {
    code: 'es',
    flag: '🇪🇸',
    nativeName: 'Español',
    descriptionEs: 'Usar LangBridge en español.',
    descriptionEn: 'Use LangBridge in Spanish.',
    available: true,
  },
  {
    code: 'fr',
    flag: '🇫🇷',
    nativeName: 'Français',
    descriptionEs: 'Interfaz en francés.',
    descriptionEn: 'French interface.',
    available: false,
  },
  {
    code: 'pt',
    flag: '🇧🇷',
    nativeName: 'Português',
    descriptionEs: 'Interfaz en portugués.',
    descriptionEn: 'Portuguese interface.',
    available: false,
  },
  {
    code: 'de',
    flag: '🇩🇪',
    nativeName: 'Deutsch',
    descriptionEs: 'Interfaz en alemán.',
    descriptionEn: 'German interface.',
    available: false,
  },
  {
    code: 'it',
    flag: '🇮🇹',
    nativeName: 'Italiano',
    descriptionEs: 'Interfaz en italiano.',
    descriptionEn: 'Italian interface.',
    available: false,
  },
  {
    code: 'ja',
    flag: '🇯🇵',
    nativeName: '日本語',
    descriptionEs: 'Interfaz en japonés.',
    descriptionEn: 'Japanese interface.',
    available: false,
  },
  {
    code: 'ko',
    flag: '🇰🇷',
    nativeName: '한국어',
    descriptionEs: 'Interfaz en coreano.',
    descriptionEn: 'Korean interface.',
    available: false,
  },
  {
    code: 'zh',
    flag: '🇨🇳',
    nativeName: '中文',
    descriptionEs: 'Interfaz en chino.',
    descriptionEn: 'Chinese interface.',
    available: false,
  },
  {
    code: 'ar',
    flag: '🇸🇦',
    nativeName: 'العربية',
    descriptionEs: 'Interfaz en árabe.',
    descriptionEn: 'Arabic interface.',
    available: false,
  },
  {
    code: 'ru',
    flag: '🇷🇺',
    nativeName: 'Русский',
    descriptionEs: 'Interfaz en ruso.',
    descriptionEn: 'Russian interface.',
    available: false,
  },
  {
    code: 'tr',
    flag: '🇹🇷',
    nativeName: 'Türkçe',
    descriptionEs: 'Interfaz en turco.',
    descriptionEn: 'Turkish interface.',
    available: false,
  },
  {
    code: 'nl',
    flag: '🇳🇱',
    nativeName: 'Nederlands',
    descriptionEs: 'Interfaz en neerlandés.',
    descriptionEn: 'Dutch interface.',
    available: false,
  },
  {
    code: 'pl',
    flag: '🇵🇱',
    nativeName: 'Polski',
    descriptionEs: 'Interfaz en polaco.',
    descriptionEn: 'Polish interface.',
    available: false,
  },
  {
    code: 'hi',
    flag: '🇮🇳',
    nativeName: 'हिन्दी',
    descriptionEs: 'Interfaz en hindi.',
    descriptionEn: 'Hindi interface.',
    available: false,
  },
];

export default function ChooseLanguageScreen() {
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] =
    useState<AppLanguage>('en');

  const [isLanguageListOpen, setIsLanguageListOpen] =
    useState(false);

  const [isContinuing, setIsContinuing] =
    useState(false);

  const text = translations[selectedLanguage];

  const selectedOption =
    languageOptions.find(
      (option) => option.code === selectedLanguage
    ) ?? languageOptions[0];

  const handleSelectLanguage = (
    option: LanguageOption
  ) => {
    if (!option.available) {
      return;
    }

    setSelectedLanguage(
      option.code as AppLanguage
    );

    setIsLanguageListOpen(false);
  };

  const handleContinue = async () => {
    if (isContinuing) {
      return;
    }

    try {
      setIsContinuing(true);

      await AsyncStorage.setItem(
        'appLanguage',
        selectedLanguage
      );

      router.replace({
        pathname: '/welcome',
        params: {
          lang: selectedLanguage,
        },
      });
    } finally {
      setIsContinuing(false);
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/langbridge-logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.introduction}>
            <Text style={styles.eyebrow}>
              LANGBRIDGE
            </Text>

            <Text style={styles.title}>
              {selectedLanguage === 'es'
                ? 'Elige tu idioma'
                : 'Choose your language'}
            </Text>

            <Text style={styles.subtitle}>
              {text.chooseLanguage.subtitle}
            </Text>
          </View>

          <Text style={styles.fieldLabel}>
            {selectedLanguage === 'es'
              ? 'Idioma de la interfaz'
              : 'Interface language'}
          </Text>

          <TouchableOpacity
            style={[
              styles.languageSelector,
              isLanguageListOpen &&
                styles.openLanguageSelector,
            ]}
            onPress={() =>
              setIsLanguageListOpen(
                (currentValue) => !currentValue
              )
            }
            activeOpacity={0.85}
          >
            <View style={styles.selectedLanguageContent}>
              <View style={styles.flagContainer}>
                <Text style={styles.flag}>
                  {selectedOption.flag}
                </Text>
              </View>

              <View style={styles.languageInformation}>
                <Text style={styles.languageName}>
                  {selectedOption.nativeName}
                </Text>

                <Text
                  style={styles.languageDescription}
                  numberOfLines={2}
                >
                  {selectedLanguage === 'es'
                    ? selectedOption.descriptionEs
                    : selectedOption.descriptionEn}
                </Text>
              </View>
            </View>

            <View style={styles.arrowContainer}>
              <Text style={styles.selectorArrow}>
                {isLanguageListOpen ? '▲' : '▼'}
              </Text>
            </View>
          </TouchableOpacity>

          {isLanguageListOpen && (
            <View style={styles.languageList}>
              <ScrollView
                style={styles.languageListScroll}
                contentContainerStyle={
                  styles.languageListContent
                }
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {languageOptions.map((option) => {
                  const isSelected =
                    selectedLanguage === option.code;

                  return (
                    <TouchableOpacity
                      key={option.code}
                      style={[
                        styles.languageOption,
                        isSelected &&
                          styles.selectedLanguageOption,
                        !option.available &&
                          styles.unavailableLanguageOption,
                      ]}
                      onPress={() =>
                        handleSelectLanguage(option)
                      }
                      activeOpacity={
                        option.available ? 0.8 : 1
                      }
                      disabled={!option.available}
                    >
                      <View
                        style={
                          styles.optionFlagContainer
                        }
                      >
                        <Text style={styles.optionFlag}>
                          {option.flag}
                        </Text>
                      </View>

                      <View
                        style={
                          styles.optionInformation
                        }
                      >
                        <Text
                          style={[
                            styles.optionName,
                            isSelected &&
                              styles.selectedOptionName,
                          ]}
                          numberOfLines={1}
                        >
                          {option.nativeName}
                        </Text>

                        <Text
                          style={
                            styles.optionDescription
                          }
                          numberOfLines={2}
                        >
                          {selectedLanguage === 'es'
                            ? option.descriptionEs
                            : option.descriptionEn}
                        </Text>
                      </View>

                      <View style={styles.optionStatus}>
                        {isSelected ? (
                          <View
                            style={styles.checkContainer}
                          >
                            <Text
                              style={styles.checkMark}
                            >
                              ✓
                            </Text>
                          </View>
                        ) : !option.available ? (
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
                              {selectedLanguage === 'es'
                                ? 'PRONTO'
                                : 'SOON'}
                            </Text>
                          </View>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={styles.noteCard}>
            <Text style={styles.noteIcon}>
              🌐
            </Text>

            <Text style={styles.note}>
              {text.chooseLanguage.note}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.primaryButton,
              isContinuing &&
                styles.disabledPrimaryButton,
            ]}
            onPress={handleContinue}
            activeOpacity={0.85}
            disabled={isContinuing}
          >
            <Text style={styles.primaryButtonText}>
              {isContinuing
                ? selectedLanguage === 'es'
                  ? 'Continuando...'
                  : 'Continuing...'
                : text.chooseLanguage.continue}
            </Text>

            <Text style={styles.primaryButtonArrow}>
              ›
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {selectedLanguage === 'es'
              ? 'Podrás cambiar este idioma más adelante.'
              : 'You can change this language later.'}
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
    width: '100%',
    maxWidth: 520,
    flexGrow: 1,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
  },

  logoContainer: {
    width: 104,
    height: 104,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 7,
  },

  logoImage: {
    width: '100%',
    height: '100%',
  },

  introduction: {
    alignItems: 'center',
    marginBottom: 26,
  },

  eyebrow: {
    color: '#22D3EE',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 2.2,
    marginBottom: 8,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 29,
    lineHeight: 37,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -0.4,
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
  },

  fieldLabel: {
    color: '#E8EEFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  languageSelector: {
    width: '100%',
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },

  openLanguageSelector: {
    backgroundColor: '#141F42',
    borderColor: '#22D3EE',
  },

  selectedLanguageContent: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  flagContainer: {
    width: 50,
    height: 50,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19284A',
    borderWidth: 1,
    borderColor: '#334C7D',
    borderRadius: 16,
    marginRight: 13,
  },

  flag: {
    fontSize: 27,
  },

  languageInformation: {
    flex: 1,
    minWidth: 0,
    paddingRight: 8,
  },

  languageName: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 'bold',
  },

  languageDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },

  arrowContainer: {
    width: 34,
    height: 34,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123B5D',
    borderRadius: 12,
    marginLeft: 8,
  },

  selectorArrow: {
    color: '#22D3EE',
    fontSize: 12,
    fontWeight: 'bold',
  },

  languageList: {
    width: '100%',
    maxHeight: 330,
    backgroundColor: '#0B1430',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 20,
    marginTop: 10,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },

  languageListScroll: {
    width: '100%',
  },

  languageListContent: {
    padding: 9,
    paddingBottom: 3,
  },

  languageOption: {
    width: '100%',
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1935',
    borderWidth: 1,
    borderColor: '#1F3158',
    borderRadius: 15,
    paddingHorizontal: 11,
    paddingVertical: 10,
    marginBottom: 6,
  },

  selectedLanguageOption: {
    backgroundColor: '#25356B',
    borderColor: '#22D3EE',
  },

  unavailableLanguageOption: {
    backgroundColor: '#0D1630',
    borderColor: '#1C2A4D',
    opacity: 0.76,
  },

  optionFlagContainer: {
    width: 46,
    height: 46,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#19284A',
    borderWidth: 1,
    borderColor: '#334C7D',
    borderRadius: 14,
    marginRight: 12,
  },

  optionFlag: {
    fontSize: 25,
  },

  optionInformation: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingRight: 7,
  },

  optionName: {
    color: '#D7E0F5',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },

  selectedOptionName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  optionDescription: {
    color: '#8492B0',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },

  optionStatus: {
    width: 54,
    flexShrink: 0,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  checkContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#123B5D',
    borderWidth: 1,
    borderColor: '#22D3EE',
    borderRadius: 16,
  },

  checkMark: {
    color: '#22D3EE',
    fontSize: 18,
    fontWeight: 'bold',
  },

  comingSoonBadge: {
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#30245C',
    borderWidth: 1,
    borderColor: '#A78BFA',
    borderRadius: 9,
    paddingHorizontal: 7,
    paddingVertical: 5,
  },

  comingSoonText: {
    color: '#DDD6FE',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.4,
  },

  noteCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 17,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginTop: 18,
  },

  noteIcon: {
    fontSize: 21,
    marginRight: 11,
  },

  note: {
    flex: 1,
    color: '#D1FAE5',
    fontSize: 12,
    lineHeight: 18,
  },

  primaryButton: {
    width: '100%',
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366F1',
    borderWidth: 1.5,
    borderColor: '#818CF8',
    borderRadius: 19,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 7,
  },

  disabledPrimaryButton: {
    opacity: 0.6,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  primaryButtonArrow: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: -2,
  },

  footerText: {
    color: '#64748B',
    fontSize: 11,
    lineHeight: 17,
    textAlign: 'center',
    marginTop: 17,
    paddingHorizontal: 20,
  },
});
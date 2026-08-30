import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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

import { auth } from '../firebaseConfig';
import {
  getLanguageDescription,
  isActiveLanguage,
  languageCatalog,
  type LanguageCatalogOption,
} from '../language-catalog';
import {
  translations,
  type AppLanguage,
} from '../translations';

type LanguageOption = LanguageCatalogOption & {
  available: boolean;
};

const languageOptions: LanguageOption[] =
  languageCatalog.map((option) => ({
    ...option,
    available: isActiveLanguage(option.code),
  }));

export default function ChooseLanguageScreen() {
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] =
    useState<AppLanguage>('en');
  
  const [isLoadingLanguage, setIsLoadingLanguage] =
  useState(true);

  const [isLanguageListOpen, setIsLanguageListOpen] =
    useState(false);

  const [isContinuing, setIsContinuing] =
    useState(false);
  
  useEffect(() => {
  let isActive = true;

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage =
        await AsyncStorage.getItem('appLanguage');

      if (
        isActive &&
        (savedLanguage === 'en' ||
          savedLanguage === 'es')
      ) {
        setSelectedLanguage(savedLanguage);
      }
    } catch (error) {
      console.error(
        'Error loading saved language:',
        error
      );
    } finally {
      if (isActive) {
        setIsLoadingLanguage(false);
      }
    }
  };

  loadSavedLanguage();

  return () => {
    isActive = false;
  };
}, []);  
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

          if (auth.currentUser) {
  router.replace({
    pathname: '/home',
    params: {
      lang: selectedLanguage,
    },
  });
  return;
}

router.replace({
  pathname: '/welcome',
  params: {
    lang: selectedLanguage,
  },
});
  } catch (error) {
    console.error(
      'Error saving interface language:',
      error
    );

    Alert.alert(
  text.chooseLanguage.saveErrorTitle,
  text.chooseLanguage.saveErrorMessage
);
  } finally {
    setIsContinuing(false);
  }
};
if (isLoadingLanguage) {
  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right', 'bottom']}
    >
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
            color: '#E8EEFF',
            fontSize: 16,
            fontWeight: '600',
            textAlign: 'center',
          }}
        >
          {text.chooseLanguage.loadingLanguage}
        </Text>
      </View>
    </SafeAreaView>
  );
}
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
              {text.chooseLanguage.title}
            </Text>

            <Text style={styles.subtitle}>
              {text.chooseLanguage.subtitle}
            </Text>
          </View>

          <Text style={styles.fieldLabel}>
            {text.chooseLanguage.interfaceLanguage}
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
                  {getLanguageDescription(
  selectedOption,
  selectedLanguage
)}
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
                          {getLanguageDescription(
  option,
  selectedLanguage
)}
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
                              {text.chooseLanguage.comingSoon}
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
  ? text.chooseLanguage.continuing
  : text.chooseLanguage.continue}
            </Text>

            <Text style={styles.primaryButtonArrow}>
              ›
            </Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            {text.chooseLanguage.changeLater}
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
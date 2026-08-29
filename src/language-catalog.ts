import {
  activeLanguageCodes,
  type AppLanguage,
  type SupportedLanguageCode,
} from './translations';

export type LanguageDirection = 'ltr' | 'rtl';

export type LanguageCatalogOption = {
  code: SupportedLanguageCode;
  flag: string;
  nativeName: string;
  descriptionEs: string;
  descriptionEn: string;
  direction: LanguageDirection;
};

export const languageCatalog: LanguageCatalogOption[] = [
  {
    code: 'en',
    flag: '🇺🇸',
    nativeName: 'English',
    descriptionEs: 'Usar LangBridge en inglés.',
    descriptionEn: 'Use LangBridge in English.',
    direction: 'ltr',
  },
  {
    code: 'es',
    flag: '🇪🇸',
    nativeName: 'Español',
    descriptionEs: 'Usar LangBridge en español.',
    descriptionEn: 'Use LangBridge in Spanish.',
    direction: 'ltr',
  },
  {
    code: 'fr',
    flag: '🇫🇷',
    nativeName: 'Français',
    descriptionEs: 'Usar LangBridge en francés.',
    descriptionEn: 'Use LangBridge in French.',
    direction: 'ltr',
  },
  {
    code: 'pt',
    flag: '🇧🇷',
    nativeName: 'Português',
    descriptionEs: 'Usar LangBridge en portugués.',
    descriptionEn: 'Use LangBridge in Portuguese.',
    direction: 'ltr',
  },
  {
    code: 'de',
    flag: '🇩🇪',
    nativeName: 'Deutsch',
    descriptionEs: 'Usar LangBridge en alemán.',
    descriptionEn: 'Use LangBridge in German.',
    direction: 'ltr',
  },
  {
    code: 'it',
    flag: '🇮🇹',
    nativeName: 'Italiano',
    descriptionEs: 'Usar LangBridge en italiano.',
    descriptionEn: 'Use LangBridge in Italian.',
    direction: 'ltr',
  },
  {
    code: 'ja',
    flag: '🇯🇵',
    nativeName: '日本語',
    descriptionEs: 'Usar LangBridge en japonés.',
    descriptionEn: 'Use LangBridge in Japanese.',
    direction: 'ltr',
  },
  {
    code: 'ko',
    flag: '🇰🇷',
    nativeName: '한국어',
    descriptionEs: 'Usar LangBridge en coreano.',
    descriptionEn: 'Use LangBridge in Korean.',
    direction: 'ltr',
  },
  {
    code: 'zh',
    flag: '🇨🇳',
    nativeName: '中文',
    descriptionEs: 'Usar LangBridge en chino.',
    descriptionEn: 'Use LangBridge in Chinese.',
    direction: 'ltr',
  },
  {
    code: 'ar',
    flag: '🇸🇦',
    nativeName: 'العربية',
    descriptionEs: 'Usar LangBridge en árabe.',
    descriptionEn: 'Use LangBridge in Arabic.',
    direction: 'rtl',
  },
  {
    code: 'ru',
    flag: '🇷🇺',
    nativeName: 'Русский',
    descriptionEs: 'Usar LangBridge en ruso.',
    descriptionEn: 'Use LangBridge in Russian.',
    direction: 'ltr',
  },
  {
    code: 'tr',
    flag: '🇹🇷',
    nativeName: 'Türkçe',
    descriptionEs: 'Usar LangBridge en turco.',
    descriptionEn: 'Use LangBridge in Turkish.',
    direction: 'ltr',
  },
  {
    code: 'nl',
    flag: '🇳🇱',
    nativeName: 'Nederlands',
    descriptionEs: 'Usar LangBridge en neerlandés.',
    descriptionEn: 'Use LangBridge in Dutch.',
    direction: 'ltr',
  },
  {
    code: 'pl',
    flag: '🇵🇱',
    nativeName: 'Polski',
    descriptionEs: 'Usar LangBridge en polaco.',
    descriptionEn: 'Use LangBridge in Polish.',
    direction: 'ltr',
  },
  {
    code: 'hi',
    flag: '🇮🇳',
    nativeName: 'हिन्दी',
    descriptionEs: 'Usar LangBridge en hindi.',
    descriptionEn: 'Use LangBridge in Hindi.',
    direction: 'ltr',
  },
];

export const isActiveLanguage = (
  code: SupportedLanguageCode
): code is AppLanguage => {
  return activeLanguageCodes.some(
    (activeCode) => activeCode === code
  );
};

export const getLanguageCatalogOption = (
  code: SupportedLanguageCode
) => {
  return languageCatalog.find(
    (option) => option.code === code
  );
};
export const getLanguageDescription = (
  option: LanguageCatalogOption,
  language: AppLanguage
) => {
  return language === 'es'
    ? option.descriptionEs
    : option.descriptionEn;
};
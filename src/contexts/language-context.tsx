import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import {
    isAppLanguage,
    type AppLanguage,
} from '../translations';

type LanguageContextValue = {
  language: AppLanguage;
  isLoadingLanguage: boolean;
  changeLanguage: (
    newLanguage: AppLanguage
  ) => Promise<void>;
};

const LanguageContext =
  createContext<LanguageContextValue | undefined>(
    undefined
  );

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguage] =
    useState<AppLanguage>('en');

  const [isLoadingLanguage, setIsLoadingLanguage] =
    useState(true);

  useEffect(() => {
    let isActive = true;

    const loadSavedLanguage = async () => {
      try {
        const savedLanguage =
          await AsyncStorage.getItem('appLanguage');

        if (
          isActive &&
          isAppLanguage(savedLanguage)
        ) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error(
          'Error loading global interface language:',
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

  const changeLanguage = useCallback(
    async (newLanguage: AppLanguage) => {
      await AsyncStorage.setItem(
        'appLanguage',
        newLanguage
      );

      setLanguage(newLanguage);
    },
    []
  );

  const contextValue = useMemo(
    () => ({
      language,
      isLoadingLanguage,
      changeLanguage,
    }),
    [
      language,
      isLoadingLanguage,
      changeLanguage,
    ]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used within LanguageProvider.'
    );
  }

  return context;
}
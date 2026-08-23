import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { auth, db } from '../../firebaseConfig';
import { type AppLanguage } from '../../translations';

type Partner = {
  id: string;
  name: string;
  photoURL: string;
  initials: string;
  countryCode: string;
  countryName: string;
  city: string;
  bio: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  online: boolean;
};

const getCountryFlag = (countryCode: string) => {
  const normalizedCode =
    countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCode)) {
    return '🌍';
  }

  return normalizedCode
    .split('')
    .map((character) =>
      String.fromCodePoint(
        127397 + character.charCodeAt(0)
      )
    )
    .join('');
};

export default function ExploreScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [searchText, setSearchText] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);

  const [realPartners, setRealPartners] =
    useState<Partner[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const getLanguageName = (code: string) => {
    const languageNames: Record<
      string,
      {
        es: string;
        en: string;
      }
    > = {
      es: {
        es: 'Español',
        en: 'Spanish',
      },
      en: {
        es: 'Inglés',
        en: 'English',
      },
      fr: {
        es: 'Francés',
        en: 'French',
      },
      pt: {
        es: 'Portugués',
        en: 'Portuguese',
      },
      de: {
        es: 'Alemán',
        en: 'German',
      },
      it: {
        es: 'Italiano',
        en: 'Italian',
      },
    };

    return (
      languageNames[code]?.[language] ||
      (language === 'es'
        ? 'No especificado'
        : 'Not specified')
    );
  };

  const getLevelName = (level: string) => {
    const levelNames: Record<
      string,
      {
        es: string;
        en: string;
      }
    > = {
      beginner: {
        es: 'Principiante',
        en: 'Beginner',
      },
      intermediate: {
        es: 'Intermedio',
        en: 'Intermediate',
      },
      advanced: {
        es: 'Avanzado',
        en: 'Advanced',
      },
    };

    return (
      levelNames[level]?.[language] ||
      (language === 'es'
        ? 'Nivel no especificado'
        : 'Level not specified')
    );
  };

  useEffect(() => {
    let isMounted = true;

    const loadPartners = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const usersSnapshot = await getDocs(
          collection(db, 'users')
        );

        const currentUserId =
          auth.currentUser?.uid;

        const loadedPartners: Partner[] =
          usersSnapshot.docs
            .filter((userDocument) => {
              const data =
                userDocument.data();

              const isVisible =
                data.isProfileVisible !== false;

              const isNotCurrentUser =
                userDocument.id !==
                currentUserId;

              return (
                isNotCurrentUser &&
                isVisible
              );
            })
            .map((userDocument) => {
              const data =
                userDocument.data();

              const displayName =
                data.fullName?.trim() ||
                data.email?.split('@')[0] ||
                (language === 'es'
                  ? 'Usuario de LangBridge'
                  : 'LangBridge user');

              const nameParts = displayName
                .split(' ')
                .filter(Boolean);

              const initials = nameParts
                .slice(0, 2)
                .map((part: string) =>
                  part
                    .charAt(0)
                    .toUpperCase()
                )
                .join('');

              return {
                id: userDocument.id,
                name: displayName,

                photoURL:
                  typeof data.photoURL ===
                  'string'
                    ? data.photoURL
                    : '',

                initials:
                  initials || 'LB',

                countryCode:
                  typeof data.countryCode ===
                  'string'
                    ? data.countryCode
                        .trim()
                        .toUpperCase()
                    : '',

                countryName:
                  typeof data.countryName ===
                  'string'
                    ? data.countryName.trim()
                    : '',

                city:
                  typeof data.city === 'string' &&
                  data.city.trim()
                    ? data.city.trim()
                    : language === 'es'
                      ? 'Ubicación no indicada'
                      : 'Location not provided',

                bio:
                  typeof data.bio === 'string'
                    ? data.bio
                    : '',

                nativeLanguage:
                  typeof data.nativeLanguage ===
                  'string'
                    ? data.nativeLanguage
                    : '',

                learningLanguage:
                  typeof data.learningLanguage ===
                  'string'
                    ? data.learningLanguage
                    : '',

                level:
                  typeof data.level === 'string'
                    ? data.level
                    : 'beginner',

                online:
                  data.online === true,
              };
            });

        if (isMounted) {
          setRealPartners(loadedPartners);
        }
      } catch (error) {
        console.error(
          'Error loading partners:',
          error
        );

        if (isMounted) {
          setLoadError(
            language === 'es'
              ? 'No se pudieron cargar los compañeros.'
              : 'Partners could not be loaded.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadPartners();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const filteredPartners = useMemo(() => {
    const search =
      searchText.trim().toLowerCase();

    return realPartners.filter((partner) => {
      const matchesSearch =
        !search ||
        partner.name
          .toLowerCase()
          .includes(search) ||
        partner.countryName
          .toLowerCase()
          .includes(search) ||
        partner.city
          .toLowerCase()
          .includes(search) ||
        partner.nativeLanguage
          .toLowerCase()
          .includes(search) ||
        getLanguageName(
          partner.nativeLanguage
        )
          .toLowerCase()
          .includes(search) ||
        getLanguageName(
          partner.learningLanguage
        )
          .toLowerCase()
          .includes(search);

      const matchesOnline =
        !onlineOnly || partner.online;

      return matchesSearch && matchesOnline;
    });
  }, [
    searchText,
    onlineOnly,
    realPartners,
    language,
  ]);

  const handleViewProfile = (
    partner: Partner
  ) => {
    router.push({
      pathname: '/partner-profile',
      params: {
        lang: language,
        partnerId: partner.id,
        name: partner.name,
        photoURL: partner.photoURL,
        initials: partner.initials,
        countryCode:
          partner.countryCode,
        countryName:
          partner.countryName,
        city: partner.city,
        bio: partner.bio,
        nativeLanguage:
          partner.nativeLanguage,
        learningLanguage:
          partner.learningLanguage,
        level: partner.level,
        online: String(partner.online),
      },
    });
  };

  const getDisplayedLocation = (
    partner: Partner
  ) => {
    const locationName =
      partner.countryName ||
      partner.city ||
      (language === 'es'
        ? 'País no indicado'
        : 'Country not provided');

    const locationFlag =
      partner.countryCode
        ? getCountryFlag(
            partner.countryCode
          )
        : '🌍';

    return `${locationFlag} ${locationName}`;
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
          keyboardShouldPersistTaps="handled"
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
              ? 'Encuentra compañeros'
              : 'Find language partners'}
          </Text>

          <Text style={styles.subtitle}>
            {language === 'es'
              ? 'Conecta con personas que pueden ayudarte a practicar el idioma que estás aprendiendo.'
              : 'Connect with people who can help you practice the language you are learning.'}
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder={
              language === 'es'
                ? 'Buscar por nombre, país o idioma'
                : 'Search by name, country, or language'
            }
            placeholderTextColor="#64748B"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <View style={styles.filterRow}>
            <Text style={styles.resultText}>
              {filteredPartners.length}{' '}
              {language === 'es'
                ? 'compañeros encontrados'
                : 'partners found'}
            </Text>

            <TouchableOpacity
              style={[
                styles.filterButton,
                onlineOnly &&
                  styles.activeFilterButton,
              ]}
              onPress={() =>
                setOnlineOnly(
                  (currentValue) =>
                    !currentValue
                )
              }
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  onlineOnly &&
                    styles.activeFilterButtonText,
                ]}
              >
                {language === 'es'
                  ? 'Solo en línea'
                  : 'Online only'}
              </Text>
            </TouchableOpacity>
          </View>

          {filteredPartners.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>
                🔎
              </Text>

              <Text style={styles.emptyTitle}>
                {isLoading
                  ? language === 'es'
                    ? 'Buscando compañeros...'
                    : 'Finding partners...'
                  : loadError
                    ? language === 'es'
                      ? 'No pudimos cargar los perfiles'
                      : 'Profiles could not be loaded'
                    : searchText.trim()
                      ? language === 'es'
                        ? 'No encontramos resultados'
                        : 'No results found'
                      : language === 'es'
                        ? 'Aún no hay otros compañeros'
                        : 'No other partners yet'}
              </Text>

              <Text style={styles.emptyText}>
                {loadError
                  ? loadError
                  : language === 'es'
                    ? 'Prueba con otro nombre, país o idioma.'
                    : 'Try another name, country, or language.'}
              </Text>
            </View>
          ) : (
            filteredPartners.map(
              (partner) => (
                <TouchableOpacity
                  key={partner.id}
                  style={styles.partnerCard}
                  onPress={() =>
                    handleViewProfile(
                      partner
                    )
                  }
                  activeOpacity={0.85}
                >
                  <View
                    style={
                      styles.avatarContainer
                    }
                  >
                    <View style={styles.avatar}>
                      {partner.photoURL ? (
                        <Image
                          source={{
                            uri: partner.photoURL,
                          }}
                          style={
                            styles.avatarImage
                          }
                          resizeMode="cover"
                        />
                      ) : (
                        <Text
                          style={
                            styles.avatarText
                          }
                        >
                          {partner.initials}
                        </Text>
                      )}
                    </View>

                    {partner.online && (
                      <View
                        style={
                          styles.onlineIndicator
                        }
                      />
                    )}
                  </View>

                  <View
                    style={
                      styles.partnerInformation
                    }
                  >
                    <Text
                      style={styles.partnerName}
                    >
                      {partner.name}
                    </Text>

                    <Text
                      style={
                        styles.partnerLocation
                      }
                      numberOfLines={1}
                    >
                      {getDisplayedLocation(
                        partner
                      )}
                    </Text>

                    <Text
                      style={
                        styles.languageInformation
                      }
                    >
                      {language === 'es'
                        ? `Habla: ${getLanguageName(
                            partner.nativeLanguage
                          )}`
                        : `Speaks: ${getLanguageName(
                            partner.nativeLanguage
                          )}`}
                    </Text>

                    <Text
                      style={
                        styles.languageInformation
                      }
                    >
                      {language === 'es'
                        ? `Aprende: ${getLanguageName(
                            partner.learningLanguage
                          )}`
                        : `Learning: ${getLanguageName(
                            partner.learningLanguage
                          )}`}
                    </Text>

                    <View
                      style={styles.levelBadge}
                    >
                      <Text
                        style={
                          styles.levelBadgeText
                        }
                      >
                        {getLevelName(
                          partner.level
                        )}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.arrow}>
                    ›
                  </Text>
                </TouchableOpacity>
              )
            )
          )}
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
    marginBottom: 14,
  },

  backButtonText: {
    color: '#A7F3D0',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },

  searchInput: {
    width: '100%',
    height: 54,
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 16,
  },

  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 18,
  },

  resultText: {
    flex: 1,
    color: '#94A3B8',
    fontSize: 13,
    marginRight: 12,
  },

  filterButton: {
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 18,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },

  activeFilterButton: {
    borderColor: '#A7F3D0',
    backgroundColor: '#132E2A',
  },

  filterButtonText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
  },

  activeFilterButtonText: {
    color: '#A7F3D0',
  },

  partnerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },

  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 19,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  onlineIndicator: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: '#34D399',
    borderWidth: 3,
    borderColor: '#1E293B',
  },

  partnerInformation: {
    flex: 1,
    minWidth: 0,
  },

  partnerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  partnerLocation: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 7,
  },

  languageInformation: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 18,
  },

  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#132E2A',
    borderRadius: 10,
    paddingHorizontal: 9,
    paddingVertical: 4,
    marginTop: 8,
  },

  levelBadgeText: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
  },

  arrow: {
    color: '#64748B',
    fontSize: 28,
    marginLeft: 8,
  },

  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 34,
  },

  emptyIcon: {
    fontSize: 34,
  },

  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
    textAlign: 'center',
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
});
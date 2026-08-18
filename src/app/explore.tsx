import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type AppLanguage } from '../translations';

type Partner = {
  id: number;
  name: string;
  initials: string;
  city: string;
  nativeLanguage: string;
  learningLanguage: string;
  level: string;
  online: boolean;
};

const partners: Partner[] = [
  {
    id: 1,
    name: 'Emily Carter',
    initials: 'EC',
    city: 'New York',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    level: 'Intermediate',
    online: true,
  },
  {
    id: 2,
    name: 'Daniel Brooks',
    initials: 'DB',
    city: 'Toronto',
    nativeLanguage: 'English',
    learningLanguage: 'Spanish',
    level: 'Beginner',
    online: true,
  },
  {
    id: 3,
    name: 'Sophie Martin',
    initials: 'SM',
    city: 'Paris',
    nativeLanguage: 'French',
    learningLanguage: 'Spanish',
    level: 'Intermediate',
    online: false,
  },
  {
    id: 4,
    name: 'Lucas Ferreira',
    initials: 'LF',
    city: 'São Paulo',
    nativeLanguage: 'Portuguese',
    learningLanguage: 'Spanish',
    level: 'Advanced',
    online: true,
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const [searchText, setSearchText] = useState('');
  const [onlineOnly, setOnlineOnly] = useState(false);

  const filteredPartners = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesSearch =
        !search ||
        partner.name.toLowerCase().includes(search) ||
        partner.city.toLowerCase().includes(search) ||
        partner.nativeLanguage.toLowerCase().includes(search);

      const matchesOnline =
        !onlineOnly || partner.online;

      return matchesSearch && matchesOnline;
    });
  }, [searchText, onlineOnly]);

  const handleConnect = (partner: Partner) => {
    Alert.alert(
      language === 'es'
        ? 'Solicitud enviada'
        : 'Request sent',
      language === 'es'
        ? `Se envió una solicitud de conexión a ${partner.name}.`
        : `A connection request was sent to ${partner.name}.`
    );
  };

  const handleViewProfile = (partner: Partner) => {
    Alert.alert(
      partner.name,
      language === 'es'
        ? `${partner.name} habla ${partner.nativeLanguage} y está aprendiendo ${partner.learningLanguage}.`
        : `${partner.name} speaks ${partner.nativeLanguage} and is learning ${partner.learningLanguage}.`,
      [
        {
          text: language === 'es'
            ? 'Cerrar'
            : 'Close',
          style: 'cancel',
        },
        {
          text: language === 'es'
            ? 'Conectar'
            : 'Connect',
          onPress: () => handleConnect(partner),
        },
      ]
    );
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
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
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
                ? 'Buscar por nombre, ciudad o idioma'
                : 'Search by name, city, or language'
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
                onlineOnly && styles.activeFilterButton,
              ]}
              onPress={() => setOnlineOnly(!onlineOnly)}
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
              <Text style={styles.emptyIcon}>🔎</Text>

              <Text style={styles.emptyTitle}>
                {language === 'es'
                  ? 'No encontramos resultados'
                  : 'No results found'}
              </Text>

              <Text style={styles.emptyText}>
                {language === 'es'
                  ? 'Prueba con otro nombre, ciudad o idioma.'
                  : 'Try another name, city, or language.'}
              </Text>
            </View>
          ) : (
            filteredPartners.map((partner) => (
              <TouchableOpacity
                key={partner.id}
                style={styles.partnerCard}
                onPress={() =>
                  handleViewProfile(partner)
                }
                activeOpacity={0.85}
              >
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {partner.initials}
                    </Text>
                  </View>

                  {partner.online && (
                    <View style={styles.onlineIndicator} />
                  )}
                </View>

                <View style={styles.partnerInformation}>
                  <Text style={styles.partnerName}>
                    {partner.name}
                  </Text>

                  <Text style={styles.partnerLocation}>
                    📍 {partner.city}
                  </Text>

                  <Text style={styles.languageInformation}>
                    {language === 'es'
                      ? `Habla: ${partner.nativeLanguage}`
                      : `Speaks: ${partner.nativeLanguage}`}
                  </Text>

                  <Text style={styles.languageInformation}>
                    {language === 'es'
                      ? `Aprende: ${partner.learningLanguage}`
                      : `Learning: ${partner.learningLanguage}`}
                  </Text>

                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>
                      {partner.level}
                    </Text>
                  </View>
                </View>

                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))
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
  },

  partnerName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  partnerLocation: {
    color: '#94A3B8',
    fontSize: 12,
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
  },

  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
});
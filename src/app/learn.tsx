import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { type AppLanguage } from '../translations';

export default function LearnScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();

  const language: AppLanguage =
    params.lang === 'es' ? 'es' : 'en';

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>
            {language === 'es' ? '‹ Atrás' : '‹ Back'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {language === 'es' ? 'Aprender' : 'Learn'}
        </Text>

        <Text style={styles.subtitle}>
          {language === 'es'
            ? 'Avanza con lecciones breves y práctica diaria.'
            : 'Advance with short lessons and daily practice.'}
        </Text>
<View style={styles.statsRow}>
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>🔥</Text>
    <Text style={styles.statValue}>0</Text>
    <Text style={styles.statLabel}>
      {language === 'es' ? 'Racha' : 'Streak'}
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>⭐</Text>
    <Text style={styles.statValue}>0</Text>
    <Text style={styles.statLabel}>
      {language === 'es' ? 'Puntos' : 'Points'}
    </Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>💙</Text>
    <Text style={styles.statValue}>5</Text>
    <Text style={styles.statLabel}>
      {language === 'es' ? 'Vidas' : 'Lives'}
    </Text>
  </View>
</View>
<View style={styles.dailyProgressCard}>
  <View style={styles.dailyProgressHeader}>
    <View>
      <Text style={styles.dailyProgressTitle}>
        {language === 'es'
          ? 'Meta diaria'
          : 'Daily goal'}
      </Text>

      <Text style={styles.dailyProgressDescription}>
        {language === 'es'
          ? 'Completa una lección hoy'
          : 'Complete one lesson today'}
      </Text>
    </View>

    <Text style={styles.dailyProgressValue}>
      0/1
    </Text>
  </View>

  <View style={styles.dailyProgressBar}>
    <View style={styles.dailyProgressFill} />
  </View>
</View>
        <View style={styles.unitCard}>
  <View style={styles.unitHeader}>
    <View style={styles.unitNumber}>
      <Text style={styles.unitNumberText}>1</Text>
    </View>

    <View style={styles.unitInformation}>
      <Text style={styles.unitTitle}>
        {language === 'es'
          ? 'Unidad 1: Primeros pasos'
          : 'Unit 1: First steps'}
      </Text>

      <Text style={styles.unitDescription}>
        {language === 'es'
          ? 'Aprende saludos y expresiones esenciales.'
          : 'Learn greetings and essential expressions.'}
      </Text>
    </View>
  </View>

  <View style={styles.lessonPath}>
    <TouchableOpacity
  style={styles.activeLesson}
  onPress={() =>
    router.push({
      pathname: '/lesson',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
      <Text style={styles.activeLessonIcon}>⭐</Text>
    </TouchableOpacity>

    <View style={styles.pathLine} />

    <View style={styles.lockedLesson}>
      <Text style={styles.lockedLessonIcon}>🔒</Text>
    </View>

    <View style={styles.pathLine} />

    <View style={styles.lockedLesson}>
      <Text style={styles.lockedLessonIcon}>🔒</Text>
    </View>
  </View>

  <Text style={styles.lessonStatus}>
    {language === 'es'
      ? 'Lección 1 disponible'
      : 'Lesson 1 available'}
  </Text>
</View>
</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B24',
  },

  content: {
    flex: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 18,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 42,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 8,
  },
statsRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 24,
},

statCard: {
  width: '31%',
  minHeight: 104,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1,
  borderColor: '#334C7D',
  borderRadius: 18,
  paddingHorizontal: 8,
  paddingVertical: 14,
},

statIcon: {
  fontSize: 22,
},

statValue: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
  marginTop: 6,
},

statLabel: {
  color: '#A8B3CF',
  fontSize: 11,
  fontWeight: '600',
  textAlign: 'center',
  marginTop: 3,
},
dailyProgressCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  padding: 18,
  marginTop: 18,
},

dailyProgressHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},

dailyProgressTitle: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: 'bold',
},

dailyProgressDescription: {
  color: '#A8B3CF',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 4,
},

dailyProgressValue: {
  color: '#22D3EE',
  fontSize: 18,
  fontWeight: 'bold',
},

dailyProgressBar: {
  width: '100%',
  height: 9,
  backgroundColor: '#263556',
  borderRadius: 9,
  marginTop: 16,
  overflow: 'hidden',
},

dailyProgressFill: {
  width: '0%',
  height: '100%',
  backgroundColor: '#22D3EE',
  borderRadius: 9,
},
unitCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#4F46E5',
  borderRadius: 24,
  padding: 20,
  marginTop: 22,
  marginBottom: 30,
  shadowColor: '#4F46E5',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.22,
  shadowRadius: 16,
  elevation: 7,
},

unitHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},

unitNumber: {
  width: 48,
  height: 48,
  borderRadius: 16,
  backgroundColor: '#4F46E5',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
},

unitNumberText: {
  color: '#FFFFFF',
  fontSize: 20,
  fontWeight: 'bold',
},

unitInformation: {
  flex: 1,
},

unitTitle: {
  color: '#FFFFFF',
  fontSize: 17,
  lineHeight: 23,
  fontWeight: 'bold',
},

unitDescription: {
  color: '#A8B3CF',
  fontSize: 12,
  lineHeight: 18,
  marginTop: 4,
},

lessonPath: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 28,
},

activeLesson: {
  width: 58,
  height: 58,
  borderRadius: 29,
  backgroundColor: '#22D3EE',
  borderWidth: 4,
  borderColor: '#A5F3FC',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.4,
  shadowRadius: 12,
  elevation: 8,
},

activeLessonIcon: {
  fontSize: 24,
},

pathLine: {
  flex: 1,
  maxWidth: 52,
  height: 5,
  backgroundColor: '#334C7D',
},

lockedLesson: {
  width: 52,
  height: 52,
  borderRadius: 26,
  backgroundColor: '#1B2948',
  borderWidth: 2,
  borderColor: '#475569',
  alignItems: 'center',
  justifyContent: 'center',
},

lockedLessonIcon: {
  fontSize: 19,
  opacity: 0.7,
},

lessonStatus: {
  color: '#A7F3D0',
  fontSize: 13,
  fontWeight: '700',
  textAlign: 'center',
  marginTop: 18,
},
  previewCard: {
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    borderRadius: 24,
    paddingHorizontal: 22,
    paddingVertical: 30,
    marginTop: 28,
  },

  previewIcon: {
    fontSize: 40,
  },

  previewTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 14,
  },

  previewText: {
    color: '#A8B3CF',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 8,
  },
});
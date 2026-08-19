import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { translations, type AppLanguage } from '../translations';
export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{ lang?: string }>();
    const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
    const text = translations[language];
    
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
  {text.homeScreen.welcome}
</Text>

<Text style={styles.subtitle}>
  {text.homeScreen.subtitle}
</Text>
          </View>

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>LE</Text>
          </View>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.cardLabel}>
  {text.homeScreen.weeklyGoal}
</Text>
        <Text style={styles.progressTitle}>
  {text.homeScreen.startPracticing}
</Text>

          <Text style={styles.progressDescription}>
  {text.homeScreen.profileDescription}
</Text>

          <View style={styles.progressBar}>
            <View style={styles.progressValue} />
          </View>

          <Text style={styles.progressText}>
  {text.homeScreen.profileProgress}: 20%
</Text>
        </View>

       <Text style={styles.sectionTitle}>
  {text.homeScreen.quickActions}
</Text>
<TouchableOpacity
  style={[styles.actionCard, styles.learnCard]}
  onPress={() =>
  router.push({
    pathname: '/learn',
    params: { lang: language },
  })
}
  activeOpacity={0.85}
>
  <View style={[styles.actionIcon, styles.learnIcon]}>
    <Text style={styles.actionIconText}>📚</Text>
  </View>

  <View style={styles.actionContent}>
    <View style={styles.learnTitleRow}>
      <Text style={styles.actionTitle}>
        {language === 'es' ? 'Aprender' : 'Learn'}
      </Text>

      <View style={styles.newBadge}>
        <Text style={styles.newBadgeText}>
          {language === 'es' ? 'NUEVO' : 'NEW'}
        </Text>
      </View>
    </View>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Lecciones, niveles, puntos y práctica diaria.'
        : 'Lessons, levels, points, and daily practice.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>
        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/language-profile',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
          <View style={styles.actionIcon}>
            <Text style={styles.actionIconText}>🌍</Text>
          </View>

          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>
  {text.homeScreen.completeProfile}
  </Text>
            <Text style={styles.actionDescription}>
  {text.homeScreen.conversationsDescription}
</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/explore',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>

    <View style={styles.actionContent}>
  <Text style={styles.actionTitle}>
    {text.homeScreen.findPartners}
  </Text>

  <Text style={styles.actionDescription}>
  {text.homeScreen.findPartnersDescription}
</Text>
</View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
<TouchableOpacity
  style={styles.actionCard}
  onPress={() =>
    router.push({
      pathname: '/requests',
      params: { lang: language },
    })
  }
  activeOpacity={0.85}
>
  <View style={styles.actionIcon}>
    <Text style={styles.actionIconText}>🔔</Text>
  </View>

  <View style={styles.actionContent}>
    <Text style={styles.actionTitle}>
      {language === 'es'
        ? 'Solicitudes'
        : 'Requests'}
    </Text>

    <Text style={styles.actionDescription}>
      {language === 'es'
        ? 'Revisa y responde tus solicitudes de conexión.'
        : 'Review and respond to your connection requests.'}
    </Text>
  </View>

  <Text style={styles.arrow}>›</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.actionCard}>

          <View style={styles.actionContent}>
           <Text style={styles.actionTitle}>
  {text.homeScreen.conversations}
</Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.tipCard}>
          <Text style={styles.tipLabel}>
  {text.homeScreen.tipLabel}
</Text>
          <Text style={styles.tipText}>
  {text.homeScreen.tipText}
</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#050B24',
},
  content: {
  width: '100%',
  maxWidth: 520,
  alignSelf: 'center',
  paddingHorizontal: 22,
  paddingTop: 58,
  paddingBottom: 40,
},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  greeting: {
  color: '#FFFFFF',
  fontSize: 26,
  lineHeight: 33,
  fontWeight: 'bold',
  letterSpacing: -0.3,
},
  subtitle: {
  color: '#A8B3CF',
  fontSize: 14,
  lineHeight: 21,
  marginTop: 6,
},
 avatar: {
  width: 52,
  height: 52,
  borderRadius: 18,
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#22D3EE',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 7,
},
  avatarText: {
  color: '#22D3EE',
  fontSize: 17,
  fontWeight: 'bold',
  letterSpacing: 0.5,
},
  progressCard: {
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 24,
  padding: 22,
  marginBottom: 32,
  shadowColor: '#4F46E5',
  shadowOffset: {
    width: 0,
    height: 8,
  },
  shadowOpacity: 0.22,
  shadowRadius: 16,
  elevation: 7,
},
  cardLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },
  progressDescription: {
    color: '#94A3B8',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 8,
    marginTop: 22,
    overflow: 'hidden',
  },
  progressValue: {
  width: '20%',
  height: '100%',
  backgroundColor: '#22D3EE',
  borderRadius: 8,
},
  progressText: {
  color: '#A8B3CF',
  fontSize: 12,
  fontWeight: '600',
  marginTop: 10,
},
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  learnCard: {
  borderColor: '#4F46E5',
  backgroundColor: '#141A3D',
  shadowColor: '#4F46E5',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.25,
  shadowRadius: 12,
  elevation: 6,
},

learnIcon: {
  backgroundColor: '#252052',
  borderWidth: 1,
  borderColor: '#8B5CF6',
},

learnTitleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'wrap',
},

newBadge: {
  backgroundColor: '#22D3EE',
  borderRadius: 9,
  paddingHorizontal: 8,
  paddingVertical: 3,
  marginLeft: 8,
},

newBadgeText: {
  color: '#050B24',
  fontSize: 9,
  fontWeight: 'bold',
  letterSpacing: 0.6,
},
  actionCard: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 20,
  padding: 16,
  marginBottom: 14,
},
  actionIcon: {
  width: 50,
  height: 50,
  borderRadius: 16,
  backgroundColor: '#19284A',
  borderWidth: 1,
  borderColor: '#334C7D',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
},
  actionIconText: {
    fontSize: 23,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionDescription: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  arrow: {
    color: '#64748B',
    fontSize: 28,
    marginLeft: 8,
  },
  tipCard: {
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 18,
    padding: 18,
    marginTop: 14,
  },
  tipLabel: {
    color: '#A7F3D0',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tipText: {
    color: '#D1FAE5',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});
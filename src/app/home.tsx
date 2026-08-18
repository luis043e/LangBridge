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
    backgroundColor: '#0F172A',
  },
  content: {
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
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressCard: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 22,
    padding: 22,
    marginBottom: 32,
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
    backgroundColor: '#6366F1',
    borderRadius: 8,
  },
  progressText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: '#293548',
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
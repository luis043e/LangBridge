import { StatusBar } from 'expo-status-bar';

import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LanguageProfileScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>STEP 1 OF 3</Text>

        <Text style={styles.title}>Build your language profile</Text>

        <Text style={styles.subtitle}>
          Tell us about the languages you speak and want to learn.
        </Text>

        <Text style={styles.label}>What is your native language?</Text>

        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>Select your native language</Text>
          <Text style={styles.arrow}>⌄</Text>
        </TouchableOpacity>

        <Text style={styles.label}>What language do you want to learn?</Text>

        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>Select a learning language</Text>
          <Text style={styles.arrow}>⌄</Text>
        </TouchableOpacity>

        <Text style={styles.label}>What is your current level?</Text>

        <View style={styles.levelContainer}>
          <TouchableOpacity style={styles.levelButton}>
            <Text style={styles.levelTitle}>Beginner</Text>
            <Text style={styles.levelCode}>A1 - A2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.levelButton}>
            <Text style={styles.levelTitle}>Intermediate</Text>
            <Text style={styles.levelCode}>B1 - B2</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.levelButton}>
            <Text style={styles.levelTitle}>Advanced</Text>
            <Text style={styles.levelCode}>C1 - C2</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Why do we need this?</Text>

          <Text style={styles.infoText}>
            LangBridge uses your languages and level to recommend compatible
            partners who can help you reach your goals.
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 38,
  },
  step: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
    marginTop: 12,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 34,
  },
  label: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  selector: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  selectorText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  arrow: {
    color: '#A7F3D0',
    fontSize: 22,
  },
  levelContainer: {
    gap: 12,
    marginBottom: 26,
  },
  levelButton: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  levelTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  levelCode: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
    marginBottom: 28,
  },
  infoTitle: {
    color: '#A7F3D0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#D1FAE5',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

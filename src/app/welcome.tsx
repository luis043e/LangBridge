import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { translations, type AppLanguage } from '../translations';
export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ lang?: string }>();
  const language: AppLanguage = params.lang === 'es' ? 'es' : 'en';
  const text = translations[language];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

<TouchableOpacity
  style={styles.languageButton}
  onPress={() => router.replace('./choose-language')}
>
  <Text style={styles.languageButtonText}>
    {language === 'es' ? 'Idioma' : 'Language'}
  </Text>
</TouchableOpacity>
      <View style={styles.logo}>
        <Text style={styles.logoText}>LB</Text>
      </View>

      <Text style={styles.title}>LangBridge</Text>

      <Text style={styles.slogan}>
  {text.welcome.slogan}
</Text>

      <Text style={styles.description}>
  {text.welcome.description}
</Text>

      <TouchableOpacity
  style={styles.primaryButton}
  onPress={() => {
  console.log('GET STARTED PRESSED');
  router.push({
  pathname: './register',
  params: { lang: language },
});
}}
>
        <Text style={styles.primaryButtonText}>
  {text.welcome.getStarted}
</Text>
      </TouchableOpacity>

      <TouchableOpacity
  style={styles.secondaryButton}
  onPress={() =>
  router.push({
    pathname: './login',
    params: { lang: language },
  })
}
>
  <Text style={styles.secondaryButtonText}>
  {text.welcome.login}
</Text>
</TouchableOpacity>

      <Text style={styles.footer}>
  {text.welcome.footer}
</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  languageButton: {
  position: 'absolute',
  top: 54,
  right: 24,
  paddingHorizontal: 14,
  paddingVertical: 9,
  borderRadius: 14,
  backgroundColor: '#1E293B',
  borderWidth: 1,
  borderColor: '#475569',
  zIndex: 10,
},
languageButtonText: {
  color: '#A7F3D0',
  fontSize: 14,
  fontWeight: '600',
},
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 30,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 10,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  slogan: {
    color: '#A7F3D0',
    fontSize: 19,
    fontWeight: '600',
    marginTop: 8,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 38,
    maxWidth: 340,
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
  secondaryButton: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#475569',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    color: '#64748B',
    fontSize: 12,
  },
});
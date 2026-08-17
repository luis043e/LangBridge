import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { translations } from '../translations';

export default function ChooseLanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'es'>('en');
  const text = translations[selectedLanguage];
  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.logo}>
        <Text style={styles.logoText}>LB</Text>
      </View>

      <Text style={styles.title}>Choose your language</Text>

      <Text style={styles.subtitle}>
  {text.chooseLanguage.subtitle}
</Text>

      <TouchableOpacity
        style={[
          styles.languageCard,
          selectedLanguage === 'en' && styles.selectedCard,
        ]}
        onPress={() => setSelectedLanguage('en')}
      >
        <View>
          <Text style={styles.languageName}>
  {text.chooseLanguage.english}
</Text>
  <Text style={styles.languageDescription}>
  {text.chooseLanguage.spanishDescription}
</Text>
        </View>

        <View
          style={[
            styles.radio,
            selectedLanguage === 'en' && styles.selectedRadio,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.languageCard,
          selectedLanguage === 'es' && styles.selectedCard,
        ]}
        onPress={() => setSelectedLanguage('es')}
      >
        <View>
          <Text style={styles.languageName}>Español</Text>
          <Text style={styles.languageName}>
  {text.chooseLanguage.spanish}
</Text>
        </View>

        <View
          style={[
            styles.radio,
            selectedLanguage === 'es' && styles.selectedRadio,
          ]}
        />
      </TouchableOpacity>

      <Text style={styles.note}>
  {text.chooseLanguage.note}
</Text>

      <TouchableOpacity
  style={styles.primaryButton}
  onPress={() =>
  router.replace({
    pathname: './welcome',
    params: { lang: selectedLanguage },
  })
}
>

        <Text style={styles.primaryButtonText}>
  {text.chooseLanguage.continue}
</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingHorizontal: 26,
    paddingTop: 82,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 34,
  },
  languageCard: {
    width: '100%',
    minHeight: 86,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 16,
    marginBottom: 14,
  },
  selectedCard: {
    borderColor: '#6366F1',
    backgroundColor: '#242E4D',
  },
  languageName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  languageDescription: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 6,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#64748B',
  },
  selectedRadio: {
    borderWidth: 6,
    borderColor: '#A7F3D0',
    backgroundColor: '#6366F1',
  },
  note: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: 18,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#6366F1',
    paddingVertical: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
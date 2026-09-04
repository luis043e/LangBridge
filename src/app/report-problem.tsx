import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { useState } from 'react';
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
import { useLanguage } from '../contexts/language-context';

import { auth, db } from '../firebaseConfig';
import { translations } from '../translations';

type ReportCategory =
  | 'technical'
  | 'account'
  | 'user'
  | 'privacy'
  | 'other';

const reportCategories: {
  id: ReportCategory;
  labelKey:
    | 'technical'
    | 'account'
    | 'user'
    | 'privacy'
    | 'other';
  icon: string;
}[] = [
  {
    id: 'technical',
    labelKey: 'technical',
    icon: '🛠️',
  },
  {
    id: 'account',
    labelKey: 'account',
    icon: '👤',
  },
  {
    id: 'user',
    labelKey: 'user',
    icon: '⚠️',
  },
  {
    id: 'privacy',
    labelKey: 'privacy',
    icon: '🔒',
  },
  {
    id: 'other',
    labelKey: 'other',
    icon: '📝',
  },
];

export default function ReportProblemScreen() {
  const router = useRouter();

const { language } = useLanguage();

const text = translations[language];
    
  const [selectedCategory, setSelectedCategory] =
    useState<ReportCategory | null>(null);

  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReport = async () => {
    const currentUser = auth.currentUser;
    const cleanDescription = description.trim();

    if (!currentUser) {
      Alert.alert(
  text.reportProblemScreen.sessionUnavailableTitle,
  text.reportProblemScreen.sessionUnavailableMessage
);
      return;
    }

    if (!selectedCategory) {
      Alert.alert(
  text.reportProblemScreen.selectCategoryTitle,
  text.reportProblemScreen.selectCategoryMessage
);
      return;
    }

    if (cleanDescription.length < 10) {
      Alert.alert(
  text.reportProblemScreen.addMoreInformationTitle,
  text.reportProblemScreen.addMoreInformationMessage
);
      return;
    }

    try {
      setIsSubmitting(true);

      await addDoc(collection(db, 'reports'), {
        reporterId: currentUser.uid,
        reporterEmail: currentUser.email || '',
        category: selectedCategory,
        description: cleanDescription,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      Alert.alert(
  text.reportProblemScreen.reportSubmittedTitle,
  text.reportProblemScreen.reportSubmittedMessage,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error) {
      console.error('Error submitting report:', error);

      Alert.alert(
  text.reportProblemScreen.submitErrorTitle,
  text.reportProblemScreen.connectionError
);
    } finally {
      setIsSubmitting(false);
    }
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
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.backButtonText}>
              {text.reportProblemScreen.back}
            </Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>
                ⚠️
              </Text>
            </View>

            <View style={styles.headerInformation}>
              <Text style={styles.title}>
                {text.reportProblemScreen.title}
              </Text>

              <Text style={styles.subtitle}>
                {text.reportProblemScreen.subtitle}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionLabel}>
            {text.reportProblemScreen.problemType}
          </Text>

          <View style={styles.categoriesContainer}>
            {reportCategories.map((category) => {
              const isSelected =
                selectedCategory === category.id;

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    isSelected &&
                      styles.selectedCategoryButton,
                  ]}
                  onPress={() =>
                    setSelectedCategory(category.id)
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryIcon}>
                    {category.icon}
                  </Text>

                  <Text
                    style={[
                      styles.categoryText,
                      isSelected &&
                        styles.selectedCategoryText,
                    ]}
                  >
                    {text.reportProblemScreen.categories[
  category.labelKey
]}
                  </Text>

                  {isSelected && (
                    <Text style={styles.checkMark}>
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>
            {text.reportProblemScreen.describeProblem}
          </Text>

          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder={
  text.reportProblemScreen.descriptionPlaceholder
}
            placeholderTextColor="#64748B"
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />

          <Text style={styles.characterCounter}>
            {description.length}/1000
          </Text>

          <View style={styles.informationCard}>
            <Text style={styles.informationIcon}>
              🛡️
            </Text>

            <Text style={styles.informationText}>
              {text.reportProblemScreen.privateReportNotice}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting &&
                styles.disabledSubmitButton,
            ]}
            onPress={handleSubmitReport}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting
  ? text.reportProblemScreen.submitting
  : text.reportProblemScreen.submitReport}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}  
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050B24',
  },

  container: {
    flex: 1,
    backgroundColor: '#050B24',
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
    marginBottom: 16,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
  },

  headerIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4A2146',
    borderWidth: 1.5,
    borderColor: '#F472B6',
    marginRight: 15,
  },

  headerIconText: {
    fontSize: 28,
  },

  headerInformation: {
    flex: 1,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 26,
    lineHeight: 33,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 6,
  },

  sectionLabel: {
    color: '#E8EEFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  categoriesContainer: {
    marginBottom: 24,
  },

  categoryButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
  },

  selectedCategoryButton: {
    backgroundColor: '#25356B',
    borderColor: '#22D3EE',
  },

  categoryIcon: {
    fontSize: 22,
    marginRight: 12,
  },

  categoryText: {
    flex: 1,
    color: '#D7E0F5',
    fontSize: 14,
    fontWeight: '600',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  checkMark: {
    color: '#22D3EE',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  descriptionInput: {
    width: '100%',
    minHeight: 170,
    backgroundColor: '#0B1430',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 18,
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 15,
  },

  characterCounter: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
    marginTop: 7,
  },

  informationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#132E2A',
    borderWidth: 1,
    borderColor: '#1E5E51',
    borderRadius: 16,
    padding: 15,
    marginTop: 18,
  },

  informationIcon: {
    fontSize: 22,
    marginRight: 11,
  },

  informationText: {
    flex: 1,
    color: '#D1FAE5',
    fontSize: 12,
    lineHeight: 18,
  },

  submitButton: {
    width: '100%',
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22D3EE',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 22,
  },

  disabledSubmitButton: {
    opacity: 0.55,
  },

  submitButtonText: {
    color: '#050B24',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
  
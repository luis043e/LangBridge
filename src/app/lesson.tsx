import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useLanguage } from '../contexts/language-context';
import { translations } from '../translations';

export default function LessonScreen() {
  const router = useRouter();
const { language } = useLanguage();

const text = translations[language];
    
    const [selectedAnswer, setSelectedAnswer] =
  useState<string | null>(null);

  const [isChecked, setIsChecked] = useState(false);

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={false}
>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={goBack}
            activeOpacity={0.8}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>

          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.livesContainer}>
            <Text style={styles.livesIcon}>💙</Text>
            <Text style={styles.livesValue}>5</Text>
          </View>
        </View>

        <Text style={styles.exerciseNumber}>
          {text.lessonScreen.exerciseProgress}
        </Text>

        <Text style={styles.title}>
          {text.lessonScreen.title}
        </Text>

        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>
            {text.lessonScreen.question}
          </Text>
        </View>

        <View style={styles.answersContainer}>
  {['Hello', 'Goodbye', 'Thanks'].map((answer) => {
    const isSelected = selectedAnswer === answer;

    return (
      <TouchableOpacity
        key={answer}
        style={[
          styles.answerButton,
          isSelected && styles.selectedAnswerButton,
        ]}
        onPress={() => setSelectedAnswer(answer)}
        activeOpacity={0.85}
      >
        <View
          style={[
            styles.answerIndicator,
            isSelected && styles.selectedAnswerIndicator,
          ]}
        >
          {isSelected && (
            <View style={styles.answerIndicatorCenter} />
          )}
        </View>

        <Text
          style={[
            styles.answerText,
            isSelected && styles.selectedAnswerText,
          ]}
        >
          {answer}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>
<TouchableOpacity
  style={[
    styles.checkButton,
    !selectedAnswer && styles.disabledCheckButton,
  ]}
  onPress={() => setIsChecked(true)}
  activeOpacity={0.85}
  disabled={!selectedAnswer}
>
  <Text style={styles.checkButtonText}>
    {isChecked
  ? text.lessonScreen.answerChecked
  : text.lessonScreen.check}
  </Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050B24',
  },

  content: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 32,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111C3A',
    borderWidth: 1,
    borderColor: '#334C7D',
  },

  closeButtonText: {
    color: '#A8B3CF',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '600',
  },

  progressBar: {
    flex: 1,
    height: 10,
    backgroundColor: '#263556',
    borderRadius: 10,
    marginHorizontal: 14,
    overflow: 'hidden',
  },

  progressFill: {
    width: '33%',
    height: '100%',
    backgroundColor: '#22D3EE',
    borderRadius: 10,
  },

  livesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  livesIcon: {
    fontSize: 20,
  },

  livesValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },

  exerciseNumber: {
    color: '#A7F3D0',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 34,
  },

  title: {
    color: '#FFFFFF',
    fontSize: 28,
    lineHeight: 36,
    fontWeight: 'bold',
    marginTop: 10,
  },

  questionCard: {
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#4F46E5',
    borderRadius: 22,
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginTop: 28,
  },

  questionLabel: {
    color: '#FFFFFF',
    fontSize: 19,
    lineHeight: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  answersContainer: {
  marginTop: 22,
},

answerButton: {
  width: '100%',
  minHeight: 64,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 18,
  paddingHorizontal: 18,
  paddingVertical: 14,
  marginBottom: 14,
},

selectedAnswerButton: {
  backgroundColor: '#132E3D',
  borderColor: '#22D3EE',
},

answerIndicator: {
  width: 24,
  height: 24,
  borderRadius: 12,
  borderWidth: 2,
  borderColor: '#64748B',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 14,
},

selectedAnswerIndicator: {
  borderColor: '#22D3EE',
},

answerIndicatorCenter: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#22D3EE',
},

answerText: {
  color: '#E8EEFF',
  fontSize: 16,
  fontWeight: '600',
},

selectedAnswerText: {
  color: '#A5F3FC',
  fontWeight: 'bold',
},
checkButton: {
  width: '100%',
  minHeight: 56,
  backgroundColor: '#22D3EE',
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  marginTop: 10,
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 6,
  },
  shadowOpacity: 0.3,
  shadowRadius: 12,
  elevation: 7,
},

disabledCheckButton: {
  backgroundColor: '#263556',
  shadowOpacity: 0,
  elevation: 0,
},

checkButtonText: {
  color: '#050B24',
  fontSize: 17,
  fontWeight: 'bold',
},
});
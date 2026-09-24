import {
    useRouter,
} from 'expo-router';
import {
    StatusBar,
} from 'expo-status-bar';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    useLanguage,
} from '../contexts/language-context';

export default function CancelAccountDeletionScreen() {
  const router =
    useRouter();

  const {
    language,
  } =
    useLanguage();

  return (
    <SafeAreaView
      style={
        styles.safeArea
      }
    >
      <StatusBar
        style="light"
      />

      <ScrollView
        contentContainerStyle={
          styles.content
        }
        showsVerticalScrollIndicator={
          false
        }
      >
        <TouchableOpacity
          style={
            styles.backButton
          }
          onPress={() =>
            router.back()
          }
          activeOpacity={
            0.8
          }
        >
          <Text
            style={
              styles.backButtonText
            }
          >
            ‹ Back
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.header
          }
        >
          <Text
            style={
              styles.icon
            }
          >
            ↩️
          </Text>

          <Text
            style={
              styles.title
            }
          >
            Cancel deletion request
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            Review and securely cancel your pending account deletion request.
          </Text>
        </View>

        <View
          style={
            styles.card
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            Request detected
          </Text>

          <Text
            style={
              styles.cardText
            }
          >
            The cancellation controls will be connected in the next validated step.
          </Text>

          <Text
            style={
              styles.languageNote
            }
          >
            Language: {language}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles =
  StyleSheet.create({
    safeArea: {
      flex:
        1,
      backgroundColor:
        '#050B24',
    },

    content: {
      width:
        '100%',
      maxWidth:
        520,
      alignSelf:
        'center',
      paddingHorizontal:
        22,
      paddingTop:
        16,
      paddingBottom:
        40,
    },

    backButton: {
      alignSelf:
        'flex-start',
      paddingVertical:
        10,
      paddingRight:
        18,
      marginBottom:
        16,
    },

    backButtonText: {
      color:
        '#22D3EE',
      fontSize:
        16,
      fontWeight:
        '700',
    },

    header: {
      backgroundColor:
        '#0C1738',
      borderColor:
        '#26365F',
      borderWidth:
        1,
      borderRadius:
        22,
      padding:
        22,
      alignItems:
        'center',
      marginBottom:
        18,
    },

    icon: {
      fontSize:
        34,
      marginBottom:
        12,
    },

    title: {
      color:
        '#FFFFFF',
      fontSize:
        25,
      lineHeight:
        32,
      fontWeight:
        '800',
      textAlign:
        'center',
    },

    subtitle: {
      color:
        '#A8B3CF',
      fontSize:
        14,
      lineHeight:
        21,
      textAlign:
        'center',
      marginTop:
        9,
    },

    card: {
      backgroundColor:
        '#111C3A',
      borderColor:
        '#334C7D',
      borderWidth:
        1.5,
      borderRadius:
        18,
      padding:
        18,
    },

    cardTitle: {
      color:
        '#FFFFFF',
      fontSize:
        17,
      fontWeight:
        '800',
    },

    cardText: {
      color:
        '#CBD5E1',
      fontSize:
        14,
      lineHeight:
        21,
      marginTop:
        9,
    },

    languageNote: {
      color:
        '#94A3B8',
      fontSize:
        12,
      marginTop:
        16,
    },
  });
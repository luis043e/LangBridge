import {
  useRouter,
} from 'expo-router';
import {
  StatusBar,
} from 'expo-status-bar';
import {
  useEffect,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  useLanguage,
} from '../contexts/language-context';
import {
  reauthenticateWithGoogle,
} from '../googleAuth';
import {
  classifyAccountDeletionError,
} from '../services/account-deletion-error';
import {
  cancelAccountDeletionRequest,
  readAccountDeletionRequestState,
  type AccountDeletionRequestPublicState,
} from '../services/account-deletion-functions';
import {
  getAccountDeletionReauthenticationProvider,
  reauthenticateWithPassword,
  type AccountDeletionReauthenticationProvider,
} from '../services/account-deletion-reauthentication';
import {
  accountDeletionCancellationNavigationText,
  accountDeletionCancellationScreenText,
} from '../translations/account-deletion-cancellation';
type CancellationScreenRequestState =
  | 'checking'
  | 'unavailable'
  | AccountDeletionRequestPublicState;
type CancellationScreenProviderState =
  | 'idle'
  | 'checking'
  | 'unavailable'
  | AccountDeletionReauthenticationProvider;
export default function CancelAccountDeletionScreen() {
  const router =
    useRouter();

  const {
    language,
  } =
    useLanguage();
  const text =
    accountDeletionCancellationScreenText[
      language
    ];

  const navigationText =
    accountDeletionCancellationNavigationText[
      language
    ];

  const [
    requestState,
    setRequestState,
  ] =
    useState<CancellationScreenRequestState>(
      'checking'
    );
  const [
    providerState,
    setProviderState,
  ] =
    useState<CancellationScreenProviderState>(
      'idle'
    );
  const [password, setPassword] =
    useState('');

  const [
    isReauthenticating,
    setIsReauthenticating,
  ] =
    useState(false);
    const [
    isCancelling,
    setIsCancelling,
  ] =
    useState(false);
  useEffect(() => {
    let isMounted =
      true;

    const loadRequestState =
      async () => {
        try {
          const result =
            await readAccountDeletionRequestState();

          if (isMounted) {
            setRequestState(
              result.status
            );
          }
        } catch {
          if (isMounted) {
            setRequestState(
              'unavailable'
            );
          }
        }
      };

    loadRequestState();

    return () => {
      isMounted =
        false;
    };
  }, []);
  useEffect(() => {
    if (
      requestState !==
      'cancellable'
    ) {
      setProviderState(
        'idle'
      );
      return;
    }

    setProviderState(
      'checking'
    );

    try {
      const provider =
        getAccountDeletionReauthenticationProvider();

      setProviderState(
        provider
      );
    } catch {
      setProviderState(
        'unavailable'
      );
    }
  }, [requestState]);
    const executeCancellation =
    async () => {
      try {
        setIsCancelling(
          true
        );

        const result =
          await cancelAccountDeletionRequest();

        if (
          result.status ===
          'not-cancellable'
        ) {
          Alert.alert(
            text.notCancellableTitle,
            text.notCancellableMessage
          );
          return;
        }

        Alert.alert(
          text.completedTitle,
          text.completedMessage,
          [
            {
              text:
                text.returnToPrivacy,
              onPress: () =>
                router.replace({
                  pathname:
                    '/privacy-security',
                  params: {
                    lang:
                      language,
                  },
                }),
            },
          ]
        );
      } catch (error) {
        const category =
          classifyAccountDeletionError(
            error
          );

        if (
          category ===
          'unauthenticated'
        ) {
          Alert.alert(
            text.unauthenticatedTitle,
            text.unauthenticatedMessage
          );
        } else if (
          category ===
          'recent-authentication-required'
        ) {
          Alert.alert(
            text.recentAuthenticationTitle,
            text.recentAuthenticationMessage
          );
        } else if (
          category ===
          'temporarily-unavailable'
        ) {
          Alert.alert(
            text.temporarilyUnavailableTitle,
            text.temporarilyUnavailableMessage
          );
        } else {
          Alert.alert(
            text.internalErrorTitle,
            text.internalErrorMessage
          );
        }
      } finally {
        setIsCancelling(
          false
        );
      }
    };
  const handlePasswordReauthentication =
    async () => {
      if (!password) {
        Alert.alert(
          text.passwordRequiredTitle,
          text.passwordRequiredMessage
        );
        return;
      }

      try {
        setIsReauthenticating(
          true
        );

        await reauthenticateWithPassword(
          password
        );

        Alert.alert(
          text.confirmationTitle,
          text.confirmationMessage
        );
      } catch (error) {
        const category =
          classifyAccountDeletionError(
            error
          );

        if (
          category ===
          'invalid-credential'
        ) {
          Alert.alert(
            text.invalidCredentialTitle,
            text.invalidCredentialMessage
          );
        } else if (
          category ===
          'unauthenticated'
        ) {
          Alert.alert(
            text.unauthenticatedTitle,
            text.unauthenticatedMessage
          );
        } else if (
          category ===
          'temporarily-unavailable'
        ) {
          Alert.alert(
            text.temporarilyUnavailableTitle,
            text.temporarilyUnavailableMessage
          );
        } else if (
          category ===
          'recent-authentication-required'
        ) {
          Alert.alert(
            text.recentAuthenticationTitle,
            text.recentAuthenticationMessage
          );
        } else {
          Alert.alert(
            text.internalErrorTitle,
            text.internalErrorMessage
          );
        }
      } finally {
        setPassword(
          ''
        );

        setIsReauthenticating(
          false
        );
      }
    };

  const handleGoogleReauthentication =
    async () => {
      try {
        setIsReauthenticating(
          true
        );

        const wasReauthenticated =
          await reauthenticateWithGoogle(
            language
          );

        if (!wasReauthenticated) {
          return;
        }

        Alert.alert(
          text.confirmationTitle,
          text.confirmationMessage
        );
      } catch (error) {
        const category =
          classifyAccountDeletionError(
            error
          );

        if (
          category ===
          'unauthenticated'
        ) {
          Alert.alert(
            text.unauthenticatedTitle,
            text.unauthenticatedMessage
          );
        } else if (
          category ===
          'temporarily-unavailable'
        ) {
          Alert.alert(
            text.temporarilyUnavailableTitle,
            text.temporarilyUnavailableMessage
          );
        } else if (
          category ===
          'recent-authentication-required'
        ) {
          Alert.alert(
            text.recentAuthenticationTitle,
            text.recentAuthenticationMessage
          );
        } else {
          Alert.alert(
            text.internalErrorTitle,
            text.internalErrorMessage
          );
        }
      } finally {
        setIsReauthenticating(
          false
        );
      }
    };

  let cardTitle =
    text.requestDetectedTitle;

  let cardMessage =
    text.requestDetectedMessage;

  if (
    requestState ===
    'checking'
  ) {
    cardTitle =
      text.checkingTitle;
    cardMessage =
      text.checkingMessage;
  } else if (
    requestState ===
    'point-of-no-return-reached'
  ) {
    cardTitle =
      navigationText.pointOfNoReturnTitle;
    cardMessage =
      navigationText.pointOfNoReturnMessage;
  } else if (
    requestState ===
      'request-not-found' ||
    requestState ===
      'not-cancellable'
  ) {
    cardTitle =
      text.notCancellableTitle;
    cardMessage =
      text.notCancellableMessage;
  } else if (
    requestState ===
    'inconsistent-state'
  ) {
    cardTitle =
      text.internalErrorTitle;
    cardMessage =
      text.internalErrorMessage;
  } else if (
    requestState ===
    'unavailable'
  ) {
    cardTitle =
      text.temporarilyUnavailableTitle;
    cardMessage =
      text.temporarilyUnavailableMessage;
  }

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
            {'<'} {text.back}
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
            {'<'}
          </Text>

          <Text
            style={
              styles.title
            }
          >
            {text.title}
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            {text.subtitle}
          </Text>
        </View>

        <View
          style={
            styles.card
          }
        >
          {requestState ===
            'checking' && (
            <ActivityIndicator
              color="#22D3EE"
              size="large"
              style={
                styles.activityIndicator
              }
            />
          )}
          <Text
            style={
              styles.cardTitle
            }
          >
            {cardTitle}
          </Text>

          <Text
            style={
              styles.cardText
            }
          >
            {cardMessage}
          </Text>
          {requestState ===
            'cancellable' &&
            providerState ===
              'checking' && (
            <ActivityIndicator
              color="#22D3EE"
              size="small"
              style={
                styles.providerIndicator
              }
            />
          )}
          {requestState ===
            'cancellable' &&
            providerState ===
              'unsupported' && (
            <View
              style={
                styles.notice
              }
            >
              <Text
                style={
                  styles.noticeTitle
                }
              >
                {
                  text.unsupportedProviderTitle
                }
              </Text>

              <Text
                style={
                  styles.noticeMessage
                }
              >
                {
                  text.unsupportedProviderMessage
                }
              </Text>
            </View>
          )}
          {requestState ===
            'cancellable' &&
            providerState ===
              'unavailable' && (
            <View
              style={
                styles.notice
              }
            >
              <Text
                style={
                  styles.noticeTitle
                }
              >
                {text.unauthenticatedTitle}
              </Text>

              <Text
                style={
                  styles.noticeMessage
                }
              >
                {text.unauthenticatedMessage}
              </Text>
            </View>
          )}
          {requestState ===
            'cancellable' &&
            providerState ===
              'password' && (
            <View style={styles.passwordSection}>
              <Text style={styles.inputLabel}>
                {text.passwordLabel}
              </Text>

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder={text.passwordPlaceholder}
                placeholderTextColor="#718096"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.passwordInput}
                editable={
                  !isReauthenticating
                }
              />
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.8}
                onPress={
                  handlePasswordReauthentication
                }
                disabled={
                  isReauthenticating
                }
              >
                <Text style={styles.primaryButtonText}>
                  {text.passwordAction}
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {requestState ===
            'cancellable' &&
            providerState ===
              'google' && (
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={
                handleGoogleReauthentication
              }
              disabled={
                isReauthenticating
              }
            >
              <Text style={styles.primaryButtonText}>
                {text.googleAction}
              </Text>
            </TouchableOpacity>
          )}
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
    notice: {
      backgroundColor:
        '#091330',
      borderColor:
        '#475569',
      borderWidth:
        1,
      borderRadius:
        12,
      marginTop:
        18,
      padding:
        14,
    },

    noticeTitle: {
      color:
        '#FFFFFF',
      fontSize:
        15,
      fontWeight:
        '800',
    },

    noticeMessage: {
      color:
        '#CBD5E1',
      fontSize:
        14,
      lineHeight:
        20,
      marginTop:
        7,
    },
    activityIndicator: {
      marginBottom:
        16,
    },
    providerIndicator: {
      marginTop:
        18,
    },
    passwordSection: {
      marginTop:
        20,
    },

    inputLabel: {
      color:
        '#E2E8F0',
      fontSize:
        14,
      fontWeight:
        '700',
      marginBottom:
        8,
    },

    passwordInput: {
      backgroundColor:
        '#091330',
      borderColor:
        '#334C7D',
      borderWidth:
        1.5,
      borderRadius:
        12,
      color:
        '#FFFFFF',
      fontSize:
        16,
      paddingHorizontal:
        14,
      paddingVertical:
        13,
    },

    primaryButton: {
      backgroundColor:
        '#0891B2',
      borderRadius:
        12,
      alignItems:
        'center',
      justifyContent:
        'center',
      marginTop:
        18,
      paddingHorizontal:
        18,
      paddingVertical:
        14,
    },

    primaryButtonText: {
      color:
        '#FFFFFF',
      fontSize:
        15,
      fontWeight:
        '800',
      textAlign:
        'center',
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
  });

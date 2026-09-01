import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { updateProfile } from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import {
  getCountryName,
  getCountryOptions,
} from '../countries';
import { auth, db } from '../firebaseConfig';
import {
  translations,
  type AppLanguage,
} from '../translations';

export default function EditProfileScreen() {
  const router = useRouter();

  const params = useLocalSearchParams<{
    lang?: string;
  }>();

  const language: AppLanguage =
  params.lang === 'es' ? 'es' : 'en';

const text = translations[language];

const currentUser = auth.currentUser;

  const [fullName, setFullName] = useState(
    currentUser?.displayName || ''
  );

  const [countryCode, setCountryCode] =
  useState('');

const [countrySearch, setCountrySearch] =
  useState('');

const [isCountryListOpen, setIsCountryListOpen] =
  useState(false);

  const [bio, setBio] = useState('');
  const [photoURL, setPhotoURL] = useState(
  currentUser?.photoURL || ''
);

const [googlePhotoURL, setGooglePhotoURL] = useState(
  currentUser?.photoURL || ''
);
  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const countryOptions =
  getCountryOptions(language);

const selectedCountry =
  countryOptions.find(
    (country) => country.code === countryCode
  );

const filteredCountries =
  countryOptions.filter((country) =>
    country.name
      .toLowerCase()
      .includes(
        countrySearch.trim().toLowerCase()
      )
  );
  useEffect(() => {
  const loadProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const profileReference = doc(
        db,
        'users',
        user.uid
      );

      const profileSnapshot = await getDoc(
        profileReference
      );

      if (profileSnapshot.exists()) {
        const profileData =
          profileSnapshot.data();

        setFullName(
          profileData.fullName ||
          user.displayName ||
          ''
        );

        setCountryCode(
  typeof profileData.countryCode === 'string'
    ? profileData.countryCode.toUpperCase()
    : ''
);
        setBio(profileData.bio || '');

        setPhotoURL(
  profileData.photoURL ||
    user.photoURL ||
    ''
);

setGooglePhotoURL(
  profileData.googlePhotoURL ||
    user.photoURL ||
    profileData.photoURL ||
    ''
);
      }
    } catch (error) {
      console.error(
        'Error loading profile:',
        error
      );
    } finally {
      setIsLoading(false);
    }

  };

  loadProfile();
}, []);
const handleUseGooglePhoto = () => {
  if (!googlePhotoURL) {
  Alert.alert(
    text.editProfileScreen.photoUnavailableTitle,
    text.editProfileScreen.photoUnavailableMessage
  );
  return;
}

  setPhotoURL(googlePhotoURL);
};

const handleRemovePhoto = () => {
  Alert.alert(
    text.editProfileScreen.removePhotoTitle,
    text.editProfileScreen.removePhotoMessage,
    [
      {
        text: text.editProfileScreen.cancel,
        style: 'cancel',
      },
      {
        text: text.editProfileScreen.remove,
        style: 'destructive',
        onPress: () => setPhotoURL(''),
      },
    ]
  );
};
const handleSaveProfile = async () => {
  if (isSaving) {
    return;
  }

  const user = auth.currentUser;
  const cleanName = fullName.trim();
  const cleanBio = bio.trim();

  if (!user) {
  Alert.alert(
    text.editProfileScreen.loginRequiredTitle,
    text.editProfileScreen.loginRequiredMessage
  );
  return;
}

  if (!cleanName) {
  Alert.alert(
    text.editProfileScreen.nameRequiredTitle,
    text.editProfileScreen.nameRequiredMessage
  );
  return;
}
if (!countryCode) {
  Alert.alert(
    text.editProfileScreen.countryRequiredTitle,
    text.editProfileScreen.countryRequiredMessage
  );
  return;
}
  try {
    setIsSaving(true);

    await updateProfile(user, {
  displayName: cleanName,
  photoURL: photoURL || null,
});

    await setDoc(
  doc(db, 'users', user.uid),
  {
    fullName: cleanName,
    countryCode,
countryName:
  getCountryName(countryCode, language),
    bio: cleanBio,
    photoURL,
    googlePhotoURL,
    updatedAt: serverTimestamp(),
  },
  {
    merge: true,
  }
);

    Alert.alert(
  text.editProfileScreen.profileUpdatedTitle,
  text.editProfileScreen.profileUpdatedMessage
);
  } catch (error) {
    console.error(
      'Error saving profile:',
      error
    );

    Alert.alert(
  text.editProfileScreen.saveFailedTitle,
  text.editProfileScreen.connectionError
);
  } finally {
    setIsSaving(false);
  }
};
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
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
    {text.editProfileScreen.back}
  </Text>
</TouchableOpacity>

{isLoading ? (
  <ActivityIndicator
    color="#22D3EE"
    size="large"
  />
) : null}

<Text style={styles.title}>
  {text.editProfileScreen.title}
</Text>

<Text style={styles.subtitle}>
  {text.editProfileScreen.subtitle}
</Text>
<Text style={styles.photoSectionTitle}>
  {text.editProfileScreen.profilePhoto}
</Text>

<View style={styles.photoSection}>
  <View style={styles.photoPreview}>
    {photoURL ? (
      <Image
        source={{ uri: photoURL }}
        style={styles.photoImage}
        resizeMode="cover"
      />
    ) : (
      <Text style={styles.photoInitials}>
        {fullName
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) =>
            part.charAt(0).toUpperCase()
          )
          .join('') || 'LB'}
      </Text>
    )}
  </View>

  <View style={styles.photoActions}>
    <TouchableOpacity
      style={styles.changePhotoButton}
      onPress={() =>
        Alert.alert(
          text.editProfileScreen.changePhoto,
          text.editProfileScreen.changePhotoMessage
        )
      }
      activeOpacity={0.85}
    >
      <Text style={styles.changePhotoButtonText}>
        {text.editProfileScreen.changePhoto}
      </Text>
    </TouchableOpacity>

    {!!googlePhotoURL && (
      <TouchableOpacity
        style={styles.secondaryPhotoButton}
        onPress={handleUseGooglePhoto}
        activeOpacity={0.85}
      >
        <Text style={styles.secondaryPhotoButtonText}>
          {text.editProfileScreen.useGooglePhoto}
        </Text>
      </TouchableOpacity>
    )}

    {!!photoURL && (
      <TouchableOpacity
        style={styles.removePhotoButton}
        onPress={handleRemovePhoto}
        activeOpacity={0.85}
      >
        <Text style={styles.removePhotoButtonText}>
          {text.editProfileScreen.removePhoto}
        </Text>
      </TouchableOpacity>
    )}
  </View>
</View>
          <Text style={styles.label}>
  {text.editProfileScreen.fullName}
</Text>

<TextInput
  style={styles.input}
  placeholder={
    text.editProfileScreen.fullNamePlaceholder
  }
  placeholderTextColor="#64748B"
  value={fullName}
  onChangeText={setFullName}
  autoCapitalize="words"
  maxLength={60}
/>

          <Text style={styles.label}>
  {text.editProfileScreen.country}
</Text>

<TouchableOpacity
  style={[
    styles.countrySelector,
    isCountryListOpen &&
      styles.openCountrySelector,
  ]}
  onPress={() =>
    setIsCountryListOpen(
      (currentValue) => !currentValue
    )
  }
  activeOpacity={0.85}
>
  <View style={styles.selectedCountryContent}>
    <View style={styles.countryFlagContainer}>
      <Text style={styles.countryFlag}>
        {selectedCountry?.flag || '🌍'}
      </Text>
    </View>

    <View style={styles.countryInformation}>
      <Text
        style={[
          styles.countryName,
          !selectedCountry &&
            styles.countryPlaceholder,
        ]}
        numberOfLines={1}
      >
        {selectedCountry?.name ||
  text.editProfileScreen.selectCountry}
      </Text>

      <Text style={styles.countryHelper}>
  {text.editProfileScreen.countryPrivacyHelper}
</Text>
    </View>
  </View>

  <View style={styles.countryArrowContainer}>
    <Text style={styles.countryArrow}>
      {isCountryListOpen ? '▲' : '▼'}
    </Text>
  </View>
</TouchableOpacity>

{isCountryListOpen && (
  <View style={styles.countryList}>
    <TextInput
      style={styles.countrySearchInput}
      value={countrySearch}
      onChangeText={setCountrySearch}
      placeholder={
  text.editProfileScreen.searchCountry
}
      placeholderTextColor="#64748B"
      autoCapitalize="none"
      autoCorrect={false}
    />

    <ScrollView
      style={styles.countryListScroll}
      contentContainerStyle={
        styles.countryListContent
      }
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {filteredCountries.length > 0 ? (
        filteredCountries.map((country) => {
          const isSelected =
            country.code === countryCode;

          return (
            <TouchableOpacity
              key={country.code}
              style={[
                styles.countryOption,
                isSelected &&
                  styles.selectedCountryOption,
              ]}
              onPress={() => {
                setCountryCode(country.code);
                setCountrySearch('');
                setIsCountryListOpen(false);
              }}
              activeOpacity={0.8}
            >
              <View
                style={styles.optionCountryFlagContainer}
              >
                <Text style={styles.optionCountryFlag}>
                  {country.flag}
                </Text>
              </View>

              <Text
                style={[
                  styles.optionCountryName,
                  isSelected &&
                    styles.selectedCountryName,
                ]}
                numberOfLines={2}
              >
                {country.name}
              </Text>

              {isSelected && (
                <View style={styles.countryCheckContainer}>
                  <Text style={styles.countryCheckMark}>
                    ✓
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })
      ) : (
        <View style={styles.noCountryResults}>
          <Text style={styles.noCountryResultsIcon}>
            🔎
          </Text>

          <Text style={styles.noCountryResultsText}>
  {text.editProfileScreen.noCountryResults}
</Text>
        </View>
      )}
    </ScrollView>
  </View>
)}
          <Text style={styles.label}>
  {text.editProfileScreen.aboutMe}
</Text>

          <TextInput
            style={[
              styles.input,
              styles.bioInput,
            ]}
            placeholder={
  text.editProfileScreen.bioPlaceholder
}
            placeholderTextColor="#64748B"
            value={bio}
            onChangeText={setBio}
            multiline
            textAlignVertical="top"
            maxLength={240}
          />

          <Text style={styles.characterCount}>
            {bio.length}/240
          </Text>

          <TouchableOpacity
  style={[
    styles.saveButton,
    isSaving && styles.disabledSaveButton,
  ]}
  onPress={handleSaveProfile}
  activeOpacity={0.85}
  disabled={isSaving || isLoading}
>
  <Text style={styles.saveButtonText}>
  {isSaving
    ? text.editProfileScreen.saving
    : text.editProfileScreen.saveChanges}
</Text>
</TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
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
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 38,
  },

  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingRight: 18,
    marginBottom: 14,
  },

  backButtonText: {
    color: '#22D3EE',
    fontSize: 16,
    fontWeight: '700',
  },

  title: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 38,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#A8B3CF',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 9,
    marginBottom: 24,
  },

  label: {
    color: '#E8EEFF',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 9,
  },

  input: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#111C3A',
    borderWidth: 1.5,
    borderColor: '#334C7D',
    borderRadius: 16,
    color: '#FFFFFF',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginBottom: 18,
  },

  bioInput: {
    minHeight: 120,
    lineHeight: 21,
    paddingTop: 15,
    marginBottom: 7,
  },

  characterCount: {
    color: '#64748B',
    fontSize: 11,
    textAlign: 'right',
  },

  saveButton: {
    width: '100%',
    minHeight: 56,
    backgroundColor: '#22D3EE',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 22,
    shadowColor: '#22D3EE',
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
disabledSaveButton: {
  opacity: 0.65,
},
  saveButtonText: {
    color: '#050B24',
    fontSize: 17,
    fontWeight: 'bold',
  },
 photoSectionTitle: {
  color: '#E8EEFF',
  fontSize: 15,
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: 12,
},

photoSection: {
  alignItems: 'center',
  marginBottom: 26,
},

photoPreview: {
  width: 112,
  height: 112,
  borderRadius: 36,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#19284A',
  borderWidth: 2,
  borderColor: '#22D3EE',
  overflow: 'hidden',
  shadowColor: '#22D3EE',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.3,
  shadowRadius: 10,
  elevation: 7,
},

photoImage: {
  width: '100%',
  height: '100%',
},

photoInitials: {
  color: '#FFFFFF',
  fontSize: 30,
  fontWeight: 'bold',
}, 
photoActions: {
  width: '100%',
  alignItems: 'center',
  marginTop: 16,
},

changePhotoButton: {
  minWidth: 190,
  minHeight: 46,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#22D3EE',
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingVertical: 12,
},

changePhotoButtonText: {
  color: '#050B24',
  fontSize: 14,
  fontWeight: 'bold',
},

secondaryPhotoButton: {
  minWidth: 190,
  minHeight: 44,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#30245C',
  borderWidth: 1,
  borderColor: '#A78BFA',
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingVertical: 11,
  marginTop: 10,
},

secondaryPhotoButtonText: {
  color: '#DDD6FE',
  fontSize: 13,
  fontWeight: 'bold',
},

removePhotoButton: {
  minWidth: 190,
  minHeight: 42,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#321B2B',
  borderWidth: 1,
  borderColor: '#FB7185',
  borderRadius: 14,
  paddingHorizontal: 18,
  paddingVertical: 10,
  marginTop: 10,
},

removePhotoButtonText: {
  color: '#FDA4AF',
  fontSize: 13,
  fontWeight: 'bold',
},
countrySelector: {
  width: '100%',
  minHeight: 74,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#111C3A',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 16,
  paddingHorizontal: 13,
  paddingVertical: 11,
  marginBottom: 18,
},

openCountrySelector: {
  backgroundColor: '#141F42',
  borderColor: '#22D3EE',
  marginBottom: 10,
},

selectedCountryContent: {
  flex: 1,
  minWidth: 0,
  flexDirection: 'row',
  alignItems: 'center',
},

countryFlagContainer: {
  width: 48,
  height: 48,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#19284A',
  borderWidth: 1,
  borderColor: '#334C7D',
  borderRadius: 15,
  marginRight: 12,
},

countryFlag: {
  fontSize: 26,
},

countryInformation: {
  flex: 1,
  minWidth: 0,
  paddingRight: 8,
},

countryName: {
  color: '#FFFFFF',
  fontSize: 15,
  lineHeight: 20,
  fontWeight: 'bold',
},

countryPlaceholder: {
  color: '#94A3B8',
},

countryHelper: {
  color: '#8492B0',
  fontSize: 11,
  lineHeight: 16,
  marginTop: 3,
},

countryArrowContainer: {
  width: 34,
  height: 34,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#123B5D',
  borderRadius: 12,
  marginLeft: 8,
},

countryArrow: {
  color: '#22D3EE',
  fontSize: 12,
  fontWeight: 'bold',
},

countryList: {
  width: '100%',
  backgroundColor: '#0B1430',
  borderWidth: 1.5,
  borderColor: '#334C7D',
  borderRadius: 18,
  padding: 9,
  marginBottom: 18,
  overflow: 'hidden',
},

countrySearchInput: {
  width: '100%',
  minHeight: 48,
  backgroundColor: '#111C3A',
  borderWidth: 1,
  borderColor: '#334C7D',
  borderRadius: 13,
  color: '#FFFFFF',
  fontSize: 14,
  paddingHorizontal: 14,
  paddingVertical: 11,
  marginBottom: 8,
},

countryListScroll: {
  width: '100%',
  maxHeight: 280,
},

countryListContent: {
  paddingBottom: 2,
},

countryOption: {
  width: '100%',
  minHeight: 58,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#0F1935',
  borderWidth: 1,
  borderColor: '#1F3158',
  borderRadius: 14,
  paddingHorizontal: 10,
  paddingVertical: 8,
  marginBottom: 6,
},

selectedCountryOption: {
  backgroundColor: '#25356B',
  borderColor: '#22D3EE',
},

optionCountryFlagContainer: {
  width: 42,
  height: 42,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#19284A',
  borderRadius: 13,
  marginRight: 11,
},

optionCountryFlag: {
  fontSize: 23,
},

optionCountryName: {
  flex: 1,
  minWidth: 0,
  color: '#D7E0F5',
  fontSize: 14,
  lineHeight: 19,
  fontWeight: '600',
  paddingRight: 8,
},

selectedCountryName: {
  color: '#FFFFFF',
  fontWeight: 'bold',
},

countryCheckContainer: {
  width: 30,
  height: 30,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#123B5D',
  borderWidth: 1,
  borderColor: '#22D3EE',
  borderRadius: 15,
},

countryCheckMark: {
  color: '#22D3EE',
  fontSize: 17,
  fontWeight: 'bold',
},

noCountryResults: {
  minHeight: 120,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 20,
},

noCountryResultsIcon: {
  fontSize: 27,
},

noCountryResultsText: {
  color: '#94A3B8',
  fontSize: 13,
  lineHeight: 19,
  textAlign: 'center',
  marginTop: 8,
},

});
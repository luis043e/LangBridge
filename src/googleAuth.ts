import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from './firebaseConfig';
import {
  translations,
  type AppLanguage,
} from './translations';

GoogleSignin.configure({
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(
  language: AppLanguage
) {
  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const text = translations[language];

  if (!webClientId) {
    throw new Error(
  text.googleAuth.missingWebClientId
);
  }

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });
  
  await GoogleSignin.signOut();
  
  const googleResponse = await GoogleSignin.signIn();
  
  if (!isSuccessResponse(googleResponse)) {
    return null;
  }

  const idToken = googleResponse.data.idToken;

  if (!idToken) {
    throw new Error(
  text.googleAuth.invalidIdToken
);
  }

  const googleCredential =
    GoogleAuthProvider.credential(idToken);

  const userCredential = await signInWithCredential(
    auth,
    googleCredential
  );

  const firebaseUser = userCredential.user;

  const userReference = doc(
    db,
    'users',
    firebaseUser.uid
  );

  const userSnapshot = await getDoc(userReference);
  const isNewUser = !userSnapshot.exists();

  const userData = {
    fullName:
      firebaseUser.displayName ||
      userSnapshot.data()?.fullName ||
      '',
    email:
      firebaseUser.email ||
      userSnapshot.data()?.email ||
      '',
    photoURL:
      firebaseUser.photoURL ||
      userSnapshot.data()?.photoURL ||
      '',
    authProvider: 'google',
    updatedAt: serverTimestamp(),
    ...(isNewUser
      ? {
          interfaceLanguage: language,
          isProfileVisible: true,
          createdAt: serverTimestamp(),
        }
      : {}),
  };

  await setDoc(
    userReference,
    userData,
    {
      merge: true,
    }
  );

  return {
    user: firebaseUser,
    isNewUser,
  };
}
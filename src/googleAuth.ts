import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import {
  GoogleAuthProvider,
  reauthenticateWithCredential,
  signInWithCredential,
  signOut,
} from 'firebase/auth';
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

import { auth, db } from './firebaseConfig';
import { createLegalAcceptanceData } from './legalAcceptance';
import {
  translations,
  type AppLanguage,
} from './translations';
type GoogleSignInOptions = {
 recordLegalAcceptance?: boolean;
 };
GoogleSignin.configure({
  webClientId:
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
});

export async function signInWithGoogle(
 language: AppLanguage,
 options: GoogleSignInOptions = {}
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
  if (
 isNewUser &&
 !options.recordLegalAcceptance
 ) {
 await signOut(auth);

throw new Error(
 text.registerScreen.legalAcceptanceRequiredGoogle
 );
 }
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
 ...createLegalAcceptanceData(
 language,
 'google'
 ),
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
export async function reauthenticateWithGoogle(
  language: AppLanguage
): Promise<boolean> {
  const webClientId =
    process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const text = translations[language];
  const currentUser = auth.currentUser;

  if (!webClientId) {
    throw new Error(
      text.googleAuth.missingWebClientId
    );
  }

  if (!currentUser) {
    throw new Error(
      'AUTHENTICATED_USER_REQUIRED'
    );
  }

  const usesGoogleProvider =
    currentUser.providerData.some(
      provider =>
        provider.providerId ===
        GoogleAuthProvider.PROVIDER_ID
    );

  if (!usesGoogleProvider) {
    throw new Error(
      'GOOGLE_PROVIDER_REQUIRED'
    );
  }

  await GoogleSignin.hasPlayServices({
    showPlayServicesUpdateDialog: true,
  });

  await GoogleSignin.signOut();

  const googleResponse =
    await GoogleSignin.signIn();

  if (!isSuccessResponse(googleResponse)) {
    return false;
  }

  const idToken =
    googleResponse.data.idToken;

  if (!idToken) {
    throw new Error(
      text.googleAuth.invalidIdToken
    );
  }

  const googleCredential =
    GoogleAuthProvider.credential(idToken);

  await reauthenticateWithCredential(
    currentUser,
    googleCredential
  );

  return true;
}

import {
    EmailAuthProvider,
    reauthenticateWithCredential,
} from 'firebase/auth';

import {
    auth,
} from '../firebaseConfig';

export async function reauthenticateWithPassword(
  password: string
): Promise<void> {
  const currentUser =
    auth.currentUser;

  if (!currentUser) {
    throw new Error(
      'AUTHENTICATED_USER_REQUIRED'
    );
  }

  const usesPasswordProvider =
    currentUser.providerData.some(
      provider =>
        provider.providerId ===
        EmailAuthProvider.PROVIDER_ID
    );

  if (!usesPasswordProvider) {
    throw new Error(
      'PASSWORD_PROVIDER_REQUIRED'
    );
  }

  const email =
    currentUser.email;

  if (!email) {
    throw new Error(
      'AUTHENTICATED_EMAIL_REQUIRED'
    );
  }

  if (!password) {
    throw new Error(
      'PASSWORD_REQUIRED'
    );
  }

  const credential =
    EmailAuthProvider.credential(
      email,
      password
    );

  await reauthenticateWithCredential(
    currentUser,
    credential
  );
}
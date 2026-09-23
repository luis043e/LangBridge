import {
    httpsCallable,
} from 'firebase/functions';

import {
    functions,
} from '../firebaseConfig';

export type CancelAccountDeletionPublicResult = {
  status:
    | 'completed'
    | 'not-cancellable';
};

const cancelAccountDeletionCallable =
  httpsCallable<
    Record<string, never>,
    CancelAccountDeletionPublicResult
  >(
    functions,
    'cancelAccountDeletion'
  );

export async function cancelAccountDeletionRequest():
  Promise<CancelAccountDeletionPublicResult> {
  const response =
    await cancelAccountDeletionCallable(
      {}
    );

  const result =
    response.data;

  if (
    result.status !==
      'completed' &&
    result.status !==
      'not-cancellable'
  ) {
    throw new Error(
      'Unexpected cancelAccountDeletion response.'
    );
  }

  return {
    status:
      result.status,
  };
}
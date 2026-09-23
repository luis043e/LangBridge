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

export type AccountDeletionRequestPublicState =
  | 'request-not-found'
  | 'cancellable'
  | 'not-cancellable'
  | 'point-of-no-return-reached'
  | 'inconsistent-state';

export type ReadAccountDeletionRequestStateResult = {
  status:
    AccountDeletionRequestPublicState;
};

const cancelAccountDeletionCallable =
  httpsCallable<
    Record<string, never>,
    CancelAccountDeletionPublicResult
  >(
    functions,
    'cancelAccountDeletion'
  );

const readAccountDeletionRequestStateCallable =
  httpsCallable<
    Record<string, never>,
    ReadAccountDeletionRequestStateResult
  >(
    functions,
    'cancellationRequestStateProbe'
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

export async function readAccountDeletionRequestState():
  Promise<ReadAccountDeletionRequestStateResult> {
  const response =
    await readAccountDeletionRequestStateCallable(
      {}
    );

  const result =
    response.data;

  switch (
    result.status
  ) {
    case 'request-not-found':
    case 'cancellable':
    case 'not-cancellable':
    case 'point-of-no-return-reached':
    case 'inconsistent-state':
      return {
        status:
          result.status,
      };

    default:
      throw new Error(
        'Unexpected cancellation request state.'
      );
  }
}
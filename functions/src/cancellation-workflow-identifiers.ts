import type {
    Firestore,
} from "firebase-admin/firestore";

import {
    CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN,
    createCancellationOperationLookupKey,
} from "./cancellation-operation-key.js";

import {
    CANCELLATION_RECORD_ID_PATTERN,
    createCancellationRecordId,
} from "./cancellation-record-id.js";

import {
    CANCELLATION_COLLECTIONS,
} from "./cancellation-transaction.js";

export type CancellationWorkflowIdentifiersResult =
  | {
      status:
        "new";
      opaqueLookupKey:
        string;
      cancellationRecordId:
        string;
    }
  | {
      status:
        "existing";
      opaqueLookupKey:
        string;
      cancellationRecordId:
        string;
    }
  | {
      status:
        "inconsistent-state";
    };

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export async function resolveCancellationWorkflowIdentifiers(
  firestore: Firestore,
  uid: string,
  secret: string
): Promise<CancellationWorkflowIdentifiersResult> {
  const opaqueLookupKey =
    createCancellationOperationLookupKey(
      uid,
      secret
    );

  if (
    !CANCELLATION_OPERATION_LOOKUP_KEY_PATTERN.test(
      opaqueLookupKey
    )
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  const operationSnapshot =
    await firestore
      .collection(
        CANCELLATION_COLLECTIONS.operations
      )
      .doc(
        opaqueLookupKey
      )
      .get();

  if (
    !operationSnapshot.exists
  ) {
    const cancellationRecordId =
      createCancellationRecordId();

    if (
      !CANCELLATION_RECORD_ID_PATTERN.test(
        cancellationRecordId
      ) ||
      cancellationRecordId ===
        opaqueLookupKey
    ) {
      return {
        status:
          "inconsistent-state",
      };
    }

    return {
      status:
        "new",
      opaqueLookupKey,
      cancellationRecordId,
    };
  }

  const operationData =
    operationSnapshot.data();

  if (
    !isRecord(
      operationData
    ) ||
    operationData.operationKey !==
      opaqueLookupKey ||
    typeof operationData
      .cancellationRecordId !==
      "string" ||
    !CANCELLATION_RECORD_ID_PATTERN.test(
      operationData
        .cancellationRecordId
    ) ||
    operationData
      .cancellationRecordId ===
      opaqueLookupKey
  ) {
    return {
      status:
        "inconsistent-state",
    };
  }

  return {
    status:
      "existing",
    opaqueLookupKey,
    cancellationRecordId:
      operationData
        .cancellationRecordId,
  };
}
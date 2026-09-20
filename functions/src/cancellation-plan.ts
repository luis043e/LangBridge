const RETENTION_DAYS = 30;

export const CANCELLATION_PROCEDURE_VERSION =
  "account-deletion-cancellation-v1";

export const CANCELLATION_VERIFICATION_METHOD =
  "recent-session";

export const CANCELLATION_RESTORATION_RESULT =
  "restored";

export type CancellationPlan = {
  profileUpdate: {
    isProfileVisible: boolean;
  };
  profileFieldsToDelete: readonly [
    "deletionRequested",
    "deletionRequestedAt",
  ];
  cancelledRecord: {
    status: "cancelled";
    cancelledAt: Date;
    expiresAt: Date;
    procedureVersion:
      "account-deletion-cancellation-v1";
    verificationMethod:
      "recent-session";
    restorationResult:
      "restored";
  };
  deleteActiveRequest: true;
  createDeletionReceipt: false;
};

export function calculateCancellationExpiry(
  cancelledAt: Date
): Date {
  if (
    Number.isNaN(
      cancelledAt.getTime()
    )
  ) {
    throw new TypeError(
      "cancelledAt must be a valid Date."
    );
  }

  const expiresAt =
    new Date(
      cancelledAt.getTime()
    );

  expiresAt.setUTCDate(
    expiresAt.getUTCDate() +
      RETENTION_DAYS
  );

  return expiresAt;
}

export function createCancellationPlan(
  previousProfileVisibility: boolean,
  cancelledAt: Date
): CancellationPlan {
  if (
    typeof previousProfileVisibility !==
    "boolean"
  ) {
    throw new TypeError(
      "previousProfileVisibility must be boolean."
    );
  }

  const normalizedCancelledAt =
    new Date(
      cancelledAt.getTime()
    );

  if (
    Number.isNaN(
      normalizedCancelledAt.getTime()
    )
  ) {
    throw new TypeError(
      "cancelledAt must be a valid Date."
    );
  }

  const expiresAt =
    calculateCancellationExpiry(
      normalizedCancelledAt
    );

  return {
    profileUpdate: {
      isProfileVisible:
        previousProfileVisibility,
    },
    profileFieldsToDelete: [
      "deletionRequested",
      "deletionRequestedAt",
    ],
    cancelledRecord: {
      status: "cancelled",
      cancelledAt:
        normalizedCancelledAt,
      expiresAt,
      procedureVersion:
        CANCELLATION_PROCEDURE_VERSION,
      verificationMethod:
        CANCELLATION_VERIFICATION_METHOD,
      restorationResult:
        CANCELLATION_RESTORATION_RESULT,
    },
    deleteActiveRequest: true,
    createDeletionReceipt: false,
  };
}
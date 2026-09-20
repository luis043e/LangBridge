export type DeletionRequestResult =
  | {
      status: "cancellable";
      previousProfileVisibility: boolean;
    }
  | {
      status:
        | "request-not-found"
        | "not-cancellable"
        | "point-of-no-return-reached";
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

export function evaluateDeletionRequest(
  exists: boolean,
  data: unknown,
  authenticatedUid: string
): DeletionRequestResult {
  if (!exists) {
    return {
      status: "request-not-found",
    };
  }

  if (!isRecord(data)) {
    return {
      status: "not-cancellable",
    };
  }

  if (
    data.userId !== authenticatedUid
  ) {
    return {
      status: "not-cancellable",
    };
  }

  if (
    data.pointOfNoReturnAt !== undefined ||
    data.pointOfNoReturnOperation !== undefined
  ) {
    return {
      status:
        "point-of-no-return-reached",
    };
  }

  if (
    data.status !== "pending" &&
    data.status !== "processing"
  ) {
    return {
      status: "not-cancellable",
    };
  }

  if (
    typeof data.previousProfileVisibility !==
    "boolean"
  ) {
    return {
      status: "not-cancellable",
    };
  }

  return {
    status: "cancellable",
    previousProfileVisibility:
      data.previousProfileVisibility,
  };
}
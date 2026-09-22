function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function readCancellationStoredDate(
  value: unknown
): Date | undefined {
  if (value instanceof Date) {
    if (
      Number.isNaN(
        value.getTime()
      )
    ) {
      return undefined;
    }

    return new Date(
      value.getTime()
    );
  }

  if (
    !isRecord(value) ||
    typeof value.toDate !==
      "function"
  ) {
    return undefined;
  }

  try {
    const converted =
      value.toDate.call(
        value
      );

    if (
      !(converted instanceof Date) ||
      Number.isNaN(
        converted.getTime()
      )
    ) {
      return undefined;
    }

    return new Date(
      converted.getTime()
    );
  } catch {
    return undefined;
  }
}
import { setGlobalOptions } from "firebase-functions/v2";
import {
  HttpsError,
  onCall,
} from "firebase-functions/v2/https";

setGlobalOptions({
  region: "us-central1",
  maxInstances: 1,
  concurrency: 1,
});

export const cancellationBackendProbe = onCall(
  {
    timeoutSeconds: 30,
  },
  (request) => {
    if (request.auth === undefined) {
      throw new HttpsError(
        "unauthenticated",
        "Authentication is required."
      );
    }

    return {
      status: "ready",
    };
  }
);
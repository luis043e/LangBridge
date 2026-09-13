import { serverTimestamp } from 'firebase/firestore';
import type { AppLanguage } from './translations';

export const TERMS_VERSION = '0.1';
export const PRIVACY_VERSION = '0.1';
export const COMMUNITY_GUIDELINES_VERSION = '0.1';

export type LegalAcceptanceMethod = 'email' | 'google';

export function createLegalAcceptanceData(
 language: AppLanguage,
 method: LegalAcceptanceMethod
) {
 return {
 legalAcceptedAt: serverTimestamp(),
 termsVersion: TERMS_VERSION,
 privacyVersion: PRIVACY_VERSION,
 communityGuidelinesVersion:
 COMMUNITY_GUIDELINES_VERSION,
 legalAcceptanceLanguage: language,
 legalAcceptanceMethod: method,
 };
}

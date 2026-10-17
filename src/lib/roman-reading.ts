import { teluguReading, hindiReading, READING_RULES_VERSION } from './reading-transliteration.ts';

/** A reading aid generated from our catalog, never a claimed English translation. */
export function getRomanReading(text: string) {
  const telugu = /[\u0c00-\u0c7f]/.test(text);
  const hindi = /[\u0900-\u097f]/.test(text);
  if (!telugu && !hindi) return null;
  let roman = text.normalize('NFC');
  if (telugu) roman = roman.replace(/[\u0c00-\u0c7f\u200c\u200d]+/g, teluguReading);
  if (hindi) roman = roman.replace(/[\u0900-\u097f\u200c\u200d]+/g, hindiReading);
  // Do not advertise a complete Roman view if unsupported native letters remain.
  if (/[\u0c00-\u0c63\u0900-\u0963]/.test(roman)) return null;
  const language = telugu && hindi ? 'Telugu / Hindi' : telugu ? 'Telugu' : 'Hindi';
  return { text: roman, label: `${language} transliteration`, lang: telugu && !hindi ? 'te-Latn' : hindi && !telugu ? 'hi-Latn' : 'und-Latn', generated: true, rulesVersion: READING_RULES_VERSION };
}

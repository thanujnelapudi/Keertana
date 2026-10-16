import { teluguToRoman, hindiToRoman } from './transliterate.ts';

/** A reading aid generated from our catalog, never a claimed English translation. */
export function getRomanReading(text: string) {
  const telugu = /[\u0c00-\u0c7f]/.test(text);
  const hindi = /[\u0900-\u097f]/.test(text);
  if (!telugu && !hindi) return null;
  const digits = (run: string, start: number) => run.replace(/[\u0966-\u096f\u0c66-\u0c6f]/g, ch => String(ch.charCodeAt(0) - start));
  let roman = text.normalize('NFC');
  if (telugu) roman = roman.replace(/[\u0c00-\u0c7f\u200c\u200d]+/g, run => teluguToRoman(digits(run, 0x0c66).replace(/[\u200c\u200d]/g, '').replace(/ం(?=[కఖగఘఙచఛజఝఞటఠడఢణతథదధనయరలవశషసహళ])/g, 'n')).replace(/\u0c55/g, '').replace(/\u0c56/g, 'i').replace(/ౄ/g, 'roo').replace(/ఁ/g, 'm').replace(/ూ/g, 'oo'));
  if (hindi) roman = roman.replace(/[\u0900-\u097f\u200c\u200d]+/g, run => hindiToRoman(digits(run, 0x0966).replace(/[\u200c\u200d]/g, '')).replace(/[\u0964\u0965]/g, '|'));
  // Do not advertise a complete Roman view if unsupported native letters remain.
  if (/[\u0c00-\u0c63\u0900-\u0963]/.test(roman)) return null;
  const language = telugu && hindi ? 'Telugu / Hindi' : telugu ? 'Telugu' : 'Hindi';
  return { text: roman, label: `${language} transliteration`, lang: telugu && !hindi ? 'te-Latn' : hindi && !telugu ? 'hi-Latn' : 'und-Latn', generated: true };
}

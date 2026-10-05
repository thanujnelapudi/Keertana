/**
 * Telugu → Roman transliteration and phonetic key generation.
 *
 * Used at build time to create a compact search index and at runtime
 * to normalize user queries for cross-script fuzzy matching.
 */

// ─── Telugu → Roman mapping ─────────────────────────────────────────

const VOWELS: Record<string, string> = {
  'అ': 'a', 'ఆ': 'aa', 'ఇ': 'i', 'ఈ': 'ee', 'ఉ': 'u', 'ఊ': 'oo',
  'ఋ': 'ru', 'ఎ': 'e', 'ఏ': 'ee', 'ఐ': 'ai', 'ఒ': 'o', 'ఓ': 'oo',
  'ఔ': 'au',
};

const VOWEL_SIGNS: Record<string, string> = {
  '\u0C3E': 'aa', '\u0C3F': 'i', '\u0C40': 'ee', '\u0C41': 'u',
  '\u0C42': 'oo', '\u0C43': 'ru', '\u0C46': 'e', '\u0C47': 'ee',
  '\u0C48': 'ai', '\u0C4A': 'o', '\u0C4B': 'oo', '\u0C4C': 'au',
};

const CONSONANTS: Record<string, string> = {
  'క': 'k', 'ఖ': 'kh', 'గ': 'g', 'ఘ': 'gh', 'ఙ': 'ng',
  'చ': 'ch', 'ఛ': 'chh', 'జ': 'j', 'ఝ': 'jh', 'ఞ': 'ny',
  'ట': 't', 'ఠ': 'th', 'డ': 'd', 'ఢ': 'dh', 'ణ': 'n',
  'త': 'th', 'థ': 'th', 'ద': 'd', 'ధ': 'dh', 'న': 'n',
  'ప': 'p', 'ఫ': 'ph', 'బ': 'b', 'భ': 'bh', 'మ': 'm',
  'య': 'y', 'ర': 'r', 'ల': 'l', 'వ': 'v', 'శ': 'sh',
  'ష': 'sh', 'స': 's', 'హ': 'h', 'ళ': 'l', 'క్ష': 'ksh',
  'ఱ': 'r',
};

const VIRAMA = '\u0C4D'; // halant / virama
const ANUSVARA = '\u0C02'; // ం
const VISARGA = '\u0C03'; // ః

/**
 * Transliterate a Telugu string to an approximate Roman representation.
 * Non-Telugu characters pass through unchanged (lowercased).
 */
export function teluguToRoman(text: string): string {
  const chars = Array.from(text);
  let result = '';
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];
    const cp = ch.codePointAt(0) ?? 0;

    // Check for anusvara / visarga
    if (ch === ANUSVARA) { result += 'm'; i++; continue; }
    if (ch === VISARGA) { result += 'h'; i++; continue; }

    // Independent vowels
    if (VOWELS[ch]) { result += VOWELS[ch]; i++; continue; }

    // Consonants
    if (CONSONANTS[ch]) {
      result += CONSONANTS[ch];
      i++;

      // Check for virama (halant) → consonant cluster, no inherent vowel
      if (i < chars.length && chars[i] === VIRAMA) {
        i++; // skip virama, next consonant will add its own sound
        continue;
      }

      // Check for vowel sign
      if (i < chars.length && VOWEL_SIGNS[chars[i]]) {
        result += VOWEL_SIGNS[chars[i]];
        i++;
        continue;
      }

      // No vowel sign and no virama → inherent 'a'
      if (i < chars.length) {
        const nextCp = chars[i].codePointAt(0) ?? 0;
        // Only add inherent 'a' if next char is not a vowel sign, virama, or punctuation
        if (nextCp >= 0x0C00 && nextCp <= 0x0C7F) {
          result += 'a';
        } else {
          result += 'a';
        }
      } else {
        result += 'a';
      }
      continue;
    }

    // Hindi / Devanagari pass-through (basic)
    if (cp >= 0x0900 && cp <= 0x097F) {
      result += ch;
      i++;
      continue;
    }

    // Everything else (spaces, punctuation, Latin) pass through lowercased
    result += ch.toLowerCase();
    i++;
  }

  return result;
}

// ─── Phonetic Key ───────────────────────────────────────────────────

/**
 * Reduce a romanized string to a forgiving phonetic key:
 * - lowercase
 * - drop vowels (a, e, i, o, u)
 * - collapse repeated consonants
 * - normalize similar sounds: w→v, sh→s, ch→c, ph→p, th→t, dh→d, bh→b, gh→g, kh→k, jh→j
 */
export function toPhoneticKey(roman: string): string {
  let s = roman.toLowerCase();

  // Normalize digraphs to single consonants
  s = s.replace(/ksh/g, 'ks');
  s = s.replace(/sh/g, 's');
  s = s.replace(/ch/g, 'c');
  s = s.replace(/ph/g, 'p');
  s = s.replace(/th/g, 't');
  s = s.replace(/dh/g, 'd');
  s = s.replace(/bh/g, 'b');
  s = s.replace(/gh/g, 'g');
  s = s.replace(/kh/g, 'k');
  s = s.replace(/jh/g, 'j');
  s = s.replace(/ny/g, 'n');
  s = s.replace(/ng/g, 'n');

  // Normalize w → v
  s = s.replace(/w/g, 'v');

  // Drop vowels
  s = s.replace(/[aeiou]/g, '');

  // Drop non-alphanumeric
  s = s.replace(/[^a-z0-9]/g, '');

  // Collapse repeated consonants
  s = s.replace(/(.)\1+/g, '$1');

  return s;
}

/**
 * Generate a phonetic key for any title string.
 * Telugu titles are first transliterated to Roman, then reduced.
 * Latin titles are reduced directly.
 */
export function titleToPhoneticKey(title: string): string {
  const firstCp = title.codePointAt(0) ?? 0;
  const isTelugu = firstCp >= 0x0C00 && firstCp <= 0x0C7F;
  const roman = isTelugu ? teluguToRoman(title) : title;
  return toPhoneticKey(roman);
}

/** Devanagari title transliteration; slug aliases cover colloquial spellings
 * and Hindi's contextual schwa deletion without altering displayed titles. */
export function hindiToRoman(text: string): string {
  const vowels: Record<string, string> = { 'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au' };
  const signs: Record<string, string> = { 'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo','ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au' };
  const consonants: Record<string, string> = { 'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'n','च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'n','ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n','त':'t','थ':'th','द':'d','ध':'dh','न':'n','प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v','श':'sh','ष':'sh','स':'s','ह':'h','ळ':'l' };
  const chars = Array.from(text.normalize('NFD'));
  let result = '';
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if (consonants[ch]) {
      result += consonants[ch];
      if (chars[i + 1] === '़') i++;
      if (chars[i + 1] === '्') i++;
      else if (signs[chars[i + 1]]) result += signs[chars[++i]];
      else if (chars[i + 1] && /[\u0900-\u097f]/.test(chars[i + 1])) result += 'a';
    } else result += vowels[ch] || signs[ch] || ({'ं':'n','ँ':'n','ः':'h','़':''}[ch] ?? ch.toLowerCase());
  }
  return result;
}

/**
 * Rank a match: 3 = prefix, 2 = substring, 1 = phonetic, 0 = no match.
 */
export function rankMatch(
  query: string,
  title: string,
  titleLower: string,
  titlePhonetic: string,
): number {
  const q = query.toLowerCase();
  const qPhonetic = toPhoneticKey(q);

  if (titleLower.startsWith(q)) return 3;
  if (titleLower.includes(q)) return 2;
  if (qPhonetic.length >= 2 && titlePhonetic.startsWith(qPhonetic)) return 1;
  if (qPhonetic.length >= 3 && titlePhonetic.includes(qPhonetic)) return 1;
  return 0;
}

/**
 * Generate romanized & vowel-simplified versions of text
 * for Pagefind search indexing.
 */
export function getRomanizedLyrics(text: string): string {
  const firstCp = text.codePointAt(0) ?? 0;
  // If text contains Telugu
  if (/[\u0c00-\u0c7f]/.test(text)) {
    const roman = teluguToRoman(text);
    const simplified = roman
      .replace(/aa/g, 'a')
      .replace(/ee/g, 'e')
      .replace(/oo/g, 'o')
      .replace(/ii/g, 'i')
      .replace(/uu/g, 'u');
    return `${roman} ${simplified}`;
  }
  return '';
}

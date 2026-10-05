import songsData from '../data/songs.json';

export interface Song {
  slug: string;
  title: string;
  lyrics: string;
}

export const songs: Song[] = songsData as Song[];

export interface LangDef {
  id: string;
  label: string;
  locale: string;
  test: (cp: number) => boolean;
}

export const LANG_DEFS: LangDef[] = [
  {
    id: 'telugu',
    label: 'Telugu',
    locale: 'te',
    test: (cp: number) => cp >= 0x0c00 && cp <= 0x0c7f,
  },
  {
    id: 'hindi',
    label: 'Hindi',
    locale: 'hi',
    test: (cp: number) => cp >= 0x0900 && cp <= 0x097f,
  },
  {
    id: 'english',
    label: 'English',
    locale: 'en',
    test: (_cp: number) => true,
  },
];

export const TELUGU_ALPHABET = [
  'అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఋ', 'ఎ', 'ఏ', 'ఐ', 'ఒ', 'ఓ', 'ఔ',
  'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ', 'ట', 'ఠ', 'డ', 'ఢ', 'ణ',
  'త', 'థ', 'ద', 'ధ', 'న', 'ప', 'ఫ', 'బ', 'భ', 'మ', 'య', 'ర', 'ల',
  'వ', 'శ', 'ష', 'స', 'హ', 'ళ', 'క్ష',
];

export const HINDI_ALPHABET = [
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ए', 'ऐ', 'ओ', 'औ',
  'क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ', 'ड', 'ढ', 'ण',
  'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब', 'भ', 'म', 'य', 'र', 'ल',
  'व', 'श', 'ष', 'स', 'ह', 'क्ष', 'त्र', 'ज्ञ',
];

export const ENGLISH_ALPHABET = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#',
];

export function charToSlug(ch: string, langId: string): string {
  if (langId === 'english') return ch.toLowerCase();
  return 'u' + (ch.codePointAt(0) ?? 0).toString(16).padStart(4, '0');
}

export function slugToChar(slug: string, langId: string): string {
  if (langId === 'english') return slug.toUpperCase();
  if (slug.startsWith('u')) {
    const cp = parseInt(slug.slice(1), 16);
    if (!isNaN(cp)) return String.fromCodePoint(cp);
  }
  return slug;
}

export function getFirstChar(title: string, langId: string): string {
  let firstChar = Array.from(title)[0] ?? '';
  if (langId === 'english') {
    firstChar = firstChar.toUpperCase();
    if (!/^[A-Z]$/.test(firstChar)) firstChar = '#';
  }
  return firstChar;
}

export function detectSongLanguage(song: { title: string; lyrics?: string }) {
  const cp = song.title.codePointAt(0) ?? 0;
  const def = LANG_DEFS.find((d) => d.test(cp)) ?? LANG_DEFS[LANG_DEFS.length - 1];
  const isTelugu = def.id === 'telugu';
  const isHindi = def.id === 'hindi';
  const langCode = isTelugu ? 'te' : isHindi ? 'hi' : 'en';
  const lyricsLang = song.lyrics
    ? /[\u0c00-\u0c7f]/.test(song.lyrics)
      ? 'te'
      : /[\u0900-\u097f]/.test(song.lyrics)
      ? 'hi'
      : 'en'
    : langCode;

  const firstChar = getFirstChar(song.title, def.id);
  const letterSlug = charToSlug(firstChar, def.id);

  return {
    langDef: def,
    langId: def.id,
    langLabel: def.label,
    langCode,
    lyricsLang,
    firstChar,
    letterSlug,
  };
}

export interface LetterGroup {
  char: string;
  slug: string;
  count: number;
}

export interface LangData {
  id: string;
  label: string;
  locale: string;
  letters: LetterGroup[];
  allLetters: LetterGroup[]; // Includes 0-count letters for alphabet display
  songs: Song[];
}

export function getLanguagesData(): LangData[] {
  const langSongs: Record<string, Song[]> = {};
  for (const def of LANG_DEFS) langSongs[def.id] = [];

  for (const song of songs) {
    const { langId } = detectSongLanguage(song);
    langSongs[langId].push(song);
  }

  return LANG_DEFS.map((def) => {
    const items = langSongs[def.id];
    if (items.length === 0) return null;
    const collator = new Intl.Collator(def.locale);
    const sorted = [...items].sort((a, b) => collator.compare(a.title, b.title));

    const songCounts = new Map<string, number>();
    for (const song of sorted) {
      const ch = getFirstChar(song.title, def.id);
      songCounts.set(ch, (songCounts.get(ch) ?? 0) + 1);
    }

    const baseAlphabet =
      def.id === 'telugu'
        ? TELUGU_ALPHABET
        : def.id === 'hindi'
        ? HINDI_ALPHABET
        : ENGLISH_ALPHABET;

    // Combine standard alphabet and any extra characters found in actual data
    const allChars = [...baseAlphabet];
    for (const ch of songCounts.keys()) {
      if (!allChars.includes(ch)) {
        allChars.push(ch);
      }
    }

    const allLetters: LetterGroup[] = allChars.map((ch) => ({
      char: ch,
      slug: charToSlug(ch, def.id),
      count: songCounts.get(ch) ?? 0,
    }));

    // Letters that actually have songs (for getStaticPaths)
    const activeLetters = allLetters.filter((l) => l.count > 0);

    return {
      id: def.id,
      label: def.label,
      locale: def.locale,
      letters: activeLetters,
      allLetters,
      songs: sorted,
    };
  }).filter(Boolean) as LangData[];
}

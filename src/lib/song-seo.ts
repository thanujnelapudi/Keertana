import { getRomanReading } from './roman-reading.ts';

const songReferences = new Map([
  ['arhatha-lekunnaa-preminchaavu', {
    refrains: [
      { native: 'ఇది కేవలం నీ కృపయే', roman: 'Idi Kevalam Nee Krupaye' },
      { native: 'నేనేమైయున్నానో నీ కృపయే', roman: 'Nenemaiyunnaano Nee Krupaye' },
    ],
    recording: {
      title: 'Nenemaiunnano Nee Krupa',
      url: 'https://www.youtube.com/watch?v=2zzSXevdJJ4',
      lyricsAndTune: 'Pastor M. Jyothi Raju',
    },
  }],
]);

export function getSongReference(song: { slug: string; lyrics: string }) {
  const reference = songReferences.get(song.slug);
  return {
    refrains: reference?.refrains.filter(({ native }) => song.lyrics.includes(native)) ?? [],
    recording: reference?.recording,
  };
}

export function teluguSongDescription(song: { title: string; lyrics: string }, romanTitle: string | undefined, hasRomanReading: boolean) {
  const title = song.title.normalize('NFC');
  const excerpt = song.lyrics.normalize('NFC').split(/\r?\n/)
    .map(line => line.replace(/\s*‖.*$/, '').replace(/\s*\(\d+\)\s*$/, '').trim())
    .find(line => /[\u0c05-\u0c39]/.test(line) && line.length <= 95 && !line.includes(title) && !line.includes(':'));
  const sample = excerpt || (romanTitle ? title : '');
  return `${romanTitle ?? title} — Telugu lyrics${hasRomanReading ? ' with transliteration' : ''}.${sample ? ` “${sample}”` : ''}`;
}

// Curated title spellings for pages identified in Search Console. These describe
// existing songs only; they are not credits, translations, or content claims.
export const SEARCH_TITLE_ALIASES: Record<string, string> = {
  'arhatha-lekunnaa-preminchaavu': 'Arhatha Lekunna Preminchavu',
  'yaakobu-baavi-kaada': 'Yaakobu Baavi Kaada',
  'naa-sthuthi-paathrudaa': 'Naa Sthuthi Patruda',
  'nee-krupaathishayamu': 'Nee Krupaathishayamu',
  'nannu-kaavaga-vachchina': 'Nannu Kaavaga Vachchina',
  'neethi-sooryudaa-yesu': 'Neethi Suryuda Yesu',
  'nenemainaa-prabhuvaa': 'Nenemaina Prabhuva',
  'deevinchaave': 'Deevinchaave',
  'nee-aananda-thailamutho': 'Nee Aananda Thailamutho',
  'o-naavikaa': 'O Naavikaa',
  'jeevithamante-maatalu-kaadu': 'Jeevithamante Maatalu Kaadu',
  'novahu-odane-sanghamulo': 'Novahu Odane Sanghamulo',
  'nenu-odiponayaa': 'Nenu Odiponayaa',
  'evaru-leka-ontarinai': 'Evaru Leka Ontarinai',
  'aashapadaku-ee-lokam-kosam': 'Aashapadaku Ee Lokam Kosam',
};
export function songSearchTitle(song: { slug: string; title: string }, language: string) {
  const reading = getRomanReading(song.title);
  const romanTitle = SEARCH_TITLE_ALIASES[song.slug] ?? reading?.text.trim();
  return {
    romanTitle,
    romanTitleLang: reading?.lang ?? 'und-Latn',
    title: romanTitle
      ? `${song.title} (${romanTitle}) – ${language} Lyrics | Keertana`
      : `${song.title} – ${language} Christian Song Lyrics | Keertana`,
  };
}

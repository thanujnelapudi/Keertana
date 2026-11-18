import { getRomanReading } from './roman-reading';

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

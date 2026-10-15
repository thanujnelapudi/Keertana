// Curated title spellings for pages identified in Search Console. These describe
// existing songs only; they are not credits, translations, or content claims.
export const SEARCH_TITLE_ALIASES: Record<string, string> = {
  'neethi-sooryudaa-yesu': 'Neethi Suryuda Yesu',
  'nenemainaa-prabhuvaa': 'Nenemaina Prabhuva',
};
export function songSearchTitle(song: { slug: string; title: string }, language: string) {
  const romanTitle = SEARCH_TITLE_ALIASES[song.slug];
  return {
    romanTitle,
    title: romanTitle
      ? `${song.title} (${romanTitle}) – ${language} Lyrics | Keertana`
      : `${song.title} – ${language} Christian Song Lyrics | Keertana`,
  };
}

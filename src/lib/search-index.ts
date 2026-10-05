/**
 * Build-time search index generator.
 *
 * Produces a compact JSON file: /search-index.json
 * Each entry: { s: slug, t: title, l: titleLower, p: phoneticKey, g: langId }
 *
 * This is loaded lazily on first search focus for instant title search
 * with transliteration support.
 */
import { songs, detectSongLanguage } from './songs';
import { titleToPhoneticKey, teluguToRoman, hindiToRoman } from './transliterate';

export interface SearchEntry {
  /** slug */
  s: string;
  /** original title */
  t: string;
  /** lowercase title */
  l: string;
  /** phonetic key */
  p: string;
  /** language id */
  g: string;
  /** Roman title and existing human-readable slug aliases */
  r: string[];
}

export function buildSearchIndex(): SearchEntry[] {
  return songs.map((song) => {
    const { langId } = detectSongLanguage(song);
    return {
      s: song.slug,
      t: song.title,
      l: song.title.toLowerCase(),
      p: titleToPhoneticKey(song.title),
      g: langId,
      r: [langId === 'telugu' ? teluguToRoman(song.title) : langId === 'hindi' ? hindiToRoman(song.title) : song.title, song.slug.replace(/-/g, ' ')],
    };
  });
}

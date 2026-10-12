import { readFile, writeFile, mkdir, copyFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { teluguToRoman, hindiToRoman } from '../../src/lib/transliterate.ts';
import { normalizeTitle } from '../../public/title-search.js';

const fingerprint = text => createHash('sha256').update(text).digest('hex');
export function generateSlug(title) {
  const roman = /[\u0c00-\u0c7f]/.test(title) ? teluguToRoman(title) : /[\u0900-\u097f]/.test(title) ? hindiToRoman(title) : title;
  return roman.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
export function reviewSong(input, songs) {
  const title = typeof input.title === 'string' ? input.title.trim() : '';
  const lyrics = typeof input.lyrics === 'string' ? input.lyrics.replace(/\r\n?/g, '\n').trim() : '';
  const slug = typeof input.slug === 'string' && input.slug.trim() ? input.slug.trim() : generateSlug(title);
  const errors = [];
  if (!title || title.length > 300) errors.push('Enter a title of 1–300 characters.');
  if (!lyrics || lyrics.length > 100000) errors.push('Enter lyrics of 1–100,000 characters.');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 150) errors.push('Use a slug of up to 150 lowercase letters, numbers and single hyphens.');
  const matching = songs.filter(song => song.slug === slug || normalizeTitle(song.title) === normalizeTitle(title) || (lyrics && song.lyrics.replace(/\s+/g, ' ').trim() === lyrics.replace(/\s+/g, ' ').trim()));
  if (matching.length) errors.push('Possible duplicate found. Review the existing songs before adding this entry.');
  return { song: { slug, title, lyrics }, errors, duplicates: matching.map(({ slug, title }) => ({ slug, title })) };
}
export async function previewSong(file, input) {
  const raw = await readFile(file, 'utf8');
  const songs = JSON.parse(raw);
  if (!Array.isArray(songs)) throw new Error('The catalog must be a JSON array.');
  return { ...reviewSong(input, songs), fingerprint: fingerprint(raw), count: songs.length };
}
export async function addSong(file, input, expectedFingerprint, backupDir) {
  // An exclusive lock serializes writes from multiple local tool instances.
  const lock = `${file}.entry-lock`;
  await writeFile(lock, '', { flag: 'wx' }).catch(() => { throw new Error('Another addition is in progress. Try again shortly.'); });
  let temporary;
  try {
    const raw = await readFile(file, 'utf8');
    if (!expectedFingerprint || fingerprint(raw) !== expectedFingerprint) throw new Error('The catalog changed. Preview this song again before adding it.');
    const songs = JSON.parse(raw);
    const review = reviewSong(input, songs);
    if (review.errors.length) throw new Error(review.errors.join(' '));
    await mkdir(backupDir, { recursive: true });
    const backup = path.join(backupDir, `songs-${Date.now()}-${randomUUID()}.json`);
    await copyFile(file, backup);
    temporary = `${file}.${randomUUID()}.tmp`;
    await writeFile(temporary, `${JSON.stringify([...songs, review.song], null, 2)}\n`, { flag: 'wx' });
    // Catch external edits while the temporary file was prepared.
    if (fingerprint(await readFile(file, 'utf8')) !== expectedFingerprint) throw new Error('The catalog changed. Preview again; no song was added.');
    await rename(temporary, file);
    temporary = undefined;
    return { song: review.song, count: songs.length + 1, backup: path.basename(backup) };
  } finally {
    if (temporary) await unlink(temporary).catch(() => {});
    await unlink(lock);
  }
}

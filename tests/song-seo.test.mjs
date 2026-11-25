import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../src/data/songs.json' with { type: 'json' };
import { searchTitles } from '../public/title-search.js';
import { getSongReference, songSearchTitle, teluguSongDescription } from '../src/lib/song-seo.ts';
test('priority Telugu song titles include native and curated Roman names', () => {
  const meta = songSearchTitle({ slug: 'neethi-sooryudaa-yesu', title: 'నీతి సూర్యుడా యేసు' }, 'Telugu');
  assert.match(meta.title, /నీతి సూర్యుడా యేసు/);
  assert.match(meta.title, /Neethi Suryuda Yesu/);
  assert.match(meta.title, /Telugu Lyrics/);
});
test('English songs retain their real language and existing title', () => {
  assert.deepEqual(songSearchTitle({ slug: 'how-great-is-our-god', title: 'How Great is our God' }, 'English'), {
    romanTitle: undefined, romanTitleLang: 'und-Latn', title: 'How Great is our God – English Christian Song Lyrics | Keertana',
  });
});

test('Telugu summaries choose a lyric beyond the title and mention only available reading options', () => {
  const song = { title: 'నా జీవితం', lyrics: 'పాట రచయిత: రచయిత\nనా జీవితం (2)\nనీ చరణాల సేవకే (2)' };
  assert.equal(teluguSongDescription(song, 'Naa Jeevitham', true), 'Naa Jeevitham — Telugu lyrics with transliteration. “నీ చరణాల సేవకే”');
  assert.equal(teluguSongDescription({ ...song, lyrics: song.title }, undefined, false), 'నా జీవితం — Telugu lyrics.');
});

test('curated refrain searches point to the song in either script while the source lines are present', () => {
  const song = catalog.find(({ slug }) => slug === 'arhatha-lekunnaa-preminchaavu');
  const { refrains, recording } = getSongReference(song);
  assert.equal(refrains.length, 2);
  const aliases = [...refrains.flatMap(({ native, roman }) => [native, roman]), recording.title];
  const entry = { s: song.slug, t: song.title, g: 'telugu', r: aliases };
  for (const phrase of aliases) assert.equal(searchTitles([entry], phrase)[0], entry);
  assert.deepEqual(getSongReference({ ...song, lyrics: '' }).refrains, []);
});

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { getRomanReading } from '../src/lib/roman-reading.ts';
import { worshipCollections } from '../src/lib/worship-collections.ts';
const out = process.argv[2] || 'dist';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
let checkedRoman = 0;
for (const song of songs) {
  const reading = getRomanReading(song.lyrics);
  const html = await readFile(path.join(out, 'song', song.slug, 'index.html'), 'utf8');
  if (reading) {
    checkedRoman++;
    assert.ok(html.includes('id="roman-lyrics-body"'), `No Roman panel: ${song.slug}`);
    assert.ok(html.includes('Automatic transliteration'), `No generated-text label: ${song.slug}`);
    assert.ok(html.includes(`lang="${reading.lang}"`), `Wrong Roman language: ${song.slug}`);
  }
  const api = JSON.parse(await readFile(path.join(out, 'api', 'song', `${song.slug}.json`), 'utf8'));
  assert.equal(api.lyrics, song.lyrics);
  assert.equal(api.romanReading?.text || null, reading?.text || null);
}
const sitemap = await readFile(path.join(out, 'sitemap-0.xml'), 'utf8');
const homepage = await readFile(path.join(out, 'index.html'), 'utf8');
const collectionsIndex = await readFile(path.join(out, 'collections', 'index.html'), 'utf8');
assert.ok(homepage.includes('id="worship-collections"'), 'Homepage collection section is missing');
for (const collection of worshipCollections) {
  const route = `/collections/${collection.slug}/`;
  assert.ok(homepage.includes(`href="${route}"`), `Missing homepage collection card: ${route}`);
  assert.ok(collectionsIndex.includes(`href="${route}"`), `Missing collections index card: ${route}`);
  const html = await readFile(path.join(out, 'collections', collection.slug, 'index.html'), 'utf8');
  assert.ok(sitemap.includes(route), `Collection not in sitemap: ${route}`);
  assert.ok(!/<meta[^>]+name="robots"[^>]+noindex/.test(html));
  for (const slug of collection.songs) {
    assert.ok(html.includes(`/song/${slug}/`), `Collection misses song ${slug}`);
    const reader = await readFile(path.join(out, 'song', slug, 'index.html'), 'utf8');
    assert.ok(reader.includes(route), `Missing return link ${slug}`);
  }
}
console.log(JSON.stringify({ songs: songs.length, romanReadings: checkedRoman, collections: worshipCollections.length, failures: 0 }, null, 2));

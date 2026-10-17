import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { getRomanReading } from '../src/lib/roman-reading.ts';
import { worshipCollections, featuredWorshipCollections, COLLECTION_PAGE_SIZE, collectionPageUrl } from '../src/lib/worship-collections.ts';
const out = process.argv[2] || 'dist';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
let checkedRoman = 0;
for (const song of songs) {
  const reading = getRomanReading(song.lyrics);
  const html = await readFile(path.join(out, 'song', song.slug, 'index.html'), 'utf8');
  if (reading) {
    checkedRoman++;
    assert.ok(html.includes('id="roman-lyrics-body"'), `No Roman panel: ${song.slug}`);
    assert.ok(html.includes('Generated from the original lyrics'), `No generated-text label: ${song.slug}`);
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
  if (featuredWorshipCollections.includes(collection)) assert.ok(homepage.includes(`href="${route}"`), `Missing homepage collection card: ${route}`);
  assert.ok(collectionsIndex.includes(`href="${route}"`), `Missing collections index card: ${route}`);
  for (let page = 1; page <= Math.ceil(collection.songs.length / COLLECTION_PAGE_SIZE); page++) {
    const pageRoute = collectionPageUrl(collection.slug, page);
    const html = await readFile(path.join(out, pageRoute, 'index.html'), 'utf8');
    assert.ok(sitemap.includes(pageRoute), `Collection not in sitemap: ${pageRoute}`);
    assert.ok(html.includes(`rel="canonical" href="https://keertana.vercel.app${pageRoute}"`), `Wrong canonical: ${pageRoute}`);
    assert.ok(!/<meta[^>]+name="robots"[^>]+noindex/.test(html));
    const selected = collection.songs.slice((page-1)*COLLECTION_PAGE_SIZE,page*COLLECTION_PAGE_SIZE);
    for (const slug of selected) assert.ok(html.includes(`/song/${slug}/`), `Collection page misses song ${slug}`);
    if (page*COLLECTION_PAGE_SIZE < collection.songs.length) assert.ok(html.includes(`href="${collectionPageUrl(collection.slug,page+1)}"`), 'Missing next page');
  }
  for (const slug of collection.songs) {
    const reader = await readFile(path.join(out, 'song', slug, 'index.html'), 'utf8');
    assert.ok(reader.includes(route), `Missing return link ${slug}`);
  }
}
console.log(JSON.stringify({ songs: songs.length, romanReadings: checkedRoman, collections: worshipCollections.length, failures: 0 }, null, 2));

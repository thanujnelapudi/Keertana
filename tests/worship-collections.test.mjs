import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { worshipCollections, relatedSongSlugs, collectionsForSong } from '../src/lib/worship-collections.ts';
const songs = JSON.parse(readFileSync(new URL('../src/data/songs.json', import.meta.url)));
const ids = new Set(songs.map(song => song.slug));
test('Collections contain unique existing songs and useful editorial context', () => {
  assert.equal(new Set(worshipCollections.map(c => c.slug)).size, worshipCollections.length);
  for (const c of worshipCollections) {
    assert.ok(c.intro.length > 80); assert.ok(c.guidance.length > 80);
    assert.ok(c.songs.length >= 5); assert.equal(new Set(c.songs).size, c.songs.length);
    for (const s of c.songs) assert.ok(ids.has(s), `Missing ${s}`);
  }
});
test('Related songs use collection membership, exclude self, and stay bounded', () => {
  const slug = worshipCollections[0].songs[0];
  const related = relatedSongSlugs(slug);
  assert.ok(related.length > 0 && related.length <= 4); assert.ok(!related.includes(slug));
  assert.equal(new Set(related).size, related.length);
  assert.equal(collectionsForSong(slug)[0].slug, 'christmas');
  assert.deepEqual(relatedSongSlugs('not-in-a-collection'), []);
});

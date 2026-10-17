import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { worshipCollections, relatedSongSlugs, collectionsForSong, collectionDecisions, COLLECTION_PAGE_SIZE, collectionPageUrl } from '../src/lib/worship-collections.ts';
import { suggestSongCollections } from '../src/lib/song-themes.ts';
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
  assert.equal(collectionsForSong(slug)[0].slug, worshipCollections[0].slug);
  assert.deepEqual(relatedSongSlugs('not-in-a-collection'), []);
});

test('Every Telugu song has a collection and paginated URLs cover each membership exactly once', () => {
  const telugu = songs.filter(song => /^[\u0c00-\u0c7f]/.test(song.title));
  assert.equal(collectionDecisions.length, telugu.length);
  for (const song of telugu) assert.ok(collectionsForSong(song.slug).length, song.slug);
  for (const collection of worshipCollections) {
    const pages = Array.from({ length: Math.ceil(collection.songs.length / COLLECTION_PAGE_SIZE) }, (_, i) => collection.songs.slice(i*COLLECTION_PAGE_SIZE, (i+1)*COLLECTION_PAGE_SIZE));
    assert.deepEqual(pages.flat(), collection.songs);
    assert.equal(collectionPageUrl(collection.slug, 1), `/collections/${collection.slug}/`);
    assert.equal(collectionPageUrl(collection.slug, 2), `/collections/${collection.slug}/page/2/`);
  }
});

test('Incidental later verses cannot force a seasonal classification', () => {
  const song = { slug:'test', title:'దేవా', lyrics:'నీతో నడిచెదను\n\nక్రిస్మస్ బేత్లెహేము యేసు పుట్టెను' };
  assert.ok(!suggestSongCollections(song).includes('christmas'));
  assert.ok(suggestSongCollections({ ...song, title:'క్రిస్మస్ ఆనందం' }).includes('christmas'));
});

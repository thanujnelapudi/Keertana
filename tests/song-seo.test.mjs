import test from 'node:test';
import assert from 'node:assert/strict';
import { songSearchTitle } from '../src/lib/song-seo.ts';
test('priority Telugu song titles include native and curated Roman names', () => {
  const meta = songSearchTitle({ slug: 'neethi-sooryudaa-yesu', title: 'నీతి సూర్యుడా యేసు' }, 'Telugu');
  assert.match(meta.title, /నీతి సూర్యుడా యేసు/);
  assert.match(meta.title, /Neethi Suryuda Yesu/);
  assert.match(meta.title, /Telugu Lyrics/);
});
test('English songs retain their real language and existing title', () => {
  assert.deepEqual(songSearchTitle({ slug: 'how-great-is-our-god', title: 'How Great is our God' }, 'English'), {
    romanTitle: undefined, title: 'How Great is our God – English Christian Song Lyrics | Keertana',
  });
});

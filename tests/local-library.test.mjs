import test from 'node:test';
import assert from 'node:assert/strict';
import { readLibrary, updateLibrary, LIBRARY_KEY, RECENT_LIMIT } from '../public/local-library.js';
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
test('save/remove persists independently of recent history', () => {
  const s = storage();
  updateLibrary(s, 'save', 'amazing-grace');
  updateLibrary(s, 'save', 'amazing-grace');
  assert.deepEqual(readLibrary(s).saved, ['amazing-grace']);
  assert.deepEqual(readLibrary(s).recent, []);
  updateLibrary(s, 'view', 'aaj-kaa-din');
  assert.deepEqual(readLibrary(s).saved, ['amazing-grace']);
  updateLibrary(s, 'remove', 'amazing-grace');
  assert.deepEqual(readLibrary(s).saved, []);
  assert.deepEqual(readLibrary(s).recent, ['aaj-kaa-din']);
});
test('A B C A becomes A C B and history stays bounded', () => {
  const s = storage();
  for (const slug of ['a', 'b', 'c', 'a']) updateLibrary(s, 'view', slug);
  assert.deepEqual(readLibrary(s).recent, ['a', 'c', 'b']);
  for (let n = 0; n < 12; n++) updateLibrary(s, 'view', `song-${n}`);
  assert.equal(readLibrary(s).recent.length, RECENT_LIMIT);
  assert.equal(readLibrary(s).recent[0], 'song-11');
  assert.equal(readLibrary(s).recent.at(-1), 'song-4');
});
test('malformed storage and invalid slugs are handled safely', () => {
  const s = storage();
  s.setItem(LIBRARY_KEY, '{bad json');
  assert.deepEqual(readLibrary(s).recent, []);
  s.setItem(LIBRARY_KEY, JSON.stringify({ saved: ['a','a',null,'../bad'], recent: 'bad' }));
  assert.deepEqual(readLibrary(s).saved, ['a']);
  assert.throws(() => updateLibrary(s, 'save', '../bad'));
});
test('failed persistence never reports success or loses previous saved data', () => {
  const s = storage();
  updateLibrary(s, 'save', 'a');
  s.setItem = () => { throw new Error('Storage blocked'); };
  assert.throws(() => updateLibrary(s, 'save', 'b'));
  assert.deepEqual(readLibrary(s).saved, ['a']);
});

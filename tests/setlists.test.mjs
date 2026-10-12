import test from 'node:test';
import assert from 'node:assert/strict';
import { readSetlists, changeSetlist, SETLIST_KEY } from '../public/setlists.js';
const storage = () => { const m = new Map(); return { getItem: k => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
test('ordered setlists preserve saved songs and survive reloads', () => {
  const s = storage(); s.setItem('keertana-library-v1', 'existing data');
  changeSetlist(s, { type: 'create', id: 'one', name: 'Sunday' });
  for (const slug of ['amazing-grace', 'aaj-kaa-din']) changeSetlist(s, { type: 'add', id: 'one', slug });
  changeSetlist(s, { type: 'move', id: 'one', slug: 'aaj-kaa-din', direction: -1 });
  assert.deepEqual(readSetlists(s)[0].songs, ['aaj-kaa-din', 'amazing-grace']);
  assert.throws(() => changeSetlist(s, { type: 'add', id: 'one', slug: 'amazing-grace' }), /already/);
  changeSetlist(s, { type: 'rename', id: 'one', name: 'Evening' });
  changeSetlist(s, { type: 'remove', id: 'one', slug: 'amazing-grace' });
  assert.equal(readSetlists(s)[0].name, 'Evening');
  assert.deepEqual(readSetlists(s)[0].songs, ['aaj-kaa-din']);
  changeSetlist(s, { type: 'delete', id: 'one' }); assert.deepEqual(readSetlists(s), []);
  assert.equal(s.getItem('keertana-library-v1'), 'existing data');
});
test('corrupt data and failed writes never silently erase lists', () => {
  const s = storage(); s.setItem(SETLIST_KEY, '{broken');
  assert.throws(() => changeSetlist(s, { type: 'create', id: 'a', name: 'Test' }));
  assert.equal(s.getItem(SETLIST_KEY), '{broken');
  s.setItem(SETLIST_KEY, JSON.stringify({ version: 1, lists: [{ id: 'a', name: 'Test', songs: [] }] }));
  s.setItem = () => { throw new Error('Quota'); };
  assert.throws(() => changeSetlist(s, { type: 'add', id: 'a', slug: 'test' }), /Quota/);
  assert.deepEqual(readSetlists(s)[0].songs, []);
});
test('invalid names, boundary moves and missing lists are rejected', () => {
  const s = storage(); assert.throws(() => changeSetlist(s, { type: 'create', id: 'a', name: ' ' }));
  changeSetlist(s, { type: 'create', id: 'a', name: 'Test' });
  changeSetlist(s, { type: 'add', id: 'a', slug: 'song' });
  assert.throws(() => changeSetlist(s, { type: 'move', id: 'a', slug: 'song', direction: -1 }));
  assert.throws(() => changeSetlist(s, { type: 'add', id: 'a', slug: '../bad' }));
  assert.throws(() => changeSetlist(s, { type: 'add', id: 'missing', slug: 'song' }));
});

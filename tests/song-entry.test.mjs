import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { generateSlug, reviewSong, previewSong, addSong } from '../scripts/song-entry/catalog.mjs';
import { createEntryServer } from '../scripts/song-entry/server.mjs';

test('slug generation and duplicate checks handle multilingual titles and whitespace', () => {
  assert.equal(generateSlug('Amazing Grace!'), 'amazing-grace');
  assert.match(generateSlug('దీవించావే'), /^[a-z0-9-]+$/);
  assert.match(generateSlug('आज का दिन'), /^[a-z0-9-]+$/);
  const catalog = [{ slug: 'amazing-grace', title: 'Amazing Grace', lyrics: 'Line one\nLine two' }];
  for (const input of [{ title: 'New', slug: 'amazing-grace', lyrics: 'Other' }, { title: ' AMAZING   GRACE ', lyrics: 'Other' }, { title: 'Different', lyrics: 'Line one\n\nLine two' }]) assert.ok(reviewSong(input, catalog).duplicates.length);
  assert.ok(reviewSong({ title: 'New', slug: '../escape', lyrics: 'Words' }, catalog).errors.length);
});
test('local entry endpoints reject cross-origin and tokenless writes, and add only reviewed entries', async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'keertana-entry-http-'));
  const file = path.join(folder, 'songs.json');
  await writeFile(file, '[]');
  const server = createEntryServer({ catalog: file, backupDir: path.join(folder, 'backups') });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const page = await (await fetch(origin)).text();
    const token = page.match(/const token='([a-f0-9]+)'/)[1];
    const post = (route, body, headers) => fetch(origin + route, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
    const input = { title: 'Test hymn', lyrics: 'One\n\nTwo' };
    assert.equal((await post('/add', input, { Origin: origin })).status, 403);
    assert.equal((await post('/add', input, { Origin: 'https://untrusted.example', 'X-Entry-Token': token })).status, 403);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), []);
    const headers = { Origin: origin, 'X-Entry-Token': token };
    const preview = await (await post('/preview', input, headers)).json();
    assert.equal((await post('/add', { ...input, fingerprint: preview.fingerprint }, headers)).status, 200);
    assert.equal(JSON.parse(await readFile(file, 'utf8')).length, 1);
    assert.equal((await post('/add', { ...input, fingerprint: preview.fingerprint }, headers)).status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); await rm(folder, { recursive: true, force: true }); }
});
test('add backs up the original, preserves all records and verse spacing, and rejects stale previews', async () => {
  const folder = await mkdtemp(path.join(os.tmpdir(), 'keertana-entry-'));
  const file = path.join(folder, 'songs.json');
  const backups = path.join(folder, 'backups');
  const original = [{ slug: 'old', title: 'Old song', lyrics: 'Original' }];
  try {
    await writeFile(file, JSON.stringify(original));
    const input = { title: 'New song', lyrics: 'One\n\nTwo' };
    const preview = await previewSong(file, input);
    const result = await addSong(file, input, preview.fingerprint, backups);
    assert.equal(result.count, 2);
    assert.deepEqual(JSON.parse(await readFile(file, 'utf8')), [...original, preview.song]);
    const backupFiles = await readdir(backups);
    assert.deepEqual(JSON.parse(await readFile(path.join(backups, backupFiles[0]), 'utf8')), original);
    await assert.rejects(addSong(file, { title: 'Another', lyrics: 'Another' }, preview.fingerprint, backups), /changed/);
    const duplicate = await previewSong(file, input);
    await assert.rejects(addSong(file, input, duplicate.fingerprint, backups), /duplicate/);
    assert.equal(JSON.parse(await readFile(file, 'utf8')).length, 2);
  } finally { await rm(folder, { recursive: true, force: true }); }
});

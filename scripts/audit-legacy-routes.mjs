import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const output = process.argv[2] || 'dist';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.equal(config.redirects.at(-1).source, '/songs/:slug');
assert.equal(config.redirects.at(-1).destination, '/song/:slug/');
assert.ok(config.redirects.every(r => r.statusCode === 301));
assert.ok(config.redirects.findIndex(r => r.source.includes(':lang')) < config.redirects.length - 1);
const failures = [];
for (const { slug } of songs) {
  const html = await readFile(path.join(output, 'songs', slug, 'index.html'), 'utf8').catch(() => '');
  if (!html.includes(`/song/${slug}/`) || !html.includes('http-equiv="refresh"')) failures.push(slug);
}
const alias = await readFile(path.join(output, 'songs/athyunnatha-simhasanamupai/index.html'), 'utf8');
assert.ok(alias.includes('/song/athyunnatha-simhaasanamupai/'));
for (const language of ['telugu', 'hindi', 'english']) {
  const html = await readFile(path.join(output, 'songs', language, 'index.html'), 'utf8');
  assert.ok(html.includes(`/${language}/`));
}
const sitemap = await readFile(path.join(output, 'sitemap-0.xml'), 'utf8');
assert.ok(!sitemap.includes('/songs/'));
console.log(JSON.stringify({ checkedSongRedirects: songs.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;

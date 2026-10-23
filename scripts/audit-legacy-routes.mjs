import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { LEGACY_SONG_ALIASES } from '../src/lib/legacy-song-aliases.ts';
const output = process.argv[2] || 'dist';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
assert.equal(config.redirects.at(-1).source, '/songs/:slug/');
assert.ok(config.redirects.some(r => r.source === '/songs/:slug'));
assert.equal(config.redirects.at(-1).destination, '/song/:slug/');
assert.ok(config.redirects.every(r => r.statusCode === 301));
assert.ok(config.redirects.findIndex(r => r.source.includes(':lang')) < config.redirects.length - 1);
const failures = [];
for (const { slug } of songs) {
  const html = await readFile(path.join(output, 'songs', slug, 'index.html'), 'utf8').catch(() => '');
  if (!html.includes(`/song/${slug}/`) || !html.includes('http-equiv="refresh"')) failures.push(slug);
}
for (const [legacy,canonical] of Object.entries(LEGACY_SONG_ALIASES)) {
  assert.ok(songs.some(song=>song.slug===canonical), `Missing alias destination: ${canonical}`);
  const alias = await readFile(path.join(output,'songs',legacy,'index.html'),'utf8');
  assert.ok(alias.includes(`/song/${canonical}/`));
  for (const slash of ['', '/']) assert.equal(config.redirects.find(rule=>rule.source===`/songs/${legacy}${slash}`)?.destination, `/song/${canonical}/`);
}
for (const source of ['/songs','/songs/']) assert.equal(config.redirects.find(rule=>rule.source===source)?.destination,'/');
for (const language of ['telugu', 'hindi', 'english']) {
  const html = await readFile(path.join(output, 'songs', language, 'index.html'), 'utf8');
  assert.ok(html.includes(`/${language}/`));
}
const sitemap = await readFile(path.join(output, 'sitemap-0.xml'), 'utf8');
assert.ok(!sitemap.includes('/songs/'));
console.log(JSON.stringify({ checkedSongRedirects: songs.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;

import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const directory = process.argv[2] || 'dist';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
for (const song of songs) {
  const html = await readFile(path.join(directory, 'song', song.slug, 'index.html'), 'utf8');
  assert.ok(!html.includes('data-comments-enabled') && !html.includes('song-comments-heading'), `Discussion remains: ${song.slug}`);
  assert.ok(html.includes(`/contribute/report/?song=${song.slug}`), `Missing correction fallback: ${song.slug}`);
  assert.ok(!html.includes('/comments-demo/') && !html.includes('id="comment-body"'), `Demo/form remains: ${song.slug}`);
  assert.ok(!html.includes('SUPABASE_SERVICE_ROLE_KEY') && !html.includes('TURNSTILE_SECRET_KEY'), `Server-only configuration in page: ${song.slug}`);
}
const privacy = await readFile(path.join(directory, 'privacy', 'index.html'), 'utf8');
assert.ok(!privacy.includes('song-discussion') && !privacy.includes('interest-confirmation'), 'Retired discussion wording remains');
const sitemap = await readFile(path.join(directory,'sitemap-0.xml'),'utf8');
assert.ok(!sitemap.includes('/comments-demo/'),'Retired demo must not be in sitemap');
for (const route of ['comments-demo','comments-demo/interest']) await assert.rejects(access(path.join(directory,route,'index.html')));
console.log(JSON.stringify({ songs:songs.length, commentsRemoved:true, demoRoutesRemoved:true, failures:0 }));

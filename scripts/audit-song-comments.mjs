import { readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const directory = process.argv[2] || 'dist';
const enabled = process.argv[3] === 'enabled';
const songs = JSON.parse(await readFile('src/data/songs.json', 'utf8'));
for (const song of songs) {
  const html = await readFile(path.join(directory, 'song', song.slug, 'index.html'), 'utf8');
  assert.ok(html.includes(`data-comments-enabled="${enabled}"`), `Wrong discussion mode: ${song.slug}`);
  assert.ok(html.includes(`/contribute/report/?song=${song.slug}`), `Missing correction fallback: ${song.slug}`);
  assert.equal(html.includes('id="comment-body"'), enabled, `Inactive/missing comment form: ${song.slug}`);
  if (enabled) assert.ok(html.includes('data-submit-comment'), `Missing submission action: ${song.slug}`);
  assert.ok(!html.includes('SUPABASE_SERVICE_ROLE_KEY') && !html.includes('TURNSTILE_SECRET_KEY'), `Server-only configuration in page: ${song.slug}`);
}
const privacy = await readFile(path.join(directory, 'privacy', 'index.html'), 'utf8');
assert.equal(privacy.includes('id="song-discussion"'), enabled, 'Privacy wording does not match discussion mode');
console.log(JSON.stringify({ songs: songs.length, commentsEnabled: enabled, failures: 0 }));

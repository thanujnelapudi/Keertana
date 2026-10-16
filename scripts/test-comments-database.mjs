import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
// Optional isolated test dependency, never included in the site's package.json.
const modulePath = path.resolve(process.argv[2] || '.comments-check/node_modules/@electric-sql/pglite/dist/index.js');
const { PGlite } = await import(pathToFileURL(modulePath).href);
const db = new PGlite();
try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(await readFile('supabase/migrations/202610160001_song_comments.sql', 'utf8'));
  await db.exec(await readFile('supabase/tests/song_comments.sql', 'utf8'));
  for (const role of ['anon', 'authenticated']) {
    await db.exec(`set role ${role}`);
    try {
      await assert.rejects(db.query('select * from keertana_private.song_comments'), error => error.code === '42501');
      await assert.rejects(db.query("select public.keertana_read_comments('amazing-grace')"), error => error.code === '42501');
      await assert.rejects(db.query("select public.keertana_submit_comment(gen_random_uuid(), 'amazing-grace', 'Test reader', 'Bypass attempt.', '')"), error => error.code === '42501');
    } finally { await db.exec('reset role'); }
  }
  console.log('Local PostgreSQL: migration, moderation isolation, pagination, limits, idempotency and anonymous/authenticated access denials passed.');
} finally { await db.close(); }

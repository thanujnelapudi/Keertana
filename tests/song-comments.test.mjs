import test from 'node:test';
import assert from 'node:assert/strict';
import { createCommentsHandler, validateComment } from '../supabase/functions/song-comments/handler.mjs';
import { publicReference, renderComment } from '../src/scripts/song-comments.js';
const origin = 'https://keertana.vercel.app';
const id = 'b2f72a4f-d672-4996-9704-f92ae58a8535';
const valid = { song: 'amazing-grace', displayName: 'A reader', body: 'Please check the pronunciation.', referenceUrl: 'https://example.org/song', token: 'test-token', requestId: id, consent: true };
function setup(overrides = {}) {
  const writes = [];
  const handler = createCommentsHandler({ origins: [origin], knownSongs: async () => new Set(['amazing-grace']), verifyToken: async () => ({ success: true, hostname: 'keertana.vercel.app', action: 'song-comment' }), readApproved: async () => [], submitPending: async data => writes.push(data), ...overrides });
  const post = (value = valid, headers = {}) => handler(new Request('https://example.test/song-comments', { method: 'POST', headers: { origin, 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(value) }));
  const get = query => handler(new Request(`https://example.test/song-comments?${query}`, { headers: { origin } }));
  return { handler, writes, post, get };
}
test('Comments validate multilingual text, consent, length and safe reference URLs', () => {
  assert.deepEqual(validateComment({ ...valid, displayName: 'దాసు', body: 'ఈ పాటలో ఈ పదాన్ని సరిచూడండి.' }).errors, {});
  assert.ok(validateComment({ ...valid, referenceUrl: `https://example.org/${'అ'.repeat(200)}` }).errors.referenceUrl);
  for (const value of [{ ...valid, body: 'tiny' }, { ...valid, body: 'x'.repeat(2001) }, { ...valid, consent: false }, { ...valid, token: '' }, { ...valid, displayName: 'spoof\u202ename' }, { ...valid, website: 'https://spam.test' }, { ...valid, referenceUrl: 'javascript:alert(1)' }, { ...valid, referenceUrl: 'https://user:secret@example.org/' }]) assert.ok(Object.keys(validateComment(value).errors).length);
});
test('Comments reject foreign/missing origins and unsupported methods without touching storage', async () => {
  const s = setup();
  assert.equal((await s.post(valid, { origin: 'https://other.test' })).status, 403);
  assert.equal((await s.handler(new Request('https://example.test', { method: 'DELETE', headers: { origin } }))).status, 405);
  assert.equal((await s.handler(new Request('https://example.test'))).status, 403);
  const options = await s.handler(new Request('https://example.test', { method: 'OPTIONS', headers: { origin } }));
  assert.equal(options.status, 204); assert.equal(options.headers.get('access-control-allow-origin'), origin); assert.equal(s.writes.length, 0);
});
test('Only validated known-song submissions receive pending receipts; client publication fields are ignored', async () => {
  const s = setup(); const response = await s.post({ ...valid, status: 'approved', approved_at: '2026-01-01', moderation_note: 'attack' });
  assert.equal(response.status, 202); assert.equal((await response.json()).status, 'pending');
  assert.equal(s.writes.length, 1); assert.equal(s.writes[0].status, undefined); assert.equal(s.writes[0].approved_at, undefined);
  assert.equal((await s.post({ ...valid, song: 'missing-song' })).status, 404);
  assert.equal((await s.post({ ...valid, consent: false })).status, 400); assert.equal(s.writes.length, 1);
});
test('Turnstile failure, wrong hostname and wrong action never write comments', async () => {
  for (const result of [{ success: false }, { success: true, hostname: 'evil.test', action: 'song-comment' }, { success: true, hostname: 'keertana.vercel.app', action: 'login' }]) {
    const s = setup({ verifyToken: async () => result }); assert.equal((await s.post()).status, 400); assert.equal(s.writes.length, 0);
  }
});
test('Provider failures, limits, and draft collisions never produce a false receipt or leak errors', async () => {
  const broken = setup({ submitPending: async () => { throw Error('secret database details'); } });
  const unavailable = await broken.post(); assert.equal(unavailable.status, 503); assert.doesNotMatch(await unavailable.text(), /secret database/);
  for (const [code, status] of [['COMMENT_RATE_LIMIT', 429], ['COMMENT_DRAFT_CHANGED', 409]]) {
    const s = setup({ submitPending: async () => { throw { code }; } }); assert.equal((await s.post()).status, status);
  }
  assert.equal((await setup({ knownSongs: async () => { throw Error(); } }).get('song=amazing-grace')).status, 503);
  assert.equal((await setup({ verifyToken: async () => { throw Error(); } }).post()).status, 503);
});
test('Large, malformed and non-JSON bodies are rejected before providers are contacted', async () => {
  let calls = 0; const s = setup({ knownSongs: async () => { calls++; return new Set(); } });
  assert.equal((await s.post({ ...valid, body: 'x'.repeat(17000) })).status, 413);
  assert.equal((await s.post(valid, { 'Content-Type': 'text/plain' })).status, 415);
  const malformed = new Request('https://example.test', { method: 'POST', headers: { origin, 'Content-Type': 'application/json' }, body: '{nope' });
  assert.equal((await s.handler(malformed)).status, 400); assert.equal(calls, 0);
});
test('Approved comment responses expose only public fields and preserve pagination boundaries', async () => {
  let cursor;
  const rows = Array.from({ length: 11 }, (_, i) => ({ id, displayName: `Reader ${i}`, body: 'A useful note.', referenceUrl: '', createdAt: `2026-10-${String(27-i).padStart(2,'0')}T00:00:00+00:00`, moderation_note: 'PRIVATE', request_id: 'PRIVATE' }));
  const s = setup({ readApproved: async (_song, value) => { cursor = value; return rows; } });
  const response = await s.get('song=amazing-grace'); const result = await response.json();
  assert.equal(result.comments.length, 10); assert.equal(result.nextCursor.at, rows[9].createdAt); assert.doesNotMatch(JSON.stringify(result), /PRIVATE|moderation_note|request_id/);
  await s.get(`song=amazing-grace&cursor=${encodeURIComponent(JSON.stringify(result.nextCursor))}`); assert.deepEqual(cursor, result.nextCursor);
  assert.equal((await s.get('song=amazing-grace&cursor=bad')).status, 400); assert.equal((await s.get('song=not-a-song')).status, 404);
});
test('Reference links never accept executable schemes or embedded credentials', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'http://example.org', 'https://name:password@example.org']) assert.equal(publicReference(value), null);
  assert.equal(publicReference('https://example.org/song'), 'https://example.org/song');
});
test('Rendering keeps hostile names and HTML inert and marks public links as user content', () => {
  const document = { createElement(tag) { return { tag, children: [], append(...nodes) { this.children.push(...nodes); } }; } };
  const item = renderComment(document, { displayName: '<img src=x onerror=alert(1)>', body: '<script>alert(1)</script>', referenceUrl: 'https://example.org', createdAt: '2026-10-16T00:00:00Z' });
  assert.equal(item.children[0].children[0].textContent, '<img src=x onerror=alert(1)>');
  assert.equal(item.children[1].textContent, '<script>alert(1)</script>'); assert.equal(item.children[1].innerHTML, undefined);
  assert.equal(item.children[2].rel, 'ugc nofollow noopener noreferrer');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { prepareContributionEmail, CONTACT_EMAIL } from '../src/lib/contribution-email.mjs';

test('report email encodes multilingual details and includes song context without modifying the draft', () => {
  const values = { song: 'deevinchaave', songTitle: 'దీవించావే', issue: 'Incorrect lyrics', description: 'Line 1 & 2?\nప్రభూ', correction: 'First\n\nSecond', email: 'person@example.com', unexpected: 'omit me' };
  const snapshot = structuredClone(values);
  const result = prepareContributionEmail('report', values, 'https://keertana.vercel.app/report');
  const url = new URL(result.href);
  assert.equal(url.pathname, CONTACT_EMAIL);
  assert.equal(url.searchParams.get('body'), result.body);
  assert.ok(result.body.includes('Line 1 & 2?\nప్రభూ'));
  assert.ok(result.body.includes('First\n\nSecond'));
  assert.ok(result.body.includes('https://keertana.vercel.app/song/deevinchaave/'));
  assert.ok(!result.body.includes('omit me'));
  assert.deepEqual(values, snapshot);
});
test('long lyrics retain the whole message for copying rather than truncating a mailto', () => {
  const lyrics = 'యేసయ్య\n'.repeat(500);
  const result = prepareContributionEmail('submit', { title: 'Song', lyrics }, 'https://keertana.vercel.app');
  assert.equal(result.requiresCopy, true);
  assert.equal(new URL(result.href).searchParams.has('body'), false);
  assert.ok(result.body.includes(lyrics.trim()));
});
test('team email retains multiple interests and unsupported kinds are rejected', () => {
  const result = prepareContributionEmail('join', { name: 'Contributor', interests: ['Proofreading', 'Translation'] }, 'https://keertana.vercel.app');
  assert.ok(result.body.includes('Proofreading, Translation'));
  assert.throws(() => prepareContributionEmail('unknown', {}, 'https://keertana.vercel.app'));
});

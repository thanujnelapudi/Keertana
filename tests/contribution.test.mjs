import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContribution, sendContribution, INTERESTS } from '../src/lib/contribution.mjs';
const context = { languages: ['telugu', 'hindi', 'english'], songSlugs: ['amazing-grace', 'aaj-kaa-din'] };
test('song submission requires content, a supported language and acknowledgement', () => {
  assert.deepEqual(Object.keys(validateContribution('submit', {}, context)), ['title', 'lyrics', 'language', 'acknowledgement']);
  for (const language of context.languages) {
    assert.deepEqual(validateContribution('submit', { title: 'యేసు', lyrics: 'Verse one\n\nVerse two', language, acknowledgement: 'yes' }, context), {});
  }
  assert.ok(validateContribution('submit', { title: ' ', lyrics: '\n', language: 'te', acknowledgement: 'no' }, context).language);
});
test('report must reference a known song and recognized issue with a description', () => {
  assert.deepEqual(validateContribution('report', { song: 'aaj-kaa-din', issue: 'Incorrect lyrics', description: 'Second verse has a typo' }, context), {});
  const errors = validateContribution('report', { song: 'unknown', issue: 'unknown', description: ' ' }, context);
  assert.deepEqual(Object.keys(errors), ['song', 'issue', 'description']);
});
test('copyright concerns reuse the validated song reporting flow', () => {
  assert.deepEqual(validateContribution('report', { song: 'amazing-grace', issue: 'Copyright / content concern', description: 'Please verify this source and attribution.' }, context), {});
});
test('optional email is validated without requiring it for song submissions or reports', () => {
  assert.ok(validateContribution('report', { email: 'invalid@', song: 'amazing-grace', issue: 'Other', description: 'Details' }, context).email);
  assert.equal(validateContribution('report', { email: ' person@example.org ' }, context).email, undefined);
});
test('team supports multiple interests and validates optional website links', () => {
  const values = { name: 'Contributor', email: 'person@example.org', interests: INTERESTS.slice(0, 3) };
  assert.deepEqual(validateContribution('join', values, context), {});
  assert.ok(validateContribution('join', { ...values, interests: [] }, context).interests);
  for (const portfolio of ['javascript:alert(1)', 'file:///secret', 'example.com']) assert.ok(validateContribution('join', { ...values, portfolio }, context).portfolio);
  assert.deepEqual(validateContribution('join', { ...values, portfolio: 'https://github.com/example' }, context), {});
});
test('unconnected adapter never claims a contribution was received or modifies its draft', async () => {
  const draft = { kind: 'submit', lyrics: 'Line one\n\nLine two' };
  const snapshot = structuredClone(draft);
  assert.deepEqual(await sendContribution(draft), { status: 'unavailable' });
  assert.deepEqual(draft, snapshot);
});

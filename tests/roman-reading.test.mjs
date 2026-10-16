import test from 'node:test';
import assert from 'node:assert/strict';
import { getRomanReading } from '../src/lib/roman-reading.ts';
test('Roman Telugu preserves verses, numbers and existing Latin text', () => {
  const text = 'యేసు (2)\n\nనీ కృప YESU ౧';
  const r = getRomanReading(text);
  assert.equal(r.label, 'Telugu transliteration'); assert.equal(r.lang, 'te-Latn');
  assert.equal(r.generated, true); assert.equal(r.text.split('\n\n').length, 2);
  assert.match(r.text, /YESU 1/); assert.doesNotMatch(r.text, /[\u0c00-\u0c7f]/);
  assert.equal(text, 'యేసు (2)\n\nనీ కృప YESU ౧');
});
test('English does not get a redundant Roman reading and Hindi is labelled transliteration', () => {
  assert.equal(getRomanReading('Amazing Grace\n\nHow sweet the sound'), null);
  const r = getRomanReading('यीशु १\n\nप्रेम'); assert.equal(r.lang, 'hi-Latn');
  assert.doesNotMatch(r.text, /[\u0900-\u097f]/); assert.match(r.text, /1/);
});
test('Telugu nasal reading follows consonant context without changing original search transliteration', () => {
  assert.match(getRomanReading('దీవించావే సంపద').text, /deevinchaavee sampada/);
});
test('Unsupported native letters do not produce a partial Roman option', () => {
  assert.equal(getRomanReading('తెలుగు ౘ'), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { getRomanReading } from '../src/lib/roman-reading.ts';
import { teluguReading, hindiReading } from '../src/lib/reading-transliteration.ts';
import { teluguToRoman } from '../src/lib/transliterate.ts';
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
  assert.match(getRomanReading('దీవించావే సంపద').text, /deevinchaave sampada/);
});
test('Unsupported native letters do not produce a partial Roman option', () => {
  assert.equal(getRomanReading('తెలుగు ౘ'), null);
});

test('Telugu reading keeps long ee/oo distinct from e/o and handles devotional words', () => {
  assert.equal(teluguReading('ఎఏఇఈఒఓఉఊ'), 'eeieeoouoo');
  assert.equal(getRomanReading('యేసు దేవా నీతో దీవించావే').text, 'yesu devaa neetho deevinchaave');
  assert.equal(getRomanReading('కృప స్తోత్రం ప్రార్థన సంపద సంరక్షణ').text, 'krupa sthothram praarthana sampada samrakshana');
  assert.equal(getRomanReading('అమ్మ అన్న యెహెూవాయే').text, 'amma anna yehovaaye');
});

test('Hindi handles schwa deletion, explicit vowels, nukta and common exceptions', () => {
  for (const [native, expected] of Object.entries({ करना:'karnaa', करता:'kartaa', जीवन:'jeevan', खुशी:'khushee', 'फ़रिश्ता':'farishtaa', 'आवाज़':'aavaaz', परमेश्वर:'parmeshwar', पवित्र:'pavitra' })) assert.equal(hindiReading(native), expected, native);
  assert.equal(getRomanReading('यीशु १२\n\nप्रेम YESHU').text, 'yeeshu 12\n\nprem YESHU');
});

test('Reader rules never replace legacy title search and slug conventions', () => {
  assert.notEqual(getRomanReading('యేసు').text, teluguToRoman('యేసు'));
  assert.equal(getRomanReading('యేసు').rulesVersion, 'reading-2');
  assert.equal(getRomanReading('ा'), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { searchTitles } from '../public/title-search.js';

const index = [
  { s: 'yesayya', t: 'యేసయ్య నామము', g: 'telugu', r: ['yeesayya naamamu', 'yesayya naamamu'] },
  { s: 'stuti', t: 'स्तुति प्रशंसा', g: 'hindi', r: ['stuti prashansaa', 'sthuthi prashansa'] },
  { s: 'aaj', t: 'आज का दिन', g: 'hindi', r: ['aaj kaa din', 'aaj ka din'] },
  { s: 'grace', t: 'Amazing Grace', g: 'english', r: ['amazing grace'] },
  { s: 'long', t: 'యేసయ్య ' + 'నామము '.repeat(30), g: 'telugu', r: ['yeesayya ' + 'naamamu '.repeat(30), 'yesayya ' + 'naamamu '.repeat(30)] },
];

test('native scripts and Roman aliases find the same titles', () => {
  for (const q of ['యేసయ్య', 'yesayya', 'yesaya', 'yeesayya', 'YESAYYA']) assert.equal(searchTitles(index, q)[0].s, 'yesayya');
  for (const q of ['स्तुति', 'stuti', 'sthuthi']) assert.equal(searchTitles(index, q)[0].s, 'stuti');
  assert.equal(searchTitles(index, 'aaj ka din')[0].s, 'aaj');
});
test('partial titles, reordered words and punctuation are accepted', () => {
  for (const q of ['amazing', 'grace amazing', 'Amazing—Grace', '  AMAZING   grace ']) assert.equal(searchTitles(index, q)[0].s, 'grace');
  assert.equal(searchTitles(index, 'prashansa')[0].s, 'stuti');
});
test('long matching titles are not discarded by length penalties', () => {
  assert.ok(searchTitles(index, 'yesaya').some(item => item.s === 'long'));
});
test('empty and unrelated input does not produce arbitrary results', () => {
  for (const q of ['', '   ', 'zzzzzz', 'aeiou', '<img src=x onerror=alert(1)>']) assert.deepEqual(searchTitles(index, q), []);
});
test('older cached indexes retain Roman search through existing song names', () => {
  const oldIndex = [{ s: 'yesayya-naamamu', t: 'యేసయ్య నామము', g: 'telugu' }];
  assert.equal(searchTitles(oldIndex, 'yesaya')[0].s, 'yesayya-naamamu');
});

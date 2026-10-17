import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { getRomanReading } from '../src/lib/roman-reading.ts';
import { collectionDecisions, worshipCollections } from '../src/lib/worship-collections.ts';
const songs = JSON.parse(await readFile('src/data/songs.json','utf8'));
const native = songs.filter(song => /[\u0900-\u097f\u0c00-\u0c7f]/.test(song.lyrics));
const withheld = native.filter(song => !getRomanReading(song.lyrics));
assert.deepEqual(withheld.map(song => song.slug).sort(), ['chattaan','thu-meraa-bal']);
for (const song of native) {
  const reading = getRomanReading(song.lyrics); if (!reading) continue;
  assert.doesNotMatch(reading.text, /[\u0900-\u0963\u0966-\u096f\u0c00-\u0c63\u0c66-\u0c6f]/);
  assert.equal(reading.text.split('\n').length, song.lyrics.split('\n').length, `Changed line structure: ${song.slug}`);
}
const telugu = songs.filter(song => /^[\u0c00-\u0c7f]/.test(song.title));
assert.equal(collectionDecisions.length,telugu.length);
assert.ok(collectionDecisions.every(decision => decision.collections.length > 0));
const report = {
  generatedAt:new Date().toISOString(), totalSongs:songs.length, teluguSongs:telugu.length,
  nativeLyricRecords:native.length, generatedReadings:native.length-withheld.length,
  note:'Structural checks and rules-based classification, not a human pronunciation or thematic certification. No source lyrics were changed or imported.',
  withheldReadings:withheld.map(song => ({slug:song.slug,title:song.title,reason:song.slug==='chattaan'?'Orphan vowel sign in source text; missing consonant requires review.':'Malformed vowel-sign sequence in source text requires review.'})),
  broadDevotionalSongs:collectionDecisions.filter(song => song.broadFallback).length,
  collections:worshipCollections.map(({slug,title,songs})=>({slug,title,count:songs.length})),
  assignments:collectionDecisions,
};
await writeFile('docs/catalog-quality-report.json',`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify({...report,assignments:undefined},null,2));

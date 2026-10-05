import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../src/pages/song/[slug].astro', import.meta.url), 'utf8');
// Select the complete inline script, including comparison operators.
const body = source.slice(source.indexOf('\n', source.indexOf('<script define:vars=')) + 1, source.lastIndexOf('</script>'));
function reader(navigator, blocked = false) {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { textContent: '', style: {}, disabled: false, handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; } });
    return nodes.get(id);
  };
  const sizes = {};
  const saved = new Map();
  vm.runInNewContext(body, {
    document: { getElementById: node, documentElement: { style: { setProperty: (name, value) => sizes[name] = value } } },
    localStorage: { getItem: key => { if (blocked) throw Error('blocked'); return saved.get(key); }, setItem: (key, value) => { if (blocked) throw Error('blocked'); saved.set(key, value); } },
    getComputedStyle: () => ({ getPropertyValue: () => '20px' }),
    navigator, window: { location: { href: 'https://example.test/song/song-a/' }, matchMedia: () => ({ addEventListener() {} }) },
    lyricsText: 'Actual lyrics\n\nSecond stanza', songTitle: 'Song A', setTimeout() {},
  });
  return { node, sizes };
}
test('Copy writes only the actual lyrics and gives accessible feedback', async () => {
  let copied;
  const r = reader({ clipboard: { writeText: async text => copied = text } });
  await r.node('copy-lyrics-btn').handlers.click();
  assert.equal(copied, 'Actual lyrics\n\nSecond stanza');
  assert.equal(r.node('reader-status').textContent, 'Lyrics copied.');
});
test('Share falls back to the song URL when native sharing is unavailable', async () => {
  let copied;
  const r = reader({ clipboard: { writeText: async text => copied = text } });
  await r.node('share-btn').handlers.click();
  assert.equal(copied, 'https://example.test/song/song-a/');
  assert.equal(r.node('reader-status').textContent, 'Song link copied.');
});
test('Native sharing works without canShare; cancellation does not copy', async () => {
  let payload, copies = 0;
  const r = reader({ share: async data => { payload = data; }, clipboard: { writeText: async () => copies++ } });
  await r.node('share-btn').handlers.click();
  assert.equal(payload.title, 'Song A – Keertana');
  assert.equal(copies, 0);
  const canceled = reader({ share: async () => { throw { name: 'AbortError' }; }, clipboard: { writeText: async () => copies++ } });
  await canceled.node('share-btn').handlers.click();
  assert.equal(copies, 0);
});
test('Size limits and controls work even with blocked local storage', () => {
  const r = reader({}, true);
  for (let i = 0; i < 15; i++) r.node('font-inc-btn').handlers.click();
  assert.equal(r.sizes['--lyrics-font-size'], '40px');
  assert.equal(r.node('font-inc-btn').disabled, true);
  for (let i = 0; i < 20; i++) r.node('font-dec-btn').handlers.click();
  assert.equal(r.sizes['--lyrics-font-size'], '16px');
  assert.equal(r.node('font-dec-btn').disabled, true);
});

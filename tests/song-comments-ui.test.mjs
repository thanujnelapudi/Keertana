import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import vm from 'node:vm';
import { validateComment } from '../supabase/functions/song-comments/handler.mjs';
const source = readFileSync(new URL('../src/scripts/song-comments.js', import.meta.url), 'utf8').replace(/^import .*\n/, '').replace(/export function /g, 'function ');
class Element {
  constructor() { this.handlers = {}; this.children = []; this.attrs = {}; this.disabled = false; this.hidden = false; this.value = ''; this.textContent = ''; }
  addEventListener(name, handler) { this.handlers[name] = handler; }
  append(...nodes) { this.children.push(...nodes); }
  setAttribute(key, value) { this.attrs[key] = value; }
  removeAttribute(key) { delete this.attrs[key]; }
  focus() { this.focused = true; }
}
function fixture(fetcher, enabled = true) {
  const selectors = ['[data-load-comments]','[data-more-comments]','[data-comments-list]','[data-comments-list-status]','[data-comments-discussion]','.comments-form','.comments-compose','[data-submit-comment]','[data-comment-status]','[data-comment-error="token"]','[data-retry-verification]','[data-turnstile]'];
  const nodes = new Map(selectors.map(name => [name, new Element()]));
  const fields = Object.fromEntries(['displayName','body','referenceUrl','website','consent'].map(key => [key, new Element()]));
  for (const key of ['displayName','body','referenceUrl','consent']) nodes.set(`[data-comment-error="${key}"]`, new Element());
  const root = { dataset: { commentsEnabled: String(enabled), song: 'amazing-grace', endpoint: 'https://comments.test/function', siteKey: 'test-key' }, querySelector: name => nodes.get(name), querySelectorAll: () => [...nodes.entries()].filter(([key]) => key.includes('data-comment-error')).map(([,node]) => node) };
  const form = nodes.get('.comments-form'); form.elements = { namedItem: name => fields[name] };
  form.querySelectorAll = selector => selector === 'input, textarea' ? Object.values(fields) : Object.values(fields).filter(field => field.attrs['aria-invalid']);
  form.reset = () => { Object.values(fields).forEach(field => { field.value = ''; field.checked = false; }); };
  const calls = []; let resets = 0; let scripts = 0; let widgetOptions;
  const context = vm.createContext({
    validateComment, URL, AbortSignal, crypto: { randomUUID }, setTimeout, clearTimeout,
    window: { turnstile: { render(_node, options) { widgetOptions = options; options.callback('passed-check'); return 'widget-id'; }, reset() { resets++; } } },
    document: { createElement: () => new Element(), head: { append() { scripts++; } } },
    FormData: class { get(key) { return key === 'consent' ? fields.consent.checked ? 'on' : null : fields[key].value; } },
    fetch: async (...args) => { calls.push(args); return fetcher(...args); },
  });
  vm.runInContext(`${source}\nthis.start = initSongComments;`, context); context.start(root);
  return { nodes, fields, form, calls, scripts: () => scripts, resets: () => resets,
    async open() { const compose = nodes.get('.comments-compose'); compose.open = true; compose.handlers.toggle(); await new Promise(setImmediate); },
    fill() { fields.displayName.value = 'Reader'; fields.body.value = 'Please check this line.'; fields.consent.checked = true; },
    submit() { return form.handlers.submit({ preventDefault() {} }); },
    verifyAgain() { widgetOptions.callback('fresh-check'); }, context,
  };
}
test('Disabled comments never request a provider or install form handlers', () => {
  const f = fixture(async () => { throw Error('unexpected request'); }, false);
  assert.equal(f.calls.length, 0); assert.equal(f.scripts(), 0); assert.equal(f.form.handlers.submit, undefined);
});
test('Discussion is fetched only after an explicit click, with a useful empty state', async () => {
  const f = fixture(async () => Response.json({ comments: [], nextCursor: null }));
  assert.equal(f.calls.length, 0); await f.nodes.get('[data-load-comments]').handlers.click();
  assert.equal(f.calls.length, 1); assert.equal(f.nodes.get('[data-comments-discussion]').hidden, false);
  assert.match(f.nodes.get('[data-comments-list-status]').textContent, /No approved comments/);
});
test('Only confirmed pending receipts clear the draft and never publish a local comment', async () => {
  const f = fixture(async () => Response.json({ status: 'pending' }, { status: 202 })); await f.open(); f.fill(); await f.submit();
  assert.equal(f.fields.body.value, ''); assert.match(f.nodes.get('[data-comment-status]').textContent, /Submitted for review/);
  assert.equal(f.nodes.get('[data-comments-list]').children.length, 0); assert.equal(f.resets(), 1);
});
test('Network failures preserve the draft and retain its idempotency identifier for retry', async () => {
  const f = fixture(async () => { throw TypeError('network unavailable'); }); await f.open(); f.fill(); await f.submit();
  const first = JSON.parse(f.calls[0][1].body); assert.equal(f.fields.body.value, 'Please check this line.');
  assert.match(f.nodes.get('[data-comment-status]').textContent, /could not confirm receipt/);
  // A real retry gets a fresh widget token; retain the same unchanged draft ID.
  f.verifyAgain(); await f.submit(); const second = JSON.parse(f.calls[1][1].body);
  assert.equal(second.requestId, first.requestId); assert.notEqual(second.token, first.token);
  assert.equal(f.fields.displayName.disabled, false); assert.equal(f.nodes.get('[data-submit-comment]').disabled, false);
});
test('A successful HTTP response without a pending receipt preserves the draft', async () => {
  const f = fixture(async () => Response.json({ status: 'published' })); await f.open(); f.fill(); await f.submit();
  assert.equal(f.fields.body.value, 'Please check this line.'); assert.doesNotMatch(f.nodes.get('[data-comment-status]').textContent, /Submitted for review/);
});
test('Local validation focuses the invalid field without sending or clearing content', async () => {
  const f = fixture(async () => { throw Error('unexpected request'); }); await f.open(); f.fill(); f.fields.body.value = 'bad'; await f.submit();
  assert.equal(f.calls.length, 0); assert.equal(f.fields.body.focused, true); assert.equal(f.fields.body.value, 'bad');
  assert.equal(f.fields.body.attrs['aria-invalid'], 'true');
});

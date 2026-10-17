import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../src/scripts/comments-demo.js', import.meta.url), 'utf8').replace('export async function', 'async function');
async function fixture(query, fetcher = async () => Response.json([{ s:'deevinchaave', t:'దీవించావే', g:'telugu' }])) {
  const back = [{ href:'/' }, { href:'/' }];
  const context = { hidden:true }; const interest = { href:'/comments-demo/interest/' }; const report = { href:'/contribute/report/' };
  const root = { querySelectorAll: () => back, querySelector: selector => ({ '[data-demo-context]':context, '[data-interest-link]':interest, '[data-report-link]':report })[selector] };
  let requests = 0;
  const sandbox = vm.createContext({ URLSearchParams, AbortSignal, location:{ search:query }, document:{ querySelector:()=>root }, fetch:async (...args) => { requests++; return fetcher(...args); } });
  await vm.runInContext(`${source}\ninitCommentsDemo()`, sandbox);
  return { back, context, interest, report, requests };
}
test('Demo preserves validated song context throughout the interest funnel without sending a comment', async () => {
  const result = await fixture('?song=deevinchaave');
  assert.equal(result.context.textContent,'దీవించావే'); assert.equal(result.context.lang,'te');
  assert.equal(result.context.hidden,false); assert.equal(result.back[0].href,'/song/deevinchaave/');
  assert.equal(result.interest.href,'/comments-demo/interest/?song=deevinchaave');
  assert.equal(result.report.href,'/contribute/report/?song=deevinchaave'); assert.equal(result.requests,1);
});
test('Invalid, unknown or offline song context retains functional library and interest links', async () => {
  for (const query of ['', '?song=javascript%3Aalert(1)', '?song=unknown']) {
    const result = await fixture(query); assert.equal(result.context.hidden,true); assert.equal(result.back[0].href,'/'); assert.equal(result.interest.href,'/comments-demo/interest/');
  }
  const offline = await fixture('?song=deevinchaave', async () => { throw new Error('offline'); });
  assert.equal(offline.context.hidden,true); assert.equal(offline.interest.href,'/comments-demo/interest/');
});

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { previewSong, addSong } from './catalog.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
export function createEntryServer({ catalog = path.join(root, 'src/data/songs.json'), backupDir = path.join(root, '.song-backups') } = {}) {
const token = randomBytes(32).toString('hex');
let writing = false;
const server = http.createServer(async (req, res) => {
  const origin = `http://127.0.0.1:${server.address().port}`;
  const headers = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' };
  const reply = (status, data) => { res.writeHead(status, { ...headers, 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); };
  if (req.headers.host !== `127.0.0.1:${server.address().port}`) return reply(403, { error: 'Use the displayed local address.' });
  try {
    if (req.method === 'GET' && req.url === '/') {
      const page = (await readFile(new URL('./index.html', import.meta.url), 'utf8')).replace('__TOKEN__', token);
      res.writeHead(200, { ...headers, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'self'; script-src 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" });
      return res.end(page);
    }
    if (req.method !== 'POST' || !['/preview', '/add'].includes(req.url)) return reply(404, { error: 'Not found' });
    if (req.headers.origin !== origin || req.headers['x-entry-token'] !== token || !req.headers['content-type']?.startsWith('application/json')) return reply(403, { error: 'This action must come from the local tool.' });
    const chunks = []; let bytes = 0;
    for await (const chunk of req) { bytes += chunk.length; if (bytes > 600000) return reply(413, { error: 'The entry is too large.' }); chunks.push(chunk); }
    const input = JSON.parse(Buffer.concat(chunks).toString());
    if (req.url === '/preview') return reply(200, await previewSong(catalog, input));
    if (writing) return reply(409, { error: 'An addition is already in progress.' });
    writing = true;
    try { reply(200, await addSong(catalog, input, input.fingerprint, backupDir)); }
    finally { writing = false; }
  } catch (error) { reply(400, { error: error.message }); }
});
return server;
}
if (path.resolve(process.argv[1] || '') === fileURLToPath(import.meta.url)) {
  const server = createEntryServer();
  server.listen(0, '127.0.0.1', () => console.log(`Keertana song entry: http://127.0.0.1:${server.address().port}/\nLocal catalog only. Stop with Ctrl+C. Adding does not deploy or push to GitHub.`));
}

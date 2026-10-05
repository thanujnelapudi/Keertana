import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'dist');
const songs = JSON.parse(await readFile(new URL('../src/data/songs.json', import.meta.url), 'utf8'));
const files = [];
async function walk(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const file = path.join(folder, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (/\.(html|xml)$/.test(entry.name)) files.push(file);
  }
}
await walk(output);
const incoming = new Set();
let sitemap = '';
for (const file of files) {
  const text = await readFile(file, 'utf8');
  if (file.endsWith('.xml')) sitemap += text;
  else for (const match of text.matchAll(/href=["']([^"']+)["']/g)) {
    try { incoming.add(decodeURIComponent(new URL(match[1], 'https://keertana.vercel.app').pathname)); } catch {}
  }
}
const failures = [];
for (const song of songs) {
  const route = `/song/${song.slug}/`;
  let html;
  try { html = await readFile(path.join(output, 'song', song.slug, 'index.html'), 'utf8'); }
  catch { failures.push(`${song.slug}: page missing`); continue; }
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
  if (!canonical || new URL(canonical[1]).pathname !== route) failures.push(`${song.slug}: canonical missing or incorrect`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${song.slug}: title missing`);
  if (!/<meta[^>]*name="description"[^>]*content="[^"]+"/.test(html)) failures.push(`${song.slug}: description missing`);
  if (/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html)) failures.push(`${song.slug}: noindex`);
  if (!incoming.has(route)) failures.push(`${song.slug}: no incoming HTML link`);
  if (!canonical || !sitemap.includes(`<loc>${canonical[1]}</loc>`)) failures.push(`${song.slug}: sitemap entry missing`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  if (!schemas.some(schema => schema['@type'] === 'MusicComposition' && schema.name === song.title && schema.lyrics?.text === song.lyrics)) failures.push(`${song.slug}: song schema mismatches catalog`);
  if (!schemas.some(schema => schema['@type'] === 'BreadcrumbList')) failures.push(`${song.slug}: breadcrumb schema missing`);
}
console.log(JSON.stringify({ songs: songs.length, failures: failures.length, details: failures }, null, 2));
if (failures.length) process.exitCode = 1;

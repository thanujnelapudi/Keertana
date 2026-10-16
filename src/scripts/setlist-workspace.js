import { readSetlists, changeSetlist, SETLIST_KEY, encodeSharedSetlist, decodeSharedSetlist } from '../../public/setlists.js';
import { readLibrary } from '../../public/local-library.js';
import { searchTitles } from '../../public/title-search.js';
const el = id => document.getElementById(id);
const status = message => { el('setlist-status').textContent = message; };
let lists = [], active = '', catalog = [], busy = false;
let shared = null, deletingId = null;
const pending = new URLSearchParams(location.search).get('add');
const lang = g => ({ telugu: 'te', hindi: 'hi', english: 'en' }[g] || 'en');
const node = (tag, text, className) => { const n = document.createElement(tag); n.textContent = text; if (className) n.className = className; return n; };
function button(text, label, handler, disabled = false) {
  const b = node('button', text); b.type = 'button'; b.setAttribute('aria-label', label); b.disabled = disabled; b.addEventListener('click', handler); return b;
}
function selected() { return shared || lists.find(x => x.id === active); }
function change(action, message, focusSlug) {
  try {
    lists = changeSetlist(localStorage, action);
    if (action.type === 'create') active = action.id;
    render(); status(message);
    if (focusSlug) [...el('setlist-songs').querySelectorAll('li')].find(n => n.dataset.slug === focusSlug)?.querySelector('a')?.focus();
    else el('active-setlist-name').focus();
    return true;
  } catch (error) { status(error.message || 'Could not save. Browser storage may be full or unavailable.'); return false; }
}
function render() {
  el('delete-confirmation').hidden = true; deletingId = null;
  el('share-link-panel').hidden = true;
  if (shared) {
    document.querySelector('.setlist-intro .setlist-note').textContent = 'Open the shared songs in order. No account needed.';
    el('setlist-workspace').hidden = true; el('setlist-reading').hidden = true; el('shared-setlist').hidden = false;
    el('shared-setlist-name').textContent = shared.name;
    el('shared-setlist-songs').replaceChildren();
    for (const [index, slug] of shared.songs.entries()) {
      const song = catalog.find(x => x.s === slug), li = node('li', '');
      const a = node(song ? 'a' : 'span', song?.t || `${slug} (unavailable)`, 'setlist-song-title'); a.lang = lang(song?.g);
      if (song) a.href = `/song/${slug}/`; li.append(node('span', `${index + 1}. `, 'setlist-position'), a); el('shared-setlist-songs').append(li);
    }
    return;
  }
  if (!selected()) active = lists[0]?.id || '';
  const list = selected();
  el('setlist-tabs').replaceChildren();
  for (const x of lists) {
    const li = node('li', '');
    const b = button(`${x.name} · ${x.songs.length}`, `Open ${x.name}`, () => { active = x.id; render(); status('Setlist opened.'); });
    b.setAttribute('aria-pressed', String(x.id === active)); li.append(b); el('setlist-tabs').append(li);
  }
  el('setlist-empty').hidden = !!list; el('setlist-detail').hidden = !list;
  el('setlist-reading').hidden = true; el('setlist-workspace').hidden = false;
  if (!list) return;
  el('active-setlist-name').textContent = list.name; el('active-setlist-name').tabIndex = -1;
  el('rename-name').value = list.name; el('setlist-count').textContent = `${list.songs.length} song${list.songs.length === 1 ? '' : 's'}`;
  el('read-setlist').disabled = el('print-setlist').disabled = !list.songs.length || busy;
  el('share-setlist').disabled = !list.songs.length;
  const ol = el('setlist-songs'); ol.replaceChildren();
  if (!list.songs.length) ol.append(node('li', 'Your setlist is ready for its first song.', 'setlist-note'));
  list.songs.forEach((slug, index) => {
    const song = catalog.find(x => x.s === slug), title = song?.t || `${slug} (unavailable)`;
    const li = node('li', ''); li.dataset.slug = slug;
    const a = node(song ? 'a' : 'span', title, 'setlist-song-title'); a.lang = lang(song?.g);
    if (song) a.href = `/song/${slug}/`;
    li.append(node('span', String(index + 1).padStart(2, '0'), 'setlist-position'), a);
    const controls = node('div', '', 'setlist-row-actions');
    controls.append(button('↑', `Move ${title} up`, () => change({ type: 'move', id: active, slug, direction: -1 }, 'Song moved up.', slug), index === 0), button('↓', `Move ${title} down`, () => change({ type: 'move', id: active, slug, direction: 1 }, 'Song moved down.', slug), index === list.songs.length - 1), button('Remove', `Remove ${title}`, () => change({ type: 'remove', id: active, slug }, 'Song removed.')));
    li.append(controls); ol.append(li);
  });
  showResults();
}
let savedMode = false;
function showResults() {
  const list = selected(); if (!list) return;
  const query = el('setlist-search').value.trim();
  let found;
  try { found = savedMode ? readLibrary(localStorage).saved.map(s => catalog.find(x => x.s === s)).filter(Boolean) : searchTitles(catalog, query, 12); }
  catch { el('setlist-search-status').textContent = 'Saved songs could not be read.'; return; }
  el('setlist-results').replaceChildren();
  el('setlist-search-status').textContent = !found.length ? savedMode ? 'No saved songs yet. Search for a song above.' : query ? 'No matching titles. Try another spelling.' : 'Search the catalog, or choose from your Saved Songs.' : `${found.length} ${savedMode ? 'saved songs' : 'matches'}`;
  for (const song of found) {
    const li = node('li', ''); const a = node('a', song.t, 'setlist-song-title'); a.lang = lang(song.g); a.href = `/song/${song.s}/`;
    li.append(a, button(list.songs.includes(song.s) ? 'Added' : '+ Add', `Add ${song.t} to ${list.name}`, () => change({ type: 'add', id: active, slug: song.s }, 'Song added to setlist.'), list.songs.includes(song.s)));
    el('setlist-results').append(li);
  }
  const pendingSong = pending && catalog.find(x => x.s === pending);
  if (pendingSong && !query && !savedMode && !list.songs.includes(pending)) {
    const li = node('li', ''); li.append(node('span', pendingSong.t, 'setlist-song-title'), button('+ Add this song', `Add ${pendingSong.t}`, () => change({ type: 'add', id: active, slug: pending }, 'Song added.'))); el('setlist-results').prepend(li);
  }
}
el('create-setlist').addEventListener('submit', event => { event.preventDefault(); if (change({ type: 'create', id: crypto.randomUUID(), name: el('setlist-name').value }, 'Setlist created. Choose your first song below.')) el('setlist-name').value = ''; });
el('rename-setlist').addEventListener('submit', event => { event.preventDefault(); change({ type: 'rename', id: active, name: el('rename-name').value }, 'Setlist renamed.'); });
el('delete-setlist').addEventListener('click', () => {
  if (!selected()) return;
  deletingId = active; el('delete-question').textContent = `Delete “${selected().name}”? Your saved songs will remain.`;
  el('delete-confirmation').hidden = false; el('cancel-delete-setlist').focus();
});
el('cancel-delete-setlist').addEventListener('click', () => { deletingId = null; el('delete-confirmation').hidden = true; el('delete-setlist').focus(); });
el('confirm-delete-setlist').addEventListener('click', () => { if (deletingId && change({ type: 'delete', id: deletingId }, 'Setlist deleted.')) el('setlist-name').focus(); });
async function copyShareLink() {
  try { await navigator.clipboard.writeText(el('setlist-share-link').value); status('Setlist link copied. Send it to your worship team.'); }
  catch { el('setlist-share-link').focus(); el('setlist-share-link').select(); status('Select and copy the link above to share it.'); }
}
el('copy-setlist-link').addEventListener('click', copyShareLink);
el('share-setlist').addEventListener('click', async () => {
  try {
    const list = selected(); const url = new URL(document.querySelector('link[rel="canonical"]').href);
    url.hash = `set=${encodeSharedSetlist(list)}`;
    el('setlist-share-link').value = url.href; el('share-link-panel').hidden = false;
    if (navigator.share) {
      try { await navigator.share({ title: `${list.name} · Keertana`, text: 'Our worship songs, in order.', url: url.href }); status('Setlist shared.'); }
      catch (error) { if (error.name === 'AbortError') status('Sharing cancelled. Your link is still available below.'); else await copyShareLink(); }
    } else await copyShareLink();
  } catch (error) { status(error.message || 'Could not create a share link.'); }
});
el('setlist-search').addEventListener('input', () => { savedMode = false; showResults(); });
el('pick-saved').addEventListener('click', () => { savedMode = true; showResults(); });
el('backup-setlists').addEventListener('click', () => {
  try { const data = readSetlists(localStorage); const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, lists: data }, null, 2)], { type: 'application/json' })); const a = node('a', ''); a.href = url; a.download = 'keertana-setlists.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); status('Backup downloaded. Keep it somewhere safe.'); } catch (error) { status(error.message); }
});
async function readSongs(print) {
  const list = selected(); if (!list || busy) return;
  const scriptSelect = el(shared ? 'shared-setlist-script' : 'setlist-script');
  const useRoman = scriptSelect.value === 'roman'; scriptSelect.disabled = true;
  const snapshot = JSON.stringify(list); busy = true; render(); status('Preparing your lyrics…');
  try {
    const songs = [];
    for (const slug of list.songs) {
      const response = await fetch(`/api/song/${encodeURIComponent(slug)}.json`);
      if (!response.ok) throw new Error(`Could not load ${catalog.find(x => x.s === slug)?.t || slug}. Check your connection and try again.`);
      const song = await response.json(); if (typeof song.lyrics !== 'string' || typeof song.title !== 'string') throw new Error('Unexpected song data. Please try again.'); songs.push(song);
    }
    if (!shared && (JSON.stringify(readSetlists(localStorage).find(x => x.id === list.id)) !== snapshot || active !== list.id)) throw new Error('The setlist changed while loading. Please open it again.');
    const content = el('setlist-lyrics'); content.replaceChildren(node('h1', list.name));
    songs.forEach((song, index) => {
      const article = node('article', '', 'setlist-print-song'); const title = node('h2', `${index + 1}. ${song.title}`); title.lang = song.langCode;
      const reading = useRoman && song.romanReading && typeof song.romanReading.text === 'string' ? song.romanReading : null;
      article.append(title);
      if (reading) article.append(node('p', `${reading.label} · Generated from the original lyrics.`, 'setlist-credit'));
      const lyrics = node('div', reading ? reading.text : song.lyrics, 'setlist-full-lyrics'); lyrics.lang = reading ? reading.lang : song.lyricsLang;
      article.append(lyrics, node('p', 'Keertana · Song credit and rights belong to the respective creators and rights holders.', 'setlist-credit')); content.append(article);
    });
    el('setlist-reading').hidden = false; el('setlist-workspace').hidden = true; status('Your songs are ready, in worship order.');
    el('shared-setlist').hidden = true;
    el('close-setlist-reading').focus();
    if (print) { await document.fonts.ready; window.print(); }
  } catch (error) { status(error.message || 'Could not prepare lyrics. Please try again.'); }
  finally { busy = false; scriptSelect.disabled = false; el('read-setlist').disabled = el('print-setlist').disabled = !selected()?.songs.length; }
}
el('read-setlist').addEventListener('click', () => readSongs(false)); el('print-setlist').addEventListener('click', () => readSongs(true));
el('read-shared-setlist').addEventListener('click', () => readSongs(false)); el('print-shared-setlist').addEventListener('click', () => readSongs(true));
el('close-setlist-reading').addEventListener('click', () => { render(); el(shared ? 'read-shared-setlist' : 'read-setlist').focus(); });
async function initialize() {
  try {
    if (location.hash.startsWith('#set=')) shared = decodeSharedSetlist(location.hash.slice(5));
    else lists = readSetlists(localStorage);
    const response = await fetch('/api/search-index.json'); if (!response.ok) throw new Error('Song catalog unavailable. Reload to try again.');
    catalog = await response.json(); if (!Array.isArray(catalog)) throw new Error('Song catalog unavailable. Reload to try again.');
    render(); status(shared ? 'Your shared worship setlist is ready.' : pending ? 'Choose or create a setlist, then add this song below.' : 'Your worship workspace is ready.');
  } catch (error) { status(error.message || 'Browser storage is unavailable. Enable it and reload to use setlists.'); }
}
window.addEventListener('storage', event => { if (event.key === SETLIST_KEY || event.key === null) { try { lists = readSetlists(localStorage); render(); status('Setlists updated from another tab.'); } catch (error) { status(error.message); } } });
initialize();

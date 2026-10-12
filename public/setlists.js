export const SETLIST_KEY = 'keertana-setlists-v1';
const slugOK = s => typeof s === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(s);
export function readSetlists(storage) {
  const raw = storage.getItem(SETLIST_KEY);
  if (!raw) return [];
  let data;
  try { data = JSON.parse(raw); } catch { throw new Error('Your saved setlists could not be read. Export a backup before clearing browser data.'); }
  if (data?.version !== 1 || !Array.isArray(data?.lists) || data.lists.some(x => !x || typeof x.id !== 'string' || typeof x.name !== 'string' || !Array.isArray(x.songs))) throw new Error('Your saved setlists use an unsupported format.');
  return data.lists
    .map(x => ({ id: x.id, name: x.name, songs: [...new Set(x.songs.filter(slugOK))] }));
}
export function changeSetlist(storage, action) {
  const lists = readSetlists(storage);
  const name = String(action.name ?? '').trim();
  if (['create', 'rename'].includes(action.type) && (!name || name.length > 80)) throw new Error('Use a setlist name of 1–80 characters.');
  if (action.type === 'create') {
    if (lists.length >= 100) throw new Error('You can keep up to 100 setlists in this browser.');
    if (!action.id || lists.some(x => x.id === action.id)) throw new Error('Please try creating the setlist again.');
    lists.push({ id: action.id, name, songs: [] });
  } else {
    const list = lists.find(x => x.id === action.id);
    if (!list) throw new Error('This setlist was removed. Choose another setlist.');
    if (action.type === 'rename') list.name = name;
    else if (action.type === 'delete') lists.splice(lists.indexOf(list), 1);
    else if (action.type === 'add') {
      if (!slugOK(action.slug)) throw new Error('Invalid song.');
      if (list.songs.includes(action.slug)) throw new Error('This song is already in the setlist.');
      if (list.songs.length >= 100) throw new Error('A setlist can contain up to 100 songs.');
      list.songs.push(action.slug);
    } else if (action.type === 'remove') list.songs = list.songs.filter(s => s !== action.slug);
    else if (action.type === 'move') {
      const from = list.songs.indexOf(action.slug), to = from + action.direction;
      if (![-1, 1].includes(action.direction) || from < 0 || to < 0 || to >= list.songs.length) throw new Error('Cannot move this song further.');
      [list.songs[from], list.songs[to]] = [list.songs[to], list.songs[from]];
    } else throw new Error('Unknown setlist action.');
  }
  storage.setItem(SETLIST_KEY, JSON.stringify({ version: 1, lists }));
  return lists;
}

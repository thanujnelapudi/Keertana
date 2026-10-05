export const LIBRARY_KEY = 'keertana-library-v1';
export const RECENT_LIMIT = 8;
const validSlug = value => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);
const unique = values => [...new Set(Array.isArray(values) ? values.filter(validSlug) : [])];

export function readLibrary(storage) {
  try {
    const data = JSON.parse(storage.getItem(LIBRARY_KEY) || '{}');
    return { version: 1, saved: unique(data?.saved), recent: unique(data?.recent).slice(0, RECENT_LIMIT) };
  } catch { return { version: 1, saved: [], recent: [] }; }
}
export function updateLibrary(storage, action, slug) {
  if (!validSlug(slug)) throw new Error('Invalid song');
  const data = readLibrary(storage);
  if (action === 'view') data.recent = [slug, ...data.recent.filter(item => item !== slug)].slice(0, RECENT_LIMIT);
  else if (action === 'save') data.saved = unique([slug, ...data.saved]);
  else if (action === 'remove') data.saved = data.saved.filter(item => item !== slug);
  else throw new Error('Invalid library action');
  storage.setItem(LIBRARY_KEY, JSON.stringify(data));
  return data;
}

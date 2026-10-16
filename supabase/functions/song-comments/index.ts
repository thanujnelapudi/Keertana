import { createCommentsHandler } from './handler.mjs';

const site = new URL(Deno.env.get('KEERTANA_SITE_URL') || 'https://keertana.vercel.app');
if (site.protocol !== 'https:') throw new Error('KEERTANA_SITE_URL must use HTTPS');
const origins = (Deno.env.get('COMMENTS_ALLOWED_ORIGINS') || site.origin).split(',').map(value => new URL(value.trim()).origin);
const databaseUrl = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const turnstileSecret = Deno.env.get('TURNSTILE_SECRET_KEY');
if (!databaseUrl || !serviceKey || !turnstileSecret) throw new Error('Missing server-side comments configuration');

async function rpc(name: string, data: object) {
  const response = await fetch(`${databaseUrl}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: serviceKey!, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(data), signal: AbortSignal.timeout(8000),
  });
  const value = await response.json();
  if (!response.ok) {
    const code = value?.message === 'COMMENT_RATE_LIMIT' || value?.message === 'COMMENT_DRAFT_CHANGED' ? value.message : 'COMMENT_STORE_UNAVAILABLE';
    throw Object.assign(new Error('Comment store request failed'), { code });
  }
  return value;
}

let catalog: { slugs: Set<string>; expires: number } | null = null;
async function knownSongs() {
  if (catalog && catalog.expires > Date.now()) return catalog.slugs;
  const response = await fetch(new URL('/api/search-index.json', site), { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('Catalog unavailable');
  const rows = await response.json();
  if (!Array.isArray(rows) || !rows.length || rows.some(row => typeof row.s !== 'string')) throw new Error('Invalid catalog');
  catalog = { slugs: new Set(rows.map(row => row.s)), expires: Date.now() + 300000 };
  return catalog.slugs;
}

Deno.serve(createCommentsHandler({
  origins, knownSongs,
  async verifyToken(token: string) {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', body: new URLSearchParams({ secret: turnstileSecret!, response: token }), signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error('Verification unavailable');
    return response.json();
  },
  readApproved: (song: string, cursor: { at: string; id: string } | null) => rpc('keertana_read_comments', { p_song: song, p_before_at: cursor?.at || null, p_before_id: cursor?.id || null }),
  submitPending: (data: Record<string, string>) => rpc('keertana_submit_comment', { p_request_id: data.requestId, p_song: data.song, p_display_name: data.displayName, p_body: data.body, p_reference_url: data.referenceUrl }),
}));

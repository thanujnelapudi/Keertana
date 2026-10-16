const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u202a-\u202e\u2066-\u2069]/;
export function validateComment(value) {
  const errors = {};
  const text = key => typeof value?.[key] === 'string' ? value[key].trim() : '';
  const data = { song: text('song'), displayName: text('displayName'), body: text('body').replace(/\r\n?/g, '\n'), referenceUrl: text('referenceUrl'), token: text('token'), requestId: text('requestId') };
  if (!SLUG.test(data.song) || data.song.length > 150) errors.song = 'Choose a valid song.';
  if (!data.displayName || data.displayName.length > 60 || /[\r\n\t]/.test(data.displayName) || CONTROL.test(data.displayName)) errors.displayName = 'Enter a name of 1–60 characters.';
  if (data.body.length < 5 || data.body.length > 2000 || CONTROL.test(data.body)) errors.body = 'Enter a comment of 5–2,000 characters.';
  if (data.referenceUrl) {
    try { const url = new URL(data.referenceUrl); if (url.protocol !== 'https:' || url.username || url.password || url.href.length > 1000) throw Error(); data.referenceUrl = url.href; }
    catch { errors.referenceUrl = 'Use a full HTTPS reference link.'; }
  }
  if (!data.token || data.token.length > 2048) errors.token = 'Complete the spam check and try again.';
  if (!UUID.test(data.requestId)) errors.requestId = 'Refresh the form and try again.';
  if (value?.consent !== true) errors.consent = 'Confirm that your approved comment may be public.';
  if (text('website')) errors.body = 'This submission could not be accepted.';
  return { data, errors };
}

async function smallJson(request) {
  if (Number(request.headers.get('content-length')) > 16000) throw Error('too-large');
  const reader = request.body?.getReader();
  if (!reader) throw Error('invalid-body');
  let size = 0; const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      size += value.length;
      if (size > 16000) { await reader.cancel(); throw Error('too-large'); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    if (!json || Array.isArray(json) || typeof json !== 'object') throw Error('invalid-body');
    return json;
  } finally { reader.releaseLock(); }
}

/** Dependencies are injectable so validation, moderation isolation and failures can be tested without live accounts. */
export function createCommentsHandler({ origins, knownSongs, verifyToken, readApproved, submitPending }) {
  const allowed = new Set(origins);
  return async request => {
    const origin = request.headers.get('origin') || '';
    const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', Vary: 'Origin', 'X-Content-Type-Options': 'nosniff' };
    if (allowed.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
    const reply = (status, body) => new Response(JSON.stringify(body), { status, headers });
    if (!allowed.has(origin)) return reply(403, { error: 'This site is not allowed to use song comments.' });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...headers, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
    if (!['GET', 'POST'].includes(request.method)) return reply(405, { error: 'Use GET or POST.' });
    try {
      if (request.method === 'GET') {
        const url = new URL(request.url); const song = url.searchParams.get('song') || '';
        if (!SLUG.test(song) || song.length > 150) return reply(400, { error: 'Choose a valid song.' });
        let cursor = null;
        if (url.searchParams.has('cursor')) {
          const raw = url.searchParams.get('cursor');
          try {
            if (raw.length > 160) throw Error(); cursor = JSON.parse(raw);
            if (!UUID.test(cursor?.id || '') || typeof cursor?.at !== 'string' || !/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|\+00:00)$/.test(cursor.at) || !Number.isFinite(Date.parse(cursor.at)) || new Date(cursor.at).toISOString().slice(0, 19) !== cursor.at.slice(0, 19)) throw Error();
          } catch { return reply(400, { error: 'The comments page is invalid. Reload comments.' }); }
        }
        if (!(await knownSongs()).has(song)) return reply(404, { error: 'This song could not be found.' });
        const rows = await readApproved(song, cursor);
        if (!Array.isArray(rows)) throw Error('invalid-response');
        const comments = rows.slice(0, 10).map(row => ({ id: row.id, displayName: row.displayName, body: row.body, referenceUrl: row.referenceUrl || '', createdAt: row.createdAt }));
        const last = comments.at(-1);
        return reply(200, { comments, nextCursor: rows.length > 10 ? { at: last.createdAt, id: last.id } : null });
      }
      if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return reply(415, { error: 'Use a JSON submission.' });
      let value;
      try { value = await smallJson(request); } catch (error) { return reply(error.message === 'too-large' ? 413 : 400, { error: 'The comment could not be read. Check its length and try again.' }); }
      const { data, errors } = validateComment(value);
      if (Object.keys(errors).length) return reply(400, { error: 'Check the highlighted details.', errors });
      if (!(await knownSongs()).has(data.song)) return reply(404, { error: 'This song could not be found.' });
      const verification = await verifyToken(data.token);
      if (verification.success !== true || verification.action !== 'song-comment' || verification.hostname !== new URL(origin).hostname) return reply(400, { error: 'The spam check expired or failed. Please try it again.', errors: { token: 'Please complete a fresh spam check.' } });
      await submitPending(data);
      return reply(202, { status: 'pending', message: 'Submitted for review. Your comment will appear only if approved.' });
    } catch (error) {
      if (error.code === 'COMMENT_RATE_LIMIT') return reply(429, { error: 'Too many comments have been submitted recently. Please try again later.' });
      if (error.code === 'COMMENT_DRAFT_CHANGED') return reply(409, { error: 'This draft has changed. Edit the comment and submit it again.' });
      return reply(503, { error: 'Comments are temporarily unavailable. Your draft has not been cleared; please try again later.' });
    }
  };
}

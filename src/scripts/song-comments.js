import { validateComment } from '../../supabase/functions/song-comments/handler.mjs';

const turnstileScript = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let verificationScript;
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (verificationScript) return verificationScript;
  verificationScript = new Promise((resolve, reject) => {
    const script = document.createElement('script'); script.src = turnstileScript; script.async = true;
    const timer = setTimeout(() => { script.remove(); verificationScript = null; reject(Error('verification-unavailable')); }, 15000);
    script.onload = () => { clearTimeout(timer); if (window.turnstile) resolve(window.turnstile); else { script.remove(); verificationScript = null; reject(Error('verification-unavailable')); } };
    script.onerror = () => { clearTimeout(timer); script.remove(); verificationScript = null; reject(Error('verification-unavailable')); };
    document.head.append(script);
  });
  return verificationScript;
}

export function publicReference(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password && url.href.length <= 1000 ? url.href : null; } catch { return null; }
}
export function renderComment(document, comment) {
  const item = document.createElement('li'); item.className = 'comments-item';
  const header = document.createElement('div'); header.className = 'comments-item-heading';
  const name = document.createElement('strong'); name.textContent = comment.displayName;
  header.append(name);
  if (Number.isFinite(Date.parse(comment.createdAt))) {
    const date = document.createElement('time'); date.dateTime = comment.createdAt; date.textContent = new Date(comment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); header.append(date);
  }
  const body = document.createElement('p'); body.textContent = comment.body; item.append(header, body);
  const href = publicReference(comment.referenceUrl);
  if (href) { const link = document.createElement('a'); link.href = href; link.textContent = `Reference · ${new URL(href).hostname}`; link.rel = 'ugc nofollow noopener noreferrer'; link.target = '_blank'; item.append(link); }
  return item;
}

export function initSongComments(root) {
  if (!root || root.dataset.commentsEnabled !== 'true') return;
  const q = selector => root.querySelector(selector);
  const load = q('[data-load-comments]'), more = q('[data-more-comments]'), list = q('[data-comments-list]'), listStatus = q('[data-comments-list-status]');
  const discussion = q('[data-comments-discussion]'), form = q('.comments-form'), compose = q('.comments-compose');
  const submit = q('[data-submit-comment]'), status = q('[data-comment-status]'), tokenStatus = q('[data-comment-error="token"]'), retry = q('[data-retry-verification]');
  let cursor = null, started = false, reading = false, sending = false, token = '', widget = null, requestId = null, verifying = false;
  const endpoint = new URL(root.dataset.endpoint);
  async function readComments() {
    if (reading) return; reading = true; load.disabled = true; more.disabled = true; listStatus.textContent = 'Loading comments…';
    try {
      const url = new URL(endpoint); url.searchParams.set('song', root.dataset.song); if (cursor) url.searchParams.set('cursor', JSON.stringify(cursor));
      const response = await fetch(url, { signal: AbortSignal.timeout(12000), credentials: 'omit', cache: 'no-store' });
      if (!response.ok) throw Error();
      const data = await response.json();
      if (!Array.isArray(data.comments) || data.comments.length > 10 || data.comments.some(row => typeof row.body !== 'string' || typeof row.displayName !== 'string')) throw Error();
      data.comments.forEach(comment => list.append(renderComment(document, comment)));
      cursor = data.nextCursor || null; more.hidden = !cursor; load.hidden = true; started = true;
      listStatus.textContent = list.children.length ? `${list.children.length} approved ${list.children.length === 1 ? 'comment' : 'comments'}.` : 'No approved comments yet. You can leave the first one for review.';
    } catch { listStatus.textContent = 'Comments could not load. You can still leave a comment or use the correction link.'; if (!started) load.textContent = 'Retry loading comments'; }
    finally { discussion.hidden = false; load.disabled = false; more.disabled = false; reading = false; }
  }
  load.addEventListener('click', readComments); more.addEventListener('click', readComments);
  async function prepareVerification() {
    if (verifying || widget !== null) return;
    verifying = true; tokenStatus.hidden = false; tokenStatus.textContent = 'Loading spam check…'; retry.hidden = true; submit.disabled = true;
    try {
      const service = await loadTurnstile();
      widget = service.render(q('[data-turnstile]'), {
        sitekey: root.dataset.siteKey, action: 'song-comment', theme: 'auto', size: 'flexible',
        callback(value) { token = value; tokenStatus.textContent = 'Spam check complete.'; },
        'expired-callback'() { token = ''; tokenStatus.textContent = 'Spam check expired. Complete it again before submitting.'; retry.hidden = false; },
        'error-callback'() { token = ''; tokenStatus.textContent = 'Spam check could not finish. Please retry.'; retry.hidden = false; },
      });
      tokenStatus.textContent = token ? 'Spam check complete.' : 'Complete the spam check before submitting.';
      submit.disabled = false;
    } catch { tokenStatus.textContent = 'Spam check could not load. Please retry or use the correction link.'; retry.hidden = false; }
    finally { verifying = false; }
  }
  retry.addEventListener('click', () => {
    if (widget !== null && window.turnstile) { window.turnstile.reset(widget); token = ''; tokenStatus.textContent = 'Complete the spam check before submitting.'; retry.hidden = true; submit.disabled = false; }
    else prepareVerification();
  });
  compose.addEventListener('toggle', () => { if (compose.open) prepareVerification(); });
  form.addEventListener('input', () => { if (!sending) requestId = null; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (sending) return;
    const fields = new FormData(form); requestId ||= crypto.randomUUID();
    const payload = { song: root.dataset.song, displayName: fields.get('displayName'), body: fields.get('body'), referenceUrl: fields.get('referenceUrl'), website: fields.get('website'), consent: fields.get('consent') === 'on', token, requestId };
    root.querySelectorAll('[data-comment-error]').forEach(node => { node.hidden = true; });
    form.querySelectorAll('[aria-invalid]').forEach(node => node.removeAttribute('aria-invalid'));
    const showErrors = errors => {
      let first;
      for (const [name, message] of Object.entries(errors)) {
        if (!['displayName', 'body', 'referenceUrl', 'consent', 'token'].includes(name) || typeof message !== 'string') continue;
        const note = q(`[data-comment-error="${name}"]`); if (note) { note.hidden = false; note.textContent = message; }
        const field = form.elements.namedItem(name); if (field && 'setAttribute' in field) { field.setAttribute('aria-invalid', 'true'); first ||= field; }
      }
      first?.focus();
    };
    const { errors } = validateComment(payload);
    if (Object.keys(errors).length) { showErrors(errors); return; }
    sending = true; submit.disabled = true; submit.textContent = 'Submitting…'; status.hidden = false; status.textContent = 'Submitting your comment for review…';
    // Freeze this draft during the request. A failed request keeps every field.
    const controls = [...form.querySelectorAll('input, textarea')]; controls.forEach(field => field.disabled = true);
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: AbortSignal.timeout(15000), credentials: 'omit' });
      const result = await response.json();
      if (response.status !== 202 || result.status !== 'pending') { if (result.errors) showErrors(result.errors); throw Error(typeof result.error === 'string' ? result.error : 'Your comment could not be submitted. Please try again.'); }
      status.textContent = 'Submitted for review. Your comment will appear only if approved.'; form.reset(); requestId = null;
    } catch (error) { status.textContent = ['AbortError', 'TimeoutError', 'TypeError'].includes(error.name) ? 'We could not confirm receipt. Your text is still here; please retry. Repeating the same draft will not create a duplicate.' : error.message; }
    finally {
      controls.forEach(field => field.disabled = false); sending = false; submit.disabled = false; submit.textContent = 'Submit for review'; token = '';
      if (widget !== null && window.turnstile) window.turnstile.reset(widget);
      tokenStatus.hidden = false; tokenStatus.textContent = 'Complete a fresh spam check before your next submission.'; status.focus();
    }
  });
}

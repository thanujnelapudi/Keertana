export async function initCommentsDemo() {
  const root = document.querySelector('[data-comments-demo]'); if (!root) return;
  const slug = new URLSearchParams(location.search).get('song');
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 150) return;
  try {
    const response = await fetch('/api/search-index.json', { signal: AbortSignal.timeout(8000) }); if (!response.ok) return;
    const index = await response.json(); const song = Array.isArray(index) ? index.find(song => song.s === slug) : null; if (!song || typeof song.t !== 'string') return;
    root.querySelectorAll('[data-back-to-song]').forEach(link => { link.href = `/song/${slug}/`; link.textContent = '← Back to the song'; });
    const context = root.querySelector('[data-demo-context]'); context.textContent = song.t; context.lang = song.g === 'telugu' ? 'te' : song.g === 'hindi' ? 'hi' : 'en'; context.hidden = false;
    const interest = root.querySelector('[data-interest-link]'); if (interest) interest.href = `/comments-demo/interest/?song=${encodeURIComponent(slug)}`;
    const report = root.querySelector('[data-report-link]'); if (report) report.href = `/contribute/report/?song=${encodeURIComponent(slug)}`;
  } catch { /* Preview and interest navigation remain usable without song context. */ }
}

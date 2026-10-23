// Optional GA4 only: no tag or historical-event queue before consent.
(() => {
  const id = document.currentScript?.dataset.measurementId;
  if (!/^G-[A-Z0-9]+$/.test(id || '')) return;
  const key = 'keertana-analytics-consent-v1';
  const panel = document.getElementById('analytics-choice');
  const settings = document.getElementById('analytics-settings');
  let choice = null, started = false;
  try { choice = localStorage.getItem(key); } catch { /* In-memory choice still works. */ }
  const privatePage = /^\/(setlists|contribute)(\/|$)/.test(location.pathname);
  const timers = new Map(), pending = new Map();
  let eventCount = 0;
  const disabledKey = `ga-disable-${id}`;

  function cleanPage() { return location.origin + location.pathname; }
  function start() {
    if (started || choice !== 'granted' || privatePage) return;
    started = true;
    window[disabledKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    let referrer = '';
    try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch { /* Omit invalid referrers. */ }
    window.gtag('config', id, {
      send_page_view: false, allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: cleanPage(), page_referrer: referrer,
      cookie_expires: 15552000, cookie_flags: 'SameSite=Lax;Secure',
    });
    window.gtag('event', 'page_view', { page_location: cleanPage(), page_referrer: referrer });
    const tag = document.createElement('script');
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(tag);
  }
  function event(name, data) {
    if (!started || choice !== 'granted' || privatePage || eventCount >= 40) return;
    eventCount++;
    window.gtag('event', name, { ...data, send_to: id, page_location: cleanPage() });
  }
  function cancel(source) {
    clearTimeout(timers.get(source));
    timers.delete(source); pending.delete(source);
  }
  function flush(source) {
    const data = pending.get(source);
    cancel(source);
    if (data) event('song_search_results', data);
  }
  // Only enum values and a bounded count are accepted, never the query.
  document.addEventListener('keertana:search-results', e => {
    const { source, count } = e.detail || {};
    if (!['home', 'dialog'].includes(source)) return;
    cancel(source);
    if (!started || choice !== 'granted' || !Number.isInteger(count) || count < 0) return;
    pending.set(source, { surface: source, result_range: count === 0 ? 'none' : count < 5 ? '1_to_4' : '5_plus' });
    timers.set(source, setTimeout(() => flush(source), 1200));
  });
  document.addEventListener('input', e => {
    if (e.target?.id === 'search-input') cancel('home');
    if (e.target?.id === 'modal-search-input') cancel('dialog');
  });
  document.addEventListener('click', e => {
    const target = e.target instanceof Element ? e.target : null;
    if (!target) return;
    if (target.closest('#search-clear')) cancel('home');
    if (target.closest('#modal-search-clear')) cancel('dialog');
    const button = target.closest('[data-analytics-choice]');
    if (button) {
      choice = button.dataset.analyticsChoice;
      try { localStorage.setItem(key, choice); } catch { /* Session-only fallback. */ }
      panel.hidden = true;
      settings?.focus();
      if (choice === 'granted') start();
      else {
        window[disabledKey] = true;
        for (const source of ['home', 'dialog']) cancel(source);
        // Remove GA cookies at the host and parent-domain scopes.
        const parts = location.hostname.split('.');
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.split('=')[0].trim();
          if (name !== '_ga' && !name.startsWith('_ga_')) continue;
          document.cookie = `${name}=; Max-Age=0; path=/`;
          for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`;
        }
        if (started) location.reload();
      }
      return;
    }
    const link = target.closest('a[href]');
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    const song = /^\/song\/[a-z0-9-]+\/$/.test(url.pathname);
    if (song && link.matches('.suggestion-item, .dialog-suggestion-item')) {
      const source = link.matches('.dialog-suggestion-item') ? 'dialog' : 'home';
      flush(source);
      event('song_search_select', { surface: source });
    } else if (song && /^\/collections\/[a-z0-9-]+\//.test(location.pathname)) {
      event('collection_song_select', { collection: location.pathname.split('/')[2] });
    } else if (link.matches('.worship-collection-card') && /^\/collections\/[a-z0-9-]+\/$/.test(url.pathname)) {
      event('collection_open', { collection: url.pathname.split('/')[2] });
    }
  });
  settings?.addEventListener('click', () => { panel.hidden = false; panel.querySelector('button')?.focus(); });
  window.addEventListener('pagehide', () => { for (const source of ['home', 'dialog']) cancel(source); });
  window.addEventListener('storage', e => {
    if (e.key === key) {
      choice = e.newValue;
      if (choice !== 'granted' && started) { window[disabledKey] = true; location.reload(); }
      else if (choice === 'granted') { panel.hidden = true; start(); }
    }
  });
  panel.hidden = ['granted', 'denied'].includes(choice);
  start();
})();

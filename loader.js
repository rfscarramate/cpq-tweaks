// loader.js - modular orchestrator (logic prioritized, UI optional)
// Behavior:
// - Loads logic/core.js always
// - Loads logic/quotes.js if path includes /quotes/
// - Loads ui/core.js and ui/quotes.js when on mobile viewport
// - Persistent cache in localStorage, check on each page load (cache-busting by timestamp)
(async function(){
  const BASE = 'https://rfscarramate.github.io/cpq-tweaks/';
  const PATH = window.location.pathname.toLowerCase();
  const segment = PATH.split('/').filter(Boolean)[0] || 'root';
  const isQuotes = PATH.includes('/quotes/');
  const isMobile = window.innerWidth < 900 || /Android|iPhone/i.test(navigator.userAgent);
  const CACHE_KEY = 'cpq_tweaks_mod_cache_v1';
  const CACHE_TIME = 1000 * 60 * 60 * 24; // 24h

  function log(...args){ try{ console.log('[CPQ-Loader]', ...args); }catch(e){} }

  async function fetchText(url) {
    const resp = await fetch(url, {cache: 'no-store'});
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
  }

  async function safeLoad(url) {
    try {
      const code = await fetchText(url + '?t=' + Date.now());
      (0,eval)(code);
      log('Loaded', url);
      return true;
    } catch (e) {
      log('Failed to load', url, e);
      return false;
    }
  }

  // try to use cache (loader-level); if not available fetch remote loader (this file)
  try {
    // Always attempt to load logic/core.js
    await safeLoad(BASE + 'logic/core.js');

    // Load route-specific logic
    if (isQuotes) {
      await safeLoad(BASE + 'logic/quotes.js');
    } else {
      // no-op for now
    }

    // UI on mobile only
    if (isMobile) {
      await safeLoad(BASE + 'ui/core.js');
      if (isQuotes) {
        await safeLoad(BASE + 'ui/quotes.js');
      }
    }

    log('Module loading complete.');
  } catch (e) {
    log('Loader top-level error', e);
  }
})();

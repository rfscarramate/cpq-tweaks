// loader.js - modular orchestrator (logic prioritized, UI optional)
// Behavior:
// - Loads logic/core.js always
// - Loads logic/quotes.js if path includes /quotes/
// - Loads ui/core.js and ui/quotes.js when on mobile viewport
// - Persistent cache in localStorage, refreshed every 24h
(async function(){
  const BASE = 'https://rfscarramate.github.io/cpq-tweaks/';
  const PATH = window.location.pathname.toLowerCase();
  const isQuotes = PATH.includes('/quotes/');
  const isMobile = window.innerWidth < 900 || /Android|iPhone/i.test(navigator.userAgent);
  const CACHE_PREFIX = 'cpq_tweaks_';
  const CACHE_TIME = 1000 * 60 * 60 * 24; // 24h

  function log(...args){ try{ console.log('[CPQ-Loader]', ...args); }catch(e){} }

  function now(){ return Date.now(); }

  async function fetchText(url) {
    const resp = await fetch(url + '?t=' + now(), { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
  }

  function getCache(key){
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if(!raw) return null;
    try {
      const data = JSON.parse(raw);
      if(now() - data.time > CACHE_TIME) return null;
      return data.code;
    } catch(e){
      return null;
    }
  }

  function setCache(key, code){
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({code, time: now()}));
    } catch(e){
      log('Cache write failed', key, e);
    }
  }

  async function loadModule(path){
    const cacheKey = path.replace(/\//g,'_');
    let code = getCache(cacheKey);
    if(code){
      window.CPQ_TWEAKS_LOAD_METHOD = 'Cache';
      (0,eval)(code);
      log('Loaded from cache:', path);
      return true;
    }

    try {
      code = await fetchText(BASE + path);
      setCache(cacheKey, code);
      window.CPQ_TWEAKS_LOAD_METHOD = 'OTA';
      (0,eval)(code);
      log('Loaded OTA:', path);
      return true;
    } catch(e){
      log('Failed to load', path, e);
      return false;
    }
  }

  try {
    await loadModule('logic/core.js');
    if (isQuotes) await loadModule('logic/quotes.js');
    if (isMobile){
      await loadModule('ui/core.js');
      if (isQuotes) await loadModule('ui/quotes.js');
    }
    log('Module loading complete.');
  } catch(e){
    log('Loader top-level error', e);
  }
})();

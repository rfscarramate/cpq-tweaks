/**
 * CPQ Tweaks - Loader Principal
 * Módulo orquestrador responsável pelo carregamento condicional e assíncrono
 * dos scripts de lógica e interface com cache otimizado.
 * 
 * Comportamento:
 * - Sempre carrega logic/core.js
 * - Carrega logic/quotes.js se o path incluir '/quotes/'
 * - Carrega ui/core.js e ui/quotes.js apenas em dispositivos mobile
 * - Cache persistente em localStorage com validade de 24h
 * - Dispara evento 'tweaksLoaded' ao concluir carregamento
 */

(async function() {
  // Configuração base
  const BASE = 'https://rfscarramate.github.io/cpq-tweaks/';
  const PATH = window.location.pathname.toLowerCase();
  const isQuotes = PATH.includes('/quotes/');
  const isMobile = window.innerWidth < 900 || /Android|iPhone/i.test(navigator.userAgent);
  
  // Constantes de cache
  const CACHE_PREFIX = 'cpq_tweaks_';
  const CACHE_TIME = 1000 * 60 * 60 * 24; // 24 horas
  
  // Ambiente de execução (configurável via build)
  window.CPQ_ENV = window.CPQ_ENV || "${CPQ_ENV}" || "debug";
  
  /**
   * Logger condicional para debug
   * @param {...any} args - Argumentos para log
   */
  function log(...args) {
    try {
      console.log('[CPQ-Loader]', ...args);
    } catch(e) {}
  }
  
  /**
   * Retorna timestamp atual
   * @returns {number} Timestamp em milissegundos
   */
  function now() {
    return Date.now();
  }
  
  /**
   * Busca texto via fetch com bypass de cache HTTP
   * @param {string} url - URL do recurso
   * @returns {Promise<string>} Texto do recurso
   * @throws {Error} Se requisição falhar
   */
  async function fetchText(url) {
    const resp = await fetch(url + '?t=' + now(), { cache: 'no-store' });
    if (!resp.ok) throw new Error('HTTP ' + resp.status);
    return await resp.text();
  }
  
  /**
   * Recupera código do cache localStorage se válido
   * @param {string} key - Chave do cache
   * @returns {string|null} Código em cache ou null se expirado/inexistente
   */
  function getCache(key) {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (now() - data.time > CACHE_TIME) return null;
      return data.code;
    } catch(e) {
      return null;
    }
  }
  
  /**
   * Salva código em cache localStorage com timestamp
   * @param {string} key - Chave do cache
   * @param {string} code - Código JavaScript a armazenar
   */
  function setCache(key, code) {
    try {
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({code, time: now()}));
    } catch(e) {
      log('Cache write failed', key, e);
    }
  }
  
  /**
   * Carrega e executa módulo JavaScript de forma segura
   * Tenta cache primeiro, depois fetch OTA
   * @param {string} path - Caminho relativo do módulo
   * @returns {Promise<boolean>} true se sucesso, false se falhar
   */
  async function loadModule(path) {
    const cacheKey = path.replace(///g, '_');
    let code = getCache(cacheKey);
    
    if (code) {
      window.CPQ_TWEAKS_LOAD_METHOD = 'Cache';
      try {
        // Execução segura via Function (melhor que eval direto)
        new Function(code)();
        log('Loaded from cache:', path);
        return true;
      } catch(e) {
        log('Cache execution failed, fetching fresh:', path, e);
        code = null; // Invalida cache corrompido
      }
    }
    
    try {
      code = await fetchText(BASE + path);
      setCache(cacheKey, code);
      window.CPQ_TWEAKS_LOAD_METHOD = 'OTA';
      new Function(code)();
      log('Loaded OTA:', path);
      return true;
    } catch(e) {
      log('Failed to load', path, e);
      return false;
    }
  }
  
  // Sequência de carregamento principal
  try {
    log(`Starting module loading sequence [env=${window.CPQ_ENV}]...`);
    const results = [];
    
    // Carrega lógica core (sempre)
    results.push(await loadModule('logic/core.js'));
    
    // Carrega lógica de quotes (condicional)
    if (isQuotes) {
      results.push(await loadModule('logic/quotes.js'));
    }
    
    // Carrega UI (apenas em mobile)
    if (isMobile) {
      results.push(await loadModule('ui/core.js'));
      if (isQuotes) {
        results.push(await loadModule('ui/quotes.js'));
      }
    }
    
    const success = results.every(Boolean);
    if (success) {
      log('✅ All modules loaded successfully.');
    } else {
      log('⚠️ Some modules failed to load. Continuing gracefully.');
    }
    
    // Dispara evento de conclusão
    window.dispatchEvent(new Event("tweaksLoaded"));
    log('Event "tweaksLoaded" dispatched.');
    
  } catch(e) {
    log('Loader top-level error', e);
  }
})();

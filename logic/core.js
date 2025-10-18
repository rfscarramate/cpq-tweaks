// logic/core.js - core logic helpers for CPQ tweaks
(function(){
  console.log('[CPQ Logic] core loaded');
  window.CPQ = window.CPQ || {};

  // waitFor utility
  CPQ.waitFor = function(selector, timeout=15000){
    return new Promise((resolve, reject)=>{
      const start = Date.now();
      (function check(){
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - start > timeout) return reject(new Error('timeout ' + selector));
        setTimeout(check, 200);
      })();
    });
  };

  // quickSave utility (tries common selectors)
  CPQ.quickSave = function(){
    const selectors = ['button[type=submit]', 'button.save', '.btn-save', '[data-action="save"]'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) { el.click(); return true; }
    }
    return false;
  };

  // Expose a simple logger
  CPQ.log = function(...args){ try{ console.log('[CPQ]', ...args); }catch(e){} };
})();

(function showDebugBanner() {
  try {
    const version = 'v0.9.4'; // 🔧 atualize sempre que fizer mudanças relevantes
    const source = 'logic/core.js';
    const urlBase = 'https://rfscarramate.github.io/cpq-tweaks/';
    const fullSource = `${urlBase}${source}`;
    const timestamp = new Date().toLocaleString('pt-BR');

    // 🚀 Detecta se o script veio do cache local ou foi baixado via OTA
    // Essa flag deve ser definida pelo seu loader.js ao aplicar o cache.
    const loadMethod = window.CPQ_TWEAKS_LOAD_METHOD || 'OTA';
    // exemplos esperados: 'OTA', 'Cache'

    // Evita duplicação
    if (document.getElementById('cpq-debug-banner')) return;

    const banner = document.createElement('div');
    banner.id = 'cpq-debug-banner';
    banner.innerText = `🧩 CPQ Tweaks ${version} (${loadMethod}) carregados\n${timestamp}`;
    banner.title = `Fonte: ${fullSource}`;
    Object.assign(banner.style, {
      position: 'fixed',
      bottom: '8px',
      right: '8px',
      background: loadMethod === 'Cache' ? 'rgba(0,120,255,0.75)' : 'rgba(0,0,0,0.75)',
      color: '#fff',
      fontSize: '11px',
      fontFamily: 'monospace',
      padding: '4px 8px',
      borderRadius: '8px',
      zIndex: 999999,
      opacity: 0.5,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      whiteSpace: 'pre-line', // quebra de linha
    });

    banner.addEventListener('mouseenter', () => (banner.style.opacity = 1));
    banner.addEventListener('mouseleave', () => (banner.style.opacity = 0.5));

    document.body.appendChild(banner);

    if (loadMethod === 'OTA') {
      banner.animate(
        [{ opacity: 0.2 }, { opacity: 1 }, { opacity: 0.2 }, { opacity: 0.5 }],
        { duration: 1200, iterations: 1 }
      );
    }

    console.log(`[CPQ Tweaks] ${version} (${loadMethod}) carregado de ${fullSource} em ${timestamp}`);
  } catch (err) {
    console.warn('[CPQ Tweaks] Erro ao exibir banner:', err);
  }
})();

// === Auto-select "Employee" on Auth0 login page (hybrid optimized) ===
(function autoSelectEmployeeAuth0Hybrid() {
  try {
    if (!/signify-it-production\.eu\.auth0\.com/i.test(location.hostname)) return;

    let hasClicked = false;

    const clickEmployee = () => {
      if (hasClicked) return true; // evita duplos cliques
      const el =
        document.querySelector('[data-provider*="employee"]') ||
        [...document.querySelectorAll('button,a,input')]
          .find(e => (e.textContent || e.value || '').toLowerCase().includes('employee'));

      if (el) {
        hasClicked = true;
        console.log('[CPQ Tweaks] Auto-selecting "Employee" login option...');
        // pequeno delay pra garantir que o React anexou o listener
        setTimeout(() => el.click(), 50);
        return true;
      }
      return false;
    };

    // 1️⃣ tenta imediatamente (caso o botão já esteja renderizado)
    if (clickEmployee()) return;

    // 2️⃣ observa o DOM e clica assim que o botão aparecer
    const observer = new MutationObserver(() => {
      if (clickEmployee()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 3️⃣ fallback adicional com polling leve (só 1 vez a cada 300ms)
    let tries = 0;
    const maxTries = 30;
    const interval = setInterval(() => {
      tries++;
      if (clickEmployee() || tries >= maxTries) {
        clearInterval(interval);
        observer.disconnect();
      }
    }, 300);

    // 4️⃣ failsafe — encerra tudo após 10s
    setTimeout(() => {
      clearInterval(interval);
      observer.disconnect();
    }, 10000);

  } catch (err) {
    console.warn('[CPQ Tweaks] Erro no auto-select Employee Auth0:', err);
  }
})();

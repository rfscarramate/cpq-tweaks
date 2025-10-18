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

// === Auto-select "Employee" on Auth0 login page with loading overlay ===
(function autoSelectEmployeeAuth0WithLoading() {
  try {
    // Executa apenas no domínio Auth0 da Signify
    if (!/signify-it-production\.eu\.auth0\.com/i.test(location.hostname)) return;

    let hasClicked = false;
    let overlay = null;

    // Cria e exibe o overlay de "Carregando..."
    const showOverlay = () => {
      if (overlay) return;
      overlay = document.createElement('div');
      overlay.id = 'cpq-auth-loading';
      overlay.innerHTML = `
        <div style="
          background: rgba(0,0,0,0.85);
          color: #fff;
          font-family: sans-serif;
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          font-size: 1.1rem;
        ">
          <div style="margin-bottom: 0.6rem;">Entrando automaticamente...</div>
          <div class="spinner" style="
            border: 3px solid rgba(255,255,255,0.2);
            border-top: 3px solid #00ff9d;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            animation: cpq-spin 1s linear infinite;
          "></div>
        </div>
        <style>@keyframes cpq-spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }</style>
      `;
      document.body.appendChild(overlay);
    };

    // Remove o overlay em caso de fallback
    const hideOverlay = () => {
      if (overlay) overlay.remove();
    };

    const clickEmployee = () => {
      if (hasClicked) return true;
      const el =
        document.querySelector('[data-provider*="employee"]') ||
        [...document.querySelectorAll('button,a,input')]
          .find(e => (e.textContent || e.value || '').toLowerCase().includes('employee'));
      if (el) {
        hasClicked = true;
        console.log('[CPQ Tweaks] Auto-selecting "Employee" login option...');
        showOverlay();
        setTimeout(() => el.click(), 80); // leve atraso p/ garantir listener
        return true;
      }
      return false;
    };

    // 1️⃣ tenta de imediato
    if (clickEmployee()) return;

    // 2️⃣ observa dinamicamente o DOM
    const observer = new MutationObserver(() => {
      if (clickEmployee()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 3️⃣ fallback com polling (por segurança)
    let tries = 0;
    const interval = setInterval(() => {
      tries++;
      if (clickEmployee() || tries >= 30) {
        clearInterval(interval);
        observer.disconnect();
      }
    }, 300);

    // 4️⃣ Fallback visual — se após 6s nada acontecer, remove o overlay
    // e deixa o usuário interagir normalmente
    setTimeout(() => {
      if (!hasClicked) {
        console.warn('[CPQ Tweaks] Fallback: botão não encontrado, liberando interface.');
        hideOverlay();
      }
    }, 6000);

  } catch (err) {
    console.warn('[CPQ Tweaks] Erro no auto-select Employee Auth0:', err);
  }
})();

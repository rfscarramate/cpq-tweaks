/**
 * CPQ Tweaks - Logic Core
 * Módulo de lógica principal com utilitários para manipulação de DOM,
 * espera assíncrona por elementos, ações rápidas e auto-seleção em Auth0.
 */

(function() {
  console.log('[CPQ Logic] core loaded');
  
  // Inicializa namespace global CPQ
  window.CPQ = window.CPQ || {};
  
  /**
   * Aguarda elemento aparecer no DOM com timeout configurável
   * @param {string} selector - Seletor CSS do elemento
   * @param {number} [timeout=15000] - Tempo máximo de espera em ms
   * @returns {Promise<Element>} Promessa que resolve com o elemento encontrado
   * @throws {Error} Se timeout for atingido antes de encontrar elemento
   */
  CPQ.waitFor = function(selector, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const start = Date.now();
      
      (function check() {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        
        if (Date.now() - start > timeout) {
          return reject(new Error('timeout ' + selector));
        }
        
        setTimeout(check, 200);
      })();
    });
  };
  
  /**
   * Tenta acionar botão de salvar procurando por seletores comuns
   * @returns {boolean} true se encontrou e clicou, false caso contrário
   */
  CPQ.quickSave = function() {
    const selectors = [
      'button[type=submit]',
      'button.save',
      '.btn-save',
      '[data-action="save"]'
    ];
    
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (el) {
        el.click();
        return true;
      }
    }
    
    return false;
  };
  
  /**
   * Logger simplificado com prefixo CPQ
   * @param {...any} args - Argumentos para log
   */
  CPQ.log = function(...args) {
    try {
      console.log('[CPQ]', ...args);
    } catch(e) {}
  };
  
})();

/**
 * Auto-seleção de "Employee" na página de login Auth0 da Signify
 * com overlay de carregamento para feedback visual
 */
(function autoSelectEmployeeAuth0WithLoading() {
  try {
    // Executa apenas no domínio Auth0 da Signify
    if (!/signify-it-production.eu.auth0.com/i.test(location.hostname)) {
      return;
    }
    
    let hasClicked = false;
    let overlay = null;
    
    /**
     * Cria e exibe overlay de "Carregando..."
     */
    const showOverlay = () => {
      if (overlay) return;
      
      overlay = document.createElement('div');
      overlay.id = 'cpq-auth-loading';
      overlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999999;
          font-family: system-ui, sans-serif;
        ">
          <div style="
            background: white;
            padding: 32px 48px;
            border-radius: 16px;
            text-align: center;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
          ">
            <div style="
              width: 48px;
              height: 48px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #007bff;
              border-radius: 50%;
              margin: 0 auto 16px;
              animation: spin 1s linear infinite;
            "></div>
            <p style="
              margin: 0;
              font-size: 18px;
              font-weight: 600;
              color: #333;
            ">Carregando...</p>
            <p style="
              margin: 8px 0 0;
              font-size: 14px;
              color: #666;
            ">Autenticando Employee</p>
          </div>
        </div>
        <style>
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      `;
      document.body.appendChild(overlay);
    };
    
    /**
     * Remove overlay da tela
     */
    const hideOverlay = () => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
        overlay = null;
      }
    };
    
    /**
     * Verifica e clica em botão Employee se disponível
     */
    const tryClickEmployee = () => {
      if (hasClicked) return;
      
      const button = document.querySelector('button[data-action-button-primary="true"][name="employee"]');
      if (button) {
        hasClicked = true;
        showOverlay();
        
        setTimeout(() => {
          button.click();
          CPQ.log && CPQ.log('Auto-clicked Employee button on Auth0');
        }, 300);
        
        // Failsafe: remove overlay após 5s caso não redirecione
        setTimeout(hideOverlay, 5000);
      }
    };
    
    // Tenta clique imediato
    tryClickEmployee();
    
    // Observa mudanças no DOM para capturar botão carregado dinamicamente
    const observer = new MutationObserver(() => {
      if (!hasClicked) {
        tryClickEmployee();
      } else {
        observer.disconnect();
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    // Desconecta observer após 8 segundos para evitar vazamento de memória
    setTimeout(() => {
      observer.disconnect();
    }, 8000);
    
  } catch(e) {
    console.warn('[CPQ] autoSelectEmployeeAuth0WithLoading error:', e);
  }
})();

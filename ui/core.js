/**
 * CPQ Tweaks - UI Core
 * Módulo de interface responsável por aplicar estilos, criar barras de ação
 * e exibir banner de debug com informações de carregamento.
 */

(function() {
  console.log('[CPQ UI] core loaded');
  
  // ------------------------------
  // 🎨 Carregamento de CSS externo
  // ------------------------------
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'https://rfscarramate.github.io/cpq-tweaks/ui/style.css';
  document.head.appendChild(cssLink);
  
  // ------------------------------
  // ⚙️ Helpers de Interface
  // ------------------------------
  window.CPQ = window.CPQ || {};
  
  /**
   * Cria barra inferior fixa com botões de ação rápida
   * Previne duplicação checando se já existe
   * @param {Array<{text:string, onClick:function}>} buttons - Lista de botões
   * @returns {HTMLElement} Elemento da barra criada ou existente
   */
  CPQ.createBottomBar = function(buttons) {
    if (document.querySelector('.cpq-bottom-bar')) {
      return document.querySelector('.cpq-bottom-bar');
    }
    
    const bar = document.createElement('div');
    bar.className = 'cpq-bottom-bar';
    
    (buttons || []).forEach(b => {
      const btn = document.createElement('button');
      btn.textContent = b.text || 'Action';
      btn.type = 'button';
      
      btn.onclick = function() {
        try {
          if (b.onClick) {
            b.onClick();
          } else {
            alert(b.text || 'Action');
          }
        } catch(e) {
          console.error('[CPQ] Button error:', e);
        }
      };
      
      bar.appendChild(btn);
    });
    
    document.body.appendChild(bar);
    return bar;
  };
  
  // ------------------------------
  // 🧩 Banner de Debug + OTA
  // ------------------------------
  
  /**
   * Exibe banner informativo no canto inferior direito
   * Apenas em modo debug, com botão para atualização forçada
   */
  function showDebugBanner() {
    if (window.CPQ_ENV !== 'debug') return;
    
    // Remove banner antigo se existir
    const oldBanner = document.getElementById("cpq-debug-banner");
    if (oldBanner) oldBanner.remove();
    
    const banner = document.createElement("div");
    banner.id = "cpq-debug-banner";
    
    // Formatação de data legível
    const date = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
    
    // Informação de método de carregamento
    const info = document.createElement("span");
    const method = window.CPQ_TWEAKS_LOAD_METHOD || "desconhecido";
    info.innerHTML = `🧩 CPQ Tweaks carregados via <strong>${method}</strong> • ${date}`;
    
    // Botão de atualização forçada
    const updateBtn = document.createElement("button");
    updateBtn.textContent = "⟳ Atualizar";
    updateBtn.onclick = () => {
      if (!confirm("Deseja forçar atualização OTA agora?")) return;
      
      banner.innerHTML = "🔄 Atualizando CPQ Tweaks...";
      
      setTimeout(() => {
        try {
          // Limpa todos os tipos de cache
          localStorage.clear();
          sessionStorage.clear();
          
          if ('caches' in window) {
            caches.keys().then(keys => keys.map(c => caches.delete(c)));
          }
          
          if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(regs => {
              regs.map(reg => reg.unregister());
            });
          }
        } catch(e) {
          console.warn('[CPQ] Cache clear error:', e);
        }
        
        location.reload(true);
      }, 1000);
    };
    
    banner.appendChild(info);
    banner.appendChild(updateBtn);
    document.body.appendChild(banner);
    
    // Auto-remove banner após 15 segundos
    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(8px)";
      setTimeout(() => banner.remove(), 400);
    }, 15000);
  }
  
  // Aguarda evento de carregamento completo
  window.addEventListener("tweaksLoaded", showDebugBanner);
  
})();

// ui/core.js - base responsive CSS and UI helpers
(function(){
  console.log('[CPQ UI] core loaded');

  // ------------------------------
  // 🎨 Estilos e temas base
  // ------------------------------
  const css = `
    :root{ --cpq-bg:#f6f7f9; --cpq-card:#ffffff; --cpq-primary:#007bff; --cpq-radius:12px; }
    html,body{ height:100%; margin:0; padding:0; font-family: Inter, Roboto, Arial, sans-serif; background:var(--cpq-bg); -webkit-font-smoothing:antialiased; }
    .cpq-container{ max-width:980px; margin:0 auto; padding:12px; }
    .cpq-card{ background:var(--cpq-card); border-radius:var(--cpq-radius); padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.06); margin-bottom:12px; }
    input, select, textarea, button { font-size:16px !important; padding:10px 12px !important; border-radius:10px !important; box-sizing:border-box; }
    .cpq-bottom-bar{ position:fixed; left:12px; right:12px; bottom:12px; z-index:99999; display:flex; gap:8px; }
    .cpq-bottom-bar button{ flex:1; padding:12px; border-radius:999px; border:none; background:var(--cpq-primary); color:#fff; font-weight:600; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
    @media(min-width:900px){ .cpq-bottom-bar{ display:none; } .cpq-container{ max-width:1200px; } }

    /* ✨ Banner OTA */
    #cpq-debug-banner {
      position: fixed;
      bottom: 18px;
      right: 18px;
      background: rgba(0,0,0,0.82);
      color: #fff;
      padding: 10px 16px;
      border-radius: 12px;
      font-family: system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.4em;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      cursor: default;
      opacity: 0.9;
    }
    #cpq-debug-banner:hover {
      background: rgba(40,40,40,0.95);
      opacity: 1;
      transform: translateY(-2px);
    }
    #cpq-debug-banner button {
      background: rgba(255,255,255,0.1);
      color: #fff;
      border: none;
      border-radius: 6px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.15s ease;
    }
    #cpq-debug-banner button:hover {
      background: rgba(255,255,255,0.25);
      transform: scale(1.05);
    }
  `;
  const style = document.createElement('style');
  style.id = 'cpq-ui-core-style';
  style.textContent = css;
  document.head.appendChild(style);

  // ------------------------------
  // ⚙️ Helpers de interface
  // ------------------------------
  window.CPQ = window.CPQ || {};

  /**
   * Cria uma barra inferior fixa com botões.
   */
  CPQ.createBottomBar = function(buttons){
    if (document.querySelector('.cpq-bottom-bar')) return;
    const bar = document.createElement('div');
    bar.className = 'cpq-bottom-bar';
    (buttons || []).forEach(b=>{
      const btn = document.createElement('button');
      btn.textContent = b.text || 'Action';
      btn.onclick = b.onClick || function(){ alert(b.text || 'Action'); };
      bar.appendChild(btn);
    });
    document.body.appendChild(bar);
    return bar;
  };

  // ------------------------------
  // 🧩 Banner OTA + botão de atualização
  // ------------------------------
  function showDebugBanner() {
    const oldBanner = document.getElementById("cpq-debug-banner");
    if (oldBanner) oldBanner.remove();

    const banner = document.createElement("div");
    banner.id = "cpq-debug-banner";

    const date = new Date().toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });

    const info = document.createElement("span");
    info.innerHTML = `🧩 <b>CPQ Tweaks</b> carregados<br><small>${date}</small>`;

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "⟳ Atualizar";
    updateBtn.onclick = () => {
      if (!confirm("Deseja forçar atualização OTA agora?")) return;
      banner.innerHTML = "🔄 Atualizando CPQ Tweaks...";

      setTimeout(() => {
        // Limpa caches
        if ("caches" in window) {
          caches.keys()
            .then(keys => Promise.all(keys.map(k => caches.delete(k))))
            .catch(err => console.warn("Falha ao limpar caches", err));
        }

        // Remove service workers
        if ("serviceWorker" in navigator) {
          navigator.serviceWorker.getRegistrations()
            .then(regs => Promise.all(regs.map(r => r.unregister())))
            .catch(err => console.warn("Falha ao limpar service workers", err));
        }

        // Limpa armazenamento local
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.warn("Falha ao limpar storage", e);
        }

        // Recarrega app
        location.reload(true);
      }, 1000);
    };

    banner.appendChild(info);
    banner.appendChild(updateBtn);
    document.body.appendChild(banner);

    // Remove automaticamente após 15s (opcional)
    setTimeout(() => {
      if (document.getElementById("cpq-debug-banner")) {
        banner.style.opacity = "0";
        banner.style.transform = "translateY(8px)";
        setTimeout(() => banner.remove(), 400);
      }
    }, 15000);
  }

  // Exibe o banner após evento de carregamento dos tweaks
  window.addEventListener("tweaksLoaded", showDebugBanner);
})();

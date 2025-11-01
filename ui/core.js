// ui/core.js - base responsive CSS and UI helpers
(function(){
  console.log('[CPQ UI] core loaded');

  // ------------------------------
  // 🎨 Estilos externos
  // ------------------------------
  const cssLink = document.createElement('link');
  cssLink.rel = 'stylesheet';
  cssLink.href = 'https://rfscarramate.github.io/cpq-tweaks/ui/style.css';
  document.head.appendChild(cssLink);

  // ------------------------------
  // ⚙️ Helpers de interface
  // ------------------------------
  window.CPQ = window.CPQ || {};

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
  // 🧩 Banner OTA + botão de atualização (somente em debug)
  // ------------------------------
  function showDebugBanner() {
    if (window.CPQ_ENV !== 'debug') return;

    const oldBanner = document.getElementById("cpq-debug-banner");
    if (oldBanner) oldBanner.remove();

    const banner = document.createElement("div");
    banner.id = "cpq-debug-banner";

    const date = new Date().toLocaleString("pt-BR", {
      day: "2-digit", month: "2-digit", year: "2-digit",
      hour: "2-digit", minute: "2-digit"
    });

    const info = document.createElement("span");
    const method = window.CPQ_TWEAKS_LOAD_METHOD || "desconhecido";
    info.innerHTML = `🧩 <b>CPQ Tweaks</b> carregados via <b>${method}</b><br><small>${date}</small>`;

    const updateBtn = document.createElement("button");
    updateBtn.textContent = "⟳ Atualizar";
    updateBtn.onclick = () => {
      if (!confirm("Deseja forçar atualização OTA agora?")) return;
      banner.innerHTML = "🔄 Atualizando CPQ Tweaks...";
      setTimeout(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
          if ('caches' in window) caches.keys().then(k=>k.map(c=>caches.delete(c)));
          if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then(r=>r.map(x=>x.unregister()));
        } catch (e) { console.warn(e); }
        location.reload(true);
      }, 1000);
    };

    banner.appendChild(info);
    banner.appendChild(updateBtn);
    document.body.appendChild(banner);

    setTimeout(() => {
      banner.style.opacity = "0";
      banner.style.transform = "translateY(8px)";
      setTimeout(() => banner.remove(), 400);
    }, 15000);
  }

  window.addEventListener("tweaksLoaded", showDebugBanner);
})();

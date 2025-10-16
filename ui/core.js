// ui/core.js - base responsive CSS and UI helpers
(function(){
  console.log('[CPQ UI] core loaded');

  const css = `
    :root{ --cpq-bg:#f6f7f9; --cpq-card:#ffffff; --cpq-primary:#007bff; --cpq-radius:12px; }
    html,body{ height:100%; margin:0; padding:0; font-family: Inter, Roboto, Arial, sans-serif; background:var(--cpq-bg); -webkit-font-smoothing:antialiased; }
    .cpq-container{ max-width:980px; margin:0 auto; padding:12px; }
    .cpq-card{ background:var(--cpq-card); border-radius:var(--cpq-radius); padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.06); margin-bottom:12px; }
    input, select, textarea, button { font-size:16px !important; padding:10px 12px !important; border-radius:10px !important; box-sizing:border-box; }
    .cpq-bottom-bar{ position:fixed; left:12px; right:12px; bottom:12px; z-index:99999; display:flex; gap:8px; }
    .cpq-bottom-bar button{ flex:1; padding:12px; border-radius:999px; border:none; background:var(--cpq-primary); color:#fff; font-weight:600; box-shadow:0 6px 18px rgba(0,0,0,0.08); }
    @media(min-width:900px){ .cpq-bottom-bar{ display:none; } .cpq-container{ max-width:1200px; } }
  `;
  const style = document.createElement('style');
  style.id = 'cpq-ui-core-style';
  style.textContent = css;
  document.head.appendChild(style);

  // helper to create bottom bar if not present
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
})();

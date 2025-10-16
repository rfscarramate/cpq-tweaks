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

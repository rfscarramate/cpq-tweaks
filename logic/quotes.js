// logic/quotes.js - logic tweaks for /quotes/
(function(){
  console.log('[CPQ Logic] quotes module loaded');

  async function init(){
    try {
      // Wait for a container that usually exists in quotes pages
      await window.CPQ.waitFor('.quote-details, .quote-container, [data-quote-id]', 10000);

      // Example behavior: expand collapsed sections
      document.querySelectorAll('.expand-toggle, .section-toggle, [data-toggle="expand"]').forEach(t=> {
        try{
          const aria = t.getAttribute && t.getAttribute('aria-expanded');
          if (aria === 'false') t.click();
        }catch(e){}
      });

      // Example: add keyboard shortcut Ctrl+S to trigger quickSave
      window.addEventListener('keydown', function(e){
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          if (!window.CPQ.quickSave()) {
            CPQ.log('Quick save not found on this page.');
          } else {
            CPQ.log('Quick save triggered via shortcut.');
          }
        }
      });

    } catch(e){
      console.warn('quotes init error', e);
    }
  }

  init();
})();

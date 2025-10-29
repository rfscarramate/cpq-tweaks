/**
 * CPQ Tweaks - Logic Quotes
 * Módulo de lógica específico para páginas de cotações (/quotes/)
 * Inclui expansão automática de seções e atalho de teclado para salvar
 */

(function() {
  console.log('[CPQ Logic] quotes module loaded');
  
  /**
   * Inicialização assíncrona do módulo de quotes
   */
  async function init() {
    try {
      // Aguarda container típico de páginas de quotes aparecer
      await window.CPQ.waitFor('.quote-details, .quote-container, [data-quote-id]', 10000);
      
      // Expande seções colapsadas automaticamente
      expandCollapsedSections();
      
      // Adiciona atalho de teclado Ctrl+S para salvar
      addQuickSaveShortcut();
      
    } catch(e) {
      console.warn('[CPQ] quotes init error', e);
    }
  }
  
  /**
   * Expande todas as seções colapsadas na página
   */
  function expandCollapsedSections() {
    const toggles = document.querySelectorAll('.expand-toggle, .section-toggle, [data-toggle="expand"]');
    
    toggles.forEach(toggle => {
      try {
        const aria = toggle.getAttribute && toggle.getAttribute('aria-expanded');
        if (aria === 'false') {
          toggle.click();
        }
      } catch(e) {
        // Ignora erro individual e continua processando
      }
    });
  }
  
  /**
   * Adiciona listener para atalho Ctrl+S (ou Cmd+S no Mac)
   */
  function addQuickSaveShortcut() {
    window.addEventListener('keydown', function(e) {
      // Detecta Ctrl+S ou Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); // Previne comportamento padrão do navegador
        
        // Tenta executar quickSave
        if (window.CPQ && window.CPQ.quickSave) {
          const success = window.CPQ.quickSave();
          if (success) {
            CPQ.log('Quick save triggered via keyboard shortcut.');
          } else {
            CPQ.log('Quick save not found on this page.');
          }
        } else {
          console.warn('[CPQ] quickSave method not available');
        }
      }
    });
  }
  
  // Inicializa módulo
  init();
  
})();

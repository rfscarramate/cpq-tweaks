/**
 * CPQ Tweaks - UI Quotes
 * Módulo de interface específico para páginas de cotações
 * Adiciona barra de ações rápidas com funcionalidades contextuais
 */

(function() {
  console.log('[CPQ UI] quotes UI loaded');
  
  /**
   * Inicializa barra de ações rápidas para quotes
   */
  function initQuickActionsBar() {
    try {
      // Previne criação duplicada
      if (document.querySelector('.cpq-bottom-bar')) {
        return;
      }
      
      // Verifica se CPQ.createBottomBar está disponível
      if (!window.CPQ || !window.CPQ.createBottomBar) {
        console.warn('[CPQ UI] createBottomBar not available');
        return;
      }
      
      // Define botões de ação
      const buttons = [
        {
          text: 'Salvar (Rápido)',
          onClick: function() {
            if (window.CPQ && window.CPQ.quickSave) {
              const success = window.CPQ.quickSave();
              if (!success) {
                alert('Botão de salvar não encontrado nesta página');
              }
            } else {
              alert('Função quickSave não disponível');
            }
          }
        },
        {
          text: 'Ações',
          onClick: function() {
            alert('Ações rápidas - personalize conforme necessário');
          }
        }
      ];
      
      // Cria a barra
      CPQ.createBottomBar(buttons);
      
    } catch(e) {
      console.warn('[CPQ UI] Failed to create bottom bar', e);
    }
  }
  
  // Inicializa quando DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQuickActionsBar);
  } else {
    initQuickActionsBar();
  }
  
})();

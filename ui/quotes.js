// ui/quotes.js - UI tweaks for /quotes/
(function(){
  console.log('[CPQ UI] quotes UI loaded');

  // Add bottom bar with quick actions
  try {
    if (!document.querySelector('.cpq-bottom-bar')) {
      CPQ.createBottomBar([
        { text: 'Salvar (Rápido)', onClick: function(){ if (!window.CPQ.quickSave()) alert('Salvar não encontrado'); } },
        { text: 'Ações', onClick: function(){ alert('Ações rápidas - personalize'); } }
      ]);
    }
  } catch(e){
    console.warn('Failed to create bottom bar', e);
  }
})();

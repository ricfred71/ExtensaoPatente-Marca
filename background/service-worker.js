/**
 * Service Worker - Background Script
 * Extensão IA Análise Jurídica
 * 
 * Responsabilidades:
 * - Gerenciar ciclo de vida da extensão
 * - Coordenar comunicação entre componentes
 * - Orquestrar fluxo de análise
 */

console.log('[ServiceWorker] Iniciado - IA Análise Jurídica v1.0.0');

// Listener para clique no ícone da extensão - abre página completa
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('ui/upload/upload.html')
  });
});

// Listeners de instalação e ativação
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[ServiceWorker] Extensão instalada/atualizada:', details.reason);
  
  if (details.reason === 'install') {
    // Primeira instalação
    console.log('[ServiceWorker] Primeira instalação - bem-vindo!');
    
    // Configurar defaults
    chrome.storage.sync.set({
      aiProvider: 'gemini',
      aiUrl: 'https://gemini.google.com/',
      confirmBeforeSend: true
    });
  }
});

// Listener de mensagens
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[ServiceWorker] Mensagem recebida:', message.type);
  
  // Será expandido nos próximos sprints
  switch (message.type) {
    case 'PING':
      sendResponse({ status: 'ok', message: 'Service Worker ativo' });
      break;
      
    default:
      console.warn('[ServiceWorker] Tipo de mensagem desconhecido:', message.type);
      sendResponse({ status: 'error', message: 'Tipo de mensagem não reconhecido' });
  }
  
  return true; // Mantém canal aberto para resposta assíncrona
});

// Manter service worker ativo (Manifest V3)
chrome.runtime.onStartup.addListener(() => {
  console.log('[ServiceWorker] Chrome iniciado - service worker ativo');
});

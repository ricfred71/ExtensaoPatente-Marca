/**
 * ui/upload/upload.js
 * 
 * Controlador da interface de upload
 * Integração E2E: File → PdfReader → Classifier → Storage
 * 
 * @version 1.0.0
 * @created 26/01/2026
 */

import { PdfReader } from '../../core/pdf-reader.js';
import { DocumentClassifier } from '../../core/document-classifier.js';
import { SessionManager } from '../../storage/session-manager.js';

// ============================================
// ELEMENTOS DOM
// ============================================
const pdfInput = document.getElementById('pdfInput');
const processBtn = document.getElementById('processBtn');
const fileName = document.getElementById('fileName');
const fileInfo = document.getElementById('fileInfo');
const status = document.getElementById('status');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

// ============================================
// ESTADO GLOBAL
// ============================================
let selectedFile = null;
let currentSessionId = null;

// ============================================
// VALIDAÇÃO DE ARQUIVO
// ============================================
function validarArquivo(file) {
  const errors = [];
  
  // Validação de tipo
  if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
    errors.push('Apenas arquivos PDF são aceitos');
  }
  
  // Validação de tamanho (máximo 50MB)
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB
  if (file.size > MAX_SIZE) {
    errors.push(`Arquivo muito grande (max 50MB). Tamanho: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }
  
  // Validação de tamanho mínimo (1KB)
  const MIN_SIZE = 1024; // 1KB
  if (file.size < MIN_SIZE) {
    errors.push('Arquivo muito pequeno ou vazio');
  }
  
  return errors;
}

// ============================================
// FUNÇÕES DE UI
// ============================================
function mostrarStatus(mensagem, tipo = 'info') {
  status.textContent = mensagem;
  status.className = `status-message ${tipo} fade-in`;
  
  // Auto-hide para mensagens de sucesso/info após 5s
  if (tipo !== 'error') {
    setTimeout(() => {
      status.textContent = '';
      status.className = 'status-message';
    }, 5000);
  }
}

function mostrarProgresso(mensagem, percentual = null) {
  progress.style.display = 'block';
  progressText.textContent = mensagem;
  
  if (percentual !== null) {
    progressFill.style.width = `${percentual}%`;
  }
}

function esconderProgresso() {
  progress.style.display = 'none';
  progressFill.style.width = '0%';
}

function formatarTamanho(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function limparInterface() {
  selectedFile = null;
  currentSessionId = null;
  fileName.textContent = '';
  fileInfo.textContent = '';
  status.textContent = '';
  status.className = 'status-message';
  processBtn.disabled = true;
  esconderProgresso();
}

// ============================================
// EVENTO: SELEÇÃO DE ARQUIVO
// ============================================
pdfInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  
  if (!file) {
    limparInterface();
    return;
  }
  
  // Validar arquivo
  const erros = validarArquivo(file);
  
  if (erros.length > 0) {
    mostrarStatus('❌ ' + erros[0], 'error');
    limparInterface();
    return;
  }
  
  // Arquivo válido
  selectedFile = file;
  
  // Atualizar UI
  fileName.textContent = `📄 ${file.name}`;
  fileInfo.textContent = `${formatarTamanho(file.size)} · Pronto para processar`;
  
  processBtn.disabled = false;
  mostrarStatus('✅ Arquivo carregado com sucesso', 'success');
  
  console.log('[Upload] Arquivo selecionado:', {
    nome: file.name,
    tamanho: file.size,
    tipo: file.type
  });
});

// ============================================
// EVENTO: PROCESSAR PDF
// ============================================
processBtn.addEventListener('click', async () => {
  if (!selectedFile) {
    mostrarStatus('❌ Nenhum arquivo selecionado', 'error');
    return;
  }
  
  try {
    // Desabilita botão durante processamento
    processBtn.disabled = true;
    
    // ========================================
    // ETAPA 1: Criar sessão
    // ========================================
    mostrarProgresso('⚙️ Iniciando processamento...', 5);
    
    const sessionManager = new SessionManager();
    currentSessionId = await sessionManager.criar();
    
    console.log('[Upload] Sessão criada:', currentSessionId);
    
    await sleep(300); // UX: deixa usuário ver a mensagem
    
    // ========================================
    // ETAPA 2: Extrair texto do PDF
    // ========================================
    mostrarProgresso('📄 Extraindo texto do PDF...', 20);
    
    await sessionManager.atualizar(currentSessionId, {
      status: 'uploading'
    });
    
    const pdfReader = new PdfReader();
    const resultado = await pdfReader.loadFromFile(selectedFile);
    
    console.log('[Upload] Texto extraído:', {
      caracteres: resultado.texto.length,
      paginas: resultado.numeroPaginas,
      paginasProcessadas: resultado.paginasProcessadas,
      texto: resultado.texto.substring(0, 500) + (resultado.texto.length > 500 ? '...' : '')
    });
    
    mostrarProgresso('📄 Texto extraído com sucesso', 40);
    await sleep(300);
    
    // ========================================
    // ETAPA 3: Classificar documento
    // ========================================
    mostrarProgresso('🔍 Classificando documento...', 60);
    
    await sessionManager.atualizar(currentSessionId, {
      status: 'classifying'
    });
    
    const classifier = new DocumentClassifier();
    const classificacao = classifier.classificar(resultado.texto);
    
    console.log('[Upload] Classificação:', classificacao);
    
    mostrarProgresso('🔍 Documento classificado', 80);
    await sleep(300);
    
    // ========================================
    // ETAPA 4: Salvar na sessão
    // ========================================
    mostrarProgresso('💾 Salvando dados...', 90);
    
    await sessionManager.atualizar(currentSessionId, {
      documento: {
        nomeArquivo: resultado.nomeArquivo,
        tamanhoBytes: resultado.tamanhoBytes,
        numeroPaginas: resultado.numeroPaginas,
        paginasProcessadas: resultado.paginasProcessadas,
        textoPeticao: resultado.texto,
        classificacao: classificacao,
        metadata: resultado.metadata,
        
        // Campos do IPAS (podem ser null por enquanto)
        numeroPeticao: '',
        numeroProcesso: '',
        cpfCnpj: '',
        nomeRequerente: '',
        tipoPeticao: classificacao.tipoOriginal,
        dadosProcessados: {}
      },
      status: 'classified'
    });
    
    console.log('[Upload] Dados salvos na sessão');
    
    // ========================================
    // ETAPA 5: Concluído
    // ========================================
    mostrarProgresso('✅ Processamento concluído!', 100);
    await sleep(800);
    
    esconderProgresso();
    
    // Mensagem de sucesso detalhada
    const tipoFormatado = formatarTipoDocumento(classificacao.tipoId);
    const confiancaPct = (classificacao.confianca * 100).toFixed(0);
    
    mostrarStatus(
      `✅ Documento processado!\n` +
      `Tipo: ${tipoFormatado} (${confiancaPct}% confiança)\n` +
      `Páginas: ${resultado.paginasProcessadas}/${resultado.numeroPaginas}`,
      'success'
    );
    
    // DEBUG: Mostra informações no console
    console.log('[Upload] ========================================');
    console.log('[Upload] PROCESSAMENTO CONCLUÍDO');
    console.log('[Upload] ========================================');
    console.log('[Upload] Session ID:', currentSessionId);
    console.log('[Upload] Tipo:', classificacao.tipoId);
    console.log('[Upload] Categoria:', classificacao.categoriaId);
    console.log('[Upload] Confiança:', confiancaPct + '%');
    console.log('[Upload] Caracteres:', resultado.texto.length);
    console.log('[Upload] ========================================');
    
    // Próxima etapa: LGPD (Sprint 2)
    console.log('[Upload] Próxima etapa: Anonimização LGPD (Sprint 2)');
    
    // Reabilita botão (permitir processar outro arquivo)
    setTimeout(() => {
      processBtn.disabled = false;
      mostrarStatus('Pronto para processar outro documento', 'info');
    }, 3000);
    
  } catch (error) {
    console.error('[Upload] Erro no processamento:', error);
    
    esconderProgresso();
    
    mostrarStatus(
      `❌ Erro: ${error.message || 'Falha ao processar PDF'}`,
      'error'
    );
    
    // Tenta salvar erro na sessão (se foi criada)
    if (currentSessionId) {
      try {
        const sessionManager = new SessionManager();
        await sessionManager.atualizar(currentSessionId, {
          status: 'error',
          erro: {
            mensagem: error.message,
            timestamp: new Date().toISOString()
          }
        });
      } catch (saveError) {
        console.error('[Upload] Erro ao salvar estado de erro:', saveError);
      }
    }
    
    // Reabilita botão após erro
    setTimeout(() => {
      processBtn.disabled = false;
    }, 2000);
  }
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatarTipoDocumento(tipoId) {
  const mapa = {
    // Petições
    'pet_recurso_indeferimento': 'Recurso contra Indeferimento',
    'pet_oposicao': 'Oposição',
    'pet_manifestacao': 'Manifestação',
    'pet_contestacao': 'Contestação',
    'pet_nulidade': 'Nulidade',
    'pet_caducidade': 'Caducidade',
    'pet_pedido_registro': 'Pedido de Registro',
    'pet_recurso_exigencia': 'Recurso contra Exigência',
    'pet_cumprimento_exigencia': 'Cumprimento de Exigência',
    'pet_juntada_documento': 'Juntada de Documento',
    'pet_generico': 'Petição Genérica',
    
    // Documentos oficiais
    'doc_oficial_despacho_decisorio': 'Despacho Decisório',
    'doc_oficial_notificacao_exigencia': 'Notificação de Exigência',
    'doc_oficial_notificacao_oposicao': 'Notificação de Oposição',
    'doc_oficial_intimacao': 'Intimação',
    'doc_oficial_parecer_tecnico': 'Parecer Técnico',
    'doc_oficial_generico': 'Documento Oficial Genérico',
    
    // Fallback
    'desconhecido': 'Tipo Desconhecido'
  };
  
  return mapa[tipoId] || tipoId;
}

// ============================================
// INICIALIZAÇÃO
// ============================================
console.log('[Upload] Interface carregada - IA Análise Jurídica v1.0.0');
console.log('[Upload] Aguardando upload de PDF...');

// Teste de integração ao carregar
(async () => {
  try {
    // Testa se service worker está ativo
    const response = await chrome.runtime.sendMessage({ type: 'PING' });
    console.log('[Upload] Service Worker status:', response);
  } catch (error) {
    console.warn('[Upload] Service Worker não respondeu:', error.message);
  }
})();

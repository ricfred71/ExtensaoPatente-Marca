/**
 * sectors/patentes/extractor.js
 * 
 * Extrator específico do setor de Patentes.
 * Integrado com o sistema de tipos específicos:
 * - Para tipos com extractor customizado, delega para o tipo
 * - Para tipos genéricos, usa a lógica genérica deste arquivo
 */

import { getExtractorForTipoSync } from './types/index.js';
import { sanitizeFilename } from './types/base_extractor_utils.js';

class DataExtractor {
  
  /**
   * Extrai dados de uma PETIÇÃO e monta o objeto para storage
   * @param {string} textoCompleto - Texto completo do PDF
   * @param {Object} classificacao - Objeto de classificação {categoriaId, tipoId, confianca}
   * @param {string} urlPdf - URL do PDF
   * @returns {Object} - Objeto estruturado para salvar no storage
   */
  extrairDadosPeticao(textoCompleto, classificacao, urlPdf = '') {
    console.log('[DataExtractor - PATENTES] Extraindo dados de PETIÇÃO...');
    
    // ========================================
    // VERIFICAR SE EXISTE EXTRACTOR ESPECÍFICO PARA ESTE TIPO
    // ========================================
    const extractorEspecifico = getExtractorForTipoSync(classificacao.tipoId, this);
    
    if (extractorEspecifico) {
      console.log(`[DataExtractor - PATENTES] ✅ Usando extractor específico para tipo: ${classificacao.tipoId}`);
      return extractorEspecifico.extract(textoCompleto, classificacao, urlPdf);
    }
    
    console.log(`[DataExtractor - PATENTES] ℹ️ Tipo sem extractor específico: ${classificacao.tipoId}. Usando fallback genérico.`);
    
    // ========================================
    // FALLBACK: EXTRAÇÃO GENÉRICA
    // ========================================
    // Extrai primeira página (primeiros ~2000 caracteres geralmente contém todos os dados principais)
    const textoPaginaUm = textoCompleto.substring(0, 2000);
    
    let numeroProcesso = null;
    // Padrão específico para patentes: BR + números
    const matchBR = textoPaginaUm.match(/\b(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)\b/i);
    if (matchBR) {
      numeroProcesso = matchBR[1].replace(/\s+/g, '');
    } else {
      // Fallback para formato legado (9 dígitos)
      const matchNumeroProcesso = textoPaginaUm.match(/N[úu]mero\s+do\s+(?:Processo|Pedido)\s*:\s*(\d{9})\b/);
      if (matchNumeroProcesso) {
        numeroProcesso = matchNumeroProcesso[1];
      } else {
        const matchPrimeiro = textoPaginaUm.match(/\b(\d{9})\b/);
        numeroProcesso = matchPrimeiro ? matchPrimeiro[1] : null;
      }
    }
    
    // Monta objeto final para storage (mínimo de metadados)
    const storageKey = `peticao_${numeroProcesso || 'sem_processo'}_${sanitizeFilename(classificacao.tipoId || 'peticao_patente')}`;
    
    const objetoPeticao = {
      // Metadados essenciais
      categoria: 'peticao',
      setor: 'patentes',
      tipo: classificacao.tipoId || '',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Texto completo e metadados mínimos
      textoPeticao: textoCompleto,
      processoRelacionado: numeroProcesso,
      urlPdf: urlPdf || '',
      dataProcessamento: new Date().toISOString()
    };
    
    console.log('[DataExtractor - PATENTES] ✅ Dados da petição extraídos:', {
      storageKey,
      numeroProcesso,
      tipo: classificacao.tipoId
    });
    
    return {
      storageKey,
      dados: objetoPeticao
    };
  }
  
  /**
   * Extrai dados de um DOCUMENTO OFICIAL e monta o objeto para storage
   * @param {string} textoCompleto - Texto completo do PDF
   * @param {Object} classificacao - Objeto de classificação {categoriaId, tipoId, confianca}
   * @param {string} urlPdf - URL do PDF
   * @returns {Object} - Objeto estruturado para salvar no storage
   */
  extrairDadosDocumentoOficial(textoCompleto, classificacao, urlPdf = '') {
    console.log('[DataExtractor - PATENTES] Extraindo dados de DOCUMENTO OFICIAL...');

    // ========================================
    // VERIFICAR SE EXISTE EXTRACTOR ESPECÍFICO PARA ESTE TIPO
    // ========================================
    const extractorEspecifico = getExtractorForTipoSync(classificacao.tipoId, this);

    if (extractorEspecifico) {
      console.log(`[DataExtractor - PATENTES] ✅ Usando extractor específico para tipo: ${classificacao.tipoId}`);
      return extractorEspecifico.extract(textoCompleto, classificacao, urlPdf);
    }

    console.log(`[DataExtractor - PATENTES] ℹ️ Tipo sem extractor específico: ${classificacao.tipoId}. Usando fallback genérico.`);
    
    let numeroProcesso = null;
    // Padrão específico para patentes: BR + números
    const matchBR = textoCompleto.match(/(?:Pedido|Processo)\s+(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)/i);
    if (matchBR) {
      numeroProcesso = matchBR[1].replace(/\s+/g, '');
    } else {
      // Fallback para formato legado
      const matchProcesso = textoCompleto.match(/Processo\s+(\d{9})/i);
      if (matchProcesso) {
        numeroProcesso = matchProcesso[1];
      } else {
        const matchPrimeiro = textoCompleto.match(/\b(\d{9})\b/);
        numeroProcesso = matchPrimeiro ? matchPrimeiro[1] : null;
      }
    }
    
    // Monta objeto final para storage (mínimo de metadados)
    const tipoSimplificado = sanitizeFilename(classificacao.tipoId || 'documento_patente');
    const storageKey = `doc_oficial_${numeroProcesso || 'sem_processo'}_${tipoSimplificado}`;
    
    const objetoDocOficial = {
      // Metadados essenciais
      categoria: 'documento_oficial',
      setor: 'patentes',
      tipo: classificacao.tipoId || '',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Dados mínimos
      numeroProcesso: numeroProcesso,
      textoCompleto: textoCompleto,
      urlPdf: urlPdf || '',
      dataProcessamento: new Date().toISOString()
    };
    
    console.log('[DataExtractor - PATENTES] ✅ Dados do documento oficial extraídos:', {
      storageKey,
      numeroProcesso,
      tipo: classificacao.tipoId
    });
    
    return {
      storageKey,
      dados: objetoDocOficial
    };
  }
}

export default new DataExtractor();

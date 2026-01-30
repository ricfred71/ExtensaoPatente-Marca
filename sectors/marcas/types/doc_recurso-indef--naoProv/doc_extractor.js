/**
 * sectors/marcas/types/doc_recurso-indef--naoProv/doc_extractor.js
 * 
 * Extrator para Documento Oficial: Recurso contra Indeferimento - Não Provido
 */

import { validarDocRecursoIndefNaoProv } from './doc_schema.js';

export class DocRecursoIndefNaoProvExtractor {
  
  constructor(dataExtractor) {
    this.dataExtractor = dataExtractor;
  }
  
  /**
   * Extrai dados do documento oficial
   * @param {string} textoCompleto - Texto completo do PDF
   * @param {Object} classificacao - Objeto de classificação
   * @param {string} urlPdf - URL do PDF
   * @returns {Object} { storageKey, dados, validacao }
   */
  extract(textoCompleto, classificacao, urlPdf = '') {
    console.log('[DocRecursoIndefNaoProvExtractor] Extraindo dados do documento...');
    
    // Extrai dados básicos
    const numeroProcesso = this._extrairNumeroProcesso(textoCompleto);
    const dataDespacho = this._extrairDataDespacho(textoCompleto);
    
    // Monta objeto de dados
    const dados = {
      // Metadados
      categoria: 'documento_oficial',
      tipo: classificacao.tipoId || 'recursoIndeferimentoNaoProvido',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Identificação
      numeroProcesso: numeroProcesso,
      dataDespacho: dataDespacho,
      numeroRPI: this._extrairNumeroRPI(textoCompleto),
      
      // Dados do despacho
      tipoDespacho: 'Recurso não provido',
      codigoDespacho: this._extrairCodigoDespacho(textoCompleto),
      textoDespacho: this._extrairTextoDespacho(textoCompleto),
      
      // Fundamentação legal
      fundamentosLegais: this._extrairFundamentosLegais(textoCompleto),
      artigosInvocados: this._extrairArtigosInvocados(textoCompleto),
      
      // Decisão
      decisao: 'indeferido_mantido',
      motivoIndeferimento: this._extrairMotivoIndeferimento(textoCompleto),
      
      // Anterioridades
      anterioridades: this._extrairAnterioridades(textoCompleto),
      processosConflitantes: this._extrairProcessosConflitantes(textoCompleto),
      
      // Metadados gerais
      textoCompleto: textoCompleto,
      urlPdf: urlPdf,
      dataProcessamento: new Date().toISOString(),
      processor: this.constructor.name
    };
    
    // Validação
    const validacao = validarDocRecursoIndefNaoProv(dados);
    
    // Storage key
    const storageKey = `doc_oficial_${numeroProcesso}_recurso_nao_provido`;
    
    console.log('[DocRecursoIndefNaoProvExtractor] Extração concluída:', {
      storageKey,
      valido: validacao.valido,
      campos: validacao.campos_preenchidos
    });
    
    return {
      storageKey,
      dados,
      validacao
    };
  }
  
  // ========================================
  // MÉTODOS DE EXTRAÇÃO
  // ========================================
  
  _extrairNumeroProcesso(texto) {
    const match = texto.match(/Processo\s+(\d{9})/i);
    if (match) return match[1];
    
    const matchPrimeiro = texto.match(/\b(\d{9})\b/);
    return matchPrimeiro ? matchPrimeiro[1] : null;
  }
  
  _extrairDataDespacho(texto) {
    const matchDataDecisao = texto.match(/Data\s+da\s+decis[ãa]o\s+(\d{2}\/\d{2}\/\d{4})/i);
    if (matchDataDecisao) return matchDataDecisao[1];
    
    const matchPrimeiraData = texto.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
    return matchPrimeiraData ? matchPrimeiraData[1] : null;
  }
  
  _extrairNumeroRPI(texto) {
    const match = texto.match(/RPI\s*[Nn][ºo°]\s*(\d+)/i);
    return match ? match[1] : null;
  }
  
  _extrairCodigoDespacho(texto) {
    const match = texto.match(/C[óo]digo\s+(?:do\s+)?[Dd]espacho\s*:\s*(\d+)/i);
    return match ? match[1] : null;
  }
  
  _extrairTextoDespacho(texto) {
    // Texto entre "Recurso não provido" e próxima seção
    const match = texto.match(/Recurso\s+n[ãa]o\s+provido[.\s]+([\s\S]+?)(?=(?:Efetuadas\s+buscas|Matr[íi]cula\s+SIAPE|Processo\s+\d{9}|$))/i);
    if (match) return match[1].trim();
    
    // Fallback: primeiros 500 caracteres após "não provido"
    const matchSimples = texto.match(/n[ãa]o\s+provido[.\s]+([\s\S]{1,500})/i);
    return matchSimples ? matchSimples[1].trim() : null;
  }
  
  _extrairFundamentosLegais(texto) {
    const fundamentos = [];
    const regex = /Art\.\s*\d+(?:\s+inc\.\s+[IVX]+)?(?:\s+da\s+Lei\s+[\d\/]+)?/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const fundamento = match[0];
      if (!fundamentos.includes(fundamento)) {
        fundamentos.push(fundamento);
      }
    }
    
    return fundamentos;
  }
  
  _extrairArtigosInvocados(texto) {
    const artigos = [];
    const regex = /(?:art|artigo)\s*\.?\s*\d+(?:\s*,\s*(?:inc|inciso)\s*\.?\s*[IVX]+)?/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const artigo = match[0];
      if (!artigos.includes(artigo)) {
        artigos.push(artigo);
      }
    }
    
    return artigos;
  }
  
  _extrairMotivoIndeferimento(texto) {
    // Procura por "em razão de" ou "tendo em vista"
    const match = texto.match(/(?:em\s+raz[ãa]o\s+de|tendo\s+em\s+vista)\s+([\s\S]{1,300}?)(?:\.|Processo)/i);
    return match ? match[1].trim() : null;
  }
  
  _extrairAnterioridades(texto) {
    const anterioridades = [];
    const regex = /Processo\s+(\d{9})\s+\([^)]+anterioridade[^)]*\)/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const processo = match[1];
      if (!anterioridades.includes(processo)) {
        anterioridades.push(processo);
      }
    }
    
    return anterioridades;
  }
  
  _extrairProcessosConflitantes(texto) {
    const processos = [];
    const regex = /Processo\s+(\d{9})/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const processo = match[1];
      if (!processos.includes(processo)) {
        processos.push(processo);
      }
    }
    
    // Remove o processo principal (primeiro encontrado)
    if (processos.length > 1) {
      processos.shift();
    }
    
    return processos;
  }
}

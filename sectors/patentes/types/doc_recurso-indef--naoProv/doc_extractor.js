/**
 * sectors/patentes/types/doc_recurso-indef--naoProv/doc_extractor.js
 * 
 * Extrator para Documento Oficial: Recurso contra Indeferimento de Patente - Não Provido
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
    console.log('[DocRecursoIndefNaoProvExtractor - PATENTES] Extraindo dados do documento oficial de patente...');

    const textoDocOficial = textoCompleto;
    
    // Extrai dados básicos
    const numeroProcesso = this._extrairNumeroProcesso(textoDocOficial);
    const dataDespacho = this._extrairDataDespacho(textoDocOficial);
    
    // Monta objeto de dados
    const dados = {
      // Metadados
      categoria: 'documento_oficial',
      setor: 'patentes',
      tipo: classificacao.tipoId || 'recursoIndeferimentoNaoProvidoPatente',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,

      //Dados INPI
      textoAutomaticoEtapa1: this._extrairTextoAutomaticoEtapa1(textoDocOficial) || null,
      textoAutomaticoEtapa2: this._extrairTextoAutomaticoEtapa2(textoDocOficial) || null,
      
      // Identificação
      numeroProcesso: numeroProcesso || null,
      dataDespacho: dataDespacho || null,
      nomePeticao: this._extrairNomePeticao(textoDocOficial) || null,
      numeroProtocolo: this._extrairNumeroProtocolo(textoDocOficial) || null,
      dataApresentacao: this._extrairDataApresentacao(textoDocOficial) || null,
      requerente: this._extrairRequerente(textoDocOficial) || null,
      dataNotificacaoIndeferimento: this._extrairDataNotificacaoIndeferimento(textoDocOficial) || null,
      nomeDecisao: this._extrairNomeDecisao(textoDocOficial) || null,
      dataParecer: this._extrairDataParecer(textoDocOficial) || null,
      numeroParecer: this._extrairNumeroParecer(textoDocOficial) || null,
      textoParecer: this._extrairTextoParecer(textoDocOficial) || null,
      tecnico: this._extrairTecnico(textoDocOficial) || null,
      
      // Dados do despacho
      tipoDespacho: 'Recurso não provido',
      
      // Fundamentação legal
      artigosInvocados: this._extrairArtigosInvocados(textoDocOficial) || [],
      
      // Decisão
      decisao: 'indeferido_mantido',
      motivoIndeferimento: this._extrairMotivoIndeferimento(textoDocOficial) || null,
      
      // Anterioridades (para patentes podem ser referências de estado da técnica)
      anterioridades: this._extrairAnterioridades(textoDocOficial) || [],
      processosConflitantes: this._extrairProcessosConflitantes(textoDocOficial) || [],
      
      // Metadados gerais
      textoCompleto: textoDocOficial,
      urlPdf: urlPdf || '',
      dataProcessamento: new Date().toISOString(),
      processor: this.constructor.name
    };
    
    // Validação
    const validacao = validarDocRecursoIndefNaoProv(dados);
    
    // Storage key
    const storageKey = `doc_oficial_${numeroProcesso}_recurso_nao_provido_patente`;
    
    console.log('[DocRecursoIndefNaoProvExtractor - PATENTES] Extração concluída:', {
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
    // Padrão específico para patentes: BR + números
    const matchBR = texto.match(/(?:Pedido|Processo)\s+(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)/i);
    if (matchBR) return matchBR[1].replace(/\s+/g, '');
    
    // Fallback para formato legado
    const match = texto.match(/Processo\s+(\d{9})/i);
    if (match) return match[1];
    
    const matchPrimeiro = texto.match(/\b(\d{9})\b/);
    return matchPrimeiro ? matchPrimeiro[1] : null;
  }

  _extrairNomePeticao(texto) {
    const match = texto.match(/Processo\s+[\w\d\s]+\s+([\s\S]+?)\s+N[úu]mero\s+de\s+protocolo\s*:/i);
    return match ? match[1].trim() : null;
  }

  _extrairNumeroProtocolo(texto) {
    const match = texto.match(/N[úu]mero\s+de\s+protocolo\s*:\s*(\d{6,})/i);
    return match ? match[1] : null;
  }

  _extrairDataApresentacao(texto) {
    const match = texto.match(/Data\s+de\s+apresenta[cç][aã]o\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  }

  _extrairRequerente(texto) {
    const match = texto.match(/(?:Requerente|Depositante)\s*:\s*([\s\S]+?)\s+Indeferimento\s+do\s+pedido/i);
    return match ? match[1].trim() : null;
  }

  _extrairDataNotificacaoIndeferimento(texto) {
    const match = texto.match(/Notificada\s+(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  }

  _extrairNomeDecisao(texto) {
    const match = texto.match(/Recurso\s+n[ãa]o\s+provido\.?\s*Decis[aã]o\s+mantida/i);
    return match ? match[0].trim() : null;
  }

  _extrairDataParecer(texto) {
    const match = texto.match(/Data\s+do\s+parecer\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  }

  _extrairNumeroParecer(texto) {
    const match = texto.match(/N[úu]mero\s+do\s+parecer\s*:\s*(\d{3,})/i);
    return match ? match[1] : null;
  }

  _extrairTextoAutomaticoEtapa1(texto) {
    const match = texto.match(/(?:Pedido|Processo)\s+de\s+patente[\s\S]+?N[úu]mero\s+do\s+parecer\s*:\s*\d+/i);
    return match ? match[0].trim() : null;
  }

  _extrairTextoAutomaticoEtapa2(texto) {
    const match = texto.match(/MINIST[ÉE]RIO\s+DO\s+DESENVOLVIMENTO,[\s\S]+?(?=Decis[aã]o\s+tomada\s+pelo\s+Presidente)/i);
    return match ? match[0].trim() : null;
  }

  _extrairTextoParecer(texto) {
    const match = texto.match(/N[úu]mero\s+do\s+parecer\s*:\s*\d+\s*([\s\S]+?)(?=\n[A-ZÁÉÍÓÚÂÊÔÃÕÇ ]{3,}\s*\n\s*Delegação\s+de\s+compet[eê]ncia|\nMINIST[ÉE]RIO|\nPRESID[ÊE]NCIA|$)/i);
    if (!match) return null;

    const textoParecer = match[1].trim();
    const inicioMarcador = '<<<INICIO_TEXTO_PARECER>>>';
    const fimMarcador = '<<<FIM_TEXTO_PARECER>>>';

    return `${inicioMarcador}\n${textoParecer}\n${fimMarcador}`;
  }

  _extrairTecnico(texto) {
    // Primeira regra: Captura nome em maiúsculas antes de "Delegação de competência"
    let match = texto.match(/(?:\.\s+|\n\s*)([A-ZÁÉÍÓÚÂÊÔÃÕÇ]+(?: [A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)*)\s+Delegação\s+de\s+compet[eê]ncia/i);
    if (match) return match[1].trim();
    
    // Segunda regra (fallback): Captura após "à consideração superior." até "Delegação de competência"
    match = texto.match(/à\s+considera[çc][ãa]o\s+superior\.?\s+([\s\S]+?)\s+Delegação\s+de\s+compet[eê]ncia/i);
    if (match) {
      const textoBruto = match[1].trim();
      // Extrai apenas a primeira palavra/nome em maiúsculas
      const nomeMaiuscula = textoBruto.match(/^([A-ZÁÉÍÓÚÂÊÔÃÕÇ]+(?: [A-ZÁÉÍÓÚÂÊÔÃÕÇ]+)*)/);
      return nomeMaiuscula ? nomeMaiuscula[1].trim() : textoBruto;
    }
    
    return null;
  }
  
  _extrairDataDespacho(texto) {
    const matchDataDecisao = texto.match(/Data\s+da\s+decis[ãa]o\s+(\d{2}\/\d{2}\/\d{4})/i);
    if (matchDataDecisao) return matchDataDecisao[1];
    
    const matchPrimeiraData = texto.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
    return matchPrimeiraData ? matchPrimeiraData[1] : null;
  }
  
  _extrairTextoDespacho(texto) {
    // Texto entre "Recurso não provido" e próxima seção
    const match = texto.match(/Recurso\s+n[ãa]o\s+provido[.\s]+([\s\S]+?)(?=(?:Efetuadas\s+buscas|Matr[íi]cula\s+SIAPE|Processo\s+[\w\d]+|$))/i);
    if (match) return match[1].trim();
    
    // Fallback: primeiros 500 caracteres após "não provido"
    const matchSimples = texto.match(/n[ãa]o\s+provido[.\s]+([\s\S]{1,500})/i);
    return matchSimples ? matchSimples[1].trim() : null;
  }
  
  _extrairArtigosInvocados(texto) {
    const artigos = [];
    const regex = /(?:art|artigo)\s*\.?\s*(\d+)(?:\s*,?\s*(?:inc|inciso)\s*\.?\s*([IVX]+))?\b/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const numeroArtigo = match[1];
      const inciso = match[2] || '';
      
      // Ignora art. 212 e art. 169 (artigos procedimentais)
      if (numeroArtigo === '212' || numeroArtigo === '169') {
        continue;
      }
      
      // Normaliza formato: sempre "Art. XXX" ou "Art. XXX, inc. X"
      const artigoNormalizado = inciso 
        ? `Art. ${numeroArtigo}, inc. ${inciso}`
        : `Art. ${numeroArtigo}`;
      
      if (!artigos.includes(artigoNormalizado)) {
        artigos.push(artigoNormalizado);
      }
    }
    
    return artigos;
  }
  
  _extrairMotivoIndeferimento(texto) {
    // Captura após "FOI INDEFERIDO COM A SEGUINTE MOTIVAÇÃO:" até um dos marcadores de fim
    const match = texto.match(/FOI\s+INDEFERIDO\s+COM\s+A\s+SEGUINTE\s+MOTIVA[ÇC][ÃA]O\s*:([\s\S]+?)(?=alega[çc][õo]es\s+d[oa]\s+(?:requerente|depositante)|Inicialmente|No\s+m[ée]rito|Ap[óo]s\s+ter\s+sido\s+examinado|$)/i);
    if (match) return match[1].trim();
    
    return null;
  }
  
  _extrairAnterioridades(texto) {
    const anterioridades = [];
    
    // Para patentes, pode haver referências de estado da técnica (documentos D1, D2, etc.)
    // Captura documentos citados como anterioridade
    const regexEstadoTecnica = /(?:documento|referência|anterioridade)\s+([D]\d+)/gi;
    let match;
    
    while ((match = regexEstadoTecnica.exec(texto)) !== null) {
      const doc = match[1];
      if (!anterioridades.includes(doc)) {
        anterioridades.push(doc);
      }
    }
    
    // Também captura pedidos BR citados como anterioridade
    const regexBR = /anterioridade.*?(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)/gi;
    while ((match = regexBR.exec(texto)) !== null) {
      const processo = match[1].replace(/\s+/g, '');
      if (!anterioridades.includes(processo)) {
        anterioridades.push(processo);
      }
    }
    
    return anterioridades;
  }
  
  _extrairProcessosConflitantes(texto) {
    const processos = [];
    
    // Captura pedidos BR mencionados
    const regexBR = /(?:Pedido|Processo)\s+(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)/gi;
    let match;
    
    while ((match = regexBR.exec(texto)) !== null) {
      const processo = match[1].replace(/\s+/g, '');
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

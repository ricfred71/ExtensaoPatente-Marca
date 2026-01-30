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
    console.log('[DocRecursoIndefNaoProvExtractor] Extraindo dados do documento pdf.read.js - tudo que tem dentro do pdf...');

    const textoDocOficial = textoCompleto;
    
    // Extrai dados básicos
    const numeroProcesso = this._extrairNumeroProcesso(textoDocOficial);
    const dataDespacho = this._extrairDataDespacho(textoDocOficial);
    
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
      nomePeticao: this._extrairNomePeticao(textoDocOficial),
      numeroProtocolo: this._extrairNumeroProtocolo(textoDocOficial),
      dataApresentacao: this._extrairDataApresentacao(textoDocOficial),
      requerente: this._extrairRequerente(textoDocOficial),
      dataNotificacaoIndeferimento: this._extrairDataNotificacaoIndeferimento(textoDocOficial),
      nomeDecisao: this._extrairNomeDecisao(textoDocOficial),
      dataParecer: this._extrairDataParecer(textoDocOficial),
      numeroParecer: this._extrairNumeroParecer(textoDocOficial),
      textoAutomaticoEtapa1: this._extrairTextoAutomaticoEtapa1(textoDocOficial),
      textoAutomaticoEtapa2: this._extrairTextoAutomaticoEtapa2(textoDocOficial),
      textoParecer: this._extrairTextoParecer(textoDocOficial),
      tecnico: this._extrairTecnico(textoDocOficial),
      
      // Dados do despacho
      tipoDespacho: 'Recurso não provido',
      
      
      // Fundamentação legal
      artigosInvocados: this._extrairArtigosInvocados(textoDocOficial),
      
      // Decisão
      decisao: 'indeferido_mantido',
      motivoIndeferimento: this._extrairMotivoIndeferimento(textoDocOficial),
      
      // Anterioridades
      anterioridades: this._extrairAnterioridades(textoDocOficial),
      processosConflitantes: this._extrairProcessosConflitantes(textoDocOficial),
      
      // Metadados gerais
      textoCompleto: textoDocOficial,
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

  _extrairNomePeticao(texto) {
    const match = texto.match(/Processo\s+\d{9}\s+([\s\S]+?)\s+N[úu]mero\s+de\s+protocolo\s*:/i);
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
    const match = texto.match(/Requerente\s*:\s*([\s\S]+?)\s+Indeferimento\s+do\s+pedido/i);
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
    const match = texto.match(/Processo\s+de\s+registro\s+de\s+marca[\s\S]+?N[úu]mero\s+do\s+parecer\s*:\s*\d+/i);
    return match ? match[0].trim() : null;
  }

  _extrairTextoAutomaticoEtapa2(texto) {
    const match = texto.match(/MINIST[ÉE]RIO\s+DO\s+DESENVOLVIMENTO,[\s\S]+?(?=Decis[aã]o\s+tomada\s+pelo\s+Presidente)/i);
    return match ? match[0].trim() : null;
  }

  //Resultado do PDF na etapa 1: tudo depois da parte automática do INPI (Recurso não provido. Decisão mantida  Data do parecer: 26/01/2026  Número do parecer: 133221) - 
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
    // Exemplo: "(...).  RICARDO FREDERICO NICOL Delegação de competência"
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
  
  // _extrairNumeroRPI(texto) {
  //   const match = texto.match(/RPI\s*[Nn][ºo°]\s*(\d+)/i);
  //   return match ? match[1] : null;
  // }
  
  _extrairTextoDespacho(texto) {
    // Texto entre "Recurso não provido" e próxima seção
    const match = texto.match(/Recurso\s+n[ãa]o\s+provido[.\s]+([\s\S]+?)(?=(?:Efetuadas\s+buscas|Matr[íi]cula\s+SIAPE|Processo\s+\d{9}|$))/i);
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
    const match = texto.match(/FOI\s+INDEFERIDO\s+COM\s+A\s+SEGUINTE\s+MOTIVA[ÇC][ÃA]O\s*:([\s\S]+?)(?=alega[çc][õo]es\s+da\s+requerente|Inicialmente|No\s+m[ée]rito|Ap[óo]s\s+ter\s+sido\s+examinado|$)/i);
    if (match) return match[1].trim();
    
    // Fallback: padrões antigos (comentados para referência)
    // const matchAntigo = texto.match(/(?:em\s+raz[ãa]o\s+de|tendo\s+em\s+vista)\s+([\s\S]{1,300}?)(?:\.|Processo)/i);
    // return matchAntigo ? matchAntigo[1].trim() : null;
    
    return null;
  }
  
  _extrairAnterioridades(texto) {
    const anterioridades = [];
    
    // Extrai trecho entre "MARCA(S) APONTADA(S) COMO IMPEDITIVA(S):" e "Após ter sido examinado"
    const matchSecao = texto.match(/MARCA\(S\)\s+APONTADA\(S\)\s+COMO\s+IMPEDITIVA\(S\)\s*:([\s\S]+?)(?=Ap[óo]s\s+ter\s+sido\s+examinado|$)/i);
    
    if (matchSecao) {
      const secaoAnterioridades = matchSecao[1];
      
      // Captura todas as sequências de 9 dígitos na seção
      const regex = /\b(\d{9})\b/g;
      let match;
      
      while ((match = regex.exec(secaoAnterioridades)) !== null) {
        const processo = match[1];
        if (!anterioridades.includes(processo)) {
          anterioridades.push(processo);
        }
      }
    }
    
    // Padrões antigos (comentados, mantidos para referência)
    // const regex = /Processo\s+(\d{9})\s+\([^)]+anterioridade[^)]*\)/gi;
    // let match;
    // while ((match = regex.exec(texto)) !== null) {
    //   const processo = match[1];
    //   if (!anterioridades.includes(processo)) {
    //     anterioridades.push(processo);
    //   }
    // }
    
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

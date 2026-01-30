/**
 * sectors/marcas/types/recurso-indef/extractor.js
 * 
 * Extractor específico para: Recurso contra Indeferimento de Pedido de Registro de Marca
 * Implementa os métodos de captura específicos do tipo
 */

import { RECURSO_INDEF_SCHEMA, validarRecursoIndef } from './pet_schema.js';
import { sanitizeFilename } from '../base_extractor_utils.js';

export class RecursoIndefExtractor {
  
  /**
   * Extrai dados específicos do Recurso contra Indeferimento
   * Reutiliza dados genéricos (requerente, procurador, etc) do DataExtractor
   * 
   * @param {string} textoCompleto - Texto completo do PDF
   * @param {Object} classificacao - { categoriaId, tipoId, confianca }
   * @param {string} urlPdf - URL do PDF
   * @returns {Object} { storageKey, dados, validacao }
   */
  extract(textoCompleto, classificacao, urlPdf = '') {
    console.log('[RecursoIndefExtractor] Extraindo dados do Recurso contra Indeferimento...');
    
    // Primeira página (dados estruturais geralmente aqui)
    const textoPaginaUm = textoCompleto.substring(0, 2000);
    
    // ========================================
    // DADOS DA PETIÇÃO
    // ========================================
    const peticao = {
      numeroPeticao: this._extrairNumeroPeticao(textoPaginaUm),
      numeroProcesso: this._extrairNumeroProcesso(textoPaginaUm),
      nossoNumero: this._extrairNossoNumero(textoPaginaUm),
      dataPeticao: this._extrairDataPeticao(textoPaginaUm)
    };
    
    const requerente = {
      nome: this._extrairRequerenteNome(textoPaginaUm),
      cpfCnpjNumINPI: this._extrairRequerenteCpfCnpjNumINPI(textoPaginaUm),
      endereco: this._extrairRequerenteEndereco(textoPaginaUm),
      cidade: this._extrairRequerenteCidade(textoPaginaUm),
      estado: this._extrairRequerenteEstado(textoPaginaUm),
      cep: this._extrairRequerenteCep(textoPaginaUm),
      pais: this._extrairRequerentePais(textoPaginaUm),
      naturezaJuridica: this._extrairRequerenteNaturezaJuridica(textoPaginaUm),
      email: this._extrairRequerenteEmail(textoPaginaUm)
    };
    
    const procurador = {
      nome: this._extrairProcuradorNome(textoPaginaUm),
      cpf: this._extrairProcuradorCpf(textoPaginaUm),
      email: this._extrairProcuradorEmail(textoPaginaUm),
      numeroAPI: this._extrairProcuradorNumeroAPI(textoPaginaUm),
      numeroOAB: this._extrairProcuradorNumeroOAB(textoPaginaUm),
      uf: this._extrairProcuradorUF(textoPaginaUm),
      escritorio_nome: this._extrairEscritorioNome(textoPaginaUm),
      escritorio_cnpj: this._extrairEscritorioCNPJ(textoPaginaUm)
    };
    
    // ========================================
    // DADOS ESPECÍFICOS DO TIPO
    // ========================================
    const dadosEspecificos = {
      form_TextoDaPetição: this._extrairTextoDaPetição(textoCompleto),
      form_Anexos: this._extrairAnexos(textoCompleto)
    };
    
    // ========================================
    // MONTA OBJETO FINAL
    // ========================================
    const storageKey = `peticao_${peticao.numeroProcesso}_${sanitizeFilename('recurso_indef')}_${peticao.numeroPeticao}`;
    
    const objetoFinal = {
      // Metadados de classificação
      categoria: 'peticao',
      tipo: classificacao.tipoId || 'recursoIndeferimentoPedidoRegistro',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Dados da petição
      form_numeroPeticao: peticao.numeroPeticao,
      form_numeroProcesso: peticao.numeroProcesso,
      form_nossoNumero: peticao.nossoNumero,
      form_dataPeticao: peticao.dataPeticao,
      
      // Dados do requerente
      form_requerente_nome: requerente.nome,
      form_requerente_cpfCnpjNumINPI: requerente.cpfCnpjNumINPI,
      form_requerente_endereco: requerente.endereco,
      form_requerente_cidade: requerente.cidade,
      form_requerente_estado: requerente.estado,
      form_requerente_cep: requerente.cep,
      form_requerente_pais: requerente.pais,
      form_requerente_naturezaJuridica: requerente.naturezaJuridica,
      form_requerente_email: requerente.email,
      
      // Dados do procurador
      form_procurador_nome: procurador.nome,
      form_procurador_cpf: procurador.cpf,
      form_procurador_email: procurador.email,
      form_procurador_numeroAPI: procurador.numeroAPI,
      form_procurador_numeroOAB: procurador.numeroOAB,
      form_procurador_uf: procurador.uf,
      form_procurador_escritorio_nome: procurador.escritorio_nome,
      form_procurador_escritorio_cnpj: procurador.escritorio_cnpj,
      
      // Texto completo e metadados
      textoPeticao: textoCompleto,
      urlPdf: urlPdf,
      dataProcessamento: new Date().toISOString(),
      
      // Dados específicos do tipo
      ...dadosEspecificos
    };
    
    // ========================================
    // VALIDAÇÃO
    // ========================================
    const validacao = validarRecursoIndef(objetoFinal);
    
    if (!validacao.valido) {
      console.warn('[RecursoIndefExtractor] ⚠️ Validação com erros:', validacao.erros);
    }
    
    console.log('[RecursoIndefExtractor] ✅ Dados extraídos:', {
      storageKey,
      numeroProcesso: peticao.numeroProcesso,
      numeroPeticao: peticao.numeroPeticao,
      requerente: requerente.nome,
      validado: validacao.valido
    });
    
    return {
      storageKey,
      dados: objetoFinal,
      validacao
    };
  }
  
  // ========================================
  // MÉTODOS DE EXTRAÇÃO - PETIÇÃO
  // ========================================
  
  /**
   * Extrai número da petição (12 dígitos)
   */
  _extrairNumeroPeticao(texto) {
    const matchPeticaoDeMarca = texto.match(/\bPeti[cç][ãa]o\s+de\s+Marca\s+(\d{12})\b/i);
    if (matchPeticaoDeMarca) return matchPeticaoDeMarca[1];
    
    const matchDepoisLabel = texto.match(/N[úu]mero\s+da\s+Peti[cç][ãa]o\s*:\s*(\d{12})\b/);
    if (matchDepoisLabel) return matchDepoisLabel[1];
    
    const matchAntes = texto.match(/(\d{12})\s*(?=N[úu]mero\s+da\s+Peti[cç][ãa]o)/);
    if (matchAntes) return matchAntes[1];
    
    const matchPrimeiro = texto.match(/\b(\d{12})\b/);
    return matchPrimeiro ? matchPrimeiro[1] : null;
  }
  
  /**
   * Extrai número do processo (9 dígitos)
   */
  _extrairNumeroProcesso(texto) {
    const matchDepoisLabel = texto.match(/N[úu]mero\s+do\s+Processo\s*:\s*(\d{9})\b/);
    if (matchDepoisLabel) return matchDepoisLabel[1];
    
    const matchAposDataHora = texto.match(/\b\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+(\d{9})\s+N[úu]mero\s+do\s+Processo\b/);
    if (matchAposDataHora) return matchAposDataHora[1];
    
    const matchAntes = texto.match(/(\d{9})\s*(?=N[úu]mero\s+do\s+Processo)/);
    if (matchAntes) return matchAntes[1];
    
    const matchPrimeiro = texto.match(/\b(\d{9})\b/);
    return matchPrimeiro ? matchPrimeiro[1] : null;
  }
  
  /**
   * Extrai nosso número (17 dígitos)
   */
  _extrairNossoNumero(texto) {
    const match = texto.match(/\b((?:\d\.?){17})\b/);
    if (!match) return null;
    return match[1].replace(/\./g, '');
  }
  
  /**
   * Extrai data e hora da petição
   */
  _extrairDataPeticao(texto) {
    const regex = /(\d{2}\/\d{2}\/\d{4})\s*(\d{2}:\d{2})|(\d{2}:\d{2})\s*(\d{2}\/\d{2}\/\d{4})/;
    const match = texto.match(regex);
    if (!match) return null;
    
    if (match[1] && match[2]) return `${match[1]} ${match[2]}`;
    if (match[3] && match[4]) return `${match[4]} ${match[3]}`;
    
    return null;
  }
  
  /**
   * Extrai nome do requerente
   */
  _extrairRequerenteNome(texto) {
    const match = texto.match(/Nome(?:\s*\/\s*Raz[ãa]o\s+Social)?\s*:\s*(.*?)\s*(?=CPF\/CNPJ\/N[úu]mero\s+INPI\s*:)/s);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  /**
   * Extrai CPF/CNPJ/Número INPI do requerente
   */
  _extrairRequerenteCpfCnpjNumINPI(texto) {
    const match = texto.match(
      /CPF\/CNPJ\/N[úu]mero\s+INPI\s*:\s*(.*?)(?=\s*(?:Endere[cç]o|Cidade|Estado|CEP|Pa[ií]s|Natureza\s+Jur[íi]dica|(?:e-?mail|email)|Dados\s+Gerais|Dados\s+do\s+Procurador\/Escrit[óo]rio)\b)/is
    );
    if (!match) return null;
    const value = match[1].trim();
    return value.length > 0 ? value : null;
  }
  
  /**
   * Extrai endereço do requerente
   */
  _extrairRequerenteEndereco(texto) {
    const match = texto.match(/Endereço:\s*(.*?)(?=\s*Cidade:)/s);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai cidade do requerente
   */
  _extrairRequerenteCidade(texto) {
    const match = texto.match(/Cidade:\s*(.*?)(?=\s*Estado:)/s);
    const cidade = match ? match[1].trim() : null;
    return cidade && cidade.length > 0 ? cidade : null;
  }
  
  /**
   * Extrai estado/UF do requerente
   */
  _extrairRequerenteEstado(texto) {
    const match = texto.match(/Estado:\s*(.*?)(?=\s*CEP:)/s);
    const estado = match ? match[1].trim() : null;
    return estado && estado.length > 0 ? estado : null;
  }
  
  /**
   * Extrai CEP do requerente
   */
  _extrairRequerenteCep(texto) {
    const match = texto.match(/CEP:\s*(.*?)(?=\s*Pais:)/s);
    const cep = match ? match[1].trim() : null;
    return cep && cep.length > 0 ? cep : null;
  }
  
  /**
   * Extrai país do requerente
   */
  _extrairRequerentePais(texto) {
    const match = texto.match(/Pa[ií]s\s*:\s*(.*?)(?=\s*Natureza\s+Jur[íi]dica\s*:)/s);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai natureza jurídica do requerente
   */
  _extrairRequerenteNaturezaJuridica(texto) {
    const match = texto.match(/Natureza\s+Jur[íi]dica\s*:\s*(.*?)(?=\s*(?:e-?mail|email)\s*:)/is);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai e-mail do requerente
   */
  _extrairRequerenteEmail(texto) {
    const match = texto.match(/(?:e-?mail|email)\s*:\s*([\w.\-]+@[\w.\-]+)/i);
    return match ? match[1].trim() : null;
  }
  
  // ============================================================
  // MÉTODOS DE EXTRAÇÃO - PROCURADOR
  // ============================================================
  
  /**
   * Extrai CPF do procurador
   */
  _extrairProcuradorCpf(texto) {
    const match = texto.match(/CPF\s*:\s*([\d.\-]{11,})/);
    if (!match) return null;
    const digits = match[1].replace(/\D/g, '');
    return digits.length === 11 ? digits : null;
  }
  
  /**
   * Extrai nome do procurador
   */
  _extrairProcuradorNome(texto) {
    const match = texto.match(/CPF\s*:\s*[\d.\-]{11,}\s*Nome\s*:\s*(.*?)(?=\s*UF\s*:)/s);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  /**
   * Extrai UF do procurador
   */
  _extrairProcuradorUF(texto) {
    const match = texto.match(/UF\s*:\s*(\w{2})/);
    return match ? match[1] : null;
  }
  
  /**
   * Extrai número OAB do procurador
   */
  _extrairProcuradorNumeroOAB(texto) {
    const match = texto.match(/N[ºo°]\s*OAB\s*:\s*(\d[\d\s]{0,15})/);
    if (!match) return null;
    const value = match[1].trim().replace(/\s+/g, '');
    return value.length > 0 ? value : null;
  }
  
  /**
   * Extrai número API do procurador
   */
  _extrairProcuradorNumeroAPI(texto) {
    const match = texto.match(/N[ºo°]\s*API\s*:\s*(.*?)(?=\s*(?:e-?mail|email)\s*:)/is);
    const api = match ? match[1].trim() : null;
    return api && api.length > 0 ? api : null;
  }
  
  /**
   * Extrai e-mail do procurador
   */
  _extrairProcuradorEmail(texto) {
    const match = texto.match(/N[ºo°]\s*API\s*:.*?(?:e-?mail|email)\s*:\s*([\w.\-]+@[\w.\-]+)/is);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai CNPJ do escritório
   */
  _extrairEscritorioCNPJ(texto) {
    const match = texto.match(/Dados do Procurador\/Escritório\s*(\d{14})/);
    return match ? match[1] : null;
  }
  
  /**
   * Extrai nome do escritório
   */
  _extrairEscritorioNome(texto) {
    const match = texto.match(/\d{14}\s*CNPJ\s*:\s*Nome\s*:\s*(.*?)(?=\s*N[ºo°]\s*API\s*:)/s);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  
  
  // ========================================
  // MÉTODOS ESPECÍFICOS DO TIPO: RECURSO INDEFERIMENTO
  // ========================================
  
  /**
   * Extrai o texto da petição
   * Localiza entre "Classes objeto do recurso NCL" (com dígitos) e "Texto da Petição"
   * @private
   */
  _extrairTextoDaPetição(texto) {
    const match = texto.match(/Classes\s+objeto\s+do\s+recurso\s+NCL[\d()\s]+([\s\S]*?)Texto\s+da\s+Peti[çc][ãa]o/i);
    
    if (match && match[1]) {
      let textoExtraido = match[1].trim();
      // Remove "Página X de Y" do início
      textoExtraido = textoExtraido.replace(/^Página\s+\d+\s+de\s+\d+\s*\n?\s*/i, '');
      // Remove "À" ou "A" do início se presente
      textoExtraido = textoExtraido.replace(/^[ÀA]\s+/i, '');
      return textoExtraido.trim();
    }
    
    return null;
  }
  
  /**
   * Extrai os anexos da petição
   * Localiza tabela com colunas "Descrição" e "Nome do Arquivo"
   * Entre "Nome do Arquivo Descrição Anexos" e "Página|Declaro"
   * @private
   */
  _extrairAnexos(texto) {
    const blocoMatch = texto.match(/Nome\s+do\s+Arquivo\s+Descrição\s+Anexos\s*([\s\S]*?)(?:Página|Declaro)/i);
    
    if (!blocoMatch || !blocoMatch[1]) {
      return [];
    }
    
    let dadosBrutos = blocoMatch[1].trim();
    dadosBrutos = dadosBrutos.replace(/\n/g, ' ');
    
    const regexLinha = /(.+?\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg))\s+(.+?)(?=\s+.+?\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg)|$)/gi;
    let match;
    const listaDeAnexos = [];
    
    while ((match = regexLinha.exec(dadosBrutos)) !== null) {
      listaDeAnexos.push({
        nomeArquivo: match[1].trim(),
        descricao: match[3].trim()
      });
    }
    
    return listaDeAnexos;
  }
}

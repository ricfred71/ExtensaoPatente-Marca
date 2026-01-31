/**
 * sectors/patentes/types/pet_recurso-indef/pet_extractor.js
 * 
 * Extractor específico para: Recurso contra Indeferimento de Pedido de Patente
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
    console.log('[RecursoIndefExtractor - PATENTES] Extraindo dados do Recurso contra Indeferimento de Patente...');
    
    // Encontra o ponto de corte: "Declaro, sob as penas da lei,"
    const regexDeclaro = /Declaro,\s+sob\s+as\s+penas\s+da\s+lei,/i;
    const matchDeclaro = textoCompleto.match(regexDeclaro);
    
    // Se encontrar o marcador, usa apenas o texto até lá
    // Caso contrário, usa os primeiros 2000 caracteres como antes
    const textoPaginaUm = matchDeclaro 
      ? textoCompleto.substring(0, matchDeclaro.index)
      : textoCompleto.substring(0, 2000);
    
    // ========================================
    // DADOS DA PETIÇÃO
    // ========================================
    const peticao = {
      numeroPeticao: this._extrairNumeroPeticao(textoPaginaUm),
      numeroProcesso: this._extrairNumeroProcesso(textoPaginaUm),
      nossoNumero: this._extrairNossoNumero(textoPaginaUm),
      dataPeticao: this._extrairDataPeticao(textoPaginaUm),
    form_Anexos: this._extrairAnexos(textoCompleto)
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
      // Patentes não possui campo form_TextoDaPetição
    };
    
    // ========================================
    // MONTA OBJETO FINAL
    // ========================================
    const storageKey = `peticao_${peticao.numeroProcesso}_${sanitizeFilename('recurso_indef_patente')}_${peticao.numeroPeticao}`;
    
    const objetoFinal = {
      // Metadados de classificação
      categoria: 'peticao',
      setor: 'patentes',
      tipo: classificacao.tipoId || 'recursoIndeferimentoPedidoPatente',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Dados da petição
      form_numeroPeticao: peticao.numeroPeticao || null,
      form_numeroProcesso: peticao.numeroProcesso || null,
      form_nossoNumero: peticao.nossoNumero || null,
      form_dataPeticao: peticao.dataPeticao || null,
      
      // Dados do requerente
      form_requerente_nome: requerente.nome || null,
      form_requerente_cpfCnpjNumINPI: requerente.cpfCnpjNumINPI || null,
      form_requerente_endereco: requerente.endereco || null,
      form_requerente_cidade: requerente.cidade || null,
      form_requerente_estado: requerente.estado || null,
      form_requerente_cep: requerente.cep || null,
      form_requerente_pais: requerente.pais || null,
      form_requerente_naturezaJuridica: requerente.naturezaJuridica || null,
      form_requerente_email: requerente.email || null,
      
      // Dados do procurador
      form_procurador_nome: procurador.nome || null,
      form_procurador_cpf: procurador.cpf || null,
      form_procurador_email: procurador.email || null,
      form_procurador_numeroAPI: procurador.numeroAPI || null,
      form_procurador_numeroOAB: procurador.numeroOAB || null,
      form_procurador_uf: procurador.uf || null,
      form_procurador_escritorio_nome: procurador.escritorio_nome || null,
      form_procurador_escritorio_cnpj: procurador.escritorio_cnpj || null,
      
      // Texto completo e metadados
      textoPeticao: textoCompleto,
      urlPdf: urlPdf || '',
      dataProcessamento: new Date().toISOString(),
      
      // Dados específicos do tipo
      form_Anexos: peticao.form_Anexos || []
    };
    
    // ========================================
    // VALIDAÇÃO
    // ========================================
    const validacao = validarRecursoIndef(objetoFinal);
    
    if (!validacao.valido) {
      console.warn('[RecursoIndefExtractor - PATENTES] ⚠️ Validação com erros:', validacao.erros);
    }
    
    console.log('[RecursoIndefExtractor - PATENTES] ✅ Dados extraídos:', {
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
    const matchPeticaoDePatente = texto.match(/\bPeti[cç][ãa]o\s+de\s+Patente\s+(\d{12})\b/i);
    if (matchPeticaoDePatente) return matchPeticaoDePatente[1];
    
    const matchDepoisLabel = texto.match(/N[úu]mero\s+da\s+Peti[cç][ãa]o\s*:\s*(\d{12})\b/);
    if (matchDepoisLabel) return matchDepoisLabel[1];
    
    const matchAntes = texto.match(/(\d{12})\s*(?=N[úu]mero\s+da\s+Peti[cç][ãa]o)/);
    if (matchAntes) return matchAntes[1];
    
    const matchPrimeiro = texto.match(/\b(\d{12})\b/);
    return matchPrimeiro ? matchPrimeiro[1] : null;
  }
  
  /**
   * Extrai número do processo (pedido de patente - pode ser 10 ou 13 caracteres BR...)
   */
  _extrairNumeroProcesso(texto) {
    // Padrão específico para patentes: BR + números
    const matchBR = texto.match(/\b(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)\b/i);
    if (matchBR) return matchBR[1].replace(/\s+/g, '');
    
    const matchDepoisLabel = texto.match(/N[úu]mero\s+do\s+(?:Processo|Pedido)\s*:\s*(BR\s*[\d\s-]+)/i);
    if (matchDepoisLabel) return matchDepoisLabel[1].replace(/\s+/g, '');
    
    // Fallback para formato legado (9 dígitos)
    const matchLegado = texto.match(/N[úu]mero\s+do\s+Processo\s*:\s*(\d{9})\b/);
    if (matchLegado) return matchLegado[1];
    
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
    // Busca data seguida de hora na mesma linha ou em linhas próximas
    const regexMesmaLinha = /(\d{2}\/\d{2}\/\d{4})\s*(\d{2}:\d{2})|(\d{2}:\d{2})\s*(\d{2}\/\d{2}\/\d{4})/;
    const matchMesmaLinha = texto.match(regexMesmaLinha);
    
    if (matchMesmaLinha) {
      if (matchMesmaLinha[1] && matchMesmaLinha[2]) return `${matchMesmaLinha[1]} ${matchMesmaLinha[2]}`;
      if (matchMesmaLinha[3] && matchMesmaLinha[4]) return `${matchMesmaLinha[4]} ${matchMesmaLinha[3]}`;
    }
    
    // Busca data e hora separadas (pode ter quebra de linha entre elas)
    const regexSeparado = /(\d{2}\/\d{2}\/\d{4})[\s\S]{0,50}?(\d{2}:\d{2})/;
    const matchSeparado = texto.match(regexSeparado);
    if (matchSeparado) {
      return `${matchSeparado[1]} ${matchSeparado[2]}`;
    }
    
    // Se não encontrar hora, retorna só a data
    const regexSoData = /(\d{2}\/\d{2}\/\d{4})/;
    const matchSoData = texto.match(regexSoData);
    return matchSoData ? matchSoData[1] : null;
  }
  
  /**
   * Extrai nome do requerente
   */
  _extrairRequerenteNome(texto) {
    const match = texto.match(/Nome\s+ou\s+Raz[ãa]o\s+Social\s*:\s*(.*?)\s*(?=Tipo\s+de\s+Pessoa|CPF\/CNPJ)/s);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  /**
   * Extrai CPF/CNPJ do requerente (depositante)
   */
  _extrairRequerenteCpfCnpjNumINPI(texto) {
    // Para patentes, procura na seção "Dados do Depositante"
    const match = texto.match(/Dados\s+do\s+Depositante[\s\S]*?CPF\/CNPJ\s*:\s*(\d+)/);
    return match ? match[1].trim() : null;
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
    const match = texto.match(/CEP\s*:\s*([\d-]+)/);
    const cep = match ? match[1].trim() : null;
    return cep && cep.length > 0 ? cep : null;
  }
  
  /**
   * Extrai país do requerente
   */
  _extrairRequerentePais(texto) {
    const match = texto.match(/Pa[ií]s\s*:\s*(.*?)(?=\s*(?:Telefone|Fax|Email|Referência))/s);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai qualificação jurídica do requerente (em patentes é 'Qualificação Jurídica')
   */
  _extrairRequerenteNaturezaJuridica(texto) {
    const match = texto.match(/Qualifica[çc][ãa]o\s+Jur[íi]dica\s*:\s*(.*?)(?=\s*(?:Endere[çc]o|CPF))/is);
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
    // Em patentes, procura na seção "Dados do Procurador" -> "Procurador:" -> "CPF/CNPJ:"
    const match = texto.match(/Procurador\s*:[\s\S]*?CPF\/CNPJ\s*:\s*(\d+)/);
    if (!match) return null;
    const digits = match[1].replace(/\D/g, '');
    return digits.length === 11 ? digits : null;
  }
  
  /**
   * Extrai nome do procurador
   */
  _extrairProcuradorNome(texto) {
    // Em patentes, procura na seção "Dados do Procurador" -> "Procurador:" -> "Nome ou Razão Social:"
    const match = texto.match(/Procurador\s*:[\s\S]*?Nome\s+ou\s+Raz[ãa]o\s+Social\s*:\s*(.*?)(?=\s*(?:Numero\s+OAB|CPF))/i);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  /**
   * Extrai UF do procurador
   */
  _extrairProcuradorUF(texto) {
    // Em patentes, procura "Estado:" na seção do Procurador
    const match = texto.match(/Procurador\s*:[\s\S]*?Estado\s*:\s*(\w{2})/);
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
    const match = texto.match(/Numero\s+API\s*:\s*(\d+)/);
    const api = match ? match[1].trim() : null;
    return api && api.length > 0 ? api : null;
  }
  
  /**
   * Extrai e-mail do procurador
   */
  _extrairProcuradorEmail(texto) {
    // Em patentes, procura "Email:" na seção do Procurador
    const match = texto.match(/Procurador\s*:[\s\S]*?Email\s*:\s*([\w.\-]+@[\w.\-]+)/);
    return match ? match[1].trim() : null;
  }
  
  /**
   * Extrai CNPJ do escritório
   */
  _extrairEscritorioCNPJ(texto) {
    // Em patentes, busca o segundo CPF/CNPJ após a seção do Procurador (que é do escritório)
    const procuradorSection = texto.match(/Dados\s+do\s+Procurador[\s\S]*/);
    if (!procuradorSection) return null;
    
    const matches = procuradorSection[0].match(/CPF\/CNPJ\s*:\s*(\d+)/g);
    if (matches && matches.length >= 2) {
      const cnpjMatch = matches[1].match(/\d+/);
      return cnpjMatch ? cnpjMatch[0] : null;
    }
    return null;
  }
  
  /**
   * Extrai nome do escritório
   */
  _extrairEscritorioNome(texto) {
    // Em patentes, após a seção do Procurador, busca "Nome ou Razão Social:" do escritório
    const match = texto.match(/Email\s*:[^\n]*\n[\s\S]*?Nome\s+ou\s+Raz[ãa]o\s+Social\s*:\s*(.*?)(?=\s*CPF\/CNPJ)/i);
    return match ? match[1].trim().replace(/\s+/g, ' ') : null;
  }
  
  
  
  // ========================================
  // MÉTODOS ESPECÍFICOS DO TIPO: RECURSO INDEFERIMENTO - PATENTES
  // ========================================
  
  /**
   * Extrai os anexos da petição
   * Localiza tabela com colunas "Nome" e "Tipo Anexo"
   * Antes de "Documentos anexados"
   * @private
   */
  _extrairAnexos(texto) {
    // Procura a seção entre "Nome Tipo Anexo" e "Documentos anexados"
    const blocoMatch = texto.match(/Nome\s+Tipo\s+Anexo\s*([\s\S]*?)Documentos\s+anexados/i);
    
    if (!blocoMatch || !blocoMatch[1]) {
      return [];
    }
    
    const linhas = blocoMatch[1].trim().split('\n').filter(linha => linha.trim());
    const listaDeAnexos = [];
    
    for (let i = 0; i < linhas.length; i++) {
      let linhaCompleta = linhas[i];
      
      // Se a linha atual não termina com extensão válida, junta com a próxima
      while (i < linhas.length - 1 && !/\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg)$/i.test(linhaCompleta)) {
        i++;
        linhaCompleta += ' ' + linhas[i];
      }
      
      // Separa tipo de anexo e nome do arquivo
      // Formato: "Tipo de anexo Nome_do_arquivo.ext"
      // Nome do arquivo pode conter espaços
      const match = linhaCompleta.match(/^(.+?)\s+(.*?\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg))$/i);
      if (match) {
        listaDeAnexos.push({
          'Tipo Anexo': match[1].trim(),
          'Nome': match[2].trim()
        });
      }
    }
    
    return listaDeAnexos;
  }
}

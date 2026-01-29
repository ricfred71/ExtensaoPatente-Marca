/**
 * sectors/marcas/types/recurso-indeferimento/extractor.js
 * 
 * Extractor específico para: Recurso contra Indeferimento de Pedido de Registro de Marca
 * Reutiliza os métodos de captura genéricos do extractor pai
 */

import { RECURSO_INDEFERIMENTO_SCHEMA, validarRecursoIndeferimento } from './schema.js';

export class RecursoInderimentoExtractor {
  
  constructor(dataExtractor) {
    /**
     * Referência ao DataExtractor pai (que possui os métodos de captura genéricos)
     * @type {DataExtractor}
     */
    this.dataExtractor = dataExtractor;
  }
  
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
    console.log('[RecursoInderimentoExtractor] Extraindo dados do Recurso contra Indeferimento...');
    
    // Primeira página (dados estruturais geralmente aqui)
    const textoPaginaUm = textoCompleto.substring(0, 2000);
    
    // ========================================
    // DADOS COMUNS A TODAS AS PETIÇÕES
    // ========================================
    const peticao = {
      tipoPeticao: null,
      numeroPeticao: this.dataExtractor._extrairNumeroPeticao(textoPaginaUm),
      numeroProcesso: this.dataExtractor._extrairNumeroProcesso(textoPaginaUm),
      nossoNumero: this.dataExtractor._extrairNossoNumero(textoPaginaUm),
      dataPeticao: this.dataExtractor._extrairDataPeticao(textoPaginaUm)
    };
    
    const requerente = {
      nome: this.dataExtractor._extrairRequerenteNome(textoPaginaUm),
      cpfCnpjNumINPI: this.dataExtractor._extrairRequerenteCpfCnpjNumINPI(textoPaginaUm),
      endereco: this.dataExtractor._extrairRequerenteEndereco(textoPaginaUm),
      cidade: this.dataExtractor._extrairRequerenteCidade(textoPaginaUm),
      estado: this.dataExtractor._extrairRequerenteEstado(textoPaginaUm),
      cep: this.dataExtractor._extrairRequerenteCep(textoPaginaUm),
      pais: this.dataExtractor._extrairRequerentePais(textoPaginaUm),
      naturezaJuridica: this.dataExtractor._extrairRequerenteNaturezaJuridica(textoPaginaUm),
      email: this.dataExtractor._extrairRequerenteEmail(textoPaginaUm)
    };
    
    const procurador = {
      nome: this.dataExtractor._extrairProcuradorNome(textoPaginaUm),
      cpf: this.dataExtractor._extrairProcuradorCpf(textoPaginaUm),
      email: this.dataExtractor._extrairProcuradorEmail(textoPaginaUm),
      numeroAPI: this.dataExtractor._extrairProcuradorNumeroAPI(textoPaginaUm),
      numeroOAB: this.dataExtractor._extrairProcuradorNumeroOAB(textoPaginaUm),
      uf: this.dataExtractor._extrairProcuradorUF(textoPaginaUm),
      escritorio_nome: this.dataExtractor._extrairEscritorioNome(textoPaginaUm),
      escritorio_cnpj: this.dataExtractor._extrairEscritorioCNPJ(textoPaginaUm)
    };
    
    // ========================================
    // DADOS ESPECÍFICOS DO TIPO
    // ========================================
    // Aqui podem ser adicionados dados específicos do Recurso contra Indeferimento
    // Por enquanto, mantemos a estrutura comum (será expandida em versão futura)
    
    const dadosEspecificos = {
      form_TextoDaPetição: this._extrairTextoDaPetição(textoCompleto),
      form_Anexos: this._extrairAnexos(textoCompleto)
    };
    
    // ========================================
    // MONTA OBJETO FINAL
    // ========================================
    const storageKey = `peticao_${peticao.numeroProcesso}_${this._sanitizeFilename('recurso_indeferimento')}_${peticao.numeroPeticao}`;
    
    const objetoFinal = {
      // Metadados de classificação
      categoria: 'peticao',
      tipo: classificacao.tipoId || 'recursoIndeferimentoPedidoRegistro',
      subtipo: classificacao.subtipoId || '',
      confianca: classificacao.confianca || 0,
      
      // Dados da petição
      tipoPeticao: peticao.tipoPeticao,
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
      processoRelacionado: peticao.numeroProcesso,
      urlPdf: urlPdf,
      dataProcessamento: new Date().toISOString(),
      
      // Dados específicos do tipo
      ...dadosEspecificos
    };
    
    // ========================================
    // VALIDAÇÃO
    // ========================================
    const validacao = validarRecursoIndeferimento(objetoFinal);
    
    if (!validacao.valido) {
      console.warn('[RecursoInderimentoExtractor] ⚠️ Validação com erros:', validacao.erros);
    }
    
    console.log('[RecursoInderimentoExtractor] ✅ Dados extraídos:', {
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
  
  /**
   * Sanitiza filename removendo caracteres inválidos
   * @private
   */
  _sanitizeFilename(nome) {
    return nome
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
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
    // Padrão: após "Classes objeto do recurso NCL" seguido de dígitos até "Texto da Petição"
    const match = texto.match(/Classes\s+objeto\s+do\s+recurso\s+NCL[^0-9]*(\d+[\s\S]*?)(?:Texto\s+da\s+Peti[çc][ã a]o|$)/i);
    
    if (match && match[1]) {
      // Limpa espaços em branco extras e retorna
      return match[1].trim();
    }
    
    return null;
  }
  
  /**
   * Extrai os anexos da petição
   * Localiza tabela com colunas "Descrição" e "Nome do Arquivo"
   * Entre "Texto da Petição" e "Declaro, sob as penas da lei"
   * @private
   */
  _extrairAnexos(texto) {
    // Padrão: procura pela seção de anexos
    const match = texto.match(/Texto\s+da\s+Peti[çc][ã a]o\s*([\s\S]*?)(?:Declaro,?\s+sob\s+as\s+penas\s+da\s+lei|$)/i);
    
    if (!match || !match[1]) {
      return [];
    }
    
    const secaoAnexos = match[1];
    const anexos = [];
    
    // Procura por padrões de linhas com arquivo e descrição
    // Padrão típico: "ARQUIVO.pdf Descrição da Razão"
    // Ou: "Nome Descrição" em colunas separadas
    
    // Tenta extrair linhas que contêm .pdf ou outros formatos comuns
    const linhasArquivos = secaoAnexos.match(/([^\n]*?\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg))\s+([^\n]*)/gi);
    
    if (linhasArquivos) {
      linhasArquivos.forEach(linha => {
        // Extrai nome do arquivo e descrição
        const partes = linha.trim().split(/\s{2,}|\t/); // Divide por espaços duplos ou tabs
        
        if (partes.length >= 2) {
          anexos.push({
            nomeArquivo: partes[0].trim(),
            descricao: partes.slice(1).join(' ').trim()
          });
        } else if (partes.length === 1) {
          // Se houver apenas um elemento, trata como nome do arquivo
          anexos.push({
            nomeArquivo: partes[0].trim(),
            descricao: ''
          });
        }
      });
    }
    
    return anexos.length > 0 ? anexos : [];
  }
  
  /**
   * Extrai a fundamentação do recurso
   * @private
   */
  _extrairFundamentacao(texto) {
    // Implementar quando necessário
    // const match = texto.match(/fundamenta[çc][ã a]o[:\s]*([\s\S]*?)(?=pedido|conclusão|$)/i);
    // return match ? match[1].trim() : null;
    return null;
  }
  
  /**
   * Extrai classes recorridas
   * @private
   */
  _extrairClassesRecorridas(texto) {
    // Implementar quando necessário
    // const matches = texto.match(/classe[s]?[:\s]*(\d+)/gi);
    // return matches ? matches.map(m => m.replace(/\D/g, '')) : [];
    return [];
  }
  
  /**
   * Extrai valor da causa
   * @private
   */
  _extrairValorCausa(texto) {
    // Implementar quando necessário
    // const match = texto.match(/valor[:\s]*(?:R\$\s*)?([\d.,]+)/i);
    // return match ? match[1] : null;
    return null;
  }
}

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
      form_TextoDaPetição: this._extrairTextoDaPetição(textoCompleto),
    
    };
    
    // ========================================
    // MONTA OBJETO FINAL
    // ========================================
    const storageKey = `peticao_${peticao.numeroProcesso}_${sanitizeFilename('recurso_indef')}_${peticao.numeroPeticao}`;
    
    const objetoFinal = {
      // Metadados de classificação
      categoria: 'peticao',
      setor: 'marcas',
      tipo: classificacao.tipoId || 'recursoIndeferimentoPedidoRegistro',
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
      //representa o campo do furmulario "Texto da Petição" - onde é posto um resumo do recurso
      form_TextoDaPetição: dadosEspecificos.form_TextoDaPetição || null,
      form_Anexos: peticao.form_Anexos || []
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
   * Localiza tabela com colunas "Nome do Arquivo" e "Descrição"
   * Entre "Nome do Arquivo Descrição" e "Declaro, sob as penas da lei,"
   * Formato pode ser: nome.ext + tipo na mesma linha OU nome.ext em uma linha e tipo na próxima
   * @private
   */
  _extrairAnexos(texto) {
    console.log('[_extrairAnexos] Iniciando extração de anexos...');
    
    const blocoMatch = texto.match(/Nome\s+do\s+Arquivo\s+Descrição\s*(?:\n\s*)?Anexos\s*([\s\S]*?)Declaro,\s+sob\s+as\s+penas\s+da\s+lei,/i);
    
    if (!blocoMatch || !blocoMatch[1]) {
      console.log('[_extrairAnexos] ❌ Bloco não encontrado');
      return [];
    }
    
    console.log('[_extrairAnexos] ✅ Bloco encontrado');
    
    let linhas = blocoMatch[1].trim().split('\n').filter(linha => linha.trim());
    
    // Remove linhas que são "Página X" ou "Esta petição..."
    linhas = linhas.filter(linha => {
      const limpa = linha.trim();
      return !/^Página\s+\d+/i.test(limpa) && !/^Esta\s+peti[çc][ãa]o/i.test(limpa);
    });
    
    console.log('[_extrairAnexos] Total de linhas após filtro:', linhas.length);
    
    const listaDeAnexos = [];
    let i = 0;
    
    while (i < linhas.length) {
      let linha = linhas[i].trim();
      console.log(`[_extrairAnexos] Processando linha ${i}:`, linha);
      
      // Se a linha já tem extensão + texto depois (formato: "nome.ext Tipo")
      const matchMesmaLinha = linha.match(/^(.*?\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg))\s+(.+)$/i);
      if (matchMesmaLinha) {
        console.log(`[_extrairAnexos] ✅ Nome e tipo na mesma linha - Nome: "${matchMesmaLinha[1]}", Tipo: "${matchMesmaLinha[3]}"`);
        listaDeAnexos.push({
          'Nome': matchMesmaLinha[1].trim(),
          'Tipo Anexo': matchMesmaLinha[3].trim()
        });
        i++;
        continue;
      }
      
      // Se não, junta linhas até formar nome completo
      let nomeArquivo = linha;
      while (i < linhas.length - 1 && !/\.(pdf|doc|docx|xls|xlsx|txt|jpg|png|jpeg)$/i.test(nomeArquivo)) {
        i++;
        nomeArquivo += ' ' + linhas[i].trim();
        console.log(`[_extrairAnexos] Juntando, linha ${i}. Arquivo agora:`, nomeArquivo);
      }
      
      // Próxima linha é a descrição
      i++;
      if (i < linhas.length) {
        const tipoAnexo = linhas[i].trim();
        console.log(`[_extrairAnexos] ✅ Nome e tipo em linhas separadas - Nome: "${nomeArquivo}", Tipo: "${tipoAnexo}"`);
        
        listaDeAnexos.push({
          'Nome': nomeArquivo,
          'Tipo Anexo': tipoAnexo
        });
        
        i++; // Avança para o próximo par
      } else {
        console.log(`[_extrairAnexos] ⚠️ Nome de arquivo sem tipo: "${nomeArquivo}"`);
        break;
      }
    }
    
    console.log('[_extrairAnexos] Total de anexos extraídos:', listaDeAnexos.length);
    return listaDeAnexos;
  }
}

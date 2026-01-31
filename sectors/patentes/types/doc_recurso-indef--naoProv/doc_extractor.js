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

      // Dados do cabeçalho do documento
      form_numeroProcesso: numeroProcesso || null,
      form_numeroPct: this._extrairNumeroPct(textoDocOficial) || null,
      form_dataDeposito: this._extrairDataDeposito(textoDocOficial) || null,
      form_prioridadeUnionista: this._extrairPrioridadeUnionista(textoDocOficial) || null,
      form_requerente_nome: this._extrairRequerentNome(textoDocOficial) || null,
      form_inventor_nome: this._extrairInventorNome(textoDocOficial) || null,
      form_titulo: this._extrairTitulo(textoDocOficial) || null,
      
      // Dados INPI
      textoAutomaticoEtapa1: this._extrairTextoAutomaticoEtapa1(textoDocOficial) || null,
      textoAutomaticoEtapa2: this._extrairTextoAutomaticoEtapa2(textoDocOficial) || null,
      
      // Identificação
      dataDespacho: dataDespacho || null,
      dataNotificacaoIndeferimento: this._extrairDataNotificacaoIndeferimento(textoDocOficial) || null,
      nomeDecisao: this._extrairNomeDecisao(textoDocOficial) || null,
      textoParecer: this._extrairTextoParecer(textoDocOficial) || null,
      tecnico: this._extrairTecnico(textoDocOficial) || null,
      
      // Dados do despacho
      tipoDespacho: 'Recurso não provido',
      form_decisao: this._extrairDecisao(textoDocOficial) || null,
      
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
  
  /**
   * Extrai número do processo (pedido de patente)
   * Formato: BR1020140042067
   */
  _extrairNumeroProcesso(texto) {
    const match = texto.match(/N\.°\s+do\s+Pedido\s*:\s*(BR\s*\d{2}\s*\d{4}\s*\d{6}[-\s]?\d?)/i);
    if (match) {
      return match[1].replace(/\s+/g, '');
    }
    return null;
  }

 /**
   * Extrai número de depósito PCT
   * Correção: Adicionado lookahead para parar antes de "Data de Depósito"
   */
  _extrairNumeroPct(texto) {
    console.log('[_extrairNumeroPct] Iniciando extração...');
    
    // ALTERAÇÃO NA REGEX:
    // 1. ([^\n]*?) -> Captura tudo que não seja quebra de linha (modo preguiçoso)
    // 2. (?=\s*(?:\n|Data\s+de\s+Depósito|$)) -> Lookahead (regra de parada). 
    //    Para a captura IMEDIATAMENTE antes de encontrar:
    //    - Uma quebra de linha (\n)
    //    - OU o texto "Data de Depósito" (mesmo que esteja na mesma linha)
    //    - OU o fim do texto ($)
    const match = texto.match(/N\.°\s+de\s+Depósito\s+PCT\s*:\s*([^\n]*?)(?=\s*(?:\n|Data\s+de\s+Depósito|$))/i);
    
    console.log('[_extrairNumeroPct] Match encontrado:', !!match);
    
    if (match) {
      // match[1] contém o valor capturado
      let valor = match[1].trim();
      console.log('[_extrairNumeroPct] Valor após trim:', JSON.stringify(valor));
      
      // Verificações de segurança:
      // 1. Se o valor é vazio
      // 2. Se contém apenas traços ou espaços
      // 3. (Segurança extra) Se por acaso ainda contiver "Data de Depósito"
      if (valor.length === 0 || /^[-\s]*$/.test(valor) || valor.toLowerCase().startsWith("data de")) {
        console.log('[_extrairNumeroPct] Retornando null (vazio, traço ou campo inválido)');
        return null;
      }
      
      console.log('[_extrairNumeroPct] Retornando valor:', valor);
      return valor;
    }
    
    console.log('[_extrairNumeroPct] Nenhum match encontrado, retornando null');
    return null;
  }

  /**
   * Extrai data de depósito
   */
  _extrairDataDeposito(texto) {
    const match = texto.match(/Data\s+de\s+Depósito\s*:\s*(\d{2}\/\d{2}\/\d{4})/i);
    return match ? match[1] : null;
  }

  /**
   * Extrai prioridade unionista
   */
  _extrairPrioridadeUnionista(texto) {
    const match = texto.match(/Prioridade\s+Unionista\s*:\s*(.+?)(?:\n|$)/i);
    if (match) {
      const valor = match[1].trim();
      // Retorna null se vazio ou se for apenas "-" ou caracteres não alfanuméricos
      if (valor.length === 0 || /^[-\s]*$/.test(valor)) {
        return null;
      }
      return valor;
    }
    return null;
  }

  /**
   * Extrai nome do requerente (depositante)
   */
  _extrairRequerentNome(texto) {
    const match = texto.match(/Depositante\s*:\s*([\s\S]+?)(?=\n\s*Inventor\s*:|\n\s*[A-Z][a-z]+\s*:)/i);
    if (match) {
      let nome = match[1].trim();
      // Remove sufixo como (BRSP)
      nome = nome.replace(/\s*\([A-Z]+\)\s*$/g, '').trim();
      return nome.length > 0 ? nome : null;
    }
    return null;
  }

  /**
   * Extrai nome do inventor
   */
  _extrairInventorNome(texto) {
    const match = texto.match(/Inventor\s*:\s*([\s\S]+?)(?=\n\s*Título\s*:)/i);
    if (match) {
      let inventor = match[1].trim();
      // Limpa quebras de linha extras dentro do nome
      inventor = inventor.replace(/\n\s*/g, ' ').replace(/\s+/g, ' ');
      return inventor.length > 0 ? inventor : null;
    }
    return null;
  }

  /**
   * Extrai título da patente
   */
_extrairTitulo(texto) {
    console.log('[_extrairTitulo] Iniciando extração...');
    
    // ALTERAÇÃO PRINCIPAL:
    // 1. [“"] -> Aceita aspas curvas (“) OU aspas retas (") na abertura
    // 2. [\s\S]+? -> Captura qualquer caractere, incluindo quebras de linha (modo não guloso)
    // 3. [”"] -> Para na aspa curva (”) OU aspa reta (") de fechamento
    let match = texto.match(/Título\s*:\s*[“"]([\s\S]+?)[”"]/i);
    
    console.log('[_extrairTitulo] Match com aspas encontrado:', !!match);

    // Fallback: Se não achar com aspas, tenta pegar até a próxima seção (ex: SUBSÍDIOS ou letras maiúsculas no início da linha)
    if (!match) {
      console.log('[_extrairTitulo] Tentando padrão alternativo (sem aspas delimitadoras)...');
      // Procura até encontrar uma quebra de linha seguida de palavra em MAIÚSCULO (início da próx seção)
      match = texto.match(/Título\s*:\s*([^“"]+?)(?=\n[A-ZÁ-Ú]{3,})/i);
    }

    if (match) {
      // match[1] contém apenas o texto DENTRO das aspas
      let titulo = match[1].trim();
      
      // Remove quebras de linha (\n) que quebram o título ao meio e espaços duplos
      titulo = titulo.replace(/\n\s*/g, ' ').replace(/\s+/g, ' ');
      
      // Se você realmente precisa que o resultado final tenha as aspas (como no seu exemplo),
      // descomente a linha abaixo. Caso contrário, o padrão é retornar o texto limpo.
      // titulo = `“${titulo}”`; 

      console.log('[_extrairTitulo] Valor final:', JSON.stringify(titulo));
      return titulo.length > 0 ? titulo : null;
    }
    
    console.log('[_extrairTitulo] Nenhum match encontrado, retornando null');
    return null;
}

  /**
   * Extrai decisão final
   */
  _extrairDecisao(texto) {
    const match = texto.match(/Recurso\s+conhecido\s+e\s+negado\s+provimento\.?\s*Mantido\s+o\s+indeferimento\s+do\s+pedido\s*\[código\s+\d+\]/i);
    if (match) {
      return match[0].trim();
    }
    return null;
  }

  _extrairNomePeticao(texto) {
    return this._extrairTitulo(texto);
  }

  _extrairNumeroProtocolo(texto) {
    // Não existe neste tipo de documento
    return null;
  }

  _extrairDataApresentacao(texto) {
    return this._extrairDataDeposito(texto);
  }

  _extrairRequerente(texto) {
    return this._extrairRequerentNome(texto);
  }

  _extrairDataNotificacaoIndeferimento(texto) {
    // Pode ser extraída de "RPI XXXX de DD/MM/YYYY"
    const match = texto.match(/RPI\s+\d+\s+de\s+(\d{2}\/\d{2}\/\d{4})/);
    return match ? match[1] : null;
  }

  _extrairNomeDecisao(texto) {
    return this._extrairDecisao(texto);
  }

  _extrairDataParecer(texto) {
    // Data da decisão final
    const match = texto.match(/Rio\s+de\s+Janeiro,\s+(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})/i);
    if (match) {
      const dia = match[1].padStart(2, '0');
      const meses = {
        'janeiro': '01', 'fevereiro': '02', 'março': '03', 'abril': '04',
        'maio': '05', 'junho': '06', 'julho': '07', 'agosto': '08',
        'setembro': '09', 'outubro': '10', 'novembro': '11', 'dezembro': '12'
      };
      const mes = meses[match[2].toLowerCase()] || '01';
      const ano = match[3];
      return `${dia}/${mes}/${ano}`;
    }
    return null;
  }

  _extrairNumeroParecer(texto) {
    // Não existe neste tipo de documento
    return null;
  }

  _extrairTextoAutomaticoEtapa1(texto) {
    // Extrai seção de subsídios técnicos (do início até antes dos subsídios)
    const match = texto.match(/^([\s\S]+?)SUBSÍDIOS\s+TÉCNICOS/i);
    if (match) {
      let textoEtapa1 = match[1].trim();
      // Remove padrão "\nCódigo:..." até o número do processo
      textoEtapa1 = textoEtapa1.replace(/\nCódigo:[^\n]+\n[^\n]+/g, '');
      return textoEtapa1.trim();
    }
    return null;
  }

_extrairTextoAutomaticoEtapa2(texto) {
    console.log('[_extrairTextoAutomaticoEtapa2] Iniciando extração...');

    // REGEX EXPLICADA:
    // 1. (SERVIÇO\s+PÚBLICO\s+FEDERAL) -> Início do bloco [cite: 1, 11]
    // 2. [\s\S]+? -> Pega tudo no meio (não-guloso)
    // 3. Título\s*:\s*[“"] -> Encontra "Título:", espaços e abre aspas (retas ou curvas) [cite: 2, 12]
    // 4. [\s\S]+? -> Pega o conteúdo do título (incluindo quebras de linha)
    // 5. [”"] -> Para na aspa de fechamento (reta ou curva)
    // 6. Flags 'gi': Global (pega todos) e Case-insensitive
    const regex = /SERVIÇO\s+PÚBLICO\s+FEDERAL[\s\S]+?Título\s*:\s*[“"][\s\S]+?[”"]/gi;

    const matches = texto.match(regex);
    console.log('[_extrairTextoAutomaticoEtapa2] Matches encontrados:', matches ? matches.length : 0);

    if (matches && matches.length > 0) {
        // Pega o ÚLTIMO elemento do array (que corresponde ao bloco final desejado)
        const ultimoBloco = matches[matches.length - 1]; 
        
        console.log('[_extrairTextoAutomaticoEtapa2] Tamanho do match final:', ultimoBloco.length);
        // Exibe um trecho para conferência
        console.log('[_extrairTextoAutomaticoEtapa2] Início do bloco capturado:', JSON.stringify(ultimoBloco.substring(0, 100)));
        
        return ultimoBloco;
    }

    console.log('[_extrairTextoAutomaticoEtapa2] Nenhum match encontrado');
    return null;
}

  _extrairTextoParecer(texto) {
    // Extrai subsídios técnicos como parecer
    const match = texto.match(/Sr\.\s+Presidente,([\s\S]+?)(?=Recurso\s+conhecido|Código:|$)/i);
    if (match) {
      const parecer = match[1].trim();
      const inicioMarcador = '<<<INICIO_TEXTO_PARECER>>>';
      const fimMarcador = '<<<FIM_TEXTO_PARECER>>>';
      return `${inicioMarcador}\n${parecer}\n${fimMarcador}`;
    }
    return null;
  }

  _extrairTecnico(texto) {
    // Extrai nome do técnico/coordenador responsável
    const match = texto.match(/Coordenador\s+(?:Técnico|Substituta)\/Mat\.\s+[^\n]+\n(.+?)Portaria/i);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  
  _extrairDataDespacho(texto) {
    return this._extrairDataParecer(texto);
  }
  
  _extrairTextoDespacho(texto) {
    return this._extrairDecisao(texto);
  }
  
  _extrairArtigosInvocados(texto) {
    const artigos = [];
    const regex = /(?:artigos?|art\.?)\s+(\d+)(?:\s*[°oc]\.?\/c\.c\.?\s*(\d+))?/gi;
    let match;
    
    while ((match = regex.exec(texto)) !== null) {
      const numeroArtigo = match[1];
      const numeroArtigo2 = match[2];
      
      artigos.push(`Art. ${numeroArtigo}`);
      if (numeroArtigo2) {
        artigos.push(`Art. ${numeroArtigo2}`);
      }
    }
    
    return [...new Set(artigos)]; // Remove duplicatas
  }
  
  _extrairMotivoIndeferimento(texto) {
    // Extrai motivação do indeferimento
    const match = texto.match(/foi\s+indeferido\s+com\s+base\s+nos\s+([\s\S]+?)(?=\.\s*Tal\s+decisão|$)/i);
    if (match) {
      return match[1].trim();
    }
    return null;
  }
  
  _extrairAnterioridades(texto) {
    // Não aplicável para este tipo de documento
    return [];
  }
  
  _extrairProcessosConflitantes(texto) {
    // Não aplicável para este tipo de documento
    return [];
  }
}

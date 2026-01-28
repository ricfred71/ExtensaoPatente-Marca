/**
 * core/document-classifier.js
 * 
 * Classificador de documentos jurídicos
 * Migrado e refatorado de: content/ipas/peticao_processor.js
 * 
 * MUDANÇAS:
 * - Função → Classe
 * - Suporte a petições E documentos oficiais
 * - Score de confiança adicionado
 * - Mantém switch completo do IPAS (10 tipos testados)
 * - Remove dependências externas
 * 
 * @version 1.0.0
 * @migrated 26/01/2026
 */

/**
 * Classe DocumentClassifier
 * Identifica tipo e categoria de documentos jurídicos
 */
export class DocumentClassifier {
  /**
   * Classifica um documento baseado no texto
   * 
   * @param {string} texto - Texto completo do documento
   * @returns {Object} { categoriaId, tipoId, subtipoId, confianca, tipoOriginal }
   */
  classificar(texto) {
    // VALIDAÇÃO: Verifica se o texto é válido (não nulo/vazio e string)
    if (!texto || typeof texto !== 'string') {
      throw new Error('[DocumentClassifier] Texto inválido para classificação');
    }
    
    // LOG: Informa início da classificação com tamanho do documento
    console.log(`[DocumentClassifier] Iniciando classificação (${texto.length} caracteres)`);
    
    // ETAPA 1: Identifica categoria principal (PETIÇÃO vs DOCUMENTO OFICIAL)
    const categoria = this._identificarCategoria(texto);
    
    console.log(`[DocumentClassifier] 📋 Categoria detectada: "${categoria}"`);
    
    // ETAPA 2 e 3: Tipo e Subtipo - AINDA NÃO IMPLEMENTADOS
    // Por enquanto, retornamos strings vazias até implementar a lógica completa
    const tipoId = '';
    const subtipoId = '';
    
    // ETAPA 4: Calcula um score de confiança (0-1) baseado na categoria detectada
    const confianca = categoria === 'categoriaDesconhecida' ? 0.0 : 0.85;
    
    // ETAPA 5: Converte categoria em ID final
    const categoriaId = categoria === 'pet' ? 'pet' : 
                        categoria === 'doc_oficial' ? 'doc_oficial' : 
                        'categoriaDesconhecida';
    
    // LOG: Exibe resultado final da classificação com nível de confiança em %
    console.log(
      `[DocumentClassifier] Classificado: ${categoriaId} ` +
      `(tipo/subtipo: não implementado) ` +
      `(confiança: ${(confianca * 100).toFixed(0)}%)`
    );
    
    // RETORNO: Objeto com resultado da classificação
    return {
      categoriaId,
      tipoId,
      subtipoId,
      confianca,
      tipoOriginal: '' // Vazio até implementar extração de tipo original
    };
  }
  
  /**
   * Identifica se é petição ou documento oficial
   * @private
   */
  _identificarCategoria(texto) {
    // Extrai primeiros 250 caracteres para análise
    const texto250 = texto.substring(0, 250);
    
    console.log('[DocumentClassifier] Analisando primeiros 250 caracteres:', texto250);
    
    // PETIÇÃO: Exatamente 17 dígitos formando uma string inteira (não pode ter mais ou menos dígitos)
    // Exemplo: 31123252330338563 ou 29409171959441031
    // (?<!\d) garante que não há dígito antes
    // (?!\d) garante que não há dígito depois
    const regexPeticao = /(?<!\d)\d{17}(?!\d)/;
    
    // DOCUMENTO OFICIAL: Presença de "Processo de registro de marca" OU "Petição de Marca" nos primeiros 250 caracteres
    // OBS: Inclusão da string institucional abaixo vale apenas para documentos de patentes
    const regexDocOficial = /(Processo de registro de marca|Petição de Marca|SERVIÇO PÚBLICO FEDERAL MINISTÉRIO DO DESENVOLVIMENTO, INDÚSTRIA, COMÉRCIO E SERVIÇOS INSTITUTO NACIONAL DA PROPRIEDADE INDUSTRIAL)/i;
    
    let categoria = 'categoriaDesconhecida';
    
    // 1. Verifica PETIÇÃO primeiro
    if (regexPeticao.test(texto250)) {
      categoria = 'pet';
      console.log('[DocumentClassifier] ✅ CATEGORIA IDENTIFICADA: PETIÇÃO (string de 17 dígitos encontrada)');
    } 
    // 2. Se não for petição, verifica DOCUMENTO OFICIAL
    else if (regexDocOficial.test(texto250)) {
      categoria = 'doc_oficial';
      console.log('[DocumentClassifier] ✅ CATEGORIA IDENTIFICADA: DOCUMENTO OFICIAL (strings indicadoras encontradas)');
    } 
    // 3. Nenhum padrão reconhecido
    else {
      console.log('[DocumentClassifier] ⚠️ CATEGORIA IDENTIFICADA: CATEGORIA DESCONHECIDA (nenhum padrão reconhecido)');
    }
    
    return categoria;
  }
  
  /**
   * Identifica tipo específico baseado na categoria
   * ⚠️ TEMPORARIAMENTE DESATIVADO - Retorna sempre vazio até implementação completa
   * @private
   */
  _identificarTipo(texto, categoria) {
    // SE é petição: usa método específico para petições
    if (categoria === 'pet') {
      return this._identificarTipoPeticao(texto);
    } 
    // SENÃO se é documento oficial: usa método específico para docs oficiais
    else if (categoria === 'doc_oficial') {
      return this._identificarTipoDocOficial(texto);
    } 
    // SENÃO: categoria desconhecida, retorna tipo genérico
    else {
      return 'GENERICO';
    }
  }
  
  /**
   * Identifica tipo de petição (REUTILIZA LÓGICA DO IPAS)
   * ⚠️ TEMPORARIAMENTE DESATIVADO - Aguardando implementação de tipos
   * @private
   */
  _identificarTipoPeticao(texto) {
    // CLASSIFICAÇÃO POR TIPO DESABILITADA TEMPORARIAMENTE
    // Mantemos apenas a categoria (petição/documento oficial).
    return 'GENERICO';

    /*
    // LÓGICA ORIGINAL (mantida comentada para referência futura)
    const patterns = [
      /tipoPeticao[:\s]*["']?([A-Z_]+)["']?/i,
      /tipo[_\s]da[_\s]peticao[:\s]*["']?([A-Z_]+)["']?/i,
      /tipo[:\s]*["']?([A-Z_]+)["']?/i
    ];

    for (const pattern of patterns) {
      const match = texto.match(pattern);
      if (match && match[1]) {
        const tipo = match[1].toUpperCase().replace(/\s+/g, '_');
        console.log(`[DocumentClassifier] Tipo via variável: ${tipo}`);
        return tipo;
      }
    }

    console.log('[DocumentClassifier] Usando detecção por palavras-chave...');

    const textoLower = texto.toLowerCase();

    const tiposMap = {
      'RECURSO_INDEFERIMENTO': [
        'recurso contra o indeferimento',
        'recurso contra indeferimento',
        'indeferimento',
        'recurso contra a decisão'
      ],
      'OPOSICAO': [
        'oposição',
        'oposicao',
        'manifesta oposição',
        'apresenta oposição'
      ],
      'MANIFESTACAO': [
        'manifestação',
        'manifestacao',
        'vem manifestar',
        'manifesta-se'
      ],
      'CONTESTACAO': [
        'contestação',
        'contestacao',
        'contesta',
        'vem contestar'
      ],
      'NULIDADE': [
        'nulidade',
        'anulação',
        'anulacao',
        'ação de nulidade',
        'pedido de nulidade'
      ],
      'CADUCIDADE': [
        'caducidade',
        'declaração de caducidade',
        'pedido de caducidade'
      ],
      'PEDIDO_REGISTRO': [
        'pedido de registro',
        'requer o registro',
        'apresenta pedido'
      ],
      'RECURSO_EXIGENCIA': [
        'recurso contra exigência',
        'recurso de exigência',
        'exigência técnica'
      ],
      'CUMPRIMENTO_EXIGENCIA': [
        'cumprimento de exigência',
        'atendimento de exigência',
        'cumpre exigência'
      ],
      'JUNTADA_DOCUMENTO': [
        'juntada de documento',
        'apresenta documento',
        'junta aos autos'
      ]
    };

    for (const [tipo, palavrasChave] of Object.entries(tiposMap)) {
      for (const palavra of palavrasChave) {
        if (textoLower.includes(palavra)) {
          console.log(`[DocumentClassifier] Tipo via palavra-chave: ${tipo} ("${palavra}")`);
          return tipo;
        }
      }
    }

    console.warn('[DocumentClassifier] Tipo não identificado, usando GENERICO');
    return 'GENERICO';
    */
  }
  
  /**
   * Identifica tipo de documento oficial do INPI
   * ⚠️ TEMPORARIAMENTE DESATIVADO - Aguardando implementação de tipos
   * @private
   */
  _identificarTipoDocOficial(texto) {
    // CLASSIFICAÇÃO POR TIPO DE DOCUMENTO OFICIAL DESABILITADA TEMPORARIAMENTE
    return 'DOC_OFICIAL_GENERICO';

    /*
    // LÓGICA ORIGINAL (comentada para reativar no futuro)
    const textoLower = texto.toLowerCase();

    const tiposMap = {
      'DESPACHO_DECISORIO': [
        'despacho decisório',
        'despacho de decisão',
        'decide'
      ],
      'NOTIFICACAO_EXIGENCIA': [
        'notificação de exigência',
        'exigência técnica',
        'exige-se'
      ],
      'NOTIFICACAO_OPOSICAO': [
        'notificação de oposição',
        'ciência de oposição'
      ],
      'INTIMACAO': [
        'intimação',
        'intima-se',
        'fica intimado'
      ],
      'PARECER_TECNICO': [
        'parecer técnico',
        'parecer do inpi',
        'análise técnica'
      ]
    };

    for (const [tipo, palavrasChave] of Object.entries(tiposMap)) {
      for (const palavra of palavrasChave) {
        if (textoLower.includes(palavra)) {
          console.log(`[DocumentClassifier] Doc oficial: ${tipo} ("${palavra}")`);
          return tipo;
        }
      }
    }

    return 'DOC_OFICIAL_GENERICO';
    */
  }
  
  /**
   * Mapeia tipo original para ID canônico
   * ⚠️ TEMPORARIAMENTE DESATIVADO - Retorna sempre string vazia
   * @private
   */
  _mapearParaTipoId(tipoOriginal, categoria) {
    // MAPEAMENTO DE TIPOS DESABILITADO TEMPORARIAMENTE
    // Apenas retornamos IDs genéricos por categoria.
    if (categoria === 'pet') {
      return 'pet_generico';
    } else if (categoria === 'doc_oficial') {
      return 'doc_oficial_generico';
    } else {
      return 'desconhecido';
    }

    /*
    // LÓGICA ORIGINAL (comentada para referência futura)
    if (categoria === 'pet') {
      const mapa = {
        'RECURSO_INDEFERIMENTO': 'pet_recurso_indeferimento',
        'OPOSICAO': 'pet_oposicao',
        'MANIFESTACAO': 'pet_manifestacao',
        'CONTESTACAO': 'pet_contestacao',
        'NULIDADE': 'pet_nulidade',
        'CADUCIDADE': 'pet_caducidade',
        'PEDIDO_REGISTRO': 'pet_pedido_registro',
        'RECURSO_EXIGENCIA': 'pet_recurso_exigencia',
        'CUMPRIMENTO_EXIGENCIA': 'pet_cumprimento_exigencia',
        'JUNTADA_DOCUMENTO': 'pet_juntada_documento',
        'GENERICO': 'pet_generico'
      };

      return mapa[tipoOriginal] || 'pet_generico';
    } else if (categoria === 'doc_oficial') {
      const mapa = {
        'DESPACHO_DECISORIO': 'doc_oficial_despacho_decisorio',
        'NOTIFICACAO_EXIGENCIA': 'doc_oficial_notificacao_exigencia',
        'NOTIFICACAO_OPOSICAO': 'doc_oficial_notificacao_oposicao',
        'INTIMACAO': 'doc_oficial_intimacao',
        'PARECER_TECNICO': 'doc_oficial_parecer_tecnico',
        'DOC_OFICIAL_GENERICO': 'doc_oficial_generico'
      };

      return mapa[tipoOriginal] || 'doc_oficial_generico';
    } else {
      return 'desconhecido';
    }
    */
  }
  
  /**
   * Calcula score de confiança baseado em heurísticas
   * ⚠️ TEMPORARIAMENTE DESATIVADO - Retorna valor fixo baseado na categoria
   * @private
   */
  _calcularConfianca(texto, tipo) {
    // SE o tipo é genérico: retorna baixa confiança (30%)
    // Indica que a classificação foi feita com pouca certeza
    if (tipo === 'GENERICO' || tipo === 'DOC_OFICIAL_GENERICO') {
      return 0.3;
    }
    
    // CÁLCULO: Conta quantas vezes o tipo aparece no texto (indicador de certeza)
    // Usa expressão regular para encontrar variações do tipo (com espaços em vez de underscore)
    const regex = new RegExp(tipo.replace(/_/g, '\\s+'), 'gi');
    const matches = (texto.match(regex) || []).length;
    
    // FÓRMULA: Score base 60% + 10% por cada ocorrência, máximo 95%
    // Exemplo: 0 matches = 60%, 1 match = 70%, 2 matches = 80%, etc.
    // Limita a 95% para deixar margem de incerteza
    const score = Math.min(0.95, 0.6 + (matches * 0.1));
    
    return score;
  }
}

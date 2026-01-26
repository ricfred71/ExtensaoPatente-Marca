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
    if (!texto || typeof texto !== 'string') {
      throw new Error('[DocumentClassifier] Texto inválido para classificação');
    }
    
    console.log(`[DocumentClassifier] Iniciando classificação (${texto.length} caracteres)`);
    
    // 1. Identificar categoria principal
    const categoria = this._identificarCategoria(texto);
    
    // 2. Identificar tipo específico dentro da categoria
    const tipoOriginal = this._identificarTipo(texto, categoria);
    
    // 3. Mapear para ID canônico
    const tipoId = this._mapearParaTipoId(tipoOriginal, categoria);
    
    // 4. Calcular score de confiança
    const confianca = this._calcularConfianca(texto, tipoOriginal);
    
    // 5. Mapear categoria para ID
    const categoriaId = categoria === 'pet' ? 'pet' : 
                        categoria === 'doc_oficial' ? 'doc_oficial' : 
                        'desconhecido';
    
    console.log(
      `[DocumentClassifier] Classificado: ${categoriaId} > ${tipoId} ` +
      `(confiança: ${(confianca * 100).toFixed(0)}%)`
    );
    
    return {
      categoriaId,
      tipoId,
      subtipoId: '',
      confianca,
      tipoOriginal // Mantém tipo do IPAS para compatibilidade
    };
  }
  
  /**
   * Identifica se é petição ou documento oficial
   * @private
   */
  _identificarCategoria(texto) {
    const textoLower = texto.toLowerCase();
    
    // Indicadores de documento oficial do INPI
    const indicadoresDocOficial = [
      'despacho',
      'exigência',
      'notificação',
      'decisão',
      'intimação',
      'parecer técnico',
      'parecer inpi'
    ];
    
    // Indicadores de petição
    const indicadoresPeticao = [
      'peticao',
      'petição',
      'requerente',
      'procurador',
      'vem requerer',
      'vem solicitar',
      'apresenta'
    ];
    
    let scoreDocOficial = 0;
    let scorePeticao = 0;
    
    for (const indicador of indicadoresDocOficial) {
      const regex = new RegExp(indicador, 'gi');
      const matches = (textoLower.match(regex) || []).length;
      scoreDocOficial += matches;
    }
    
    for (const indicador of indicadoresPeticao) {
      const regex = new RegExp(indicador, 'gi');
      const matches = (textoLower.match(regex) || []).length;
      scorePeticao += matches;
    }
    
    console.log(`[DocumentClassifier] Scores - Petição: ${scorePeticao}, Doc Oficial: ${scoreDocOficial}`);
    
    if (scoreDocOficial > scorePeticao) {
      return 'doc_oficial';
    } else if (scorePeticao > 0) {
      return 'pet';
    } else {
      return 'desconhecido';
    }
  }
  
  /**
   * Identifica tipo específico baseado na categoria
   * @private
   */
  _identificarTipo(texto, categoria) {
    if (categoria === 'pet') {
      return this._identificarTipoPeticao(texto);
    } else if (categoria === 'doc_oficial') {
      return this._identificarTipoDocOficial(texto);
    } else {
      return 'GENERICO';
    }
  }
  
  /**
   * Identifica tipo de petição (REUTILIZA LÓGICA DO IPAS)
   * @private
   */
  _identificarTipoPeticao(texto) {
    // MÉTODO 1: Procura por variável tipoPeticao no texto (padrão IPAS)
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
    
    // MÉTODO 2: Fallback - identifica por palavras-chave
    console.log('[DocumentClassifier] Usando detecção por palavras-chave...');
    
    const textoLower = texto.toLowerCase();
    
    // MANTÉM OS 10 TIPOS DO IPAS
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
    
    // Procura por tipo mais específico primeiro
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
  }
  
  /**
   * Identifica tipo de documento oficial do INPI
   * @private
   */
  _identificarTipoDocOficial(texto) {
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
  }
  
  /**
   * Mapeia tipo original para ID canônico
   * @private
   */
  _mapearParaTipoId(tipoOriginal, categoria) {
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
  }
  
  /**
   * Calcula score de confiança baseado em heurísticas
   * @private
   */
  _calcularConfianca(texto, tipo) {
    // Score base por tipo
    if (tipo === 'GENERICO' || tipo === 'DOC_OFICIAL_GENERICO') {
      return 0.3; // Baixa confiança para tipos genéricos
    }
    
    // Conta quantas vezes o tipo aparece no texto (indicador de certeza)
    const regex = new RegExp(tipo.replace(/_/g, '\\s+'), 'gi');
    const matches = (texto.match(regex) || []).length;
    
    // Score aumenta com número de matches, mas satura em 0.95
    const score = Math.min(0.95, 0.6 + (matches * 0.1));
    
    return score;
  }
}

/**
 * sectors/patentes/classifier.js
 * 
 * Classificador de documentos específico do setor Patentes
 * Identifica categorias e tipos de documentos relacionados a patentes
 * 
 * CATEGORIAS PATENTES (mesmas de Marcas):
 * - PETICAO: Petição com 17 dígitos OU padrões específicos de patentes
 * - DOCUMENTO_OFICIAL: Despachos, decisões, pareceres técnicos do INPI
 * - CATEGORIADESCONHECIDA: Não se enquadra nos padrões
 * 
 * NOTA: Patentes usam os mesmos identificadores de categoria que Marcas,
 *       mas com padrões regex específicos para documentos de patentes.
 */

export class PatentesClassifier {
  /**
   * Classifica um documento de patente
   * @param {string} texto - Texto completo do documento
   * @returns {Object} { categoriaId, tipoId, subtipoId, confianca, tipoOriginal }
   */
  classificar(texto) {
    // VALIDAÇÃO
    if (!texto || typeof texto !== 'string') {
      throw new Error('[PatentesClassifier] Texto inválido para classificação');
    }
    
    console.log(`[PatentesClassifier] Iniciando classificação (${texto.length} caracteres)`);
    
    // ETAPA 1: Identifica categoria (PETICAO ou DOCUMENTO_OFICIAL)
    const categoria = this._identificarCategoria(texto);
    console.log(`[PatentesClassifier] 📋 Categoria detectada: "${categoria}"`);
    
    // ETAPA 2 e 3: Tipo e Subtipo - ⚠️ DESATIVADOS por enquanto
    const tipoId = '';
    const subtipoId = '';
    
    // ETAPA 4: Calcula confiança
    const confianca = categoria === 'categoriaDesconhecida' ? 0.0 : 0.85;
    
    // ETAPA 5: Converte em categoriaId final
    const categoriaId = categoria === 'peticao' ? 'peticao' : 
                        categoria === 'documento_oficial' ? 'documento_oficial' : 
                        'categoriaDesconhecida';
    
    console.log(
      `[PatentesClassifier] Classificado: ${categoriaId} ` +
      `(tipo/subtipo: não implementado) ` +
      `(confiança: ${(confianca * 100).toFixed(0)}%)`
    );
    
    return {
      categoriaId,
      tipoId,
      subtipoId,
      confianca,
      tipoOriginal: '',
      setor: 'patentes'
    };
  }
  
  /**
   * Identifica a categoria do documento de patente
   * Padrões específicos para patentes, mas categorias iguais a Marcas
   * @private
   */
  _identificarCategoria(texto) {
    const texto250 = texto.substring(0, 250).toLowerCase();
    
    console.log('[PatentesClassifier] Analisando primeiros 250 caracteres');
    
    // PADRÃO 1: PETIÇÃO - 17 dígitos (padrão universal, igual a Marcas)
    const regexPeticao = /(?<!\d)\d{17}(?!\d)/;
    
    // PADRÃO 2: DOCUMENTO OFICIAL PATENTES
    const regexDocOficial = /(instituto nacional da propriedade industrial)/i;
    
    let categoria = 'categoriaDesconhecida';
    
    // 1. Verifica PETIÇÃO por 17 dígitos
    if (regexPeticao.test(texto250)) {
      categoria = 'peticao';
      console.log('[PatentesClassifier] ✅ CATEGORIA: PETIÇÃO (17 dígitos encontrados)');
    } 
    // 2. Verifica DOCUMENTO OFICIAL
    else if (regexDocOficial.test(texto250)) {
      categoria = 'documento_oficial';
      console.log('[PatentesClassifier] ✅ CATEGORIA: DOCUMENTO OFICIAL');
    } 
    // 3. Nenhum padrão reconhecido
    else {
      console.log('[PatentesClassifier] ⚠️ CATEGORIA: DESCONHECIDA (nenhum padrão reconhecido)');
    }
    
    return categoria;
  }
  
  /**
   * Identifica tipo específico de petição de patente
   * ⚠️ TEMPORARIAMENTE DESATIVADO
   * @private
   */
  _identificarTipoPeticao(texto) {
    const textoLower = texto.toLowerCase();
    
    // Diferencia entre Patente de Invenção e Modelo de Utilidade (exemplo para futuro)
    if (textoLower.includes('modelo de utilidade') || textoLower.includes('modelo de utilidade')) {
      return 'MODELO_UTILIDADE';
    } else if (textoLower.includes('patente de invenção') || textoLower.includes('patente de invencao')) {
      return 'PATENTE_INVENCAO';
    }
    
    return 'PEDIDO_GENERICO';
  }
  
  /**
   * Identifica tipo específico de documento oficial de patente
   * ⚠️ TEMPORARIAMENTE DESATIVADO
   * @private
   */
  _identificarTipoDocOficial(texto) {
    return 'DOC_OFICIAL_GENERICO';
  }
}

// Exporta instância única (singleton)
export default new PatentesClassifier();

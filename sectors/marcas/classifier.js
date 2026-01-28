/**
 * sectors/marcas/classifier.js
 * 
 * Classificador de documentos específico do setor Marcas
 * Identifica categorias e tipos de documentos relacionados a marcas
 * 
 * CATEGORIAS MARCAS:
 * - PETICAO: Petição com 17 dígitos
 * - DOCUMENTO_OFICIAL: Despachos, decisões, intimações do INPI
 * - CATEGORIADESCONHECIDA: Não se enquadra nos padrões
 */

export class MarcasClassifier {
  /**
   * Classifica um documento de marca
   * @param {string} texto - Texto completo do documento
   * @returns {Object} { categoriaId, tipoId, subtipoId, confianca, tipoOriginal }
   */
  classificar(texto) {
    // VALIDAÇÃO
    if (!texto || typeof texto !== 'string') {
      throw new Error('[MarcasClassifier] Texto inválido para classificação');
    }
    
    console.log(`[MarcasClassifier] Iniciando classificação (${texto.length} caracteres)`);
    
    // ETAPA 1: Identifica categoria (PETICAO, DOCUMENTO_OFICIAL, etc)
    const categoria = this._identificarCategoria(texto);
    console.log(`[MarcasClassifier] 📋 Categoria detectada: "${categoria}"`);
    
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
      `[MarcasClassifier] Classificado: ${categoriaId} ` +
      `(tipo/subtipo: não implementado) ` +
      `(confiança: ${(confianca * 100).toFixed(0)}%)`
    );
    
    return {
      categoriaId,
      tipoId,
      subtipoId,
      confianca,
      tipoOriginal: '',
      setor: 'marcas'
    };
  }
  
  /**
   * Identifica a categoria do documento de marca
   * @private
   */
  _identificarCategoria(texto) {
    const texto250 = texto.substring(0, 250);
    console.log('[MarcasClassifier] Analisando primeiros 250 caracteres:', texto250);
    
    // PADRÃO 1: PETIÇÃO - 17 dígitos contínuos
    // Exemplo: 31123252330338563
    // (?<!\d) = não há dígito antes
    // (?!\d) = não há dígito depois
    const regexPeticao = /(?<!\d)\d{17}(?!\d)/;
    
    // PADRÃO 2: DOCUMENTO OFICIAL MARCAS
    // Strings características de documentos oficiais do INPI para marcas
    const regexDocOficial = /(Processo de registro de marca|Petição de Marca)/i;
    
    let categoria = 'categoriaDesconhecida';
    
    // 1. Verifica PETICAO (17 dígitos)
    if (regexPeticao.test(texto250)) {
      categoria = 'peticao';
      console.log('[MarcasClassifier] ✅ CATEGORIA: PETIÇÃO (17 dígitos encontrados)');
    } 
    // 2. Verifica DOCUMENTO OFICIAL
    else if (regexDocOficial.test(texto250)) {
      categoria = 'documento_oficial';
      console.log('[MarcasClassifier] ✅ CATEGORIA: DOCUMENTO OFICIAL (padrões encontrados)');
    } 
    // 3. Nenhum padrão reconhecido
    else {
      console.log('[MarcasClassifier] ⚠️ CATEGORIA: DESCONHECIDA (nenhum padrão reconhecido)');
    }
    
    return categoria;
  }
  
  /**
   * Identifica tipo específico de petição de marca
   * ⚠️ TEMPORARIAMENTE DESATIVADO
   * @private
   */
  _identificarTipoPeticao(texto) {
    return 'GENERICO';
  }
  
  /**
   * Identifica tipo específico de documento oficial de marca
   * ⚠️ TEMPORARIAMENTE DESATIVADO
   * @private
   */
  _identificarTipoDocOficial(texto) {
    return 'DOC_OFICIAL_GENERICO';
  }
}

// Exporta instância única (singleton)
export default new MarcasClassifier();

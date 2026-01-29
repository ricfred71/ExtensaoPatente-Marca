/**
 * sectors/marcas/types/recurso-indeferimento/classifier.js
 * 
 * Classificador específico para: Recurso contra Indeferimento de Pedido de Registro de Marca
 * Define as regras de detecção e confiança para este tipo
 */

export const RECURSO_INDEFERIMENTO_CLASSIFIER = {
  id: 'recursoIndeferimentoPedidoRegistro',
  descricao: 'Recurso contra indeferimento de pedido de registro de marca',
  categoria: 'peticao',
  
  /**
   * Teste para identificar este tipo de documento
   * @param {string} texto - Primeiros caracteres do documento
   * @returns {boolean} - true se detectou este tipo
   */
  test: (texto) => {
    const texto250 = texto.substring(0, 250);
    return texto250.includes('Recurso contra indeferimento de pedido de registro de marca');
  },
  
  /**
   * Palavras-chave para reforçar confiança
   */
  keywords: [
    'recurso contra indeferimento',
    'recurso do indeferimento',
    'indeferimento de pedido de registro',
    'recurso de marca'
  ],
  
  /**
   * Confiança base para este tipo (0-1)
   */
  confidenceBase: 0.95,
  
  /**
   * Calcula confiança baseado em evidências no texto
   * @param {string} texto - Texto completo
   * @returns {number} - Confiança (0-1)
   */
  calculateConfidence: (texto) => {
    let confidence = RECURSO_INDEFERIMENTO_CLASSIFIER.confidenceBase;
    const textoLower = texto.toLowerCase();
    
    // Aumenta confiança se encontrar mais evidências
    if (textoLower.includes('fundamenta')) confidence += 0.02;
    if (textoLower.includes('recurso não provido') || textoLower.includes('decisão mantida')) {
      confidence += 0.02;
    }
    if (textoLower.includes('classe') || textoLower.includes('marca')) {
      confidence += 0.01;
    }
    
    // Garante que não ultrapasse 1.0
    return Math.min(confidence, 1.0);
  }
};

/**
 * Identifica e valida se é um Recurso contra Indeferimento
 * @param {string} texto - Texto completo do documento
 * @returns {Object} { isMatch: boolean, confidence: number }
 */
export function identificarRecursoIndeferimento(texto) {
  const isMatch = RECURSO_INDEFERIMENTO_CLASSIFIER.test(texto);
  
  if (!isMatch) {
    return {
      isMatch: false,
      confidence: 0
    };
  }
  
  const confidence = RECURSO_INDEFERIMENTO_CLASSIFIER.calculateConfidence(texto);
  
  return {
    isMatch: true,
    confidence,
    tipoId: RECURSO_INDEFERIMENTO_CLASSIFIER.id,
    descricao: RECURSO_INDEFERIMENTO_CLASSIFIER.descricao,
    categoria: RECURSO_INDEFERIMENTO_CLASSIFIER.categoria
  };
}

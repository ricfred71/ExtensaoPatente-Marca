/**
 * sectors/patentes/types/doc_recurso-indef--naoProv/doc_classifier.js
 * 
 * Classificador para Documento Oficial: Recurso contra Indeferimento de Patente - Não Provido
 */

/**
 * Identifica se o documento é um despacho de Recurso Não Provido para PATENTE
 * @param {string} textoCompleto - Texto completo do PDF
 * @returns {Object} { isMatch, tipoId, descricao, confidence, patternsMatched }
 */
export function identificarDocRecursoIndefNaoProv(textoCompleto) {
  const texto = textoCompleto.toLowerCase();
  
  const patterns = [
    /recurso\s+n[ãa]o\s+provido/i,
    /recurso\s+administrativo.*?n[ãa]o\s+provido/i,
    /n[ãa]o\s+se\s+prov[êe]\s+o\s+recurso/i,
    /mantida\s+a\s+decis[ãa]o\s+de\s+indeferimento/i,
    /recurso.*?indeferido/i,
    /decis[ãa]o.*?mantida/i,
    /pedido\s+de\s+patente.*?indeferimento/i,
    /patente.*?n[ãa]o\s+provido/i
  ];
  
  let patternsMatched = 0;
  for (const pattern of patterns) {
    if (pattern.test(texto)) {
      patternsMatched++;
    }
  }
  
  // Confiança baseada em quantos padrões foram encontrados
  const confidence = Math.min(100, (patternsMatched / patterns.length) * 100 + 20);
  const isMatch = patternsMatched >= 1;
  
  return {
    isMatch,
    tipoId: 'recursoIndeferimentoNaoProvidoPatente',
    descricao: 'Recurso não provido. Decisão mantida (Patente)',
    confidence: Math.round(confidence),
    patternsMatched
  };
}

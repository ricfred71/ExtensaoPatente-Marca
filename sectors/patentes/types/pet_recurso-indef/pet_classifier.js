/**
 * sectors/patentes/types/pet_recurso-indef/pet_classifier.js
 * 
 * Classificador específico para: Recurso contra Indeferimento de Pedido de Patente
 */

export function identificarRecursoIndef(texto) {
  // Padrões que indicam um Recurso contra Indeferimento de PATENTE
  const padroes = [
    /recurso\s+contra\s+indeferimento/i,
    /recurs[os]?\s+administrativo/i,
    /recurso\s+ao\s+presidente/i,
    /impugna[çc][ã a]o\s+ao\s+indeferimento/i,
    /despacho\s+de\s+indeferimento/i,
    /pedido\s+de\s+patente.*?indeferid[oa]/i,
    /patente.*?indeferimento/i,
    /inven[çc][ãa]o.*?indeferid[oa]/i
  ];
  
  let confianca = 0;
  let matchCount = 0;
  
  for (const padrao of padroes) {
    if (padrao.test(texto)) {
      matchCount++;
    }
  }
  
  // Calcula confiança baseada no número de padrões encontrados
  confianca = Math.min(0.95, (matchCount / padroes.length) * 1.2);
  
  return {
    isMatch: matchCount > 0,
    descricao: 'Recurso contra Indeferimento de Pedido de Patente',
    tipoId: 'recursoIndeferimentoPedidoPatente',
    confidence: confianca,
    patternsMatched: matchCount
  };
}

/**
 * sectors/marcas/types/index.js
 * 
 * Router central para os extractors específicos por tipo
 * Delega a extração para o tipo específico baseado no tipoId da classificação
 */

import { RecursoInderimentoExtractor } from './recurso-indeferimento/extractor.js';

/**
 * Mapa de tipos disponíveis
 * Cada tipo mapeia para sua classe Extractor correspondente
 */
const TYPE_EXTRACTORS_MAP = {
  'recursoIndeferimentoPedidoRegistro': RecursoInderimentoExtractor
  // Próximos tipos serão adicionados aqui:
  // 'oposicao': OposicaoExtractor,
  // 'manifestacao': ManifestacaoExtractor,
  // etc...
};

/**
 * Obtém o extractor apropriado para um tipo específico
 * 
 * @param {string} tipoId - ID do tipo (ex: 'recursoIndeferimentoPedidoRegistro')
 * @param {DataExtractor} dataExtractor - Instância do DataExtractor pai
 * @returns {Object|null} Instância do extractor ou null se tipo não encontrado
 */
export function getExtractorForTipo(tipoId, dataExtractor) {
  const ExtractorClass = TYPE_EXTRACTORS_MAP[tipoId];
  
  if (!ExtractorClass) {
    console.warn(`[TypeRouter] Tipo não reconhecido: ${tipoId}. Usando fallback ao DataExtractor genérico.`);
    return null;
  }
  
  return new ExtractorClass(dataExtractor);
}

/**
 * Lista todos os tipos disponíveis
 * @returns {string[]} Array de tipoIds
 */
export function getTiposDisponiveis() {
  return Object.keys(TYPE_EXTRACTORS_MAP);
}

/**
 * Verifica se um tipo está disponível
 * @param {string} tipoId - ID do tipo
 * @returns {boolean}
 */
export function isTipoDisponivel(tipoId) {
  return tipoId in TYPE_EXTRACTORS_MAP;
}

/**
 * Exporta todos os tipos para uso direto se necessário
 */
export * from './recurso-indeferimento/classifier.js';
export * from './recurso-indeferimento/extractor.js';
export * from './recurso-indeferimento/schema.js';

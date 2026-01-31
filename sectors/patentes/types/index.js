/**
 * sectors/patentes/types/index.js
 * 
 * Router central para os extractors específicos por tipo de PATENTES
 * Delega a extração para o tipo específico baseado no tipoId da classificação
 * 
 * Suporta:
 * - Tipos de petição (sem prefixo): recurso-indef/pet_extractor.js
 * - Tipos de documento oficial (com prefixo doc_): recurso-indef--naoProv/doc_extractor.js
 */

// Importações dos tipos implementados
import { RecursoIndefExtractor } from './pet_recurso-indef/pet_extractor.js';
import { DocRecursoIndefNaoProvExtractor } from './doc_recurso-indef--naoProv/doc_extractor.js';
import { identificarRecursoIndef } from './pet_recurso-indef/pet_classifier.js';
import { RECURSO_INDEF_SCHEMA, validarRecursoIndef } from './pet_recurso-indef/pet_schema.js';

/**
 * Mapa de tipos implementados para PATENTES
 * Para novos tipos, adicionar aqui após implementação
 */
const TYPE_EXTRACTORS_MAP = {
  // Petições de Patente
  'recursoIndeferimentoPedidoPatente': {
    ExtractorClass: RecursoIndefExtractor,
    categoria: 'peticao',
    folder: 'pet_recurso-indef'
  },

  // Documentos oficiais de Patente
  'recursoIndeferimentoNaoProvidoPatente': {
    ExtractorClass: DocRecursoIndefNaoProvExtractor,
    categoria: 'documento_oficial',
    folder: 'doc_recurso-indef--naoProv'
  },
  'recursoIndeferimentoPedidoPatente_naoProvido': {
    ExtractorClass: DocRecursoIndefNaoProvExtractor,
    categoria: 'documento_oficial',
    folder: 'doc_recurso-indef--naoProv'
  }
  
  // Próximos tipos de petição de patentes:
  // 'oposicaoPatente': { ExtractorClass: OposicaoPatentExtractor, categoria: 'peticao', folder: 'pet_oposicao' },
  // 'manifestacaoPatente': { ExtractorClass: ManifestacaoPatentExtractor, categoria: 'peticao', folder: 'pet_manifestacao' },
  
  // Próximos documentos oficiais:
  // 'recursoIndeferimentoProvidoPatente': { 
  //   ExtractorClass: DocRecursoProvidoExtractor, 
  //   categoria: 'documento_oficial',
  //   folder: 'doc_recurso-indef--provido'
  // }
};

/**
 * Cache de módulos importados dinamicamente
 */
const moduleCache = {};

/**
 * Obtém o extractor apropriado para um tipo específico de patente (async)
 * 
 * @param {string} tipoId - ID do tipo (ex: 'recursoIndeferimentoPedidoPatente')
 * @param {DataExtractor} dataExtractor - Instância do DataExtractor pai
 * @returns {Object|null} Instância do extractor ou null se tipo não encontrado
 */
export async function getExtractorForTipo(tipoId, dataExtractor) {
  const mapEntry = TYPE_EXTRACTORS_MAP[tipoId];
  
  if (!mapEntry) {
    console.warn(`[TypeRouter - PATENTES] Tipo não reconhecido: ${tipoId}. Usando fallback ao DataExtractor genérico.`);
    return null;
  }
  
  return new mapEntry.ExtractorClass(dataExtractor);
}

/**
 * Versão síncrona para tipos pré-carregados de PATENTES
 * Use apenas para tipos no TYPE_EXTRACTORS_MAP
 * 
 * @param {string} tipoId - ID do tipo
 * @param {DataExtractor} dataExtractor - Instância do DataExtractor pai
 * @returns {Object|null} Instância do extractor ou null
 */
export function getExtractorForTipoSync(tipoId, dataExtractor) {
  const mapEntry = TYPE_EXTRACTORS_MAP[tipoId];
  
  if (!mapEntry) {
    console.warn(`[TypeRouter - PATENTES] Tipo não encontrado no mapa síncrono: ${tipoId}. Use getExtractorForTipo() async ou carregue o tipo.`);
    return null;
  }
  
  return new mapEntry.ExtractorClass(dataExtractor);
}

/**
 * Lista todos os tipos disponíveis de petições de patentes
 * @returns {string[]} Array de tipoIds de petições
 */
export function getTiposPeticaoDisponiveis() {
  return Object.keys(TYPE_EXTRACTORS_MAP)
    .filter(key => TYPE_EXTRACTORS_MAP[key].categoria === 'peticao');
}

/**
 * Lista todos os tipos de documentos oficiais de patentes disponíveis
 * @returns {string[]} Array de tipoIds de documentos
 */
export function getTiposDocumentosDisponiveis() {
  return Object.keys(TYPE_EXTRACTORS_MAP)
    .filter(key => TYPE_EXTRACTORS_MAP[key].categoria === 'documento_oficial');
}

/**
 * Lista todos os tipos disponíveis (petições + documentos de patentes)
 * @returns {string[]} Array de tipoIds
 */
export function getTiposDisponiveis() {
  return Object.keys(TYPE_EXTRACTORS_MAP);
}

/**
 * Verifica se um tipo de patente está disponível
 * @param {string} tipoId - ID do tipo
 * @returns {boolean}
 */
export function isTipoDisponivel(tipoId) {
  return !!TYPE_EXTRACTORS_MAP[tipoId];
}

/**
 * Obtém informações de configuração de um tipo de patente
 * @param {string} tipoId - ID do tipo
 * @returns {object|null} Configuração do tipo ou null
 */
export function getTipoConfig(tipoId) {
  return TYPE_EXTRACTORS_MAP[tipoId] || null;
}

// ============================================================================
// EXPORTS DE TIPOS ESPECÍFICOS (backward compatibility + conveniência)
// ============================================================================

// Recurso contra Indeferimento de Patente (Petição)
export { RecursoIndefExtractor } from './pet_recurso-indef/pet_extractor.js';
export { identificarRecursoIndef } from './pet_recurso-indef/pet_classifier.js';
export { RECURSO_INDEF_SCHEMA, validarRecursoIndef } from './pet_recurso-indef/pet_schema.js';
export { TIPO_PETICAO as RECURSO_INDEF_TIPO_PETICAO } from './pet_recurso-indef/pet_relacionado.js';

// Recurso Não Provido de Patente (Documento Oficial)
export { DocRecursoIndefNaoProvExtractor } from './doc_recurso-indef--naoProv/doc_extractor.js';
export { identificarDocRecursoIndefNaoProv } from './doc_recurso-indef--naoProv/doc_classifier.js';
export { DOC_RECURSO_INDEF_NAO_PROV_SCHEMA, validarDocRecursoIndefNaoProv } from './doc_recurso-indef--naoProv/doc_schema.js';

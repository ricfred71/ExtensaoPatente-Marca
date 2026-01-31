/**
 * sectors/patentes/types/pet_recurso-indef/pet_relacionado.js
 * 
 * Metadados sobre o tipo de petição de patente e tipos de documentos relacionados
 */

export const TIPO_PETICAO = {
  id: 'recursoIndeferimentoPedidoPatente',
  categoria: 'peticao',
  abreviacao: 'recurso-indef-patente',
  nomeLongo: 'Recurso contra Indeferimento de Pedido de Patente',
  descricao: 'Petição de recurso administrativo contra decisão de indeferimento de pedido de patente',
  artigos: ['Art. 212 da Lei de Propriedade Industrial'],
  
  // Documentos oficiais relacionados que podem seguir
  documentosRelacionados: [
    {
      id: 'recursoIndeferimentoNaoProvidoPatente',
      abreviacao: 'recurso-indef--naoProv-patente',
      descricao: 'Despacho: Recurso não provido (patente)'
    },
    {
      id: 'recursoIndeferimentoProvidoPatente',
      abreviacao: 'recurso-indef--provido-patente',
      descricao: 'Despacho: Recurso provido (patente)'
    },
    {
      id: 'recursoIndeferimentoProvidoParcialPatente',
      abreviacao: 'recurso-indef--provParcial-patente',
      descricao: 'Despacho: Recurso provido parcialmente (patente)'
    }
  ]
};

export const TIPOS_DOCUMENTOS_RELACIONADOS = [
  'recursoIndeferimentoNaoProvidoPatente',
  'recursoIndeferimentoProvidoPatente',
  'recursoIndeferimentoProvidoParcialPatente'
];

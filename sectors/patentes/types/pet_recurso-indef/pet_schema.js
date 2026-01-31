/**
 * sectors/patentes/types/pet_recurso-indef/pet_schema.js
 * 
 * Schema do tipo: Recurso contra Indeferimento de Pedido de Patente
 * Define a estrutura esperada do objeto armazenado no storage
 */

export const RECURSO_INDEF_SCHEMA = {
  // ========================================
  // METADADOS DE CLASSIFICAÇÃO
  // ========================================
  categoria: { 
    type: 'string', 
    required: true,
    value: 'peticao',
    description: 'Categoria do documento'
  },
  tipo: { 
    type: 'string', 
    required: true,
    value: 'recursoIndeferimentoPedidoPatente',
    description: 'Tipo específico do documento'
  },
  subtipo: { 
    type: 'string', 
    required: false,
    description: 'Subtipo (para uso futuro)'
  },
  confianca: { 
    type: 'number', 
    required: true,
    min: 0,
    max: 1,
    description: 'Confiança da classificação (0-1)'
  },

  // ========================================
  // DADOS DA PETIÇÃO
  // ========================================
  form_numeroPeticao: { 
    type: 'string', 
    required: true,
    pattern: '\\d{12}',
    description: 'Número da petição (12 dígitos)'
  },
  form_numeroProcesso: { 
    type: 'string', 
    required: true,
    description: 'Número do pedido de patente (formato BR + dígitos ou legado)'
  },
  form_nossoNumero: { 
    type: 'string', 
    required: false,
    description: 'Nosso número (17 dígitos)'
  },
  form_dataPeticao: { 
    type: 'string', 
    required: false,
    description: 'Data e hora da petição (formato DD/MM/YYYY HH:MM)'
  },

  // ========================================
  // DADOS DO REQUERENTE
  // ========================================
  form_requerente_nome: { 
    type: 'string', 
    required: true,
    description: 'Nome ou Razão Social do requerente/depositante'
  },
  form_requerente_cpfCnpjNumINPI: { 
    type: 'string', 
    required: false,
    description: 'CPF/CNPJ/Número INPI do requerente'
  },
  form_requerente_endereco: { 
    type: 'string', 
    required: false,
    description: 'Endereço do requerente'
  },
  form_requerente_cidade: { 
    type: 'string', 
    required: false,
    description: 'Cidade do requerente'
  },
  form_requerente_estado: { 
    type: 'string', 
    required: false,
    pattern: '^[A-Z]{2}$',
    description: 'Estado/UF do requerente (2 letras)'
  },
  form_requerente_cep: { 
    type: 'string', 
    required: false,
    description: 'CEP do requerente'
  },
  form_requerente_pais: { 
    type: 'string', 
    required: false,
    description: 'País do requerente'
  },
  form_requerente_naturezaJuridica: { 
    type: 'string', 
    required: false,
    description: 'Natureza jurídica do requerente'
  },
  form_requerente_email: { 
    type: 'string', 
    required: false,
    format: 'email',
    description: 'E-mail do requerente'
  },

  // ========================================
  // DADOS DO PROCURADOR
  // ========================================
  form_procurador_nome: { 
    type: 'string', 
    required: false,
    description: 'Nome do procurador/advogado'
  },
  form_procurador_cpf: { 
    type: 'string', 
    required: false,
    description: 'CPF do procurador'
  },
  form_procurador_email: { 
    type: 'string', 
    required: false,
    format: 'email',
    description: 'E-mail do procurador'
  },
  form_procurador_numeroAPI: { 
    type: 'string', 
    required: false,
    description: 'Número de registro API do procurador'
  },
  form_procurador_numeroOAB: { 
    type: 'string', 
    required: false,
    description: 'Número OAB do procurador'
  },
  form_procurador_uf: { 
    type: 'string', 
    required: false,
    pattern: '^[A-Z]{2}$',
    description: 'UF da OAB do procurador'
  },
  form_procurador_escritorio_nome: { 
    type: 'string', 
    required: false,
    description: 'Nome do escritório do procurador'
  },
  form_procurador_escritorio_cnpj: { 
    type: 'string', 
    required: false,
    description: 'CNPJ do escritório do procurador'
  },

  // ========================================
  // DADOS ESPECÍFICOS DO TIPO: RECURSO INDEFERIMENTO PATENTE
  // ========================================
  form_TextoDaPetição: { 
    type: 'string', 
    required: false,
    description: 'Texto principal da petição - contém a argumentação técnica e fundamentação do recurso'
  },
  
  form_Anexos: { 
    type: 'array', 
    required: false,
    description: 'Lista de anexos da petição com descrição e nome do arquivo',
    itemSchema: {
      type: 'object',
      properties: {
        descricao: { type: 'string', description: 'Descrição do anexo' },
        nomeArquivo: { type: 'string', description: 'Nome do arquivo' }
      }
    }
  },

  // ========================================
  // METADADOS GERAIS
  // ========================================
  textoPeticao: { 
    type: 'string', 
    required: true,
    description: 'Texto completo da petição (não indexável)'
  },
  urlPdf: { 
    type: 'string', 
    required: false,
    format: 'uri',
    description: 'URL do PDF original'
  },
  dataProcessamento: { 
    type: 'string', 
    required: true,
    format: 'date-time',
    description: 'Data/hora de processamento (ISO 8601)'
  }
};

/**
 * Valida os dados extraídos do Recurso contra Indeferimento de Patente
 * @param {Object} dados - Objeto com os dados extraídos
 * @returns {Object} { valido, erros, avisos }
 */
export function validarRecursoIndef(dados) {
  const erros = [];
  const avisos = [];
  
  // Validações obrigatórias
  if (!dados.categoria || dados.categoria !== 'peticao') {
    erros.push('Campo categoria deve ser "peticao"');
  }
  
  if (!dados.tipo || !dados.tipo.includes('recurso')) {
    erros.push('Campo tipo deve conter "recurso"');
  }
  
  if (typeof dados.confianca !== 'number' || dados.confianca < 0 || dados.confianca > 1) {
    erros.push('Campo confianca deve ser número entre 0 e 1');
  }
  
  if (!dados.form_numeroPeticao || !/^\d{12}$/.test(dados.form_numeroPeticao)) {
    erros.push('Campo form_numeroPeticao deve ter 12 dígitos');
  }
  
  if (!dados.form_numeroProcesso) {
    erros.push('Campo form_numeroProcesso é obrigatório');
  }
  
  if (!dados.form_requerente_nome) {
    avisos.push('Nome do requerente não identificado');
  }
  
  if (!dados.textoPeticao) {
    erros.push('Texto completo da petição não encontrado');
  }
  
  if (!dados.dataProcessamento) {
    erros.push('Data de processamento não registrada');
  }
  
  return {
    valido: erros.length === 0,
    erros,
    avisos
  };
}

/**
 * storage/schema.js
 * 
 * Definições de schema para sessões de análise
 * 
 * @version 1.0.0
 * @created 26/01/2026
 */

/**
 * Schema completo de uma sessão de análise
 * 
 * Estrutura estendida do schema do IPAS para incluir:
 * - Dados LGPD (anonimização)
 * - Dados IA (resposta e reconstituição)
 * - Dados de exportação
 */
export const SESSION_SCHEMA = {
  // ========================================
  // IDENTIFICAÇÃO DA SESSÃO
  // ========================================
  sessionId: {
    type: 'string',
    required: true,
    format: 'ai_session_YYYYMMDDTHHMMSS_RANDOM',
    description: 'ID único da sessão'
  },
  
  timestamp: {
    type: 'string',
    required: true,
    format: 'ISO8601',
    description: 'Data/hora de criação'
  },
  
  versao: {
    type: 'string',
    required: true,
    default: '1.0',
    description: 'Versão do schema'
  },
  
  status: {
    type: 'string',
    required: true,
    enum: ['created', 'uploading', 'classifying', 'anonymizing', 'analyzing', 'completed', 'error'],
    description: 'Status atual do processamento'
  },
  
  // ========================================
  // DADOS DO DOCUMENTO (REUTILIZA CAMPOS DO IPAS)
  // ========================================
  documento: {
    type: 'object',
    properties: {
      // Metadata do arquivo
      nomeArquivo: { type: 'string', description: 'Nome do arquivo PDF' },
      tamanhoBytes: { type: 'number', description: 'Tamanho em bytes' },
      numeroPaginas: { type: 'number', description: 'Total de páginas' },
      paginasProcessadas: { type: 'number', description: 'Páginas processadas' },
      
      // Dados extraídos (compatibilidade com IPAS)
      numeroPeticao: { type: 'string', description: 'Número da petição/documento' },
      numeroProcesso: { type: 'string', description: 'Número do processo' },
      cpfCnpj: { type: 'string', description: 'CPF/CNPJ extraído' },
      nomeRequerente: { type: 'string', description: 'Nome do requerente/titular' },
      tipoPeticao: { type: 'string', description: 'Tipo original do IPAS' },
      textoPeticao: { type: 'string', description: 'Texto completo original' },
      
      // Dados processados do switch do IPAS
      dadosProcessados: {
        type: 'object',
        description: 'Dados específicos por tipo (do IPAS)'
      },
      
      // Classificação da nova extensão
      classificacao: {
        type: 'object',
        properties: {
          categoriaId: { type: 'string', enum: ['pet', 'doc_oficial', 'desconhecido'] },
          tipoId: { type: 'string', description: 'ID canônico (ex: pet_recurso_indeferimento)' },
          subtipoId: { type: 'string', description: 'Subtipo (futuro)' },
          confianca: { type: 'number', min: 0, max: 1, description: 'Score de confiança' },
          tipoOriginal: { type: 'string', description: 'Tipo do IPAS para compatibilidade' }
        }
      },
      
      // Metadata do PDF
      metadata: {
        type: 'object',
        properties: {
          titulo: { type: 'string' },
          autor: { type: 'string' },
          criador: { type: 'string' },
          dataCriacao: { type: 'string' },
          producer: { type: 'string' }
        }
      }
    }
  },
  
  // ========================================
  // DADOS LGPD (NOVO)
  // ========================================
  lgpd: {
    type: 'object',
    properties: {
      textoAnonimizado: {
        type: 'string',
        description: 'Texto com dados sensíveis substituídos por códigos'
      },
      
      // IMPORTANTE: Mapa salvo separadamente por segurança
      // Não fica na sessão principal
      mapaStorageKey: {
        type: 'string',
        description: 'Chave do mapa no storage (ai_session_XXX_lgpd_map)'
      },
      
      metadata: {
        type: 'object',
        properties: {
          totalSubstituicoes: { type: 'number', description: 'Quantos dados foram anonimizados' },
          tiposProtegidos: { type: 'array', items: 'string', description: 'Tipos de dados protegidos' },
          algoritmo: { type: 'string', default: 'regex-v1', description: 'Algoritmo usado' },
          timestamp: { type: 'string', format: 'ISO8601' }
        }
      }
    }
  },
  
  // ========================================
  // DADOS IA (NOVO)
  // ========================================
  ia: {
    type: 'object',
    properties: {
      provider: {
        type: 'string',
        enum: ['gemini', 'chatgpt', 'claude', 'outro'],
        description: 'Provedor de IA usado'
      },
      
      promptEnviado: {
        type: 'string',
        description: 'Prompt completo enviado (com texto anonimizado)'
      },
      
      respostaIA: {
        type: 'string',
        description: 'Resposta bruta da IA (ainda com códigos)'
      },
      
      respostaReconstituida: {
        type: 'string',
        description: 'Resposta final com dados reais (após reconstituição)'
      },
      
      timestamp: {
        type: 'string',
        format: 'ISO8601',
        description: 'Quando a análise foi concluída'
      },
      
      tempoProcessamentoMs: {
        type: 'number',
        description: 'Tempo de processamento em milissegundos'
      }
    }
  },
  
  // ========================================
  // DADOS DE EXPORTAÇÃO (NOVO)
  // ========================================
  export: {
    type: 'object',
    properties: {
      formatos: {
        type: 'array',
        items: { type: 'string', enum: ['md', 'docx', 'txt'] },
        description: 'Formatos exportados'
      },
      
      caminhos: {
        type: 'array',
        items: { type: 'string' },
        description: 'Caminhos dos arquivos salvos (se disponível)'
      },
      
      timestamp: {
        type: 'string',
        format: 'ISO8601',
        description: 'Quando foi exportado'
      }
    }
  }
};

/**
 * Valida se um objeto de sessão está conforme o schema
 * @param {Object} sessao - Objeto a validar
 * @returns {boolean} - true se válido
 */
export function validarSessao(sessao) {
  if (!sessao || typeof sessao !== 'object') {
    console.error('[Schema] Sessão inválida: não é um objeto');
    return false;
  }
  
  // Validações críticas
  const camposObrigatorios = ['sessionId', 'timestamp', 'versao', 'status'];
  
  for (const campo of camposObrigatorios) {
    if (!sessao[campo]) {
      console.error(`[Schema] Campo obrigatório ausente: ${campo}`);
      return false;
    }
  }
  
  // Valida status
  const statusValidos = ['created', 'uploading', 'classifying', 'anonymizing', 'analyzing', 'completed', 'error'];
  if (!statusValidos.includes(sessao.status)) {
    console.error(`[Schema] Status inválido: ${sessao.status}`);
    return false;
  }
  
  return true;
}

/**
 * Cria uma sessão vazia com valores default
 * @returns {Object} - Sessão inicializada
 */
export function criarSessaoVazia() {
  return {
    sessionId: '',
    timestamp: new Date().toISOString(),
    versao: '1.0',
    status: 'created',
    
    documento: {
      nomeArquivo: '',
      tamanhoBytes: 0,
      numeroPaginas: 0,
      paginasProcessadas: 0,
      numeroPeticao: '',
      numeroProcesso: '',
      cpfCnpj: '',
      nomeRequerente: '',
      tipoPeticao: '',
      textoPeticao: '',
      dadosProcessados: {},
      classificacao: {
        categoriaId: '',
        tipoId: '',
        subtipoId: '',
        confianca: 0,
        tipoOriginal: ''
      },
      metadata: {}
    },
    
    lgpd: {
      textoAnonimizado: '',
      mapaStorageKey: '',
      metadata: {
        totalSubstituicoes: 0,
        tiposProtegidos: [],
        algoritmo: 'regex-v1',
        timestamp: ''
      }
    },
    
    ia: {
      provider: '',
      promptEnviado: '',
      respostaIA: '',
      respostaReconstituida: '',
      timestamp: '',
      tempoProcessamentoMs: 0
    },
    
    export: {
      formatos: [],
      caminhos: [],
      timestamp: ''
    }
  };
}

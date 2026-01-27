# 📋 TASKS OTIMIZADO - IA Análise Jurídica

**Projeto:** Extensão Chrome independente para análise de PDFs com IA  
**Total de Horas Estimadas:** 110 horas (vs 148h original)  
**Economia:** 38 horas (26% redução)  
**Data de Atualização:** 26/01/2026  
**Desenvolvedor:** 1 pessoa

---

## 🎯 ESTRATÉGIA DE OTIMIZAÇÃO

### Reutilização do Sistema IPAS Existente

O IPAS já possui um **sistema completo de processamento de PDFs** implementado e testado:
- ✅ pdf_reader.js (extração de texto)
- ✅ peticao_processor.js (classificação com 10 tipos)
- ✅ peticao_storage.js (CRUD completo)

**Estratégia:** Copiar e adaptar ao invés de reescrever do zero.

### Comparação de Esforço

| Componente | Original | Otimizado | Economia |
|------------|----------|-----------|----------|
| PDF Loader | 12h | 2h | -10h |
| Classifier | 10h | 3h | -7h |
| Storage | 6h | 2h | -4h |
| Upload UI | 8h | 3h | -5h |
| Estrutura | 4h | 2h | -2h |
| Export | 8h | 4h | -4h |
| Polimento | 16h | 12h | -4h |
| Testes | 8h | 6h | -2h |
| **TOTAL** | **148h** | **110h** | **-38h** |

---

## 📊 Resumo Executivo

### Estatísticas Gerais

- **Sprints:** 5
- **Tasks Principais:** 22 (vs 25 original)
- **Progresso Geral:** 0% (planejamento)
- **Tasks Concluídas:** 0/22
- **Tasks em Progresso:** 0/22
- **Tasks Pendentes:** 22/22

### Distribuição de Horas por Sprint

| Sprint | Horas | % Total | Economia vs Original | Status |
|--------|-------|---------|---------------------|--------|
| [Sprint 1: Migração e Base](#sprint-1-migração-e-base) | 12h | 11% | -28h | PENDENTE |
| [Sprint 2: Anonimização LGPD](#sprint-2-anonimização-lgpd) | 32h | 29% | 0h | PENDENTE |
| [Sprint 3: Integração IA](#sprint-3-integração-ia) | 36h | 33% | 0h | PENDENTE |
| [Sprint 4: Resultado e Export](#sprint-4-resultado-e-export) | 18h | 16% | -6h | PENDENTE |
| [Sprint 5: Polimento](#sprint-5-polimento) | 12h | 11% | -4h | PENDENTE |

---

## 🎯 Sprints Detalhados

<a id="sprint-1-migração-e-base"></a>
## Sprint 1: Migração e Base

**Objetivo:** Migrar componentes existentes do IPAS e criar estrutura básica standalone

**Duração:** 12h (vs 40h original) | **Prioridade:** Alta | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T1.1 - Setup do Projeto (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar estrutura de diretórios standalone
- manifest.json (Manifest V3) configurado para extensão independente
- .gitignore básico
- README.md inicial

**Entregáveis:**
- [ ] Estrutura de diretórios completa
- [ ] manifest.json configurado (storage, tabs)
- [ ] .gitignore (node_modules, .obsidian, etc)
- [ ] README.md com instruções de instalação

**Estrutura criada:**
```
ExtensaoPatente-Marca/
├── manifest.json
├── .gitignore
├── README.md
├── lib/
├── core/
├── storage/
├── ai-integration/
└── ui/
```

**Critérios de Aceitação:**
- ✅ Extensão carrega sem erros no Chrome
- ✅ Estrutura organizada e documentada
- ✅ Git inicializado com primeiro commit

---

#### T1.2 - Migrar PDF.js e Reader (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Copiar lib/pdfjs/ do IPAS (sem modificações)
- Copiar content/ipas/pdf_reader.js → core/pdf-reader.js
- Adaptar para ler File object ao invés de URL
- Remover dependências de fetch/background

**Origem:**
```
IPAS: content/ipas/pdf_reader.js
IPAS: lib/pdfjs/
```

**Destino:**
```
core/pdf-reader.js
lib/pdfjs/
```

**Adaptações necessárias:**
```javascript
// ANTES (IPAS):
export async function getPDFText(pdfUrl) {
  const arrayBuffer = await fetchPdfBuffer(pdfUrl) // via background
  // ...
}

// DEPOIS (Novo):
export class PdfReader {
  async loadFromFile(file) {
    const arrayBuffer = await file.arrayBuffer() // direto do File API
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    let textoCompleto = ''
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      textoCompleto += this._extractText(textContent)
    }
    
    return {
      texto: textoCompleto,
      numeroPaginas: pdf.numPages,
      metadata: await pdf.getMetadata()
    }
  }
  
  _extractText(textContent) {
    // Reutilizar lógica existente do IPAS
  }
}
```

**Entregáveis:**
- [ ] lib/pdfjs/ copiado
- [ ] core/pdf-reader.js adaptado
- [ ] Classe PdfReader funcional
- [ ] Testes básicos (console.log com PDF local)

**Critérios de Aceitação:**
- ✅ Extrai texto de PDF local
- ✅ Funciona offline (sem fetch)
- ✅ Retorna estrutura padronizada
- ✅ Tratamento de erro para PDF protegido

---

#### T1.3 - Migrar e Refatorar Classifier (3h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Copiar content/ipas/peticao_processor.js → core/document-classifier.js
- Refatorar de função para classe standalone
- Manter switch completo com 10 tipos já implementados
- Adicionar score de confiança
- Adicionar suporte a documentos oficiais (não só petições)

**Origem:**
```
IPAS: content/ipas/peticao_processor.js
```

**Destino:**
```
core/document-classifier.js
```

**Refatoração:**
```javascript
// ANTES (IPAS):
export function processarPeticao(numeroPeticao, textoPeticao) {
  const tipoPeticao = identificarTipoPeticao(textoPeticao)
  
  switch(tipoPeticao) {
    case 'RECURSO_INDEFERIMENTO':
      dadosProcessados = processarRecursoIndeferimento(textoPeticao)
      break
    // ... 10 tipos
  }
  
  return { numeroPeticao, tipoPeticao, dadosProcessados, ... }
}

// DEPOIS (Novo):
export class DocumentClassifier {
  classificar(texto) {
    const categoria = this._identificarCategoria(texto)
    const tipo = this._identificarTipo(texto, categoria)
    const confianca = this._calcularConfianca(texto, tipo)
    
    return {
      categoriaId: categoria,  // 'pet' | 'doc_oficial' | 'desconhecido'
      tipoId: this._mapearParaTipoId(tipo, categoria),
      subtipoId: '',
      confianca: confianca,
      tipoOriginal: tipo  // mantém tipo do IPAS para compatibilidade
    }
  }
  
  _identificarTipo(texto, categoria) {
    // REUTILIZAR SWITCH COMPLETO DO IPAS
    if (categoria === 'pet') {
      return this._identificarTipoPeticao(texto)
    } else if (categoria === 'doc_oficial') {
      return this._identificarTipoDocOficial(texto)
    }
  }
  
  _identificarTipoPeticao(texto) {
    // COPIAR LÓGICA EXISTENTE DO IPAS
    if (/tipoPeticao.*RECURSO_INDEFERIMENTO/i.test(texto)) {
      return 'RECURSO_INDEFERIMENTO'
    }
    if (/tipoPeticao.*OPOSICAO/i.test(texto)) {
      return 'OPOSICAO'
    }
    // ... 10 tipos já implementados
    return 'GENERICO'
  }
  
  _mapearParaTipoId(tipo, categoria) {
    // Mapeia tipos do IPAS para IDs canônicos
    const mapa = {
      'RECURSO_INDEFERIMENTO': 'pet_recurso_indeferimento',
      'OPOSICAO': 'pet_oposicao',
      // ...
    }
    return mapa[tipo] || `${categoria}_generico`
  }
  
  _calcularConfianca(texto, tipo) {
    // Heurística simples baseada em matches
    if (tipo === 'GENERICO') return 0.3
    
    const matches = (texto.match(new RegExp(tipo, 'gi')) || []).length
    return Math.min(0.95, 0.7 + (matches * 0.1))
  }
}
```

**Entregáveis:**
- [ ] core/document-classifier.js
- [ ] Classe DocumentClassifier
- [ ] 10 tipos de petição (do IPAS) + tipos de doc oficial
- [ ] Score de confiança

**Critérios de Aceitação:**
- ✅ Classifica corretamente os 10 tipos do IPAS
- ✅ Retorna score de confiança (0-1)
- ✅ Fallback para "generico" se incerto
- ✅ Sem dependências do IPAS

---

#### T1.4 - Migrar e Adaptar Storage (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Copiar content/ipas/peticao_storage.js → storage/session-manager.js
- Adaptar schema de `peticao_*` para `ai_session_*`
- Adicionar campos para LGPD e IA
- Manter funções CRUD (já testadas)

**Origem:**
```
IPAS: content/ipas/peticao_storage.js
```

**Destino:**
```
storage/session-manager.js
storage/schema.js
```

**Adaptações:**
```javascript
// ANTES (IPAS):
async function salvarPeticao(peticao) {
  const chave = `peticao_${peticao.numeroPeticao}`
  await chrome.storage.local.set({ [chave]: peticao })
}

// DEPOIS (Novo):
export class SessionManager {
  async criar() {
    const sessionId = this._gerarSessionId()
    
    const sessao = {
      sessionId,
      timestamp: new Date().toISOString(),
      documento: {},
      lgpd: {},
      ia: {},
      export: {},
      status: 'created',
      versao: '1.0'
    }
    
    await this.salvar(sessao)
    return sessionId
  }
  
  async salvar(sessao) {
    const chave = sessao.sessionId
    await chrome.storage.local.set({ [chave]: sessao })
  }
  
  async carregar(sessionId) {
    const result = await chrome.storage.local.get(sessionId)
    return result[sessionId]
  }
  
  async listar() {
    const all = await chrome.storage.local.get(null)
    return Object.entries(all)
      .filter(([k, v]) => k.startsWith('ai_session_'))
      .map(([k, v]) => v)
  }
  
  async atualizar(sessionId, campos) {
    const sessao = await this.carregar(sessionId)
    const atualizada = { ...sessao, ...campos }
    await this.salvar(atualizada)
  }
  
  _gerarSessionId() {
    const timestamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)
    const random = Math.random().toString(36).substring(2, 10).toUpperCase()
    return `ai_session_${timestamp}_${random}`
  }
}

// Schema estendido (storage/schema.js)
export const SESSION_SCHEMA = {
  sessionId: 'string',
  timestamp: 'ISO8601',
  
  documento: {
    nomeArquivo: 'string',
    tamanhoBytes: 'number',
    numeroPaginas: 'number',
    
    // REUTILIZAR CAMPOS DO IPAS:
    numeroPeticao: 'string',
    numeroProcesso: 'string',
    cpfCnpj: 'string',
    nomeRequerente: 'string',
    tipoPeticao: 'string',
    textoPeticao: 'string',
    dadosProcessados: 'object',  // switch do IPAS
    
    classificacao: {
      categoriaId: 'string',
      tipoId: 'string',
      confianca: 'number'
    }
  },
  
  // NOVOS CAMPOS:
  lgpd: {
    textoAnonimizado: 'string',
    mapaSubstituicao: 'object',
    metadata: 'object'
  },
  
  ia: {
    provider: 'string',
    respostaIA: 'string',
    respostaReconstituida: 'string',
    timestamp: 'ISO8601'
  },
  
  export: {
    formatos: 'array',
    caminhos: 'array'
  },
  
  status: 'created | uploading | classifying | anonymizing | analyzing | completed | error',
  versao: 'string'
}
```

**Entregáveis:**
- [ ] storage/session-manager.js
- [ ] storage/schema.js
- [ ] Classe SessionManager com CRUD
- [ ] Schema documentado

**Critérios de Aceitação:**
- ✅ SessionId único e rastreável
- ✅ Salva/carrega corretamente
- ✅ Mantém compatibilidade com dados do IPAS
- ✅ Campos novos (LGPD, IA) adicionados

---

#### T1.5 - Upload UI Básica (3h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar popup inicial simples
- Input file + botão de processar
- Integrar com PdfReader e SessionManager
- Loading states básicos

**Entregáveis:**
- [ ] ui/upload/upload.html
- [ ] ui/upload/upload.css
- [ ] ui/upload/upload.js
- [ ] Integração E2E: File → PdfReader → Classifier → Storage

**Estrutura:**
```html
<!-- ui/upload/upload.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IA Análise Jurídica</title>
  <link rel="stylesheet" href="upload.css">
</head>
<body>
  <div class="container">
    <h1>📄 IA Análise Jurídica</h1>
    
    <div class="upload-area">
      <input type="file" id="pdfInput" accept=".pdf" />
      <label for="pdfInput">Escolher PDF</label>
      
      <div id="fileName"></div>
      <div id="status"></div>
    </div>
    
    <button id="processBtn" disabled>Processar e Analisar</button>
    
    <div id="progress" style="display:none">
      <div class="spinner"></div>
      <p id="progressText">Processando...</p>
    </div>
  </div>
  
  <script type="module" src="upload.js"></script>
</body>
</html>
```

```javascript
// ui/upload/upload.js
import { PdfReader } from '../../core/pdf-reader.js'
import { DocumentClassifier } from '../../core/document-classifier.js'
import { SessionManager } from '../../storage/session-manager.js'

const pdfInput = document.getElementById('pdfInput')
const processBtn = document.getElementById('processBtn')
const status = document.getElementById('status')
const progress = document.getElementById('progress')

let selectedFile = null

pdfInput.addEventListener('change', (e) => {
  selectedFile = e.target.files[0]
  
  if (selectedFile) {
    if (!selectedFile.type === 'application/pdf') {
      status.textContent = '❌ Apenas arquivos PDF são aceitos'
      return
    }
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      status.textContent = '❌ Arquivo muito grande (max 50MB)'
      return
    }
    
    document.getElementById('fileName').textContent = selectedFile.name
    processBtn.disabled = false
    status.textContent = '✅ Pronto para processar'
  }
})

processBtn.addEventListener('click', async () => {
  try {
    progress.style.display = 'block'
    processBtn.disabled = true
    
    // 1. Extrair texto
    document.getElementById('progressText').textContent = 'Extraindo texto do PDF...'
    const reader = new PdfReader()
    const { texto, numeroPaginas } = await reader.loadFromFile(selectedFile)
    
    // 2. Classificar
    document.getElementById('progressText').textContent = 'Classificando documento...'
    const classifier = new DocumentClassifier()
    const classificacao = classifier.classificar(texto)
    
    // 3. Criar sessão
    document.getElementById('progressText').textContent = 'Salvando...'
    const sessionManager = new SessionManager()
    const sessionId = await sessionManager.criar()
    
    await sessionManager.atualizar(sessionId, {
      documento: {
        nomeArquivo: selectedFile.name,
        tamanhoBytes: selectedFile.size,
        numeroPaginas,
        textoPeticao: texto,
        classificacao
      },
      status: 'classified'
    })
    
    // 4. Próximo: LGPD (Sprint 2)
    status.textContent = `✅ Documento processado! Tipo: ${classificacao.tipoId}`
    
    // DEBUG
    console.log('Session criada:', sessionId)
    console.log('Classificação:', classificacao)
    
  } catch (error) {
    console.error(error)
    status.textContent = `❌ Erro: ${error.message}`
  } finally {
    progress.style.display = 'none'
  }
})
```

**Critérios de Aceitação:**
- ✅ Upload de PDF funciona
- ✅ Validação de tipo e tamanho
- ✅ Fluxo E2E: Upload → Extração → Classificação → Storage
- ✅ Feedback visual claro

---

## Sprint 1 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Extensão carrega sem erros
- [ ] PDF local é processado corretamente
- [ ] Classificação funciona (10 tipos do IPAS)
- [ ] Dados salvos em chrome.storage.local
- [ ] Console mostra logs estruturados
- [ ] Código revisado e documentado

**Entrega:** Base funcional com 70% do código reutilizado do IPAS

---

<a id="sprint-2-anonimização-lgpd"></a>
## Sprint 2: Anonimização LGPD

**Objetivo:** Implementar sistema de anonimização de dados sensíveis

**Duração:** 32h | **Prioridade:** Crítica | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T2.1 - LGPD Schemas (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Definir campos sensíveis por tipo de documento
- Criar regex patterns para detecção
- Aproveitar tipos do IPAS (10 tipos já conhecidos)
- Adicionar tipos de documentos oficiais

**Entregáveis:**
- [ ] core/lgpd-schemas.js
- [ ] Schemas para 10 tipos de petição (do IPAS)
- [ ] Schemas para documentos oficiais
- [ ] Patterns testados com documentos reais

**Exemplo:**
```javascript
// core/lgpd-schemas.js
export const LGPD_SCHEMAS = {
  // PETIÇÕES (aproveitando tipos do IPAS)
  'pet_recurso_indeferimento': {
    camposSensiveis: [
      { campo: 'numeroProcesso', regex: /\b\d{9}\b/g, tipo: 'processo' },
      { campo: 'numeroPeticao', regex: /petição.*?(\d{12})/gi, tipo: 'peticao' },
      { campo: 'titular', regex: /(titular|requerente)[:\s]+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)/gi, tipo: 'nome' },
      { campo: 'cnpj', regex: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, tipo: 'cnpj' },
      { campo: 'cpf', regex: /\d{3}\.\d{3}\.\d{3}-\d{2}/g, tipo: 'cpf' },
      { campo: 'marca', regex: /marca[:\s]+"?([^"\n]+)"?/gi, tipo: 'marca' },
      { campo: 'advogado', regex: /advogad[oa][:\s]+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)/gi, tipo: 'nome' },
      { campo: 'oab', regex: /OAB[\/\s-]+[A-Z]{2}[\/\s-]+\d+/gi, tipo: 'oab' }
    ]
  },
  
  'pet_oposicao': {
    camposSensiveis: [
      { campo: 'numeroProcesso', regex: /\b\d{9}\b/g, tipo: 'processo' },
      { campo: 'processoOposto', regex: /processo oposto.*?(\d{9})/gi, tipo: 'processo' },
      { campo: 'oponente', regex: /oponente[:\s]+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)/gi, tipo: 'nome' },
      { campo: 'cnpj', regex: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/g, tipo: 'cnpj' },
      { campo: 'marca', regex: /marca[:\s]+"?([^"\n]+)"?/gi, tipo: 'marca' }
    ]
  },
  
  // ... mais 8 tipos de petição do IPAS
  
  // DOCUMENTOS OFICIAIS
  'doc_oficial_despacho_decisorio': {
    camposSensiveis: [
      { campo: 'numeroProcesso', regex: /processo.*?(\d{9})/gi, tipo: 'processo' },
      { campo: 'titular', regex: /titular[:\s]+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)/gi, tipo: 'nome' },
      { campo: 'marca', regex: /marca[:\s]+"?([^"\n]+)"?/gi, tipo: 'marca' }
    ]
  },
  
  'doc_oficial_notificacao_exigencia': {
    camposSensiveis: [
      { campo: 'numeroProcesso', regex: /processo.*?(\d{9})/gi, tipo: 'processo' },
      { campo: 'titular', regex: /titular[:\s]+([A-ZÁÉÍÓÚÂÊÔÃÕÇ\s]+)/gi, tipo: 'nome' },
      { campo: 'prazo', regex: /prazo.*?(\d+\s+dias)/gi, tipo: 'prazo' }
    ]
  }
}

// Helper para obter schema por tipo
export function obterSchema(tipoId) {
  return LGPD_SCHEMAS[tipoId] || LGPD_SCHEMAS['generico']
}
```

**Critérios de Aceitação:**
- ✅ Regex detecta 95%+ dos casos reais
- ✅ Sem falsos positivos críticos
- ✅ Cobertura: processo, nome, CPF, CNPJ, marca, OAB
- ✅ Schema para todos os 10 tipos do IPAS

---

#### T2.2 - Code Generator (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Gerar códigos aleatórios únicos
- Formato: TIPO_XXXXXXXX (8 chars alfanuméricos)
- Garantir unicidade dentro da sessão
- Rastreabilidade para debug

**Entregáveis:**
- [ ] core/code-generator.js
- [ ] Classe CodeGenerator
- [ ] Validação de unicidade
- [ ] Logging para auditoria

**Implementação:**
```javascript
// core/code-generator.js
export class CodeGenerator {
  constructor() {
    this.codigosGerados = new Set()
  }
  
  gerar(tipo) {
    let tentativas = 0
    let codigo
    
    do {
      codigo = this._gerarCodigo(tipo)
      tentativas++
      
      if (tentativas > 100) {
        throw new Error('Não foi possível gerar código único')
      }
    } while (this.codigosGerados.has(codigo))
    
    this.codigosGerados.add(codigo)
    return codigo
  }
  
  _gerarCodigo(tipo) {
    const prefixos = {
      'processo': 'PROC',
      'peticao': 'PET',
      'nome': 'PESSOA',
      'cnpj': 'CNPJ',
      'cpf': 'CPF',
      'marca': 'MARCA',
      'oab': 'OAB',
      'prazo': 'PRAZO'
    }
    
    const prefixo = prefixos[tipo] || 'ANONIMO'
    const sufixo = this._gerarAlfanumerico(8)
    
    return `${prefixo}_${sufixo}`
  }
  
  _gerarAlfanumerico(tamanho) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let resultado = ''
    
    for (let i = 0; i < tamanho; i++) {
      resultado += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return resultado
  }
  
  reset() {
    this.codigosGerados.clear()
  }
}
```

**Critérios de Aceitação:**
- ✅ Códigos únicos (zero colisões em 1000 gerações)
- ✅ Formato consistente TIPO_XXXXXXXX
- ✅ Entropia suficiente (8 chars)
- ✅ Performance < 1ms por código

---

#### T2.3 - LGPD Anonymizer (12h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Motor de anonimização
- Extrai valores dos campos sensíveis via regex
- Gera códigos e mapa de substituição
- Cria texto anonimizado
- Auditoria completa

**Entregáveis:**
- [ ] core/lgpd-anonymizer.js
- [ ] Classe Anonymizer
- [ ] Método anonimizar()
- [ ] Log de auditoria detalhado

**Implementação:**
```javascript
// core/lgpd-anonymizer.js
import { obterSchema } from './lgpd-schemas.js'
import { CodeGenerator } from './code-generator.js'

export class LGPDAnonymizer {
  constructor() {
    this.codeGenerator = new CodeGenerator()
  }
  
  anonimizar(texto, tipoDocumento) {
    console.log(`[LGPD] Iniciando anonimização para tipo: ${tipoDocumento}`)
    
    const schema = obterSchema(tipoDocumento)
    if (!schema) {
      console.warn(`[LGPD] Schema não encontrado para ${tipoDocumento}`)
      return { textoAnonimizado: texto, mapaSubstituicao: {}, metadata: {} }
    }
    
    const mapa = {}
    let textoAnonimizado = texto
    let totalSubstituicoes = 0
    const tiposProtegidos = new Set()
    
    // Processar cada campo sensível
    for (const campo of schema.camposSensiveis) {
      const matches = [...texto.matchAll(campo.regex)]
      
      console.log(`[LGPD] Campo ${campo.campo}: ${matches.length} matches`)
      
      for (const match of matches) {
        const valorOriginal = match[1] || match[0]
        const valorTrimmed = valorOriginal.trim()
        
        // Evitar duplicatas
        if (Object.values(mapa).includes(valorTrimmed)) {
          const codigoExistente = Object.keys(mapa).find(k => mapa[k] === valorTrimmed)
          textoAnonimizado = textoAnonimizado.replace(valorOriginal, codigoExistente)
          continue
        }
        
        // Gerar código único
        const codigo = this.codeGenerator.gerar(campo.tipo)
        
        // Salvar no mapa
        mapa[codigo] = valorTrimmed
        
        // Substituir no texto
        textoAnonimizado = textoAnonimizado.replace(valorOriginal, codigo)
        
        totalSubstituicoes++
        tiposProtegidos.add(campo.tipo)
      }
    }
    
    const metadata = {
      totalSubstituicoes,
      tiposProtegidos: Array.from(tiposProtegidos),
      algoritmo: 'regex-v1',
      timestamp: new Date().toISOString()
    }
    
    console.log(`[LGPD] Anonimização concluída: ${totalSubstituicoes} substituições`)
    console.log(`[LGPD] Tipos protegidos:`, metadata.tiposProtegidos)
    
    return {
      textoAnonimizado,
      mapaSubstituicao: mapa,
      metadata
    }
  }
  
  // Validação crítica: garantir que nenhum dado sensível vazou
  validarAnonimizacao(textoAnonimizado, tipoDocumento) {
    const schema = obterSchema(tipoDocumento)
    const vazamentos = []
    
    for (const campo of schema.camposSensiveis) {
      const matches = [...textoAnonimizado.matchAll(campo.regex)]
      
      if (matches.length > 0) {
        vazamentos.push({
          campo: campo.campo,
          tipo: campo.tipo,
          quantidade: matches.length,
          exemplos: matches.slice(0, 3).map(m => m[0])
        })
      }
    }
    
    if (vazamentos.length > 0) {
      console.error('[LGPD] ⚠️ VAZAMENTO DE DADOS DETECTADO!', vazamentos)
      throw new Error('Anonimização falhou: dados sensíveis ainda presentes no texto')
    }
    
    console.log('[LGPD] ✅ Validação OK: nenhum vazamento detectado')
    return true
  }
}
```

**Critérios de Aceitação:**
- ✅ Detecta todos campos sensíveis do schema
- ✅ Substituição não quebra formatação
- ✅ Mapa permite reconstrução 100% precisa
- ✅ Validação anti-vazamento implementada
- ✅ Metadata de auditoria completa

---

#### T2.4 - LGPD Mapper (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Gerenciador de mapa de substituições
- Salvamento/carregamento seguro no storage
- Funções de substituição bidirecional
- Limpeza automática

**Entregáveis:**
- [ ] core/lgpd-mapper.js
- [ ] Classe LGPDMapper
- [ ] Métodos: salvar, carregar, reconstituir

**Implementação:**
```javascript
// core/lgpd-mapper.js
export class LGPDMapper {
  static async salvarMapa(sessionId, mapa) {
    // Salva APENAS em storage.local (NUNCA sync)
    const chave = `${sessionId}_lgpd_map`
    await chrome.storage.local.set({ [chave]: mapa })
    
    console.log(`[LGPDMapper] Mapa salvo: ${Object.keys(mapa).length} substituições`)
  }
  
  static async carregarMapa(sessionId) {
    const chave = `${sessionId}_lgpd_map`
    const result = await chrome.storage.local.get(chave)
    
    if (!result[chave]) {
      throw new Error(`Mapa LGPD não encontrado para sessão ${sessionId}`)
    }
    
    return result[chave]
  }
  
  static reconstituirOriginal(textoAnonimizado, mapa) {
    let textoFinal = textoAnonimizado
    
    // Substituir códigos por valores reais
    for (const [codigoAnonimo, valorReal] of Object.entries(mapa)) {
      // Usar regex global para pegar todas ocorrências
      const regex = new RegExp(codigoAnonimo, 'g')
      textoFinal = textoFinal.replace(regex, valorReal)
    }
    
    return textoFinal
  }
  
  static async limparMapa(sessionId) {
    const chave = `${sessionId}_lgpd_map`
    await chrome.storage.local.remove(chave)
    
    console.log(`[LGPDMapper] Mapa removido para sessão ${sessionId}`)
  }
}
```

**Critérios de Aceitação:**
- ✅ Mapa salvo apenas em storage.local (nunca sync)
- ✅ Reconstrução é inversa perfeita da anonimização
- ✅ Performance: < 1s para textos até 10KB
- ✅ Limpeza funciona corretamente

---

#### T2.5 - Preview UI (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Tela de preview do texto anonimizado
- Mostrar estatísticas (quantos dados protegidos)
- Confirmação antes de enviar para IA
- Opção de cancelar

**Entregáveis:**
- [ ] ui/preview/preview.html
- [ ] ui/preview/preview.css
- [ ] ui/preview/preview.js
- [ ] Integração com upload.js

**Estrutura:**
```html
<!-- ui/preview/preview.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Preview - Anonimização LGPD</title>
  <link rel="stylesheet" href="preview.css">
</head>
<body>
  <div class="container">
    <h1>🔒 Proteção LGPD</h1>
    
    <div class="stats">
      <div class="stat">
        <strong id="totalSubs">0</strong>
        <span>dados protegidos</span>
      </div>
      <div class="stat">
        <strong id="tiposProtegidos">-</strong>
        <span>tipos diferentes</span>
      </div>
    </div>
    
    <div class="preview-box">
      <h3>Preview do Texto Anonimizado</h3>
      <p class="info">Primeiras linhas (dados sensíveis substituídos por códigos):</p>
      <pre id="textoPreview"></pre>
    </div>
    
    <div class="warning">
      ⚠️ <strong>Nenhum dado sensível será enviado para a IA.</strong>
      Apenas códigos aleatórios serão transmitidos.
    </div>
    
    <div class="actions">
      <button id="voltarBtn" class="secondary">Voltar</button>
      <button id="confirmarBtn" class="primary">✅ Confirmar e Enviar para IA</button>
    </div>
  </div>
  
  <script type="module" src="preview.js"></script>
</body>
</html>
```

**Critérios de Aceitação:**
- ✅ Usuário vê texto anonimizado antes de enviar
- ✅ Estatísticas claras (15 dados protegidos)
- ✅ Botões "Voltar" e "Confirmar" funcionais
- ✅ Preview mostra primeiras 20 linhas do texto

---

## Sprint 2 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Testes com 10+ documentos reais
- [ ] Taxa de detecção > 95%
- [ ] Zero vazamentos em testes (validação anti-vazamento)
- [ ] Preview funcional e intuitivo
- [ ] Auditoria LGPD completa

**Entrega:** Sistema LGPD completo e auditado

---

<a id="sprint-3-integração-ia"></a>
## Sprint 3: Integração IA

**Objetivo:** Implementar envio para IA e captura de resposta

**Duração:** 36h | **Prioridade:** Alta | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T3.1 - AI Config UI (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Página de configuração em options
- Select de IA (Gemini, ChatGPT, Claude, Outro)
- Campo para URL customizada
- Preferências (confirmar antes enviar, histórico)
- Salvamento em chrome.storage.sync

**Entregáveis:**
- [ ] ui/config/ai-config.html
- [ ] ui/config/ai-config.css
- [ ] ui/config/ai-config.js
- [ ] Integração com manifest.json (options_page)

**Critérios de Aceitação:**
- ✅ Select funciona, default = Gemini
- ✅ URL customizada validada
- ✅ Configurações persistem em storage.sync
- ✅ Reset de configurações funciona

---

#### T3.2 - Prompt Templates (8h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar prompts especializados por tipo de documento
- Aproveitar os 10 tipos do IPAS
- Templates com placeholders
- Sistema de variáveis

**Entregáveis:**
- [ ] ai-integration/prompts/templates.js
- [ ] ai-integration/prompts/builder.js
- [ ] 10+ templates (um para cada tipo do IPAS)

**Implementação:**
```javascript
// ai-integration/prompts/templates.js
export const PROMPTS = {
  'pet_recurso_indeferimento': (textoAnonimizado) => `
Você é um especialista em Propriedade Industrial (marcas e patentes).

Analise a **petição de recurso contra indeferimento** abaixo e forneça:

## 📋 Resumo Executivo
(máx. 3 parágrafos com visão geral da petição)

## 🎯 Argumentos Principais
(listar os argumentos centrais levantados pelo recorrente)

## ⚖️ Fundamentação Legal
(normas, leis, resoluções citadas)

## 📚 Precedentes
(casos anteriores, jurisprudência, decisões administrativas)

## ✅ Pontos Fortes
(aspectos bem fundamentados, argumentos sólidos)

## ⚠️ Pontos Fracos
(lacunas, argumentos frágeis, riscos)

## 💡 Recomendações
(sugestões de análise, pontos a investigar, estratégia)

---

**PETIÇÃO (dados anonimizados para LGPD):**

${textoAnonimizado}

---

**IMPORTANTE:** Os dados neste documento foram anonimizados para proteção de privacidade conforme LGPD. 
Códigos como PROC_XXXXXXXX, PESSOA_XXXXXXXX, MARCA_XXXXXXXX representam dados reais que foram substituídos.
Foque na análise técnica e jurídica, não tente identificar partes ou processos.
`,

  'pet_oposicao': (textoAnonimizado) => `
Você é um especialista em Propriedade Industrial.

Analise esta **petição de oposição** e forneça:

## 📋 Resumo da Oposição
## 🎯 Fundamentos Invocados
## ⚖️ Base Legal
## 🔍 Similaridade entre Marcas
## ✅ Chances de Procedência
## 💡 Recomendações

**PETIÇÃO:**
${textoAnonimizado}

**Dados anonimizados conforme LGPD.**
`,

  'pet_manifestacao': (textoAnonimizado) => `
Você é um especialista em Propriedade Industrial.

Analise esta **manifestação** e forneça:

## 📋 Resumo
## 🎯 Objeto da Manifestação
## 📝 Argumentos Apresentados
## ⚖️ Fundamentação
## 💡 Recomendações

**MANIFESTAÇÃO:**
${textoAnonimizado}

**Dados anonimizados conforme LGPD.**
`,

  // ... mais 7 tipos de petição do IPAS
  
  'doc_oficial_despacho_decisorio': (textoAnonimizado) => `
Você é um especialista em Propriedade Industrial.

Analise este **despacho decisório** do INPI e forneça:

## 📋 Resumo da Decisão
## ⚖️ Dispositivo (provido, desprovido, parcialmente provido)
## 🎯 Fundamentos da Decisão
## 📅 Prazos Relevantes
## 📝 Exigências (se houver)
## 🔄 Próximas Ações Sugeridas

**DESPACHO:**
${textoAnonimizado}

**Dados anonimizados conforme LGPD.**
`,

  'doc_oficial_notificacao_exigencia': (textoAnonimizado) => `
Você é um especialista em Propriedade Industrial.

Analise esta **notificação de exigência** e forneça:

## 📋 Resumo
## 📝 Exigências Listadas
## 📅 Prazo para Cumprimento
## 📄 Documentos/Informações Solicitados
## ✅ Checklist de Cumprimento
## 💡 Estratégia de Resposta

**NOTIFICAÇÃO:**
${textoAnonimizado}

**Dados anonimizados conforme LGPD.**
`
}

// ai-integration/prompts/builder.js
export class PromptBuilder {
  static construir(tipoDocumento, textoAnonimizado) {
    const template = PROMPTS[tipoDocumento]
    
    if (!template) {
      console.warn(`[PromptBuilder] Template não encontrado para ${tipoDocumento}, usando genérico`)
      return this._promptGenerico(textoAnonimizado)
    }
    
    return template(textoAnonimizado)
  }
  
  static _promptGenerico(textoAnonimizado) {
    return `
Você é um especialista em análise de documentos jurídicos.

Analise o documento abaixo e forneça:
- Resumo executivo
- Pontos principais
- Recomendações

**DOCUMENTO:**
${textoAnonimizado}

**Dados anonimizados conforme LGPD.**
`
  }
}
```

**Critérios de Aceitação:**
- ✅ Prompts claros e estruturados
- ✅ Template para cada tipo do IPAS
- ✅ Resultados consistentes em testes
- ✅ Disclaimer LGPD incluído

---

#### T3.3 - Gemini Provider (14h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Content script para Gemini
- Abrir/focar tab do Gemini
- Injetar prompt no editor
- Clicar em "Enviar"
- Monitorar resposta (MutationObserver)
- Extrair texto de `model-response .markdown`
- Enviar de volta ao background

**Entregáveis:**
- [ ] ai-integration/providers/gemini-provider.js
- [ ] ai-integration/providers/gemini-content-script.js
- [ ] Fluxo completo: envio → captura → retorno

**Implementação:**
(Código fornecido pelo usuário, já validado)

**Critérios de Aceitação:**
- ✅ Abre Gemini se não estiver aberto
- ✅ Foca tab se já estiver aberta
- ✅ Preenche e envia prompt
- ✅ Aguarda resposta (timeout 2min)
- ✅ Extrai texto corretamente
- ✅ Tratamento de erros (Gemini indisponível, etc.)

---

#### T3.4 - AI Gateway (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Orquestrador central de envio para IA
- Carrega configuração
- Seleciona provider correto
- Monta prompt
- Coordena fluxo completo

**Entregáveis:**
- [ ] ai-integration/gateway.js
- [ ] Classe AIGateway
- [ ] Integração com session storage

**Critérios de Aceitação:**
- ✅ Orquestração completa funciona
- ✅ Timeout configurável
- ✅ Retry em caso de falha
- ✅ Salvamento automático

---

#### T3.5 - Message Passing (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Sistema de mensagens entre background e content scripts
- Protocolo de comunicação
- Handlers de eventos

**Entregáveis:**
- [ ] Protocolo documentado
- [ ] Handlers no service worker
- [ ] Handlers nos content scripts

**Critérios de Aceitação:**
- ✅ Comunicação bidirecional funciona
- ✅ Tratamento de erros
- ✅ Timeout de mensagens

---

## Sprint 3 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Fluxo E2E: Upload → LGPD → IA → Resposta funciona
- [ ] Testado com Gemini real
- [ ] Tratamento de erros robusto
- [ ] Prompts geram análises úteis

**Entrega:** Integração completa com IA funcional

---

<a id="sprint-4-resultado-e-export"></a>
## Sprint 4: Resultado e Export

**Objetivo:** Exibir resultado e permitir exportação

**Duração:** 18h (vs 24h original) | **Prioridade:** Alta | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T4.1 - Text Reconstructor (3h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Reconstruir dados originais na resposta da IA
- Reutilizar LGPDMapper.reconstituirOriginal()
- Manter formatação

**Entregáveis:**
- [ ] core/text-reconstructor.js (wrapper sobre LGPDMapper)
- [ ] Validação de reconstrução

**Critérios de Aceitação:**
- ✅ Reconstrução 100% precisa
- ✅ Performance: < 1s
- ✅ Não quebra formatação Markdown

---

#### T4.2 - Result UI (8h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Página de exibição do resultado
- Seções: Resumo, Argumentos, Fundamentação, etc.
- Metadata: tipo doc, IA usada, timestamp

**Entregáveis:**
- [ ] ui/result/result.html
- [ ] ui/result/result.css
- [ ] ui/result/result.js
- [ ] Formatação Markdown renderizada

**Critérios de Aceitação:**
- ✅ Layout claro e profissional
- ✅ Markdown renderizado (headings, lists, etc.)
- ✅ Responsivo
- ✅ Metadata visível

---

#### T4.3 - Export MD e DOCX (4h) - OTIMIZADO
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Salvar análise em arquivo .md e .docx
- Reutilizar FileSaver.js e html-docx.js do IPAS
- Template formatado

**Entregáveis:**
- [ ] core/exporters/md-exporter.js
- [ ] core/exporters/docx-exporter.js (reutiliza lib do IPAS)

**Critérios de Aceitação:**
- ✅ MD salvo com formatação correta
- ✅ DOCX abre no Word
- ✅ Metadata incluída

---

#### T4.4 - Copy to Clipboard (1h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Botão "Copiar análise"
- Usar Clipboard API
- Feedback visual

**Entregáveis:**
- [ ] Função copyToClipboard()
- [ ] Toast de confirmação

**Critérios de Aceitação:**
- ✅ Copia texto completo
- ✅ Feedback "Copiado!" visível

---

#### T4.5 - Histórico de Sessões (2h) - BONUS
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Listar análises anteriores
- Reabrir sessão
- Limpeza manual

**Entregáveis:**
- [ ] ui/history/history.html
- [ ] Integração com SessionManager.listar()

**Critérios de Aceitação:**
- ✅ Lista sessões por data
- ✅ Clique abre resultado anterior

---

## Sprint 4 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Resultado exibido corretamente
- [ ] Exports MD e DOCX funcionam
- [ ] UX polida

**Entrega:** Fluxo completo de resultado e export

---

<a id="sprint-5-polimento"></a>
## Sprint 5: Polimento

**Objetivo:** Refinamento, testes e documentação

**Duração:** 12h (vs 16h original) | **Prioridade:** Média | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T5.1 - Error Handling (3h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Tratamento robusto de erros em todos fluxos
- Mensagens claras e acionáveis
- Recovery automático quando possível

**Entregáveis:**
- [ ] Try-catch em funções críticas
- [ ] Mensagens de erro amigáveis
- [ ] Logs estruturados

---

#### T5.2 - Loading States (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Indicadores de progresso em todas operações > 1s
- Spinners, progress bars
- Feedback visual consistente

**Entregáveis:**
- [ ] Loading spinners
- [ ] Progress bars (upload, processamento)
- [ ] Skeleton screens

---

#### T5.3 - Testes E2E (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Testes manuais de fluxo completo
- Validação com 10+ PDFs reais (usar tipos do IPAS)
- Checklist de QA

**Entregáveis:**
- [ ] Checklist de testes
- [ ] Relatório de bugs encontrados
- [ ] Bugs corrigidos

---

#### T5.4 - Documentação (2h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- README completo
- Guia de uso
- Troubleshooting

**Entregáveis:**
- [ ] README.md atualizado
- [ ] USER_GUIDE.md
- [ ] TROUBLESHOOTING.md

---

#### T5.5 - Tutorial/Onboarding (1h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Tutorial na primeira vez
- Tooltips explicativos

**Entregáveis:**
- [ ] Overlay tutorial
- [ ] Tooltips em elementos-chave

---

## Sprint 5 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Zero bugs críticos
- [ ] Documentação completa
- [ ] Ready for launch

**Entrega:** Produto pronto para lançamento

---

## 📈 Métricas de Acompanhamento

### Por Sprint

| Sprint | Planejado (h) | Real (h) | Variação | Status |
|--------|---------------|----------|----------|--------|
| Sprint 1 | 12 | - | - | PENDENTE |
| Sprint 2 | 32 | - | - | PENDENTE |
| Sprint 3 | 36 | - | - | PENDENTE |
| Sprint 4 | 18 | - | - | PENDENTE |
| Sprint 5 | 12 | - | - | PENDENTE |
| **Total** | **110** | **-** | **-** | **0%** |

### Comparação com Planejamento Original

| Métrica | Original | Otimizado | Ganho |
|---------|----------|-----------|-------|
| Total de Horas | 148h | 110h | **-38h (26%)** |
| Sprint 1 | 40h | 12h | **-28h (70%)** |
| Sprint 2 | 32h | 32h | 0h |
| Sprint 3 | 36h | 36h | 0h |
| Sprint 4 | 24h | 18h | -6h (25%) |
| Sprint 5 | 16h | 12h | -4h (25%) |

---

## 🎯 Milestones

| Milestone | Data Target | Status | Critérios |
|-----------|-------------|--------|-----------|
| M1: Base Migrada | 05/02/2026 | PENDENTE | Sprint 1 completo |
| M2: LGPD Funcional | 20/02/2026 | PENDENTE | Sprint 2 completo |
| M3: IA Integration | 10/03/2026 | PENDENTE | Sprint 3 completo |
| M4: MVP Completo | 25/03/2026 | PENDENTE | Sprint 4 completo |
| M5: Launch Alpha | 01/04/2026 | PENDENTE | Sprint 5 completo |

---

## 🔄 Backlog (pós v1.0)

### Features Futuras

- [ ] **Multi-IA:** Suporte ChatGPT e Claude (v1.1) - 20h
- [ ] **Histórico Avançado:** Busca, filtros, tags (v1.1) - 12h
- [ ] **Templates Customizáveis:** Usuário edita prompts (v1.2) - 16h
- [ ] **Batch Processing:** Processar múltiplos PDFs (v1.2) - 24h
- [ ] **Análise Comparativa:** 2+ documentos juntos (v2.0) - 32h
- [ ] **API Externa:** Integração com sistemas (v2.0) - 40h
- [ ] **OCR:** Suporte para PDFs escaneados (v2.1) - 48h

### Tech Debt

- [ ] Testes automatizados (unit + integration) - 24h
- [ ] CI/CD pipeline - 8h
- [ ] Monitoramento de erros (Sentry) - 4h
- [ ] Performance profiling - 8h

---

## 📝 Notas de Implementação

### Arquivos do IPAS a Reutilizar

| Arquivo Original | Destino | Tipo de Reuso |
|------------------|---------|---------------|
| `content/ipas/pdf_reader.js` | `core/pdf-reader.js` | 98% cópia + adaptação File API |
| `content/ipas/peticao_processor.js` | `core/document-classifier.js` | 80% cópia + refatoração para classe |
| `content/ipas/peticao_storage.js` | `storage/session-manager.js` | 70% cópia + schema estendido |
| `lib/pdfjs/` | `lib/pdfjs/` | 100% cópia direta |
| `lib/FileSaver.min.js` | `lib/FileSaver.min.js` | 100% cópia direta |
| `lib/html-docx.js` | `lib/html-docx.js` | 100% cópia direta |

### Decisões Técnicas

1. **Por que migrar ao invés de fork?**
   - Extensão precisa ser standalone
   - Evitar dependências circulares
   - Permite evolução independente

2. **Por que manter switch do IPAS?**
   - 10 tipos já testados e funcionando
   - Economiza ~10h de desenvolvimento
   - Código maduro e confiável

3. **Por que não usar APIs diretas das IAs?**
   - Evitar custos de API
   - Aproveitar free tiers das interfaces web
   - Maior flexibilidade para trocar de IA

---

## ✅ Checklist de Início

Antes de começar o desenvolvimento:

- [ ] Este TASKS_OTIMIZADO.md revisado e aprovado
- [ ] PRD.md e ARQUITETURA.md atualizados
- [ ] Ambiente de desenvolvimento configurado
- [ ] Git configurado (branch main)
- [ ] Chrome Developer Mode ativado
- [ ] Acesso aos arquivos do IPAS confirmado
- [ ] PDFs de teste separados (10 tipos diferentes)

---

**Última atualização:** 26/01/2026  
**Próxima revisão:** Início de cada Sprint

---

## 🚀 Como Usar Este Documento

1. **Seguir ordem dos Sprints:** Não pular etapas
2. **Marcar progresso:** Atualizar checkboxes conforme avança
3. **Documentar desvios:** Se algo mudar, anotar aqui
4. **Revisar semanalmente:** Ajustar estimativas se necessário
5. **Celebrar milestones:** Cada Sprint concluído é uma vitória!

**Boa sorte! 🎉**

O arquivo abaixo contem um projeto que vai ser iniciado do zero. No entanto parte da sulução já existe em D:\Informatica\Extensao_Diversos\BW&Ipas_Projetos\IpasExtensao\auxiliar\guiasCodigos\pdf_2._QUICK_START.md

Abaixo o projeto À ser implementado:
D:\Informatica\Extensao_Diversos\BW&Ipas_Projetos\IpasExtensao\ExrtensãoPatentesMarca\ExtensaoPatente-Marca\TASKS.md

Se achar que precisa de mais informações ou tem sugestões de arquiteura melhor, pode se manifestar.

 # 📋 TASKS - IA Análise Jurídica

**Projeto:** Extensão Chrome independente para análise de PDFs com IA  
**Total de Horas Estimadas:** 148 horas  
**Data de Atualização:** 26/01/2026  
**Desenvolvedor:** 1 pessoa

---

## 📊 Resumo Executivo

### Estatísticas Gerais

- **Sprints:** 5
- **Tasks Principais:** 25
- **Progresso Geral:** 0% (planejamento)
- **Tasks Concluídas:** 0/25
- **Tasks em Progresso:** 0/25
- **Tasks Pendentes:** 25/25

### Distribuição de Horas por Sprint

| Sprint | Horas | % Total | Progresso | Status |
|--------|-------|---------|-----------|--------|
| [Sprint 1: Infraestrutura Base](#sprint-1-infraestrutura-base) | 40h | 27% | 0% | PENDENTE |
| [Sprint 2: Anonimização LGPD](#sprint-2-anonimização-lgpd) | 32h | 22% | 0% | PENDENTE |
| [Sprint 3: Integração IA](#sprint-3-integração-ia) | 36h | 24% | 0% | PENDENTE |
| [Sprint 4: Resultado e Export](#sprint-4-resultado-e-export) | 24h | 16% | 0% | PENDENTE |
| [Sprint 5: Polimento](#sprint-5-polimento) | 16h | 11% | 0% | PENDENTE |

---

## 🎯 Sprints Detalhados

<a id="sprint-1-infraestrutura-base"></a>
## Sprint 1: Infraestrutura Base

**Objetivo:** Criar estrutura básica da extensão e fluxo de upload/extração de PDF

**Duração:** 40h | **Prioridade:** Alta | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T1.1 - Estrutura do Projeto (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar nova extensão (separada do IPAS)
- Estrutura de diretórios conforme arquitetura
- manifest.json base (Manifest V3)
- Configurar permissões (storage, tabs)
- Setup básico do service worker

**Entregáveis:**
- [ ] Estrutura de diretórios completa
- [ ] manifest.json configurado
- [ ] background/service-worker.js base
- [ ] README.md da extensão

**Arquivos criados:**
```
ExtensaoIA/
├── manifest.json
├── background/
│   └── service-worker.js
├── ui/
├── core/
├── ai-integration/
├── storage/
└── lib/
```

---

#### T1.2 - Upload UI (8h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar popup principal (upload.html)
- Design: drag-and-drop area
- File picker (fallback)
- Validação de arquivo (tipo, tamanho)
- Loading states

**Entregáveis:**
- [ ] ui/upload/upload.html
- [ ] ui/upload/upload.css
- [ ] ui/upload/upload.js
- [ ] Validação: apenas PDF, max 50MB
- [ ] UX: indicadores visuais claros

**Critérios de Aceitação:**
- ✅ Drag-and-drop funciona
- ✅ File picker funciona
- ✅ Aceita apenas .pdf
- ✅ Rejeita arquivos > 50MB com mensagem clara
- ✅ Loading spinner durante processamento

---

#### T1.3 - PDF Loader (12h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Copiar lib/pdfjs/ do IPAS
- Adaptar lógica de pdf_reader.js para arquivos locais
- Remover dependências de fetch/background
- Ler de File object
- Extrair texto página a página

**Entregáveis:**
- [ ] lib/pdfjs/ (copiado)
- [ ] core/pdf-loader.js
- [ ] Classe PdfLoader com método loadFromFile()
- [ ] Tratamento de erros (PDF corrompido, protegido)

**Reutilização:**
```javascript
// De: content/ipas/pdf_reader.js
// Adaptar para:
class PdfLoader {
  async loadFromFile(file) {
    // Retorna: { texto, numeroPaginas, metadata }
  }
}
```

**Critérios de Aceitação:**
- ✅ Extrai texto de PDF não-protegido
- ✅ Funciona offline (sem fetch)
- ✅ Retorna estrutura padronizada
- ✅ Erro claro se PDF protegido/corrompido

---

#### T1.4 - Document Classifier (10h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Adaptar content/ipas/pdf_classifier.js
- Tornar standalone (sem dependências IPAS)
- Criar schemas de classificação
- Retornar categoriaId, tipoId, subtipoId, confiança

**Entregáveis:**
- [ ] core/document-classifier.js
- [ ] Schemas de tipos (petição recurso, despacho, notificação)
- [ ] Heurísticas de detecção (regex)
- [ ] Score de confiança

**Tipos Iniciais (MVP):**
1. `pet_recurso_indeferimento`
2. `doc_oficial_despacho_decisorio`
3. `doc_oficial_notificacao_exigencia`
4. `desconhecido`

**Critérios de Aceitação:**
- ✅ Classifica corretamente 3 tipos principais
- ✅ Retorna score de confiança (0-1)
- ✅ Fallback para "desconhecido" se incerto

---

#### T1.5 - Session Storage Base (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar schema de sessão (conforme PRD)
- Funções CRUD básicas
- Geração de sessionId único
- Salvamento em chrome.storage.local

**Entregáveis:**
- [ ] storage/session-manager.js
- [ ] storage/schema.js
- [ ] Funções: criar(), salvar(), carregar(), listar()

**Schema Base:**
```javascript
{
  sessionId: "ai_session_${timestamp}_${randomId}",
  timestamp: ISO8601,
  documento: { ... },
  lgpd: { ... },
  ia: { ... },
  export: { ... },
  status: "uploading" | "processing" | "completed" | "error"
}
```

**Critérios de Aceitação:**
- ✅ SessionId único e rastreável
- ✅ Salva/carrega corretamente
- ✅ Validação de schema

---

## Sprint 1 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Extensão carrega sem erros
- [ ] Fluxo: Upload → Extração → Classificação → Storage funciona E2E
- [ ] Código revisado e documentado
- [ ] Testes manuais realizados

**Entrega:** Protótipo funcional de upload e processamento de PDF

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
- Categorizar tipos de dados (nome, CPF, CNPJ, processo, marca)

**Entregáveis:**
- [ ] core/lgpd-schemas.js
- [ ] Schemas para 3 tipos principais
- [ ] Patterns testados

**Exemplo:**
```javascript
export const LGPD_SCHEMAS = {
  'pet_recurso_indeferimento': {
    camposSensiveis: [
      { campo: 'numeroProcesso', regex: /\d{9}/, tipo: 'processo' },
      { campo: 'titular', regex: /titular[:\s]+([^\n]+)/i, tipo: 'nome' },
      { campo: 'cnpj', regex: /\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/, tipo: 'cnpj' },
      { campo: 'cpf', regex: /\d{3}\.\d{3}\.\d{3}-\d{2}/, tipo: 'cpf' },
      { campo: 'marca', regex: /marca[:\s]+"?([^"\n]+)"?/i, tipo: 'marca' }
    ]
  }
  // ... outros tipos
}
```

**Critérios de Aceitação:**
- ✅ Regex detecta 95%+ dos casos reais
- ✅ Sem falsos positivos críticos
- ✅ Cobertura: processo, nome, CPF, CNPJ, marca

---

#### T2.2 - Code Generator (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Gerar códigos aleatórios únicos
- Formato: TIPO_XXXXXXXX (8 chars alfanuméricos)
- Garantir unicidade dentro da sessão

**Entregáveis:**
- [ ] core/code-generator.js
- [ ] Função: gerar(tipo) → código
- [ ] Validação de unicidade

**Formatos:**
- Processo: `PROC_A8F3K2L9`
- Nome: `PESSOA_X7M2N4P1`
- CNPJ: `CNPJ_K9L3M5N2`
- CPF: `CPF_P4R7T9W1`
- Marca: `MARCA_M5N8Q2T4`

**Critérios de Aceitação:**
- ✅ Códigos únicos (verificar colisões)
- ✅ Formato consistente
- ✅ Entropia suficiente (8 chars)

---

#### T2.3 - LGPD Anonymizer (12h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Motor de anonimização
- Extrai valores dos campos sensíveis
- Gera códigos e mapa de substituição
- Cria texto anonimizado

**Entregáveis:**
- [ ] core/lgpd-anonymizer.js
- [ ] Classe Anonymizer com método anonimizar()
- [ ] Geração de mapa bidirecional
- [ ] Log de auditoria

**Fluxo:**
```javascript
class Anonymizer {
  anonimizar(texto, tipoDocumento) {
    // 1. Carrega schema do tipo
    // 2. Extrai valores via regex
    // 3. Gera códigos únicos
    // 4. Cria mapa substituição
    // 5. Substitui no texto
    // 6. Retorna { textoAnonimizado, mapa, metadata }
  }
}
```

**Critérios de Aceitação:**
- ✅ Detecta todos campos sensíveis do schema
- ✅ Substituição não quebra formatação
- ✅ Mapa permite reconstrução 100% precisa
- ✅ Metadata de auditoria completa

---

#### T2.4 - LGPD Mapper (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Gerenciador de mapa de substituições
- Salvamento/carregamento no storage
- Funções de substituição bidirecional

**Entregáveis:**
- [ ] core/lgpd-mapper.js
- [ ] salvarMapa(), carregarMapa()
- [ ] substituirParaAnonimo(), reconstituirOriginal()

**Critérios de Aceitação:**
- ✅ Mapa salvo apenas em storage.local (nunca sync)
- ✅ Substituição e reconstrução são inversas perfeitas
- ✅ Performance: < 1s para textos até 10KB

---

#### T2.5 - Preview UI (6h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Tela de preview do texto anonimizado
- Mostrar estatísticas (quantos dados protegidos)
- Confirmação antes de enviar para IA

**Entregáveis:**
- [ ] ui/preview/preview.html
- [ ] ui/preview/preview.css
- [ ] ui/preview/preview.js
- [ ] Diff visual (opcional): destacar substituições

**Critérios de Aceitação:**
- ✅ Usuário vê texto anonimizado antes de enviar
- ✅ Estatísticas claras (15 dados protegidos)
- ✅ Botões: "Voltar" e "Confirmar Envio"

---

## Sprint 2 - Checklist de Conclusão

- [ ] Todas as 5 tasks concluídas
- [ ] Testes com 10+ documentos reais
- [ ] Taxa de detecção > 95%
- [ ] Zero vazamentos em testes (auditoria)
- [ ] Preview funcional

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

**Entregáveis:**
- [ ] ui/config/ai-config.html
- [ ] ui/config/ai-config.css
- [ ] ui/config/ai-config.js
- [ ] Salvamento em chrome.storage.sync

**Critérios de Aceitação:**
- ✅ Select funciona, default = Gemini
- ✅ URL customizada validada
- ✅ Configurações persistem

---

#### T3.2 - Prompt Templates (8h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Criar prompts especializados por tipo de documento
- Templates com placeholders
- Sistema de variáveis

**Entregáveis:**
- [ ] ai-integration/prompts/templates.js
- [ ] ai-integration/prompts/builder.js
- [ ] 3+ templates (recurso, despacho, notificação)

**Exemplo:**
```javascript
const PROMPTS = {
  'pet_recurso_indeferimento': (texto) => `
Você é um especialista em Propriedade Industrial.

Analise a petição de recurso e forneça:
1. Resumo executivo (3 parágrafos)
2. Argumentos principais
3. Fundamentação legal citada
4. Pontos fortes/fracos
5. Recomendações

**PETIÇÃO:**
${texto}

**IMPORTANTE:** Dados anonimizados para LGPD.
`
};
```

**Critérios de Aceitação:**
- ✅ Prompts claros e estruturados
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

**Base:**
Reutilizar código fornecido pelo usuário:
```javascript
async function escreverEEnviar(texto) {
  const editor = document.querySelector('div[contenteditable="true"]');
  // ... (código fornecido)
}
```

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

**Fluxo:**
```javascript
class AIGateway {
  async analisar(sessionId) {
    // 1. Carrega sessão
    // 2. Pega texto anonimizado
    // 3. Carrega config IA
    // 4. Seleciona provider
    // 5. Constrói prompt
    // 6. Envia
    // 7. Captura resposta
    // 8. Salva em sessão
  }
}
```

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

**Entrega:** Integração completa com IA funcional

---

<a id="sprint-4-resultado-e-export"></a>
## Sprint 4: Resultado e Export

**Objetivo:** Exibir resultado e permitir exportação

**Duração:** 24h | **Prioridade:** Alta | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T4.1 - Text Reconstructor (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Reconstruir dados originais na resposta da IA
- Substituir códigos anônimos pelos valores reais
- Manter formatação

**Entregáveis:**
- [ ] core/text-reconstructor.js
- [ ] Função: reconstituir(respostaIA, sessionId)

**Critérios de Aceitação:**
- ✅ Reconstrução 100% precisa
- ✅ Performance: < 1s
- ✅ Não quebra formatação Markdown

---

#### T4.2 - Result UI (10h)
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

#### T4.3 - Export MD (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Salvar análise em arquivo .md
- Pasta: ExtensãoPatentesMarca/
- Nome: analise_YYYYMMDD_HHMMSS.md

**Entregáveis:**
- [ ] core/exporters/md-exporter.js
- [ ] Usar FileSaver.js (do IPAS)
- [ ] Template MD formatado

**Critérios de Aceitação:**
- ✅ Arquivo salvo corretamente
- ✅ Formatação preservada
- ✅ Metadata incluída (tipo, data, IA)

---

#### T4.4 - Export DOCX (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Salvar análise em arquivo .docx
- Usar html-docx.js (do IPAS)
- Formatação profissional

**Entregáveis:**
- [ ] core/exporters/docx-exporter.js
- [ ] Template DOCX
- [ ] Estilos (headings, lists, etc.)

**Critérios de Aceitação:**
- ✅ DOCX abre no Word/LibreOffice
- ✅ Formatação consistente
- ✅ Metadata incluída

---

#### T4.5 - Copy to Clipboard (2h)
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
- ✅ Funciona em diferentes OSs

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

**Duração:** 16h | **Prioridade:** Média | **Status:** PENDENTE | **Progresso:** 0%

### Tasks:

#### T5.1 - Error Handling (4h)
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

#### T5.2 - Loading States (3h)
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

#### T5.3 - Tutorial/Onboarding (4h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Tutorial na primeira vez
- Tooltips explicativos
- Documentação in-app

**Entregáveis:**
- [ ] Overlay tutorial
- [ ] Tooltips em elementos-chave
- [ ] Link para documentação completa

---

#### T5.4 - Testes E2E (3h)
**Status:** PENDENTE | **Progresso:** 0%

**Descrição:**
- Testes manuais de fluxo completo
- Validação com 10+ PDFs reais
- Checklist de QA

**Entregáveis:**
- [ ] Checklist de testes
- [ ] Relatório de bugs encontrados
- [ ] Bugs corrigidos

---

#### T5.5 - Documentação (2h)
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
| Sprint 1 | 40 | - | - | PENDENTE |
| Sprint 2 | 32 | - | - | PENDENTE |
| Sprint 3 | 36 | - | - | PENDENTE |
| Sprint 4 | 24 | - | - | PENDENTE |
| Sprint 5 | 16 | - | - | PENDENTE |
| **Total** | **148** | **-** | **-** | **0%** |

### Velocidade (atualizar semanalmente)

| Semana | Horas Trabalhadas | Tasks Concluídas | Progresso Acumulado |
|--------|-------------------|------------------|---------------------|
| 1 | - | - | 0% |
| 2 | - | - | 0% |
| ... | ... | ... | ... |

---

## 🎯 Milestones

| Milestone | Data Target | Status | Critérios |
|-----------|-------------|--------|-----------|
| M1: Protótipo Upload | 15/02/2026 | PENDENTE | Sprint 1 completo |
| M2: LGPD Funcional | 01/03/2026 | PENDENTE | Sprint 2 completo |
| M3: IA Integration | 15/03/2026 | PENDENTE | Sprint 3 completo |
| M4: MVP Completo | 01/04/2026 | PENDENTE | Sprint 4 completo |
| M5: Launch Alpha | 15/04/2026 | PENDENTE | Sprint 5 completo |
| M6: Launch v1.0 | 01/05/2026 | PENDENTE | Testes com usuários |

---

## 🔄 Backlog (pós v1.0)

### Features Futuras

- [ ] **Multi-IA:** Suporte ChatGPT e Claude (v1.1)
- [ ] **Histórico:** Lista de análises anteriores (v1.1)
- [ ] **Templates:** Customização de prompts pelo usuário (v1.2)
- [ ] **Batch:** Processar múltiplos PDFs de uma vez (v1.2)
- [ ] **Comparação:** Analisar 2+ documentos juntos (v2.0)
- [ ] **API:** Integração com sistemas externos (v2.0)
- [ ] **OCR:** Suporte para PDFs escaneados (v2.1)
- [ ] **i18n:** Tradução para inglês (v1.1)

### Tech Debt

- [ ] Testes automatizados (unit + integration)
- [ ] CI/CD pipeline
- [ ] Monitoramento de erros (Sentry ou similar)
- [ ] Performance profiling

---

## 📝 Notas

### Decisões Técnicas

1. **Por que não usar APIs diretas das IAs?**
   - Evitar custos de API
   - Aproveitar free tiers das interfaces web
   - Maior flexibilidade para trocar de IA

2. **Por que Manifest V3?**
   - Manifest V2 será descontinuado em 2024
   - Melhor performance e segurança

3. **Por que não usar framework (React/Vue)?**
   - Extensão simples, vanilla JS suficiente
   - Menor bundle size
   - Menos dependências

### Riscos Identificados

1. **Mudanças na UI das IAs:** Mitigação = abstração robusta, testes frequentes
2. **Performance em PDFs grandes:** Mitigação = limite 50 páginas, otimizações
3. **Classificação incorreta:** Mitigação = permitir correção manual

---

**Última atualização:** 26/01/2026  
**Próxima revisão:** Início de cada Sprint

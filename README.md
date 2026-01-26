# 📄 IA Análise Jurídica - Marcas e Patentes

Extensão Chrome standalone para análise automatizada de documentos jurídicos (petições e documentos oficiais) utilizando Inteligência Artificial com proteção LGPD.

## 🎯 Objetivo

Facilitar a análise de documentos de Propriedade Industrial através de:
- ✅ Upload e extração de texto de PDFs
- ✅ Classificação automática de documentos
- ✅ Anonimização de dados sensíveis (LGPD)
- ✅ Análise por IA especializada
- ✅ Exportação de resultados

## ⚡ Quick Start

### Instalação (Developer Mode)

1. Clone ou baixe este repositório
2. Abra Chrome e vá para `chrome://extensions/`
3. Ative "Modo do desenvolvedor" (canto superior direito)
4. Clique em "Carregar sem compactação"
5. Selecione a pasta do projeto

### Uso Básico

1. Clique no ícone da extensão
2. Faça upload de um PDF jurídico
3. Aguarde a classificação e anonimização
4. Confirme envio para IA
5. Receba análise detalhada
6. Exporte resultados (MD, DOCX)

## 📁 Estrutura do Projeto

```
ExtensaoPatente-Marca/
├── manifest.json               # Configuração da extensão
├── .gitignore
├── README.md
│
├── assets/
│   ├── css/                    # Estilos globais
│   └── images/                 # Ícones
│
├── lib/                        # Bibliotecas externas
│   ├── pdfjs/                  # PDF.js (copiado do IPAS)
│   ├── FileSaver.min.js        # Salvar arquivos
│   └── html-docx.js            # Converter HTML para DOCX
│
├── core/                       # Lógica principal
│   ├── pdf-reader.js           # Extração de texto (migrado do IPAS)
│   ├── document-classifier.js  # Classificação (refatorado do IPAS)
│   ├── lgpd-schemas.js         # Schemas de anonimização
│   ├── lgpd-anonymizer.js      # Motor de anonimização
│   ├── lgpd-mapper.js          # Gerenciamento de mapas
│   ├── code-generator.js       # Gerador de códigos anônimos
│   └── text-reconstructor.js   # Reconstrução de textos
│
├── storage/                    # Gerenciamento de dados
│   ├── session-manager.js      # CRUD de sessões (migrado do IPAS)
│   └── schema.js               # Schema de dados
│
├── ai-integration/             # Integração com IAs
│   ├── gateway.js              # Orquestrador central
│   ├── prompts/
│   │   ├── templates.js        # Templates de prompts
│   │   └── builder.js          # Construtor de prompts
│   └── providers/
│       ├── gemini-provider.js
│       └── gemini-content-script.js
│
├── ui/                         # Interface do usuário
│   ├── upload/                 # Tela de upload
│   │   ├── upload.html
│   │   ├── upload.css
│   │   └── upload.js
│   ├── preview/                # Preview LGPD
│   │   ├── preview.html
│   │   ├── preview.css
│   │   └── preview.js
│   ├── result/                 # Exibição de resultados
│   │   ├── result.html
│   │   ├── result.css
│   │   └── result.js
│   └── config/                 # Configurações
│       ├── ai-config.html
│       ├── ai-config.css
│       └── ai-config.js
│
└── background/                 # Service Worker
    └── service-worker.js
```

## 🛠️ Tecnologias Utilizadas

- **Chrome Extension Manifest V3**
- **PDF.js v3.x** - Extração de texto de PDFs
- **Chrome Storage API** - Persistência local
- **JavaScript ES6 Modules** - Organização de código
- **Markdown** - Formatação de resultados

## 🔒 Segurança LGPD

A extensão implementa proteção completa de dados sensíveis:

- ✅ Detecção automática de CPF, CNPJ, nomes, processos
- ✅ Substituição por códigos anônimos
- ✅ Armazenamento local apenas (nunca sync)
- ✅ Mapas de reconstituição protegidos
- ✅ Validação anti-vazamento

**Nenhum dado sensível é enviado para a IA.**

## 📊 Status do Projeto

**Versão:** 1.0.0 (em desenvolvimento)  
**Progresso:** Sprint 1 em andamento  

### Roadmap

- [x] Setup do projeto
- [ ] Migração de componentes do IPAS
- [ ] Sistema LGPD completo
- [ ] Integração com IA
- [ ] Exportação de resultados
- [ ] Polimento e testes

## 📖 Documentação

Para documentação completa, consulte:

- [TASKS_OTIMIZADO.md](TASKS_OTIMIZADO.md) - Planejamento e tasks
- [PRD.md](PRD.md) - Product Requirements
- [ARQUITETURA.md](ARQUITETURA.md) - Arquitetura técnica
- [DEV_GUIDE.md](DEV_GUIDE.md) - Guia de desenvolvimento

## 🤝 Contribuindo

Este é um projeto standalone. Para contribuir:

1. Revise a documentação técnica
2. Siga os padrões de código estabelecidos
3. Teste localmente antes de commitar
4. Documente mudanças relevantes

## 📝 Licença

Uso interno - Todos os direitos reservados

## 🆘 Suporte

Para problemas ou dúvidas, consulte:
- TASKS_OTIMIZADO.md (checklist de implementação)
- DEV_GUIDE.md (troubleshooting)

---

**Última atualização:** 26/01/2026

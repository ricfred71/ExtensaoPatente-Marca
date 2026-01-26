# ExtensaoPatente-Marca

Solução em HTML para processar documentos do INPI (Instituto Nacional da Propriedade Industrial) usando IA gratuita ou paga, com proteção de dados sensíveis conforme LGPD (Lei Geral de Proteção de Dados).

## 🔐 Características Principais

- **Conformidade com LGPD**: Anonimização automática de dados sensíveis antes do envio para IA
- **IA Gratuita e Paga**: Suporte para modelos open-source (Ollama, LM Studio) e serviços comerciais (OpenAI, Anthropic)
- **Processamento Local**: Extração de texto e anonimização feitos no navegador - seus dados não são armazenados
- **Interface Intuitiva**: Interface web responsiva em português
- **Proteção de Dados**: CPF, CNPJ, nomes, e-mails, endereços e telefones são automaticamente protegidos

## 🚀 Como Usar

### Opção 1: Uso Direto (Sem Instalação)

1. Abra o arquivo `index.html` em qualquer navegador moderno
2. Nenhum servidor web é necessário - tudo funciona localmente!

### Opção 2: Com Servidor Web Local

```bash
# Usando Python 3
python -m http.server 8000

# Usando Node.js
npx http-server

# Usando PHP
php -S localhost:8000
```

Depois acesse: http://localhost:8000

## 📋 Passo a Passo

### 1. Selecione o Serviço de IA

**IA Gratuita (Modelos Locais)**
- Ollama: http://localhost:11434/api/chat
- LM Studio: http://localhost:1234/v1/chat/completions
- Text Generation WebUI: http://localhost:5000/v1/chat/completions

**IA Paga (Serviços Comerciais)**
- OpenAI: https://api.openai.com/v1/chat/completions
- Anthropic Claude: https://api.anthropic.com/v1/messages
- Google Gemini: https://generativelanguage.googleapis.com/v1/models

### 2. Configure a API

- **Endpoint**: URL da API do serviço de IA
- **Chave da API**: Necessária apenas para serviços pagos
- **Modelo**: Nome do modelo (ex: gpt-4, llama2, claude-3)

### 3. Carregue o Documento

- Clique ou arraste um arquivo PDF ou TXT
- Documentos de patentes, marcas ou outros do INPI

### 4. Configure a Privacidade

Selecione quais dados devem ser anonimizados:
- ✅ CPF (xxx.xxx.xxx-xx → [CPF-REDACTED])
- ✅ CNPJ (xx.xxx.xxx/xxxx-xx → [CNPJ-REDACTED])
- ✅ Nomes Próprios ([NOME-REDACTED])
- ✅ E-mails ([EMAIL-REDACTED])
- ✅ Endereços ([ENDERECO-REDACTED])
- ✅ Telefones ([TELEFONE-REDACTED])

### 5. Processe o Documento

- Personalize a instrução para a IA conforme necessário
- Clique em "Processar com IA"
- Aguarde a análise (pode levar alguns segundos)

## 🤖 Configurando IA Gratuita

### Ollama (Recomendado)

1. Instale o Ollama: https://ollama.ai
2. Execute um modelo:
```bash
ollama run llama2
# ou
ollama run mistral
# ou
ollama run codellama
```
3. Configure na aplicação:
   - Endpoint: `http://localhost:11434/api/chat`
   - Modelo: `llama2` (ou o modelo que você instalou)
   - API Key: deixe em branco

### LM Studio

1. Baixe o LM Studio: https://lmstudio.ai
2. Baixe um modelo (ex: Llama 2, Mistral)
3. Inicie o servidor local
4. Configure na aplicação:
   - Endpoint: `http://localhost:1234/v1/chat/completions`
   - Modelo: nome do modelo carregado
   - API Key: deixe em branco

## 🔑 Configurando IA Paga

### OpenAI

1. Crie uma conta em: https://platform.openai.com
2. Obtenha sua API key em: https://platform.openai.com/api-keys
3. Configure na aplicação:
   - Endpoint: `https://api.openai.com/v1/chat/completions`
   - API Key: sua chave (sk-...)
   - Modelo: `gpt-4` ou `gpt-3.5-turbo`

### Anthropic Claude

1. Crie uma conta em: https://www.anthropic.com
2. Obtenha sua API key
3. Configure na aplicação:
   - Endpoint: `https://api.anthropic.com/v1/messages`
   - API Key: sua chave
   - Modelo: `claude-3-opus-20240229` ou similar

## 🔒 Proteção de Dados (LGPD)

Esta aplicação implementa várias camadas de proteção:

1. **Processamento Local**: Todo o processamento de PDF e anonimização acontece no seu navegador
2. **Anonimização Automática**: Dados sensíveis são detectados e substituídos antes do envio
3. **Sem Armazenamento**: Nenhum dado é salvo em servidores ou bancos de dados
4. **Controle Total**: Você decide quais dados proteger e qual IA usar
5. **Código Aberto**: Todo o código é visível e auditável

### Dados Protegidos

- **CPF**: Números no formato xxx.xxx.xxx-xx
- **CNPJ**: Números no formato xx.xxx.xxx/xxxx-xx
- **Nomes**: Sequências de palavras capitalizadas (heurística)
- **E-mails**: Endereços de e-mail completos
- **Telefones**: Números de telefone brasileiros
- **Endereços**: Rua, Avenida, etc. com números

## 📁 Estrutura do Projeto

```
ExtensaoPatente-Marca/
├── index.html          # Interface principal
├── app.js             # Lógica da aplicação
├── anonymizer.js      # Módulo de anonimização (LGPD)
├── pdfProcessor.js    # Processamento de PDF
└── README.md          # Documentação
```

## 🛠️ Tecnologias Utilizadas

- **HTML5/CSS3**: Interface responsiva
- **JavaScript (ES6+)**: Lógica da aplicação
- **PDF.js**: Extração de texto de PDFs (Mozilla)
- **Fetch API**: Comunicação com APIs de IA

## 🔧 Requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexão com internet (para carregar PDF.js e acessar APIs de IA)
- Para IA gratuita: Ollama ou LM Studio rodando localmente
- Para IA paga: Chave de API válida

## ⚠️ Importante

1. **Chaves de API**: Nunca compartilhe suas chaves de API
2. **Dados Sensíveis**: Mesmo com anonimização, revise os dados antes de enviar
3. **Modelos Locais**: São mais lentos mas totalmente privados
4. **Custo**: Serviços pagos cobram por uso - monitore seu consumo

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Adicionar suporte para novas APIs de IA

## 📄 Licença

Este projeto é open-source e está disponível sob licença MIT.

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no GitHub
- Consulte a documentação das APIs de IA que você está usando

## 🎯 Roadmap

- [ ] Suporte para mais formatos de documento (DOCX, ODT)
- [ ] Análise de imagens em PDFs
- [ ] Exportação de resultados em múltiplos formatos
- [ ] Templates de análise para diferentes tipos de documentos
- [ ] Modo offline completo
- [ ] Extensão para navegador

---

Desenvolvido com foco em privacidade e conformidade com LGPD 🇧🇷

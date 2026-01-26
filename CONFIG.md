# Exemplos de Configuração para Diferentes Serviços de IA

Este arquivo contém exemplos de configuração para os principais serviços de IA suportados.

## IA Gratuita (Modelos Locais)

### Ollama
```
Endpoint: http://localhost:11434/api/chat
API Key: (deixe em branco)
Modelo: llama2, mistral, codellama, neural-chat, etc.
```

Instalação:
```bash
# Linux
curl https://ollama.ai/install.sh | sh

# macOS/Windows
# Baixe de https://ollama.ai

# Execute um modelo
ollama run llama2
```

### LM Studio
```
Endpoint: http://localhost:1234/v1/chat/completions
API Key: (deixe em branco)
Modelo: (nome do modelo que você carregou no LM Studio)
```

Download: https://lmstudio.ai

### Text Generation WebUI (oobabooga)
```
Endpoint: http://localhost:5000/v1/chat/completions
API Key: (deixe em branco)
Modelo: (modelo carregado)
```

GitHub: https://github.com/oobabooga/text-generation-webui

### LocalAI
```
Endpoint: http://localhost:8080/v1/chat/completions
API Key: (deixe em branco)
Modelo: (modelo instalado)
```

GitHub: https://github.com/go-skynet/LocalAI

## IA Paga (Serviços Comerciais)

### OpenAI GPT-4
```
Endpoint: https://api.openai.com/v1/chat/completions
API Key: sk-proj-... (obtenha em https://platform.openai.com/api-keys)
Modelo: gpt-4, gpt-4-turbo, gpt-3.5-turbo
```

Documentação: https://platform.openai.com/docs/api-reference

### Anthropic Claude
```
Endpoint: https://api.anthropic.com/v1/messages
API Key: sk-ant-... (obtenha em https://console.anthropic.com)
Modelo: claude-3-opus-20240229, claude-3-sonnet-20240229, claude-3-haiku-20240307
```

Nota: A API do Claude usa um formato diferente. Você pode precisar de um wrapper.
Documentação: https://docs.anthropic.com/claude/reference

### Google Gemini
```
Endpoint: https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
API Key: AIza... (obtenha em https://makersuite.google.com/app/apikey)
Modelo: gemini-pro, gemini-pro-vision
```

Nota: A API do Gemini usa um formato diferente. Você pode precisar de um wrapper.
Documentação: https://ai.google.dev/docs

### Azure OpenAI
```
Endpoint: https://{seu-recurso}.openai.azure.com/openai/deployments/{seu-deployment}/chat/completions?api-version=2023-05-15
API Key: (sua chave do Azure)
Modelo: (nome do seu deployment)
```

Documentação: https://learn.microsoft.com/azure/ai-services/openai/

### Groq (LLMs rápidos)
```
Endpoint: https://api.groq.com/openai/v1/chat/completions
API Key: gsk_... (obtenha em https://console.groq.com)
Modelo: mixtral-8x7b-32768, llama2-70b-4096
```

Documentação: https://console.groq.com/docs

### Together.ai
```
Endpoint: https://api.together.xyz/v1/chat/completions
API Key: (obtenha em https://api.together.xyz/settings/api-keys)
Modelo: mistralai/Mixtral-8x7B-Instruct-v0.1, meta-llama/Llama-2-70b-chat-hf
```

Documentação: https://docs.together.ai/

## Modelos Recomendados para Análise de Documentos INPI

### Gratuitos (Local)
1. **Llama 2 13B** - Bom equilíbrio entre velocidade e qualidade
2. **Mistral 7B** - Rápido e eficiente para análises
3. **Neural Chat 7B** - Otimizado para conversação e análise

### Pagos
1. **GPT-4** (OpenAI) - Melhor qualidade geral, mais caro
2. **GPT-3.5-turbo** (OpenAI) - Bom custo-benefício
3. **Claude 3 Opus** (Anthropic) - Excelente para análise de documentos
4. **Claude 3 Sonnet** (Anthropic) - Equilíbrio entre custo e qualidade

## Dicas de Configuração

### Para Documentos Longos
- Use modelos com contexto maior (32k, 100k tokens)
- GPT-4-turbo, Claude 3, ou Gemini Pro são boas opções
- Modelos locais: llama2:70b com mais RAM

### Para Análises Rápidas
- GPT-3.5-turbo (pago, rápido)
- Groq com Mixtral (pago, muito rápido)
- Mistral 7B local (gratuito, moderado)

### Para Máxima Privacidade
- Use apenas modelos locais (Ollama, LM Studio)
- Nunca envie dados para serviços externos
- Configure CORS adequadamente se usar servidor web

### Custos Estimados (Serviços Pagos)

**OpenAI GPT-4**
- Input: ~$0.03 por 1K tokens
- Output: ~$0.06 por 1K tokens
- Documento médio (10 páginas): ~$0.50-$2.00

**OpenAI GPT-3.5-turbo**
- Input: ~$0.0005 por 1K tokens
- Output: ~$0.0015 por 1K tokens
- Documento médio (10 páginas): ~$0.02-$0.10

**Anthropic Claude 3**
- Opus: $15 por 1M input tokens
- Sonnet: $3 por 1M input tokens
- Haiku: $0.25 por 1M input tokens

**Modelos Locais**
- Custo zero (após setup inicial)
- Requer hardware adequado (8GB+ RAM para 7B, 16GB+ para 13B)

## Resolução de Problemas

### Erro de CORS
Se você receber erro de CORS ao usar modelos locais:
1. Certifique-se de que o serviço de IA permite requisições do navegador
2. Para Ollama, configure: `OLLAMA_ORIGINS=* ollama serve`
3. Para outros serviços, verifique suas configurações de CORS

### Timeout
Se a requisição demorar muito:
1. Use modelos menores/mais rápidos
2. Reduza o tamanho do documento
3. Aumente o timeout da aplicação

### Erro de Autenticação
Se receber erro 401/403:
1. Verifique se a API key está correta
2. Certifique-se de que tem créditos na conta
3. Verifique se a API key tem permissões adequadas

### Modelo Não Encontrado
Se receber erro sobre modelo não encontrado:
1. Verifique o nome exato do modelo
2. Para Ollama: `ollama list` mostra modelos disponíveis
3. Para serviços pagos: consulte a documentação oficial

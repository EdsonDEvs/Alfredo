# 🔄 Substituir Evolution API por HTTP Request

## 🎯 Objetivo

Substituir todos os nodes `n8n-nodes-evolution-api.evolutionApi` por nodes `n8n-nodes-base.httpRequest` para maior flexibilidade, controle de erros e melhor manutenção.

## 📋 Nodes a Substituir

### 1. **Enviar Mensagem de Texto**
- Nodes: `Responde o Cliente`, `RespondeCliente`, `RespondeClienteConsulta`, `MensagemErro`, `EnviaWhatsapp`, `Enviar texto`, `Enviar texto1`

### 2. **Buscar Mídia (Base64)**
- Nodes: `Caso não recebemos o Base64 consultamos no EVOAPI`, `Caso não recebemos o Base64 consultamos no EVOAPI1`

### 3. **Verificar Número**
- Nodes: `VerificaNumeroWhats`, `Verificar n mero no whats app`

## 🔧 Configuração HTTP Request

### Estrutura da Evolution API

**URL Base:** `https://SEU_SERVIDOR_EVOLUTION_API`  
**Instância:** `Alfredoo` (ou outra configurada)

### 1. Enviar Mensagem de Texto

**Endpoint:** `POST /message/sendText/{instance}`

**Configuração HTTP Request:**
- **Method:** POST
- **URL:** `https://SEU_SERVIDOR_EVOLUTION_API/message/sendText/Alfredoo`
- **Authentication:** Header Auth ou API Key
- **Headers:**
  - `Content-Type: application/json`
  - `apikey: SUA_API_KEY` (se necessário)
- **Body (JSON):**
```json
{
  "number": "{{ $('Organiza Dados').item.json.whatsapp }}",
  "text": "{{ $json.output }}"
}
```

**OU usando remoteJid completo:**
```json
{
  "number": "{{ $('Organiza Dados').item.json.whatsapp }}@s.whatsapp.net",
  "text": "{{ $json.output }}"
}
```

### 2. Buscar Mídia (Base64)

**Endpoint:** `GET /chat/getMedia/{instance}/{messageId}`

**Configuração HTTP Request:**
- **Method:** GET
- **URL:** `https://SEU_SERVIDOR_EVOLUTION_API/chat/getMedia/Alfredoo/{{ $('InicioChat').item.json.body.data.key.id }}`
- **Authentication:** Header Auth ou API Key
- **Headers:**
  - `apikey: SUA_API_KEY` (se necessário)

**Para converter para MP4 (imagens):**
- **URL:** `https://SEU_SERVIDOR_EVOLUTION_API/chat/getMedia/Alfredoo/{{ $('InicioChat').item.json.body.data.key.id }}?convertToMp4=true`

### 3. Verificar Número

**Endpoint:** `GET /chat/fetchContacts/{instance}` ou `POST /chat/whatsappNumbers/{instance}`

**Configuração HTTP Request:**
- **Method:** POST
- **URL:** `https://SEU_SERVIDOR_EVOLUTION_API/chat/whatsappNumbers/Alfredoo`
- **Authentication:** Header Auth ou API Key
- **Headers:**
  - `Content-Type: application/json`
  - `apikey: SUA_API_KEY` (se necessário)
- **Body (JSON):**
```json
{
  "numbers": ["55{{ $json.mobilePhone }}"]
}
```

## ✅ Vantagens da Substituição

1. **✅ Melhor Controle de Erros** - Pode adicionar tratamento de erro personalizado
2. **✅ Mais Flexível** - Pode modificar headers, body, etc. facilmente
3. **✅ Melhor Logging** - Pode ver exatamente o que está sendo enviado
4. **✅ Retry Automático** - Pode configurar retry no n8n
5. **✅ Timeout Configurável** - Pode ajustar timeout por requisição
6. **✅ Não Depende de Plugin** - Usa apenas nodes nativos do n8n

## 🔐 Configuração de Autenticação

### Opção 1: API Key no Header
```json
{
  "apikey": "SUA_API_KEY_AQUI"
}
```

### Opção 2: Bearer Token
```json
{
  "Authorization": "Bearer SEU_TOKEN_AQUI"
}
```

### Opção 3: Basic Auth
- Username: Seu usuário
- Password: Sua senha/API key

## 📝 Exemplo Completo - Enviar Mensagem

```json
{
  "parameters": {
    "method": "POST",
    "url": "https://SEU_SERVIDOR_EVOLUTION_API/message/sendText/Alfredoo",
    "authentication": "genericCredentialType",
    "genericAuthType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "Content-Type",
          "value": "application/json"
        },
        {
          "name": "apikey",
          "value": "SUA_API_KEY"
        }
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {
          "name": "number",
          "value": "={{ $('Organiza Dados').item.json.whatsapp }}"
        },
        {
          "name": "text",
          "value": "={{ $json.output }}"
        }
      ]
    },
    "options": {
      "timeout": 30000,
      "retry": {
        "maxRetries": 3,
        "retryOnFail": true
      }
    }
  },
  "type": "n8n-nodes-base.httpRequest",
  "typeVersion": 4.2
}
```

## 🚀 Próximos Passos

1. Identificar URL base da Evolution API
2. Obter API Key ou método de autenticação
3. Substituir cada node individualmente
4. Testar cada substituição
5. Remover dependência do plugin evolution-api




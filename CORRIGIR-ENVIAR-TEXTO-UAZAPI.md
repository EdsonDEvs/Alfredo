# 🔧 Corrigir Node "Enviar texto" para Uazapi

## 🚨 Erro Atual

**Node "Enviar texto" está falhando:**
- Erro: "Connection Closed"
- Status: 500 - Internal Server Error
- Causa: Node ainda configurado para Evolution API, não para uazapi

## ✅ Solução: Configurar para Uazapi

### Estrutura da API Uazapi

A uazapi geralmente usa uma estrutura diferente da Evolution API. Você precisa:

1. **URL do servidor uazapi** (ex: `https://api.uazapi.com` ou seu servidor)
2. **Token/API Key** da uazapi
3. **Formato correto do body**

### Configuração do Node HTTP Request

#### Opção 1: Estrutura Padrão Uazapi

**Method:** POST  
**URL:** `https://SEU_SERVIDOR_UAZAPI/enviar-mensagem`  
**Headers:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SEU_TOKEN_UAZAPI"
}
```

**Body (JSON):**
```json
{
  "phone": "553172242378",
  "message": "Sua mensagem aqui"
}
```

#### Opção 2: Estrutura Alternativa Uazapi

**Method:** POST  
**URL:** `https://SEU_SERVIDOR_UAZAPI/send-message`  
**Headers:**
```json
{
  "Content-Type": "application/json",
  "apikey": "SUA_API_KEY_UAZAPI"
}
```

**Body (JSON):**
```json
{
  "number": "553172242378",
  "text": "Sua mensagem aqui"
}
```

---

## 🔧 Como Corrigir no n8n

### Passo 1: Abrir Node "Enviar texto"

1. Abra o workflow no n8n
2. Clique no node "Enviar texto" (está em vermelho)
3. Clique em "Edit"

### Passo 2: Configurar URL

**No campo "URL", substitua:**
```
https://SEU_SERVIDOR_EVOLUTION_API/message/sendText/Alfredoo
```

**Por:**
```
https://SEU_SERVIDOR_UAZAPI/enviar-mensagem
```

**OU (dependendo da sua configuração uazapi):**
```
https://SEU_SERVIDOR_UAZAPI/send-message
```

### Passo 3: Configurar Headers

**Substitua o header "apikey":**
```
apikey: SUA_API_KEY_AQUI
```

**Por (uma das opções):**
```
Authorization: Bearer SEU_TOKEN_UAZAPI
```

**OU:**
```
apikey: SUA_API_KEY_UAZAPI
```

### Passo 4: Configurar Body

**Atual (Evolution API):**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Mensagem aqui"
}
```

**Novo (Uazapi - Opção 1):**
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

**OU (Uazapi - Opção 2):**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

---

## 📋 Informações Necessárias

Para configurar corretamente, você precisa:

1. **URL Base da uazapi:**
   - Exemplo: `https://api.uazapi.com`
   - Ou: `https://seu-servidor-uazapi.com`

2. **Método de Autenticação:**
   - Bearer Token?
   - API Key no header?
   - Outro método?

3. **Endpoint para enviar mensagem:**
   - `/enviar-mensagem`?
   - `/send-message`?
   - `/message/send`?
   - Outro?

4. **Estrutura do Body:**
   - `{ "phone": "...", "message": "..." }`?
   - `{ "number": "...", "text": "..." }`?
   - Outra estrutura?

---

## 🔍 Como Descobrir a Estrutura Correta

### Opção 1: Documentação da Uazapi

1. Acesse a documentação da uazapi
2. Procure por "enviar mensagem" ou "send message"
3. Veja o endpoint e formato do body

### Opção 2: Verificar Webhook Recebido

1. Veja o webhook que você recebe do uazapi
2. A estrutura de envio geralmente é similar
3. Use a mesma URL base e formato

### Opção 3: Testar no Postman/Insomnia

1. Teste a API uazapi diretamente
2. Veja qual formato funciona
3. Replique no n8n

---

## ✅ Exemplo Completo (Ajuste conforme sua API)

### Node HTTP Request Configurado:

**Method:** POST  
**URL:** `https://api.uazapi.com/enviar-mensagem`  
**Authentication:** Generic Credential Type → HTTP Header Auth  
**Headers:**
- `Content-Type`: `application/json`
- `Authorization`: `Bearer SEU_TOKEN_AQUI`

**Body (JSON):**
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

---

## 🚀 Próximos Passos

1. **Obter informações da uazapi:**
   - URL do servidor
   - Token/API Key
   - Endpoint correto
   - Formato do body

2. **Ajustar o node:**
   - Substituir URL
   - Configurar autenticação
   - Ajustar body

3. **Testar:**
   - Execute o workflow
   - Verifique se a mensagem é enviada
   - Veja se o erro desaparece

---

**Status:** ⚠️ Aguardando informações da uazapi  
**Próximo Passo:** Configurar URL, autenticação e body conforme sua API uazapi


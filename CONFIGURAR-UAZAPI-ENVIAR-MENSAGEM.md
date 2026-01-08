# 🔧 Configurar Uazapi para Enviar Mensagens

## 🚨 Erro Atual

**Node "Enviar texto" falhando:**
- Erro: "Connection Closed" (500)
- Causa: Node ainda configurado para Evolution API

## ✅ Correção Aplicada

Ajustei o node para estrutura genérica do uazapi. **Você precisa configurar:**

### 1. URL do Servidor Uazapi

**No campo "URL", substitua:**
```
https://SEU_SERVIDOR_UAZAPI/enviar-mensagem
```

**Por sua URL real, por exemplo:**
```
https://api.uazapi.com/enviar-mensagem
```

**OU (dependendo do seu servidor):**
```
https://seu-servidor.com/api/send-message
```

### 2. Token/API Key

**No header "Authorization", substitua:**
```
Bearer SEU_TOKEN_UAZAPI_AQUI
```

**Por seu token real:**
```
Bearer seu-token-uazapi-real
```

**OU se usar API Key no header:**
- Remova o header "Authorization"
- Adicione header: `apikey: sua-api-key-aqui`

### 3. Estrutura do Body (Ajuste se necessário)

**Atual (genérico uazapi):**
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Sua mensagem"
}
```

**Se sua API usar formato diferente, ajuste para:**

**Opção A (number + text):**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Sua mensagem"
}
```

**Opção B (to + body):**
```json
{
  "to": "{{ $json.whatsapp }}",
  "body": "Sua mensagem"
}
```

**Opção C (from + to + message):**
```json
{
  "from": "SEU_NUMERO_BOT",
  "to": "{{ $json.whatsapp }}",
  "message": "Sua mensagem"
}
```

---

## 🔍 Como Descobrir a Estrutura Correta

### Método 1: Documentação Uazapi

1. Acesse a documentação da uazapi
2. Procure por "enviar mensagem" ou "send message"
3. Veja:
   - Endpoint (URL)
   - Método (POST)
   - Headers necessários
   - Estrutura do body

### Método 2: Verificar Webhook Recebido

1. Veja o webhook que você recebe do uazapi
2. A estrutura de envio geralmente é similar
3. Use a mesma URL base

### Método 3: Testar no Postman/Insomnia

1. Teste a API uazapi diretamente
2. Veja qual formato funciona
3. Replique no n8n

### Método 4: Verificar Logs/Console

1. Veja os logs do servidor uazapi
2. Verifique qual formato está sendo usado
3. Ajuste conforme necessário

---

## 📋 Checklist de Configuração

- [ ] URL do servidor uazapi configurada
- [ ] Token/API Key configurado
- [ ] Headers corretos (Content-Type, Authorization/apikey)
- [ ] Body no formato correto (phone/message ou number/text, etc.)
- [ ] Número do WhatsApp no formato correto (com ou sem @s.whatsapp.net)
- [ ] Testado e funcionando

---

## 🧪 Como Testar

### Passo 1: Configurar Node

1. Abra o node "Enviar texto"
2. Configure URL, token e body conforme sua API
3. Salve

### Passo 2: Executar Teste

1. Execute o workflow
2. Envie uma mensagem de teste
3. Verifique se o erro desaparece

### Passo 3: Verificar Resultado

1. Veja o OUTPUT do node
2. Se funcionar, deve retornar sucesso
3. Se ainda der erro, verifique:
   - URL está correta?
   - Token está correto?
   - Body está no formato certo?
   - Número está no formato esperado?

---

## ⚠️ Problemas Comuns

### Erro: "Connection Closed"
- **Causa:** URL incorreta ou servidor não acessível
- **Solução:** Verifique a URL do servidor uazapi

### Erro: "401 Unauthorized"
- **Causa:** Token/API Key incorreto
- **Solução:** Verifique o token no header

### Erro: "400 Bad Request"
- **Causa:** Body no formato incorreto
- **Solução:** Ajuste o formato do body conforme a API

### Erro: "404 Not Found"
- **Causa:** Endpoint incorreto
- **Solução:** Verifique o endpoint na documentação

---

## 📝 Exemplo Completo (Ajuste conforme sua API)

```json
{
  "method": "POST",
  "url": "https://api.uazapi.com/enviar-mensagem",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer seu-token-aqui"
  },
  "body": {
    "phone": "553172242378",
    "message": "Sua mensagem aqui"
  }
}
```

---

**Status:** ✅ Node ajustado para estrutura genérica uazapi  
**Próximo Passo:** Configurar URL, token e formato do body conforme sua API uazapi




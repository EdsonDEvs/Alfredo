# 🔧 Solução: Mensagens Não Aparecem no n8n

## 🚨 Problema

Após trocar o número na Evolution API, as mensagens não aparecem no n8n.

## 🔍 Diagnóstico

### Verificações Necessárias

1. **Webhook da Evolution API está configurado?**
2. **Webhook está apontando para o n8n correto?**
3. **A instância da Evolution API está ativa?**
4. **O n8n está recebendo as requisições?**

## ✅ Solução Passo a Passo

### Passo 1: Verificar Status da Instância

1. **Acesse o painel da Evolution API**
2. **Verifique se o status está "Connected"** (verde)
3. **Verifique se o número está visível** no painel
4. **Anote o nome da instância** (ex: "alfredoo")

### Passo 2: Configurar Webhook na Evolution API

O webhook precisa estar configurado para apontar para o n8n:

**URL do Webhook:**
```
https://n8n.alfredoo.online/webhook-test/verifica-zap
```

**Ou o webhook que você está usando no n8n:**
```
https://n8n.alfredoo.online/webhook/[nome-do-workflow]
```

#### Como Configurar:

1. **No painel da Evolution API**, procure por "Webhook" ou "Settings"
2. **Configure o webhook** com:
   - **URL**: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
   - **Events**: `messages`, `message.upsert`, `connection.update`
   - **Method**: `POST`
   - **Headers**: Se necessário, adicione autenticação

### Passo 3: Verificar Configuração no n8n

1. **Acesse o n8n**: `https://n8n.alfredoo.online`
2. **Verifique se o workflow está ATIVO**:
   - Vá em **Workflows**
   - Encontre o workflow do WhatsApp
   - Certifique-se de que está **ATIVO** (botão verde)
3. **Verifique o webhook**:
   - Abra o workflow
   - Encontre o node "Webhook"
   - Verifique a URL do webhook
   - Copie a URL completa

### Passo 4: Testar o Webhook Manualmente

#### Teste 1: Verificar se o n8n está recebendo

```bash
# Teste com curl
curl -X POST https://n8n.alfredoo.online/webhook-test/verifica-zap \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net",
        "fromMe": false
      },
      "message": {
        "conversation": "teste"
      }
    }
  }'
```

#### Teste 2: Verificar logs do n8n

1. **Acesse o n8n**
2. **Vá em "Executions"** (Execuções)
3. **Verifique** se há execuções recentes
4. **Procure por erros** ou falhas

### Passo 5: Verificar API Key da Evolution API

A API Key que você mencionou: `9262493C1311-4C8E-B6A1-84F123F1501B`

**Verifique se está correta:**

1. **No painel da Evolution API**, verifique a API Key
2. **Compare** com a que você está usando
3. **Se necessário, gere uma nova** API Key

### Passo 6: Configurar Webhook via API (Alternativa)

Se não conseguir configurar pelo painel, use a API:

```bash
# Configurar webhook via API
curl -X POST \
  'https://sua-evolution-api.com/webhook/set/alfredoo' \
  -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://n8n.alfredoo.online/webhook-test/verifica-zap",
    "webhook_by_events": true,
    "webhook_base64": false,
    "events": [
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "MESSAGES_DELETE",
      "SEND_MESSAGE",
      "CONTACTS_UPDATE",
      "CONTACTS_UPSERT",
      "PRESENCE_UPDATE",
      "CHATS_UPDATE",
      "CHATS_UPSERT",
      "CHATS_DELETE",
      "GROUPS_UPSERT",
      "GROUP_UPDATE",
      "GROUP_PARTICIPANTS_UPDATE",
      "CONNECTION_UPDATE",
      "CALL_UPSERT",
      "CALL_UPDATE",
      "LABELS_EDIT",
      "LABELS_ASSOCIATION",
      "TYPEBOT_START",
      "TYPEBOT_CHANGE_STATUS"
    ],
    "qrcode": {
      "count": 0
    },
    "number": {
      "waitQrCode": false
    }
  }'
```

## 🐛 Problemas Comuns e Soluções

### Problema 1: Webhook não está configurado

**Sintoma:** Mensagens não aparecem no n8n

**Solução:**
1. Configure o webhook no painel da Evolution API
2. Certifique-se de que a URL está correta
3. Teste o webhook manualmente

### Problema 2: Webhook está configurado, mas não funciona

**Sintoma:** Webhook configurado, mas n8n não recebe

**Soluções:**
1. Verifique se o workflow do n8n está ATIVO
2. Verifique se a URL do webhook está correta
3. Verifique os logs do n8n para erros
4. Teste o webhook com uma requisição manual

### Problema 3: API Key incorreta

**Sintoma:** Erro 401 (Unauthorized) ou 403 (Forbidden)

**Solução:**
1. Verifique se a API Key está correta
2. Gere uma nova API Key se necessário
3. Atualize a API Key no n8n (se estiver usando)

### Problema 4: Instância não está conectada

**Sintoma:** Status não está "Connected"

**Solução:**
1. Verifique se o número está conectado
2. Reconecte o número se necessário
3. Aguarde o status mudar para "Connected"

### Problema 5: n8n não está acessível

**Sintoma:** Erro de conexão ao acessar o n8n

**Solução:**
1. Verifique se o n8n está rodando
2. Verifique se a URL está correta
3. Verifique se há firewall bloqueando

## 📋 Checklist de Verificação

### Evolution API

- [ ] Status está "Connected" (verde)
- [ ] Número está visível no painel
- [ ] Webhook está configurado
- [ ] URL do webhook está correta
- [ ] API Key está correta
- [ ] Eventos estão configurados

### n8n

- [ ] Workflow está ATIVO
- [ ] Webhook node está configurado
- [ ] URL do webhook está correta
- [ ] Não há erros nos logs
- [ ] Workflow está executando

### Teste

- [ ] Enviei uma mensagem de teste
- [ ] Verifiquei os logs do n8n
- [ ] Verifiquei as execuções no n8n
- [ ] Testei o webhook manualmente

## 🔧 Configuração Completa do Webhook

### No Painel da Evolution API:

1. **Acesse as configurações** da instância
2. **Vá em "Webhook"** ou "Settings"
3. **Configure:**
   - **URL**: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
   - **Events**: Selecione todos os eventos de mensagem
   - **Method**: `POST`
   - **Headers**: Se necessário, adicione autenticação

### No n8n:

1. **Abra o workflow** do WhatsApp
2. **Verifique o node "Webhook"**:
   - **HTTP Method**: `POST`
   - **Path**: `/webhook-test/verifica-zap`
   - **Response Mode**: `Using 'Respond to Webhook' Node`
3. **Ative o workflow** (botão verde no canto superior direito)

## 🧪 Teste Final

1. **Envie uma mensagem** para o novo número
2. **Aguarde alguns segundos**
3. **Verifique o n8n**:
   - Vá em "Executions"
   - Procure por execuções recentes
   - Verifique se a mensagem foi recebida
4. **Verifique os logs**:
   - Procure por erros
   - Verifique se os dados estão corretos

## 📞 Próximos Passos

Se após seguir todos os passos ainda não funcionar:

1. **Verifique os logs** da Evolution API
2. **Verifique os logs** do n8n
3. **Teste o webhook** manualmente com curl
4. **Entre em contato** com o suporte da Evolution API
5. **Verifique a documentação** da Evolution API

## 🔐 Segurança

- ✅ **Nunca compartilhe** sua API Key publicamente
- ✅ **Use HTTPS** para todas as conexões
- ✅ **Valide** as requisições no n8n
- ✅ **Monitore** os logs regularmente

---

**Última atualização:** 2025-01-11

**Nota:** Se você precisar de ajuda adicional, verifique a documentação da Evolution API ou entre em contato com o suporte.


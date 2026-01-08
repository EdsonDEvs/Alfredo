# ⚡ Solução Rápida: Webhook Não Funciona

## 🚨 Problema

Mensagens não aparecem no n8n após trocar o número na Evolution API.

## ✅ Solução em 3 Passos

### Passo 1: Verificar Webhook na Evolution API

1. **Acesse o painel da Evolution API**
2. **Procure por "Webhook" ou "Settings"**
3. **Verifique se o webhook está configurado** com a URL:
   ```
   https://n8n.alfredoo.online/webhook-test/verifica-zap
   ```

### Passo 2: Configurar Webhook (Se Não Estiver Configurado)

#### Opção A: Via Painel da Evolution API

1. **No painel**, vá em **"Webhook"** ou **"Settings"**
2. **Configure:**
   - **URL**: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
   - **Events**: Selecione `MESSAGES_UPSERT` e `MESSAGES_UPDATE`
   - **Method**: `POST`
3. **Salve** a configuração

#### Opção B: Via API (Se o painel não tiver opção)

```bash
curl -X POST \
  'https://sua-evolution-api.com/webhook/set/alfredoo' \
  -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://n8n.alfredoo.online/webhook-test/verifica-zap",
    "webhook_by_events": true,
    "events": [
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE"
    ]
  }'
```

**Substitua:**
- `sua-evolution-api.com` pela URL da sua Evolution API
- `alfredoo` pelo nome da sua instância

### Passo 3: Verificar n8n

1. **Acesse o n8n**: `https://n8n.alfredoo.online`
2. **Verifique se o workflow está ATIVO**:
   - Vá em **Workflows**
   - Encontre o workflow do WhatsApp
   - Certifique-se de que está **ATIVO** (botão verde no canto superior direito)
3. **Verifique o webhook**:
   - Abra o workflow
   - Encontre o node "Webhook"
   - Verifique se a URL está correta: `/webhook-test/verifica-zap`

## 🧪 Teste Rápido

### 1. Teste o Webhook Manualmente

```bash
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

### 2. Envie uma Mensagem de Teste

1. **Envie uma mensagem** para o novo número do WhatsApp
2. **Aguarde 5-10 segundos**
3. **Verifique o n8n**:
   - Vá em **Executions** (Execuções)
   - Procure por execuções recentes
   - Verifique se a mensagem foi recebida

## 🔍 Verificações Importantes

### Evolution API

- [ ] Status está "Connected" (verde)
- [ ] Número está visível no painel
- [ ] Webhook está configurado
- [ ] URL do webhook está correta: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
- [ ] API Key está correta: `9262493C1311-4C8E-B6A1-84F123F1501B`

### n8n

- [ ] Workflow está ATIVO
- [ ] Webhook node está configurado
- [ ] URL do webhook está correta: `/webhook-test/verifica-zap`
- [ ] Não há erros nos logs
- [ ] Workflow está executando

## 🐛 Problemas Comuns

### Problema 1: Webhook não está configurado

**Solução:** Configure o webhook na Evolution API apontando para o n8n

### Problema 2: Workflow não está ativo

**Solução:** Ative o workflow no n8n (botão verde)

### Problema 3: URL do webhook está errada

**Solução:** Verifique se a URL está correta em ambos os lados:
- Evolution API: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
- n8n: `/webhook-test/verifica-zap`

### Problema 4: API Key está incorreta

**Solução:** Verifique se a API Key `9262493C1311-4C8E-B6A1-84F123F1501B` está correta

## 📋 Checklist Final

- [ ] Webhook configurado na Evolution API
- [ ] URL do webhook está correta
- [ ] Workflow ativo no n8n
- [ ] Teste manual funcionou
- [ ] Mensagem de teste foi recebida
- [ ] Logs do n8n sem erros

## 🚀 Próximos Passos

1. **Configure o webhook** na Evolution API
2. **Ative o workflow** no n8n
3. **Teste enviando uma mensagem**
4. **Verifique os logs** do n8n
5. **Se não funcionar**, verifique a documentação da Evolution API

---

**Nota:** Se após seguir todos os passos ainda não funcionar, verifique:
- Logs da Evolution API
- Logs do n8n
- Firewall ou bloqueios de rede
- Status da instância da Evolution API


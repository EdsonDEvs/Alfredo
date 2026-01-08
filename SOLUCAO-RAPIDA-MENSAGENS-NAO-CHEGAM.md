# ⚡ Solução Rápida: Mensagens Não Chegam no n8n

## 🚨 Problema

Mensagens não estão nem sendo chamadas no n8n (não aparecem execuções).

## ✅ Solução em 3 Passos (Mais Rápido)

### Passo 1: Verificar se Workflow Está ATIVO ⚠️ (MAIS COMUM!)

**No n8n:**
1. **Acesse**: `https://n8n.alfredoo.online`
2. **Vá em "Workflows"**
3. **Encontre o workflow do WhatsApp**
4. **Verifique se está ATIVO**:
   - Deve ter um **botão verde** no canto superior direito
   - Se estiver **inativo (cinza)**, **CLIQUE PARA ATIVAR**
   - Aguarde alguns segundos

**⚠️ IMPORTANTE:** 90% dos problemas são workflow inativo!

### Passo 2: Reconfigurar Webhook na Evolution API

**Execute este comando:**

```bash
curl -X POST \
  'https://api.alfredoo.online/webhook/set/Alfredoo' \
  -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B' \
  -H 'Content-Type: application/json' \
  -d '{
    "url": "https://n8n.alfredoo.online/webhook-test/agente-financeiro",
    "webhook_by_events": true,
    "events": [
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE"
    ]
  }'
```

**Substitua:**
- `api.alfredoo.online` pela URL da sua Evolution API
- `Alfredoo` pelo nome da sua instância
- `webhook-test/agente-financeiro` pela URL do seu webhook no n8n

### Passo 3: Testar

1. **Envie uma mensagem REAL** para o número conectado
2. **Aguarde 5-10 segundos**
3. **Verifique no n8n**:
   - Vá em "Executions"
   - Deve aparecer uma nova execução
   - Se aparecer ✅ = Funcionou!
   - Se não aparecer ❌ = Verifique os passos anteriores

## 🔍 Se Ainda Não Funcionar

### Verificação 1: URL do Webhook no n8n

**No n8n:**
1. **Abra o workflow**
2. **Encontre o node "Webhook"**
3. **Copie a URL completa** (ex: `/webhook-test/agente-financeiro`)
4. **Use essa URL** no comando do Passo 2

### Verificação 2: Status da Instância

**No painel da Evolution API:**
1. **Verifique se a instância está "Connected"** (verde)
2. **Se não estiver**, reinicie:
   ```bash
   curl -X POST \
     'https://api.alfredoo.online/instance/restart/Alfredoo' \
     -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B'
   ```

### Verificação 3: Testar Webhook Manualmente

**Teste se o webhook está funcionando:**

```bash
curl -X POST https://n8n.alfredoo.online/webhook-test/agente-financeiro \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "instance": "Alfredoo",
    "data": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net",
        "id": "test123"
      },
      "message": {
        "conversation": "teste"
      }
    }
  }'
```

**Resultado esperado:**
- Se criar execução no n8n ✅ = Webhook está funcionando
- Se der erro ❌ = Problema no n8n ou URL errada

## 📋 Checklist Rápido

- [ ] Workflow está ATIVO no n8n (mais importante!)
- [ ] Webhook está configurado na Evolution API
- [ ] URL do webhook está correta
- [ ] Instância está "Connected"
- [ ] Teste manual funciona
- [ ] Mensagem real cria execução no n8n

## 🚀 Próximo Passo

**Se funcionou:**
- ✅ Mensagens devem começar a chegar no n8n
- ✅ Verifique se os dados estão sendo processados corretamente

**Se não funcionou:**
- ❌ Verifique os logs do n8n
- ❌ Verifique os logs da Evolution API
- ❌ Verifique se há bloqueios de firewall ou rede

---

**Última atualização:** 2025-01-11

**Dica:** 90% dos problemas são workflow inativo no n8n. Verifique primeiro isso!


# 🔍 Problema: Webhook Não Funciona Após Trocar Número

## 🎯 Situação

**Antes**: Tudo funcionava com as expressões atuais  
**Depois**: Após trocar o número, as mensagens não aparecem no n8n

## ✅ Diagnóstico

O problema **NÃO são as expressões** - elas estavam funcionando antes. O problema é que:

1. **O webhook não está recebendo eventos de mensagem** (`messages.upsert`)
2. **Apenas eventos de presença** (`presence.update`) estão chegando
3. **O webhook pode não estar configurado** corretamente para o novo número

## 🔧 Solução: Verificar Configuração do Webhook

### Passo 1: Verificar Webhook na Evolution API

O webhook precisa estar configurado para receber eventos de **mensagem**, não apenas eventos de presença.

1. **Acesse o painel da Evolution API**
2. **Vá em "Webhook" ou "Settings"**
3. **Verifique se os eventos estão configurados**:
   - ✅ `MESSAGES_UPSERT` (nova mensagem)
   - ✅ `MESSAGES_UPDATE` (mensagem atualizada)
   - ❌ `PRESENCE_UPDATE` (opcional - apenas status)

### Passo 2: Reconfigurar Webhook

Se o webhook não está configurado, configure novamente:

**URL do Webhook:**
```
https://n8n.alfredoo.online/webhook-test/agente-financeiro
```

**Eventos Necessários:**
- `MESSAGES_UPSERT` - **OBRIGATÓRIO** (mensagens recebidas)
- `MESSAGES_UPDATE` - Opcional (atualizações de mensagem)
- `PRESENCE_UPDATE` - Opcional (status de digitação)

### Passo 3: Configurar via API (Se necessário)

```bash
curl -X POST \
  'https://sua-evolution-api.com/webhook/set/Alfredoo' \
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
- `sua-evolution-api.com` pela URL da sua Evolution API
- `Alfredoo` pelo nome da sua instância (se diferente)

## 🔍 Verificar se Está Recebendo Mensagens

### Teste 1: Enviar Mensagem Real

1. **Envie uma mensagem REAL** para o novo número
2. **Não apenas digite** - envie a mensagem completa
3. **Aguarde alguns segundos**
4. **Verifique o n8n** - veja se recebeu o evento `messages.upsert`

### Teste 2: Verificar Logs do n8n

1. **Acesse o n8n**: `https://n8n.alfredoo.online`
2. **Vá em "Executions"** (Execuções)
3. **Procure por execuções recentes**
4. **Verifique se há eventos `messages.upsert`**

### Teste 3: Verificar Eventos no Node "InicioChat"

1. **Abra o node "InicioChat"**
2. **Execute manualmente** (se possível)
3. **Ou aguarde uma mensagem real**
4. **Verifique o OUTPUT**:
   - Se for `presence.update` = usuário está digitando (não é mensagem)
   - Se for `messages.upsert` = mensagem real recebida ✅

## 🐛 Problemas Comuns Após Trocar Número

### Problema 1: Webhook Não Está Configurado

**Sintoma**: Apenas eventos de presença chegam, não mensagens

**Solução**: 
1. Configure o webhook na Evolution API
2. Certifique-se de que os eventos `MESSAGES_UPSERT` estão habilitados
3. Teste enviando uma mensagem real

### Problema 2: Webhook Está Apontando para URL Errada

**Sintoma**: Nenhum evento chega no n8n

**Solução**:
1. Verifique a URL do webhook: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
2. Verifique se o n8n está acessível
3. Teste o webhook manualmente

### Problema 3: Instância Não Está Conectada

**Sintoma**: Status não está "Connected"

**Solução**:
1. Verifique se o número está conectado
2. Reconecte se necessário
3. Aguarde o status mudar para "Connected"

### Problema 4: Eventos Não Estão Habilitados

**Sintoma**: Apenas alguns eventos chegam

**Solução**:
1. Verifique quais eventos estão habilitados no webhook
2. Certifique-se de que `MESSAGES_UPSERT` está habilitado
3. Reconfigure o webhook se necessário

## 📋 Checklist de Verificação

### Evolution API

- [ ] Status está "Connected" (verde)
- [ ] Número está visível no painel
- [ ] Webhook está configurado
- [ ] URL do webhook está correta: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
- [ ] Eventos `MESSAGES_UPSERT` estão habilitados
- [ ] API Key está correta: `9262493C1311-4C8E-B6A1-84F123F1501B`

### n8n

- [ ] Workflow está ATIVO
- [ ] Node "InicioChat" está recebendo dados
- [ ] Webhook está configurado corretamente
- [ ] Eventos `messages.upsert` estão chegando (não apenas `presence.update`)
- [ ] Logs do n8n mostram eventos de mensagem

### Teste

- [ ] Enviei uma mensagem REAL (não apenas digitei)
- [ ] Verifiquei os logs do n8n
- [ ] Verifiquei se o evento é `messages.upsert`
- [ ] Verifiquei se os dados estão chegando

## 🧪 Teste Completo

### 1. Verificar Webhook

```bash
# Teste o webhook manualmente
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
      },
      "pushName": "Teste"
    }
  }'
```

### 2. Enviar Mensagem Real

1. **Envie uma mensagem** para o novo número do WhatsApp
2. **Aguarde 5-10 segundos**
3. **Verifique o n8n**:
   - Vá em "Executions"
   - Procure por execuções recentes
   - Verifique se o evento é `messages.upsert`

### 3. Verificar Dados

1. **Abra o node "InicioChat"**
2. **Veja o OUTPUT** da última execução
3. **Verifique**:
   - Se o evento é `messages.upsert` ✅
   - Se os dados estão no formato correto
   - Se o campo `body.data.key.remoteJid` existe

## 🚀 Solução Rápida

### Se o Webhook Não Está Configurado:

1. **Configure o webhook** na Evolution API:
   - URL: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
   - Eventos: `MESSAGES_UPSERT`, `MESSAGES_UPDATE`
2. **Teste enviando uma mensagem real**
3. **Verifique se o evento `messages.upsert`** chega no n8n

### Se o Webhook Está Configurado:

1. **Verifique se os eventos `MESSAGES_UPSERT`** estão habilitados
2. **Teste enviando uma mensagem real** (não apenas digite)
3. **Verifique os logs do n8n** para ver se está recebendo

## ⚠️ Importante

- **`presence.update`** = usuário está digitando (não é mensagem)
- **`messages.upsert`** = mensagem real recebida ✅
- **Para processar mensagens**, você precisa receber `messages.upsert`!

## 📞 Próximos Passos

1. **Verifique a configuração do webhook** na Evolution API
2. **Certifique-se de que os eventos `MESSAGES_UPSERT`** estão habilitados
3. **Teste enviando uma mensagem real** (não apenas digite)
4. **Verifique se o evento `messages.upsert`** chega no n8n
5. **Se não chegar**, reconfigure o webhook

---

**Última atualização:** 2025-01-11

**Conclusão:** O problema não são as expressões - elas estavam funcionando antes. O problema é que o webhook não está recebendo eventos de mensagem (`messages.upsert`) após trocar o número. Verifique a configuração do webhook na Evolution API.


# 🚨 Problema: Mensagens Não Chegam no n8n

## 🎯 Situação

**Problema:** As mensagens não estão nem sendo chamadas no n8n (não aparecem execuções).

## 🔍 Diagnóstico Passo a Passo

### ✅ Passo 1: Verificar se o Workflow Está ATIVO no n8n

**No n8n:**
1. **Acesse**: `https://n8n.alfredoo.online`
2. **Vá em "Workflows"**
3. **Encontre o workflow do WhatsApp**
4. **Verifique se está ATIVO**:
   - Deve ter um botão verde no canto superior direito
   - Se estiver inativo (cinza), **ATIVE** o workflow
   - Clique no botão de ativar/desativar

**⚠️ IMPORTANTE:** Se o workflow estiver inativo, nenhuma mensagem será processada!

### ✅ Passo 2: Verificar se o Node Webhook Está Configurado

**No workflow do n8n:**
1. **Abra o workflow**
2. **Encontre o node "Webhook"** (geralmente o primeiro node)
3. **Verifique a URL do webhook**:
   - Deve ser algo como: `/webhook-test/agente-financeiro`
   - Ou: `/webhook/agente-financeiro`
4. **Anote a URL completa**: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`

### ✅ Passo 3: Verificar Webhook na Evolution API

**No painel da Evolution API:**
1. **Acesse o painel da Evolution API**
2. **Localize a instância "Alfredoo"**
3. **Vá em "Webhook" ou "Settings"**
4. **Verifique se o webhook está configurado**:
   - **URL**: Deve ser `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
   - **Status**: Deve estar ativo/configurado
   - **Eventos**: Deve ter `MESSAGES_UPSERT` habilitado

### ✅ Passo 4: Verificar Status da Instância

**No painel da Evolution API:**
1. **Verifique o status da instância "Alfredoo"**:
   - Deve estar "Connected" (verde)
   - Se estiver "Disconnected" (vermelho), **reconecte**
2. **Verifique se o número está visível** no painel
3. **Verifique se há erros** ou avisos

### ✅ Passo 5: Testar Webhook Manualmente

**Teste se o webhook do n8n está funcionando:**

```bash
curl -X POST https://n8n.alfredoo.online/webhook-test/agente-financeiro \
  -H "Content-Type: application/json" \
  -d '{
    "event": "messages.upsert",
    "instance": "Alfredoo",
    "data": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net",
        "id": "test123",
        "fromMe": false
      },
      "message": {
        "conversation": "teste manual"
      },
      "pushName": "Teste",
      "messageTimestamp": 1705312200
    }
  }'
```

**Resultado esperado:**
- Se funcionar: Deve criar uma execução no n8n ✅
- Se não funcionar: Erro 404 ou timeout ❌

### ✅ Passo 6: Verificar Logs do n8n

**No n8n:**
1. **Vá em "Executions"** (Execuções)
2. **Verifique se há execuções recentes**:
   - Se não houver nenhuma execução = webhook não está sendo chamado
   - Se houver execuções antigas = webhook estava funcionando antes
3. **Verifique se há erros** nas execuções

## 🔧 Soluções

### Solução 1: Reconfigurar Webhook na Evolution API

**Se o webhook não está configurado ou está com URL errada:**

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
    ],
    "webhook_base64": false
  }'
```

**Substitua:**
- `api.alfredoo.online` pela URL da sua Evolution API
- `Alfredoo` pelo nome da sua instância
- `webhook-test/agente-financeiro` pela URL do seu webhook no n8n

### Solução 2: Ativar Workflow no n8n

**Se o workflow estiver inativo:**
1. **No n8n**, vá em "Workflows"
2. **Encontre o workflow do WhatsApp**
3. **Clique no botão de ativar** (deve ficar verde)
4. **Aguarde alguns segundos**
5. **Teste enviando uma mensagem**

### Solução 3: Reiniciar Instância da Evolution API

**Se a instância não está conectada:**

```bash
# Reiniciar instância
curl -X POST \
  'https://api.alfredoo.online/instance/restart/Alfredoo' \
  -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B'
```

**Ou via painel:**
1. **No painel da Evolution API**, encontre a instância "Alfredoo"
2. **Clique em "RESTART"** (botão verde)
3. **Aguarde** alguns segundos
4. **Verifique** se o status volta para "Connected"
5. **Teste** enviando uma mensagem

### Solução 4: Verificar URL do Webhook no n8n

**Se a URL do webhook estiver errada:**
1. **No n8n**, abra o workflow
2. **Encontre o node "Webhook"**
3. **Verifique a URL**:
   - Deve ser: `/webhook-test/agente-financeiro`
   - Ou: `/webhook/agente-financeiro`
4. **Copie a URL completa** (com o domínio)
5. **Use essa URL** na configuração do webhook da Evolution API

### Solução 5: Verificar Conectividade

**Se o n8n não está acessível:**
1. **Teste se o n8n está online**:
   ```bash
   curl https://n8n.alfredoo.online
   ```
2. **Teste se o webhook está acessível**:
   ```bash
   curl -X POST https://n8n.alfredoo.online/webhook-test/agente-financeiro
   ```
3. **Verifique se há bloqueios de firewall** ou rede
4. **Verifique se o n8n está rodando** no servidor

## 🧪 Teste Completo

### 1. Verificar Workflow no n8n
- [ ] Workflow está ATIVO
- [ ] Node Webhook está configurado
- [ ] URL do webhook está correta

### 2. Verificar Evolution API
- [ ] Instância está "Connected"
- [ ] Webhook está configurado
- [ ] URL do webhook está correta
- [ ] Eventos `MESSAGES_UPSERT` estão habilitados

### 3. Testar Webhook
- [ ] Teste manual funciona (cria execução no n8n)
- [ ] Envio de mensagem real funciona
- [ ] Execução aparece no n8n

### 4. Verificar Logs
- [ ] Logs do n8n mostram execuções
- [ ] Logs da Evolution API mostram eventos sendo enviados
- [ ] Não há erros nos logs

## 🐛 Problemas Comuns

### Problema 1: Workflow Está Inativo

**Sintoma:** Nenhuma execução aparece no n8n

**Solução:** Ative o workflow no n8n

### Problema 2: Webhook Não Está Configurado

**Sintoma:** Evolution API não está enviando eventos

**Solução:** Configure o webhook na Evolution API

### Problema 3: URL do Webhook Está Errada

**Sintoma:** Eventos não chegam no n8n

**Solução:** Verifique e corrija a URL do webhook

### Problema 4: Instância Não Está Conectada

**Sintoma:** Status não está "Connected"

**Solução:** Reinicie a instância da Evolution API

### Problema 5: n8n Não Está Acessível

**Sintoma:** Erro ao acessar o n8n ou webhook

**Solução:** Verifique se o n8n está rodando e acessível

## 📋 Checklist de Diagnóstico

### n8n
- [ ] Workflow está ATIVO ✅
- [ ] Node Webhook está configurado ✅
- [ ] URL do webhook está correta ✅
- [ ] Webhook está acessível (teste manual funciona) ✅
- [ ] Logs mostram execuções ✅

### Evolution API
- [ ] Instância está "Connected" ✅
- [ ] Webhook está configurado ✅
- [ ] URL do webhook está correta ✅
- [ ] Eventos `MESSAGES_UPSERT` estão habilitados ✅
- [ ] API Key está correta ✅

### Teste
- [ ] Enviei uma mensagem REAL ✅
- [ ] Execução aparece no n8n ✅
- [ ] Evento é `messages.upsert` ✅
- [ ] Dados estão chegando corretamente ✅

## 🚀 Próximos Passos

1. **Verifique se o workflow está ATIVO** no n8n (mais comum!)
2. **Verifique se o webhook está configurado** na Evolution API
3. **Teste o webhook manualmente** para ver se funciona
4. **Verifique os logs** do n8n e da Evolution API
5. **Reinicie a instância** se necessário

---

**Última atualização:** 2025-01-11

**Conclusão:** Se as mensagens não estão nem chegando no n8n, o problema mais comum é o workflow estar inativo ou o webhook não estar configurado. Verifique primeiro se o workflow está ATIVO no n8n!


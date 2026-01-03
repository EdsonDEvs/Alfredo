# 🔍 Como Verificar e Configurar Webhook na Evolution API

## 🎯 Objetivo

Verificar se o webhook está configurado corretamente para receber eventos de mensagem após trocar o número.

## 🔧 Passo 1: Verificar Webhook no Painel da Evolution API

### 1. Acessar o Painel

1. **Acesse o painel da Evolution API**
2. **Localize a instância "Alfredoo"**
3. **Procure por "Webhook" ou "Settings"**

### 2. Verificar Configuração

Verifique se o webhook está configurado com:

- **URL**: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
- **Eventos**: 
  - ✅ `MESSAGES_UPSERT` (obrigatório - mensagens recebidas)
  - ✅ `MESSAGES_UPDATE` (opcional - atualizações)
  - ⚠️ `PRESENCE_UPDATE` (opcional - status de digitação)

### 3. Verificar Status

- **Status**: Ativo/Configurado
- **Última execução**: Data/hora recente
- **Eventos recebidos**: Número de eventos

## 🔧 Passo 2: Configurar Webhook via API

Se o webhook não está configurado ou precisa ser reconfigurado:

### Método 1: Via cURL

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

### Método 2: Via Painel

1. **No painel da Evolution API**, vá em "Webhook"
2. **Configure**:
   - **URL**: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
   - **Eventos**: Selecione `MESSAGES_UPSERT` e `MESSAGES_UPDATE`
   - **Method**: `POST`
3. **Salve** a configuração

## 🔍 Passo 3: Verificar se Está Recebendo Eventos

### Teste 1: Enviar Mensagem Real

1. **Envie uma mensagem REAL** para o número conectado
2. **Não apenas digite** - envie a mensagem completa
3. **Aguarde 5-10 segundos**
4. **Verifique o n8n**:
   - Acesse: `https://n8n.alfredoo.online`
   - Vá em "Executions"
   - Procure por execuções recentes
   - Verifique se há um evento `messages.upsert`

### Teste 2: Verificar Logs da Evolution API

1. **No painel da Evolution API**, procure por "Logs" ou "Events"
2. **Verifique** se há eventos sendo enviados
3. **Verifique** se há erros ao enviar eventos

### Teste 3: Testar Webhook Manualmente

```bash
# Teste o webhook do n8n
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
        "conversation": "mensagem de teste"
      },
      "pushName": "Teste",
      "messageTimestamp": 1705312200
    }
  }'
```

## 🐛 Problemas Comuns

### Problema 1: Webhook Não Está Configurado

**Sintoma**: Nenhum evento chega no n8n

**Solução**: Configure o webhook na Evolution API

### Problema 2: Eventos Errados Estão Habilitados

**Sintoma**: Apenas eventos de presença chegam (`presence.update`)

**Solução**: Habilite eventos `MESSAGES_UPSERT` no webhook

### Problema 3: URL do Webhook Está Errada

**Sintoma**: Eventos não chegam no n8n

**Solução**: Verifique se a URL está correta: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`

### Problema 4: n8n Não Está Acessível

**Sintoma**: Erro ao enviar eventos

**Solução**: Verifique se o n8n está rodando e acessível

## 📋 Checklist de Verificação

### Evolution API

- [ ] Webhook está configurado
- [ ] URL está correta: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
- [ ] Eventos `MESSAGES_UPSERT` estão habilitados
- [ ] Eventos `MESSAGES_UPDATE` estão habilitados (opcional)
- [ ] Status do webhook está ativo
- [ ] Última execução foi recente

### n8n

- [ ] Workflow está ATIVO
- [ ] Node "InicioChat" está recebendo dados
- [ ] Webhook está configurado corretamente
- [ ] Eventos `messages.upsert` estão chegando
- [ ] Logs do n8n mostram eventos de mensagem

### Teste

- [ ] Enviei uma mensagem REAL
- [ ] Verifiquei os logs do n8n
- [ ] Verifiquei se o evento é `messages.upsert`
- [ ] Verifiquei se os dados estão chegando

## 🚀 Solução Rápida

### Se o Webhook Não Está Configurado:

1. **Configure o webhook** na Evolution API:
   ```bash
   curl -X POST \
     'https://api.alfredoo.online/webhook/set/Alfredoo' \
     -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B' \
     -H 'Content-Type: application/json' \
     -d '{
       "url": "https://n8n.alfredoo.online/webhook-test/agente-financeiro",
       "webhook_by_events": true,
       "events": ["MESSAGES_UPSERT", "MESSAGES_UPDATE"]
     }'
   ```

2. **Teste enviando uma mensagem real**

3. **Verifique se o evento `messages.upsert`** chega no n8n

### Se o Webhook Está Configurado:

1. **Verifique se os eventos `MESSAGES_UPSERT`** estão habilitados
2. **Teste enviando uma mensagem real** (não apenas digite)
3. **Verifique os logs do n8n** para ver se está recebendo

## 🔐 Verificar API Key

A API Key `9262493C1311-4C8E-B6A1-84F123F1501B` deve estar correta:

1. **No painel da Evolution API**, verifique a API Key
2. **Compare** com a que você está usando
3. **Se necessário**, gere uma nova API Key

## 📞 Próximos Passos

1. **Verifique a configuração do webhook** na Evolution API
2. **Certifique-se de que os eventos `MESSAGES_UPSERT`** estão habilitados
3. **Teste enviando uma mensagem real** (não apenas digite)
4. **Verifique se o evento `messages.upsert`** chega no n8n
5. **Se não chegar**, reconfigure o webhook

---

**Última atualização:** 2025-01-11

**Nota:** Após trocar o número, o webhook pode precisar ser reconfigurado. Verifique se os eventos `MESSAGES_UPSERT` estão habilitados.


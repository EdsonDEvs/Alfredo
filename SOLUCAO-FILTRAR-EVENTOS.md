# ✅ Solução: Filtrar Eventos de Presença

## 🎯 Problema

O evento `presence.update` (usuário digitando) está chegando, mas não tem mensagem. Você precisa processar apenas `messages.upsert` (mensagens reais).

## ✅ Solução: Adicionar Node "IF" para Filtrar

### Passo 1: Adicionar Node "IF"

1. **No workflow do n8n**, adicione um node "IF" após "InicioChat"
2. **Nomeie o node**: "Filtrar Eventos"
3. **Conecte**: InicioChat → Filtrar Eventos → Organiza Dados

### Passo 2: Configurar Condição

No node "IF", configure:

**Condição**:
```
{{ $json.body.event }} === 'messages.upsert'
```

**Ou use**:
```
{{ $json.body.event }} !== 'presence.update'
```

### Passo 3: Conectar Nodes

1. **Quando TRUE** (é mensagem real): Conecte para "Organiza Dados"
2. **Quando FALSE** (é presença): Não conecte nada (ou conecte para um node que não faz nada)

## 🔧 Expressões Corretas para `messages.upsert`

Depois do filtro, no node "Organiza Dados", use:

```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.key.id }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
userId: {{ $('Auth').item.json.id }}
```

## 🧪 Teste

1. **Envie uma mensagem REAL** (pressione Enter)
2. **Verifique se o evento** é `messages.upsert`
3. **Verifique se passa** pelo filtro (node IF)
4. **Verifique se os campos** estão preenchidos no "Organiza Dados"

## 📋 Fluxo Correto

```
InicioChat (Webhook)
    ↓
Filtrar Eventos (IF) → Se event === 'messages.upsert'
    ↓
Organiza Dados → Extrair dados da mensagem
    ↓
Verifica Usuario → Buscar usuário no Supabase
    ↓
Enviar texto → Responder mensagem
```

## 🐛 Se Ainda Não Funcionar

### Problema: Apenas `presence.update` aparece

**Causa**: Você está apenas digitando, não enviando mensagens

**Solução**: 
1. Envie uma mensagem REAL (pressione Enter)
2. Aguarde alguns segundos
3. Verifique se `messages.upsert` aparece

### Problema: Mensagens não chegam

**Causa**: Webhook não está recebendo eventos de mensagem

**Solução**:
1. Verifique se `MESSAGES_UPSERT` está habilitado ✅ (já está)
2. Verifique se o número está conectado
3. Teste enviando de outro número

---

**Última atualização:** 2025-01-11

**Próximo passo:** Adicione o node "IF" para filtrar eventos e teste enviando uma mensagem real.


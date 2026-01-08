# ✅ Solução Final: Estrutura Real dos Dados

## 🎯 Estrutura Real Identificada

### Evento 1: `presence.update` (Usuário Digitando)
```json
{
  "event": "presence.update",
  "instance": "Alfredoo",
  "data": {
    "id": "100640277659847@lid",
    "presences": {...}
  },
  "sender": "553197599924@s.whatsapp.net"
}
```
**⚠️ Este evento NÃO tem mensagem! Deve ser ignorado.**

### Evento 2: `messages.upsert` (Mensagem Real)
```json
{
  "headers": {...},
  "body": {
    "event": "messages.upsert",
    "instance": "Alfredoo",
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net"
      },
      "message": {
        "conversation": "texto da mensagem"
      },
      "pushName": "Nome do Usuário"
    }
  }
}
```
**✅ Este evento tem mensagem! Deve ser processado.**

## ✅ Solução: Node Function Ajustado

### Passo 1: Adicionar Node "IF" para Filtrar Eventos

**Após o node "InicioChat", adicione um node "IF":**

1. **Condição:**
```
{{ $json.body?.event !== 'presence.update' && $json.event !== 'presence.update' }}
```

2. **Quando TRUE**: Conecte para o próximo node
3. **Quando FALSE**: Não processa (eventos de presença não têm mensagem)

### Passo 2: Adicionar Node Function

**Após o node "IF", adicione um node "Function" com este código:**

```javascript
// Normalizar dados da Evolution API - Estrutura real identificada
const input = $input.first().json;

// Verificar se os dados estão em body (webhook) ou direto
const body = input.body || input;
const event = body.event || input.event || '';

// Se for evento de presença, pular
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: '',
      userId: null,
      skip: true,
      event: event
    }
  };
}

// Para eventos de mensagem (messages.upsert)
const data = body.data || input.data || body;

// Extrair número do WhatsApp
let whatsapp = '';
if (data?.key?.remoteJid) {
  // Estrutura: messages.upsert
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .trim();
} else if (input.sender) {
  // Estrutura: presence.update (fallback)
  whatsapp = String(input.sender)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .trim();
}

// Extrair mensagem
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data?.messageText) {
  mensagem = data.messageText;
}

// Extrair nome
const firstname = data?.pushName || data?.notifyName || data?.name || 'Usuário';

// Extrair tipo de mensagem
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
else if (data?.message?.audioMessage) tipo = 'audio';
else if (data?.message?.videoMessage) tipo = 'video';
else if (data?.message?.documentMessage) tipo = 'document';
else if (data?.messageType) tipo = data.messageType;
else if (mensagem) tipo = 'text';

// Extrair ID da mensagem
const messageId = data?.key?.id || data?.id || data?.messageId || '';

// Retornar dados normalizados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    event: event,
    skip: false
  }
};
```

### Passo 3: Ajustar Node "Organiza Dados"

**Use expressões simples:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔧 Se Preferir Ajustar Expressões Diretamente (Sem Node Function)

### Expressões Corretas para `messages.upsert`:

**No node "Organiza Dados", use:**

```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.key.id || '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### ⚠️ IMPORTANTE: Filtrar Eventos de Presença

**Antes do "Organiza Dados", adicione um node "IF":**

1. **Condição:**
```
{{ $json.body?.event === 'messages.upsert' || $json.event === 'messages.upsert' }}
```

2. **Quando TRUE**: Processa mensagem
3. **Quando FALSE**: Não processa (evento de presença)

## 📋 Fluxo Correto do Workflow

```
InicioChat (Webhook)
    ↓
IF (Filtrar presence.update)
    ↓ (TRUE = messages.upsert)
Function (Normalizar Dados)
    ↓
Organiza Dados
    ↓
Verifica Usuario
    ↓
Enviar texto
```

## 🧪 Testar

1. **Envie uma mensagem REAL** no WhatsApp (não apenas digite)
2. **Aguarde o evento `messages.upsert`** (não `presence.update`)
3. **Verifique se os dados são extraídos corretamente**
4. **Teste o workflow completo**

## ✅ Checklist

- [ ] Node "IF" adicionado para filtrar `presence.update`
- [ ] Node "Function" adicionado com código ajustado
- [ ] Expressões do "Organiza Dados" ajustadas
- [ ] Teste com mensagem real (`messages.upsert`)
- [ ] Campos não estão mais `null`
- [ ] Workflow completo testado

## 🚀 Próximo Passo

**Depois de implementar:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se o evento é `messages.upsert`** (não `presence.update`)
3. **Verifique se os dados são extraídos corretamente**
4. **Verifique se o workflow funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** A estrutura real é `body.data.key.remoteJid` para `messages.upsert`. Eventos `presence.update` devem ser filtrados porque não têm mensagem.


# ✅ Corrigir Expressões do Node "Organiza Dados"

## 🎯 Estrutura Real dos Dados

Baseado no OUTPUT do node "InicioChat", a estrutura é:

```json
{
  "body": {
    "event": "presence.update",
    "instance": "Alfredoo",
    "data": {
      "sender": "553197599924@s.whatsapp.net",
      "id": "...",
      "presences": "...",
      "lastKnownPresence": "composing",
      "date_time": "2025-11-11T19:27:40.5242",
      "apikey": "9262493C1311-4C8E-B6A1-84F123F1501B"
    }
  }
}
```

## ⚠️ Observação Importante

O evento mostrado é `presence.update` (usuário está digitando), não uma mensagem real. Para mensagens, o evento será `messages.upsert` ou `messages.update`.

## ✅ Expressões Corretas para o Node "Organiza Dados"

### Expressões Atualizadas:

```
whatsapp: {{ $('InicioChat').item.json.body.data.sender.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message?.conversation || $('InicioChat').item.json.body.data.message?.extendedTextMessage?.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.id || $('InicioChat').item.json.body.data.messageId || '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || $('InicioChat').item.json.body.data.notifyName || 'Usuário' }}
userId: {{ $('Auth').item.json.id }}
```

### Versão Simplificada (Recomendada):

Se você adicionar um node Function antes (como sugerido), use estas expressões simples:

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Auth').item.json.id }}
```

## 🔧 Node Function Ajustado para Esta Estrutura

```javascript
// Normalizar dados da Evolution API - Ajustado para estrutura real
const input = $input.first().json;
const body = input.body || input;

// Verificar tipo de evento
const event = body.event || '';

// Se for evento de presença, não processar (ou processar diferente)
if (event === 'presence.update') {
  // Evento de presença - usuário está digitando
  // Não é uma mensagem, então retornar dados vazios ou pular
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: '',
      userId: null,
      event: event,
      skip: true // Flag para pular processamento
    }
  };
}

// Para eventos de mensagem (messages.upsert, messages.update)
const data = body.data || body;

// Extrair número do WhatsApp
let whatsapp = '';
if (data.sender) {
  whatsapp = data.sender
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '');
} else if (data.key?.remoteJid) {
  whatsapp = data.key.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '');
}

// Extrair mensagem
let mensagem = '';
if (data.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data.messageText) {
  mensagem = data.messageText;
} else if (data.text) {
  mensagem = data.text;
}

// Extrair nome
const firstname = data.pushName || data.notifyName || data.name || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data.message?.imageMessage) tipo = 'image';
else if (data.message?.audioMessage) tipo = 'audio';
else if (data.message?.videoMessage) tipo = 'video';
else if (data.message?.documentMessage) tipo = 'document';
else if (data.messageType) tipo = data.messageType;
else if (data.message?.conversation || data.message?.extendedTextMessage) tipo = 'text';

// Extrair ID
const messageId = data.id || data.key?.id || data.messageId || '';

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

## 🔍 Filtrar Eventos de Presença

### Opção 1: Adicionar Node "IF" após "InicioChat"

1. **Adicione um node "IF"** após "InicioChat"
2. **Configure a condição**:
   ```
   {{ $json.body.event }} !== 'presence.update'
   ```
3. **Conecte apenas quando TRUE** para o próximo node
4. **Quando FALSE**, não processa (ou processa diferente)

### Opção 2: Filtrar no Node Function

O código acima já filtra eventos de presença e retorna `skip: true`. No próximo node, verifique:

```
{{ $json.skip === false }}
```

## 📋 Estrutura para Diferentes Eventos

### Evento: `presence.update` (usuário digitando)
```json
{
  "body": {
    "event": "presence.update",
    "data": {
      "sender": "553197599924@s.whatsapp.net",
      "lastKnownPresence": "composing"
    }
  }
}
```
**Ação**: Pular ou processar diferente (não é mensagem)

### Evento: `messages.upsert` (nova mensagem)
```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553197599924@s.whatsapp.net",
        "id": "message_id"
      },
      "message": {
        "conversation": "texto da mensagem"
      },
      "pushName": "Nome do Usuário"
    }
  }
}
```
**Ação**: Processar normalmente

### Evento: `messages.update` (atualização de mensagem)
```json
{
  "body": {
    "event": "messages.update",
    "data": {
      "key": {
        "remoteJid": "553197599924@s.whatsapp.net",
        "id": "message_id"
      },
      "update": {
        "status": "read"
      }
    }
  }
}
```
**Ação**: Processar conforme necessário

## ✅ Solução Completa

### Passo 1: Adicionar Node "IF" para Filtrar

1. **Adicione node "IF"** após "InicioChat"
2. **Condição**: `{{ $json.body.event }} !== 'presence.update'`
3. **Conecte quando TRUE** para o próximo node

### Passo 2: Adicionar Node Function

1. **Adicione node "Function"** após o "IF"
2. **Cole o código acima** (ajustado para estrutura real)
3. **Conecte** para o "Organiza Dados"

### Passo 3: Ajustar Node "Organiza Dados"

Use expressões simples:
```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Auth').item.json.id }}
```

## 🧪 Testar

1. **Envie uma mensagem real** para o número
2. **Verifique se o evento** é `messages.upsert` (não `presence.update`)
3. **Verifique se os dados** são extraídos corretamente
4. **Verifique se os campos** não estão mais `null`

## 🐛 Se Ainda Não Funcionar

1. **Verifique se o webhook está configurado** para receber eventos de mensagem
2. **Verifique se a Evolution API está enviando** eventos `messages.upsert`
3. **Verifique os logs** do n8n para ver todos os eventos recebidos
4. **Teste enviando uma mensagem real** (não apenas digitar)

---

**Última atualização:** 2025-01-11

**Nota:** O evento `presence.update` é normal (usuário digitando), mas não contém a mensagem. Você precisa receber o evento `messages.upsert` para processar mensagens reais.


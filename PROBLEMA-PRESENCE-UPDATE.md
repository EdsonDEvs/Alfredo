# 🚨 Problema: Evento `presence.update` Não Tem Dados de Mensagem

## 🎯 Problema Identificado

**Evento recebido:** `presence.update` (usuário digitando)  
**Problema:** Este evento NÃO tem:
- `body.data.key.remoteJid` (número do cliente)
- `body.data.message` (mensagem)
- `body.data.pushName` (nome)

**Resultado:** Todas as expressões retornam `undefined` e campos ficam `null`

## 📊 Estrutura do Evento `presence.update`

```json
{
  "body": {
    "event": "presence.update",
    "instance": "Alfredoo",
    "data": {
      "id": "100640277659847@lid",
      "presences": {
        "100640277659847@lid": {
          "lastKnownPresence": "composing"
        }
      }
    },
    "sender": "553197599924@s.whatsapp.net"  // ⚠️ Número do BOT (não do cliente)
  }
}
```

**Campos que NÃO existem:**
- ❌ `body.data.key.remoteJid` (número do cliente)
- ❌ `body.data.message` (mensagem)
- ❌ `body.data.pushName` (nome)
- ❌ `body.data.messageType` (tipo)

**Campo que existe:**
- ✅ `body.sender` = `553197599924@s.whatsapp.net` (número do BOT, não do cliente)

## ✅ Solução: Processar Apenas `messages.upsert`

### Problema:

O evento `presence.update` é apenas status de digitação (usuário está digitando). **Não é uma mensagem real!**

### Solução 1: Filtrar no Node "Organiza Dados" (Sem Adicionar Node IF)

**No node "Organiza Dados", adicione uma condição nos campos:**

#### Campo: `whatsapp`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') : '' }}
```

#### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '') : '' }}
```

#### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.messageType || 'text') : 'presence' }}
```

#### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.id || '') : '' }}
```

#### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.pushName || 'Usuário') : 'Usuário' }}
```

#### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

### Solução 2: Adicionar Node Function (Mais Robusta)

**Adicione um node "Function" antes do "Organiza Dados":**

```javascript
const input = $input.first().json;
const body = input.body || {};
const event = body.event || '';

// Se for presence.update, retornar dados vazios (não processar)
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: 'Usuário',
      userId: null,
      skip: true,
      event: event
    }
  };
}

// Para messages.upsert, extrair dados
const data = body.data || {};

// Extrair número do WhatsApp
let whatsapp = '';
if (data.key && data.key.remoteJid) {
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .trim();
}

// Extrair mensagem
let mensagem = '';
if (data.message && data.message.conversation) {
  mensagem = data.message.conversation;
} else if (data.message && data.message.extendedTextMessage) {
  mensagem = data.message.extendedTextMessage.text || '';
}

// Extrair nome
const firstname = data.pushName || 'Usuário';

// Extrair tipo
let tipo = data.messageType || 'text';

// Extrair ID
const messageId = (data.key && data.key.id) || '';

// Retornar dados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    skip: false,
    event: event
  }
};
```

**Depois, no "Organiza Dados", use expressões simples:**
```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### Solução 3: Verificar se Mensagem Está Vazia no Próximo Node

**No node após "Organiza Dados", adicione verificação:**

**Node "IF" ou condição:**
```
{{ $json.mensagem && $json.mensagem !== '' && $json.whatsapp && $json.whatsapp !== '' }}
```

**Quando TRUE:** Processa (tem mensagem e número)  
**Quando FALSE:** Não processa (presence.update ou dados vazios)

## 🧪 Testar

1. **Envie uma mensagem REAL** no WhatsApp (não apenas digite)
2. **Aguarde o evento `messages.upsert`** (não `presence.update`)
3. **Verifique se os dados são extraídos** corretamente
4. **Verifique se o campo `whatsapp`** não está mais `null`

## 📋 Checklist

- [ ] Evento recebido é `messages.upsert` (não `presence.update`)
- [ ] Expressões estão verificando o tipo de evento
- [ ] Ou node Function está filtrando `presence.update`
- [ ] Ou próximo node está verificando se mensagem não está vazia
- [ ] Campo `whatsapp` não está mais `null`
- [ ] Workflow funciona com mensagens reais

## 🚀 Próximo Passo

**Depois de implementar:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se o evento é `messages.upsert`**
3. **Verifique se os dados são extraídos corretamente**
4. **Verifique se o workflow funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** O evento `presence.update` não tem dados de mensagem. Você precisa processar apenas eventos `messages.upsert` (mensagens reais). Use uma das soluções acima para filtrar ou lidar com `presence.update`.



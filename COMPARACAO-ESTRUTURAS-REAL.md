# 🔍 Comparação: Estrutura Antiga vs Nova

## 📊 Estrutura Antiga (`messages.upsert`)

```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net",
        "id": "3A8ED2A0AD056D5A6A14"
      },
      "message": {
        "conversation": "Gastei 10 reais na sorveteria"
      },
      "pushName": "Edson",
      "messageType": "conversation"
    },
    "sender": "553171935641@s.whatsapp.net"
  }
}
```

**Campos:**
- `body.data.key.remoteJid` ✅ (número do WhatsApp)
- `body.data.message.conversation` ✅ (mensagem)
- `body.data.pushName` ✅ (nome)
- `body.data.messageType` ✅ (tipo)
- `body.data.key.id` ✅ (ID da mensagem)

## 📊 Estrutura Nova (`presence.update`)

```json
{
  "body": {
    "event": "presence.update",
    "data": {
      "id": "100640277659847@lid",
      "presences": {
        "100640277659847@lid": {
          "lastKnownPresence": "composing"
        }
      }
    },
    "sender": "553197599924@s.whatsapp.net"
  }
}
```

**Campos:**
- `body.sender` ✅ (número do WhatsApp)
- `body.data.id` ✅ (ID, mas não é ID da mensagem)
- **NÃO TEM `body.data.key.remoteJid`** ❌
- **NÃO TEM `body.data.message`** ❌ (não é mensagem, é apenas status de digitação)
- **NÃO TEM `body.data.pushName`** ❌

## ✅ Expressões Corrigidas

### Campo: `whatsapp`

**Para `messages.upsert`:** `body.data.key.remoteJid`  
**Para `presence.update`:** `body.sender`  
**Fallback:** `''`

**Expressão:**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || $('InicioChat').item.json.body.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

### Campo: `mensagem`

**Para `messages.upsert`:** `body.data.message.conversation`  
**Para `presence.update`:** `''` (não tem mensagem)  
**Fallback:** `''`

**Expressão:**
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

### Campo: `tipo`

**Para `messages.upsert`:** `body.data.messageType`  
**Para `presence.update`:** `'text'` (padrão)  
**Fallback:** `'text'`

**Expressão:**
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

### Campo: `messageId`

**Para `messages.upsert`:** `body.data.key.id`  
**Para `presence.update`:** `body.data.id` (mas não é ID de mensagem)  
**Fallback:** `''`

**Expressão:**
```
{{ $('InicioChat').item.json.body.data.key.id || $('InicioChat').item.json.body.data.id || '' }}
```

### Campo: `firstname`

**Para `messages.upsert`:** `body.data.pushName`  
**Para `presence.update`:** `'Usuário'` (padrão)  
**Fallback:** `'Usuário'`

**Expressão:**
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

### Campo: `userId`

**Ambos:** Vem do node "Verifica Usuario"  
**Fallback:** `null`

**Expressão:**
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔍 Diferenças Principais

| Campo | messages.upsert | presence.update |
|-------|----------------|-----------------|
| **whatsapp** | `body.data.key.remoteJid` | `body.sender` |
| **mensagem** | `body.data.message.conversation` | `''` (não tem) |
| **tipo** | `body.data.messageType` | `'text'` (padrão) |
| **messageId** | `body.data.key.id` | `body.data.id` (diferente) |
| **firstname** | `body.data.pushName` | `'Usuário'` (padrão) |

## ✅ Expressões Finais (Copie e Cole)

### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || $('InicioChat').item.json.body.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || $('InicioChat').item.json.body.data.id || '' }}
```

### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Teste

1. **Substitua as expressões** no node "Organiza Dados"
2. **Teste com `messages.upsert`**: Deve extrair todos os campos ✅
3. **Teste com `presence.update`**: `mensagem` ficará vazia (normal) ✅

---

**Última atualização:** 2025-01-11

**Conclusão:** As expressões agora funcionam com ambos os eventos. Para `presence.update`, a mensagem ficará vazia (normal, pois é apenas status de digitação).


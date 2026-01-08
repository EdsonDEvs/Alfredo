# ✅ Solução Final: Corrigir Node "Organiza Dados"

## 🎯 Problema Identificado

1. **Estrutura dos dados**: `body.data.sender` (não `body.data.key.remoteJid`)
2. **Evento atual**: `presence.update` (usuário digitando, não mensagem)
3. **Expressões incorretas**: Caminho JSON está errado

## ✅ Solução em 3 Passos

### Passo 1: Filtrar Eventos de Presença

**Adicione um node "IF" após "InicioChat":**

1. **Node**: "IF"
2. **Condição**: 
   ```
   {{ $json.body.event }} !== 'presence.update'
   ```
3. **Conecte quando TRUE** para o próximo node
4. **Quando FALSE**, não processa (eventos de presença não são mensagens)

### Passo 2: Adicionar Node Function para Normalizar

**Adicione um node "Function" após o "IF":**

```javascript
// Normalizar dados - estrutura real: body.data.sender
const input = $input.first().json;
const body = input.body || input;
const data = body.data || body;

// Extrair número do WhatsApp
let whatsapp = '';
if (data.sender) {
  whatsapp = data.sender.replace('@s.whatsapp.net', '').replace('@g.us', '');
} else if (data.key?.remoteJid) {
  whatsapp = data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
}

// Extrair mensagem
let mensagem = '';
if (data.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
}

// Extrair nome
const firstname = data.pushName || data.notifyName || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data.message?.imageMessage) tipo = 'image';
else if (data.message?.audioMessage) tipo = 'audio';
else if (data.messageType) tipo = data.messageType;

// Extrair ID
const messageId = data.id || data.key?.id || '';

return {
  json: {
    whatsapp, mensagem, tipo, messageId, firstname, userId: null
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
userId: {{ $('Auth').item.json.id }}
```

## 🔧 Se Preferir Corrigir Direto (Sem Node Function)

**Ajuste as expressões no "Organiza Dados" para:**

```
whatsapp: {{ $('InicioChat').item.json.body.data.sender.replace('@s.whatsapp.net', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message?.conversation || $('InicioChat').item.json.body.data.message?.extendedTextMessage?.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.id || $('InicioChat').item.json.body.data.key?.id || '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || $('InicioChat').item.json.body.data.notifyName || 'Usuário' }}
userId: {{ $('Auth').item.json.id }}
```

## ⚠️ Importante: Eventos de Mensagem vs Presença

- **`presence.update`**: Usuário está digitando (não tem mensagem)
- **`messages.upsert`**: Nova mensagem recebida ✅
- **`messages.update`**: Mensagem atualizada

**Para processar mensagens, você precisa receber `messages.upsert`!**

## 🧪 Teste

1. **Envie uma mensagem REAL** (não apenas digite)
2. **Verifique se o evento** é `messages.upsert`
3. **Verifique se os campos** não estão mais `null`
4. **Teste o workflow completo**

---

**Última atualização:** 2025-01-11

**Próximo passo:** Adicione o node "IF" para filtrar eventos de presença e ajuste as expressões conforme acima.


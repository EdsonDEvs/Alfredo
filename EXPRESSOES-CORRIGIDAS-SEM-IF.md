# ✅ Expressões Corrigidas (Sem Adicionar Node IF)

## 🎯 Objetivo

Corrigir as expressões no node "Organiza Dados" para funcionar com a estrutura atual, **sem adicionar node IF**.

## ✅ Expressões Corrigidas

### Versão com Optional Chaining (`?.`)

**Use estas expressões no node "Organiza Dados":**

```
whatsapp: {{ ($('InicioChat').item.json.body?.data?.key?.remoteJid || $('InicioChat').item.json.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '') }}
mensagem: {{ $('InicioChat').item.json.body?.data?.message?.conversation || $('InicioChat').item.json.body?.data?.message?.extendedTextMessage?.text || '' }}
tipo: {{ $('InicioChat').item.json.body?.data?.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body?.data?.key?.id || $('InicioChat').item.json.data?.id || '' }}
firstname: {{ $('InicioChat').item.json.body?.data?.pushName || 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### Versão Simplificada (Mais Legível)

**Se o n8n não suportar `?.`, use estas:**

```
whatsapp: {{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.remoteJid) ? $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') : ($('InicioChat').item.json.sender ? $('InicioChat').item.json.sender.replace('@s.whatsapp.net', '').replace('@g.us', '') : '') }}
mensagem: {{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.message) ? ($('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage && $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '') : '' }}
tipo: {{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.messageType) ? $('InicioChat').item.json.body.data.messageType : 'text' }}
messageId: {{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.id) ? $('InicioChat').item.json.body.data.key.id : ($('InicioChat').item.json.data && $('InicioChat').item.json.data.id ? $('InicioChat').item.json.data.id : '') }}
firstname: {{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.pushName) ? $('InicioChat').item.json.body.data.pushName : 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔧 Versão Mais Simples (Recomendada)

**Use um node Function ANTES do "Organiza Dados" (mas não é IF, é Function):**

### Node Function: Normalizar Dados

**Código:**
```javascript
const input = $input.first().json;
const body = input.body || {};
const event = body.event || input.event || '';

// Para messages.upsert
let whatsapp = '';
if (body.data && body.data.key && body.data.key.remoteJid) {
  whatsapp = body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');
} else if (input.sender) {
  // Para presence.update (não tem mensagem, mas tem sender)
  whatsapp = input.sender.replace('@s.whatsapp.net', '').replace('@g.us', '');
}

// Mensagem (só existe em messages.upsert)
let mensagem = '';
if (body.data && body.data.message) {
  mensagem = body.data.message.conversation || 
             (body.data.message.extendedTextMessage && body.data.message.extendedTextMessage.text) || 
             '';
}

// Se não tem mensagem, é presence.update - retornar dados vazios
if (!mensagem && event === 'presence.update') {
  return {
    json: {
      whatsapp: whatsapp,
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: 'Usuário',
      userId: null,
      skip: true
    }
  };
}

// Dados para messages.upsert
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: body.data && body.data.messageType ? body.data.messageType : 'text',
    messageId: (body.data && body.data.key && body.data.key.id) || '',
    firstname: (body.data && body.data.pushName) || 'Usuário',
    userId: null,
    skip: false
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

## 🧪 Testar

1. **Ajuste as expressões** no "Organiza Dados"
2. **Execute o node** manualmente
3. **Verifique se os campos** não estão mais `undefined`
4. **Teste com mensagem real** no WhatsApp

## 📋 Checklist

- [ ] Expressões ajustadas no "Organiza Dados"
- [ ] Teste com mensagem real (`messages.upsert`)
- [ ] Campos não estão mais `undefined`
- [ ] Workflow completo testado

---

**Última atualização:** 2025-01-11

**Conclusão:** Use expressões com fallbacks ou adicione um node Function (não IF) para normalizar os dados. Isso funciona com ambos os formatos sem precisar filtrar eventos.


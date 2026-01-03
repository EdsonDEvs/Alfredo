# ⚡ Solução Rápida: Expressões Retornando `undefined`

## 🚨 Problema

Todas as expressões no node "Organiza Dados" retornam `undefined`:
- `{{ $('InicioChat').item.json.body.data.key.remoteJid }}` = `undefined`
- Todos os outros campos = `undefined`

## ✅ Solução em 2 Opções

### Opção 1: Solução Rápida (Recomendada) - Adicionar Node Function

**Esta solução funciona com qualquer estrutura de dados!**

#### Passo 1: Adicionar Node Function

1. **No n8n**, adicione um node "Function" entre "InicioChat" e "Organiza Dados"
2. **Nomeie como "Normalizar Dados"**
3. **Cole este código:**

```javascript
// Normalizar dados da Evolution API - Funciona com qualquer estrutura
const input = $input.first().json;

// Encontrar os dados (funciona com qualquer estrutura)
function findData(obj) {
  if (obj?.body?.data?.key?.remoteJid) return obj.body.data;
  if (obj?.body?.data?.sender) return obj.body.data;
  if (obj?.body?.data?.message) return obj.body.data;
  if (obj?.data?.key?.remoteJid) return obj.data;
  if (obj?.data?.sender) return obj.data;
  if (obj?.key?.remoteJid) return obj;
  if (obj?.sender) return obj;
  return obj;
}

const data = findData(input);
const body = input.body || {};
const event = body.event || input.event || '';

// Se for evento de presença, pular
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '', mensagem: '', tipo: 'presence', messageId: '', firstname: '', userId: null, skip: true
    }
  };
}

// Extrair número do WhatsApp
let whatsapp = '';
const remoteJid = data?.key?.remoteJid || data?.sender || data?.remoteJid || data?.from || '';
if (remoteJid) {
  whatsapp = String(remoteJid).replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').replace('@', '').trim();
}

// Extrair mensagem
let mensagem = '';
if (data?.message?.conversation) mensagem = data.message.conversation;
else if (data?.message?.extendedTextMessage?.text) mensagem = data.message.extendedTextMessage.text;
else if (data?.messageText) mensagem = data.messageText;
else if (data?.text) mensagem = data.text;
else if (data?.body) mensagem = data.body;

// Extrair nome
const firstname = data?.pushName || data?.notifyName || data?.name || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
else if (data?.message?.audioMessage) tipo = 'audio';
else if (data?.message?.videoMessage) tipo = 'video';
else if (data?.message?.documentMessage) tipo = 'document';
else if (data?.messageType) tipo = data.messageType;
else if (mensagem) tipo = 'text';

// Extrair ID
const messageId = data?.key?.id || data?.id || data?.messageId || '';

return {
  json: {
    whatsapp, mensagem, tipo, messageId, firstname, userId: null, event, skip: false
  }
};
```

#### Passo 2: Conectar os Nodes

1. **Conecte:** "InicioChat" → "Normalizar Dados" → "Organiza Dados"

#### Passo 3: Ajustar Node "Organiza Dados"

**Mude as expressões para:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

**Pronto! Agora deve funcionar! ✅**

---

### Opção 2: Descobrir Estrutura Real e Ajustar Expressões

**Se preferir descobrir a estrutura real:**

#### Passo 1: Ver Dados do "InicioChat"

1. **Clique no node "InicioChat"**
2. **Veja o OUTPUT** (lado direito)
3. **Clique na aba "JSON"**
4. **Expanda todos os campos**
5. **Encontre onde está o número do WhatsApp**

#### Passo 2: Testar Expressões

**Teste estas expressões uma de cada vez no "Organiza Dados":**

**Teste 1:**
```
whatsapp: {{ $('InicioChat').item.json.key.remoteJid }}
```

**Teste 2:**
```
whatsapp: {{ $('InicioChat').item.json.body.key.remoteJid }}
```

**Teste 3:**
```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid }}
```

**Teste 4:**
```
whatsapp: {{ $('InicioChat').item.json.body.data.sender }}
```

**Teste 5:**
```
whatsapp: {{ $('InicioChat').item.json.data.key.remoteJid }}
```

**Quando uma funcionar (não retornar `undefined`), use esse caminho!**

#### Passo 3: Ajustar Todas as Expressões

**Depois de encontrar o caminho correto, ajuste todas as expressões:**

**Exemplo se o caminho for `json.body.data.key.remoteJid`:**
```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.key.id || '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

---

## 🧪 Testar

1. **Execute o workflow** (ou aguarde uma mensagem)
2. **Verifique o OUTPUT** do node "Organiza Dados"
3. **Verifique se os campos** não estão mais `[null]`
4. **Teste o workflow completo**

## 📋 Checklist

- [ ] Adicionei node "Function" (Opção 1) OU descobri a estrutura real (Opção 2)
- [ ] Ajustei as expressões no "Organiza Dados"
- [ ] Testei e os campos não estão mais `undefined`
- [ ] Workflow completo testado

## 🚀 Próximo Passo

**Depois de corrigir:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se os dados são extraídos corretamente**
3. **Verifique se o node "Verifica Usuario" encontra o usuário**
4. **Verifique se o node "Enviar texto" funciona**

---

**Última atualização:** 2025-01-11

**Recomendação:** Use a **Opção 1** (node Function) - é mais rápida e funciona com qualquer estrutura!


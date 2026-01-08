# 🔧 Como Corrigir "Organiza Dados" Agora

## 🚨 Problema

**Node "Organiza Dados" não está enviando dados:**
- Mostra: "No fields - node executed, but no items were sent on this branch"
- Campos estão `[null]` no próximo node
- Node "Enviar texto" recebe `whatsapp: null`

## ✅ Solução Rápida

### Opção 1: Adicionar Node Function (Recomendada)

#### Passo 1: Adicionar Node Function

1. **No n8n**, adicione um node "Function" entre "InicioChat" e "Organiza Dados"
2. **Nomeie como "Extrair Dados"**
3. **Cole este código:**

```javascript
const input = $input.first().json;
const body = input.body || {};
const event = body.event || '';

// Se for presence.update, retornar dados vazios
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '', mensagem: '', tipo: 'presence', messageId: '', firstname: 'Usuário', userId: null, skip: true
    }
  };
}

const data = body.data || {};
let whatsapp = '';
if (data.key && data.key.remoteJid) {
  whatsapp = String(data.key.remoteJid).replace('@s.whatsapp.net', '').replace('@g.us', '').trim();
}

if (!whatsapp) {
  return { json: { whatsapp: '', mensagem: '', tipo: 'unknown', messageId: '', firstname: 'Usuário', userId: null, skip: true } };
}

let mensagem = '';
if (data.message && data.message.conversation) {
  mensagem = data.message.conversation;
} else if (data.message && data.message.extendedTextMessage) {
  mensagem = data.message.extendedTextMessage.text || '';
}

return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: data.messageType || 'text',
    messageId: (data.key && data.key.id) || '',
    firstname: data.pushName || 'Usuário',
    userId: null,
    skip: false
  }
};
```

#### Passo 2: Conectar Nodes

```
InicioChat → Function (Extrair Dados) → Organiza Dados → Verifica Usuario
```

#### Passo 3: Ajustar "Organiza Dados"

**Use expressões simples:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### Opção 2: Corrigir Expressões Diretamente

**Se preferir não adicionar node Function, ajuste as expressões no "Organiza Dados":**

#### Campo: `whatsapp`
```
{{ $('InicioChat').item.json.body.data.key.remoteJid.toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

#### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

#### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

#### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || '' }}
```

#### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

#### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Testar

1. **Execute o workflow** manualmente
2. **Verifique se os dados** estão sendo extraídos
3. **Verifique se o campo `whatsapp`** não está mais `null`
4. **Teste enviando uma mensagem real** no WhatsApp

## 📋 Checklist

- [ ] Node Function adicionado (Opção 1) OU expressões corrigidas (Opção 2)
- [ ] Nodes conectados corretamente
- [ ] Teste executado e funcionando
- [ ] Campo `whatsapp` não está mais `null`
- [ ] Node "Enviar texto" funciona corretamente

---

**Última atualização:** 2025-01-11

**Recomendação:** Use a Opção 1 (node Function) - é mais robusta e funciona com qualquer estrutura de dados.



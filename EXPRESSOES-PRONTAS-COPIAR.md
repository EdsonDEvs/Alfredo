# 📋 Expressões Prontas para Copiar e Colar

## 🎯 Problema

Após trocar número na Evolution API, as expressões retornam `undefined` porque:
- Antes: Só chegava `messages.upsert` com `body.data.key.remoteJid`
- Agora: Também chega `presence.update` com `sender` no nível raiz

## ✅ Expressões Corrigidas

### Copie e Cole no Node "Organiza Dados"

#### Campo: `whatsapp`
```javascript
{{ ($('InicioChat').item.json.body?.data?.key?.remoteJid || $('InicioChat').item.json.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

#### Campo: `mensagem`
```javascript
{{ $('InicioChat').item.json.body?.data?.message?.conversation || $('InicioChat').item.json.body?.data?.message?.extendedTextMessage?.text || '' }}
```

#### Campo: `tipo`
```javascript
{{ $('InicioChat').item.json.body?.data?.messageType || 'text' }}
```

#### Campo: `messageId`
```javascript
{{ $('InicioChat').item.json.body?.data?.key?.id || $('InicioChat').item.json.data?.id || '' }}
```

#### Campo: `firstname`
```javascript
{{ $('InicioChat').item.json.body?.data?.pushName || 'Usuário' }}
```

#### Campo: `userId`
```javascript
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔧 Se o n8n Não Suportar `?.` (Optional Chaining)

### Use Estas Versões (Mais Longas, Mas Funcionam)

#### Campo: `whatsapp`
```javascript
{{ (($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.remoteJid) ? $('InicioChat').item.json.body.data.key.remoteJid : ($('InicioChat').item.json.sender || '')).toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

#### Campo: `mensagem`
```javascript
{{ (($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.message) ? ($('InicioChat').item.json.body.data.message.conversation || (($('InicioChat').item.json.body.data.message.extendedTextMessage && $('InicioChat').item.json.body.data.message.extendedTextMessage.text) || '')) : '') }}
```

#### Campo: `tipo`
```javascript
{{ (($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.messageType) ? $('InicioChat').item.json.body.data.messageType : 'text') }}
```

#### Campo: `messageId`
```javascript
{{ (($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.id) ? $('InicioChat').item.json.body.data.key.id : (($('InicioChat').item.json.data && $('InicioChat').item.json.data.id) ? $('InicioChat').item.json.data.id : '')) }}
```

#### Campo: `firstname`
```javascript
{{ (($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.pushName) ? $('InicioChat').item.json.body.data.pushName : 'Usuário') }}
```

#### Campo: `userId`
```javascript
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Como Usar

1. **Abra o node "Organiza Dados"** no n8n
2. **Para cada campo**, substitua a expressão atual pela expressão corrigida acima
3. **Salve o workflow**
4. **Teste enviando uma mensagem real** no WhatsApp

## 📋 Explicação

### Por Que Funciona Agora?

1. **Usa `?.` (optional chaining)**: Não dá erro se o campo não existir
2. **Tem fallbacks**: Tenta `body.data.key.remoteJid` (messages.upsert) OU `sender` (presence.update)
3. **Retorna vazio se não encontrar**: Em vez de `undefined`, retorna `''` (vazio)

### O Que Acontece Com Cada Evento?

- **`messages.upsert`**: Extrai todos os campos corretamente ✅
- **`presence.update`**: Extrai apenas `whatsapp` (do `sender`), `mensagem` fica vazia (normal) ✅

## ✅ Checklist

- [ ] Expressões substituídas no "Organiza Dados"
- [ ] Teste manual executado
- [ ] Campos não estão mais `undefined`
- [ ] Teste com mensagem real no WhatsApp
- [ ] Workflow completo testado

---

**Última atualização:** 2025-01-11

**Dica:** Use a primeira versão (com `?.`) se o n8n suportar. É mais limpa e fácil de ler. Se não funcionar, use a segunda versão (sem `?.`).


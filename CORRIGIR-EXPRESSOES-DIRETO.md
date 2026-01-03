# ✅ Corrigir Expressões Diretamente (Sem Adicionar Nodes)

## 🎯 Problema Identificado

**Após trocar o número na Evolution API:**
- Expressões retornam `undefined`
- Estrutura dos dados mudou
- Agora recebe `presence.update` (não tem mensagem) além de `messages.upsert`

## ✅ Solução: Ajustar Expressões no "Organiza Dados"

### Expressões Corrigidas (Copie e Cole)

**No node "Organiza Dados", substitua as expressões por estas:**

#### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.remoteJid) ? $('InicioChat').item.json.body.data.key.remoteJid.toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '') : ($('InicioChat').item.json.sender ? $('InicioChat').item.json.sender.toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '') : '') }}
```

#### Campo: `mensagem`
```
{{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.message) ? ($('InicioChat').item.json.body.data.message.conversation || ($('InicioChat').item.json.body.data.message.extendedTextMessage && $('InicioChat').item.json.body.data.message.extendedTextMessage.text) || '') : '' }}
```

#### Campo: `tipo`
```
{{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.messageType) ? $('InicioChat').item.json.body.data.messageType : 'text' }}
```

#### Campo: `messageId`
```
{{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.key && $('InicioChat').item.json.body.data.key.id) ? $('InicioChat').item.json.body.data.key.id : ($('InicioChat').item.json.data && $('InicioChat').item.json.data.id ? $('InicioChat').item.json.data.id : '') }}
```

#### Campo: `firstname`
```
{{ ($('InicioChat').item.json.body && $('InicioChat').item.json.body.data && $('InicioChat').item.json.body.data.pushName) ? $('InicioChat').item.json.body.data.pushName : 'Usuário' }}
```

#### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔧 Versão Mais Simples (Se as Expressões Acima Forem Muito Longas)

**Se o n8n permitir, use estas expressões mais curtas:**

### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body?.data?.key?.remoteJid || $('InicioChat').item.json.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body?.data?.message?.conversation || $('InicioChat').item.json.body?.data?.message?.extendedTextMessage?.text || '' }}
```

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body?.data?.messageType || 'text' }}
```

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body?.data?.key?.id || $('InicioChat').item.json.data?.id || '' }}
```

### Campo: `firstname`
```
{{ $('InicioChat').item.json.body?.data?.pushName || 'Usuário' }}
```

### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Como Testar

1. **Substitua as expressões** no node "Organiza Dados"
2. **Execute o node** manualmente (botão "Execute step")
3. **Verifique o OUTPUT**:
   - Para `messages.upsert`: Todos os campos devem estar preenchidos
   - Para `presence.update`: `mensagem` ficará vazia (normal, não tem mensagem)
4. **Teste com mensagem real** no WhatsApp

## 📋 O Que Cada Expressão Faz

### `whatsapp`
- Tenta: `body.data.key.remoteJid` (messages.upsert)
- Ou: `sender` (presence.update)
- Remove: `@s.whatsapp.net`, `@g.us`, `@c.us`
- Fallback: `''` (vazio)

### `mensagem`
- Tenta: `body.data.message.conversation` (mensagem simples)
- Ou: `body.data.message.extendedTextMessage.text` (mensagem longa)
- Fallback: `''` (vazio - presence.update não tem mensagem)

### `tipo`
- Usa: `body.data.messageType` se existir
- Fallback: `'text'` (texto padrão)

### `messageId`
- Tenta: `body.data.key.id` (messages.upsert)
- Ou: `data.id` (presence.update)
- Fallback: `''` (vazio)

### `firstname`
- Usa: `body.data.pushName` se existir
- Fallback: `'Usuário'` (nome padrão)

## 🐛 Se Ainda Não Funcionar

### Problema: Expressões Ainda Retornam `undefined`

**Solução:**
1. **Verifique a estrutura real** no node "InicioChat" (aba JSON)
2. **Veja exatamente onde estão os dados**
3. **Ajuste as expressões** com o caminho correto

### Problema: Erro de Sintaxe

**Solução:**
1. **Verifique se o n8n suporta `?.` (optional chaining)**
2. **Se não suportar, use a versão longa** (primeira opção)
3. **Teste uma expressão de cada vez**

## ✅ Checklist

- [ ] Expressões substituídas no "Organiza Dados"
- [ ] Teste manual executado
- [ ] Campos não estão mais `undefined`
- [ ] Teste com mensagem real no WhatsApp
- [ ] Workflow completo testado

---

**Última atualização:** 2025-01-11

**Conclusão:** As expressões foram ajustadas para funcionar com ambos os formatos (`messages.upsert` e `presence.update`) usando fallbacks. Não precisa adicionar nodes extras!


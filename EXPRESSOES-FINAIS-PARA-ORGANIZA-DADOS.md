# ✅ Expressões Finais para Node "Organiza Dados"

## 🎯 Estruturas Identificadas

### `messages.upsert` (Mensagem Real)
- `body.data.key.remoteJid` → número do WhatsApp
- `body.data.message.conversation` → mensagem
- `body.data.pushName` → nome
- `body.data.messageType` → tipo
- `body.data.key.id` → ID da mensagem

### `presence.update` (Usuário Digitando)
- `body.sender` → número do WhatsApp
- `body.data.id` → ID (não é ID de mensagem)
- **NÃO TEM mensagem** (é apenas status de digitação)

## ✅ Expressões Corrigidas (Copie e Cole)

### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || $('InicioChat').item.json.body.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Explicação:**
- Tenta: `body.data.key.remoteJid` (messages.upsert)
- Ou: `body.sender` (presence.update)
- Remove: `@s.whatsapp.net`, `@g.us`
- Fallback: `''` (vazio)

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

**Explicação:**
- Tenta: `body.data.message.conversation` (mensagem simples)
- Ou: `body.data.message.extendedTextMessage.text` (mensagem longa)
- Fallback: `''` (vazio - presence.update não tem mensagem)

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

**Explicação:**
- Usa: `body.data.messageType` se existir
- Fallback: `'text'` (texto padrão)

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || $('InicioChat').item.json.body.data.id || '' }}
```

**Explicação:**
- Tenta: `body.data.key.id` (messages.upsert)
- Ou: `body.data.id` (presence.update)
- Fallback: `''` (vazio)

### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

**Explicação:**
- Usa: `body.data.pushName` se existir
- Fallback: `'Usuário'` (nome padrão)

### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

**Explicação:**
- Vem do node "Verifica Usuario"
- Fallback: `null`

## 🧪 Como Testar

1. **Abra o node "Organiza Dados"** no n8n
2. **Substitua cada expressão** pelas expressões acima
3. **Salve o workflow**
4. **Execute o node manualmente** (botão "Execute step")
5. **Verifique o OUTPUT**:
   - Para `messages.upsert`: Todos os campos preenchidos ✅
   - Para `presence.update`: `mensagem` vazia (normal) ✅

## 📋 Comportamento Esperado

### Evento `messages.upsert`:
- `whatsapp`: `553172242378` ✅
- `mensagem`: `"Gastei 10 reais na sorveteria"` ✅
- `tipo`: `"conversation"` ✅
- `messageId`: `"3A8ED2A0AD056D5A6A14"` ✅
- `firstname`: `"Edson"` ✅

### Evento `presence.update`:
- `whatsapp`: `553197599924` ✅
- `mensagem`: `""` (vazio - normal, não é mensagem) ✅
- `tipo`: `"text"` (padrão) ✅
- `messageId`: `"100640277659847@lid"` (não é ID de mensagem) ✅
- `firstname`: `"Usuário"` (padrão) ✅

## ⚠️ Importante

**Para `presence.update`:**
- A `mensagem` ficará vazia (normal, é apenas status de digitação)
- O workflow deve processar apenas quando `mensagem` não estiver vazia
- Ou adicionar verificação no próximo node para pular quando `mensagem` estiver vazia

## 🚀 Próximo Passo

**Depois de ajustar as expressões:**
1. **Teste com mensagem real** no WhatsApp
2. **Verifique se os dados são extraídos corretamente**
3. **Verifique se o workflow funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** As expressões agora funcionam com ambos os eventos. Para `presence.update`, a mensagem ficará vazia (normal). Adicione verificação no próximo node para processar apenas quando `mensagem` não estiver vazia.


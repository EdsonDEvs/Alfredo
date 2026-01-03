# ✅ Expressões com Verificação de Evento (Sem Adicionar Node IF)

## 🎯 Problema

**Evento `presence.update` não tem dados de mensagem**, então as expressões retornam `undefined`.

## ✅ Solução: Verificar Evento Nas Expressões

### Expressões Corrigidas para Node "Organiza Dados"

**Adicione verificação de evento em cada expressão:**

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

## 🔍 Como Funciona

**Para `messages.upsert`:**
- Extrai todos os campos corretamente ✅
- `whatsapp`: Número do cliente
- `mensagem`: Texto da mensagem
- `tipo`: Tipo da mensagem
- etc.

**Para `presence.update`:**
- Retorna valores vazios ou padrão ✅
- `whatsapp`: `''` (vazio)
- `mensagem`: `''` (vazio)
- `tipo`: `'presence'`
- etc.

## 🧪 Testar

1. **Substitua as expressões** no node "Organiza Dados"
2. **Execute o workflow** manualmente
3. **Para `presence.update`:** Campos ficarão vazios (normal)
4. **Para `messages.upsert`:** Campos serão preenchidos ✅
5. **Teste enviando uma mensagem real** no WhatsApp

## 📋 Checklist

- [ ] Expressões atualizadas com verificação de evento
- [ ] Teste com `presence.update` (campos vazios - normal)
- [ ] Teste com `messages.upsert` (campos preenchidos - correto)
- [ ] Campo `whatsapp` não está mais `null` para `messages.upsert`
- [ ] Workflow funciona com mensagens reais

---

**Última atualização:** 2025-01-11

**Conclusão:** Adicione verificação de evento nas expressões. Para `messages.upsert`, extrai os dados. Para `presence.update`, retorna valores vazios (normal, pois não é mensagem).





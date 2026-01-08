# ✅ Expressão Corrigida para Campo WhatsApp

## 🎯 Problema Identificado

**Número do Bot:** `553197599924` (Evolution API)  
**Função:** Receber mensagens dos clientes

**Problema:** A expressão atual pode usar `body.sender` que pode conter o número do BOT, não o número do CLIENTE.

## ✅ Solução: Usar APENAS `body.data.key.remoteJid`

### Expressão Corrigida para Campo `whatsapp`:

```
{{ $('InicioChat').item.json.body.data.key.remoteJid.toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

### Ou com Fallback Seguro:

```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

## 🔍 Por Que Não Usar `body.sender`?

### Estrutura dos Dados:

**`messages.upsert` (Mensagem Real):**
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net"  // ✅ Número do CLIENTE
      }
    },
    "sender": "553197599924@s.whatsapp.net"  // ⚠️ Número do BOT (quem recebe)
  }
}
```

**`presence.update` (Usuário Digitando):**
```json
{
  "body": {
    "data": {
      "id": "100640277659847@lid",
      "presences": {...}
    },
    "sender": "553197599924@s.whatsapp.net"  // ⚠️ Número do BOT (não do cliente)
  }
}
```

### Conclusão:

- **`body.data.key.remoteJid`**: Número do CLIENTE que ENVIOU ✅
- **`body.sender`**: Número do BOT que RECEBEU ⚠️ (não usar para identificar cliente)

## ✅ Expressão Final Recomendada

### Campo: `whatsapp`

```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '') }}
```

**Explicação:**
- Usa APENAS `body.data.key.remoteJid` (número do cliente)
- Remove `@s.whatsapp.net`, `@g.us`, `@c.us`
- Retorna vazio se não existir (não usa `body.sender`)

## 🧪 Testar

### Teste 1: Cliente Envia Mensagem

1. **Cliente `553172242378`** (Edson) envia mensagem para `553197599924` (Bot)
2. **No node "Organiza Dados"**, campo `whatsapp` deve mostrar: `553172242378` ✅
3. **NÃO deve mostrar:** `553197599924` (número do bot) ❌

### Teste 2: Verificar no Supabase

1. **Execute:** `SELECT * FROM get_user_by_phone('553172242378');`
2. **Deve retornar:** Dados do Edson ✅
3. **Execute:** `SELECT * FROM get_user_by_phone('553197599924');`
4. **NÃO deve retornar:** Dados (bot não é cliente) ✅

## 📋 Outros Campos (Mantêm como Estão)

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

## 🚨 Importante: Processar Apenas `messages.upsert`

**Para identificar clientes corretamente:**
1. **Processar APENAS eventos `messages.upsert`** (têm `body.data.key.remoteJid`)
2. **Ignorar eventos `presence.update`** (não têm número do cliente de forma confiável)

## ✅ Checklist

- [ ] Expressão atualizada para usar APENAS `body.data.key.remoteJid`
- [ ] Expressão NÃO usa `body.sender` (pode ser número do bot)
- [ ] Teste com mensagem real do cliente
- [ ] Campo `whatsapp` mostra número do cliente (não do bot)
- [ ] Node "Verifica Usuario" encontra cliente no Supabase

---

**Última atualização:** 2025-01-11

**Conclusão:** Use APENAS `body.data.key.remoteJid` para identificar clientes. NÃO use `body.sender` pois pode conter o número do bot (`553197599924`). Processe apenas eventos `messages.upsert` para identificar clientes.


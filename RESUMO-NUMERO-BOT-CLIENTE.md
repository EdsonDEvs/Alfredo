# 📱 Resumo: Número do Bot vs Número do Cliente

## 🎯 Configuração

**Número do Bot (Evolution API):** `553197599924`  
**Instância:** `Alfredoo`  
**Função:** Receber mensagens dos clientes para o sistema financeiro

## ✅ Como Funciona

### Fluxo:

```
Cliente (553172242378) → Envia mensagem → Bot (553197599924)
    ↓
Evolution API recebe
    ↓
Webhook envia para n8n
    ↓
Sistema extrai: body.data.key.remoteJid = 553172242378 (número do CLIENTE)
    ↓
Sistema busca no Supabase pelo número 553172242378
    ↓
Sistema processa transação para o cliente correto
```

## 🔍 Identificação de Clientes

### Número do Bot:
- **Número:** `553197599924`
- **Função:** RECEBE mensagens dos clientes
- **Campo no webhook:** `body.sender` (não usar para identificar cliente)

### Número do Cliente:
- **Números:** `553172242378` (Edson), `553198632243` (apolo), etc.
- **Função:** ENVIA mensagens para o bot
- **Campo no webhook:** `body.data.key.remoteJid` (usar para identificar cliente)

## ✅ Expressão Corrigida

### Campo: `whatsapp` (Número do Cliente)

**Expressão:**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**O que faz:**
- Extrai `body.data.key.remoteJid` (número do CLIENTE que enviou)
- Remove `@s.whatsapp.net`, `@g.us`
- **NÃO usa `body.sender`** (pode ser número do bot)

## 📋 Exemplo

### Cliente Edson Envia Mensagem:

**Estrutura do webhook:**
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net"  // ✅ Número do CLIENTE
      },
      "message": {
        "conversation": "Gastei 10 reais na sorveteria"
      }
    },
    "sender": "553197599924@s.whatsapp.net"  // ⚠️ Número do BOT (não usar)
  }
}
```

**Resultado:**
- Campo `whatsapp`: `553172242378` ✅ (número do cliente)
- Sistema busca no Supabase: `get_user_by_phone('553172242378')` ✅
- Sistema encontra: Edson ✅

## 🚨 Importante

1. **Número do Bot (`553197599924`)**: Quem RECEBE mensagens
2. **Número do Cliente (`553172242378`, etc.)**: Quem ENVIA mensagens
3. **Sistema identifica pelo número que ENVIA** (`body.data.key.remoteJid`)
4. **NÃO usar `body.sender`** para identificar cliente (pode ser número do bot)
5. **Processar APENAS eventos `messages.upsert`** para identificar clientes

## ✅ Checklist

- [ ] Número do bot `553197599924` está conectado na Evolution API
- [ ] Expressão usa APENAS `body.data.key.remoteJid` (número do cliente)
- [ ] Expressão NÃO usa `body.sender` (pode ser número do bot)
- [ ] Clientes estão cadastrados no Supabase com números corretos
- [ ] Sistema identifica clientes pelo número que ENVIA (não pelo que recebe)

---

**Última atualização:** 2025-01-11

**Conclusão:** O número do bot é `553197599924`. O sistema identifica clientes pelo número que ENVIA mensagens (`body.data.key.remoteJid`), não pelo número que recebe (`body.sender`).


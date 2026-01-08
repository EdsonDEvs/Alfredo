# 🔍 Verificar Número do Bot vs Número do Cliente

## 🎯 Números Importantes

### Número do Bot (Evolution API):
- **Número:** `553197599924`
- **Função:** Receber mensagens dos clientes
- **Instância:** `Alfredoo`
- **Status:** Deve estar "Connected" (verde)

### Números dos Clientes (Supabase):
- **Edson:** `553172242378`
- **apolo:** `553198632243`

## 🔍 Como Verificar Qual Número Está Sendo Extraído

### Passo 1: Ver Dados no Node "InicioChat"

**No n8n:**
1. **Clique no node "InicioChat"**
2. **Veja o OUTPUT** (lado direito)
3. **Clique na aba "JSON"**
4. **Verifique os campos:**
   - `body.data.key.remoteJid` → Número do cliente que ENVIOU
   - `body.sender` → Número do bot que RECEBEU

### Passo 2: Verificar Expressão no "Organiza Dados"

**Expressão atual:**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || $('InicioChat').item.json.body.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**O que deve acontecer:**
- **Para `messages.upsert`:** Usa `body.data.key.remoteJid` (número do cliente) ✅
- **Para `presence.update`:** Usa `body.sender` (pode ser número do bot) ⚠️

### Passo 3: Verificar Qual Número Está Sendo Usado

**No node "Organiza Dados":**
1. **Veja o OUTPUT** do campo `whatsapp`
2. **Verifique se é:**
   - `553172242378` (Edson) ✅ = Correto
   - `553198632243` (apolo) ✅ = Correto
   - `553197599924` (bot) ❌ = Errado! Está usando número do bot

## ⚠️ Problema: Usando Número do Bot

### Se a Expressão Está Retornando `553197599924` (Bot):

**Causa:** A expressão está usando `body.sender` que contém o número do bot

**Solução:** Ajustar a expressão para priorizar `body.data.key.remoteJid`:

```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Ou verificar se o evento é `messages.upsert` antes de usar `body.sender`:**

```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || ($('InicioChat').item.json.body.event === 'messages.upsert' ? '' : $('InicioChat').item.json.body.sender) || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

## ✅ Expressão Corrigida para Priorizar Número do Cliente

### Campo: `whatsapp` (Priorizar Número do Cliente)

**Expressão corrigida:**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || ($('InicioChat').item.json.body.event !== 'messages.upsert' && $('InicioChat').item.json.body.sender) || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Explicação:**
1. **Primeiro tenta:** `body.data.key.remoteJid` (número do cliente em messages.upsert)
2. **Se não existir E evento não for messages.upsert:** Usa `body.sender` (para presence.update)
3. **Remove:** `@s.whatsapp.net`, `@g.us`
4. **Fallback:** `''` (vazio)

## 🧪 Teste para Verificar

### Teste 1: Cliente Edson Envia Mensagem

1. **Cliente `553172242378`** (Edson) envia mensagem para `553197599924` (Bot)
2. **No node "Organiza Dados"**, verifique o campo `whatsapp`
3. **Deve mostrar:** `553172242378` (número do cliente) ✅
4. **NÃO deve mostrar:** `553197599924` (número do bot) ❌

### Teste 2: Verificar no Supabase

1. **Execute a função** `get_user_by_phone('553172242378')` no Supabase
2. **Deve retornar:** Dados do Edson ✅
3. **Execute a função** `get_user_by_phone('553197599924')` no Supabase
4. **NÃO deve retornar:** Dados (bot não é cliente) ✅

## 📋 Checklist de Verificação

- [ ] Número do bot `553197599924` está conectado
- [ ] Expressão está extraindo `body.data.key.remoteJid` (número do cliente)
- [ ] Campo `whatsapp` no "Organiza Dados" mostra número do cliente (não do bot)
- [ ] Node "Verifica Usuario" busca pelo número do cliente
- [ ] Clientes estão cadastrados no Supabase com números corretos
- [ ] Sistema identifica clientes corretamente

## 🚀 Próximo Passo

**Depois de verificar:**
1. **Teste enviando uma mensagem** do cliente para o bot
2. **Verifique qual número** está sendo extraído
3. **Verifique se o sistema identifica** o cliente corretamente

---

**Última atualização:** 2025-01-11

**Conclusão:** O número do bot é `553197599924`. O sistema deve identificar clientes pelo número que ENVIA mensagens (`body.data.key.remoteJid`), não pelo número que recebe (`body.sender`). Verifique se a expressão está extraindo o número correto.


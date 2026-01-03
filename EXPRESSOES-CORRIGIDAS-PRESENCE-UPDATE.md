# ✅ Expressões Corrigidas para Lidar com `presence.update`

## 🚨 Problema Identificado

**Evento recebido:** `presence.update`  
**Problema:** Este evento NÃO tem:
- ❌ `body.data.key.remoteJid`
- ❌ `body.data.message`
- ❌ `body.data.pushName`

**Resultado:** Expressões retornam `undefined` → Campos ficam `null`

## ✅ Solução: Expressões com Verificação de Evento

### Copie e Cole no Node "Organiza Dados"

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
- Verifica se evento é `messages.upsert`
- Se for: Extrai os dados normalmente ✅
- Resultado: Campos preenchidos

**Para `presence.update`:**
- Verifica se evento é `messages.upsert`
- Se não for: Retorna valores vazios ou padrão ✅
- Resultado: Campos vazios (normal, não é mensagem)

## ⚠️ Importante: Próximo Node Deve Verificar

**O próximo node (ex: "Verifica Usuario") deve verificar se `mensagem` não está vazia:**

**Ou adicionar verificação:**
- Processar apenas quando `mensagem !== ''`
- Ou processar apenas quando `whatsapp !== ''`

## 🧪 Testar

1. **Substitua as expressões** no node "Organiza Dados"
2. **Execute o workflow** manualmente
3. **Para `presence.update`:** Campos ficarão vazios (normal) ✅
4. **Para `messages.upsert`:** Campos serão preenchidos ✅
5. **Teste enviando uma mensagem real** no WhatsApp

## 📋 Checklist

- [ ] Expressões atualizadas com verificação de evento
- [ ] Teste com `presence.update` (campos vazios - normal)
- [ ] Teste com `messages.upsert` (campos preenchidos - correto)
- [ ] Próximo node verifica se mensagem não está vazia
- [ ] Workflow funciona com mensagens reais

---

**Última atualização:** 2025-01-11

**Conclusão:** As expressões agora verificam o tipo de evento. Para `messages.upsert`, extraem os dados. Para `presence.update`, retornam valores vazios (normal).





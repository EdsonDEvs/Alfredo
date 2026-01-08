# 🚨 Erro: Campo `userId` Não Pode Acessar "Verifica Usuario"

## 🎯 Problema Identificado

**Erro no node "Organiza Dados":**
- Campo `userId` está tentando acessar: `{{ $('Verifica Usuario').item.json.user_id || null }}`
- Erro: `[ERROR: No execution data available]`
- Mensagem: "Execute node "Verifica Usuario" for preview"

## 🔍 Causa

**O node "Organiza Dados" está tentando acessar dados do node "Verifica Usuario" que ainda não foi executado.**

**Ordem atual:**
```
InicioChat → Organiza Dados → Verifica Usuario
```

**Problema:** "Organiza Dados" tenta acessar "Verifica Usuario" antes dele ser executado!

## ✅ Solução

### Opção 1: Deixar `userId` como `null` no "Organiza Dados"

**No node "Organiza Dados", mude o campo `userId` para:**

```
userId: {{ null }}
```

**Ou:**

```
userId: null
```

**Depois, no node "Verifica Usuario", adicione o `userId` aos dados retornados.**

### Opção 2: Remover Campo `userId` do "Organiza Dados"

**Remova o campo `userId` do node "Organiza Dados".**

**Depois, no node após "Verifica Usuario", combine os dados:**

**Node "Set" ou "Edit Fields" após "Verifica Usuario":**
```
whatsapp: {{ $('Organiza Dados').item.json.whatsapp }}
mensagem: {{ $('Organiza Dados').item.json.mensagem }}
tipo: {{ $('Organiza Dados').item.json.tipo }}
messageId: {{ $('Organiza Dados').item.json.messageId }}
firstname: {{ $('Organiza Dados').item.json.firstname }}
userId: {{ $json.user_id || null }}
```

### Opção 3: Reordenar os Nodes (Não Recomendado)

**Mover "Verifica Usuario" antes do "Organiza Dados":**

```
InicioChat → Verifica Usuario → Organiza Dados
```

**Mas isso pode não fazer sentido no fluxo do workflow.**

## 🔧 Solução Recomendada: Opção 1

### Passo 1: Ajustar Campo `userId` no "Organiza Dados"

**Mude para:**
```
userId: null
```

**Ou:**
```
userId: {{ null }}
```

### Passo 2: Adicionar `userId` Após "Verifica Usuario"

**Após o node "Verifica Usuario", adicione um node "Set" ou "Edit Fields":**

**Campos:**
```
whatsapp: {{ $('Organiza Dados').item.json.whatsapp }}
mensagem: {{ $('Organiza Dados').item.json.mensagem }}
tipo: {{ $('Organiza Dados').item.json.tipo }}
messageId: {{ $('Organiza Dados').item.json.messageId }}
firstname: {{ $('Organiza Dados').item.json.firstname }}
userId: {{ $json.user_id || null }}
```

## 📋 Expressões Finais para "Organiza Dados"

### Campo: `whatsapp`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') : '' }}
```

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '') : '' }}
```

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.messageType || 'text') : 'presence' }}
```

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.id || '') : '' }}
```

### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.pushName || 'Usuário') : 'Usuário' }}
```

### Campo: `userId`
```
null
```

**Ou simplesmente remova este campo do "Organiza Dados".**

## 🧪 Testar

1. **Ajuste o campo `userId`** no "Organiza Dados"
2. **Execute o node** manualmente
3. **Verifique se o erro** desapareceu
4. **Teste o workflow completo**

## 📋 Checklist

- [ ] Campo `userId` ajustado no "Organiza Dados" (null ou removido)
- [ ] Erro "No execution data available" desapareceu
- [ ] Node "Organiza Dados" executa sem erros
- [ ] Workflow completo testado

---

**Última atualização:** 2025-01-11

**Conclusão:** O campo `userId` está tentando acessar dados de um node que ainda não foi executado. Mude para `null` ou remova o campo do "Organiza Dados" e adicione depois do "Verifica Usuario".





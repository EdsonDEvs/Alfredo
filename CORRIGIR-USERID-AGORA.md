# 🔧 Corrigir Campo `userId` Agora

## 🚨 Problema

**Erro no node "Organiza Dados":**
- Campo `userId`: `{{ $('Verifica Usuario').item.json.user_id || null }}`
- Erro: `[ERROR: No execution data available]`
- Causa: Tenta acessar "Verifica Usuario" antes dele ser executado

## ✅ Solução Rápida

### Passo 1: Ajustar Campo `userId` no "Organiza Dados"

**No node "Organiza Dados", mude o campo `userId` para:**

```
userId: null
```

**Ou remova completamente este campo.**

### Passo 2: Expressões Finais (Copie e Cole)

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
null
```

**Ou simplesmente remova este campo.**

## 🔧 Adicionar `userId` Depois do "Verifica Usuario"

**Se você precisar do `userId` no workflow, adicione um node "Set" após "Verifica Usuario":**

### Node "Set" (Após "Verifica Usuario")

**Campos:**
```
whatsapp: {{ $('Organiza Dados').item.json.whatsapp }}
mensagem: {{ $('Organiza Dados').item.json.mensagem }}
tipo: {{ $('Organiza Dados').item.json.tipo }}
messageId: {{ $('Organiza Dados').item.json.messageId }}
firstname: {{ $('Organiza Dados').item.json.firstname }}
userId: {{ $json.user_id || null }}
```

## 📋 Fluxo Correto

```
InicioChat → Organiza Dados → IF (Verifica mensagem) → Verifica Usuario → Set (Combina dados) → Enviar texto
```

## 🧪 Testar

1. **Ajuste o campo `userId`** no "Organiza Dados" (null ou remova)
2. **Execute o node** manualmente
3. **Verifique se o erro** desapareceu
4. **Teste o workflow completo**

## ✅ Checklist

- [ ] Campo `userId` ajustado no "Organiza Dados" (null ou removido)
- [ ] Erro "No execution data available" desapareceu
- [ ] Node "Organiza Dados" executa sem erros
- [ ] Workflow completo testado

---

**Última atualização:** 2025-01-11

**Conclusão:** Mude o campo `userId` para `null` ou remova do "Organiza Dados". Adicione o `userId` depois do "Verifica Usuario" se necessário.





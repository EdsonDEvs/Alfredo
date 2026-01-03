# ✅ Expressões Corretas para Node "Organiza Dados"

## 🎯 Estrutura Real dos Dados

### Evento `messages.upsert` (Mensagem Real):
```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net",
        "id": "message_id"
      },
      "message": {
        "conversation": "texto da mensagem"
      },
      "pushName": "Nome do Usuário"
    }
  }
}
```

### Evento `presence.update` (Usuário Digitando):
```json
{
  "event": "presence.update",
  "sender": "553197599924@s.whatsapp.net",
  "data": {
    "id": "...",
    "presences": {...}
  }
}
```
**⚠️ Este evento NÃO tem mensagem! Deve ser filtrado.**

## ✅ Expressões Corretas

### Opção 1: Com Node Function (Recomendada)

**Se você adicionou um node "Function" antes do "Organiza Dados", use expressões simples:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### Opção 2: Expressões Diretas (Sem Node Function)

**Se preferir usar expressões diretas, use estas:**

```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.key.id || '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## ⚠️ IMPORTANTE: Filtrar Eventos de Presença

**Antes do "Organiza Dados", adicione um node "IF":**

### Condição do Node IF:

```
{{ $json.body?.event === 'messages.upsert' || $json.event === 'messages.upsert' }}
```

**Ou:**

```
{{ $json.body?.event !== 'presence.update' && $json.event !== 'presence.update' }}
```

### Configuração:
- **Quando TRUE**: Conecte para "Organiza Dados" (processa mensagem)
- **Quando FALSE**: Não processa (evento de presença não tem mensagem)

## 🔧 Expressões Detalhadas

### Campo: `whatsapp`
```
{{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```
**Explicação:**
- Acessa: `body.data.key.remoteJid`
- Remove: `@s.whatsapp.net` e `@g.us`
- Resultado: `553172242378`

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```
**Explicação:**
- Tenta: `body.data.message.conversation` (mensagem simples)
- Ou: `body.data.message.extendedTextMessage.text` (mensagem longa)
- Fallback: `''` (vazio se não encontrar)

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```
**Explicação:**
- Usa: `body.data.messageType` se existir
- Fallback: `'text'` (texto padrão)

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || '' }}
```
**Explicação:**
- Acessa: `body.data.key.id`
- Fallback: `''` (vazio se não encontrar)

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
- Acessa: Dados do node "Verifica Usuario"
- Usa: `user_id` se o usuário for encontrado
- Fallback: `null` (se não encontrar)

## 🧪 Testar Expressões

### Teste 1: Verificar Caminho do WhatsApp
```
{{ $('InicioChat').item.json.body.data.key.remoteJid }}
```
**Resultado esperado:** `553172242378@s.whatsapp.net`

### Teste 2: Verificar Caminho da Mensagem
```
{{ $('InicioChat').item.json.body.data.message.conversation }}
```
**Resultado esperado:** Texto da mensagem ou `undefined`

### Teste 3: Verificar Evento
```
{{ $('InicioChat').item.json.body.event }}
```
**Resultado esperado:** `messages.upsert` ou `presence.update`

## 📋 Checklist

- [ ] Node "IF" adicionado para filtrar `presence.update`
- [ ] Expressões ajustadas no "Organiza Dados"
- [ ] Teste com mensagem real (`messages.upsert`)
- [ ] Campos não estão mais `undefined`
- [ ] Workflow completo testado

## 🚀 Próximo Passo

**Depois de ajustar:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se o evento é `messages.upsert`**
3. **Verifique se os dados são extraídos corretamente**
4. **Teste o workflow completo**

---

**Última atualização:** 2025-01-11

**Conclusão:** Use `body.data.key.remoteJid` para `messages.upsert`. Filtre eventos `presence.update` antes de processar.


# 🔍 Diferença: presence.update vs messages.upsert

## 🎯 Problema Identificado

O evento que está chegando é `presence.update` (usuário digitando), **não** uma mensagem real (`messages.upsert`).

## 📋 Diferença entre os Eventos

### `presence.update` (Evento de Presença)

**Quando acontece**: Usuário está digitando ou online

**Estrutura**:
```json
{
  "body": {
    "event": "presence.update",
    "data": {
      "sender": "553197599924@s.whatsapp.net",
      "presences": {
        "100640277659847@lid": {
          "lastKnownPresence": "composing"
        }
      }
    }
  }
}
```

**Características**:
- ❌ **NÃO tem mensagem** (`message.conversation`)
- ❌ **NÃO tem texto**
- ✅ Tem apenas status (digitando, online, etc.)
- ⚠️ **Não deve ser processado** como mensagem

### `messages.upsert` (Mensagem Real)

**Quando acontece**: Usuário envia uma mensagem real

**Estrutura**:
```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553197599924@s.whatsapp.net",
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

**Características**:
- ✅ **Tem mensagem** (`message.conversation`)
- ✅ **Tem texto**
- ✅ Tem dados completos
- ✅ **Deve ser processado** como mensagem

## ✅ Solução: Filtrar Eventos

### Opção 1: Adicionar Node "IF" para Filtrar

1. **Adicione um node "IF"** após "InicioChat"
2. **Configure a condição**:
   ```
   {{ $json.body.event }} === 'messages.upsert'
   ```
3. **Conecte quando TRUE** para processar mensagens
4. **Quando FALSE**, não processa (eventos de presença)

### Opção 2: Verificar no Node "Organiza Dados"

Adicione uma verificação no node "Organiza Dados":

```
whatsapp: {{ $('InicioChat').item.json.body.event === 'messages.upsert' ? $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '') : $('InicioChat').item.json.body.data.sender.replace('@s.whatsapp.net', '') }}
```

**Mas isso não resolve** - você ainda não terá a mensagem em `presence.update`.

## 🧪 Como Testar

### Teste 1: Enviar Mensagem Real

1. **Envie uma mensagem REAL** para o número
2. **Não apenas digite** - pressione Enter para enviar
3. **Aguarde 5-10 segundos**
4. **Verifique no n8n** se aparece `messages.upsert`

### Teste 2: Verificar Execuções

1. **Acesse "Executions"** no n8n
2. **Procure por execuções** com evento `messages.upsert`
3. **Verifique se há mensagens reais** sendo processadas

## 🔧 Ajustar Expressões para Ambos os Eventos

Se você quiser processar apenas quando for mensagem real, use:

### Node "Organiza Dados" - Versão com Filtro

```
whatsapp: {{ $('InicioChat').item.json.body.event === 'messages.upsert' ? $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '') : ($('InicioChat').item.json.body.data.sender || '').replace('@s.whatsapp.net', '') }}
mensagem: {{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.message?.conversation || $('InicioChat').item.json.body.data.message?.extendedTextMessage?.text || '') : '' }}
tipo: {{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.messageType || 'text') : 'presence' }}
messageId: {{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key?.id || '') : '' }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || $('InicioChat').item.json.body.data.notifyName || 'Usuário' }}
userId: {{ $('Auth').item.json.id }}
```

**Mas o melhor é filtrar** eventos de presença antes de processar!

## 🚀 Solução Recomendada

### Adicionar Node "IF" para Filtrar

1. **Adicione node "IF"** após "InicioChat"
2. **Condição**: `{{ $json.body.event }} === 'messages.upsert'`
3. **Conecte quando TRUE** para o próximo node
4. **Quando FALSE**, não processa (pula eventos de presença)

### Expressões Normais no "Organiza Dados"

Depois do filtro, use expressões normais:

```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
tipo: {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body.data.key.id }}
firstname: {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
userId: {{ $('Auth').item.json.id }}
```

## 📋 Checklist

- [ ] Adicionei node "IF" para filtrar eventos
- [ ] Configurei condição: `{{ $json.body.event }} === 'messages.upsert'`
- [ ] Testei enviando uma mensagem REAL
- [ ] Verifiquei se o evento é `messages.upsert`
- [ ] Verifiquei se os campos estão preenchidos

## 🐛 Se Ainda Não Funcionar

### Problema: Apenas `presence.update` aparece

**Solução**:
1. Envie uma mensagem REAL (pressione Enter)
2. Não apenas digite - envie a mensagem completa
3. Aguarde alguns segundos
4. Verifique se `messages.upsert` aparece

### Problema: Mensagens não chegam

**Solução**:
1. Verifique se o número está conectado
2. Verifique se o status está "Connected"
3. Teste enviando de outro número
4. Verifique os logs da Evolution API

---

**Última atualização:** 2025-01-11

**Conclusão:** O evento `presence.update` é normal (usuário digitando), mas não tem mensagem. Para processar mensagens, você precisa receber o evento `messages.upsert` quando o usuário enviar uma mensagem real.


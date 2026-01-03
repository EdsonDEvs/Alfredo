# 🔍 Verificar Por Que "Organiza Dados" Não Envia Dados

## 🚨 Problema

**Node "Organiza Dados" mostra:**
- "No fields - node executed, but no items were sent on this branch"
- Todos os campos estão `[null]` no próximo node

## ✅ Verificações Necessárias

### Verificação 1: Node "Organiza Dados" Está Recebendo Dados?

**No n8n:**
1. **Clique no node "Organiza Dados"**
2. **Veja o painel INPUT** (lado esquerdo)
3. **Clique na aba "JSON"**
4. **Verifique se há dados** chegando do "InicioChat"

**Se não houver dados:**
- O problema está no node "InicioChat"
- Verifique se o webhook está recebendo dados
- Verifique se o workflow está ativo

### Verificação 2: Tipo do Node "Organiza Dados"

**Verifique qual é o tipo do node "Organiza Dados":**
- É um node "Set"?
- É um node "Edit Fields"?
- É um node "Code" ou "Function"?

**Dependendo do tipo, a configuração é diferente!**

### Verificação 3: Expressões Estão Corretas?

**Se o node "Organiza Dados" for "Set" ou "Edit Fields":**

1. **Verifique se os campos estão configurados:**
   - Campo `whatsapp` existe?
   - Campo `mensagem` existe?
   - Campo `tipo` existe?
   - etc.

2. **Verifique se as expressões estão corretas:**
   - `{{ $('InicioChat').item.json.body.data.key.remoteJid }}`
   - Teste uma expressão de cada vez

3. **Verifique se as expressões não estão retornando `undefined`:**
   - Se retornar `undefined`, o caminho está errado
   - Ajuste o caminho baseado na estrutura real dos dados

### Verificação 4: Node Está Conectado Corretamente?

**Verifique a conexão:**
1. **InicioChat** → **Organiza Dados** (conectado?)
2. **Organiza Dados** → **Verifica Usuario** (conectado?)

**Se não estiver conectado:**
- Conecte os nodes corretamente
- Verifique se há alguma condição bloqueando

### Verificação 5: Evento Recebido É `presence.update`?

**Se o evento for `presence.update`:**
- Não tem mensagem
- Pode não ter `body.data.key.remoteJid`
- O node "Organiza Dados" pode não conseguir extrair dados

**Solução:**
- Processar apenas eventos `messages.upsert`
- Ou adicionar node Function para normalizar os dados

## 🔧 Solução: Adicionar Node Function

### Passo 1: Adicionar Node Function

**Após o node "InicioChat", adicione um node "Function":**

```javascript
// Extrair dados da Evolution API
const input = $input.first().json;
const body = input.body || {};
const event = body.event || '';

// Se for presence.update, retornar dados vazios
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: 'Usuário',
      userId: null,
      skip: true
    }
  };
}

// Para messages.upsert
const data = body.data || {};

// Extrair número do WhatsApp
let whatsapp = '';
if (data.key && data.key.remoteJid) {
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .trim();
}

// Extrair mensagem
let mensagem = '';
if (data.message && data.message.conversation) {
  mensagem = data.message.conversation;
} else if (data.message && data.message.extendedTextMessage) {
  mensagem = data.message.extendedTextMessage.text || '';
}

// Extrair nome
const firstname = data.pushName || 'Usuário';

// Extrair tipo
let tipo = data.messageType || 'text';

// Extrair ID
const messageId = (data.key && data.key.id) || '';

// Retornar dados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    skip: false
  }
};
```

### Passo 2: Conectar os Nodes

```
InicioChat → Function (Extrair Dados) → Organiza Dados → Verifica Usuario
```

### Passo 3: Ajustar Node "Organiza Dados"

**Use expressões simples (dados vêm do node Function):**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Testar

1. **Adicione o node Function**
2. **Conecte os nodes**
3. **Execute o workflow** manualmente
4. **Verifique se os dados** estão sendo extraídos
5. **Verifique se o node "Organiza Dados"** está recebendo dados
6. **Verifique se o campo `whatsapp`** não está mais `null`

## 📋 Checklist

- [ ] Node "InicioChat" está recebendo dados
- [ ] Node Function está extraindo dados corretamente
- [ ] Node "Organiza Dados" está recebendo dados do Function
- [ ] Expressões no "Organiza Dados" estão corretas
- [ ] Node "Organiza Dados" está enviando dados
- [ ] Campo `whatsapp` não está mais `null`

---

**Última atualização:** 2025-01-11

**Conclusão:** O node "Organiza Dados" não está enviando dados. Adicione um node Function para extrair os dados antes do "Organiza Dados" e ajuste as expressões para usar os dados do Function.



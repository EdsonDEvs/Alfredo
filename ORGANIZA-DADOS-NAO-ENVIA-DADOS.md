# 🚨 Problema: Node "Organiza Dados" Não Envia Dados

## 🎯 Problema Identificado

**Sintomas:**
- Node "Organiza Dados" mostra: "No fields - node executed, but no items were sent on this branch"
- Node "Verifica Usuario" recebe todos os campos como `[null]`
- Node "Enviar texto" recebe `whatsapp: null`
- Erro: "Invalid format" ao tentar enviar mensagem

## 🔍 Diagnóstico

### Possíveis Causas:

1. **Node "Organiza Dados" não está executando corretamente**
2. **Expressões estão retornando `undefined` ou vazias**
3. **Node "InicioChat" não está recebendo dados**
4. **Conexão entre nodes está incorreta**
5. **Evento recebido é `presence.update` (não tem mensagem)**

## ✅ Solução Passo a Passo

### Passo 1: Verificar Node "InicioChat"

**No n8n:**
1. **Clique no node "InicioChat"**
2. **Veja o OUTPUT** (lado direito)
3. **Clique na aba "JSON"**
4. **Verifique se há dados** chegando
5. **Anote a estrutura** dos dados

### Passo 2: Verificar Node "Organiza Dados"

**No n8n:**
1. **Clique no node "Organiza Dados"**
2. **Veja o INPUT** (lado esquerdo)
3. **Verifique se há dados** chegando do "InicioChat"
4. **Veja o OUTPUT** (lado direito)
5. **Verifique se as expressões estão corretas**

### Passo 3: Verificar Expressões

**No node "Organiza Dados", verifique se as expressões estão corretas:**

#### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

#### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

#### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

#### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || $('InicioChat').item.json.body.data.id || '' }}
```

#### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

#### Campo: `userId`
```
{{ $('Verifica Usuario').item.json.user_id || null }}
```

### Passo 4: Verificar Tipo de Node "Organiza Dados"

**O node "Organiza Dados" deve ser um node "Set" ou "Edit Fields":**

1. **Verifique o tipo do node** "Organiza Dados"
2. **Se for "Set" ou "Edit Fields"**, certifique-se de que:
   - Os campos estão configurados corretamente
   - As expressões estão corretas
   - O node está conectado corretamente

### Passo 5: Testar Expressões Manualmente

**No node "Organiza Dados":**
1. **Adicione um campo temporário** para testar:
   - **Nome:** `test_whatsapp`
   - **Expressão:** `{{ $('InicioChat').item.json.body.data.key.remoteJid }}`
2. **Execute o node** manualmente
3. **Veja o OUTPUT** - se `test_whatsapp` estiver `undefined`, a expressão está errada

## 🔧 Solução: Adicionar Node Function

**Se o node "Organiza Dados" não está funcionando, adicione um node "Function" antes:**

### Node Function: Extrair Dados

**Código:**
```javascript
// Extrair dados da Evolution API
const input = $input.first().json;

// Verificar se os dados estão em body
const body = input.body || input;
const event = body.event || input.event || '';

// Se for presence.update, retornar dados vazios (não processar)
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

// Para messages.upsert, extrair dados
const data = body.data || {};

// Extrair número do WhatsApp
let whatsapp = '';
if (data.key && data.key.remoteJid) {
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .trim();
}

// Extrair mensagem
let mensagem = '';
if (data.message && data.message.conversation) {
  mensagem = data.message.conversation;
} else if (data.message && data.message.extendedTextMessage && data.message.extendedTextMessage.text) {
  mensagem = data.message.extendedTextMessage.text;
}

// Extrair nome
const firstname = data.pushName || data.notifyName || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data.messageType) {
  tipo = data.messageType;
} else if (data.message && data.message.imageMessage) {
  tipo = 'image';
} else if (data.message && data.message.audioMessage) {
  tipo = 'audio';
}

// Extrair ID
const messageId = (data.key && data.key.id) || data.id || '';

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

### Conectar os Nodes:

```
InicioChat → Function (Extrair Dados) → Organiza Dados → Verifica Usuario
```

### Ajustar Node "Organiza Dados":

**Depois de adicionar o node Function, ajuste o "Organiza Dados" para usar expressões simples:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Testar

1. **Adicione o node Function** após "InicioChat"
2. **Conecte os nodes** corretamente
3. **Execute o workflow** manualmente
4. **Verifique se os dados** estão sendo extraídos
5. **Verifique se o node "Organiza Dados"** está recebendo dados
6. **Verifique se o campo `whatsapp`** não está mais `null`

## 📋 Checklist

- [ ] Node "InicioChat" está recebendo dados
- [ ] Node "Organiza Dados" está recebendo dados do "InicioChat"
- [ ] Expressões no "Organiza Dados" estão corretas
- [ ] Node "Organiza Dados" está enviando dados para o próximo node
- [ ] Campo `whatsapp` não está mais `null`
- [ ] Node "Enviar texto" recebe número correto

## 🚀 Próximo Passo

**Depois de corrigir:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se os dados são extraídos corretamente**
3. **Verifique se o workflow funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** O node "Organiza Dados" não está enviando dados. Verifique se as expressões estão corretas e se o node está recebendo dados do "InicioChat". Se necessário, adicione um node Function para extrair os dados antes do "Organiza Dados".



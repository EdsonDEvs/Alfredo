# 📝 Código para Extrair Dados da Evolution API no n8n

## 🎯 Objetivo

Extrair os dados da Evolution API e formatá-los para o formato esperado pelo workflow.

## 🔧 Node "Function" ou "Code" no n8n

### Código Completo

```javascript
// Extrair dados da Evolution API
const inputData = $input.first().json;

// Verificar se os dados vêm do webhook da Evolution API
let event, data;

if (inputData.event) {
  // Formato direto da Evolution API
  event = inputData.event;
  data = inputData.data || inputData;
} else if (inputData.body && inputData.body.event) {
  // Formato com body (se vier através de outro node)
  event = inputData.body.event;
  data = inputData.body.data || inputData.body;
} else {
  // Tentar usar os dados diretamente
  event = 'messages.upsert';
  data = inputData;
}

// Extrair número do WhatsApp
let whatsapp = '';
if (data?.key?.remoteJid) {
  // Formato: 5531999999999@s.whatsapp.net ou 5531999999999@g.us
  whatsapp = data.key.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '');
} else if (data?.remoteJid) {
  whatsapp = data.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '');
} else if (data?.from) {
  whatsapp = data.from
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '');
}

// Extrair mensagem de texto
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data?.message?.imageMessage?.caption) {
  mensagem = data.message.imageMessage.caption;
} else if (data?.message?.videoMessage?.caption) {
  mensagem = data.message.videoMessage.caption;
} else if (data?.messageText) {
  mensagem = data.messageText;
} else if (data?.body) {
  mensagem = data.body;
}

// Extrair nome do usuário
let firstname = '';
if (data?.pushName) {
  firstname = data.pushName;
} else if (data?.notifyName) {
  firstname = data.notifyName;
} else if (data?.name) {
  firstname = data.name;
} else {
  firstname = 'Usuário';
}

// Extrair tipo de mensagem
let tipo = 'text';
if (data?.message?.imageMessage) {
  tipo = 'image';
} else if (data?.message?.audioMessage) {
  tipo = 'audio';
} else if (data?.message?.videoMessage) {
  tipo = 'video';
} else if (data?.message?.documentMessage) {
  tipo = 'document';
} else if (data?.message?.conversation || data?.message?.extendedTextMessage) {
  tipo = 'text';
}

// Extrair ID da mensagem
let messageId = '';
if (data?.key?.id) {
  messageId = data.key.id;
} else if (data?.id) {
  messageId = data.id;
} else if (data?.messageId) {
  messageId = data.messageId;
}

// Verificar se a mensagem é do próprio bot (fromMe)
const fromMe = data?.key?.fromMe || data?.fromMe || false;

// Retornar dados formatados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null, // Será preenchido depois pela busca no Supabase
    event: event,
    fromMe: fromMe,
    timestamp: data?.messageTimestamp || Date.now(),
    // Manter dados originais para debug
    originalData: data
  }
};
```

## 📋 Como Usar no n8n

### Passo 1: Adicionar Node "Function"

1. **No workflow do n8n**, adicione um node "Function"
2. **Cole o código acima** no campo de código
3. **Posicione o node** ANTES do node "Verifica Usuario"

### Passo 2: Conectar os Nodes

1. **Conecte o webhook** → **Node Function** → **Verifica Usuario**
2. **Verifique se os dados** estão sendo passados corretamente

### Passo 3: Verificar Output

1. **Execute o node Function** manualmente
2. **Verifique o OUTPUT** do node
3. **Verifique se os campos** estão preenchidos:
   - `whatsapp`: Deve ter o número (ex: `5531999999999`)
   - `mensagem`: Deve ter o texto da mensagem
   - `tipo`: Deve ter o tipo (ex: `text`, `image`, `audio`)
   - `firstname`: Deve ter o nome do usuário
   - `messageId`: Deve ter o ID da mensagem

## 🔍 Debug

### Ver Dados Originais

Se quiser ver os dados originais que vêm da Evolution API, adicione um node "Set" antes do node Function:

```javascript
// Node "Set" para ver dados originais
return {
  json: {
    originalData: $input.first().json
  }
};
```

### Ver Dados Processados

Após o node Function, adicione um node "Set" para ver os dados processados:

```javascript
// Node "Set" para ver dados processados
return {
  json: $input.first().json
};
```

## 🧪 Teste

### Teste 1: Dados Simulados

```javascript
// Simular dados da Evolution API
const testData = {
  event: "messages.upsert",
  data: {
    key: {
      remoteJid: "5531999999999@s.whatsapp.net",
      fromMe: false,
      id: "3EB0C767F26EE5B70D41"
    },
    message: {
      conversation: "Olá, como vai?"
    },
    pushName: "João Silva",
    messageTimestamp: 1705312200
  }
};
```

### Teste 2: Executar Manualmente

1. **Execute o node Function** com dados de teste
2. **Verifique se os dados** são extraídos corretamente
3. **Verifique se o formato** está correto

## ⚠️ Formato do Número

O número deve estar no formato:
- ✅ **Correto**: `5531999999999` (apenas números)
- ❌ **Errado**: `5531999999999@s.whatsapp.net`
- ❌ **Errado**: `+55 31 99999-9999`
- ❌ **Errado**: `(31) 99999-9999`

## 🔧 Ajustes Necessários

### Se o Formato dos Dados for Diferente

Se a Evolution API enviar os dados em um formato diferente, ajuste o código:

```javascript
// Exemplo: Se os dados vêm em outro formato
if (inputData.messages && inputData.messages[0]) {
  const message = inputData.messages[0];
  whatsapp = message.from.replace('@s.whatsapp.net', '');
  mensagem = message.text?.body || '';
  // ... resto do código
}
```

### Se Precisar de Mais Campos

Adicione mais campos conforme necessário:

```javascript
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    event: event,
    fromMe: fromMe,
    timestamp: timestamp,
    // Novos campos
    chatId: data?.key?.remoteJid || '',
    isGroup: data?.key?.remoteJid?.includes('@g.us') || false,
    originalData: data
  }
};
```

---

**Última atualização:** 2025-01-11

**Nota:** Ajuste o código conforme o formato exato dos dados que a Evolution API envia para o seu webhook.


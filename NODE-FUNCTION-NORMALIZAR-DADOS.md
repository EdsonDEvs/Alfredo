# 🔧 Node Function: Normalizar Dados da Evolution API

## 🎯 Solução Automática

Este node Function encontra os dados automaticamente, independente da estrutura que a Evolution API envia.

## 📝 Código Completo

```javascript
// Normalizar dados da Evolution API - Funciona com qualquer estrutura
const input = $input.first().json;

// Função para encontrar dados recursivamente
function findData(obj, depth = 0) {
  if (!obj || depth > 5) return null;
  
  // Verificar se encontrou os dados (tem key.remoteJid)
  if (obj.key?.remoteJid || obj.data?.key?.remoteJid) {
    return obj.data || obj;
  }
  
  // Tentar caminhos comuns
  const paths = [
    obj.data,
    obj.body?.data,
    obj.json?.body?.data,
    obj.body,
    obj.json,
    obj.event?.data,
    obj.message
  ];
  
  for (let path of paths) {
    if (path && typeof path === 'object') {
      const found = findData(path, depth + 1);
      if (found) return found;
    }
  }
  
  // Se não encontrou, retornar o objeto original
  return obj;
}

// Encontrar os dados
let data = findData(input);

// Se não encontrou, tentar acessar diretamente
if (!data || !data.key) {
  // Tentar diferentes estruturas
  if (input.data?.key) data = input.data;
  else if (input.body?.data?.key) data = input.body.data;
  else if (input.json?.body?.data?.key) data = input.json.body.data;
  else if (input.key) data = input;
  else data = input;
}

// Extrair número do WhatsApp
let whatsapp = '';
if (data?.key?.remoteJid) {
  whatsapp = data.key.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '');
} else if (data?.remoteJid) {
  whatsapp = data.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '');
} else if (data?.from) {
  whatsapp = data.from
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '');
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
} else if (data?.text) {
  mensagem = data.text;
}

// Extrair nome do usuário
let firstname = '';
if (data?.pushName) {
  firstname = data.pushName;
} else if (data?.notifyName) {
  firstname = data.notifyName;
} else if (data?.name) {
  firstname = data.name;
} else if (data?.contact?.name) {
  firstname = data.contact.name;
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
} else if (data?.messageType) {
  tipo = data.messageType;
}

// Extrair ID da mensagem
let messageId = '';
if (data?.key?.id) {
  messageId = data.key.id;
} else if (data?.id) {
  messageId = data.id;
} else if (data?.messageId) {
  messageId = data.messageId;
} else if (data?.key?.messageId) {
  messageId = data.key.messageId;
}

// Verificar se a mensagem é do próprio bot
const fromMe = data?.key?.fromMe || data?.fromMe || false;

// Retornar dados normalizados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null, // Será preenchido depois
    fromMe: fromMe,
    timestamp: data?.messageTimestamp || data?.timestamp || Date.now(),
    // Manter dados originais para debug (opcional)
    _originalData: data
  }
};
```

## 🔧 Como Usar

### Passo 1: Adicionar Node Function

1. **No workflow do n8n**, adicione um node "Function"
2. **Nomeie o node**: "Normalizar Dados"
3. **Posicione** ANTES do node "Organiza Dados"
4. **Cole o código acima** no campo de código

### Passo 2: Conectar os Nodes

1. **Conecte**: InicioChat → Normalizar Dados → Organiza Dados
2. **Remova a conexão direta** entre InicioChat e Organiza Dados (se existir)

### Passo 3: Ajustar Node "Organiza Dados"

Agora o node "Organiza Dados" pode usar expressões simples:

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Auth').item.json.id }}
```

### Passo 4: Testar

1. **Execute o node "Normalizar Dados"** manualmente
2. **Verifique o OUTPUT** - os campos devem estar preenchidos
3. **Execute o node "Organiza Dados"** - os campos não devem mais estar `null`
4. **Teste o workflow completo**

## ✅ Vantagens

- ✅ **Funciona com qualquer estrutura** de dados
- ✅ **Remove automaticamente** `@s.whatsapp.net` do número
- ✅ **Extrai todos os campos** necessários
- ✅ **Não precisa descobrir** o caminho exato dos dados
- ✅ **Fácil de manter** e atualizar

## 🧪 Teste

### Ver Dados Normalizados

Após adicionar o node, execute e verifique:

```json
{
  "whatsapp": "5531999999999",
  "mensagem": "Olá, como vai?",
  "tipo": "text",
  "messageId": "3EB0C767F26EE5B70D41",
  "firstname": "João Silva",
  "userId": null,
  "fromMe": false,
  "timestamp": 1705312200
}
```

## 🐛 Se Ainda Não Funcionar

1. **Verifique se o node "InicioChat" está recebendo dados**
2. **Execute o node "Normalizar Dados" manualmente**
3. **Veja o campo `_originalData`** no OUTPUT para debug
4. **Ajuste o código** se necessário

---

**Última atualização:** 2025-01-11

**Dica:** Este código funciona com qualquer estrutura de dados da Evolution API. Se ainda não funcionar, verifique se o node "InicioChat" está recebendo dados do webhook.


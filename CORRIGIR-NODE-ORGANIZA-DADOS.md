# 🔧 Corrigir Node "Organiza Dados" - Campos Null

## 🚨 Problema Identificado

O node "Organiza Dados" está tentando acessar os dados através de:
- `{{ $('InicioChat').item.json.body.data.key.remoteJid }}`
- `{{ $('InicioChat').item.json.body.data.message.conversation }}`

Mas todos os valores estão retornando `null`. Isso significa que **o caminho JSON está incorreto**.

## ✅ Solução: Verificar Estrutura Real dos Dados

### Passo 1: Verificar Dados do Node "InicioChat"

1. **Abra o node "InicioChat"** no workflow
2. **Execute o node manualmente** (botão "Execute step")
3. **Veja o OUTPUT** do node
4. **Verifique a estrutura** dos dados que estão chegando

### Passo 2: Verificar Estrutura dos Dados

Os dados podem estar em diferentes caminhos. Verifique qual deles está correto:

#### Opção 1: Dados diretos (sem `body`)
```json
{
  "data": {
    "key": {
      "remoteJid": "5531999999999@s.whatsapp.net",
      "id": "message_id"
    },
    "message": {
      "conversation": "mensagem"
    },
    "pushName": "Nome"
  }
}
```

#### Opção 2: Dados dentro de `body`
```json
{
  "body": {
    "data": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net"
      }
    }
  }
}
```

#### Opção 3: Dados dentro de `json.body.data`
```json
{
  "json": {
    "body": {
      "data": {
        "key": {
          "remoteJid": "5531999999999@s.whatsapp.net"
        }
      }
    }
  }
}
```

## 🔧 Corrigir Expressões no Node "Organiza Dados"

### Opção A: Se os dados estão diretamente em `json`

Ajuste as expressões para:

```
whatsapp: {{ $('InicioChat').item.json.data.key.remoteJid }}
mensagem: {{ $('InicioChat').item.json.data.message.conversation }}
tipo: {{ $('InicioChat').item.json.data.messageType }}
messageId: {{ $('InicioChat').item.json.data.key.id }}
firstname: {{ $('InicioChat').item.json.data.pushName }}
userId: {{ $('Auth').item.json.id }}
```

### Opção B: Se os dados estão em `json.body`

Ajuste as expressões para:

```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation }}
tipo: {{ $('InicioChat').item.json.body.data.messageType }}
messageId: {{ $('InicioChat').item.json.body.data.key.id }}
firstname: {{ $('InicioChat').item.json.body.data.pushName }}
userId: {{ $('Auth').item.json.id }}
```

### Opção C: Se os dados estão em `json.json.body.data` (mais comum no n8n)

Ajuste as expressões para:

```
whatsapp: {{ $('InicioChat').item.json.json.body.data.key.remoteJid }}
mensagem: {{ $('InicioChat').item.json.json.body.data.message.conversation }}
tipo: {{ $('InicioChat').item.json.json.body.data.messageType }}
messageId: {{ $('InicioChat').item.json.json.body.data.key.id }}
firstname: {{ $('InicioChat').item.json.json.body.data.pushName }}
userId: {{ $('Auth').item.json.id }}
```

### Opção D: Se os dados estão no nível raiz

Ajuste as expressões para:

```
whatsapp: {{ $('InicioChat').item.json.key.remoteJid }}
mensagem: {{ $('InicioChat').item.json.message.conversation }}
tipo: {{ $('InicioChat').item.json.messageType }}
messageId: {{ $('InicioChat').item.json.key.id }}
firstname: {{ $('InicioChat').item.json.pushName }}
userId: {{ $('Auth').item.json.id }}
```

## 🧪 Como Descobrir o Caminho Correto

### Método 1: Usar Node "Set" para Debug

1. **Adicione um node "Set"** após o "InicioChat"
2. **Configure para mostrar todos os dados**:
   ```
   Campo: debug
   Valor: {{ $json }}
   ```
3. **Execute o node** e veja a estrutura completa

### Método 2: Usar Expressão de Teste

No node "Organiza Dados", teste diferentes caminhos:

1. **Teste 1**: `{{ $('InicioChat').item.json }}`
2. **Teste 2**: `{{ $('InicioChat').item.json.body }}`
3. **Teste 3**: `{{ $('InicioChat').item.json.data }}`
4. **Teste 4**: `{{ $('InicioChat').item.json.json }}`

### Método 3: Verificar Schema do INPUT

1. **No node "Organiza Dados"**, veja o painel INPUT
2. **Clique em "Schema"** ou "JSON"
3. **Expanda os campos** para ver a estrutura real
4. **Anote o caminho completo** até os dados

## 🔧 Solução Mais Robusta: Adicionar Node Function Antes

Se não conseguir descobrir o caminho exato, adicione um node "Function" ANTES do "Organiza Dados":

### Node Function: Normalizar Dados

```javascript
// Normalizar dados da Evolution API
const inputData = $input.first().json;

// Tentar encontrar os dados em diferentes caminhos
let data = null;

// Opção 1: json.body.data
if (inputData.body?.data) {
  data = inputData.body.data;
}
// Opção 2: json.data
else if (inputData.data) {
  data = inputData.data;
}
// Opção 3: json.json.body.data
else if (inputData.json?.body?.data) {
  data = inputData.json.body.data;
}
// Opção 4: json direto
else if (inputData.key || inputData.message) {
  data = inputData;
}
// Opção 5: usar tudo
else {
  data = inputData;
}

// Extrair número do WhatsApp
let whatsapp = '';
if (data?.key?.remoteJid) {
  whatsapp = data.key.remoteJid
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '');
}

// Extrair mensagem
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
}

// Extrair nome
const firstname = data?.pushName || data?.notifyName || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
if (data?.message?.audioMessage) tipo = 'audio';
if (data?.message?.videoMessage) tipo = 'video';

// Extrair ID
const messageId = data?.key?.id || '';

// Retornar dados normalizados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null // Será preenchido depois
  }
};
```

### Ajustar Node "Organiza Dados"

Depois de adicionar o node Function, ajuste o "Organiza Dados" para:

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Auth').item.json.id }}
```

## 📋 Checklist de Correção

- [ ] Verificar estrutura dos dados no node "InicioChat"
- [ ] Testar diferentes caminhos JSON
- [ ] Ajustar expressões no node "Organiza Dados"
- [ ] Testar se os campos não estão mais `null`
- [ ] Verificar se o número do WhatsApp está no formato correto (sem @s.whatsapp.net)
- [ ] Testar workflow completo

## 🐛 Problemas Comuns

### Problema: Ainda retorna `null`

**Solução:**
1. Verifique se o node "InicioChat" está recebendo dados
2. Verifique se o webhook está configurado corretamente
3. Adicione um node "Set" para debug
4. Verifique os logs do n8n

### Problema: Número tem `@s.whatsapp.net`

**Solução:**
- Adicione um node Function para remover o sufixo
- Ou use expressão: `{{ $json.whatsapp.replace('@s.whatsapp.net', '') }}`

### Problema: Campos estão vazios, não `null`

**Solução:**
- Verifique se os dados estão chegando no formato correto
- Verifique se a Evolution API está enviando os dados
- Verifique se o webhook está configurado corretamente

## 🚀 Próximos Passos

1. **Verifique a estrutura** dos dados no node "InicioChat"
2. **Ajuste as expressões** no node "Organiza Dados"
3. **Teste o workflow** novamente
4. **Verifique se os campos** não estão mais `null`

---

**Última atualização:** 2025-01-11

**Nota:** O caminho exato dos dados depende de como a Evolution API está enviando os dados e como o n8n está recebendo. Use os métodos de debug para descobrir o caminho correto.


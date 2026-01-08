# 🔍 Como Descobrir a Estrutura dos Dados do Node "InicioChat"

## 🎯 Objetivo

Descobrir a estrutura exata dos dados que estão chegando no node "InicioChat" para corrigir as expressões no node "Organiza Dados".

## 🔧 Método 1: Ver OUTPUT do Node "InicioChat"

### Passo a Passo:

1. **Abra o workflow no n8n**
2. **Clique no node "InicioChat"**
3. **Clique no botão "Execute step"** (botão vermelho no canto superior direito)
4. **Veja o painel OUTPUT** (painel direito)
5. **Clique na aba "JSON"** ou "Table" para ver os dados
6. **Anote a estrutura completa** dos dados

### O que procurar:

- Onde estão os dados? (`json`, `json.body`, `json.data`, etc.)
- Qual é o caminho até `remoteJid`?
- Qual é o caminho até `message.conversation`?
- Qual é o caminho até `pushName`?

## 🔧 Método 2: Adicionar Node "Set" para Debug

### Passo a Passo:

1. **Adicione um node "Set"** APÓS o node "InicioChat"
2. **Configure o node**:
   - **Name**: "Debug InicioChat"
   - **Keep Only Set Fields**: Desmarque
   - **Fields to Set**:
     - **Campo 1**: `fullData`
       - **Valor**: `{{ $json }}`
     - **Campo 2**: `body`
       - **Valor**: `{{ $json.body }}`
     - **Campo 3**: `data`
       - **Valor**: `{{ $json.data }}`
     - **Campo 4**: `json`
       - **Valor**: `{{ $json.json }}`
3. **Execute o node** e veja quais campos têm dados

## 🔧 Método 3: Usar Expressões de Teste no Node "Organiza Dados"

### Passo a Passo:

1. **Abra o node "Organiza Dados"**
2. **Teste diferentes expressões** no campo `whatsapp`:

#### Teste 1: Dados diretos
```
{{ $('InicioChat').item.json.key.remoteJid }}
```

#### Teste 2: Com body
```
{{ $('InicioChat').item.json.body.data.key.remoteJid }}
```

#### Teste 3: Com json.body
```
{{ $('InicioChat').item.json.json.body.data.key.remoteJid }}
```

#### Teste 4: Tudo
```
{{ $('InicioChat').item.json }}
```

3. **Execute o node** e veja qual expressão retorna dados
4. **Use a expressão que funciona** para os outros campos

## 🔧 Método 4: Usar Node "Function" para Debug

### Código para Debug:

```javascript
// Debug: Ver estrutura completa dos dados
const inputData = $input.first().json;

// Retornar estrutura completa
return {
  json: {
    // Dados completos
    fullData: JSON.stringify(inputData, null, 2),
    
    // Tentar diferentes caminhos
    path1_json: inputData.json,
    path2_body: inputData.body,
    path3_data: inputData.data,
    path4_key: inputData.key,
    path5_body_data: inputData.body?.data,
    path6_json_body: inputData.json?.body,
    path7_json_body_data: inputData.json?.body?.data,
    
    // Tentar acessar remoteJid
    remoteJid_path1: inputData.key?.remoteJid,
    remoteJid_path2: inputData.data?.key?.remoteJid,
    remoteJid_path3: inputData.body?.data?.key?.remoteJid,
    remoteJid_path4: inputData.json?.body?.data?.key?.remoteJid,
    
    // Tentar acessar message
    message_path1: inputData.message,
    message_path2: inputData.data?.message,
    message_path3: inputData.body?.data?.message,
    message_path4: inputData.json?.body?.data?.message,
  }
};
```

### Como Usar:

1. **Adicione um node "Function"** após o "InicioChat"
2. **Cole o código acima**
3. **Execute o node**
4. **Veja o OUTPUT** e identifique qual caminho tem os dados
5. **Use o caminho correto** no node "Organiza Dados"

## 🔧 Método 5: Ver Schema do INPUT

### Passo a Passo:

1. **Abra o node "Organiza Dados"**
2. **Veja o painel INPUT** (painel esquerdo)
3. **Clique na aba "Schema"**
4. **Expanda os campos** para ver a estrutura
5. **Anote o caminho completo** até os dados que você precisa

## 📋 Exemplos de Estruturas Comuns

### Estrutura 1: Dados diretos
```json
{
  "key": {
    "remoteJid": "5531999999999@s.whatsapp.net",
    "id": "message_id"
  },
  "message": {
    "conversation": "mensagem"
  },
  "pushName": "Nome"
}
```
**Expressão**: `{{ $('InicioChat').item.json.key.remoteJid }}`

### Estrutura 2: Dentro de `data`
```json
{
  "data": {
    "key": {
      "remoteJid": "5531999999999@s.whatsapp.net"
    },
    "message": {
      "conversation": "mensagem"
    }
  }
}
```
**Expressão**: `{{ $('InicioChat').item.json.data.key.remoteJid }}`

### Estrutura 3: Dentro de `body.data`
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
**Expressão**: `{{ $('InicioChat').item.json.body.data.key.remoteJid }}`

### Estrutura 4: Dentro de `json.body.data` (n8n)
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
**Expressão**: `{{ $('InicioChat').item.json.json.body.data.key.remoteJid }}`

## 🧪 Teste Rápido

### Teste no Node "Organiza Dados":

1. **Temporariamente**, mude o campo `whatsapp` para:
   ```
   {{ $('InicioChat').item.json }}
   ```
2. **Execute o node**
3. **Veja o OUTPUT** - você verá toda a estrutura dos dados
4. **Identifique** onde está o `remoteJid`
5. **Ajuste a expressão** para o caminho correto

## 🚀 Solução Rápida

Se você quiser uma solução rápida, adicione este node Function ANTES do "Organiza Dados":

```javascript
// Normalizar dados - funciona com qualquer estrutura
const input = $input.first().json;

// Função para encontrar dados recursivamente
function findData(obj, path = '') {
  if (!obj) return null;
  
  // Tentar caminhos comuns
  if (obj.key?.remoteJid) return obj;
  if (obj.data?.key?.remoteJid) return obj.data;
  if (obj.body?.data?.key?.remoteJid) return obj.body.data;
  if (obj.json?.body?.data?.key?.remoteJid) return obj.json.body.data;
  
  // Buscar recursivamente
  for (let key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      const found = findData(obj[key]);
      if (found) return found;
    }
  }
  
  return obj;
}

const data = findData(input) || input;

// Extrair dados
const whatsapp = (data.key?.remoteJid || '')
  .replace('@s.whatsapp.net', '')
  .replace('@g.us', '')
  .replace('@c.us', '');

const mensagem = data.message?.conversation || 
                 data.message?.extendedTextMessage?.text || '';

const firstname = data.pushName || data.notifyName || 'Usuário';

const messageId = data.key?.id || '';

let tipo = 'text';
if (data.message?.imageMessage) tipo = 'image';
if (data.message?.audioMessage) tipo = 'audio';

return {
  json: {
    whatsapp,
    mensagem,
    tipo,
    messageId,
    firstname,
    userId: null
  }
};
```

Este código encontra os dados automaticamente, independente da estrutura!

---

**Última atualização:** 2025-01-11

**Dica:** Use o Método 1 primeiro (ver OUTPUT do InicioChat) - é o mais rápido e direto!


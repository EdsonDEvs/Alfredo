# 🔧 Solução: Erro "Message not found" ao Buscar Mídia na Evolution API

## 🎯 Problema Identificado

O node "Caso não recebemos o Base64 consultamos no EVOAPI" está retornando erro:
```
400 - {"status":400,"error":"Bad Request","response":{"message":["Message not found"]}}
```

**MessageId usado:** `3A1A6714125EC0F42254`

---

## 🔍 Possíveis Causas

### 1. **MessageId Extraído do Lugar Errado** ⚠️

Na imagem, vejo que o node está usando:
```javascript
{{ $('Webhook1').item.json.body.message.messageid }}
```

Mas a estrutura real dos dados pode ser diferente. O messageId pode estar em:
- `body.message.messageId` (com 'I' maiúsculo)
- `body.message.id`
- `body.data.key.id`
- `body.id`
- `messageId` (direto no body)

### 2. **Incompatibilidade entre APIs** ⚠️

Se o webhook está vindo do **uazapi** (não da Evolution API), o `messageId` pode ter um formato diferente e não ser compatível com a Evolution API.

### 3. **Mensagem Expirada ou Não Disponível** ⚠️

A mensagem pode ter sido removida do cache da Evolution API ou pode ter expirado.

### 4. **Instância Incorreta** ⚠️

A instância "Alfredoo" pode não estar correta ou a mensagem pode ter sido recebida em outra instância.

---

## ✅ Soluções

### Solução 1: Corrigir a Expressão do MessageId

**Problema:** O node está usando `$('Webhook1').item.json.body.message.messageid`

**Solução:** Use uma expressão mais flexível que tenta múltiplos caminhos:

```javascript
{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

**OU se você tem um node "Organiza Dados" que já extrai o messageId:**

```javascript
{{ $('Organiza Dados').item.json.messageId || $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

**Importante:** A expressão acima tenta primeiro `body.message.messageId` (com 'I' maiúsculo) e depois `body.message.messageid` (com 'i' minúsculo), que é o que aparece na imagem.

---

### Solução 2: Verificar a Estrutura Real dos Dados

1. **Execute o workflow** e pare no node "Webhook1"
2. **Veja o OUTPUT** do webhook
3. **Procure pelo messageId** na estrutura JSON
4. **Identifique o caminho correto** (ex: `body.message.messageId`, `body.data.key.id`, etc.)

**Exemplo de como verificar:**

No n8n:
1. Abra o node "Webhook1"
2. Clique em "Execute Node"
3. Veja o OUTPUT completo
4. Procure pelo campo que contém `3A1A6714125EC0F42254` ou similar

---

### Solução 3: Usar o Node "Organiza Dados" como Referência

Se você tem um node "Organiza Dados" que já extrai o `messageId` corretamente, use ele:

**No node "Caso não recebemos o Base64 consultamos no EVOAPI":**

**Campo: ID Da Mensagem**
```javascript
{{ $('Organiza Dados').item.json.messageId }}
```

**OU se o node anterior for diferente:**
```javascript
{{ $('Verifica o Tipo de mensagem').item.json.messageId || $('Organiza Dados').item.json.messageId || $json.body?.id || $json.body?.key?.id || $json.id || $json.messageId || '' }}
```

---

### Solução 4: Verificar se a Mensagem Tem Base64 no Webhook

Antes de consultar a Evolution API, verifique se o Base64 já não veio no webhook:

**Estrutura esperada do uazapi para áudio:**
```json
{
  "body": {
    "phone": "553172242378",
    "audio": "base64_data_aqui",
    "type": "audio",
    "id": "3A1A6714125EC0F42254"
  }
}
```

**Se o Base64 já vier no webhook:**
- Não precisa consultar a Evolution API
- Use o Base64 diretamente do webhook

---

### Solução 5: Adicionar Tratamento de Erro

Adicione um node "IF" antes de processar a mídia para verificar se o Base64 foi obtido:

**Node: "Verifica Base64"**
- **Condição:** `{{ $json.base64 || $json.body?.audio || $json.body?.image || $json.body?.video }}`
- **Se tiver Base64:** Continue o fluxo normalmente
- **Se não tiver:** Tente buscar na Evolution API

---

## 🔧 Configuração Correta do Node

### Node: "Caso não recebemos o Base64 consultamos no EVOAPI"

**Tipo:** HTTP Request  
**Method:** GET  
**URL:** 
```javascript
https://SEU_SERVIDOR_EVOLUTION_API/chat/getMedia/Alfredoo/{{ $('Organiza Dados').item.json.messageId || $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

**OU se você não tem o node "Organiza Dados" conectado:**

```javascript
https://SEU_SERVIDOR_EVOLUTION_API/chat/getMedia/Alfredoo/{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

**Authentication:** Header Auth  
**Headers:**
- `apikey`: `SUA_API_KEY_AQUI`

**Settings:**
- **Timeout:** 60000 (60 segundos)

---

## 📋 Passo a Passo para Corrigir

### Passo 1: Verificar o OUTPUT do Webhook

1. Abra o node "Webhook1" (ou o nome do seu webhook)
2. Execute o workflow
3. Veja o OUTPUT completo
4. Procure pelo `messageId` na estrutura

### Passo 2: Identificar o Caminho Correto

Baseado no OUTPUT, identifique onde está o `messageId`:
- `body.message.messageId` ✅
- `body.message.messageid` ✅
- `body.message.id` ✅
- `body.data.key.id` ✅
- `body.id` ✅
- Outro caminho?

### Passo 3: Atualizar a Expressão

No node "Caso não recebemos o Base64 consultamos no EVOAPI":

**Campo: ID Da Mensagem**
Use a expressão que corresponde ao caminho identificado no Passo 2.

**Exemplo se o messageId está em `body.message.messageId`:**
```javascript
{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.id || $json.messageId || '' }}
```

### Passo 4: Testar

1. Execute o workflow novamente
2. Envie uma mensagem de áudio
3. Verifique se o erro foi resolvido

---

## ⚠️ Observações Importantes

### 1. **Compatibilidade entre APIs**

Se você está usando **uazapi** para receber mensagens, mas **Evolution API** para buscar mídia:
- ⚠️ Os `messageId` podem não ser compatíveis
- ⚠️ A Evolution API pode não ter a mensagem se ela foi recebida pelo uazapi

**Solução:** Use a mesma API para receber e buscar mídia, ou verifique se o uazapi já envia o Base64 no webhook.

### 2. **Tempo de Disponibilidade**

As mídias na Evolution API podem expirar após um tempo. Se a mensagem for muito antiga, pode não estar mais disponível.

### 3. **Instância Correta**

Certifique-se de que a instância "Alfredoo" está correta e que a mensagem foi recebida nessa instância.

---

## 🔍 Debug

### Como Verificar se o MessageId Está Correto

1. **Adicione um node "Set"** antes do node de busca de mídia
2. **Configure para mostrar o messageId:**
   - Campo: `debug_messageId`
   - Valor: `{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.id || $json.id || $json.messageId || 'NÃO ENCONTRADO' }}`
3. **Execute o workflow**
4. **Veja o valor** no OUTPUT do node "Set"
5. **Compare** com o messageId que aparece no INPUT do webhook

---

## 📝 Exemplo de Estrutura Esperada

### Se o Webhook Vem do Uazapi:

```json
{
  "body": {
    "phone": "553172242378",
    "message": {
      "messageId": "3A1A6714125EC0F42254",
      "content": {
        "URL": "https://mmg.whatsapp.net/...",
        "mimetype": "audio/ogg; codecs=opus"
      },
      "tipo": "AudioMessage"
    }
  }
}
```

**Expressão correta:**
```javascript
{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.id || '' }}
```

### Se o Webhook Vem da Evolution API:

```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "id": "3A1A6714125EC0F42254",
        "remoteJid": "553172242378@s.whatsapp.net"
      },
      "message": {
        "audioMessage": { ... }
      }
    }
  }
}
```

**Expressão correta:**
```javascript
{{ $json.body?.data?.key?.id || $json.body?.key?.id || $json.body?.id || '' }}
```

---

## ✅ Resumo da Solução

1. **Verifique** a estrutura real dos dados no OUTPUT do webhook
2. **Identifique** onde está o `messageId`
3. **Atualize** a expressão no node "Caso não recebemos o Base64 consultamos no EVOAPI"
4. **Use** uma expressão flexível que tenta múltiplos caminhos
5. **Teste** novamente

---

**Status:** 🔧 Aguardando verificação da estrutura real dos dados  
**Próximo Passo:** Verificar o OUTPUT do webhook e ajustar a expressão conforme necessário


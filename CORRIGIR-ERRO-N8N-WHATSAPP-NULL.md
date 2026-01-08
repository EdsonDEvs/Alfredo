# 🔧 Corrigir Erro: WhatsApp Null no n8n

## 🚨 Problema Identificado

O erro mostra que:
- **Campo `whatsapp` está `null`** no INPUT
- **Erro 400**: "Invalid format" ao tentar enviar mensagem
- **Todos os campos estão `null`**: `whatsapp`, `mensagem`, `tipo`, `messageId`, `firstname`, `userId`

## ✅ Solução

### Problema 1: Webhook Não Está Recebendo Dados

O workflow do n8n não está recebendo os dados corretamente do webhook da Evolution API.

#### Solução:

1. **Verifique o node Webhook** que recebe dados da Evolution API
2. **Verifique o formato dos dados** que a Evolution API envia
3. **Ajuste o mapeamento** dos dados no workflow

### Problema 2: Formato dos Dados da Evolution API

A Evolution API envia dados em um formato diferente do que o workflow espera.

#### Formato que a Evolution API Envia:

```json
{
  "event": "messages.upsert",
  "data": {
    "key": {
      "remoteJid": "5531999999999@s.whatsapp.net",
      "fromMe": false
    },
    "message": {
      "conversation": "mensagem de texto"
    },
    "pushName": "Nome do Usuário"
  }
}
```

#### O que o Workflow Espera:

```json
{
  "whatsapp": "5531999999999",
  "mensagem": "mensagem de texto",
  "tipo": "text",
  "messageId": "message_id",
  "firstname": "Nome do Usuário",
  "userId": "user_id"
}
```

### Solução: Ajustar o Workflow do n8n

#### Passo 1: Adicionar Node para Extrair Dados

Antes do node "Verifica Usuario", adicione um node "Function" ou "Code" para extrair os dados:

```javascript
// Extrair dados da Evolution API
const event = $input.first().json.event;
const data = $input.first().json.data;

// Extrair número do WhatsApp (remover @s.whatsapp.net)
const remoteJid = data?.key?.remoteJid || '';
const whatsapp = remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '');

// Extrair mensagem
const message = data?.message?.conversation || 
                data?.message?.extendedTextMessage?.text || 
                '';

// Extrair nome
const firstname = data?.pushName || 'Usuário';

// Extrair tipo de mensagem
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
if (data?.message?.audioMessage) tipo = 'audio';
if (data?.message?.videoMessage) tipo = 'video';

// Extrair ID da mensagem
const messageId = data?.key?.id || '';

return {
  json: {
    whatsapp: whatsapp,
    mensagem: message,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null, // Será preenchido depois
    event: event,
    originalData: data
  }
};
```

#### Passo 2: Verificar o Node "Verifica Usuario"

Certifique-se de que o node "Verifica Usuario" está recebendo os dados corretos:

1. **Abra o node "Verifica Usuario"**
2. **Verifique se está usando** `{{ $json.whatsapp }}` corretamente
3. **Verifique se a busca no Supabase** está funcionando

#### Passo 3: Corrigir o Node "Enviar texto"

No node "Enviar texto", verifique:

1. **Numero Do Destinatario**: 
   - Use: `{{ $json.whatsapp }}`
   - **Formato**: Deve ser apenas números (ex: `5531999999999`)
   - **Não deve ter**: `@s.whatsapp.net` ou outros caracteres

2. **Nome Da Instancia**: 
   - Deve ser: `Alfredoo` (exatamente como está configurado na Evolution API)

3. **Mensagem**: 
   - Pode usar texto fixo ou `{{ $json.mensagem }}`

### Passo 4: Testar o Workflow

1. **Envie uma mensagem de teste** para o novo número
2. **Verifique o INPUT** do node "Verifica Usuario"
3. **Verifique se os campos** não estão mais `null`
4. **Execute o workflow** e verifique se funciona

## 🔍 Verificações Adicionais

### 1. Verificar Webhook da Evolution API

Certifique-se de que o webhook está configurado corretamente:

- **URL**: `https://n8n.alfredoo.online/webhook-test/verifica-zap`
- **Events**: `MESSAGES_UPSERT`, `MESSAGES_UPDATE`
- **Method**: `POST`

### 2. Verificar Formato do Número

O número do WhatsApp deve estar no formato:
- ✅ **Correto**: `5531999999999` (apenas números)
- ❌ **Errado**: `5531999999999@s.whatsapp.net`
- ❌ **Errado**: `+55 31 99999-9999`

### 3. Verificar Instância da Evolution API

Certifique-se de que:
- **Nome da instância**: `Alfredoo` (exatamente como está no painel)
- **Status**: `Connected` (verde)
- **API Key**: `9262493C1311-4C8E-B6A1-84F123F1501B`

## 📋 Checklist de Correção

- [ ] Adicionar node para extrair dados da Evolution API
- [ ] Ajustar mapeamento dos dados no workflow
- [ ] Verificar formato do número do WhatsApp
- [ ] Verificar node "Verifica Usuario"
- [ ] Verificar node "Enviar texto"
- [ ] Testar workflow completo
- [ ] Verificar se os campos não estão mais `null`
- [ ] Verificar se a mensagem é enviada corretamente

## 🧪 Teste Manual

### Teste 1: Verificar Dados do Webhook

1. **Envie uma mensagem** para o novo número
2. **Verifique o INPUT** do primeiro node do workflow
3. **Verifique se os dados** estão no formato correto
4. **Verifique se o campo `whatsapp`** não está `null`

### Teste 2: Verificar Extração de Dados

1. **Execute o node de extração** manualmente
2. **Verifique o OUTPUT** do node
3. **Verifique se os campos** estão preenchidos corretamente
4. **Verifique se o formato** do número está correto

### Teste 3: Verificar Envio de Mensagem

1. **Execute o node "Enviar texto"** manualmente
2. **Verifique se não há erros**
3. **Verifique se a mensagem** foi enviada
4. **Verifique se o número** está no formato correto

## 🐛 Erros Comuns

### Erro: "Invalid format"

**Causa**: Número do WhatsApp está em formato incorreto

**Solução**: 
- Remover `@s.whatsapp.net` do número
- Usar apenas números: `5531999999999`
- Verificar se não há espaços ou caracteres especiais

### Erro: Campo `whatsapp` está `null`

**Causa**: Dados não estão sendo extraídos corretamente do webhook

**Solução**:
- Adicionar node para extrair dados da Evolution API
- Verificar formato dos dados que a Evolution API envia
- Ajustar mapeamento dos dados no workflow

### Erro: Instância não encontrada

**Causa**: Nome da instância está incorreto

**Solução**:
- Verificar nome da instância no painel da Evolution API
- Usar exatamente o mesmo nome no workflow: `Alfredoo`
- Verificar se a instância está `Connected`

## 📚 Referências

- [Documentação da Evolution API](https://doc.evolution-api.com/)
- [Formato de Mensagens da Evolution API](https://doc.evolution-api.com/docs/webhook/messages)
- [Documentação do n8n](https://docs.n8n.io/)

---

**Última atualização:** 2025-01-11

**Próximo passo:** Adicionar o node de extração de dados no workflow do n8n e testar novamente.


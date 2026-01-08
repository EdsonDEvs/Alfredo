# 🔧 Corrigir Campos Null no n8n - SOLUÇÃO RÁPIDA

## 🚨 Problema Identificado

**No n8n:**
- Node "Organiza Dados" está retornando todos os campos como `null`
- Node "Verifica Usuario" recebe `whatsapp: null`
- Node "Enviar texto" falha com erro "Invalid format" porque `whatsapp` está `null`

## ✅ Solução em 2 Passos

### Passo 1: Verificar Estrutura Real dos Dados

**No n8n:**
1. **Abra o workflow**
2. **Clique no node "InicioChat"**
3. **Veja o painel OUTPUT** (lado direito)
4. **Clique na aba "JSON"** ou "Schema"
5. **Expanda os campos** para ver a estrutura completa
6. **Anote o caminho** até os dados de mensagem

### Passo 2: Adicionar Node Function ANTES do "Organiza Dados"

**Solução mais rápida:** Adicionar um node "Function" que normaliza os dados independente da estrutura.

#### Como Fazer:

1. **Adicione um node "Function"** entre "InicioChat" e "Organiza Dados"
2. **Nomeie como "Normalizar Dados"**
3. **Cole este código:**

```javascript
// Normalizar dados da Evolution API - Funciona com qualquer estrutura
const input = $input.first().json;

// Encontrar os dados (funciona com qualquer estrutura)
function findData(obj) {
  // Tentar diferentes caminhos comuns
  if (obj?.body?.data?.key?.remoteJid) return obj.body.data;
  if (obj?.body?.data?.sender) return obj.body.data;
  if (obj?.body?.data?.message) return obj.body.data;
  if (obj?.data?.key?.remoteJid) return obj.data;
  if (obj?.data?.sender) return obj.data;
  if (obj?.key?.remoteJid) return obj;
  if (obj?.sender) return obj;
  return obj;
}

const data = findData(input);
const body = input.body || {};

// Verificar evento
const event = body.event || input.event || '';

// Se for evento de presença, pular
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: '',
      userId: null,
      skip: true
    }
  };
}

// Extrair número do WhatsApp (tentar todos os caminhos possíveis)
let whatsapp = '';
const remoteJid = data?.key?.remoteJid || data?.sender || data?.remoteJid || data?.from || '';
if (remoteJid) {
  whatsapp = String(remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '')
    .trim();
}

// Extrair mensagem (tentar todos os caminhos possíveis)
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data?.messageText) {
  mensagem = data.messageText;
} else if (data?.text) {
  mensagem = data.text;
} else if (data?.body) {
  mensagem = data.body;
}

// Extrair nome
const firstname = data?.pushName || data?.notifyName || data?.name || 'Usuário';

// Extrair tipo de mensagem
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
else if (data?.message?.audioMessage) tipo = 'audio';
else if (data?.message?.videoMessage) tipo = 'video';
else if (data?.message?.documentMessage) tipo = 'document';
else if (data?.messageType) tipo = data.messageType;
else if (mensagem) tipo = 'text';

// Extrair ID da mensagem
const messageId = data?.key?.id || data?.id || data?.messageId || '';

// Retornar dados normalizados
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    event: event,
    skip: false
  }
};
```

4. **Conecte os nodes:**
   - "InicioChat" → "Normalizar Dados" → "Organiza Dados"

### Passo 3: Ajustar Node "Organiza Dados"

**Depois de adicionar o node Function, ajuste o "Organiza Dados" para usar expressões simples:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

**Ou se preferir manter como está, apenas mude as expressões para:**

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🔍 Se Ainda Não Funcionar

### Opção 1: Adicionar Node IF para Filtrar Eventos de Presença

**Antes do node "Normalizar Dados":**
1. **Adicione um node "IF"**
2. **Condição**: `{{ $json.body?.event !== 'presence.update' && $json.event !== 'presence.update' }}`
3. **Conecte quando TRUE** para "Normalizar Dados"
4. **Quando FALSE**, não processa (eventos de presença não têm mensagem)

### Opção 2: Verificar Dados do "InicioChat"

**Para descobrir a estrutura exata:**
1. **No node "InicioChat"**, veja o OUTPUT
2. **Copie a estrutura completa** dos dados
3. **Ajuste o código do node Function** com base na estrutura real

### Opção 3: Usar Expressões Diretas no "Organiza Dados"

**Se não quiser usar node Function, ajuste as expressões diretamente:**

**Teste estas expressões (uma de cada vez):**

**Opção A:**
```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

**Opção B:**
```
whatsapp: {{ $('InicioChat').item.json.body.data.sender.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.body.data.message?.conversation || '' }}
```

**Opção C:**
```
whatsapp: {{ $('InicioChat').item.json.data.key.remoteJid.replace('@s.whatsapp.net', '').replace('@g.us', '') }}
mensagem: {{ $('InicioChat').item.json.data.message.conversation || '' }}
```

## 🧪 Testar

1. **Execute o workflow** manualmente (ou aguarde uma mensagem)
2. **Verifique o OUTPUT** do node "Normalizar Dados"
3. **Verifique se os campos** não estão mais `null`
4. **Verifique o OUTPUT** do node "Organiza Dados"
5. **Teste o workflow completo**

## 📋 Checklist

- [ ] Node "Normalizar Dados" adicionado
- [ ] Código do node Function colado
- [ ] Nodes conectados: InicioChat → Normalizar Dados → Organiza Dados
- [ ] Expressões do "Organiza Dados" ajustadas
- [ ] Teste executado e campos não estão mais `null`
- [ ] Workflow completo testado

## 🚀 Próximo Passo

**Depois de corrigir:**
1. **Teste enviando uma mensagem real** no WhatsApp
2. **Verifique se os dados são extraídos corretamente**
3. **Verifique se o node "Verifica Usuario" encontra o usuário**
4. **Verifique se o node "Enviar texto" funciona**

---

**Última atualização:** 2025-01-11

**Dica:** A solução mais rápida é adicionar o node "Function" com o código acima. Ele funciona com qualquer estrutura de dados da Evolution API!


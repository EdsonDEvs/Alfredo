# 🔧 Corrigir Workflow para Novo Número

## 🎯 Problema Identificado

**O workflow funcionava com o número antigo, mas após mudança do número na Evolution API, há problemas:**

1. **Node "Organiza Dados"** tenta acessar `$('Auth').item.json.id` antes do node "Auth" ser executado
2. **Expressões** podem não estar verificando o tipo de evento (`messages.upsert` vs `presence.update`)
3. **Node "Auth"** busca usuário por `whatsapp` usando `body.data.key.remoteJid`

## 📊 Fluxo Atual do Workflow

```
InicioChat (Webhook) 
    ↓
Auth (Supabase - Busca usuário por whatsapp)
    ↓
Organiza Dados (Set - Extrai dados)
    ↓
Verifica Usuario (IF - Verifica se userId existe)
    ↓
[Resto do workflow]
```

## ✅ Correções Necessárias

### 1. Node "Organiza Dados" (Linha 382-433)

**Problema:** Campo `userId` tenta acessar `$('Auth').item.json.id` antes do "Auth" executar.

**Solução:** Remover campo `userId` do "Organiza Dados" ou deixar como `null`.

**Expressões Corretas:**

#### Campo: `whatsapp`
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**OU com verificação de evento:**
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') : '' }}
```

#### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

**OU com verificação de evento:**
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '') : '' }}
```

#### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

**OU com verificação de evento:**
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.messageType || 'text') : 'presence' }}
```

#### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.data.key.id || '' }}
```

**OU com verificação de evento:**
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.id || '') : '' }}
```

#### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

**OU com verificação de evento:**
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.pushName || 'Usuário') : 'Usuário' }}
```

#### Campo: `userId` (REMOVER ou deixar como null)
```
null
```

**OU remover completamente este campo.**

### 2. Node "Auth" (Linha 2309-2342)

**Configuração Atual:**
- **Tabela:** `profiles`
- **Filtros:**
  - `whatsapp` = `{{ $json.body.data.key.remoteJid }}`
  - `ativo` = `TRUE`

**Problema:** Pode não estar normalizando o número (removendo `@s.whatsapp.net`).

**Solução:** Ajustar o filtro para normalizar o número:

**Filtro `whatsapp`:**
```
{{ ($json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**OU usar a função `get_user_by_phone` do Supabase (recomendado):**

**Criar novo node HTTP Request após "Organiza Dados":**

**Node: "Busca Usuario por Telefone"**
- **Tipo:** HTTP Request
- **Método:** POST
- **URL:** `https://SEU_SUPABASE_URL/rest/v1/rpc/get_user_by_phone`
- **Headers:**
  - `apikey`: `SUA_API_KEY`
  - `Authorization`: `Bearer SUA_SERVICE_ROLE_KEY`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "phone_input": "{{ $('Organiza Dados').item.json.whatsapp }}"
}
```

### 3. Node "Verifica Usuario" (Linha 348-380)

**Configuração Atual:**
- **Condição:** `{{ $json.userId }}` não está vazio
- **TRUE:** Continua para "Verifica o Tipo de mensagem"
- **FALSE:** Vai para "Enviar texto" (mensagem de cadastro)

**Problema:** Verifica `userId` do "Organiza Dados", mas `userId` não existe mais lá.

**Solução:** Verificar `userId` do node "Auth" ou do node "Busca Usuario por Telefone".

**Condição:**
```
{{ $('Auth').item.json.id && $('Auth').item.json.id !== '' }}
```

**OU se usar o node "Busca Usuario por Telefone":**
```
{{ $json.user_id && $json.user_id !== '' }}
```

### 4. Adicionar Node IF para Verificar Mensagem Vazia

**Após "Organiza Dados", adicionar node IF:**

**Node: "Verifica Mensagem"**
- **Tipo:** IF
- **Condição:** `{{ $json.mensagem && $json.mensagem !== '' }}`
- **TRUE:** Continua (tem mensagem)
- **FALSE:** Para (presence.update ou mensagem vazia)

## 📋 Passos para Corrigir

### Passo 1: Ajustar Node "Organiza Dados"

1. Abrir node "Organiza Dados"
2. Remover campo `userId` ou mudar para `null`
3. Ajustar expressões para verificar evento (opcional, mas recomendado)
4. Salvar

### Passo 2: Ajustar Node "Auth"

1. Abrir node "Auth"
2. Ajustar filtro `whatsapp` para normalizar número:
   ```
   {{ ($json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
   ```
3. Salvar

**OU criar node "Busca Usuario por Telefone" após "Organiza Dados" e usar função `get_user_by_phone`.**

### Passo 3: Ajustar Node "Verifica Usuario"

1. Abrir node "Verifica Usuario"
2. Ajustar condição para verificar `userId` do node "Auth":
   ```
   {{ $('Auth').item.json.id && $('Auth').item.json.id !== '' }}
   ```
3. Salvar

### Passo 4: Adicionar Node IF para Verificar Mensagem (Opcional)

1. Adicionar node IF após "Organiza Dados"
2. Configurar condição: `{{ $json.mensagem && $json.mensagem !== '' }}`
3. Conectar TRUE para continuar workflow
4. Conectar FALSE para parar (ou node vazio)

## 🔍 Verificações

### 1. Verificar Estrutura do Webhook

**Evento `messages.upsert`:**
```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net",
        "id": "3A8ED2A0AD056D5A6A14"
      },
      "message": {
        "conversation": "Gastei 10 reais na sorveteria"
      },
      "messageType": "conversation",
      "pushName": "Edson"
    }
  }
}
```

**Evento `presence.update`:**
```json
{
  "body": {
    "event": "presence.update",
    "data": {
      "id": "100640277659847@lid"
    },
    "sender": "553197599924@s.whatsapp.net"
  }
}
```

### 2. Verificar Número do Bot

**Número do Bot (Evolution API):** `553197599924`
- Este é o número que **recebe** mensagens
- **NÃO usar** para identificar clientes

**Número do Cliente:** `body.data.key.remoteJid` (em `messages.upsert`)
- Este é o número que **envia** mensagens
- **USAR** para identificar clientes

### 3. Verificar Tabela `profiles` no Supabase

**Campos necessários:**
- `id` (UUID)
- `whatsapp` (VARCHAR) - Número do WhatsApp normalizado
- `phone` (VARCHAR) - Telefone (opcional)
- `ativo` (BOOLEAN) - Status do usuário

**Verificar se os números estão salvos corretamente:**
```sql
SELECT id, nome, whatsapp, phone, ativo
FROM profiles
WHERE whatsapp IS NOT NULL;
```

## 🧪 Testar

1. **Enviar mensagem** no WhatsApp para o bot
2. **Verificar** se o webhook chega no n8n
3. **Verificar** se o node "Auth" encontra o usuário
4. **Verificar** se o node "Organiza Dados" extrai os dados corretamente
5. **Verificar** se o workflow continua corretamente

## ✅ Checklist

- [ ] Node "Organiza Dados": Campo `userId` removido ou `null`
- [ ] Node "Organiza Dados": Expressões ajustadas (com verificação de evento)
- [ ] Node "Auth": Filtro `whatsapp` normaliza número
- [ ] Node "Verifica Usuario": Verifica `userId` do node "Auth"
- [ ] Node IF "Verifica Mensagem" adicionado (opcional)
- [ ] Números no Supabase estão normalizados (sem `@s.whatsapp.net`)
- [ ] Workflow testado com mensagem real

---

**Última atualização:** 2025-01-11

**Conclusão:** O workflow precisa ser ajustado para:
1. Remover campo `userId` do "Organiza Dados" (causa erro)
2. Normalizar número do WhatsApp no node "Auth"
3. Verificar `userId` do node "Auth" no "Verifica Usuario"
4. Adicionar verificação de evento (opcional, mas recomendado)





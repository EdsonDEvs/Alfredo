# 📱 Número do Bot na Evolution API

## 🎯 Configuração Atual

**Número do Bot (Evolution API):** `553197599924`  
**Instância:** `Alfredoo`  
**Função:** Receber mensagens dos clientes para o sistema financeiro

## 🔍 Como Funciona a Identificação

### Fluxo de Identificação:

```
Cliente → Envia mensagem para 553197599924
    ↓
Evolution API → Recebe a mensagem
    ↓
n8n → Processa via webhook
    ↓
Sistema → Identifica cliente pelo número que ENVIA (não pelo que recebe)
    ↓
Supabase → Busca cliente pelo número do WhatsApp
    ↓
Sistema Financeiro → Processa transação para o cliente correto
```

## ✅ Importante: Identificação pelo Número que ENVIA

**O sistema identifica clientes pelo número que ENVIA mensagens, não pelo número que RECEBE:**

- **Número do Bot (recebe):** `553197599924` (fixo)
- **Número do Cliente (envia):** `553172242378`, `553198632243`, etc. (variável)
- **Identificação:** Sistema busca no Supabase pelo número do cliente que ENVIOU a mensagem

## 📊 Exemplo de Fluxo

### Cliente Envia Mensagem:

**Cliente:** `553172242378` (Edson)  
**Envia para:** `553197599924` (Bot)  
**Mensagem:** "Gastei 10 reais na sorveteria"

### Sistema Processa:

1. **Evolution API recebe** a mensagem do cliente `553172242378`
2. **Webhook envia** para n8n com:
   - `body.data.key.remoteJid`: `553172242378@s.whatsapp.net` (número do cliente)
   - `body.sender`: `553197599924@s.whatsapp.net` (número do bot - quem recebe)
3. **n8n extrai** o número do cliente: `553172242378`
4. **Sistema busca** no Supabase pelo número `553172242378`
5. **Sistema processa** a transação para o cliente encontrado

## 🔧 Verificações Necessárias

### 1. Número do Bot Está Conectado?

**Verificar:**
- No painel da Evolution API, o número `553197599924` está conectado?
- Status está "Connected" (verde)?
- Instância "Alfredoo" está ativa?

### 2. Webhook Está Configurado?

**Verificar:**
- Webhook está apontando para: `https://n8n.alfredoo.online/webhook-test/agente-financeiro`
- Eventos `MESSAGES_UPSERT` estão habilitados?
- Eventos `MESSAGES_UPDATE` estão habilitados?

### 3. Clientes Estão Cadastrados no Supabase?

**Verificar:**
- Clientes têm números cadastrados no campo `whatsapp` ou `phone`?
- Função `get_user_by_phone` está funcionando?
- Números estão no formato correto (apenas números, sem `@s.whatsapp.net`)?

## 📋 Números Cadastrados

### Usuários no Supabase:

- **Edson:** `553172242378`
- **apolo:** `553198632243`

### Número do Bot:

- **Bot (Evolution API):** `553197599924`

## ✅ Expressões Corretas

### Campo: `whatsapp` (Número do Cliente)

**Expressão:**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || $('InicioChat').item.json.body.sender || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Resultado esperado:**
- Para mensagem do Edson: `553172242378` ✅
- Para mensagem do apolo: `553198632243` ✅
- **NÃO** `553197599924` (esse é o número do bot, não do cliente)

## 🧪 Testar

### Teste 1: Cliente Envia Mensagem

1. **Cliente `553172242378`** (Edson) envia mensagem para `553197599924` (Bot)
2. **Sistema deve extrair:** `553172242378` (número do cliente)
3. **Sistema deve buscar** no Supabase pelo número `553172242378`
4. **Sistema deve processar** a transação para o Edson

### Teste 2: Verificar Identificação

1. **No n8n**, verifique o campo `whatsapp` no node "Organiza Dados"
2. **Deve mostrar:** Número do cliente que ENVIOU (não o número do bot)
3. **Verifique** se o node "Verifica Usuario" encontra o cliente no Supabase

## 🚨 Problemas Comuns

### Problema 1: Sistema Está Usando Número do Bot

**Sintoma:** Sistema tenta buscar cliente pelo número `553197599924` (bot)

**Solução:**
- Verifique se a expressão está extraindo `body.data.key.remoteJid` (número do cliente)
- **NÃO** use `body.sender` se ele contém o número do bot

### Problema 2: Cliente Não é Encontrado

**Sintoma:** Node "Verifica Usuario" não encontra cliente no Supabase

**Solução:**
1. Verifique se o número do cliente está cadastrado no Supabase
2. Verifique o formato do número (deve ser apenas números, sem `@s.whatsapp.net`)
3. Teste a função `get_user_by_phone` manualmente no Supabase

### Problema 3: Número Está com Formato Errado

**Sintoma:** Número tem `@s.whatsapp.net` ou outros caracteres

**Solução:**
- Use `.replace('@s.whatsapp.net', '')` na expressão
- Certifique-se de que o número está apenas com números

## 📋 Checklist

- [ ] Número do bot `553197599924` está conectado na Evolution API
- [ ] Webhook está configurado corretamente
- [ ] Expressões estão extraindo o número do cliente (não do bot)
- [ ] Clientes estão cadastrados no Supabase com números corretos
- [ ] Função `get_user_by_phone` está funcionando
- [ ] Sistema identifica clientes corretamente pelo número que ENVIA

## 🚀 Próximo Passo

**Depois de verificar:**
1. **Teste enviando uma mensagem** do cliente para o bot
2. **Verifique se o sistema identifica** o cliente corretamente
3. **Verifique se a transação** é processada para o cliente correto

---

**Última atualização:** 2025-01-11

**Conclusão:** O número do bot é `553197599924`. O sistema identifica clientes pelo número que ENVIA mensagens (não pelo número que recebe). Certifique-se de que as expressões estão extraindo o número correto do cliente.


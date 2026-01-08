# 🤖 Fluxo do Assistente de IA no WhatsApp

## 🎯 Objetivo do Sistema

**Assistente de IA no WhatsApp que:**
1. Recebe mensagens dos clientes
2. Coleta dados do cliente (transações, despesas, etc.)
3. Processa as mensagens com IA
4. Envia dados para o sistema financeiro
5. Responde ao cliente via WhatsApp

## 📊 Fluxo Completo

### 1. Cliente Envia Mensagem no WhatsApp

```
Cliente (553172242378) → Envia mensagem → Bot (553197599924)
    Exemplo: "Gastei 10 reais na sorveteria"
```

### 2. Evolution API Recebe Mensagem

```
Evolution API → Recebe mensagem
    ↓
Evento: messages.upsert
    ↓
Webhook → Envia para n8n
```

### 3. n8n Processa Mensagem

```
Webhook (InicioChat) → Recebe dados
    ↓
Organiza Dados → Extrai dados do cliente
    ↓
Verifica Usuario → Busca cliente no Supabase
    ↓
IA Processa → Analisa mensagem e extrai transação
    ↓
Sistema Financeiro → Salva transação
    ↓
Responde Cliente → Envia resposta via WhatsApp
```

## 🔧 Estrutura do Workflow no n8n

### Nodes do Workflow:

1. **InicioChat** (Webhook)
   - Recebe dados da Evolution API
   - Eventos: `messages.upsert`, `presence.update`

2. **Organiza Dados** (Set/Edit Fields)
   - Extrai dados do cliente:
     - `whatsapp`: Número do cliente
     - `mensagem`: Texto da mensagem
     - `tipo`: Tipo de mensagem
     - `messageId`: ID da mensagem
     - `firstname`: Nome do cliente

3. **IF** (Verifica Mensagem)
   - Verifica se há mensagem
   - Processa apenas quando `mensagem !== ''`

4. **Verifica Usuario** (HTTP Request)
   - Busca cliente no Supabase
   - Usa função `get_user_by_phone(whatsapp)`
   - Retorna: `user_id`, `full_name`, `subscription_status`

5. **IA Processa** (Function/Code ou API)
   - Analisa mensagem do cliente
   - Extrai dados da transação:
     - Valor
     - Descrição
     - Categoria
     - Data

6. **Sistema Financeiro** (HTTP Request)
   - Salva transação no Supabase
   - Atualiza dados do cliente

7. **Responde Cliente** (Evolution API - Enviar Texto)
   - Envia resposta via WhatsApp
   - Confirma transação ou solicita mais dados

## 📋 Dados Coletados

### Dados do Cliente:
- **whatsapp**: Número do WhatsApp (ex: `553172242378`)
- **mensagem**: Texto da mensagem (ex: "Gastei 10 reais na sorveteria")
- **firstname**: Nome do cliente (ex: "Edson")
- **userId**: ID do usuário no Supabase

### Dados da Transação (Extraídos pela IA):
- **valor**: Valor da transação (ex: `10.00`)
- **descricao**: Descrição da transação (ex: "Sorveteria")
- **categoria**: Categoria da transação (ex: "Alimentação")
- **data**: Data da transação (ex: `2025-01-11`)

## 🔍 Problemas Identificados e Soluções

### Problema 1: Campos `null` no "Organiza Dados"

**Causa:** Evento `presence.update` não tem dados de mensagem

**Solução:**
- Expressões verificam evento antes de extrair dados
- Processar apenas eventos `messages.upsert`

### Problema 2: Campo `userId` Causa Erro

**Causa:** Tenta acessar "Verifica Usuario" antes dele ser executado

**Solução:**
- Campo `userId` deve ser `null` no "Organiza Dados"
- Adicionar `userId` depois do "Verifica Usuario"

### Problema 3: Número do Bot vs Número do Cliente

**Causa:** Confusão entre número do bot e número do cliente

**Solução:**
- Número do bot: `553197599924` (quem recebe)
- Número do cliente: `body.data.key.remoteJid` (quem envia)
- Usar apenas `body.data.key.remoteJid` para identificar cliente

## ✅ Expressões Corretas para "Organiza Dados"

### Campo: `whatsapp`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') : '' }}
```

### Campo: `mensagem`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '') : '' }}
```

### Campo: `tipo`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.messageType || 'text') : 'presence' }}
```

### Campo: `messageId`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.key.id || '') : '' }}
```

### Campo: `firstname`
```
{{ $('InicioChat').item.json.body.event === 'messages.upsert' ? ($('InicioChat').item.json.body.data.pushName || 'Usuário') : 'Usuário' }}
```

### Campo: `userId`
```
null
```

## 🚀 Próximos Passos

1. **Corrigir expressões** no "Organiza Dados"
2. **Adicionar node IF** para verificar se há mensagem
3. **Ajustar campo `userId`** (null ou remover)
4. **Testar com mensagem real** no WhatsApp
5. **Verificar se o fluxo funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** O workflow é um assistente de IA que coleta dados do cliente e envia para o sistema financeiro. As expressões devem extrair corretamente os dados do cliente para processar as mensagens.





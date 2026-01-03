# 🤖 Fluxo Completo do Assistente de IA no WhatsApp

## 🎯 Objetivo do Sistema

**Assistente de IA no WhatsApp que:**
1. ✅ Recebe mensagens dos clientes via WhatsApp
2. ✅ Identifica o cliente pelo número do WhatsApp
3. ✅ Processa a mensagem com IA para extrair dados financeiros
4. ✅ Salva transações no sistema financeiro (Supabase)
5. ✅ Responde ao cliente com confirmação ou análise

## 📊 Fluxo Completo do Workflow

### 1. Cliente Envia Mensagem

```
Cliente (553172242378) → Envia mensagem → Bot (553197599924)
    Exemplo: "Gastei 10 reais na sorveteria"
```

### 2. Evolution API Recebe e Envia para n8n

```
Evolution API → Recebe mensagem
    ↓
Evento: messages.upsert
    ↓
Webhook → Envia para n8n
    URL: https://n8n.alfredoo.online/webhook-test/agente-financeiro
```

### 3. n8n Processa (Workflow)

```
┌─────────────────────────────────────────────────────────────┐
│ InicioChat (Webhook)                                        │
│ Recebe dados da Evolution API                               │
│ Evento: messages.upsert ou presence.update                  │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Organiza Dados (Set/Edit Fields)                            │
│ Extrai dados do cliente:                                    │
│ - whatsapp: Número do cliente                               │
│ - mensagem: Texto da mensagem                               │
│ - tipo: Tipo de mensagem                                    │
│ - messageId: ID da mensagem                                 │
│ - firstname: Nome do cliente                                │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ IF (Verifica Mensagem)                                      │
│ Condição: mensagem !== ''                                   │
│ TRUE → Processa (tem mensagem)                              │
│ FALSE → Não processa (presence.update)                      │
└─────────────────┬───────────────────────────────────────────┘
                  ↓ (TRUE)
┌─────────────────────────────────────────────────────────────┐
│ Verifica Usuario (HTTP Request)                             │
│ Busca cliente no Supabase                                   │
│ Função: get_user_by_phone(whatsapp)                         │
│ Retorna: user_id, full_name, subscription_status            │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ IA Processa (Agent/Function)                                │
│ Analisa mensagem com IA                                     │
│ Extrai dados da transação:                                  │
│ - valor: Valor da transação                                 │
│ - descricao: Descrição da transação                         │
│ - categoria: Categoria da transação                         │
│ - data: Data da transação                                   │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Sistema Financeiro (HTTP Request)                           │
│ Salva transação no Supabase                                 │
│ Tabela: transacoes                                          │
│ Atualiza dados do cliente                                   │
└─────────────────┬───────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────────────────┐
│ Responde Cliente (Evolution API)                            │
│ Envia resposta via WhatsApp                                 │
│ Exemplo: "✅ Transação registrada: R$ 10,00 na Sorveteria"  │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Nodes do Workflow

### 1. **InicioChat** (Webhook)
- **Tipo:** Webhook
- **URL:** `/webhook-test/agente-financeiro`
- **Recebe:** Dados da Evolution API
- **Eventos:** `messages.upsert`, `presence.update`

### 2. **Organiza Dados** (Set/Edit Fields)
- **Tipo:** Set ou Edit Fields
- **Função:** Extrair dados do cliente
- **Campos:**
  - `whatsapp`: Número do cliente
  - `mensagem`: Texto da mensagem
  - `tipo`: Tipo de mensagem
  - `messageId`: ID da mensagem
  - `firstname`: Nome do cliente

### 3. **IF** (Verifica Mensagem)
- **Tipo:** IF
- **Condição:** `{{ $json.mensagem && $json.mensagem !== '' }}`
- **Função:** Processar apenas quando há mensagem

### 4. **Verifica Usuario** (HTTP Request)
- **Tipo:** HTTP Request
- **URL:** `https://SEU_SUPABASE_URL/rest/v1/rpc/get_user_by_phone`
- **Método:** POST
- **Body:** `{"phone_input": "{{ $json.whatsapp }}"}`
- **Função:** Buscar cliente no Supabase

### 5. **IA Processa** (Agent/Function)
- **Tipo:** Agent ou Function
- **Função:** Analisar mensagem com IA
- **Extrai:** Valor, descrição, categoria, data

### 6. **Sistema Financeiro** (HTTP Request)
- **Tipo:** HTTP Request
- **URL:** `https://SEU_SUPABASE_URL/rest/v1/transacoes`
- **Método:** POST
- **Body:** Dados da transação
- **Função:** Salvar transação no Supabase

### 7. **Responde Cliente** (Evolution API)
- **Tipo:** Evolution API
- **Ação:** Enviar Texto
- **Instância:** Alfredoo
- **Destinatário:** `{{ $json.whatsapp }}`
- **Mensagem:** Resposta da IA ou confirmação

## 📋 Dados Coletados

### Dados do Cliente (Extraídos do WhatsApp):
- **whatsapp**: `553172242378` (número do cliente)
- **mensagem**: `"Gastei 10 reais na sorveteria"` (texto da mensagem)
- **firstname**: `"Edson"` (nome do cliente)
- **userId**: `uuid-do-usuario` (ID no Supabase)

### Dados da Transação (Extraídos pela IA):
- **valor**: `10.00` (valor da transação)
- **descricao**: `"Sorveteria"` (descrição)
- **categoria**: `"Alimentação"` (categoria)
- **data**: `2025-01-11` (data da transação)
- **tipo**: `"despesa"` (tipo de transação)

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

## 🔍 Problemas Identificados

### Problema 1: Campos `null` no "Organiza Dados"
- **Causa:** Evento `presence.update` não tem dados de mensagem
- **Solução:** Expressões verificam evento antes de extrair dados

### Problema 2: Campo `userId` Causa Erro
- **Causa:** Tenta acessar "Verifica Usuario" antes dele ser executado
- **Solução:** Campo `userId` deve ser `null` no "Organiza Dados"

### Problema 3: Workflow Processa `presence.update`
- **Causa:** Workflow tenta processar eventos sem mensagem
- **Solução:** Adicionar node IF para verificar se há mensagem

## 🚀 Próximos Passos

1. **Corrigir expressões** no "Organiza Dados"
2. **Adicionar node IF** para verificar se há mensagem
3. **Ajustar campo `userId`** (null ou remover)
4. **Testar com mensagem real** no WhatsApp
5. **Verificar se o fluxo funciona completamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** O workflow é um assistente de IA que coleta dados do cliente e envia para o sistema financeiro. As expressões devem extrair corretamente os dados do cliente para processar as mensagens com IA.





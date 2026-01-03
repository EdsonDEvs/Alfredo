# 📋 Resumo: Workflow do Assistente de IA

## 🎯 Função do Workflow

**Assistente de IA no WhatsApp que:**
- Recebe mensagens dos clientes
- Coleta dados do cliente (transações, despesas, etc.)
- Processa mensagens com IA
- Salva dados no sistema financeiro
- Responde ao cliente via WhatsApp

## 📊 Fluxo Simplificado

```
Cliente → WhatsApp → Evolution API → n8n → IA → Sistema Financeiro → Resposta
```

## 🔧 Nodes do Workflow

1. **InicioChat** (Webhook) - Recebe dados da Evolution API
2. **Organiza Dados** (Set) - Extrai dados do cliente
3. **IF** (Verifica Mensagem) - Processa apenas quando há mensagem
4. **Verifica Usuario** (HTTP Request) - Busca cliente no Supabase
5. **IA Processa** (Agent/Function) - Analisa mensagem com IA
6. **Sistema Financeiro** (HTTP Request) - Salva transação
7. **Responde Cliente** (Evolution API) - Envia resposta

## ✅ Correções Necessárias

### 1. Expressões no "Organiza Dados"
- Verificar evento antes de extrair dados
- Processar apenas `messages.upsert`
- Campo `userId` deve ser `null`

### 2. Adicionar Node IF
- Verificar se há mensagem antes de processar
- Evitar processar `presence.update`

### 3. Número do Bot
- Bot: `553197599924` (quem recebe)
- Cliente: `body.data.key.remoteJid` (quem envia)

## 📋 Expressões Finais

**Veja arquivo:** `EXPRESSOES-FINAIS-COMPLETAS.txt`

---

**Última atualização:** 2025-01-11





# ✅ Checklist para Ativar Workflow

## 🚨 Erro: "Problem running workflow"

Este erro aparece quando há problemas que impedem a ativação do workflow.

---

## 📋 Checklist de Verificação

### 1. **Tokens Uazapi Configurados** ⚠️ CRÍTICO

**Verifique em TODOS os nodes de envio de mensagem:**

- [ ] "Responde o Cliente" - Token configurado?
- [ ] "RespondeCliente" - Token configurado?
- [ ] "RespondeClienteConsulta" - Token configurado?
- [ ] "MensagemErro" - Token configurado?
- [ ] "EnviaWhatsapp" - Token configurado?
- [ ] "Enviar texto" - Token configurado?
- [ ] "Enviar texto1" - Token configurado?

**Como verificar:**
1. Abra cada node
2. Veja o header `token`
3. Se estiver `SEU_TOKEN_UAZAPI_AQUI`, **SUBSTITUA pelo token real**

**Como corrigir:**
- No campo "JSON (Headers)", substitua:
  ```json
  "token": "SEU_TOKEN_UAZAPI_AQUI"
  ```
- Por:
  ```json
  "token": "seu-token-real-aqui"
  ```

### 2. **URLs Corretas** ✅

**Verifique se todas as URLs estão corretas:**

- [ ] URLs uazapi: `https://free.uazapi.com/send/text` (ou seu subdomain)
- [ ] Não há `SEU_SERVIDOR_EVOLUTION_API` ou similares
- [ ] URLs de busca de mídia (se ainda usar Evolution API)

### 3. **Nodes Conectados** ✅

**Verifique se todos os nodes estão conectados:**

- [ ] Não há nodes soltos
- [ ] Todos os nodes têm entrada e saída (exceto webhooks e finais)
- [ ] Não há "dead ends"

### 4. **Expressões Válidas** ✅

**Verifique expressões que referenciam nodes:**

- [ ] `$('Organiza Dados')` - Node existe?
- [ ] `$('Auth')` - Node existe?
- [ ] `$('CentralizaDados')` - Node existe?
- [ ] Não há `$('NodeInexistente')`

### 5. **Credenciais Configuradas** ✅

**Verifique se todas as credenciais estão configuradas:**

- [ ] Supabase - Configurada?
- [ ] Redis - Configurada?
- [ ] OpenAI - Configurada?
- [ ] Gmail - Configurada? (se usado)
- [ ] HTTP Header Auth - Configurada? (se usado)

---

## 🔧 Solução Rápida

### Passo 1: Configurar TODOS os Tokens

**Ação mais importante!**

1. Abra cada node HTTP Request de envio de mensagem (7 nodes)
2. Em cada um, substitua `SEU_TOKEN_UAZAPI_AQUI` pelo token real
3. Salve cada node

**Lista de nodes:**
- Responde o Cliente
- RespondeCliente
- RespondeClienteConsulta
- MensagemErro
- EnviaWhatsapp
- Enviar texto
- Enviar texto1

### Passo 2: Verificar URLs

1. Verifique se todas as URLs estão corretas
2. Não deve haver placeholders como `SEU_SERVIDOR_EVOLUTION_API`

### Passo 3: Tentar Ativar

1. Após configurar os tokens
2. Tente ativar o workflow
3. Se ainda der erro, veja a mensagem específica

---

## 🐛 Problemas Específicos

### Problema: Token não configurado

**Sintoma:** Node mostra erro ou workflow não ativa

**Solução:**
1. Abra o node
2. Configure o token real
3. Salve

### Problema: URL incorreta

**Sintoma:** Erro ao executar node

**Solução:**
1. Verifique a URL
2. Corrija se necessário
3. Salve

### Problema: Node desconectado

**Sintoma:** Workflow não ativa

**Solução:**
1. Conecte o node ao fluxo
2. Salve

---

## ✅ Após Corrigir

1. **Salve o workflow** (Ctrl+S ou Cmd+S)
2. **Tente ativar** novamente
3. **Se ainda der erro**, veja qual é o problema específico
4. **Corrija o problema** mostrado na mensagem

---

## 📝 Nota Importante

**O problema mais comum é tokens não configurados!**

Se você ainda não configurou os tokens da uazapi, o workflow não vai ativar. Configure todos os 7 tokens primeiro.

---

**Status:** ⚠️ Verificar e configurar tokens  
**Prioridade:** 🔴 ALTA - Configurar tokens em todos os nodes




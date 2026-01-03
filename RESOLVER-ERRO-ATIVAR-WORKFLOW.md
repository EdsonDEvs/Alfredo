# 🔧 Resolver Erro: "Problem running workflow"

## 🚨 Erro Atual

**Mensagem:** "Problem running workflow - Please resolve outstanding issues before you activate it"

**Causa:** Há problemas no workflow que impedem a ativação.

---

## ✅ Problemas Comuns e Soluções

### 1. **Tokens/API Keys Não Configurados**

**Problema:** Nodes com placeholders como `SEU_TOKEN_UAZAPI_AQUI`

**Solução:**
1. Abra cada node HTTP Request de envio de mensagem
2. No header `token`, substitua `SEU_TOKEN_UAZAPI_AQUI` pelo token real
3. Salve cada node

**Nodes que precisam de token:**
- "Responde o Cliente"
- "RespondeCliente"
- "RespondeClienteConsulta"
- "MensagemErro"
- "EnviaWhatsapp"
- "Enviar texto"
- "Enviar texto1"

### 2. **URLs com Placeholders**

**Problema:** URLs ainda com `SEU_SERVIDOR_EVOLUTION_API` ou similares

**Solução:**
1. Verifique se todas as URLs estão corretas
2. Substitua placeholders por URLs reais
3. Para uazapi, use: `https://free.uazapi.com/send/text` (ou seu subdomain)

### 3. **Nodes Desconectados**

**Problema:** Nodes sem conexão no fluxo

**Solução:**
1. Verifique se todos os nodes estão conectados
2. Conecte nodes que estão soltos
3. Verifique se não há "dead ends" (nodes sem saída)

### 4. **Expressões Inválidas**

**Problema:** Expressões que referenciam nodes inexistentes

**Solução:**
1. Verifique expressões que usam `$('NomeNode')`
2. Certifique-se de que o node existe e está conectado
3. Corrija expressões inválidas

### 5. **Credenciais Faltando**

**Problema:** Nodes que precisam de credenciais não configuradas

**Solução:**
1. Verifique nodes que precisam de credenciais:
   - Supabase
   - Redis
   - OpenAI
   - Gmail
2. Configure as credenciais necessárias

---

## 🔍 Como Verificar Problemas

### Passo 1: Verificar Nodes com Erros

1. Abra o workflow no n8n
2. Procure por nodes com ícones de erro (vermelho)
3. Clique em cada node com erro
4. Veja a mensagem de erro no OUTPUT

### Passo 2: Verificar Expressões

1. Abra cada node que usa expressões
2. Verifique se as expressões estão corretas
3. Procure por:
   - `$('NodeInexistente')` - Node que não existe
   - `undefined` - Valor não definido
   - Placeholders não substituídos

### Passo 3: Verificar Credenciais

1. Vá em "Credentials" no n8n
2. Verifique se todas as credenciais necessárias estão configuradas:
   - Supabase
   - Redis
   - OpenAI
   - Gmail
   - HTTP Header Auth (se usado)

---

## 📋 Checklist de Verificação

### URLs e Tokens
- [ ] Todos os tokens uazapi configurados (não "SEU_TOKEN_UAZAPI_AQUI")
- [ ] Todas as URLs corretas (não "SEU_SERVIDOR_EVOLUTION_API")
- [ ] Subdomain correto na URL uazapi (free ou outro)

### Nodes e Conexões
- [ ] Todos os nodes estão conectados
- [ ] Não há nodes soltos
- [ ] Não há "dead ends"

### Expressões
- [ ] Todas as expressões referenciam nodes existentes
- [ ] Não há `$('NodeInexistente')`
- [ ] Expressões estão corretas

### Credenciais
- [ ] Supabase configurado
- [ ] Redis configurado
- [ ] OpenAI configurado
- [ ] Gmail configurado (se usado)
- [ ] HTTP Header Auth configurado (se usado)

---

## 🔧 Solução Rápida

### Passo 1: Configurar Tokens

**Em cada node HTTP Request de envio de mensagem:**

1. Abra o node
2. Vá em "Parameters"
3. No campo "JSON (Headers)", encontre:
   ```json
   "token": "SEU_TOKEN_UAZAPI_AQUI"
   ```
4. Substitua pelo token real
5. Salve

### Passo 2: Verificar URLs

**Verifique se todas as URLs estão corretas:**

- ✅ `https://free.uazapi.com/send/text` (uazapi)
- ❌ `https://SEU_SERVIDOR_EVOLUTION_API/...` (placeholder)

### Passo 3: Verificar Conexões

1. Veja o workflow visualmente
2. Certifique-se de que todos os nodes estão conectados
3. Conecte nodes que estão soltos

### Passo 4: Tentar Ativar

1. Após corrigir os problemas
2. Tente ativar o workflow novamente
3. Se ainda der erro, veja a mensagem específica

---

## 🐛 Erros Específicos

### Erro: "Node X is not connected"
**Solução:** Conecte o node ao fluxo

### Erro: "Invalid expression in node Y"
**Solução:** Corrija a expressão no node

### Erro: "Missing credentials"
**Solução:** Configure as credenciais necessárias

### Erro: "Invalid URL"
**Solução:** Corrija a URL no node

---

## ✅ Após Corrigir

1. **Salve o workflow**
2. **Tente ativar novamente**
3. **Se ainda der erro**, veja a mensagem específica
4. **Corrija o problema específico** mostrado

---

**Status:** ⚠️ Workflow com problemas que impedem ativação  
**Solução:** Verificar e corrigir tokens, URLs, conexões e credenciais




# 🚨 REMOVER Condição `id` do Node "Auth"

## ❌ Erro Atual

```
invalid input syntax for type uuid: "sessionid_553172242378"
```

**Causa:** O node "Auth" está tentando buscar por `id` usando `session_id`, mas:
- O campo `id` na tabela `profiles` é do tipo **UUID** (ex: `550e8400-e29b-41d4-a716-446655440000`)
- O `session_id` é uma **string** (ex: `sessionid_553172242378`)
- **Não faz sentido buscar por `id` usando `session_id`**

---

## ✅ Solução: Remover Condição `id`

### O node "Auth" deve ter APENAS 2 condições:

1. **`whatsapp`** = número normalizado
2. **`ativo`** = `TRUE`

### ❌ NÃO deve ter:
- ❌ Condição `id` com `session_id`
- ❌ Condição `id` com qualquer valor

---

## 📋 Passo a Passo para Corrigir

### Passo 1: Abrir Node "Auth"

1. No n8n, clique no node "Auth"
2. Veja a seção "Selecione as condições"
3. Você verá 3 condições (ou mais):
   - ✅ `whatsapp` = `553172242378` (MANTER)
   - ✅ `ativo` = `TRUE` (MANTER)
   - ❌ `id` = `sessionid_553172242378` (REMOVER)

### Passo 2: Remover Condição `id`

1. Encontre a condição com `Nome ou ID: id`
2. Clique no **ícone de lixeira** 🗑️ ao lado dessa condição
3. OU clique em **"Remover"** ou **"Delete"**
4. Confirme a remoção

### Passo 3: Verificar Condições Finais

Após remover, você deve ter **APENAS 2 condições**:

#### Condição 1: `whatsapp`
- **Nome ou ID:** `whatsapp`
- **Valor:** `{{ $json.whatsapp.toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}`
- **Valor avaliado:** `553172242378`

#### Condição 2: `ativo`
- **Nome ou ID:** `ativo`
- **Valor:** `TRUE`

### Passo 4: Salvar e Testar

1. Clique em **"Salvar"** ou pressione Ctrl+S
2. Execute o workflow novamente
3. O erro deve desaparecer

---

## 🔍 Por Que Não Buscar por `id`?

### Estrutura da Tabela `profiles`:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,              -- UUID gerado automaticamente
  nome TEXT,
  whatsapp VARCHAR(20),              -- Número do WhatsApp (sem @s.whatsapp.net)
  phone VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE,
  assinaturaid VARCHAR(50),
  session_id VARCHAR(100)            -- Se existir, é um campo separado
);
```

### O que cada campo faz:

- **`id`**: UUID único do registro (ex: `550e8400-e29b-41d4-a716-446655440000`)
  - ❌ **NÃO** deve ser usado para buscar usuário
  - ✅ É retornado **DEPOIS** de encontrar o usuário

- **`whatsapp`**: Número do WhatsApp (ex: `553172242378`)
  - ✅ **DEVE** ser usado para buscar usuário

- **`ativo`**: Se o usuário está ativo (TRUE/FALSE)
  - ✅ **DEVE** ser usado para filtrar usuários ativos

- **`session_id`**: ID da sessão (se existir na tabela)
  - ⚠️ Se você quiser buscar por `session_id`, use o campo `session_id`, não `id`

---

## 📝 Configuração Correta do Node "Auth"

### Operação:
- **Recurso:** `Row`
- **Operação:** `Get`
- **Tabela:** `profiles`

### Condições (APENAS 2):

#### 1. Campo `whatsapp`:
- **Nome ou ID:** `whatsapp`
- **Condição:** `equals` (igual a)
- **Valor:**
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || $json.whatsapp || $json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

**OU (mais simples, se o "Organiza Dados" já normalizou):**
```javascript
{{ $json.whatsapp.toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### 2. Campo `ativo`:
- **Nome ou ID:** `ativo`
- **Condição:** `equals` (igual a)
- **Valor:** `TRUE`

---

## ⚠️ Se Você Quiser Buscar por `session_id`

Se você realmente precisa buscar por `session_id`, adicione uma condição para o campo `session_id` (não `id`):

### Condição Adicional (OPCIONAL):

#### Campo `session_id`:
- **Nome ou ID:** `session_id` (não `id`!)
- **Condição:** `equals` (igual a)
- **Valor:** `{{ $json.session_id || $('Organiza Dados').item.json.id_da_sessão || '' }}`

**Mas isso geralmente NÃO é necessário**, pois você já está buscando por `whatsapp`, que é único.

---

## ✅ Resumo

**Problema:** Condição `id` com `session_id` causando erro UUID  
**Solução:** Remover condição `id`  
**Condições corretas:** Apenas `whatsapp` e `ativo`  
**Status:** ⚠️ Remover condição `id` manualmente no n8n

---

**Ação necessária:** Remover a condição `id` do node "Auth" no n8n




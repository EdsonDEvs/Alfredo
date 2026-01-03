# 🔧 Corrigir Erro: "invalid input syntax for type uuid"

## 🚨 Erro Atual

**Erro no node "Auth":**
```
Bad request - please check your parameters: 
invalid input syntax for type uuid: '553172242378@s.whatsapp.net'
```

**Causa:** 
- O número do WhatsApp ainda tem `@s.whatsapp.net`
- Está sendo usado em um campo que espera UUID (provavelmente `id`)
- OU a expressão não está normalizando o número corretamente

---

## ✅ Solução

### Problema 1: Número Não Normalizado

O número `553172242378@s.whatsapp.net` precisa ser normalizado para `553172242378`.

### Problema 2: Campo Incorreto

O node "Auth" deve buscar pelo campo `whatsapp`, não pelo campo `id`.

---

## 🔧 Configuração Correta do Node "Auth"

### Operação:
- **Recurso:** `Row`
- **Operação:** `Get`
- **Tabela:** `profiles`

### Condições (Filtros):

#### Condição 1: Buscar por WhatsApp

**Nome ou ID:** `whatsapp`  
**Condição:** `equals` (igual a)  
**Valor:**
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || $('Organiza Dados').item.json.whatsapp || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

**OU (mais simples, usando dados do node anterior):**
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### Condição 2: Verificar se está Ativo

**Nome ou ID:** `ativo`  
**Condição:** `equals` (igual a)  
**Valor:** `TRUE`

---

## 📋 Passo a Passo no n8n

### Passo 1: Abrir Node "Auth"

1. Clique no node "Auth" (está em vermelho)
2. Veja o erro no OUTPUT
3. Clique em "Edit" para editar

### Passo 2: Verificar Condições

1. Vá em "Parameters"
2. Veja a seção "Selecione as condições"
3. **Remova TODAS as condições atuais**
4. Adicione as condições corretas abaixo

### Passo 3: Adicionar Condição 1 - WhatsApp

1. Clique em **"Adicionar condição"**
2. **Nome ou ID:** Digite ou selecione `whatsapp`
3. **Condição:** Selecione `equals` (igual a)
4. **Valor:** Cole esta expressão:
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

### Passo 4: Adicionar Condição 2 - Ativo

1. Clique em **"Adicionar condição"** novamente
2. **Nome ou ID:** Digite ou selecione `ativo`
3. **Condição:** Selecione `equals` (igual a)
4. **Valor:** Digite `TRUE` (sem aspas)

### Passo 5: Salvar e Testar

1. Clique em **"Salvar"**
2. Execute o workflow novamente
3. O erro deve desaparecer

---

## ⚠️ O que NÃO Fazer

### ❌ NÃO use:
- Campo `id` com número do WhatsApp (causa o erro UUID)
- Campo `assinaturaid` para buscar usuário
- Número com `@s.whatsapp.net` (deve ser normalizado)

### ✅ USE:
- Campo `whatsapp` para buscar
- Campo `ativo` para filtrar
- Número normalizado (sem `@s.whatsapp.net`)

---

## 🔍 Verificar Dados do Node Anterior

### Verificar Node "Organiza Dados"

1. Abra o node "Organiza Dados"
2. Veja o OUTPUT
3. Verifique o campo `whatsapp`:
   - ✅ Deve estar normalizado: `553172242378`
   - ❌ Não deve ter: `553172242378@s.whatsapp.net`

### Se o "Organiza Dados" não está normalizando:

**Ajuste a expressão no campo `whatsapp` do "Organiza Dados":**
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

---

## 📝 Estrutura Esperada

### Tabela `profiles` no Supabase:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,              -- UUID, não número do WhatsApp!
  nome TEXT,
  whatsapp VARCHAR(20),              -- Número sem @s.whatsapp.net
  phone VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE,
  assinaturaid VARCHAR(50)
);
```

### Dados de Exemplo:

```sql
-- Correto ✅
INSERT INTO profiles (id, nome, whatsapp, ativo) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'João', '553172242378', TRUE);

-- Errado ❌
INSERT INTO profiles (id, nome, whatsapp, ativo) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'João', '553172242378@s.whatsapp.net', TRUE);
```

---

## ✅ Resumo da Correção

**Node "Auth" deve ter:**

1. **Condição 1:**
   - Campo: `whatsapp`
   - Valor: Número normalizado (sem `@s.whatsapp.net`)

2. **Condição 2:**
   - Campo: `ativo`
   - Valor: `TRUE`

**Expressão para normalizar:**
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

---

**Status:** ⚠️ Erro UUID - Número não normalizado  
**Solução:** Usar campo `whatsapp` com número normalizado, não campo `id`




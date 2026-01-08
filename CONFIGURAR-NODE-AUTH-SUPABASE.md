# 🔧 Configurar Node "Auth" - Supabase

## 🎯 Objetivo

O node "Auth" deve buscar o usuário no Supabase pelo **número do WhatsApp** e verificar se está **ativo**.

---

## ✅ Configuração Correta

### Node: "Auth" (Supabase)

**Tipo:** Supabase  
**Operação:** Get  
**Tabela:** `profiles`

### Condições (Filtros):

#### 1. **Campo: `whatsapp`**
- **Nome ou ID:** `whatsapp`
- **Condição:** `equals` (igual a)
- **Valor:** 
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

**OU (se usar dados do node anterior):**
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### 2. **Campo: `ativo`**
- **Nome ou ID:** `ativo`
- **Condição:** `equals` (igual a)
- **Valor:** `TRUE`

---

## 📋 Configuração Passo a Passo no n8n

### Passo 1: Abrir Node "Auth"

1. Abra o workflow no n8n
2. Encontre o node "Auth"
3. Clique para editar

### Passo 2: Configurar Operação

1. **Credencial:** Selecione "Supabase account"
2. **Usar esquema personalizado:** Deixe desativado (OFF)
3. **Recurso:** `Row`
4. **Operação:** `Get`
5. **Nome ou ID da tabela:** `profiles`

### Passo 3: Adicionar Condições

#### Condição 1: Buscar por WhatsApp

1. Clique em **"Adicionar condição"**
2. **Nome ou ID:** Selecione `whatsapp` (ou digite)
3. **Condição:** Selecione `equals` (igual a)
4. **Valor:** Cole esta expressão:
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### Condição 2: Verificar se está Ativo

1. Clique em **"Adicionar condição"** novamente
2. **Nome ou ID:** Selecione `ativo`
3. **Condição:** Selecione `equals` (igual a)
4. **Valor:** `TRUE`

### Passo 4: Salvar

1. Clique em **"Salvar"** ou pressione Ctrl+S
2. O node está configurado!

---

## 🔍 O que o Node Faz

### Entrada:
- Recebe dados do webhook (uazapi)
- Extrai o número do WhatsApp do remetente

### Processamento:
1. Normaliza o número (remove `@s.whatsapp.net`, etc.)
2. Busca na tabela `profiles`:
   - Onde `whatsapp` = número normalizado
   - E `ativo` = `TRUE`

### Saída:
- **Se encontrar:** Retorna o registro do usuário com `id`, `nome`, `whatsapp`, etc.
- **Se não encontrar:** Retorna vazio (o node "Verifica Usuario" vai detectar)

---

## ⚠️ Importante

### ❌ NÃO use:
- `assinaturaid` = `TRUE` (isso não busca pelo WhatsApp!)
- Buscar apenas por `ativo` (vai retornar todos os usuários ativos)

### ✅ USE:
- `whatsapp` = número normalizado
- `ativo` = `TRUE` (para garantir que só busca usuários ativos)

---

## 📝 Exemplo de Estrutura no Supabase

### Tabela `profiles`:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  nome TEXT,
  whatsapp VARCHAR(20),  -- Número sem @s.whatsapp.net
  phone VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE,
  assinaturaid VARCHAR(50)
);
```

### Dados de Exemplo:

```sql
INSERT INTO profiles (id, nome, whatsapp, ativo) VALUES
('uuid-1', 'João Silva', '553172242378', TRUE),
('uuid-2', 'Maria Santos', '553198632243', TRUE);
```

**Importante:** O campo `whatsapp` deve estar **sem** `@s.whatsapp.net`:
- ✅ Correto: `553172242378`
- ❌ Errado: `553172242378@s.whatsapp.net`

---

## 🔧 Se o Número Não Estiver Normalizado no Supabase

### Opção 1: Normalizar no Supabase

Execute no SQL Editor do Supabase:

```sql
UPDATE profiles
SET whatsapp = REPLACE(REPLACE(REPLACE(whatsapp, '@s.whatsapp.net', ''), '@g.us', ''), '@c.us', '')
WHERE whatsapp LIKE '%@%';
```

### Opção 2: Ajustar Expressão no n8n

Se os números no Supabase ainda têm `@s.whatsapp.net`, ajuste a expressão para não remover:

```javascript
{{ $json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '' }}
```

---

## ✅ Verificação

### Como Testar:

1. **Execute o workflow**
2. **Envie uma mensagem** de um número cadastrado
3. **Veja o OUTPUT do node "Auth"**:
   - Se encontrar: Deve mostrar o registro do usuário
   - Se não encontrar: Deve estar vazio

### Se Não Encontrar:

1. **Verifique o número no Supabase:**
   ```sql
   SELECT id, nome, whatsapp, ativo
   FROM profiles
   WHERE whatsapp LIKE '%553172242378%';
   ```

2. **Verifique se está normalizado:**
   - Deve estar sem `@s.whatsapp.net`
   - Deve estar no formato: `553172242378`

3. **Normalize se necessário:**
   ```sql
   UPDATE profiles
   SET whatsapp = REPLACE(REPLACE(whatsapp, '@s.whatsapp.net', ''), '@g.us', '')
   WHERE whatsapp LIKE '%@%';
   ```

---

## 📋 Resumo da Configuração

**Node "Auth":**
- **Tabela:** `profiles`
- **Operação:** `Get`
- **Condição 1:** `whatsapp` = número normalizado do webhook
- **Condição 2:** `ativo` = `TRUE`

**Expressão para `whatsapp`:**
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

---

**Status:** ✅ Configuração correta  
**Próximo Passo:** Configurar as condições no node "Auth"


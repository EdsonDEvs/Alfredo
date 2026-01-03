# 🔧 Solução Completa: Adicionar Campos de Telefone na Tabela profiles

## 🎯 Problema Identificado

Na imagem do Supabase, a tabela `profiles` mostra apenas:
- `id`
- `username`
- `nome`
- `avatar_url`

**Faltam os campos de telefone:** `phone`, `whatsapp`

Isso significa que a função `get_user_by_phone` no n8n **não vai funcionar** porque não há campos para buscar.

## ✅ Solução

### Passo 1: Executar Script SQL no Supabase

1. **Acesse o Supabase SQL Editor**
2. **Copie e execute o script** `CORRIGIR-PROFILES-ADICIONAR-TELEFONE.sql`
3. **Verifique os resultados**

### Passo 2: Verificar se os Campos Foram Adicionados

No Supabase Table Editor:
1. **Recarregue a página** (F5)
2. **Veja se os campos** `phone` e `whatsapp` aparecem
3. **Se não aparecerem**, clique em "Refresh" ou "Reload"

### Passo 3: Adicionar Números aos Usuários Existentes

**Para o usuário "edson":**
```sql
UPDATE public.profiles 
SET whatsapp = '553197599924'  -- Substitua pelo número real do Edson
WHERE nome = 'edson';
```

**Para o usuário "apolo":**
```sql
UPDATE public.profiles 
SET whatsapp = '5511999999999'  -- Substitua pelo número real do Apolo
WHERE nome = 'apolo';
```

### Passo 4: Testar a Função

```sql
-- Testar com um número real
SELECT * FROM get_user_by_phone('553197599924');
```

Deve retornar:
- `user_id`: UUID do usuário
- `full_name`: Nome do usuário
- `subscription_status`: Status da assinatura

## 🔍 Verificações

### 1. Verificar se os Campos Existem

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%');
```

**Resultado esperado:**
- `phone`
- `whatsapp`
- `phone_number` (se foi adicionado)

### 2. Verificar se a Função Existe

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';
```

**Resultado esperado:**
- `get_user_by_phone`

### 3. Verificar Usuários com Telefone

```sql
SELECT id, nome, phone, whatsapp
FROM public.profiles
WHERE phone IS NOT NULL 
   OR whatsapp IS NOT NULL;
```

## 🚨 Problemas Comuns

### Problema 1: Campos Não Aparecem no Table Editor

**Causa:** Campos foram adicionados, mas a interface não atualizou

**Solução:**
1. Recarregue a página (F5)
2. Clique em "Refresh" ou "Reload"
3. Verifique via SQL se os campos existem

### Problema 2: Função Não Encontra Usuário

**Causa:** Número não está cadastrado ou formato está errado

**Solução:**
1. Verifique se o número está cadastrado:
   ```sql
   SELECT * FROM public.profiles WHERE whatsapp = '553197599924';
   ```
2. Verifique o formato do número (deve ser apenas números, sem +, espaços ou caracteres especiais)
3. Teste a função:
   ```sql
   SELECT * FROM get_user_by_phone('553197599924');
   ```

### Problema 3: RLS Bloqueando (Se Habilitado)

**Causa:** RLS está habilitado e bloqueando a busca

**Solução:**
1. Verifique se RLS está habilitado (na imagem está DESABILITADO ✅)
2. Se estiver habilitado, ajuste as políticas:
   ```sql
   CREATE POLICY "Allow public read for phone lookup"
   ON public.profiles
   FOR SELECT
   TO anon, authenticated
   USING (true);
   ```

## 📋 Checklist

- [ ] Script SQL executado com sucesso
- [ ] Campos `phone` e `whatsapp` adicionados
- [ ] Função `get_user_by_phone` criada
- [ ] Usuários existentes têm números cadastrados
- [ ] Função retorna dados corretamente
- [ ] Node "Verifica Usuario" no n8n funciona

## 🚀 Próximos Passos

1. **Execute o script** `CORRIGIR-PROFILES-ADICIONAR-TELEFONE.sql`
2. **Adicione números** aos usuários existentes
3. **Teste a função** manualmente
4. **Verifique no n8n** se o node "Verifica Usuario" funciona
5. **Teste enviando uma mensagem** no WhatsApp

## 💡 Importante

- **Formato do número:** Apenas números, sem +, espaços ou caracteres especiais
  - ✅ Correto: `553197599924`
  - ❌ Errado: `+55 31 97599-924`, `(31) 97599-924`, `553197599924@whatsapp.net`
- **Busca:** A função busca em `phone`, `whatsapp` e `phone_number`
- **RLS:** Está desabilitado, então não há bloqueios de permissão

---

**Última atualização:** 2025-01-11

**Conclusão:** Execute o script SQL para adicionar os campos de telefone e criar a função. Depois, adicione números aos usuários existentes e teste.


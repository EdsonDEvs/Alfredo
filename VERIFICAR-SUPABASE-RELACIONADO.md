# 🔍 Verificar se o Problema Está Relacionado ao Supabase

## 🎯 Análise

O Supabase pode estar relacionado se:

1. **O node "Verifica Usuario" está falhando** e bloqueando o fluxo
2. **A função `get_user_by_phone` não existe** ou está com erro
3. **As políticas RLS estão bloqueando** a busca
4. **O campo `phone` ou `whatsapp` não está sendo encontrado** corretamente

## ✅ Verificações

### 1. Verificar se a Função Existe no Supabase

Execute no Supabase SQL Editor:

```sql
-- Verificar se a função existe
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- Testar a função
SELECT * FROM get_user_by_phone('553197599924');
```

### 2. Verificar se o Campo Existe

Execute no Supabase SQL Editor:

```sql
-- Verificar se o campo phone ou whatsapp existe
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name = 'phone' OR column_name = 'whatsapp' OR column_name = 'phone_number');
```

### 3. Verificar Políticas RLS

Execute no Supabase SQL Editor:

```sql
-- Verificar políticas RLS da tabela profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';
```

### 4. Verificar se Há Usuários no Banco

Execute no Supabase SQL Editor:

```sql
-- Verificar usuários com telefone
SELECT id, nome, email, phone, whatsapp, phone_number
FROM public.profiles
WHERE phone IS NOT NULL 
   OR whatsapp IS NOT NULL 
   OR phone_number IS NOT NULL;
```

## 🐛 Problemas Possíveis

### Problema 1: Função Não Existe

**Sintoma**: Erro ao buscar usuário no Supabase

**Solução**: Criar a função `get_user_by_phone`

```sql
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::UUID,
    p.nome,
    p.subscription_status
  FROM public.profiles p
  WHERE p.phone = phone_input
     OR p.whatsapp = phone_input
     OR p.phone_number = phone_input;
END;
$$ LANGUAGE plpgsql;
```

### Problema 2: Campo Não Existe

**Sintoma**: Função não encontra usuários

**Solução**: Verificar qual campo está sendo usado e criar se necessário

```sql
-- Verificar campos existentes
SELECT column_name 
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles';

-- Adicionar campo se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
```

### Problema 3: RLS Bloqueando

**Sintoma**: Erro de permissão ao buscar usuário

**Solução**: Ajustar políticas RLS ou usar service role

```sql
-- Permitir busca pública (se necessário)
CREATE POLICY "Allow public read for phone lookup"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);
```

### Problema 4: Formato do Número Diferente

**Sintoma**: Usuário não é encontrado mesmo existindo

**Solução**: Verificar formato do número e normalizar

```sql
-- Função para normalizar número
CREATE OR REPLACE FUNCTION normalize_phone(phone_input VARCHAR)
RETURNS VARCHAR AS $$
BEGIN
  -- Remover caracteres especiais
  RETURN regexp_replace(phone_input, '[^0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql;

-- Usar na busca
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::UUID,
    p.nome,
    p.subscription_status
  FROM public.profiles p
  WHERE normalize_phone(p.phone) = normalize_phone(phone_input)
     OR normalize_phone(p.whatsapp) = normalize_phone(phone_input)
     OR normalize_phone(p.phone_number) = normalize_phone(phone_input);
END;
$$ LANGUAGE plpgsql;
```

## ✅ Mas o Problema Principal NÃO É o Supabase

**O problema principal** é que os campos estão `null` no node "Organiza Dados", o que acontece **ANTES** de chegar no Supabase.

**Fluxo**:
```
InicioChat (Webhook) → Organiza Dados → Verifica Usuario (Supabase)
```

Se os campos estão `null` no "Organiza Dados", o problema está na **extração dos dados do webhook**, não no Supabase.

## 🔧 Solução

### Passo 1: Verificar Estrutura dos Dados

1. **Envie uma mensagem REAL** (pressione Enter)
2. **Verifique o OUTPUT** do "InicioChat"
3. **Veja se o evento** é `messages.upsert` (não `presence.update`)
4. **Veja a estrutura real** dos dados

### Passo 2: Ajustar Expressões

Com base na estrutura real, ajuste as expressões no "Organiza Dados".

### Passo 3: Verificar Supabase (Depois)

Após corrigir a extração dos dados, verifique se o Supabase está funcionando:

1. **Verifique se a função existe**
2. **Verifique se há usuários** com o número
3. **Teste a função** manualmente

## 📋 Checklist

### Antes do Supabase (Problema Principal)

- [ ] Campos não estão `null` no "Organiza Dados"
- [ ] Evento é `messages.upsert` (não `presence.update`)
- [ ] Estrutura dos dados está correta
- [ ] Expressões estão corretas

### Supabase (Depois)

- [ ] Função `get_user_by_phone` existe
- [ ] Campo `phone` ou `whatsapp` existe
- [ ] Políticas RLS estão corretas
- [ ] Há usuários com o número no banco
- [ ] Função retorna dados corretamente

## 🚀 Próximo Passo

**Primeiro**: Corrija a extração dos dados no "Organiza Dados"  
**Depois**: Verifique se o Supabase está funcionando corretamente

---

**Última atualização:** 2025-01-11

**Conclusão:** O problema principal não é o Supabase - é a extração dos dados do webhook. O Supabase só é usado depois, no node "Verifica Usuario". Primeiro, corrija a extração dos dados; depois, verifique o Supabase.


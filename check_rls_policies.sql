-- =====================================================
-- VERIFICAR E CORRIGIR POLÍTICAS RLS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR POLÍTICAS EXISTENTES
-- =====================================================

-- Verificar políticas da tabela profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar políticas da tabela categorias
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'categorias';

-- Verificar políticas da tabela transacoes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'transacoes';

-- Verificar políticas da tabela lembretes
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'lembretes';

-- 2. CRIAR POLÍTICAS SE NÃO EXISTIREM
-- =====================================================

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para categorias
DROP POLICY IF EXISTS "Users can view own categories" ON public.categorias;
CREATE POLICY "Users can view own categories"
  ON public.categorias FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own categories" ON public.categorias;
CREATE POLICY "Users can insert own categories"
  ON public.categorias FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own categories" ON public.categorias;
CREATE POLICY "Users can update own categories"
  ON public.categorias FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.categorias;
CREATE POLICY "Users can delete own categories"
  ON public.categorias FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Políticas para transacoes
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transacoes;
CREATE POLICY "Users can view own transactions"
  ON public.transacoes FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transacoes;
CREATE POLICY "Users can insert own transactions"
  ON public.transacoes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transacoes;
CREATE POLICY "Users can update own transactions"
  ON public.transacoes FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transacoes;
CREATE POLICY "Users can delete own transactions"
  ON public.transacoes FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Políticas para lembretes
DROP POLICY IF EXISTS "Users can view own reminders" ON public.lembretes;
CREATE POLICY "Users can view own reminders"
  ON public.lembretes FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own reminders" ON public.lembretes;
CREATE POLICY "Users can insert own reminders"
  ON public.lembretes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own reminders" ON public.lembretes;
CREATE POLICY "Users can update own reminders"
  ON public.lembretes FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own reminders" ON public.lembretes;
CREATE POLICY "Users can delete own reminders"
  ON public.lembretes FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- 3. VERIFICAR SE RLS ESTÁ HABILITADO
-- =====================================================

-- Verificar se RLS está habilitado nas tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'categorias', 'transacoes', 'lembretes')
  AND schemaname = 'public';

-- 4. TESTAR ACESSO COM USUÁRIO ESPECÍFICO
-- =====================================================

-- Verificar se conseguimos acessar os dados do usuário específico
SELECT 
    'profiles' as tabela,
    COUNT(*) as total
FROM public.profiles 
WHERE id = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'categorias' as tabela,
    COUNT(*) as total
FROM public.categorias 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'transacoes' as tabela,
    COUNT(*) as total
FROM public.transacoes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'lembretes' as tabela,
    COUNT(*) as total
FROM public.lembretes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30';

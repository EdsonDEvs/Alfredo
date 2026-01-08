-- ============================================
-- CORRIGIR RLS PARA PERMITIR CRIAÇÃO DE CATEGORIAS NA IMPORTAÇÃO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Verificar políticas existentes
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'categorias'
ORDER BY policyname;

-- 2. Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Users can insert own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can view own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can update own categories" ON public.categorias;
DROP POLICY IF EXISTS "Users can delete own categories" ON public.categorias;

-- 3. Garantir que RLS está ativado
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;

-- 4. Criar política de SELECT (visualização)
CREATE POLICY "Users can view own categories"
  ON public.categorias
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = userid::text);

-- 5. Criar política de INSERT (criação) - CORRIGIDA
-- IMPORTANTE: Usar ::text para garantir comparação correta
CREATE POLICY "Users can insert own categories"
  ON public.categorias
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = userid::text);

-- 6. Criar política de UPDATE (atualização)
CREATE POLICY "Users can update own categories"
  ON public.categorias
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = userid::text)
  WITH CHECK (auth.uid()::text = userid::text);

-- 7. Criar política de DELETE (exclusão)
CREATE POLICY "Users can delete own categories"
  ON public.categorias
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = userid::text);

-- 8. Verificar se as políticas foram criadas corretamente
SELECT 
  policyname,
  cmd as command,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'categorias'
ORDER BY policyname;

-- ============================================
-- NOTA: Se ainda houver problemas, verifique:
-- 1. O tipo da coluna userid na tabela categorias (deve ser UUID ou TEXT)
-- 2. Se auth.uid() retorna o mesmo tipo que userid
-- 3. Execute: SELECT auth.uid(), userid FROM categorias LIMIT 1; para comparar tipos
-- ============================================







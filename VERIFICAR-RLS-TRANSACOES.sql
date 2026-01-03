-- ============================================
-- VERIFICAR POLÍTICAS RLS DA TABELA TRANSAÇÕES
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Verificar se RLS está ativado
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' 
  AND tablename = 'transacoes';

-- 2. Ver todas as políticas RLS da tabela transacoes
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
WHERE tablename = 'transacoes'
ORDER BY policyname;

-- 3. Criar/Verificar política de SELECT se não existir
-- IMPORTANTE: Execute esta parte apenas se necessário
-- 
-- DROP POLICY IF EXISTS "Users can view own transactions" ON public.transacoes;
-- 
-- CREATE POLICY "Users can view own transactions"
--   ON public.transacoes
--   FOR SELECT
--   TO authenticated
--   USING (auth.uid()::text = userid::text);

-- 4. Testar se consegue ver as transações (como usuário autenticado)
-- Execute enquanto estiver logado na aplicação
SELECT COUNT(*) as total_transacoes_visiveis
FROM public.transacoes;


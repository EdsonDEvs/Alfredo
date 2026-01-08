-- ============================================
-- CORRIGIR POLÍTICAS RLS PARA TRANSAÇÕES
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Verificar políticas RLS atuais
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

-- 2. Remover políticas antigas (se existirem)
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can update own transactions" ON public.transacoes;
DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transacoes;

-- 3. Garantir que RLS está habilitado
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;

-- 4. Criar políticas RLS corretas
-- Política para SELECT (visualizar)
CREATE POLICY "Users can view own transactions"
  ON public.transacoes
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = userid::text);

-- Política para INSERT (criar)
CREATE POLICY "Users can insert own transactions"
  ON public.transacoes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = userid::text);

-- Política para UPDATE (atualizar)
CREATE POLICY "Users can update own transactions"
  ON public.transacoes
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = userid::text)
  WITH CHECK (auth.uid()::text = userid::text);

-- Política para DELETE (deletar)
CREATE POLICY "Users can delete own transactions"
  ON public.transacoes
  FOR DELETE
  TO authenticated
  USING (auth.uid()::text = userid::text);

-- 5. Verificar se as políticas foram criadas
SELECT 
  policyname,
  cmd as command,
  qual as using_expression
FROM pg_policies 
WHERE tablename = 'transacoes'
ORDER BY policyname;

-- 6. Testar consulta (deve retornar as transações do usuário autenticado)
-- NOTA: Esta query só funciona quando você está autenticado na aplicação
-- SELECT COUNT(*) FROM public.transacoes;


-- ============================================
-- ADICIONAR COLUNA PHONE NA TABELA PROFILES
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Adicionar coluna phone se não existir
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Verificar se foi adicionada
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND column_name = 'phone';


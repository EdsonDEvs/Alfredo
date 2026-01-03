-- ============================================
-- Script para Verificar Configuração do Supabase
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar estrutura da tabela profiles
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Verificar se os campos de telefone existem
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%');

-- 3. Verificar se a função get_user_by_phone existe
SELECT 
  routine_name,
  routine_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- 4. Verificar políticas RLS da tabela profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Verificar usuários com telefone cadastrado
SELECT 
  id,
  nome,
  email,
  phone,
  whatsapp,
  phone_number,
  subscription_status
FROM public.profiles
WHERE phone IS NOT NULL 
   OR whatsapp IS NOT NULL 
   OR phone_number IS NOT NULL
LIMIT 10;

-- 6. Testar função get_user_by_phone (substitua pelo número real)
-- SELECT * FROM get_user_by_phone('553197599924');

-- 7. Verificar se há índices nos campos de telefone
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
  AND (indexdef LIKE '%phone%' OR indexdef LIKE '%whatsapp%');

-- ============================================
-- CORREÇÕES (Execute apenas se necessário)
-- ============================================

-- A. Criar campo phone se não existir
-- ALTER TABLE public.profiles 
-- ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- B. Criar campo whatsapp se não existir
-- ALTER TABLE public.profiles 
-- ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

-- C. Criar campo phone_number se não existir
-- ALTER TABLE public.profiles 
-- ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- D. Criar função get_user_by_phone (busca em todos os campos)
-- CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
-- RETURNS TABLE (
--   user_id UUID,
--   full_name VARCHAR,
--   subscription_status VARCHAR
-- ) AS $$
-- BEGIN
--   RETURN QUERY
--   SELECT 
--     p.id::UUID,
--     COALESCE(p.nome, p.full_name, 'Usuário')::VARCHAR,
--     COALESCE(p.subscription_status, 'inactive')::VARCHAR
--   FROM public.profiles p
--   WHERE p.phone = phone_input
--      OR p.whatsapp = phone_input
--      OR p.phone_number = phone_input
--      OR REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g') = REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g')
--      OR REGEXP_REPLACE(p.whatsapp, '[^0-9]', '', 'g') = REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g')
--      OR REGEXP_REPLACE(p.phone_number, '[^0-9]', '', 'g') = REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g')
--   LIMIT 1;
-- END;
-- $$ LANGUAGE plpgsql;

-- E. Criar índice para busca rápida
-- CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
-- CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp ON public.profiles(whatsapp);
-- CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number);

-- F. Permitir busca pública (se necessário para n8n)
-- CREATE POLICY "Allow public read for phone lookup"
-- ON public.profiles
-- FOR SELECT
-- TO anon, authenticated
-- USING (true);

-- ============================================
-- TESTES
-- ============================================

-- Teste 1: Verificar se há usuários
-- SELECT COUNT(*) FROM public.profiles;

-- Teste 2: Verificar usuários com telefone
-- SELECT COUNT(*) 
-- FROM public.profiles
-- WHERE phone IS NOT NULL 
--    OR whatsapp IS NOT NULL 
--    OR phone_number IS NOT NULL;

-- Teste 3: Testar função (substitua pelo número real)
-- SELECT * FROM get_user_by_phone('553197599924');


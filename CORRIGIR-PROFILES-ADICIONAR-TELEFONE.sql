-- ============================================
-- Script para Adicionar Campos de Telefone na Tabela profiles
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Verificar estrutura atual da tabela profiles
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 2. Adicionar campos de telefone (se não existirem)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 3. Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp ON public.profiles(whatsapp);
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number);

-- 4. Criar ou atualizar função get_user_by_phone
-- Esta função busca em TODOS os campos de telefone possíveis
-- Funciona mesmo se alguns campos não existirem
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
DECLARE
  phone_normalized VARCHAR;
BEGIN
  -- Normalizar número de entrada (remover caracteres especiais)
  phone_normalized := REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g');
  
  RETURN QUERY
  SELECT 
    p.id::UUID,
    COALESCE(p.nome, p.username, 'Usuário')::VARCHAR as full_name,
    COALESCE(
      NULLIF(p.subscription_status::TEXT, ''),
      'inactive'
    )::VARCHAR as subscription_status
  FROM public.profiles p
  WHERE 
    -- Buscar em qualquer campo de telefone (exato)
    (p.phone IS NOT NULL AND p.phone = phone_input)
    OR (p.whatsapp IS NOT NULL AND p.whatsapp = phone_input)
    OR (p.phone_number IS NOT NULL AND p.phone_number = phone_input)
    -- Normalizar números (remover caracteres especiais como @s.whatsapp.net)
    OR (p.phone IS NOT NULL AND REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.whatsapp IS NOT NULL AND REGEXP_REPLACE(p.whatsapp, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.phone_number IS NOT NULL AND REGEXP_REPLACE(p.phone_number, '[^0-9]', '', 'g') = phone_normalized)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 5. Verificar se a função foi criada
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- 6. Verificar estrutura atualizada
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%');

-- 7. Testar a função (substitua pelo número real)
-- SELECT * FROM get_user_by_phone('553197599924');

-- ============================================
-- ATUALIZAR USUÁRIOS EXISTENTES (OPCIONAL)
-- ============================================

-- Exemplo: Atualizar usuário "edson" com telefone
-- UPDATE public.profiles 
-- SET whatsapp = '553197599924'  -- Substitua pelo número real
-- WHERE nome = 'edson';

-- Exemplo: Atualizar usuário "apolo" com telefone
-- UPDATE public.profiles 
-- SET whatsapp = '5511999999999'  -- Substitua pelo número real
-- WHERE nome = 'apolo';

-- ============================================
-- VERIFICAÇÕES
-- ============================================

-- Verificar usuários com telefone
SELECT 
  id,
  nome,
  username,
  phone,
  whatsapp,
  phone_number
FROM public.profiles
WHERE phone IS NOT NULL 
   OR whatsapp IS NOT NULL 
   OR phone_number IS NOT NULL;

-- Verificar todos os usuários
SELECT 
  id,
  nome,
  username,
  phone,
  whatsapp,
  phone_number
FROM public.profiles;


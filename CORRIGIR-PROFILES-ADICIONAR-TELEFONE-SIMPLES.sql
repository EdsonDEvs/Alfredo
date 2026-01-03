-- ============================================
-- Script SIMPLIFICADO para Adicionar Campos de Telefone
-- Execute no Supabase SQL Editor
-- ============================================

-- 1. Adicionar campos de telefone (se não existirem)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 2. Criar índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp ON public.profiles(whatsapp) WHERE whatsapp IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number) WHERE phone_number IS NOT NULL;

-- 3. Criar função get_user_by_phone (versão simples e robusta)
-- Esta função funciona mesmo se o campo subscription_status não existir
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
DECLARE
  phone_normalized VARCHAR;
  user_record RECORD;
BEGIN
  -- Normalizar número de entrada (remover caracteres especiais como @s.whatsapp.net)
  phone_normalized := REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g');
  
  -- Buscar usuário
  SELECT 
    p.id,
    COALESCE(p.nome, p.username, 'Usuário') as nome_completo
  INTO user_record
  FROM public.profiles p
  WHERE 
    -- Buscar em qualquer campo de telefone (exato)
    (p.phone IS NOT NULL AND p.phone = phone_input)
    OR (p.whatsapp IS NOT NULL AND p.whatsapp = phone_input)
    OR (p.phone_number IS NOT NULL AND p.phone_number = phone_input)
    -- Normalizar números
    OR (p.phone IS NOT NULL AND REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.whatsapp IS NOT NULL AND REGEXP_REPLACE(p.whatsapp, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.phone_number IS NOT NULL AND REGEXP_REPLACE(p.phone_number, '[^0-9]', '', 'g') = phone_normalized)
  LIMIT 1;
  
  -- Se encontrou usuário, retornar
  IF user_record.id IS NOT NULL THEN
    -- Tentar obter subscription_status se o campo existir
    BEGIN
      RETURN QUERY
      SELECT 
        user_record.id::UUID,
        user_record.nome_completo::VARCHAR,
        COALESCE(p.subscription_status::VARCHAR, 'inactive')::VARCHAR
      FROM public.profiles p
      WHERE p.id = user_record.id;
    EXCEPTION
      WHEN undefined_column THEN
        -- Campo subscription_status não existe, retornar sem ele
        RETURN QUERY
        SELECT 
          user_record.id::UUID,
          user_record.nome_completo::VARCHAR,
          'inactive'::VARCHAR;
    END;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- 4. Verificar se os campos foram adicionados
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%')
ORDER BY column_name;

-- 5. Verificar se a função foi criada
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- 6. Ver todos os usuários (para adicionar números depois)
SELECT 
  id,
  nome,
  username,
  phone,
  whatsapp,
  phone_number
FROM public.profiles;

-- ============================================
-- EXEMPLOS: Adicionar números aos usuários
-- ============================================

-- Atualizar usuário "edson" com telefone
-- UPDATE public.profiles 
-- SET whatsapp = '553197599924'  -- Substitua pelo número real do Edson
-- WHERE nome = 'edson';

-- Atualizar usuário "apolo" com telefone
-- UPDATE public.profiles 
-- SET whatsapp = '5511999999999'  -- Substitua pelo número real do Apolo
-- WHERE nome = 'apolo';

-- ============================================
-- TESTAR A FUNÇÃO
-- ============================================

-- Testar com um número (substitua pelo número real)
-- SELECT * FROM get_user_by_phone('553197599924');


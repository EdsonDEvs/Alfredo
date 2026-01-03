-- ============================================
-- Script FINAL para Adicionar Campos de Telefone
-- Execute no Supabase SQL Editor
-- Versão simples que sempre funciona
-- ============================================

-- 1. Adicionar campos de telefone (se não existirem)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 2. Criar índices para busca rápida (apenas em valores não-nulos)
CREATE INDEX IF NOT EXISTS idx_profiles_whatsapp ON public.profiles(whatsapp) WHERE whatsapp IS NOT NULL;

-- 3. Remover função antiga se existir (necessário para mudar tipo de retorno)
DROP FUNCTION IF EXISTS get_user_by_phone(character varying);
DROP FUNCTION IF EXISTS get_user_by_phone(VARCHAR);

-- 4. Criar função get_user_by_phone (versão SIMPLES)
-- Retorna sempre 'inactive' para subscription_status (pode ajustar depois)
CREATE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
DECLARE
  phone_normalized VARCHAR;
BEGIN
  -- Normalizar número de entrada (remover @s.whatsapp.net, espaços, etc)
  phone_normalized := REGEXP_REPLACE(phone_input, '[^0-9]', '', 'g');
  
  -- Buscar e retornar usuário
  RETURN QUERY
  SELECT 
    p.id::UUID,
    COALESCE(p.nome, p.username, 'Usuário')::VARCHAR as full_name,
    'inactive'::VARCHAR as subscription_status  -- Valor padrão
  FROM public.profiles p
  WHERE 
    -- Buscar em qualquer campo de telefone
    (p.phone IS NOT NULL AND REGEXP_REPLACE(p.phone, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.whatsapp IS NOT NULL AND REGEXP_REPLACE(p.whatsapp, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.phone_number IS NOT NULL AND REGEXP_REPLACE(p.phone_number, '[^0-9]', '', 'g') = phone_normalized)
    OR (p.phone IS NOT NULL AND p.phone = phone_input)
    OR (p.whatsapp IS NOT NULL AND p.whatsapp = phone_input)
    OR (p.phone_number IS NOT NULL AND p.phone_number = phone_input)
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- 5. Verificar se os campos foram adicionados
SELECT 
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%')
ORDER BY column_name;

-- 6. Verificar se a função foi criada
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- 7. Ver todos os usuários
SELECT 
  id,
  nome,
  username,
  phone,
  whatsapp,
  phone_number
FROM public.profiles
ORDER BY nome;

-- ============================================
-- IMPORTANTE: Adicionar números aos usuários
-- ============================================

-- Exemplo: Adicionar número ao usuário "edson"
-- UPDATE public.profiles 
-- SET whatsapp = '553197599924'  -- ⚠️ SUBSTITUA pelo número real do Edson
-- WHERE nome = 'edson';

-- Exemplo: Adicionar número ao usuário "apolo"
-- UPDATE public.profiles 
-- SET whatsapp = '5511999999999'  -- ⚠️ SUBSTITUA pelo número real do Apolo
-- WHERE nome = 'apolo';

-- ============================================
-- TESTAR A FUNÇÃO
-- ============================================

-- Testar função (substitua pelo número real)
-- SELECT * FROM get_user_by_phone('553197599924');
-- SELECT * FROM get_user_by_phone('553197599924@s.whatsapp.net');  -- Também funciona com @s.whatsapp.net


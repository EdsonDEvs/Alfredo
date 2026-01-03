-- Script corrigido para configurar identificação WhatsApp
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campo de telefone na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 2. Adicionar índice para busca rápida por telefone
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number 
ON public.profiles(phone_number);

-- 3. Função para buscar usuário por telefone (corrigida)
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::UUID,  -- Usando 'id' em vez de 'userid'
    p.full_name,
    p.subscription_status
  FROM public.profiles p
  WHERE p.phone_number = phone_input;
END;
$$ LANGUAGE plpgsql;

-- 4. Verificar se foi criado
SELECT * FROM public.profiles WHERE phone_number IS NOT NULL;

-- 5. Testar a função
-- SELECT * FROM get_user_by_phone('5511999999999');

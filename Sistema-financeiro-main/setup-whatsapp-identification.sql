-- Script para configurar identificação WhatsApp
-- Execute este script no Supabase SQL Editor

-- 1. Adicionar campo de telefone na tabela profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- 2. Adicionar índice para busca rápida por telefone
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number 
ON public.profiles(phone_number);

-- 3. Inserir usuário de teste com telefone
-- Substitua '5511999999999' pelo número real do seu amigo
INSERT INTO public.profiles (
  id,
  userid,
  full_name,
  avatar_url,
  subscription_status,
  subscription_plan,
  phone_number,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test-user-id', -- Será substituído pelo ID real quando ele se registrar
  'Usuário Teste',
  'https://ui-avatars.com/api/?name=Teste&background=0D0F1A&color=fff',
  'active',
  'test',
  '5511999999999', -- NÚMERO DO SEU AMIGO (formato: 5511999999999)
  NOW(),
  NOW()
) ON CONFLICT (userid) DO UPDATE SET
  phone_number = EXCLUDED.phone_number,
  updated_at = NOW();

-- 4. Função para buscar usuário por telefone
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.userid::UUID,
    p.full_name,
    p.subscription_status
  FROM public.profiles p
  WHERE p.phone_number = phone_input;
END;
$$ LANGUAGE plpgsql;

-- 5. Verificar se foi criado
SELECT * FROM public.profiles WHERE phone_number IS NOT NULL;

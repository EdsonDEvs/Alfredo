-- Script para criar usuário de teste
-- Execute este script no Supabase SQL Editor

-- 1. Inserir usuário na tabela auth.users (isso será feito automaticamente quando ele se registrar)
-- Por enquanto, vamos criar um perfil de teste

-- 2. Inserir perfil de teste
INSERT INTO public.profiles (
  id,
  userid,
  full_name,
  avatar_url,
  subscription_status,
  subscription_plan,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'test-user-id', -- Será substituído pelo ID real quando ele se registrar
  'Usuário Teste',
  'https://ui-avatars.com/api/?name=Teste&background=0D0F1A&color=fff',
  'active',
  'test',
  NOW(),
  NOW()
) ON CONFLICT (userid) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  updated_at = NOW();

-- 3. Inserir categorias padrão para o usuário de teste
-- (Isso será feito automaticamente quando ele fizer login pela primeira vez)

-- 4. Verificar se foi criado
SELECT * FROM public.profiles WHERE full_name = 'Usuário Teste';

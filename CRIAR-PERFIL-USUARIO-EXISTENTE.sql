-- =====================================================
-- CRIAR PERFIL PARA USUÁRIO EXISTENTE
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Substitua 'edson@gmail.com' pelo email do usuário
-- Este script cria o perfil para o usuário que já existe no auth.users

INSERT INTO public.profiles (id, nome, email, created_at, updated_at)
SELECT 
  au.id,
  COALESCE(
    au.raw_user_meta_data->>'full_name', 
    au.raw_user_meta_data->>'name', 
    split_part(au.email, '@', 1)
  ) as nome,
  au.email,
  COALESCE(au.created_at, now()) as created_at,
  COALESCE(au.updated_at, now()) as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE au.email = 'edson@gmail.com'  -- Altere aqui se necessário
  AND p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verificar se foi criado
SELECT id, nome, email FROM public.profiles WHERE email = 'edson@gmail.com';


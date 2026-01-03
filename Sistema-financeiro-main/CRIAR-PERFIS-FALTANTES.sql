-- =====================================================
-- SCRIPT PARA CRIAR PERFIS FALTANTES
-- Execute este script no SQL Editor do Supabase
-- Ele cria perfis para usuários que existem no auth.users
-- mas não têm perfil na tabela profiles
-- =====================================================

-- Inserir perfis faltantes para usuários que já existem no auth.users
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
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Verificar quantos perfis foram criados
SELECT COUNT(*) as perfis_criados
FROM public.profiles;


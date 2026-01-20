-- Criar perfil simples (assume que o usuário já existe no Auth do Supabase)
-- Substitua os valores abaixo antes de executar
-- user_id: id do usuário no Auth
-- email: email do usuário
-- nome: nome do usuário

-- Perfil
INSERT INTO public.profiles (id, email, nome, created_at, updated_at)
VALUES (
  'SEU_USER_ID_AQUI',
  'email@dominio.com',
  'Nome do Usuário',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  updated_at = now();

-- Assinatura básica (opcional)
INSERT INTO public.subscriptions (
  id,
  user_id,
  status,
  plan_name,
  start_date,
  end_date,
  created_at,
  updated_at
)
VALUES (
  gen_random_uuid()::text,
  'SEU_USER_ID_AQUI',
  'active',
  'basic',
  now(),
  (now() + interval '30 days'),
  now(),
  now()
);

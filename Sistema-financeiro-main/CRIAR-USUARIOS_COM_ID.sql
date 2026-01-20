-- Criação simples de usuários (perfil + assinatura) usando IDs já existentes
-- IMPORTANTE: o usuário já precisa existir no Auth do Supabase com o mesmo id.
-- Substitua os valores abaixo antes de executar.

BEGIN;

-- Exemplo 1
INSERT INTO public.profiles (id, email, nome, whatsapp, created_at, updated_at)
VALUES (
  'SEU_USER_ID_1',
  'email1@dominio.com',
  'Nome do Usuário 1',
  '5511999999999',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  whatsapp = EXCLUDED.whatsapp,
  updated_at = now();

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
  'SEU_USER_ID_1',
  'active',
  'basic',
  now(),
  (now() + interval '30 days'),
  now(),
  now()
);

-- Exemplo 2
INSERT INTO public.profiles (id, email, nome, whatsapp, created_at, updated_at)
VALUES (
  'SEU_USER_ID_2',
  'email2@dominio.com',
  'Nome do Usuário 2',
  '5511888888888',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  nome = EXCLUDED.nome,
  whatsapp = EXCLUDED.whatsapp,
  updated_at = now();

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
  'SEU_USER_ID_2',
  'active',
  'premium',
  now(),
  (now() + interval '1 year'),
  now(),
  now()
);

COMMIT;

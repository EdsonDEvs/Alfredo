-- Cria usuários simples gerando IDs automaticamente (perfil + assinatura)
-- IMPORTANTE: isso NÃO cria usuário no Auth do Supabase.
-- Use apenas se você for gerenciar autenticação fora do Auth,
-- ou complemente criando o usuário no Auth com o mesmo id.

BEGIN;

-- Liste os usuários que deseja criar
WITH novos_usuarios AS (
  SELECT * FROM (
    VALUES
      ('viniciussoterorezende@gmail.com', 'Vinicius', '553172050567', 'premium', interval '100 year'),
      ('mariceliabrsk11@gmail.com', 'Maricelia', '553172589341', 'premium', interval '100 year')
  ) AS t(email, nome, whatsapp, plan_name, duration)
),
ids AS (
  SELECT
    gen_random_uuid() AS user_id,
    email,
    nome,
    whatsapp,
    plan_name,
    duration
  FROM novos_usuarios
),
ins_profiles AS (
  INSERT INTO public.profiles (id, email, nome, whatsapp, created_at, updated_at)
  SELECT user_id, email, nome, whatsapp, now(), now()
  FROM ids
  RETURNING id
),
ins_subscriptions AS (
  INSERT INTO public.subscriptions (
    id,
    user_id,
    status,
    plan_name,
    start_date,
    next_payment_date,
    subscription_id,
    created_at,
    updated_at
  )
  SELECT
    gen_random_uuid(),
    user_id,
    'active',
    plan_name,
    now(),
    now() + duration,
    gen_random_uuid()::text,
    now(),
    now()
  FROM ids
)
SELECT * FROM ids;

COMMIT;

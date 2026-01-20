-- Cria assinaturas premium para usuários já existentes em public.profiles
-- Usa email para localizar o user_id (profiles.id)
BEGIN;

INSERT INTO public.subscriptions (
  id,
  user_id,
  subscription_id,
  status,
  plan_name,
  start_date,
  next_payment_date,
  created_at,
  updated_at
)
SELECT
  gen_random_uuid(),
  p.id,
  gen_random_uuid()::text,
  'active',
  'premium',
  now(),
  now() + interval '100 years',
  now(),
  now()
FROM public.profiles p
WHERE p.email IN (
  'edson@gmail.com',
  'viniciussoterorezende@gmail.com',
  'mariceliabrsk11@gmail.com',
  'pedrofmbastos@gmail.com',
  'andrezasotero28@gmail.com',
  'annagabyella503@gmail.com'
);

COMMIT;

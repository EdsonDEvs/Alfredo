-- ============================================
-- VERIFICAR USERIDs DAS TRANSAÇÕES
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Ver todas as transações e seus userids
SELECT 
  id,
  userid,
  estabelecimento,
  valor,
  tipo,
  created_at
FROM public.transacoes
ORDER BY created_at DESC
LIMIT 20;

-- 2. Ver quantas transações existem por userid
SELECT 
  userid,
  COUNT(*) as total_transacoes
FROM public.transacoes
GROUP BY userid
ORDER BY total_transacoes DESC;

-- 3. Ver usuários no auth.users e seus ids
SELECT 
  id,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;

-- 4. Ver perfis e seus ids
SELECT 
  id,
  nome,
  email,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- 5. Comparar: transações sem perfil correspondente
SELECT 
  t.id as transacao_id,
  t.userid,
  t.estabelecimento,
  p.id as profile_id,
  p.nome,
  p.email
FROM public.transacoes t
LEFT JOIN public.profiles p ON t.userid = p.id
ORDER BY t.created_at DESC;


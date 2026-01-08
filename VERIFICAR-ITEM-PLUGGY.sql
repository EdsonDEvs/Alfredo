-- Script SQL para verificar Item Pluggy no banco de dados
-- Execute no Supabase SQL Editor

-- 1. Verificar se o itemId está salvo em algum perfil
SELECT 
  id,
  nome,
  email,
  bank_connection_id,
  created_at
FROM public.profiles
WHERE bank_connection_id = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9';

-- 2. Se não encontrar, listar todos os perfis com conexão bancária
SELECT 
  id,
  nome,
  email,
  bank_connection_id,
  created_at
FROM public.profiles
WHERE bank_connection_id IS NOT NULL
ORDER BY created_at DESC;

-- 3. Verificar transações sincronizadas do itemId (se houver usuário)
-- Substitua 'USER_ID_AQUI' pelo ID do usuário que tem este itemId
SELECT 
  id,
  estabelecimento,
  valor,
  tipo,
  quando,
  external_id,
  created_at
FROM public.transacoes
WHERE userid = 'USER_ID_AQUI'  -- Substitua pelo userid correto
  AND external_id IS NOT NULL
ORDER BY quando DESC
LIMIT 20;

-- 4. Contar transações sincronizadas
SELECT 
  COUNT(*) as total_transacoes,
  COUNT(DISTINCT external_id) as transacoes_unicas,
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
  SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas
FROM public.transacoes
WHERE userid = 'USER_ID_AQUI'  -- Substitua pelo userid correto
  AND external_id IS NOT NULL;


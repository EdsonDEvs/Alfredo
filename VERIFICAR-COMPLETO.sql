-- =====================================================
-- SCRIPT COMPLETO: Verificar ItemId e Transações Pluggy
-- Execute cada seção no Supabase SQL Editor
-- =====================================================

-- =====================================================
-- PASSO 1: Verificar se o itemId está salvo
-- =====================================================
SELECT 
  id as user_id,
  nome,
  email,
  bank_connection_id,
  created_at
FROM public.profiles
WHERE bank_connection_id = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9';

-- Se retornar uma linha = ✅ ItemId está salvo
-- Se não retornar nada = ❌ ItemId NÃO está salvo (precisa conectar novamente)

-- =====================================================
-- PASSO 2: Se não encontrar, listar TODOS os perfis com conexão
-- =====================================================
SELECT 
  id as user_id,
  nome,
  email,
  bank_connection_id,
  created_at
FROM public.profiles
WHERE bank_connection_id IS NOT NULL
ORDER BY created_at DESC;

-- Isso mostrará TODOS os perfis que têm conexão bancária

-- =====================================================
-- PASSO 3: Verificar transações sincronizadas
-- User ID: a7646b87-b570-4207-b014-d3d67d70e507
-- =====================================================

SELECT 
  id,
  estabelecimento,
  valor,
  tipo,
  quando,
  external_id,
  created_at
FROM public.transacoes
WHERE userid = 'a7646b87-b570-4207-b014-d3d67d70e507'
  AND external_id IS NOT NULL
ORDER BY quando DESC
LIMIT 20;

-- =====================================================
-- PASSO 4: Contar e resumir transações sincronizadas
-- User ID: a7646b87-b570-4207-b014-d3d67d70e507
-- =====================================================
SELECT 
  COUNT(*) as total_transacoes,
  COUNT(DISTINCT external_id) as transacoes_unicas,
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
  SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas,
  MIN(quando) as primeira_transacao,
  MAX(quando) as ultima_transacao
FROM public.transacoes
WHERE userid = 'a7646b87-b570-4207-b014-d3d67d70e507'
  AND external_id IS NOT NULL;

-- =====================================================
-- PASSO 5: Verificar todas as transações (com ou sem external_id)
-- User ID: a7646b87-b570-4207-b014-d3d67d70e507
-- =====================================================
SELECT 
  COUNT(*) as total_geral,
  COUNT(CASE WHEN external_id IS NOT NULL THEN 1 END) as da_pluggy,
  COUNT(CASE WHEN external_id IS NULL THEN 1 END) as manuais
FROM public.transacoes
WHERE userid = 'a7646b87-b570-4207-b014-d3d67d70e507';

-- =====================================================
-- PASSO 6: Salvar itemId manualmente (se não estiver salvo)
-- =====================================================
-- Execute esta query SE o PASSO 1 não retornou o itemId:
-- UPDATE public.profiles
-- SET bank_connection_id = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9'
-- WHERE id = 'a7646b87-b570-4207-b014-d3d67d70e507';


-- =====================================================
-- CORRIGIR: Criar índice único para external_id
-- Execute este script no Supabase SQL Editor
-- =====================================================

-- 1. Verificar se a coluna external_id existe
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'transacoes'
  AND column_name = 'external_id';

-- 2. Se não existir, adicionar a coluna
ALTER TABLE public.transacoes 
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- 3. Verificar se já existe índice único
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'transacoes'
  AND indexname LIKE '%external_id%';

-- 4. Remover índices existentes (se houver problema)
DROP INDEX IF EXISTS idx_transacoes_external_id;
DROP INDEX IF EXISTS transacoes_external_id_key;
DROP INDEX IF EXISTS transacoes_external_id_idx;

-- 5. Criar índice único condicional (permite múltiplos NULL)
CREATE UNIQUE INDEX IF NOT EXISTS idx_transacoes_external_id_userid 
ON public.transacoes(userid, external_id)
WHERE external_id IS NOT NULL;

-- 6. Verificar se foi criado
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'transacoes'
  AND indexname LIKE '%external_id%';

-- 7. Comentário para documentação
COMMENT ON COLUMN public.transacoes.external_id IS 'ID externo da transação (da API do agregador) para evitar duplicatas. Índice único por usuário.';


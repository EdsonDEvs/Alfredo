-- =====================================================
-- MIGRAÇÃO: Adicionar suporte para Open Finance (Pluggy)
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. Adicionar coluna para armazenar o ID da conexão bancária no perfil
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bank_connection_id TEXT;

-- 2. Adicionar coluna para evitar duplicidade ao importar transações
ALTER TABLE public.transacoes 
ADD COLUMN IF NOT EXISTS external_id TEXT;

-- 3. Criar índice único composto (userid + external_id) para evitar duplicatas
-- Isso permite que diferentes usuários tenham o mesmo external_id, mas o mesmo usuário não pode ter duplicatas
DROP INDEX IF EXISTS idx_transacoes_external_id;
CREATE UNIQUE INDEX IF NOT EXISTS idx_transacoes_external_id_userid 
ON public.transacoes(userid, external_id)
WHERE external_id IS NOT NULL;

-- 4. Criar índice para melhorar performance nas buscas por conexão bancária
CREATE INDEX IF NOT EXISTS idx_profiles_bank_connection_id 
ON public.profiles(bank_connection_id) 
WHERE bank_connection_id IS NOT NULL;

-- 5. Comentários para documentação
COMMENT ON COLUMN public.profiles.bank_connection_id IS 'ID da conexão bancária do usuário (itemId da Pluggy)';
COMMENT ON COLUMN public.transacoes.external_id IS 'ID externo da transação (da API do agregador) para evitar duplicatas';


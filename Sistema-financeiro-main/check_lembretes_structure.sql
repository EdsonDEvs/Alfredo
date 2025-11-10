-- =====================================================
-- VERIFICAR ESTRUTURA DA TABELA LEMBRETES
-- Execute este script para ver as colunas reais da tabela
-- =====================================================

-- Verificar se a tabela existe
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'lembretes';

-- Verificar estrutura da tabela lembretes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'lembretes'
ORDER BY ordinal_position;

-- Verificar dados existentes na tabela lembretes
SELECT 
    *
FROM public.lembretes
LIMIT 5;

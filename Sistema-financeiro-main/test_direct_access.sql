-- =====================================================
-- TESTE DE ACESSO DIRETO AOS DADOS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. VERIFICAR SE RLS ESTÁ DESABILITADO
-- =====================================================

SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'categorias', 'transacoes', 'lembretes')
  AND schemaname = 'public';

-- 2. TESTAR ACESSO DIRETO AOS DADOS
-- =====================================================

-- Verificar se conseguimos acessar os dados sem autenticação
SELECT 
    'profiles' as tabela,
    COUNT(*) as total
FROM public.profiles 
WHERE id = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'categorias' as tabela,
    COUNT(*) as total
FROM public.categorias 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'transacoes' as tabela,
    COUNT(*) as total
FROM public.transacoes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'

UNION ALL

SELECT 
    'lembretes' as tabela,
    COUNT(*) as total
FROM public.lembretes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30';

-- 3. VERIFICAR DADOS ESPECÍFICOS DE JUNHO 2024
-- =====================================================

-- Verificar transações de junho 2024
SELECT 
    COUNT(*) as total_transacoes_junho_2024,
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas
FROM public.transacoes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
  AND EXTRACT(MONTH FROM quando::date) = 6
  AND EXTRACT(YEAR FROM quando::date) = 2024;

-- 4. VERIFICAR TODAS AS TRANSAÇÕES DO USUÁRIO
-- =====================================================

SELECT 
    tipo,
    COUNT(*) as quantidade,
    SUM(valor) as total_valor,
    MIN(quando) as data_inicio,
    MAX(quando) as data_fim
FROM public.transacoes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
GROUP BY tipo
ORDER BY tipo;

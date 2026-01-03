-- =====================================================
-- DESABILITAR RLS TEMPORARIAMENTE PARA DESENVOLVIMENTO
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- Desabilitar RLS em todas as tabelas
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembretes DISABLE ROW LEVEL SECURITY;

-- Verificar se RLS foi desabilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('profiles', 'categorias', 'transacoes', 'lembretes')
  AND schemaname = 'public';

-- Testar acesso direto aos dados
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

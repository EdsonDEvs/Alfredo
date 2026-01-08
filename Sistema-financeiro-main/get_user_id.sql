-- =====================================================
-- SCRIPT PARA OBTER UUID DO USUÁRIO ATUAL
-- Execute este script para obter o UUID do usuário logado
-- =====================================================

-- Verificar usuários existentes
SELECT 
    id,
    email,
    nome,
    created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Verificar usuários na tabela de autenticação
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC;

-- Verificar se há dados nas tabelas principais
SELECT 
    'profiles' as tabela,
    COUNT(*) as total
FROM public.profiles
UNION ALL
SELECT 
    'categorias' as tabela,
    COUNT(*) as total
FROM public.categorias
UNION ALL
SELECT 
    'transacoes' as tabela,
    COUNT(*) as total
FROM public.transacoes
UNION ALL
SELECT 
    'lembretes' as tabela,
    COUNT(*) as total
FROM public.lembretes;

-- Verificar categorias existentes (se houver)
SELECT 
    id,
    nome,
    userid,
    tags,
    created_at
FROM public.categorias
ORDER BY created_at DESC;

-- =====================================================
-- INSTRUÇÕES:
-- 1. Copie o UUID do usuário desejado
-- 2. Substitua 'ddf661d3-28e3-4b53-8120-3e2f3830a267' no script de dados
-- 3. Execute o script insert_sample_data_corrigido.sql
-- =====================================================

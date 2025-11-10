-- =====================================================
-- SCRIPT DE TESTE DE CONEXÃO E FUNCIONALIDADE
-- Execute este script para verificar se tudo está funcionando
-- =====================================================

-- 1. VERIFICAR ESTRUTURA DAS TABELAS
-- =====================================================

-- Verificar se as tabelas existem
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'categorias', 'transacoes', 'lembretes', 'subscriptions')
ORDER BY table_name;

-- Verificar estrutura da tabela profiles
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela categorias
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'categorias'
ORDER BY ordinal_position;

-- Verificar estrutura da tabela transacoes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'transacoes'
ORDER BY ordinal_position;

-- 2. VERIFICAR ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Verificar se RLS está ativo
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'categorias', 'transacoes', 'lembretes', 'subscriptions');

-- Verificar políticas RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 3. VERIFICAR FUNÇÕES E TRIGGERS
-- =====================================================

-- Verificar funções
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_schema = 'public'
ORDER BY routine_name;

-- Verificar triggers
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers 
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 4. VERIFICAR ÍNDICES
-- =====================================================

-- Verificar índices nas tabelas principais
SELECT 
    t.table_name,
    i.indexname,
    i.indexdef
FROM pg_indexes i
JOIN information_schema.tables t ON i.tablename = t.table_name
WHERE i.schemaname = 'public'
  AND t.table_name IN ('profiles', 'categorias', 'transacoes', 'lembretes')
ORDER BY t.table_name, i.indexname;

-- 5. VERIFICAR DADOS DE EXEMPLO
-- =====================================================

-- Verificar se há dados nas tabelas
SELECT 
    'profiles' as tabela,
    COUNT(*) as total_registros
FROM public.profiles
UNION ALL
SELECT 
    'categorias' as tabela,
    COUNT(*) as total_registros
FROM public.categorias
UNION ALL
SELECT 
    'transacoes' as tabela,
    COUNT(*) as total_registros
FROM public.transacoes
UNION ALL
SELECT 
    'lembretes' as tabela,
    COUNT(*) as total_registros
FROM public.lembretes
UNION ALL
SELECT 
    'subscriptions' as tabela,
    COUNT(*) as total_registros
FROM public.subscriptions;

-- 6. TESTAR CONSULTAS BÁSICAS
-- =====================================================

-- Testar consulta de categorias por usuário
SELECT 
    nome,
    tags,
    created_at
FROM public.categorias
WHERE userid = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
ORDER BY nome;

-- Testar consulta de transações por usuário
SELECT 
    t.detalhes,
    t.valor,
    t.tipo,
    t.quando,
    c.nome as categoria
FROM public.transacoes t
JOIN public.categorias c ON t.category_id = c.id
WHERE t.userid = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
ORDER BY t.quando DESC
LIMIT 10;

-- Testar resumo financeiro
SELECT 
    tipo,
    COUNT(*) as quantidade,
    SUM(valor) as valor_total,
    AVG(valor) as valor_medio
FROM public.transacoes 
WHERE userid = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
GROUP BY tipo;

-- 7. VERIFICAR RELACIONAMENTOS
-- =====================================================

-- Verificar foreign keys
SELECT 
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================
-- RESULTADO ESPERADO:
-- ✅ Todas as tabelas devem existir
-- ✅ RLS deve estar ativo em todas as tabelas
-- ✅ Políticas RLS devem estar configuradas
-- ✅ Funções e triggers devem estar funcionando
-- ✅ Índices devem estar criados
-- ✅ Dados de exemplo devem estar inseridos
-- ✅ Consultas devem retornar resultados
-- =====================================================

-- =====================================================
-- SCRIPT PARA INSERIR DADOS DE EXEMPLO REALISTAS
-- Compatível com a estrutura atual do banco
-- Execute este script no SQL Editor do seu Supabase
-- =====================================================

-- 1. INSERIR CATEGORIAS PADRÃO
-- =====================================================

-- Categorias de Receita
INSERT INTO public.categorias (userid, nome, tags, created_at, updated_at) VALUES
-- Para o primeiro usuário (substitua pelo UUID real do usuário)
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Salário', 'receita,fixo', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Freelance', 'receita,extra', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Investimentos', 'receita,passivo', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Presentes', 'receita,ocasional', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Reembolso', 'receita,ocasional', now(), now()),

-- Categorias de Despesa
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Alimentação', 'despesa,essencial', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Transporte', 'despesa,essencial', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Moradia', 'despesa,essencial', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Saúde', 'despesa,essencial', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Educação', 'despesa,investimento', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Lazer', 'despesa,discrecional', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Vestuário', 'despesa,discrecional', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Contas', 'despesa,fixo', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Shopping', 'despesa,discrecional', now(), now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Viagem', 'despesa,discrecional', now(), now());

-- 2. INSERIR TRANSAÇÕES DE EXEMPLO
-- =====================================================

-- Obter IDs das categorias criadas
DO $$
DECLARE
    salario_id UUID;
    alimentacao_id UUID;
    transporte_id UUID;
    moradia_id UUID;
    saude_id UUID;
    contas_id UUID;
    lazer_id UUID;
    vestuario_id UUID;
    shopping_id UUID;
    freelance_id UUID;
    investimentos_id UUID;
BEGIN
    -- Buscar IDs das categorias
    SELECT id INTO salario_id FROM public.categorias WHERE nome = 'Salário' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO alimentacao_id FROM public.categorias WHERE nome = 'Alimentação' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO transporte_id FROM public.categorias WHERE nome = 'Transporte' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO moradia_id FROM public.categorias WHERE nome = 'Moradia' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO saude_id FROM public.categorias WHERE nome = 'Saúde' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO contas_id FROM public.categorias WHERE nome = 'Contas' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO lazer_id FROM public.categorias WHERE nome = 'Lazer' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO vestuario_id FROM public.categorias WHERE nome = 'Vestuário' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO shopping_id FROM public.categorias WHERE nome = 'Shopping' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO freelance_id FROM public.categorias WHERE nome = 'Freelance' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;
    SELECT id INTO investimentos_id FROM public.categorias WHERE nome = 'Investimentos' AND userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30' LIMIT 1;

    -- Inserir transações de receita (últimos 3 meses)
    INSERT INTO public.transacoes (userid, category_id, detalhes, valor, tipo, quando, estabelecimento, created_at) VALUES
    -- Salários
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Janeiro 2024', 4500.00, 'receita', '2024-01-31', 'Empresa', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Fevereiro 2024', 4500.00, 'receita', '2024-02-29', 'Empresa', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Março 2024', 4500.00, 'receita', '2024-03-31', 'Empresa', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Abril 2024', 4500.00, 'receita', '2024-04-30', 'Empresa', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Maio 2024', 4500.00, 'receita', '2024-05-31', 'Empresa', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', salario_id, 'Salário Junho 2024', 4500.00, 'receita', '2024-06-30', 'Empresa', now()),
    
    -- Freelances
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', freelance_id, 'Projeto Web Design', 1200.00, 'receita', '2024-06-15', 'Cliente A', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', freelance_id, 'Consultoria Marketing', 800.00, 'receita', '2024-06-20', 'Cliente B', now()),
    
    -- Investimentos
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', investimentos_id, 'Dividendos Ações', 150.00, 'receita', '2024-06-25', 'Corretora', now());

    -- Inserir transações de despesa (últimos 3 meses)
    INSERT INTO public.transacoes (userid, category_id, detalhes, valor, tipo, quando, estabelecimento, created_at) VALUES
    -- Alimentação
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Supermercado Semanal', 250.00, 'despesa', '2024-06-01', 'Supermercado', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Restaurante com amigos', 85.50, 'despesa', '2024-06-05', 'Restaurante', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Supermercado Semanal', 280.00, 'despesa', '2024-06-08', 'Supermercado', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Delivery Pizza', 45.00, 'despesa', '2024-06-12', 'Pizzaria', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Supermercado Semanal', 265.00, 'despesa', '2024-06-15', 'Supermercado', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Café da manhã', 25.00, 'despesa', '2024-06-18', 'Cafeteria', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Supermercado Semanal', 290.00, 'despesa', '2024-06-22', 'Supermercado', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', alimentacao_id, 'Almoço de trabalho', 35.00, 'despesa', '2024-06-25', 'Restaurante', now()),
    
    -- Transporte
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', transporte_id, 'Combustível', 200.00, 'despesa', '2024-06-03', 'Posto', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', transporte_id, 'Uber para trabalho', 45.00, 'despesa', '2024-06-07', 'Uber', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', transporte_id, 'Estacionamento Shopping', 15.00, 'despesa', '2024-06-10', 'Shopping', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', transporte_id, 'Combustível', 180.00, 'despesa', '2024-06-17', 'Posto', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', transporte_id, 'Metrô', 8.50, 'despesa', '2024-06-21', 'Metrô', now()),
    
    -- Moradia
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', moradia_id, 'Aluguel', 1200.00, 'despesa', '2024-06-05', 'Proprietário', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', moradia_id, 'Condomínio', 350.00, 'despesa', '2024-06-05', 'Síndico', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', moradia_id, 'Conta de Luz', 120.00, 'despesa', '2024-06-15', 'Companhia Elétrica', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', moradia_id, 'Conta de Água', 45.00, 'despesa', '2024-06-15', 'Companhia de Água', now()),
    
    -- Saúde
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', saude_id, 'Consulta Médica', 150.00, 'despesa', '2024-06-08', 'Médico', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', saude_id, 'Farmácia', 85.00, 'despesa', '2024-06-08', 'Farmácia', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', saude_id, 'Academia', 89.90, 'despesa', '2024-06-10', 'Academia', now()),
    
    -- Contas
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', contas_id, 'Internet', 89.90, 'despesa', '2024-06-10', 'Provedor', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', contas_id, 'Celular', 59.90, 'despesa', '2024-06-10', 'Operadora', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', contas_id, 'Netflix', 39.90, 'despesa', '2024-06-15', 'Netflix', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', contas_id, 'Spotify', 19.90, 'despesa', '2024-06-15', 'Spotify', now()),
    
    -- Lazer
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', lazer_id, 'Cinema', 32.00, 'despesa', '2024-06-09', 'Cinema', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', lazer_id, 'Bar com amigos', 75.00, 'despesa', '2024-06-14', 'Bar', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', lazer_id, 'Show de música', 120.00, 'despesa', '2024-06-20', 'Casa de Show', now()),
    
    -- Vestuário
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', vestuario_id, 'Tênis novo', 250.00, 'despesa', '2024-06-11', 'Loja de Calçados', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', vestuario_id, 'Camisa social', 89.90, 'despesa', '2024-06-16', 'Loja de Roupas', now()),
    
    -- Shopping
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', shopping_id, 'Presente aniversário', 150.00, 'despesa', '2024-06-13', 'Loja de Presentes', now()),
    ('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', shopping_id, 'Livros', 85.00, 'despesa', '2024-06-19', 'Livraria', now());

END $$;

-- 3. INSERIR LEMBRETES DE EXEMPLO
-- =====================================================

INSERT INTO public.lembretes (userid, descricao, valor, data, created_at) VALUES
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Pagar IPTU do primeiro semestre', 450.00, '2024-07-15', now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Renovar mensalidade da academia', 89.90, '2024-07-10', now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Comprar presente para o dia das mães', 200.00, '2024-05-12', now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Renovar seguro anual do veículo', 1200.00, '2024-08-20', now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Agendar consulta de rotina', 150.00, '2024-07-25', now()),
('fa039d56-e7a3-4118-a423-9c5cc9ef7d30', 'Comprar notebook novo', 3500.00, '2024-09-01', now());

-- 4. VERIFICAÇÃO DOS DADOS INSERIDOS
-- =====================================================

-- Verificar total de categorias
SELECT 'Categorias' as tipo, COUNT(*) as total FROM public.categorias WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
UNION ALL
-- Verificar total de transações
SELECT 'Transações' as tipo, COUNT(*) as total FROM public.transacoes WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
UNION ALL
-- Verificar total de lembretes
SELECT 'Lembretes' as tipo, COUNT(*) as total FROM public.lembretes WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30';

-- Verificar resumo financeiro
SELECT 
    tipo,
    COUNT(*) as quantidade,
    SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as total_receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as total_despesas
FROM public.transacoes 
WHERE userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
GROUP BY tipo;

-- Verificar categorias mais utilizadas
SELECT 
    c.nome as categoria,
    COUNT(t.id) as total_transacoes,
    SUM(t.valor) as valor_total
FROM public.categorias c
LEFT JOIN public.transacoes t ON c.id = t.category_id
WHERE c.userid = 'fa039d56-e7a3-4118-a423-9c5cc9ef7d30'
GROUP BY c.id, c.nome
ORDER BY total_transacoes DESC;

-- =====================================================
-- DADOS DE EXEMPLO INSERIDOS COM SUCESSO! 🎉
-- =====================================================

-- =====================================================
-- SCRIPT PARA INSERIR DADOS DE EXEMPLO REALISTAS
-- Execute este script no SQL Editor do seu Supabase
-- =====================================================

-- 1. INSERIR CATEGORIAS PADRÃO
-- =====================================================

-- Categorias de Receita
INSERT INTO public.categories (user_id, name, color, icon, tipo, is_default) VALUES
-- Para o primeiro usuário (substitua pelo UUID real do usuário)
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Salário', '#10B981', 'dollar-sign', 'receita', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Freelance', '#3B82F6', 'briefcase', 'receita', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Investimentos', '#8B5CF6', 'trending-up', 'receita', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Presentes', '#F59E0B', 'gift', 'receita', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Reembolso', '#6B7280', 'refresh-cw', 'receita', false),

-- Categorias de Despesa
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Alimentação', '#EF4444', 'utensils', 'despesa', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Transporte', '#F97316', 'car', 'despesa', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Moradia', '#84CC16', 'home', 'despesa', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Saúde', '#EC4899', 'heart', 'despesa', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Educação', '#06B6D4', 'book-open', 'despesa', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Lazer', '#8B5CF6', 'smile', 'despesa', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Vestuário', '#F59E0B', 'shirt', 'despesa', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Contas', '#6B7280', 'file-text', 'despesa', true),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Shopping', '#EC4899', 'shopping-bag', 'despesa', false),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Viagem', '#3B82F6', 'plane', 'despesa', false);

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
    SELECT id INTO salario_id FROM public.categories WHERE name = 'Salário' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO alimentacao_id FROM public.categories WHERE name = 'Alimentação' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO transporte_id FROM public.categories WHERE name = 'Transporte' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO moradia_id FROM public.categories WHERE name = 'Moradia' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO saude_id FROM public.categories WHERE name = 'Saúde' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO contas_id FROM public.categories WHERE name = 'Contas' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO lazer_id FROM public.categories WHERE name = 'Lazer' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO vestuario_id FROM public.categories WHERE name = 'Vestuário' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO shopping_id FROM public.categories WHERE name = 'Shopping' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO freelance_id FROM public.categories WHERE name = 'Freelance' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO investimentos_id FROM public.categories WHERE name = 'Investimentos' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;

    -- Inserir transações de receita (últimos 3 meses)
    INSERT INTO public.transactions (user_id, category_id, description, amount, tipo, date, payment_method, status) VALUES
    -- Salários
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Janeiro 2024', 4500.00, 'receita', '2024-01-31', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Fevereiro 2024', 4500.00, 'receita', '2024-02-29', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Março 2024', 4500.00, 'receita', '2024-03-31', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Abril 2024', 4500.00, 'receita', '2024-04-30', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Maio 2024', 4500.00, 'receita', '2024-05-31', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', salario_id, 'Salário Junho 2024', 4500.00, 'receita', '2024-06-30', 'PIX', 'completed'),
    
    -- Freelances
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', freelance_id, 'Projeto Web Design', 1200.00, 'receita', '2024-06-15', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', freelance_id, 'Consultoria Marketing', 800.00, 'receita', '2024-06-20', 'PIX', 'completed'),
    
    -- Investimentos
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', investimentos_id, 'Dividendos Ações', 150.00, 'receita', '2024-06-25', 'PIX', 'completed');

    -- Inserir transações de despesa (últimos 3 meses)
    INSERT INTO public.transactions (user_id, category_id, description, amount, tipo, date, payment_method, status) VALUES
    -- Alimentação
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Supermercado Semanal', 250.00, 'despesa', '2024-06-01', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Restaurante com amigos', 85.50, 'despesa', '2024-06-05', 'Cartão de Débito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Supermercado Semanal', 280.00, 'despesa', '2024-06-08', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Delivery Pizza', 45.00, 'despesa', '2024-06-12', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Supermercado Semanal', 265.00, 'despesa', '2024-06-15', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Café da manhã', 25.00, 'despesa', '2024-06-18', 'Dinheiro', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Supermercado Semanal', 290.00, 'despesa', '2024-06-22', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Almoço de trabalho', 35.00, 'despesa', '2024-06-25', 'Cartão de Débito', 'completed'),
    
    -- Transporte
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Combustível', 200.00, 'despesa', '2024-06-03', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Uber para trabalho', 45.00, 'despesa', '2024-06-07', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Estacionamento Shopping', 15.00, 'despesa', '2024-06-10', 'Dinheiro', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Combustível', 180.00, 'despesa', '2024-06-17', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Metrô', 8.50, 'despesa', '2024-06-21', 'Cartão de Débito', 'completed'),
    
    -- Moradia
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', moradia_id, 'Aluguel', 1200.00, 'despesa', '2024-06-05', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', moradia_id, 'Condomínio', 350.00, 'despesa', '2024-06-05', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', moradia_id, 'Conta de Luz', 120.00, 'despesa', '2024-06-15', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', moradia_id, 'Conta de Água', 45.00, 'despesa', '2024-06-15', 'PIX', 'completed'),
    
    -- Saúde
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', saude_id, 'Consulta Médica', 150.00, 'despesa', '2024-06-08', 'Cartão de Débito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', saude_id, 'Farmácia', 85.00, 'despesa', '2024-06-08', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', saude_id, 'Academia', 89.90, 'despesa', '2024-06-10', 'PIX', 'completed'),
    
    -- Contas
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', contas_id, 'Internet', 89.90, 'despesa', '2024-06-10', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', contas_id, 'Celular', 59.90, 'despesa', '2024-06-10', 'PIX', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', contas_id, 'Netflix', 39.90, 'despesa', '2024-06-15', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', contas_id, 'Spotify', 19.90, 'despesa', '2024-06-15', 'Cartão de Crédito', 'completed'),
    
    -- Lazer
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', lazer_id, 'Cinema', 32.00, 'despesa', '2024-06-09', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', lazer_id, 'Bar com amigos', 75.00, 'despesa', '2024-06-14', 'Cartão de Débito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', lazer_id, 'Show de música', 120.00, 'despesa', '2024-06-20', 'PIX', 'completed'),
    
    -- Vestuário
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', vestuario_id, 'Tênis novo', 250.00, 'despesa', '2024-06-11', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', vestuario_id, 'Camisa social', 89.90, 'despesa', '2024-06-16', 'Cartão de Crédito', 'completed'),
    
    -- Shopping
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', shopping_id, 'Presente aniversário', 150.00, 'despesa', '2024-06-13', 'Cartão de Crédito', 'completed'),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', shopping_id, 'Livros', 85.00, 'despesa', '2024-06-19', 'PIX', 'completed');

END $$;

-- 3. INSERIR LEMBRETES DE EXEMPLO
-- =====================================================

INSERT INTO public.reminders (user_id, title, description, amount, due_date, completed, priority) VALUES
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Pagar IPTU', 'Pagar IPTU do primeiro semestre', 450.00, '2024-07-15', false, 'high'),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Renovar Academia', 'Renovar mensalidade da academia', 89.90, '2024-07-10', false, 'medium'),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Comprar presente mãe', 'Comprar presente para o dia das mães', 200.00, '2024-05-12', true, 'high'),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Pagar seguro do carro', 'Renovar seguro anual do veículo', 1200.00, '2024-08-20', false, 'high'),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Consulta dentista', 'Agendar consulta de rotina', 150.00, '2024-07-25', false, 'medium'),
('ddf661d3-28e3-4b53-8120-3e2f3830a267', 'Comprar material de trabalho', 'Comprar notebook novo', 3500.00, '2024-09-01', false, 'low');

-- 4. INSERIR ORÇAMENTOS DE EXEMPLO
-- =====================================================

DO $$
DECLARE
    alimentacao_id UUID;
    transporte_id UUID;
    lazer_id UUID;
BEGIN
    SELECT id INTO alimentacao_id FROM public.categories WHERE name = 'Alimentação' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO transporte_id FROM public.categories WHERE name = 'Transporte' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;
    SELECT id INTO lazer_id FROM public.categories WHERE name = 'Lazer' AND user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267' LIMIT 1;

    INSERT INTO public.budgets (user_id, category_id, name, amount, period, start_date, end_date, is_active) VALUES
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', alimentacao_id, 'Orçamento Alimentação Mensal', 1000.00, 'monthly', '2024-06-01', '2024-12-31', true),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', transporte_id, 'Orçamento Transporte Mensal', 400.00, 'monthly', '2024-06-01', '2024-12-31', true),
    ('ddf661d3-28e3-4b53-8120-3e2f3830a267', lazer_id, 'Orçamento Lazer Mensal', 300.00, 'monthly', '2024-06-01', '2024-12-31', true);
END $$;

-- 5. VERIFICAÇÃO DOS DADOS INSERIDOS
-- =====================================================

-- Verificar total de categorias
SELECT 'Categorias' as tipo, COUNT(*) as total FROM public.categories WHERE user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
UNION ALL
-- Verificar total de transações
SELECT 'Transações' as tipo, COUNT(*) as total FROM public.transactions WHERE user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
UNION ALL
-- Verificar total de lembretes
SELECT 'Lembretes' as tipo, COUNT(*) as total FROM public.reminders WHERE user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
UNION ALL
-- Verificar total de orçamentos
SELECT 'Orçamentos' as tipo, COUNT(*) as total FROM public.budgets WHERE user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267';

-- Verificar resumo financeiro
SELECT 
    tipo,
    COUNT(*) as quantidade,
    SUM(CASE WHEN tipo = 'receita' THEN amount ELSE 0 END) as total_receitas,
    SUM(CASE WHEN tipo = 'despesa' THEN amount ELSE 0 END) as total_despesas
FROM public.transactions 
WHERE user_id = 'ddf661d3-28e3-4b53-8120-3e2f3830a267'
GROUP BY tipo;

-- =====================================================
-- DADOS DE EXEMPLO INSERIDOS COM SUCESSO! 🎉
-- =====================================================

-- Adiciona coluna de plano na tabela subscriptions
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS plan_name text;

-- Valores recomendados: basic | pro | premium

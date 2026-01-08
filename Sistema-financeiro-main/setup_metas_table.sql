-- =====================================================
-- SCRIPT PARA CRIAR TABELA DE METAS FINANCEIRAS
-- Execute este script no SQL Editor do seu Supabase
-- =====================================================

-- Criar tabela de metas
CREATE TABLE IF NOT EXISTS public.metas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  valor_meta DECIMAL(12,2) NOT NULL,
  valor_atual DECIMAL(12,2) DEFAULT 0,
  tipo TEXT CHECK (tipo IN ('economia', 'investimento', 'compra', 'viagem', 'educacao', 'outro')) NOT NULL,
  categoria TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  status TEXT CHECK (status IN ('ativa', 'concluida', 'cancelada', 'pausada')) DEFAULT 'ativa',
  prioridade TEXT CHECK (prioridade IN ('baixa', 'media', 'alta')) DEFAULT 'media',
  cor TEXT,
  icone TEXT,
  lembretes_ativos BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_metas_user_id ON public.metas(user_id);
CREATE INDEX IF NOT EXISTS idx_metas_status ON public.metas(status);
CREATE INDEX IF NOT EXISTS idx_metas_tipo ON public.metas(tipo);
CREATE INDEX IF NOT EXISTS idx_metas_data_fim ON public.metas(data_fim);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.metas ENABLE ROW LEVEL SECURITY;

-- Criar políticas de segurança
CREATE POLICY "Usuários podem ver apenas suas próprias metas" ON public.metas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir suas próprias metas" ON public.metas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas próprias metas" ON public.metas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar suas próprias metas" ON public.metas
  FOR DELETE USING (auth.uid() = user_id);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_metas_updated_at 
  BEFORE UPDATE ON public.metas 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo (opcional)
INSERT INTO public.metas (
  user_id,
  titulo,
  descricao,
  valor_meta,
  valor_atual,
  tipo,
  categoria,
  data_inicio,
  data_fim,
  prioridade,
  cor
) VALUES 
(
  (SELECT id FROM auth.users LIMIT 1), -- Substitua pelo ID do usuário real
  'Comprar um carro',
  'Economizar para comprar um carro usado até o final do ano',
  25000.00,
  5000.00,
  'compra',
  'Pessoal',
  '2024-01-01',
  '2024-12-31',
  'alta',
  'blue'
),
(
  (SELECT id FROM auth.users LIMIT 1), -- Substitua pelo ID do usuário real
  'Viagem para Europa',
  'Economizar para uma viagem de 15 dias pela Europa',
  15000.00,
  2000.00,
  'viagem',
  'Lazer',
  '2024-01-01',
  '2025-06-30',
  'media',
  'orange'
),
(
  (SELECT id FROM auth.users LIMIT 1), -- Substitua pelo ID do usuário real
  'Reserva de emergência',
  'Criar uma reserva de emergência de 6 meses de despesas',
  30000.00,
  15000.00,
  'economia',
  'Segurança',
  '2024-01-01',
  '2024-12-31',
  'alta',
  'green'
);

-- Verificar se a tabela foi criada corretamente
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'metas' 
ORDER BY ordinal_position;

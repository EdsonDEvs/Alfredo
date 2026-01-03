-- =====================================================
-- CRIAÇÃO DA TABELA DE LEADS (PRÉ-CADASTROS)
-- Esta tabela armazena dados do cadastro antes do pagamento
-- =====================================================

-- Criar tabela de leads
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  cpf TEXT,
  plan TEXT DEFAULT 'premium',
  subscription_status TEXT DEFAULT 'pending' CHECK (subscription_status IN ('pending', 'confirmed', 'failed')),
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Criar índice para busca rápida por email
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(subscription_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at);

-- Habilitar RLS na tabela leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de leads sem autenticação (pública)
-- Isso permite que o formulário de cadastro salve dados antes do pagamento
DROP POLICY IF EXISTS "Allow public insert for leads" ON public.leads;
CREATE POLICY "Allow public insert for leads"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir leitura de leads apenas para usuários autenticados
-- (opcional - pode ser usado para verificar status do cadastro)
DROP POLICY IF EXISTS "Allow authenticated read own leads" ON public.leads;
CREATE POLICY "Allow authenticated read own leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Função para criar lead (pode ser chamada sem autenticação)
CREATE OR REPLACE FUNCTION public.create_lead(
  p_nome TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_whatsapp TEXT DEFAULT NULL,
  p_cpf TEXT DEFAULT NULL,
  p_plan TEXT DEFAULT 'premium'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  lead_id UUID;
BEGIN
  INSERT INTO public.leads (nome, email, phone, whatsapp, cpf, plan)
  VALUES (p_nome, p_email, p_phone, p_whatsapp, p_cpf, p_plan)
  RETURNING id INTO lead_id;
  
  RETURN lead_id;
END;
$$;

-- Função para atualizar lead após pagamento confirmado
CREATE OR REPLACE FUNCTION public.update_lead_after_payment(
  p_lead_id UUID,
  p_payment_id TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.leads
  SET 
    subscription_status = 'confirmed',
    payment_id = p_payment_id,
    user_id = p_user_id,
    processed_at = NOW(),
    updated_at = NOW()
  WHERE id = p_lead_id;
  
  RETURN FOUND;
END;
$$;

-- Comentários para documentação
COMMENT ON TABLE public.leads IS 'Tabela para armazenar dados de pré-cadastro antes do pagamento';
COMMENT ON COLUMN public.leads.subscription_status IS 'Status: pending (aguardando pagamento), confirmed (pago), failed (falhou)';
COMMENT ON COLUMN public.leads.user_id IS 'ID do usuário criado após pagamento confirmado (preenchido pelo n8n)';


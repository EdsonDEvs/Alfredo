-- =====================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETA DO BANCO DE DADOS
-- Compatível com a estrutura atual (nomes em português)
-- Execute este script no SQL Editor do seu Supabase
-- =====================================================

-- 1. CRIAR TABELAS (se não existirem)
-- =====================================================

-- Tabela de perfis dos usuários
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  nome TEXT,
  username TEXT,
  phone TEXT,
  whatsapp TEXT,
  avatar_url TEXT,
  assinaturaid TEXT,
  customerid TEXT,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'incomplete', 'trialing')),
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias (compatível com estrutura atual)
CREATE TABLE IF NOT EXISTS public.categorias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  userid UUID REFERENCES profiles(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações (compatível com estrutura atual)
CREATE TABLE IF NOT EXISTS public.transacoes (
  id SERIAL PRIMARY KEY,
  userid UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categorias(id),
  detalhes TEXT,
  valor DECIMAL(12,2),
  tipo TEXT,
  quando DATE,
  estabelecimento TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lembretes (compatível com estrutura atual)
CREATE TABLE IF NOT EXISTS public.lembretes (
  id SERIAL PRIMARY KEY,
  userid UUID REFERENCES profiles(id) ON DELETE CASCADE,
  descricao TEXT,
  valor DECIMAL(12,2),
  data DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'inactive',
  plan_name TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'BRL',
  cycle TEXT,
  start_date TIMESTAMPTZ,
  next_payment_date TIMESTAMPTZ,
  payment_method TEXT,
  card_last_four TEXT,
  card_brand TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, subscription_id)
);

-- 2. HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lembretes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 3. CRIAR POLÍTICAS DE SEGURANÇA (RLS)
-- =====================================================

-- Políticas para profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Políticas para categorias
DROP POLICY IF EXISTS "Users can view own categories" ON public.categorias;
CREATE POLICY "Users can view own categories"
  ON public.categorias FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own categories" ON public.categorias;
CREATE POLICY "Users can insert own categories"
  ON public.categorias FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own categories" ON public.categorias;
CREATE POLICY "Users can update own categories"
  ON public.categorias FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own categories" ON public.categorias;
CREATE POLICY "Users can delete own categories"
  ON public.categorias FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Políticas para transacoes
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transacoes;
CREATE POLICY "Users can view own transactions"
  ON public.transacoes FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transacoes;
CREATE POLICY "Users can insert own transactions"
  ON public.transacoes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own transactions" ON public.transacoes;
CREATE POLICY "Users can update own transactions"
  ON public.transacoes FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own transactions" ON public.transacoes;
CREATE POLICY "Users can delete own transactions"
  ON public.transacoes FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Políticas para lembretes
DROP POLICY IF EXISTS "Users can view own reminders" ON public.lembretes;
CREATE POLICY "Users can view own reminders"
  ON public.lembretes FOR SELECT
  TO authenticated
  USING (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can insert own reminders" ON public.lembretes;
CREATE POLICY "Users can insert own reminders"
  ON public.lembretes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can update own reminders" ON public.lembretes;
CREATE POLICY "Users can update own reminders"
  ON public.lembretes FOR UPDATE
  TO authenticated
  USING (auth.uid() = userid)
  WITH CHECK (auth.uid() = userid);

DROP POLICY IF EXISTS "Users can delete own reminders" ON public.lembretes;
CREATE POLICY "Users can delete own reminders"
  ON public.lembretes FOR DELETE
  TO authenticated
  USING (auth.uid() = userid);

-- Políticas para subscriptions
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can insert own subscriptions"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can update own subscriptions"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can delete own subscriptions"
  ON public.subscriptions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. CRIAR FUNÇÕES AUXILIARES
-- =====================================================

-- Função para verificar se o usuário é proprietário de uma categoria
CREATE OR REPLACE FUNCTION public.user_owns_category(category_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
SELECT EXISTS (
  SELECT 1 FROM public.categorias
  WHERE id = category_uuid AND userid = auth.uid()
);
$function$;

-- Função para criar perfil automaticamente quando um usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, nome, email, created_at, updated_at)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    now(),
    now()
  );
  RETURN new;
END;
$function$;

-- 5. CRIAR TRIGGERS
-- =====================================================

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Criar o trigger para novos usuários
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- =====================================================

-- Índices para categorias
CREATE INDEX IF NOT EXISTS idx_categorias_userid ON public.categorias(userid);
CREATE INDEX IF NOT EXISTS idx_categorias_nome ON public.categorias(nome);

-- Índices para transacoes
CREATE INDEX IF NOT EXISTS idx_transacoes_userid ON public.transacoes(userid);
CREATE INDEX IF NOT EXISTS idx_transacoes_category_id ON public.transacoes(category_id);
CREATE INDEX IF NOT EXISTS idx_transacoes_quando ON public.transacoes(quando);
CREATE INDEX IF NOT EXISTS idx_transacoes_tipo ON public.transacoes(tipo);

-- Índices para lembretes
CREATE INDEX IF NOT EXISTS idx_lembretes_userid ON public.lembretes(userid);
CREATE INDEX IF NOT EXISTS idx_lembretes_data ON public.lembretes(data);

-- 7. VERIFICAÇÃO FINAL
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'categorias', 'transacoes', 'lembretes', 'subscriptions')
ORDER BY table_name;

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'categorias', 'transacoes', 'lembretes', 'subscriptions');

-- =====================================================
-- CONFIGURAÇÃO COMPLETA! 🎉
-- =====================================================

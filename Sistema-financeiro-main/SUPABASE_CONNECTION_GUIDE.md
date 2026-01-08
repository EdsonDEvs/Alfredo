# 🔗 Guia de Conexão ao Seu Supabase

Este guia te ajudará a conectar o projeto ao seu próprio projeto Supabase.

## 📋 Pré-requisitos

1. ✅ Conta no Supabase (https://supabase.com)
2. ✅ Projeto Supabase criado
3. ✅ URL e chave anônima do seu projeto

## 🚀 Passo a Passo

### **1. Obter Credenciais do Supabase**

#### Acesse seu projeto:
1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto (ou crie um novo)

#### Obter as credenciais:
1. No painel do projeto, vá para **Settings** → **API**
2. Copie a **Project URL** (ex: `https://abcdefghijklmnop.supabase.co`)
3. Copie a **anon public** key (chave anônima)

### **2. Configurar Variáveis de Ambiente**

#### Opção A: Arquivo .env.local (Recomendado)
```bash
# Crie um arquivo .env.local na raiz do projeto
VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
```

#### Opção B: Modificar o arquivo client.ts diretamente
```typescript
// src/integrations/supabase/client.ts
const SUPABASE_URL = "https://SEU_PROJECT_ID.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sua_chave_anonima_aqui";
```

### **3. Configurar o Banco de Dados**

#### Criar as tabelas necessárias:
```sql
-- Tabela de perfis
CREATE TABLE public.profiles (
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

-- Tabela de categorias
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  icon TEXT,
  tipo TEXT CHECK (tipo IN ('receita', 'despesa')),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de transações
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  tipo TEXT CHECK (tipo IN ('receita', 'despesa')) NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT,
  recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  status TEXT CHECK (status IN ('pending', 'completed', 'canceled')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de lembretes
CREATE TABLE public.reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(12,2),
  due_date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  recurring BOOLEAN DEFAULT false,
  recurring_frequency TEXT CHECK (recurring_frequency IN ('daily', 'weekly', 'monthly', 'yearly')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de logs de atividade
CREATE TABLE public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tabela TEXT NOT NULL,
  acao TEXT NOT NULL,
  dados JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de orçamentos
CREATE TABLE public.budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  period TEXT CHECK (period IN ('monthly', 'weekly', 'yearly')) DEFAULT 'monthly',
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **4. Configurar Row Level Security (RLS)**

> **📖 GUIA COMPLETO DO RLS:** [RLS_SETUP_GUIDE.md](./RLS_SETUP_GUIDE.md)

#### Habilitar RLS:
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
```

#### Criar políticas de segurança:
```sql
-- Políticas para profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Políticas para categories
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para transactions
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.transactions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own transactions"
  ON public.transactions FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para reminders
CREATE POLICY "Users can view own reminders"
  ON public.reminders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reminders"
  ON public.reminders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON public.reminders FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON public.reminders FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para activity_logs
CREATE POLICY "Users can view own activity logs"
  ON public.activity_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity logs"
  ON public.activity_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Políticas para budgets
CREATE POLICY "Users can view own budgets"
  ON public.budgets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own budgets"
  ON public.budgets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own budgets"
  ON public.budgets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own budgets"
  ON public.budgets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### **5. Configurar Funções e Triggers**

#### Função para verificar propriedade de categoria:
```sql
CREATE OR REPLACE FUNCTION public.user_owns_category(category_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
SELECT EXISTS (
  SELECT 1 FROM public.categories
  WHERE id = category_uuid AND user_id = auth.uid()
);
$function$;
```

#### Trigger para criar perfil automaticamente:
```sql
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### **6. Configurar Autenticação**

#### No painel do Supabase:
1. Vá para **Authentication** → **Settings**
2. Configure **Site URL** para `http://localhost:8080`
3. Adicione **Redirect URLs**:
   - `http://localhost:8080/auth`
   - `http://localhost:8080/dashboard`
   - `http://localhost:8080/categorias`

### **7. Testar a Conexão**

#### Reiniciar o projeto:
```bash
# Parar o servidor atual (Ctrl+C)
# Reiniciar
npm run dev
```

#### Verificar no console do navegador:
- Acesse `http://localhost:8080`
- Abra o console (F12)
- Deve aparecer: "Auth state changed: INITIAL_SESSION"

## 🔧 Solução de Problemas

### **Erro: "Invalid API key"**
- Verifique se a chave anônima está correta
- Confirme se o projeto está ativo

### **Erro: "RLS policy violation"**
- Verifique se as políticas RLS estão criadas
- Confirme se o usuário está autenticado
- **📖 Consulte:** [RLS_SETUP_GUIDE.md](./RLS_SETUP_GUIDE.md)

### **Erro: "Table does not exist"**
- Execute os comandos SQL para criar as tabelas
- Verifique se está no schema correto

### **Erro: "Auth redirect"**
- Configure as URLs de redirecionamento no Supabase
- Verifique se o site URL está correto

## 📱 Verificação Final

✅ **Projeto conectado ao seu Supabase**
✅ **Tabelas criadas e configuradas**
✅ **RLS habilitado e políticas configuradas**
✅ **Autenticação funcionando**
✅ **Categorias protegidas por usuário**

## 🎯 Próximos Passos

1. **Testar criação de usuário** - Registre um novo usuário
2. **Testar categorias** - Crie algumas categorias de teste
3. **Verificar isolamento** - Confirme que usuários só veem suas categorias
4. **Personalizar conforme necessário** - Ajuste as configurações

## 📚 **Guias Adicionais**

- **🔒 RLS Setup:** [RLS_SETUP_GUIDE.md](./RLS_SETUP_GUIDE.md) - Guia completo do Row Level Security
- **🚀 Resumo Executivo:** [CONEXAO_SUPABASE_EXECUTIVO.md](./CONEXAO_SUPABASE_EXECUTIVO.md) - Passos rápidos em 5 minutos
- **🔐 Autenticação:** [CATEGORIAS_AUTH.md](./CATEGORIAS_AUTH.md) - Documentação da autenticação

---

**🚀 Seu projeto está agora conectado ao seu próprio Supabase!**

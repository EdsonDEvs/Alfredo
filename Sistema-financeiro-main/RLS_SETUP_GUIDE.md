# 🔒 CONFIGURAÇÃO DO ROW LEVEL SECURITY (RLS) - PASSO 4

Este guia te ajudará a configurar o RLS no seu Supabase para proteger os dados dos usuários.

## 🎯 **O que é RLS?**

**Row Level Security (RLS)** é um sistema de segurança que controla o acesso às linhas das tabelas baseado no usuário autenticado. Cada usuário só pode ver e modificar seus próprios dados.

## 🚀 **PASSO 4: Configurar RLS**

### **1. Acessar o SQL Editor**

1. No painel do Supabase, vá para **SQL Editor**
2. Clique em **New Query**
3. Cole todo o conteúdo do arquivo `setup_database.sql`
4. Clique em **Run** para executar

### **2. O que o Script Faz**

#### **✅ Cria as Tabelas:**
- `profiles` - Perfis dos usuários
- `categories` - Categorias de transações
- `transactions` - Transações financeiras
- `reminders` - Lembretes de pagamento
- `activity_logs` - Logs de atividade
- `budgets` - Orçamentos

#### **✅ Habilita RLS:**
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
-- ... e outras tabelas
```

#### **✅ Cria Políticas de Segurança:**
- **SELECT**: Usuários só veem seus próprios dados
- **INSERT**: Usuários só podem inserir dados para si
- **UPDATE**: Usuários só podem atualizar seus dados
- **DELETE**: Usuários só podem deletar seus dados

### **3. Verificar se RLS Está Funcionando**

#### **No SQL Editor, execute:**
```sql
-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('profiles', 'categories', 'transactions', 'reminders', 'activity_logs', 'budgets');
```

**Resultado esperado:**
```
schemaname | tablename      | rowsecurity
-----------+----------------+------------
public     | profiles      | true
public     | categories    | true
public     | transactions  | true
public     | reminders     | true
public     | activity_logs | true
public     | budgets       | true
```

#### **Verificar Políticas Criadas:**
```sql
-- Verificar políticas criadas
SELECT 
  tablename,
  policyname,
  cmd,
  permissive
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Resultado esperado:**
```
tablename      | policyname                    | cmd    | permissive
---------------+-------------------------------+--------+------------
profiles       | Users can update own profile  | UPDATE | true
profiles       | Users can view own profile    | SELECT | true
categories     | Users can delete own categories| DELETE | true
categories     | Users can insert own categories| INSERT | true
categories     | Users can update own categories| UPDATE | true
categories     | Users can view own categories | SELECT | true
-- ... e outras políticas
```

## 🔐 **Como o RLS Funciona**

### **Exemplo Prático:**

1. **Usuário A** se registra → ID: `123e4567-e89b-12d3-a456-426614174000`
2. **Usuário B** se registra → ID: `987fcdeb-51a2-43d1-9f12-345678901234`
3. **Usuário A** cria categoria "Alimentação" → `user_id = 123e4567-e89b-12d3-a456-426614174000`
4. **Usuário B** cria categoria "Transporte" → `user_id = 987fcdeb-51a2-43d1-9f12-345678901234`

### **Resultado:**
- **Usuário A** só vê: "Alimentação"
- **Usuário B** só vê: "Transporte"
- **Usuário A** NÃO pode ver, editar ou deletar "Transporte"
- **Usuário B** NÃO pode ver, editar ou deletar "Alimentação"

## 🛡️ **Políticas de Segurança Implementadas**

### **Para Cada Tabela:**

#### **1. Profiles (Perfis)**
```sql
-- Usuário só vê seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuário só atualiza seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

#### **2. Categories (Categorias)**
```sql
-- Usuário só vê suas categorias
CREATE POLICY "Users can view own categories"
  ON public.categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Usuário só cria categorias para si
CREATE POLICY "Users can insert own categories"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Usuário só edita suas categorias
CREATE POLICY "Users can update own categories"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Usuário só deleta suas categorias
CREATE POLICY "Users can delete own categories"
  ON public.categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

## 🔍 **Testando o RLS**

### **1. Teste de Isolamento**

#### **Criar usuário de teste:**
```sql
-- No SQL Editor, execute:
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'teste@exemplo.com',
  crypt('senha123', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

#### **Verificar isolamento:**
```sql
-- Como usuário A, criar categoria
INSERT INTO public.categories (user_id, name, tipo)
VALUES ('ID_DO_USUARIO_A', 'Categoria Teste A', 'despesa');

-- Como usuário B, tentar ver categoria do usuário A
-- Deve retornar 0 resultados devido ao RLS
SELECT * FROM public.categories WHERE user_id = 'ID_DO_USUARIO_A';
```

## 🚨 **Solução de Problemas**

### **Problema: "RLS policy violation"**
**Solução:** Verifique se as políticas foram criadas corretamente
```sql
SELECT * FROM pg_policies WHERE schemaname = 'public';
```

### **Problema: "Table does not exist"**
**Solução:** Execute o script completo novamente
```sql
-- No SQL Editor, execute o setup_database.sql completo
```

### **Problema: "Permission denied"**
**Solução:** Verifique se o usuário está autenticado
```sql
-- Verificar usuário atual
SELECT auth.uid();
```

## 📊 **Verificação Final**

### **Checklist RLS:**
- ✅ **Tabelas criadas** com estrutura correta
- ✅ **RLS habilitado** em todas as tabelas
- ✅ **Políticas criadas** para SELECT, INSERT, UPDATE, DELETE
- ✅ **Funções auxiliares** implementadas
- ✅ **Triggers** configurados
- ✅ **Índices** criados para performance

### **Comandos de Verificação:**
```sql
-- 1. Verificar tabelas
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- 2. Verificar RLS
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- 3. Verificar políticas
SELECT tablename, policyname, cmd FROM pg_policies WHERE schemaname = 'public';

-- 4. Verificar funções
SELECT routine_name FROM information_schema.routines WHERE routine_schema = 'public';

-- 5. Verificar triggers
SELECT trigger_name, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';
```

## 🎯 **Próximo Passo**

Após configurar o RLS, vá para o **PASSO 5: Configurar Funções e Triggers**

---

**🔒 Seu banco de dados está agora protegido com RLS! Cada usuário só acessa seus próprios dados.**

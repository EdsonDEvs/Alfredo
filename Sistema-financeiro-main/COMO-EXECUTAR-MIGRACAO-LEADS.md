# 📋 Como Executar a Migração da Tabela Leads

## 🚀 Passo a Passo

### 1. Acessar o Supabase Dashboard

1. Acesse [https://app.supabase.com](https://app.supabase.com)
2. Faça login na sua conta
3. Selecione seu projeto

### 2. Abrir o SQL Editor

1. No menu lateral, clique em **SQL Editor**
2. Clique em **New Query**

### 3. Executar a Migração

1. Copie o conteúdo do arquivo:
   ```
   supabase/migrations/20250111000000_create_leads_table.sql
   ```

2. Cole no SQL Editor do Supabase

3. Clique em **Run** (ou pressione `Ctrl+Enter` / `Cmd+Enter`)

### 4. Verificar se a Tabela Foi Criada

Execute a seguinte query para verificar:

```sql
-- Verificar se a tabela existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'leads';

-- Verificar as políticas RLS
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'leads';

-- Verificar as funções criadas
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('create_lead', 'update_lead_after_payment');
```

### 5. Testar a Inserção (Opcional)

Execute a seguinte query para testar se a inserção funciona sem autenticação:

```sql
-- Teste de inserção (deve funcionar mesmo sem autenticação)
INSERT INTO public.leads (nome, email, phone, whatsapp, plan)
VALUES ('Teste', 'teste@exemplo.com', '(11) 99999-9999', '5511999999999', 'premium')
RETURNING *;
```

## ✅ Verificação Final

Após executar a migração, você deve ter:

- ✅ Tabela `leads` criada
- ✅ Índices criados (email, status, created_at)
- ✅ Política RLS para inserção pública
- ✅ Função `create_lead()` criada
- ✅ Função `update_lead_after_payment()` criada

## 🔍 Verificar no Código

Após executar a migração, teste o cadastro:

1. Acesse a página de cadastro: `/cadastro`
2. Preencha os dados do formulário
3. Clique em "Continuar para Pagamento"
4. Verifique no console do navegador se aparece: `✅ Lead salvo com sucesso`
5. Verifique no Supabase se o lead foi criado na tabela `leads`

## 🐛 Solução de Problemas

### Erro: "relation 'leads' does not exist"

**Solução:** Execute a migração novamente. Certifique-se de que está no projeto correto do Supabase.

### Erro: "permission denied for table leads"

**Solução:** Verifique se as políticas RLS foram criadas corretamente. Execute a query de verificação acima.

### Erro: "function create_lead does not exist"

**Solução:** A função deve ser criada pela migração. Verifique se a migração foi executada completamente.

## 📝 Próximos Passos

Após executar a migração:

1. ✅ Teste o cadastro na aplicação
2. ✅ Verifique se os dados estão sendo salvos na tabela `leads`
3. ✅ Configure o n8n para usar a tabela `leads` após o pagamento
4. ✅ Atualize o workflow do n8n para buscar dados da tabela `leads`

---

**Última atualização:** 2025-01-11


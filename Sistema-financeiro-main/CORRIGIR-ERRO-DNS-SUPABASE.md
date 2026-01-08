# 🔧 Corrigir Erro ERR_NAME_NOT_RESOLVED

## ❌ Problema Identificado

O erro `ERR_NAME_NOT_RESOLVED` para `yjtsyuibemnkjfyonfjt.supabase.co` indica que:

1. **O projeto Supabase pode estar pausado ou deletado**
2. **O domínio não existe mais**
3. **Problema de DNS/conectividade**

## ✅ Soluções

### Opção 1: Verificar se o Projeto Supabase Existe

1. Acesse https://supabase.com/dashboard
2. Verifique se o projeto com ID `yjtsyuibemnkjfyonfjt` ainda existe
3. Se não existir, você precisa:
   - Criar um novo projeto Supabase, OU
   - Usar um projeto existente

### Opção 2: Usar um Projeto Supabase Válido

1. Acesse https://supabase.com/dashboard
2. Selecione ou crie um projeto
3. Vá em **Settings** → **API**
4. Copie:
   - **Project URL** (exemplo: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (a chave longa)

5. Atualize o arquivo `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://SEU_PROJECT_ID.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
   ```

6. **Reinicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

### Opção 3: Testar Conectividade

Teste se consegue acessar o Supabase:
```bash
# No PowerShell
Test-NetConnection -ComputerName yjtsyuibemnkjfyonfjt.supabase.co -Port 443
```

Se falhar, o projeto não existe ou está inacessível.

## 🚨 IMPORTANTE

O arquivo `.env.local` foi criado com os valores padrão, mas **você precisa verificar se o projeto Supabase está ativo** e atualizar com as credenciais corretas do seu projeto.

## 📝 Passos Imediatos

1. ✅ Arquivo `.env.local` criado
2. ⚠️ **Verifique no Supabase Dashboard se o projeto existe**
3. ⚠️ **Atualize `.env.local` com credenciais válidas**
4. ⚠️ **Reinicie o servidor** (`npm run dev`)
5. ✅ Teste o login novamente

## 🔍 Como Verificar se o Projeto Existe

1. Acesse: https://supabase.com/dashboard
2. Faça login
3. Verifique a lista de projetos
4. Se o projeto `yjtsyuibemnkjfyonfjt` não aparecer, ele foi deletado/pausado

## 💡 Criar Novo Projeto

Se precisar criar um novo projeto:

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Preencha os dados
4. Copie a URL e a chave anônima
5. Atualize `.env.local`
6. Execute `setup_database.sql` no SQL Editor do Supabase


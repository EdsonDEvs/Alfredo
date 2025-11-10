# Configuração do Supabase

Este projeto já está configurado com o Supabase e funcionando. Aqui está um guia completo de configuração:

## 🚀 Status Atual

✅ **Projeto Supabase configurado e funcionando**
✅ **Cliente Supabase configurado**
✅ **Tipos TypeScript gerados**
✅ **Migrações do banco de dados aplicadas**
✅ **Políticas de segurança (RLS) configuradas**

## 📋 Configuração Atual

### URL do Projeto
```
https://onezabszpxqdjqerrjxo.supabase.co
```

### Chave Anônima
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZXphYnN6cHhxZGpxZXJyanhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxOTk3NzcsImV4cCI6MjA2OTc3NTc3N30.t-yOutDCejVH45BBUl46NbG9I1PJzu5MOFeblEkwRbY
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

1. **profiles** - Perfis dos usuários
2. **categorias** - Categorias de transações
3. **transacoes** - Transações financeiras
4. **lembretes** - Lembretes de pagamentos
5. **subscriptions** - Informações de assinatura

### Funcionalidades de Segurança

- ✅ **Row Level Security (RLS)** habilitado
- ✅ **Políticas de acesso** configuradas por usuário
- ✅ **Função de verificação de propriedade** implementada
- ✅ **Trigger de criação automática de perfil** configurado

## 🔧 Como Usar

### 1. Importar o Cliente Supabase

```typescript
import { supabase } from "@/integrations/supabase/client";
```

### 2. Autenticação

```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, signIn, signOut } = useAuth();
```

### 3. Operações no Banco

```typescript
// Buscar categorias do usuário
const { data: categorias } = await supabase
  .from('categorias')
  .select('*')
  .eq('userid', user.id);

// Inserir nova transação
const { data, error } = await supabase
  .from('transacoes')
  .insert({
    valor: 100.50,
    categoria_id: 'uuid-da-categoria',
    userid: user.id,
    tipo: 'despesa'
  });
```

## 🌍 Variáveis de Ambiente (Opcional)

Para personalizar a configuração, você pode criar um arquivo `.env.local`:

```bash
# Copie o arquivo env.example para .env.local
cp env.example .env.local

# Edite as variáveis conforme necessário
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📱 Funcionalidades Disponíveis

### Autenticação
- ✅ Login/Logout com email e senha
- ✅ Recuperação de senha
- ✅ Sessões persistentes
- ✅ Proteção de rotas

### Gestão Financeira
- ✅ Categorias personalizadas
- ✅ Transações com categorização
- ✅ Lembretes de pagamento
- ✅ Relatórios e gráficos

### Assinatura
- ✅ Gestão de planos
- ✅ Status de assinatura
- ✅ Informações de pagamento

## 🚨 Políticas de Segurança

- **Usuários só podem acessar seus próprios dados**
- **Categorias são isoladas por usuário**
- **Transações vinculadas ao usuário autenticado**
- **Perfis criados automaticamente no registro**

## 🔄 Migrações

O projeto inclui migrações automáticas que configuram:
- Estrutura das tabelas
- Políticas de segurança
- Funções auxiliares
- Triggers automáticos

## 📊 Monitoramento

- **Logs de autenticação** no console do navegador
- **Verificação de sessão** automática
- **Tratamento de erros** implementado

## 🎯 Próximos Passos

1. **Testar a aplicação** - Acesse http://localhost:8080
2. **Criar uma conta** - Use o formulário de registro
3. **Explorar as funcionalidades** - Dashboard, transações, categorias
4. **Personalizar conforme necessário** - Modifique as configurações no arquivo `env.example`

## 🆘 Suporte

Se encontrar problemas:
1. Verifique o console do navegador para erros
2. Confirme se as credenciais do Supabase estão corretas
3. Verifique se o projeto está rodando em http://localhost:8080

---

**🎉 Seu projeto Supabase está configurado e pronto para uso!**

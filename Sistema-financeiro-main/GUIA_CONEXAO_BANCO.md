# 🗄️ Guia de Conexão com Banco de Dados Real

## 📋 Pré-requisitos

1. **Conta no Supabase** - [Criar conta gratuita](https://supabase.com)
2. **Projeto Supabase** - Já configurado no seu projeto
3. **Node.js** - Versão 16 ou superior
4. **Git** - Para controle de versão

## 🚀 Passo a Passo

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
# Copie o arquivo de exemplo
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

### 2. Configurar Banco de Dados

#### Opção A: Usar o Supabase Dashboard

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para **SQL Editor**
4. Execute o script `setup_database.sql` para criar as tabelas
5. Execute o script `insert_sample_data.sql` para inserir dados de exemplo

#### Opção B: Usar Supabase CLI

```bash
# Instalar Supabase CLI
npm install -g supabase

# Fazer login
supabase login

# Inicializar projeto (se necessário)
supabase init

# Aplicar migrações
supabase db push

# Inserir dados de exemplo
supabase db reset --linked
```

### 3. Verificar Conexão

Execute o projeto para testar a conexão:

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev
```

### 4. Testar Funcionalidades

1. **Registrar um usuário** na aplicação
2. **Fazer login** com as credenciais
3. **Verificar se os dados aparecem** no dashboard
4. **Testar CRUD** de transações, categorias e lembretes

## 🔧 Configurações Avançadas

### Row Level Security (RLS)

O projeto já está configurado com RLS ativo. As políticas garantem que:

- Usuários só vejam seus próprios dados
- Cada tabela tem políticas específicas de acesso
- Operações são seguras e isoladas por usuário

### Triggers Automáticos

- **Novo usuário**: Cria perfil automaticamente
- **Timestamps**: Atualiza `updated_at` automaticamente
- **Validações**: Verifica propriedade de dados

### Índices de Performance

Índices criados para otimizar consultas:

- `user_id` em todas as tabelas
- `date` em transações
- `category_id` em transações
- `due_date` em lembretes

## 📊 Estrutura do Banco

### Tabelas Principais

1. **profiles** - Perfis dos usuários
2. **categories** - Categorias de receita/despesa
3. **transactions** - Transações financeiras
4. **reminders** - Lembretes de pagamento
5. **budgets** - Orçamentos por categoria
6. **activity_logs** - Log de atividades

### Relacionamentos

```
profiles (1) ←→ (N) categories
profiles (1) ←→ (N) transactions
profiles (1) ←→ (N) reminders
profiles (1) ←→ (N) budgets
categories (1) ←→ (N) transactions
categories (1) ←→ (N) budgets
```

## 🛠️ Troubleshooting

### Erro de Conexão

```bash
# Verificar variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY

# Testar conexão via curl
curl -X GET "https://sua_url.supabase.co/rest/v1/" \
  -H "apikey: sua_chave_anonima"
```

### Erro de RLS

```sql
-- Verificar políticas ativas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Verificar se RLS está ativo
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

### Erro de Autenticação

```typescript
// Verificar se o usuário está autenticado
const { data: { user } } = await supabase.auth.getUser();
console.log('Usuário:', user);
```

## 📈 Monitoramento

### Logs de Atividade

O sistema registra automaticamente:

- Criação de transações
- Atualizações de perfil
- Ações de categorias
- Acessos ao sistema

### Métricas Importantes

- Total de transações por mês
- Receitas vs Despesas
- Categorias mais utilizadas
- Lembretes pendentes

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha** a chave de serviço no frontend
2. **Use RLS** para todas as tabelas
3. **Valide dados** no backend
4. **Monitore logs** regularmente
5. **Faça backup** dos dados importantes

### Políticas de Segurança

```sql
-- Exemplo de política segura
CREATE POLICY "Users can view own data"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

## 🚀 Deploy

### Produção

1. **Configurar variáveis** de produção
2. **Executar migrações** no banco de produção
3. **Configurar domínio** personalizado
4. **Ativar SSL** e HTTPS
5. **Configurar CDN** para performance

### Backup

```bash
# Backup automático (configurar no Supabase)
# Ou backup manual
supabase db dump --data-only > backup.sql
```

## 📞 Suporte

Se encontrar problemas:

1. **Verificar logs** do Supabase
2. **Consultar documentação** oficial
3. **Abrir issue** no GitHub
4. **Contatar suporte** do Supabase

---

## ✅ Checklist de Configuração

- [ ] Criar conta no Supabase
- [ ] Configurar variáveis de ambiente
- [ ] Executar script de setup do banco
- [ ] Inserir dados de exemplo
- [ ] Testar conexão
- [ ] Verificar autenticação
- [ ] Testar CRUD operations
- [ ] Configurar backup
- [ ] Documentar configurações

---

**🎉 Parabéns! Seu projeto está conectado ao banco de dados real!**

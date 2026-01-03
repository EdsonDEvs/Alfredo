# 🚀 Conectar Projeto ao Banco de Dados Real

## 📋 Resumo Rápido

Seu projeto já está configurado com **Supabase**! Agora você precisa:

1. **Configurar variáveis de ambiente**
2. **Executar scripts SQL**
3. **Inserir dados de exemplo**
4. **Testar a conexão**

## ⚡ Passos Rápidos

### 1. Configurar Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env.local

# Editar com suas credenciais do Supabase
# VITE_SUPABASE_URL=sua_url_do_supabase
# VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 2. Configurar Banco de Dados

Acesse o [Supabase Dashboard](https://app.supabase.com) e execute no **SQL Editor**:

1. **`setup_database.sql`** - Criar estrutura do banco
2. **`get_user_id.sql`** - Obter UUID do usuário
3. **`insert_sample_data_corrigido.sql`** - Inserir dados de exemplo
4. **`test_connection.sql`** - Verificar se tudo funciona

### 3. Testar Aplicação

```bash
npm install
npm run dev
```

## 📁 Arquivos Criados

- `setup_database.sql` - Estrutura completa do banco
- `insert_sample_data_corrigido.sql` - Dados de exemplo realistas
- `get_user_id.sql` - Obter UUID do usuário
- `test_connection.sql` - Testar conexão
- `GUIA_CONEXAO_BANCO.md` - Guia completo
- `README_CONEXAO.md` - Este arquivo

## 🎯 Dados de Exemplo Incluídos

- **15 categorias** (receitas e despesas)
- **40+ transações** (últimos 3 meses)
- **6 lembretes** de pagamento
- **Dados realistas** de finanças pessoais

## 🔧 Estrutura do Banco

```
profiles (usuários)
├── categorias (receitas/despesas)
├── transacoes (movimentações)
├── lembretes (pagamentos)
└── subscriptions (assinaturas)
```

## ✅ Checklist

- [ ] Configurar `.env.local`
- [ ] Executar `setup_database.sql`
- [ ] Obter UUID do usuário
- [ ] Inserir dados de exemplo
- [ ] Testar conexão
- [ ] Verificar aplicação

## 🆘 Problemas Comuns

### Erro de Conexão
- Verificar variáveis de ambiente
- Confirmar credenciais do Supabase

### Erro de RLS
- Verificar se políticas estão ativas
- Confirmar se usuário está autenticado

### Dados Não Aparecem
- Verificar UUID do usuário
- Confirmar se dados foram inseridos

## 📞 Suporte

- **Documentação**: `GUIA_CONEXAO_BANCO.md`
- **Testes**: `test_connection.sql`
- **Logs**: Supabase Dashboard

---

**🎉 Pronto! Seu projeto está conectado ao banco de dados real!**

# 🏦 Guia de Configuração - Integração Open Finance (Pluggy)

## 📋 Pré-requisitos

1. **Conta na Pluggy** - [Criar conta gratuita](https://pluggy.ai)
2. **API Key da Pluggy** - Obter no dashboard da Pluggy
3. **Banco de dados atualizado** - Executar a migração SQL

---

## 🚀 Passo a Passo

### 1. Criar Conta na Pluggy

1. Acesse [pluggy.ai](https://pluggy.ai)
2. Clique em **"Sign Up"** ou **"Criar Conta"**
3. Preencha seus dados e confirme o email
4. Faça login no dashboard

### 2. Obter API Key

1. No dashboard da Pluggy, vá para **Settings** → **API Keys**
2. Clique em **"Create API Key"** ou use a chave existente
3. **Copie a chave** (ela será algo como: `pk_test_xxxxxxxxxxxxx`)
4. ⚠️ **IMPORTANTE**: Guarde esta chave em local seguro, ela não será mostrada novamente

### 3. Executar Migração SQL

Execute o script de migração no Supabase SQL Editor:

```sql
-- Arquivo: ADICIONAR-COLUNAS-OPEN-FINANCE.sql
```

Este script adiciona:
- Coluna `bank_connection_id` na tabela `profiles`
- Coluna `external_id` na tabela `transacoes`
- Índices para melhorar performance

### 4. Configurar Variável de Ambiente

Adicione a API Key da Pluggy no arquivo `.env.local`:

```env
# Supabase (já existente)
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_aqui

# Pluggy Open Finance
VITE_PLUGGY_API_KEY=pk_test_sua_chave_aqui

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

**Substitua `pk_test_sua_chave_aqui` pela sua API Key real da Pluggy.**

### 5. Reiniciar o Servidor

Após adicionar a variável de ambiente:

```bash
# Parar o servidor (Ctrl+C)
# Reiniciar
npm run dev
```

---

## 🎯 Como Usar

### Conectar Conta Bancária

1. Faça login no sistema
2. Vá para o **Dashboard**
3. Role até a seção **"Conectar Conta Bancária"**
4. Clique em **"Conectar Conta Bancária"**
5. Um pop-up da Pluggy abrirá
6. Selecione seu banco (ex: Nubank, Itaú, Bradesco, etc.)
7. Digite suas credenciais do banco no ambiente seguro da Pluggy
8. Autorize a conexão

### Sincronizar Transações

Após conectar:

1. Clique em **"Sincronizar Agora"** para importar transações manualmente
2. As transações dos últimos 90 dias serão importadas
3. Transações duplicadas serão evitadas automaticamente

### Desconectar Conta

1. Clique em **"Desconectar"** na seção de conexão bancária
2. Confirme a ação
3. As transações já importadas não serão removidas

---

## 🔒 Segurança

### ⚠️ IMPORTANTE

- **Nunca compartilhe sua API Key** da Pluggy
- **Não commite** o arquivo `.env.local` no Git
- A Pluggy usa **Open Finance**, suas credenciais bancárias **nunca** são armazenadas no nosso sistema
- A conexão é feita diretamente entre você e a Pluggy em ambiente seguro

### Para Produção

Em produção (Vercel, etc.), configure a variável de ambiente:

1. Vá para **Settings** → **Environment Variables**
2. Adicione:
   - **Name**: `VITE_PLUGGY_API_KEY`
   - **Value**: Sua API Key da Pluggy
   - **Environment**: Production, Preview, Development

---

## 🐛 Troubleshooting

### Erro: "Pluggy API Key não configurada"

**Solução:**
1. Verifique se adicionou `VITE_PLUGGY_API_KEY` no `.env.local`
2. Verifique se a chave está correta (começa com `pk_test_` ou `pk_live_`)
3. Reinicie o servidor após adicionar a variável

### Erro: "Nenhuma conexão bancária encontrada"

**Solução:**
1. Certifique-se de ter conectado uma conta bancária primeiro
2. Verifique se o `itemId` foi salvo no perfil do usuário no Supabase

### Transações não aparecem após sincronizar

**Solução:**
1. Verifique se há transações no período (últimos 90 dias)
2. Verifique os logs do console do navegador (F12)
3. Verifique se a conexão bancária ainda está ativa na Pluggy

### Erro ao gerar connect token

**Solução:**
1. Verifique se a API Key está correta
2. Verifique se sua conta Pluggy está ativa
3. Verifique se não excedeu o limite de requisições (plano gratuito tem limites)

---

## 📚 Recursos Adicionais

- [Documentação Pluggy](https://docs.pluggy.ai)
- [API Reference](https://docs.pluggy.ai/reference)
- [Suporte Pluggy](https://pluggy.ai/support)

---

## 💡 Dicas

1. **Plano Gratuito**: A Pluggy oferece um plano gratuito para testes/desenvolvimento
2. **Sandbox**: Use o modo sandbox para testar sem conectar contas reais
3. **Webhooks**: Configure webhooks na Pluggy para sincronização automática (avançado)
4. **Múltiplas Contas**: Você pode conectar múltiplas contas bancárias

---

## ✅ Checklist

- [ ] Conta criada na Pluggy
- [ ] API Key obtida
- [ ] Migração SQL executada
- [ ] Variável `VITE_PLUGGY_API_KEY` configurada no `.env.local`
- [ ] Servidor reiniciado
- [ ] Conta bancária conectada
- [ ] Transações sincronizadas

---

## 🎉 Pronto!

Agora você pode conectar contas bancárias e importar transações automaticamente via Open Finance!


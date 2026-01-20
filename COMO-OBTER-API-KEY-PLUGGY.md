# 🔑 Como Obter a API Key da Pluggy - Guia Passo a Passo

## 📋 Pré-requisitos

- Conta de e-mail válida
- Navegador web (Chrome, Firefox, Edge, etc.)

---

## 🚀 Passo a Passo Completo

### 1️⃣ Criar Conta na Pluggy

1. Acesse o site da Pluggy: **https://pluggy.ai**
2. Clique no botão **"Sign Up"** ou **"Criar Conta"** (geralmente no canto superior direito)
3. Preencha o formulário:
   - Nome completo
   - E-mail
   - Senha (mínimo 8 caracteres)
4. Aceite os termos de uso e política de privacidade
5. Clique em **"Criar Conta"**
6. Verifique seu e-mail e clique no link de confirmação

---

### 2️⃣ Fazer Login no Dashboard

1. Após confirmar o e-mail, acesse: **https://dashboard.pluggy.ai**
2. Faça login com suas credenciais:
   - E-mail
   - Senha

---

### 3️⃣ Navegar até as API Keys

**Opção A: Menu Lateral**
1. No dashboard, localize o menu lateral esquerdo
2. Clique em **"Settings"** (Configurações)
3. Clique em **"API Keys"**

**Opção B: Menu Superior**
1. Clique no seu perfil (canto superior direito)
2. Selecione **"Settings"**
3. Vá para a aba **"API Keys"**

---

### 4️⃣ Criar ou Visualizar API Key

#### Se você ainda não tem uma API Key:

1. Clique no botão **"Create API Key"** ou **"Criar API Key"**
2. Escolha o tipo:
   - **Test/Sandbox** (recomendado para desenvolvimento)
   - **Production** (apenas para produção)
3. Dê um nome descritivo (ex: "Meu Projeto - Desenvolvimento")
4. Clique em **"Create"** ou **"Criar"**

#### Se você já tem uma API Key:

1. Localize a lista de API Keys criadas
2. Clique no ícone de **👁️ (olho)** ou **📋 (copiar)** ao lado da chave
3. A chave será copiada automaticamente ou exibida na tela

---

### 5️⃣ Copiar a API Key

⚠️ **IMPORTANTE**: A API Key será exibida apenas UMA VEZ quando criada!

1. **Copie a chave completa** (ela é longa, começa com `pk_test_` ou `pk_live_`)
2. **Cole em um local seguro** (bloco de notas, gerenciador de senhas, etc.)
3. Exemplo de formato:
   ```
   pk_test_1234567890abcdefghijklmnopqrstuvwxyz
   ```

---

### 6️⃣ Configurar no Projeto

1. Abra o arquivo `.env.local` na pasta `Sistema-financeiro-main`
2. Se não existir, copie o arquivo `env.example` para `.env.local`
3. Adicione ou edite a linha:
   ```env
   VITE_PLUGGY_API_KEY=pk_test_SUA_CHAVE_AQUI
   ```
4. **Substitua** `pk_test_SUA_CHAVE_AQUI` pela chave que você copiou
5. Salve o arquivo (Ctrl+S)

**Exemplo completo do `.env.local`:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_supabase_aqui

# Pluggy Open Finance
VITE_PLUGGY_API_KEY=pk_test_1234567890abcdefghijklmnopqrstuvwxyz

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

---

### 7️⃣ Reiniciar o Servidor

Após adicionar a API Key:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```
3. A aplicação agora terá acesso à API da Pluggy!

---

## 🔒 Segurança

### ⚠️ IMPORTANTE - Boas Práticas:

1. **Nunca compartilhe sua API Key** publicamente
2. **Não commite** o arquivo `.env.local` no Git (já está no `.gitignore`)
3. **Use API Keys de Test** durante desenvolvimento
4. **Use API Keys de Production** apenas em produção
5. **Revogue chaves** que não estão mais em uso
6. **Rotacione chaves** periodicamente em produção

---

## 🆘 Problemas Comuns

### "Não consigo encontrar a opção API Keys"

**Solução:**
- Certifique-se de estar logado no dashboard
- Verifique se sua conta está ativa
- Tente acessar diretamente: `https://dashboard.pluggy.ai/settings/api-keys`

### "A API Key não funciona"

**Solução:**
- Verifique se copiou a chave completa (sem espaços)
- Verifique se está usando a chave correta (test vs production)
- Certifique-se de que reiniciou o servidor após adicionar a chave
- Verifique se não há espaços antes/depois do `=` no `.env.local`

### "Esqueci minha API Key"

**Solução:**
- Você precisará criar uma nova API Key
- A chave antiga não pode ser recuperada por segurança
- Revogue a chave antiga se possível

### "Erro: Invalid API Key"

**Solução:**
- Verifique se a chave está correta no `.env.local`
- Verifique se não há espaços extras
- Verifique se está usando a chave de Test (se estiver em desenvolvimento)
- Reinicie o servidor

---

## 📚 Recursos Adicionais

- **Documentação Pluggy**: https://docs.pluggy.ai
- **Dashboard Pluggy**: https://dashboard.pluggy.ai
- **Suporte Pluggy**: https://pluggy.ai/support
- **Status da API**: https://status.pluggy.ai

---

## ✅ Checklist

- [ ] Conta criada na Pluggy
- [ ] Login realizado no dashboard
- [ ] API Key criada/copiada
- [ ] API Key adicionada no `.env.local`
- [ ] Servidor reiniciado
- [ ] Teste de conexão realizado

---

## 💡 Dicas

1. **Plano Gratuito**: A Pluggy oferece um plano gratuito para testes com limites generosos
2. **Sandbox**: Use o modo sandbox para testar sem conectar contas reais
3. **Múltiplas Keys**: Você pode criar múltiplas API Keys para diferentes projetos
4. **Monitoramento**: Use o dashboard para monitorar o uso da API

---

## 🎉 Pronto!

Agora você tem sua API Key configurada e pode começar a usar a integração Open Finance!





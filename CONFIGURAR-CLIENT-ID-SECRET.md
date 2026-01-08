# 🔑 Configurar Pluggy com Client ID e Client Secret

## ✅ Solução: Usar Client ID e Client Secret

Como a API Key não está disponível no seu plano, vamos usar **Client ID** e **Client Secret** que você já tem na página de Aplicações!

---

## 📋 Passo a Passo

### 1️⃣ Copiar as Credenciais

Na página **"Aplicações"** do dashboard Pluggy, você já vê:

- **Client ID**: `c5fd14a9-f1ac-444c-a208-fcd3d5029e9e`
- **Client Secret**: `3f7db9a7-7d55-4a3f-94be-ce87aa47c788`

**Copie essas duas credenciais!**

---

### 2️⃣ Configurar no `.env.local`

Abra o arquivo `.env.local` na pasta `Sistema-financeiro-main` e adicione:

```env
# Supabase (já existente)
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_supabase_aqui

# Pluggy Open Finance - Client ID e Client Secret
# Copie os valores da página "Aplicações" no dashboard Pluggy
VITE_PLUGGY_CLIENT_ID=c5fd14a9-f1ac-444c-a208-fcd3d5029e9e
VITE_PLUGGY_CLIENT_SECRET=3f7db9a7-7d55-4a3f-94be-ce87aa47c788

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

**⚠️ IMPORTANTE**: 
- Substitua pelos valores reais que você copiou da página "Aplicações"
- Não deixe espaços antes ou depois do `=`
- Os valores devem estar em uma linha só (sem quebras)

---

### 3️⃣ Reiniciar o Servidor

Após adicionar as credenciais:

1. **Pare o servidor** (Ctrl+C no terminal)
2. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

---

## 🔒 Segurança

### ⚠️ IMPORTANTE - Boas Práticas:

1. **Nunca compartilhe** Client ID e Client Secret publicamente
2. **Não commite** o arquivo `.env.local` no Git (já está no `.gitignore`)
3. **Mantenha as credenciais seguras** - elas dão acesso à sua aplicação Pluggy
4. **Revogue e recrie** se suspeitar que foram comprometidas

---

## 🎯 Como Funciona

O sistema agora:

1. **Usa Client ID e Client Secret** para gerar um access token
2. **O access token** é usado para autenticar nas requisições da API Pluggy
3. **O token é renovado automaticamente** quando necessário
4. **Funciona igual** à API Key, mas usando o método OAuth

---

## ✅ Pronto!

Agora você pode usar a integração Pluggy com suas credenciais de aplicação!

---

## 🆘 Problemas Comuns

### "Erro ao gerar access token"

**Solução:**
- Verifique se o Client ID e Client Secret estão corretos
- Verifique se não há espaços antes/depois do `=` no `.env.local`
- Verifique se copiou as credenciais completas
- Reinicie o servidor após adicionar as credenciais

### "Credenciais Pluggy não configuradas"

**Solução:**
- Verifique se adicionou `VITE_PLUGGY_CLIENT_ID` e `VITE_PLUGGY_CLIENT_SECRET`
- Verifique se os nomes das variáveis estão corretos (maiúsculas/minúsculas)
- Reinicie o servidor

---

## 💡 Dica

Se no futuro você conseguir uma API Key, pode adicionar `VITE_PLUGGY_API_KEY` e o sistema usará ela automaticamente (prioridade sobre Client ID/Secret).


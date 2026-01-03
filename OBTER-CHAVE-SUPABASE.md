# 🔑 Como Obter a Chave Anônima do Supabase

## ✅ Problema Resolvido: Project ID Corrigido

O Project ID foi atualizado de `yjtsyuibemnkjfyonfjt` para `qgyjfzsihoxtrvrheqvc` (o correto do seu projeto).

## 📋 Passos para Obter a Chave Anônima

1. **No Supabase Dashboard**, clique em **Settings** (no menu lateral esquerdo)

2. Clique em **API** (na seção CONFIGURATION)

3. Na seção **Project API keys**, encontre a chave **anon public**

4. Clique no botão **👁️ (eye icon)** ou **📋 (copy icon)** para copiar a chave

5. A chave será algo assim:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWpmenNpaG94dHJ2cmhlcXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.XXXXXXXXXXXXX
   ```

## 🔧 Configurar o Projeto

### 1. Criar/Atualizar arquivo `.env.local`

Crie o arquivo `.env.local` na pasta `Sistema-financeiro-main` com o seguinte conteúdo:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_A_CHAVE_ANONIMA_AQUI

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

**Substitua `COLE_A_CHAVE_ANONIMA_AQUI` pela chave que você copiou do dashboard.**

### 2. Reiniciar o Servidor

Após criar/atualizar o `.env.local`, **reinicie o servidor de desenvolvimento**:

```bash
cd Sistema-financeiro-main
npm run dev
```

### 3. Testar o Login

Agora o login deve funcionar! O erro `ERR_NAME_NOT_RESOLVED` deve estar resolvido.

## ✅ Checklist

- [x] Project ID atualizado no código (`qgyjfzsihoxtrvrheqvc`)
- [ ] Obter chave anônima do Supabase Dashboard (Settings → API)
- [ ] Criar arquivo `.env.local` com a URL e chave corretas
- [ ] Reiniciar o servidor (`npm run dev`)
- [ ] Testar o login

## 🆘 Se Ainda Não Funcionar

1. Verifique se copiou a chave completa (ela é bem longa)
2. Verifique se não há espaços extras no `.env.local`
3. Verifique se o servidor foi reiniciado após criar o `.env.local`
4. Limpe o cache do navegador (Ctrl+Shift+R)
5. Verifique o console do navegador para ver se há outros erros


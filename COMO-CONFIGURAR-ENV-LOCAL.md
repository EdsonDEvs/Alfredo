# 🔧 Como Configurar o .env.local - PASSO A PASSO

## ⚠️ Erro Atual: "Invalid API key"

O erro mudou de `ERR_NAME_NOT_RESOLVED` para `Invalid API key`, o que significa que:
- ✅ O Project ID está correto (`qgyjfzsihoxtrvrheqvc`)
- ❌ A chave anônima não está configurada ou está incorreta

## 📋 Passos para Resolver

### 1. Copiar a Chave Anônima Completa

No Supabase Dashboard (Settings → API):
1. Encontre a seção **"anon public"**
2. Clique no botão **"Copy"** (não apenas visualize)
3. A chave é MUITO longa, certifique-se de copiar TODA ela
4. Ela começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` e tem mais de 200 caracteres

### 2. Criar o Arquivo .env.local

**Opção A: Criar manualmente**
1. Na pasta `Sistema-financeiro-main`, crie um arquivo chamado `.env.local`
2. Cole o seguinte conteúdo:

```env
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=COLE_A_CHAVE_COMPLETA_AQUI
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

3. Substitua `COLE_A_CHAVE_COMPLETA_AQUI` pela chave que você copiou
4. **IMPORTANTE**: Não deixe espaços antes ou depois do `=`
5. **IMPORTANTE**: A chave deve estar em uma linha só, sem quebras

**Opção B: Copiar do env.example**
1. Copie o arquivo `env.example` para `.env.local`
2. Edite o `.env.local` e substitua `SUBSTITUA_PELA_CHAVE_ANONIMA_DO_SEU_PROJETO` pela chave real

### 3. Exemplo de .env.local Correto

```env
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWpmenNpaG94dHJ2cmhlcXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.SUA_CHAVE_COMPLETA_AQUI
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

### 4. Reiniciar o Servidor

**CRÍTICO**: Após criar/editar o `.env.local`, você DEVE reiniciar o servidor:

1. Pare o servidor (Ctrl+C no terminal)
2. Inicie novamente:
   ```bash
   cd Sistema-financeiro-main
   npm run dev
   ```

### 5. Verificar se Funcionou

1. Abra o console do navegador (F12)
2. Procure pela mensagem: `🔧 Supabase Config:`
3. Verifique se mostra:
   - `url: ✅ Configurada`
   - `key: ✅ Configurada`
   - `usingEnv: true` (se estiver usando .env.local)

## ✅ Checklist

- [ ] Chave anônima copiada COMPLETAMENTE do Supabase Dashboard
- [ ] Arquivo `.env.local` criado na pasta `Sistema-financeiro-main`
- [ ] Chave colada sem espaços extras
- [ ] Sem quebras de linha na chave
- [ ] Servidor reiniciado após criar/editar o `.env.local`
- [ ] Console mostra `usingEnv: true`

## 🆘 Problemas Comuns

### Erro: "Invalid API key" persiste
- Verifique se copiou a chave COMPLETA (ela é muito longa)
- Verifique se não há espaços antes/depois do `=`
- Verifique se reiniciou o servidor
- Verifique se o arquivo está salvo como `.env.local` (não `.env.local.txt`)

### Erro: "usingEnv: false"
- O arquivo `.env.local` não está sendo lido
- Verifique se está na pasta correta (`Sistema-financeiro-main`)
- Verifique se o nome do arquivo está correto (`.env.local`)
- Reinicie o servidor

### A chave parece truncada
- Use o botão "Copy" no dashboard, não tente copiar manualmente
- A chave deve ter mais de 200 caracteres
- Cole em um editor de texto primeiro para verificar se está completa


# 🚀 Guia Completo de Deploy na Vercel

## 📋 Pré-requisitos

1. ✅ Conta no GitHub (com o repositório já criado)
2. ✅ Conta na Vercel (gratuita)
3. ✅ Projeto Supabase configurado

---

## 🔗 Passo 1: Conectar o Repositório

### 1.1 Acesse a Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login com sua conta GitHub

### 1.2 Importar Projeto
1. Clique em **"Add New..."** → **"Project"**
2. Selecione o repositório **"Alfredo"** (ou seu repositório)
3. Clique em **"Import"**

---

## ⚙️ Passo 2: Configurar o Projeto

### 2.1 Framework Preset
- **Framework Preset:** `Vite` (será detectado automaticamente)
- Se não detectar, selecione **"Other"**

### 2.2 Root Directory ⚠️ IMPORTANTE
- **Root Directory:** `Sistema-financeiro-main`
- Isso é CRUCIAL porque seu projeto está dentro desta pasta

### 2.3 Build Settings
Configure as seguintes opções:

**Build Command:**
```
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```
npm install
```

**Development Command:**
```
npm run dev
```

---

## 🔐 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Acesse Environment Variables
1. No dashboard do projeto, clique em **"Settings"**
2. Vá para **"Environment Variables"**
3. Clique em **"Add New"**

### 3.2 Adicione as Variáveis

**Variável 1 - Supabase URL:**
```
Name: VITE_SUPABASE_URL
Value: https://qgyjfzsihoxtrvrheqvc.supabase.co
Environment: Production, Preview, Development
```

**Variável 2 - Supabase Anon Key:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHN5dWliZW1ua2pmeW9uZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.YTvf5T80OMwhZYgK0vnWULnalBvtGUd68Z2g1LiI0kI
Environment: Production, Preview, Development
```

**Variável 3 - App Name (Opcional):**
```
Name: VITE_APP_NAME
Value: Poupe Agora
Environment: Production, Preview, Development
```

**Variável 4 - App Version (Opcional):**
```
Name: VITE_APP_VERSION
Value: 1.0.0
Environment: Production, Preview, Development
```

### 3.3 Salvar
- Clique em **"Save"** após adicionar cada variável

---

## 🚀 Passo 4: Fazer o Deploy

### 4.1 Deploy Inicial
1. Após configurar tudo, clique em **"Deploy"**
2. Aguarde o build completar (geralmente 2-5 minutos)
3. Você verá o status do deploy em tempo real

### 4.2 Verificar o Deploy
- Se tudo estiver correto, você verá **"Ready"** em verde
- Clique no link fornecido para acessar sua aplicação

---

## 🔧 Passo 5: Configurações Adicionais (Opcional)

### 5.1 Domínio Personalizado
1. Vá em **"Settings"** → **"Domains"**
2. Adicione seu domínio personalizado
3. Siga as instruções de DNS

### 5.2 Configurações de Build Avançadas
Se precisar ajustar algo, vá em:
- **Settings** → **General** → **Build & Development Settings**

---

## 🔄 Passo 6: Atualizar Deploy (Após Mudanças)

### Opção 1: Automático (Recomendado)
- Faça `git push` para o repositório
- A Vercel detecta automaticamente e faz novo deploy

### Opção 2: Manual
1. Vá em **"Deployments"**
2. Clique nos **3 pontos** do último deployment
3. Selecione **"Redeploy"**

---

## ✅ Verificação Pós-Deploy

Após o deploy, verifique:

1. ✅ **Aplicação carrega** sem erros
2. ✅ **Login funciona** com Supabase
3. ✅ **Dashboard mostra dados** corretamente
4. ✅ **Transações aparecem** na lista
5. ✅ **Importação de Excel** funciona
6. ✅ **Sincronização** entre páginas funciona

---

## 🐛 Troubleshooting

### Problema: Build Falha

**Solução:**
1. Verifique os logs do build na Vercel
2. Confirme que o **Root Directory** está correto: `Sistema-financeiro-main`
3. Verifique se todas as dependências estão no `package.json`

### Problema: Variáveis de Ambiente Não Funcionam

**Solução:**
1. Confirme que as variáveis começam com `VITE_`
2. Verifique se estão marcadas para **Production, Preview, Development**
3. Faça um **Redeploy** após adicionar variáveis

### Problema: Erro 404 nas Rotas

**Solução:**
1. Crie um arquivo `vercel.json` na raiz do projeto (dentro de `Sistema-financeiro-main`):

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Problema: Erro de CORS ou Supabase

**Solução:**
1. No Supabase, vá em **Settings** → **API**
2. Adicione a URL da Vercel nas **Allowed Origins**
3. Exemplo: `https://seu-projeto.vercel.app`

---

## 📝 Arquivo vercel.json (Opcional)

Se precisar de configurações customizadas, crie `vercel.json` na raiz do projeto:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🎯 Resumo Rápido

1. **Importar** repositório na Vercel
2. **Root Directory:** `Sistema-financeiro-main`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. **Adicionar variáveis** `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
6. **Deploy!** 🚀

---

## 📞 Suporte

Se tiver problemas:
1. Verifique os logs na Vercel
2. Teste localmente com `npm run build`
3. Confirme que todas as variáveis estão corretas

**Boa sorte com o deploy!** 🎉


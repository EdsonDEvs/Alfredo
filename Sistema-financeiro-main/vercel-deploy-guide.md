# 🚀 Guia de Deploy na Vercel - Sistema Financeiro

## 📋 Configuração das Variáveis de Ambiente

### 1. Acesse o Dashboard da Vercel
- Vá para [vercel.com](https://vercel.com)
- Faça login e acesse seu projeto "ALFREDO - SEU ASSISTENTE FINANCEIRO"

### 2. Configure as Variáveis de Ambiente
- Clique em **"Settings"** no menu lateral
- Vá para a aba **"Environment Variables"**
- Clique em **"Add New"**

### 3. Adicione as Variáveis Obrigatórias

**Variável 1:**
```
Name: VITE_SUPABASE_URL
Value: https://yjtsyuibemnkjfyonfjt.supabase.co
Environment: Production, Preview, Development
```

**Variável 2:**
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHN5dWliZW1ua2pmeW9uZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.YTvf5T80OMwhZYgK0vnWULnalBvtGUd68Zg1LiI0kI
Environment: Production, Preview, Development
```

### 4. Salve e Re-deploy
- Clique em **"Save"**
- Vá para a aba **"Deployments"**
- Clique em **"Redeploy"** no último deployment

## 🔄 Forçar Novo Deploy

### Opção 1: Via Dashboard
1. Vá para **"Deployments"**
2. Clique nos **3 pontos** do último deployment
3. Selecione **"Redeploy"**

### Opção 2: Via Git (Recomendado)
```bash
# Faça uma pequena mudança no código
echo "// Updated: $(date)" >> src/App.tsx

# Commit e push
git add .
git commit -m "fix: force redeploy with updated environment variables"
git push origin main
```

## 🧹 Limpar Cache

### 1. Cache do Navegador
- Pressione **Ctrl + Shift + R** (Windows/Linux)
- Ou **Cmd + Shift + R** (Mac)
- Ou abra em **Modo Incógnito**

### 2. Cache da Vercel
- No dashboard da Vercel, vá em **"Settings"**
- Clique em **"General"**
- Role até **"Build & Development Settings"**
- Clique em **"Clear Build Cache"**

## ✅ Verificação

Após o re-deploy, verifique se:

1. **Login funciona** com Supabase
2. **Categorias hierárquicas** aparecem com ícones
3. **Transações** mostram nomes das categorias
4. **Sistema de perfil** funciona

## 🆘 Se Ainda Não Funcionar

1. **Verifique os logs** no dashboard da Vercel
2. **Teste localmente** com `npm run dev`
3. **Confirme as variáveis** estão corretas
4. **Aguarde alguns minutos** para propagação

---

**💡 Dica:** Sempre teste localmente antes do deploy para garantir que tudo funciona!

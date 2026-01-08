# ✅ Verificar Configuração do .env.local

## 📋 Configuração Correta

Seu arquivo `.env.local` deve ter EXATAMENTE este conteúdo:

```env
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWpmenNpaG94dHJ2cmhlcXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDY3MDUsImV4cCI6MjA3ODM4MjcwNX0.0EdiUK02c90KH_WGV6hIve7m1NgW8eMlD0GsNwZBMrQ
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

## ✅ Checklist

- [ ] Arquivo `.env.local` existe na pasta `Sistema-financeiro-main`
- [ ] URL: `https://qgyjfzsihoxtrvrheqvc.supabase.co`
- [ ] Chave anônima: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (completa, sem espaços)
- [ ] Sem espaços antes ou depois do `=`
- [ ] Sem quebras de linha na chave
- [ ] Arquivo foi salvo (Ctrl+S)

## 🔄 Após Configurar

1. **Salve o arquivo** (Ctrl+S)
2. **Pare o servidor** (Ctrl+C no terminal)
3. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```
4. **Teste o login** no navegador

## 🔍 Verificar se Funcionou

1. Abra o console do navegador (F12)
2. Procure pela mensagem: `🔧 Supabase Config:`
3. Deve mostrar:
   - `url: ✅ Configurada`
   - `key: ✅ Configurada`
   - `usingEnv: true`

Se `usingEnv: false`, o arquivo `.env.local` não está sendo lido.

## 🆘 Problemas Comuns

### usingEnv: false
- Verifique se o arquivo está na pasta correta (`Sistema-financeiro-main`)
- Verifique se o nome está correto (`.env.local`, não `.env.local.txt`)
- Reinicie o servidor após criar/editar o arquivo

### Ainda mostra "Invalid API key"
- Verifique se copiou a chave COMPLETA
- Verifique se não há espaços antes/depois do `=`
- Verifique se a chave está em uma linha só (sem quebras)
- Reinicie o servidor


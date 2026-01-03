# 🔴 SOLUÇÃO DEFINITIVA - BANCO ANTIGO

## Problema
O aplicativo continua criando usuários no banco antigo (`yjtsyuibemnkjfyonfjt`) mesmo após mudanças.

## Solução Implementada

### 1. Código Atualizado
O arquivo `src/lib/supabase.ts` foi atualizado com:
- Storage customizado que detecta e remove sessões do banco antigo
- Verificação automática de URLs antigas no localStorage

### 2. Limpeza Completa Necessária

**PASSO 1: Parar o servidor**
```bash
# Pressione Ctrl+C no terminal
```

**PASSO 2: Limpar build/cache do Vite**
```bash
cd Sistema-financeiro-main
rm -rf node_modules/.vite
rm -rf dist
# No Windows PowerShell:
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

**PASSO 3: Limpar navegador COMPLETAMENTE**

1. **Abra o arquivo `LIMPAR-BANCO-ANTIGO-COMPLETO.html` no navegador**
   - Clique duas vezes no arquivo
   - Clique em "LIMPAR TUDO"
   - Feche TODAS as abas do site

2. **OU manualmente no DevTools:**
   - F12 → Application → Storage
   - Clique em "Clear site data"
   - Application → Service Workers → Unregister todos
   - Application → IndexedDB → Delete todos os bancos que contenham "supabase"

3. **OU via configurações do navegador:**
   - Chrome: Configurações → Privacidade → Limpar dados de navegação
   - Selecione "Todo o período"
   - Marque TUDO
   - Limpar dados

**PASSO 4: Verificar .env.local**
```bash
# Certifique-se de que contém:
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFneWpmenNpaG94dHJ2cmhlcXZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDY3MDUsImV4cCI6MjA3ODM4MjcwNX0.0EdiUK02c90KH_WGV6hIve7m1NgW8eMlD0GsNwZBMrQ
```

**PASSO 5: Reiniciar servidor**
```bash
npm run dev
```

**PASSO 6: Verificar no console**
- Abra F12 → Console
- Deve aparecer: `🔧 Supabase Config:` com `qgyjfzsihoxtrvrheqvc`
- **NÃO** deve aparecer `yjtsyuibemnkjfyonfjt`

## Verificação Final

1. Tente criar um novo usuário
2. Verifique no Supabase (banco novo) se o usuário apareceu
3. No console, verifique que as requisições vão para `qgyjfzsihoxtrvrheqvc.supabase.co`

## Se Ainda Não Funcionar

Execute este comando no PowerShell (como administrador):
```powershell
cd Sistema-financeiro-main
# Limpar tudo
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
# Reinstalar (opcional, só se necessário)
# npm install
# Iniciar servidor
npm run dev
```

E no navegador, use modo anônimo/privado para testar.


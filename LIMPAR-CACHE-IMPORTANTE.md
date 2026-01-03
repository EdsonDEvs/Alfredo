# 🚨 LIMPAR CACHE - IMPORTANTE!

O aplicativo ainda está conectando ao banco antigo devido a cache.

## 🔥 SOLUÇÃO RÁPIDA:

### 1. PARAR O SERVIDOR
- Pressione `Ctrl+C` no terminal onde o servidor está rodando

### 2. LIMPAR CACHE DO NAVEGADOR

**No Chrome/Edge:**
1. Pressione `Ctrl+Shift+Delete`
2. Selecione "Desde sempre" ou "Todo o período"
3. Marque:
   - ✅ Imagens e arquivos em cache
   - ✅ Cookies e outros dados do site
   - ✅ Arquivos e dados armazenados em cache
4. Clique em "Limpar dados"

**OU use o DevTools:**
1. Abra DevTools (F12)
2. Clique com botão direito no botão de atualizar (↻)
3. Selecione "Esvaziar cache e atualizar forçadamente" (Hard Reload)

### 3. DESREGISTRAR SERVICE WORKER

**No Chrome/Edge DevTools:**
1. Abra DevTools (F12)
2. Vá na aba "Application" (Aplicativo)
3. No menu lateral, clique em "Service Workers"
4. Se houver algum service worker registrado, clique em "Unregister"
5. Vá em "Storage" → "Clear site data"
6. Clique em "Clear site data"

### 4. REINICIAR O SERVIDOR

```bash
npm run dev
```

### 5. VERIFICAR NO CONSOLE

Após reiniciar, abra o console (F12) e verifique:
- Deve aparecer: `🔧 Supabase Config:` com URL `qgyjfzsihoxtrvrheqvc.supabase.co`
- **NÃO** deve aparecer `yjtsyuibemnkjfyonfjt.supabase.co`

### 6. TESTAR REGISTRO

Tente criar um novo usuário e verifique no Supabase se aparece na tabela `profiles`.


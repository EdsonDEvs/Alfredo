# 🔧 Solução para Erro "AuthRetryableFetchError: Failed to fetch"

## 📋 Problema Identificado

O erro `AuthRetryableFetchError: Failed to fetch` ocorre quando o Supabase não consegue fazer requisições HTTP para autenticação.

## ✅ Correções Aplicadas

### 1. **Configuração do Cliente Supabase** (`src/lib/supabase.ts`)
- ✅ Adicionadas configurações de autenticação adequadas:
  - `storage`: localStorage para persistência
  - `persistSession`: true
  - `autoRefreshToken`: true
  - `detectSessionInUrl`: true
- ✅ Suporte a variáveis de ambiente

### 2. **Service Worker** (`public/sw.js`)
- ✅ Corrigido para ignorar TODAS as requisições para Supabase (GET, POST, PUT, DELETE)
- ✅ Requisições para `supabase.co` agora passam diretamente sem interceptação

### 3. **Tratamento de Erros** (`src/hooks/useAuth.tsx`)
- ✅ Verificação de conectividade antes de tentar login
- ✅ Mensagens de erro mais claras para problemas de rede

## 🔍 Diagnóstico Adicional

Se o erro persistir, verifique:

### 1. **Conectividade de Rede**
```javascript
// No console do navegador, teste:
fetch('https://yjtsyuibemnkjfyonfjt.supabase.co')
  .then(r => console.log('✅ Conexão OK'))
  .catch(e => console.error('❌ Sem conexão:', e))
```

### 2. **Extensões do Navegador**
- Desative extensões que possam interferir (AdBlock, Privacy Badger, etc.)
- Teste em modo anônimo/privado

### 3. **Service Worker**
- Abra DevTools → Application → Service Workers
- Clique em "Unregister" para remover o Service Worker
- Recarregue a página (Ctrl+Shift+R)

### 4. **Configurações do Supabase**
- Verifique se a URL do projeto está correta
- Verifique se a chave anônima está correta
- No Supabase Dashboard → Settings → API
- Verifique se há restrições de CORS

### 5. **Variáveis de Ambiente**
Crie um arquivo `.env.local` na raiz do projeto (`Sistema-financeiro-main/.env.local`):
```env
VITE_SUPABASE_URL=https://yjtsyuibemnkjfyonfjt.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

**Importante:** Reinicie o servidor de desenvolvimento após criar/modificar o `.env.local`:
```bash
npm run dev
```

### 6. **Cache do Navegador**
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Ou use Ctrl+Shift+R para recarregar sem cache

## 🚀 Próximos Passos

1. **Reinicie o servidor de desenvolvimento**
2. **Limpe o cache do navegador**
3. **Desregistre o Service Worker** (se necessário)
4. **Teste novamente o login**

Se o problema persistir:
- Verifique os logs do console do navegador
- Verifique a aba Network no DevTools para ver se as requisições estão sendo feitas
- Verifique se há erros no console do Supabase


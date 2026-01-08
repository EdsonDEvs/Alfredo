# 🔧 Troubleshooting - Erro de Credenciais Pluggy

## ❌ Erro: "Credenciais Pluggy não configuradas"

Se você está vendo este erro, siga estes passos:

---

## ✅ Checklist de Verificação

### 1️⃣ Verificar se o arquivo `.env.local` existe

O arquivo deve estar na pasta **`Sistema-financeiro-main`** (raiz do projeto).

**Caminho completo:**
```
Sistema-financeiro-main/.env.local
```

### 2️⃣ Verificar o conteúdo do `.env.local`

O arquivo deve ter exatamente este formato:

```env
# Supabase
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_supabase_aqui

# Pluggy Open Finance
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4

# App Configuration
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

**⚠️ IMPORTANTE:**
- ✅ Deve começar com `VITE_` (não apenas `PLUGGY_`)
- ✅ Não pode ter espaços antes ou depois do `=`
- ✅ Os valores devem estar em uma linha só (sem quebras)
- ✅ Não pode ter aspas ao redor dos valores

### 3️⃣ Verificar se o servidor foi reiniciado

Após criar ou modificar o `.env.local`, você **DEVE** reiniciar o servidor:

```bash
# 1. Pare o servidor (Ctrl+C no terminal)
# 2. Reinicie
npm run dev
```

### 4️⃣ Verificar no console do navegador

Abra o console do navegador (F12) e verifique se as variáveis estão sendo carregadas:

```javascript
// Cole no console:
console.log('CLIENT_ID:', import.meta.env.VITE_PLUGGY_CLIENT_ID)
console.log('CLIENT_SECRET:', import.meta.env.VITE_PLUGGY_CLIENT_SECRET)
```

**Se aparecer `undefined`**, as variáveis não estão sendo carregadas.

---

## 🔍 Soluções Comuns

### Problema 1: Arquivo não existe

**Solução:**
1. Crie o arquivo `.env.local` na pasta `Sistema-financeiro-main`
2. Copie o conteúdo do arquivo `env.example`
3. Adicione suas credenciais
4. Salve o arquivo
5. Reinicie o servidor

### Problema 2: Variáveis sem prefixo `VITE_`

**Errado:**
```env
PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

**Correto:**
```env
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

### Problema 3: Espaços extras

**Errado:**
```env
VITE_PLUGGY_CLIENT_ID = 1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET = 4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

**Correto:**
```env
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

### Problema 4: Aspas ao redor dos valores

**Errado:**
```env
VITE_PLUGGY_CLIENT_ID="1b528f19-5d4d-4e3d-81de-e13059f8a1b7"
VITE_PLUGGY_CLIENT_SECRET="4f455019-40c7-44fe-99cc-d2a1b9cc91a4"
```

**Correto:**
```env
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

### Problema 5: Arquivo na pasta errada

O arquivo `.env.local` deve estar na **raiz do projeto**, não em subpastas.

**Estrutura correta:**
```
Sistema-financeiro-main/
  ├── .env.local          ← AQUI
  ├── package.json
  ├── src/
  └── ...
```

### Problema 6: Cache do navegador

**Solução:**
1. Feche completamente o navegador
2. Abra novamente
3. Ou faça um hard refresh: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)

---

## 🧪 Teste Rápido

### Opção 1: Script Automático (Recomendado)

Execute este comando no terminal (na pasta do projeto):

```bash
npm run check:env
```

Este script verifica:
- ✅ Se o arquivo `.env.local` existe
- ✅ Se as variáveis têm o prefixo `VITE_`
- ✅ Se os valores não estão vazios
- ✅ Se há espaços extras ou problemas de formatação

### Opção 2: Verificação Manual

```bash
# Windows PowerShell
Get-Content .env.local | Select-String "VITE_PLUGGY"

# Linux/Mac
grep VITE_PLUGGY .env.local
```

**Resultado esperado:**
```
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4
```

Se não aparecer nada, o arquivo não existe ou as variáveis estão incorretas.

---

## 📝 Exemplo Completo do `.env.local`

```env
# ============================================
# CONFIGURAÇÃO SUPABASE
# ============================================
VITE_SUPABASE_URL=https://qgyjfzsihoxtrvrheqvc.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ============================================
# CONFIGURAÇÃO PLUGGY OPEN FINANCE
# ============================================
# Copie os valores da página "Aplicações" no dashboard Pluggy
VITE_PLUGGY_CLIENT_ID=1b528f19-5d4d-4e3d-81de-e13059f8a1b7
VITE_PLUGGY_CLIENT_SECRET=4f455019-40c7-44fe-99cc-d2a1b9cc91a4

# ============================================
# CONFIGURAÇÃO DO APP
# ============================================
VITE_APP_NAME=Poupe Agora
VITE_APP_VERSION=1.0.0
```

---

## 🆘 Se Nada Funcionar

1. **Verifique o nome do arquivo:**
   - Deve ser exatamente `.env.local` (com o ponto no início)
   - Não pode ser `.env.local.txt` ou `env.local`

2. **Verifique a codificação:**
   - O arquivo deve estar em UTF-8
   - Sem BOM (Byte Order Mark)

3. **Limpe o cache do Vite:**
   ```bash
   # Pare o servidor
   # Delete a pasta node_modules/.vite
   rm -rf node_modules/.vite
   # Ou no Windows:
   rmdir /s node_modules\.vite
   
   # Reinicie o servidor
   npm run dev
   ```

4. **Verifique os logs do servidor:**
   - O Vite deve mostrar as variáveis carregadas ao iniciar
   - Procure por mensagens de erro relacionadas a `.env`

---

## ✅ Confirmação de Sucesso

Quando estiver funcionando, você verá:
- ✅ Nenhum erro no console
- ✅ O botão "Conectar Conta Bancária" funciona
- ✅ O pop-up da Pluggy abre corretamente

---

## 📞 Ainda com Problemas?

Se após seguir todos os passos o erro persistir:
1. Verifique se copiou as credenciais corretas do dashboard Pluggy
2. Verifique se sua conta Pluggy está ativa
3. Tente criar uma nova aplicação no dashboard Pluggy e use as novas credenciais


# 📦 Como Usar NPM no Projeto Alfredo

## ✅ SOLUÇÃO AUTOMÁTICA (Recomendado)

A função `npm` no seu perfil do PowerShell **já está configurada** para navegar automaticamente!

### ⚠️ Importante: Recarregue o Perfil

Se você acabou de abrir o PowerShell ou ainda não recarregou o perfil, execute:

```powershell
. $PROFILE
```

Depois disso, você pode usar `npm` normalmente na raiz:

```powershell
cd C:\Users\EdsonLeandro\Documents\Github\Alfredo
npm install      # ✅ Funciona automaticamente!
npm run dev      # ✅ Funciona automaticamente!
```

A função detecta que você está na raiz e navega para `Sistema-financeiro-main/` automaticamente.

---

## 🚀 Outras Formas de Usar

### Opção 1: Scripts na Raiz

**PowerShell:**
```powershell
.\npm.ps1 install
.\npm.ps1 run dev
.\npm.ps1 run build
```

**CMD:**
```cmd
npm.bat install
npm.bat run dev
npm.bat run build
```

### Opção 2: Navegar Manualmente

```powershell
cd Sistema-financeiro-main
npm install
npm run dev
```

### Opção 3: Usar a Função `alfredo`

```powershell
alfredo          # Navega para o projeto
npm install      # Agora funciona normalmente
npm run dev
```

---

## 🔍 Verificando se Está Funcionando

Execute na raiz do projeto:

```powershell
cd C:\Users\EdsonLeandro\Documents\Github\Alfredo
npm --version
```

Se você ver a mensagem "Navegando para o diretório do projeto..." seguida da versão, está funcionando! ✅

---

## 📋 Comandos Mais Usados

```powershell
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Verificar vulnerabilidades
npm audit

# Corrigir vulnerabilidades
npm audit fix

# Linting
npm run lint
```

---

## 🐛 Solução de Problemas

### Problema: "Could not read package.json"
**Causa:** Você está no diretório errado  
**Solução:** Recarregue o perfil (`. $PROFILE`) ou use `.\npm.ps1`

### Problema: Função npm não funciona
**Causa:** Perfil não foi carregado  
**Solução:** Execute `. $PROFILE` ou reinicie o PowerShell

### Problema: Script npm.ps1 não executa
**Causa:** Política de execução do PowerShell  
**Solução:** Use `npm.bat` (CMD) ou execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 💡 Dica Pro

Adicione ao seu perfil do PowerShell para sempre recarregar automaticamente:

```powershell
# No final do $PROFILE
. $PROFILE
```

Ou configure o PowerShell para executar o perfil automaticamente nas novas sessões (já está configurado por padrão).

---

## 📁 Estrutura do Projeto

```
Alfredo/                          ← Você pode usar npm aqui (com perfil carregado)
├── Sistema-financeiro-main/      ← Ou aqui (diretório do projeto)
│   ├── package.json              ← package.json está aqui
│   ├── src/
│   └── ...
├── npm.ps1                       ← Script PowerShell
├── npm.bat                       ← Script CMD
└── go-to-project.ps1             ← Script para navegar
```

---

**Lembre-se:** Sempre que abrir uma nova sessão do PowerShell, recarregue o perfil com `. $PROFILE` ou simplesmente reinicie o PowerShell!


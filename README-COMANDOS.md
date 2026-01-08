# 📋 Guia de Comandos - Projeto Alfredo

## ⚠️ Importante
O `package.json` está localizado em `Sistema-financeiro-main/`, não na raiz do projeto!

## 🚀 Formas de Executar Comandos NPM

### Opção 1: Scripts na Raiz (Recomendado)
Execute os scripts da raiz do projeto:

**PowerShell:**
```powershell
# Navegar para o projeto e executar comandos
.\npm.ps1 install
.\npm.ps1 run dev
.\npm.ps1 run build

# Ou apenas navegar
.\go-to-project.ps1
```

**CMD (Prompt de Comando):**
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

### Opção 3: Função do PowerShell (após recarregar perfil)
```powershell
# Carregar perfil (se ainda não carregado)
. $PROFILE

# Navegar rapidamente
alfredo

# Ou usar o comando completo
cd-alfredo
```

## 📝 Comandos Úteis

### Desenvolvimento
```powershell
.\npm.ps1 run dev          # Iniciar servidor de desenvolvimento
.\npm.ps1 run build        # Criar build de produção
.\npm.ps1 run preview      # Preview do build
```

### Dependências
```powershell
.\npm.ps1 install          # Instalar dependências
.\npm.ps1 install [pkg]    # Instalar pacote específico
.\npm.ps1 audit            # Verificar vulnerabilidades
.\npm.ps1 audit fix        # Corrigir vulnerabilidades
```

### Linting
```powershell
.\npm.ps1 run lint         # Executar linter
```

## 🔧 Solução de Problemas

### Erro: "Could not read package.json"
- **Causa**: Você está no diretório errado
- **Solução**: Use os scripts da raiz (`.\npm.ps1`) ou navegue para `Sistema-financeiro-main/`

### Erro: "npm.ps1 cannot be loaded"
- **Causa**: Política de execução do PowerShell
- **Solução**: Use `npm.bat` (CMD) ou execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`

### Função `alfredo` não funciona
- **Causa**: Perfil do PowerShell não foi carregado
- **Solução**: Execute `. $PROFILE` ou reinicie o PowerShell

## 📁 Estrutura do Projeto
```
Alfredo/
├── Sistema-financeiro-main/    ← AQUI está o package.json
│   ├── package.json
│   ├── src/
│   └── ...
├── npm.ps1                     ← Script PowerShell
├── npm.bat                     ← Script CMD
└── go-to-project.ps1          ← Script para navegar
```

## 💡 Dica
Para sempre usar npm no diretório correto, use os scripts `npm.ps1` ou `npm.bat` da raiz do projeto!


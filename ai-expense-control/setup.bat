@echo off
echo =====================================================
echo    IA de Controle de Gastos - Setup Automático
echo =====================================================
echo.

echo [1/5] Verificando Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js não encontrado!
    echo Por favor, instale o Node.js 16+ em: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js encontrado

echo.
echo [2/5] Instalando dependências...
npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)
echo ✅ Dependências instaladas

echo.
echo [3/5] Criando diretórios...
if not exist "uploads" mkdir uploads
if not exist "logs" mkdir logs
echo ✅ Diretórios criados

echo.
echo [4/5] Configurando arquivo de ambiente...
if not exist ".env" (
    copy "env.example" ".env"
    echo ✅ Arquivo .env criado
    echo.
    echo ⚠️  IMPORTANTE: Configure o arquivo .env com suas credenciais!
    echo.
) else (
    echo ✅ Arquivo .env já existe
)

echo.
echo [5/5] Verificando configuração...
if not exist ".env" (
    echo ❌ Arquivo .env não encontrado!
    pause
    exit /b 1
)

echo.
echo =====================================================
echo    ✅ Setup concluído com sucesso!
echo =====================================================
echo.
echo 📋 Próximos passos:
echo 1. Configure o arquivo .env com suas credenciais
echo 2. Execute: npm run dev
echo 3. Acesse: http://localhost:3001
echo.
echo 📚 Documentação: README.md
echo.
pause

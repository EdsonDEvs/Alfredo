@echo off
echo ========================================
echo    DEPLOY PARA GITHUB - POUPE AGORA
echo ========================================
echo.

echo 1. Verificando se o Git esta instalado...
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Git nao esta instalado ou nao esta no PATH
    echo Por favor, instale o Git em: https://git-scm.com/
    pause
    exit /b 1
)
echo ✓ Git encontrado!

echo.
echo 2. Inicializando repositorio Git...
if not exist .git (
    git init
    echo ✓ Repositorio Git inicializado
) else (
    echo ✓ Repositorio Git ja existe
)

echo.
echo 3. Adicionando arquivos...
git add .
echo ✓ Arquivos adicionados

echo.
echo 4. Fazendo commit inicial...
git commit -m "feat: Sistema financeiro completo com Firebase

- Dashboard com graficos e estatisticas
- Gerenciamento de transacoes (CRUD)
- Sistema de categorias personalizaveis
- Lembretes de contas e compromissos
- Autenticacao com Firebase (Email/Google)
- Interface responsiva com Shadcn/ui
- Relatorios e exportacao PDF
- Migracao completa do Supabase para Firebase"
echo ✓ Commit realizado

echo.
echo 5. Configurando remote origin...
git remote add origin https://github.com/apoloodev/Sistema-financeiro.git 2>nul
if %errorlevel% neq 0 (
    echo ✓ Remote origin ja configurado
) else (
    echo ✓ Remote origin configurado
)

echo.
echo 6. Enviando para o GitHub...
git push -u origin main
if %errorlevel% neq 0 (
    echo Tentando com branch master...
    git push -u origin master
)

echo.
echo ========================================
echo    DEPLOY CONCLUIDO!
echo ========================================
echo.
echo Seu projeto esta disponivel em:
echo https://github.com/apoloodev/Sistema-financeiro
echo.
echo Para fazer deploy:
echo 1. Vercel: https://vercel.com (recomendado)
echo 2. Netlify: https://netlify.com
echo.
pause


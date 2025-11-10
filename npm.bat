@echo off
REM Script batch para executar npm no diretorio correto do projeto
REM Uso: npm.bat [comando npm]
REM Exemplo: npm.bat install
REM Exemplo: npm.bat run dev

cd /d "%~dp0Sistema-financeiro-main"
if not exist package.json (
    echo Erro: package.json nao encontrado!
    pause
    exit /b 1
)

call npm.cmd %*


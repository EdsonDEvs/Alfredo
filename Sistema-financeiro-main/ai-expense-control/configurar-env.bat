@echo off
echo =====================================================
echo    CONFIGURADOR DE ARQUIVO .ENV
echo =====================================================
echo.

echo [1/3] Copiando env.example para .env...
copy "env.example" ".env" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Arquivo .env criado com sucesso!
) else (
    echo ❌ Erro ao criar arquivo .env
    pause
    exit /b 1
)

echo.
echo [2/3] Abrindo arquivo .env para edição...
echo.
echo ⚠️  IMPORTANTE: Configure as seguintes variáveis no arquivo .env:
echo.
echo   1. FIREBASE_PROJECT_ID - ID do seu projeto Firebase
echo   2. FIREBASE_PRIVATE_KEY - Chave privada do Firebase (formatação especial)
echo   3. FIREBASE_CLIENT_EMAIL - Email da conta de serviço do Firebase
echo   4. OPENAI_API_KEY - Chave da API OpenAI (opcional)
echo   5. N8N_WEBHOOK_URL - URL do webhook do n8n (opcional)
echo.
echo 📋 INSTRUÇÕES PARA A CHAVE PRIVADA:
echo   - A chave deve estar em uma única linha
echo   - Use \\n para quebras de linha
echo   - Mantenha as aspas duplas
echo   - Exemplo: FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIICXgIBAAKCAQEAt...\\n-----END PRIVATE KEY-----\\n"
echo.

notepad .env

echo.
echo [3/3] Verificando configuração...
if exist ".env" (
    echo ✅ Arquivo .env configurado!
    echo.
    echo 🚀 Para testar o sistema, execute:
    echo    npm run dev
) else (
    echo ❌ Arquivo .env não encontrado!
)

echo.
echo =====================================================
echo    CONFIGURAÇÃO CONCLUÍDA!
echo =====================================================
pause

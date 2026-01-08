@echo off
echo 🚀 Deployando no Firebase Functions...
echo.

echo 📋 Passos para deploy:
echo 1. Fazer login no Firebase (se necessário)
echo 2. Configurar variáveis de ambiente
echo 3. Fazer deploy das functions
echo.

echo 🔧 Configurando variáveis de ambiente...
echo.
echo ⚠️  IMPORTANTE: Configure as seguintes variáveis no Firebase Console:
echo    - OPENAI_API_KEY
echo    - N8N_WEBHOOK_URL (opcional)
echo    - WHATSAPP_VERIFY_TOKEN
echo.

echo 📍 Para configurar variáveis:
echo 1. Acesse: https://console.firebase.google.com
echo 2. Selecione seu projeto
echo 3. Vá para Functions > Configurações
echo 4. Adicione as variáveis de ambiente
echo.

echo 🚀 Iniciando deploy...
firebase deploy --only functions

echo.
echo ✅ Deploy concluído!
echo.
echo 📱 URLs dos endpoints:
echo - Health: https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/health
echo - WhatsApp Webhook: https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/whatsapp/webhook
echo - Processar Texto: https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/ingest/text
echo - Processar Foto: https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/ingest/photo
echo - Processar Áudio: https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/ingest/audio
echo.

pause

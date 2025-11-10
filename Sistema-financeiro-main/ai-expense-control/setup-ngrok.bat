@echo off
echo 🚀 Configurando ngrok para testes do WhatsApp...

echo.
echo 📋 Passos para configurar ngrok:
echo 1. Baixe ngrok em: https://ngrok.com/download
echo 2. Extraia o arquivo ngrok.exe para esta pasta
echo 3. Execute: ngrok http 3001
echo 4. Copie a URL HTTPS gerada (ex: https://abc123.ngrok.io)
echo 5. Use essa URL + /api/whatsapp/webhook no Meta for Developers
echo.

echo 🔗 Exemplo de URL para o webhook:
echo https://abc123.ngrok.io/api/whatsapp/webhook
echo.

echo ⚠️  IMPORTANTE:
echo - A URL do ngrok muda a cada reinicialização
echo - Use apenas para testes
echo - Para produção, use um domínio real
echo.

pause

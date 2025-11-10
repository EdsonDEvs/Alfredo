@echo off
echo =====================================================
echo CONFIGURANDO FIREBASE
echo =====================================================

echo Copiando arquivo de exemplo...
copy env.firebase.example .env.local

echo.
echo =====================================================
echo ARQUIVO .env.local CRIADO!
echo =====================================================
echo.
echo Agora você precisa:
echo 1. Acessar: https://console.firebase.google.com/
echo 2. Criar um projeto ou selecionar um existente
echo 3. Ir em "Configurações do Projeto" (icone de engrenagem)
echo 4. Clicar em "Adicionar app" e escolher "Web"
echo 5. Copiar as credenciais do objeto firebaseConfig
echo 6. Editar o arquivo .env.local e substituir os valores
echo.
echo Pressione qualquer tecla para abrir o arquivo .env.local...
pause > nul

notepad .env.local

echo.
echo =====================================================
echo CONFIGURAÇÃO CONCLUÍDA!
echo =====================================================
echo.
echo Agora reinicie o servidor de desenvolvimento:
echo npm run dev
echo.
pause

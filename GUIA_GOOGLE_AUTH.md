# 🔐 Guia para Configurar Login com Google no Firebase

## Passo 1: Acessar o Firebase Console
1. Vá para: https://console.firebase.google.com/
2. Selecione seu projeto: `alfredo-dc71e`

## Passo 2: Habilitar Autenticação com Google
1. No menu lateral, clique em **"Authentication"**
2. Clique na aba **"Sign-in method"**
3. Procure por **"Google"** na lista de provedores
4. Clique em **"Google"** para configurar

## Passo 3: Configurar o Google
1. Clique no botão **"Enable"** (Habilitar)
2. Em **"Project support email"**, selecione seu email
3. Clique em **"Save"** (Salvar)

## Passo 4: Configurar Domínios Autorizados (Opcional)
1. Na aba **"Settings"** da Authentication
2. Role até **"Authorized domains"**
3. Adicione: `localhost` (para desenvolvimento)
4. Se tiver um domínio de produção, adicione também

## Passo 5: Testar
1. Volte para sua aplicação
2. Acesse: http://localhost:8080/auth
3. Clique no botão **"Continuar com Google"**
4. Faça login com sua conta Google

## ⚠️ Importante
- O login com Google só funcionará após habilitar no Firebase Console
- Se der erro, verifique se o Google está habilitado na aba "Sign-in method"
- Para produção, adicione seu domínio real na lista de domínios autorizados

## 🎯 Resultado Esperado
Após configurar, você poderá:
- Fazer login com qualquer conta Google
- O perfil será criado automaticamente no Firestore
- Acessar o dashboard normalmente

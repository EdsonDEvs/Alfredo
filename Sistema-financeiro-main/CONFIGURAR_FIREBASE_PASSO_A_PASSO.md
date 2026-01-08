# 🔥 Configurar Firebase - Passo a Passo

## 📋 **Passo 1: Criar Projeto no Firebase**

### 1.1 Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Faça login com sua conta Google

### 1.2 Criar Novo Projeto
- Clique em **"Criar um projeto"**
- Digite o nome: `alfredo-financeiro` (ou outro nome)
- Clique em **"Continuar"**
- Desative o Google Analytics (opcional)
- Clique em **"Criar projeto"**

## 🔧 **Passo 2: Configurar Authentication**

### 2.1 Ativar Authentication
- No menu lateral, clique em **"Authentication"**
- Clique em **"Começar"**
- Clique na aba **"Sign-in method"**

### 2.2 Configurar Email/Senha
- Clique em **"Email/Senha"**
- Ative **"Habilitar"**
- Clique em **"Salvar"**

## 🗄️ **Passo 3: Configurar Firestore Database**

### 3.1 Criar Banco de Dados
- No menu lateral, clique em **"Firestore Database"**
- Clique em **"Criar banco de dados"**
- Escolha **"Modo de teste"** (para desenvolvimento)
- Selecione localização: **"us-central1"**
- Clique em **"Próximo"**

### 3.2 Configurar Regras de Segurança
- Na aba **"Regras"**, substitua o conteúdo por:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

- Clique em **"Publicar"**

## 📱 **Passo 4: Adicionar App Web**

### 4.1 Configurar App Web
- Clique no ícone de engrenagem ⚙️ (Configurações do Projeto)
- Clique em **"Adicionar app"**
- Escolha o ícone **"Web"** (</>)
- Digite o nome: `alfredo-web`
- Clique em **"Registrar app"**

### 4.2 Copiar Credenciais
Você verá um código como este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

**Copie essas credenciais!**

## ⚙️ **Passo 5: Configurar Variáveis de Ambiente**

### 5.1 Criar Arquivo .env.local
Execute o script que criamos:
```bash
setup_firebase.bat
```

### 5.2 Editar Credenciais
No arquivo `.env.local`, substitua os valores:

```env
VITE_FIREBASE_API_KEY=AIzaSyC... (sua api key real)
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

## 🧪 **Passo 6: Testar Autenticação**

### 6.1 Reiniciar Servidor
```bash
npm run dev
```

### 6.2 Criar Usuário de Teste
- Acesse: http://localhost:8080
- Clique em **"Registrar"**
- Crie uma conta com email e senha
- Faça login

### 6.3 Verificar no Firebase Console
- Vá em **"Authentication"** > **"Users"**
- Você deve ver seu usuário criado

## ✅ **Resultado Esperado**

Após configurar tudo:
- ✅ Login/Registro funcionando
- ✅ Dashboard carregando dados reais
- ✅ Usuário aparecendo no Firebase Console
- ✅ Dados sendo salvos no Firestore

## 🚨 **Problemas Comuns**

### Erro: "Firebase App named '[DEFAULT]' already exists"
- Reinicie o servidor: `npm run dev`

### Erro: "Permission denied"
- Verifique se as regras do Firestore estão publicadas
- Confirme que Authentication está ativado

### Erro: "Invalid API key"
- Verifique se as credenciais no `.env.local` estão corretas
- Confirme que o arquivo `.env.local` existe

## 🎉 **Pronto!**

Agora você tem autenticação real funcionando com Firebase!

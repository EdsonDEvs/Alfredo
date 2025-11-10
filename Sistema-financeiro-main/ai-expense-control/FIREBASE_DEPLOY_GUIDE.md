# 🚀 Guia de Deploy no Firebase Functions

## 📋 Pré-requisitos

1. **Conta no Firebase** (gratuita)
2. **Projeto Firebase** criado
3. **Firebase CLI** instalado
4. **Node.js 18+** instalado

## 🔧 Configuração Inicial

### 1. Fazer Login no Firebase
```bash
firebase login
```

### 2. Inicializar o Projeto (se necessário)
```bash
firebase init
```

## 📦 Estrutura do Projeto

```
ai-expense-control/
├── firebase.json          # Configuração do Firebase
├── functions/
│   ├── package.json       # Dependências das functions
│   └── index.js          # Código das functions
└── deploy-firebase.bat   # Script de deploy
```

## 🔑 Configurar Variáveis de Ambiente

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com
- Selecione seu projeto

### 2. Configure as Variáveis
- Vá para **Functions** > **Configurações**
- Clique em **Variáveis de ambiente**
- Adicione as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `OPENAI_API_KEY` | Chave da API do OpenAI | `sk-...` |
| `N8N_WEBHOOK_URL` | URL do webhook do n8n (opcional) | `https://...` |
| `WHATSAPP_VERIFY_TOKEN` | Token de verificação do WhatsApp | `SantosDrumont` |

## 🚀 Deploy

### Opção 1: Usar o Script Automático
```bash
deploy-firebase.bat
```

### Opção 2: Deploy Manual
```bash
firebase deploy --only functions
```

## 📱 URLs dos Endpoints

Após o deploy, você terá as seguintes URLs:

### Base URL
```
https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl
```

### Endpoints Disponíveis

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/health` | GET | Verificar status do serviço |
| `/ingest/text` | POST | Processar mensagem de texto |
| `/ingest/photo` | POST | Processar foto (OCR) |
| `/ingest/audio` | POST | Processar áudio (STT) |
| `/whatsapp/webhook` | GET | Verificação do webhook WhatsApp |
| `/whatsapp/webhook` | POST | Receber mensagens do WhatsApp |

## 🔧 Configurar WhatsApp

### 1. No Meta for Developers
- **URL de callback**: `https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/whatsapp/webhook`
- **Verificar token**: `SantosDrumont` (ou o que você configurou)

### 2. Testar o Webhook
```bash
curl "https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=SantosDrumont&hub.challenge=teste123"
```

## 🧪 Testar o Sistema

### 1. Health Check
```bash
curl "https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/health"
```

### 2. Processar Texto
```bash
curl -X POST "https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/ingest/text" \
  -H "Content-Type: application/json" \
  -d '{"text": "Gastei R$ 50 no mercado hoje", "userId": "teste"}'
```

### 3. Processar Foto
```bash
curl -X POST "https://us-central1-SEU_PROJETO.cloudfunctions.net/aiExpenseControl/ingest/photo" \
  -F "image=@comprovante.jpg" \
  -F "userId=teste"
```

## 📊 Monitoramento

### 1. Logs das Functions
```bash
firebase functions:log
```

### 2. Firebase Console
- Vá para **Functions** > **Logs**
- Veja os logs em tempo real

### 3. Métricas
- **Functions** > **Uso**
- Monitore execuções, erros, latência

## 🔒 Segurança

### 1. Regras do Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /transacoes/{document} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userid;
    }
  }
}
```

### 2. CORS
- Configurado para aceitar requisições de qualquer origem
- Para produção, configure origens específicas

## 💰 Custos

### Firebase Functions (Gratuito)
- **2 milhões de invocações/mês**
- **400.000 GB-segundos/mês**
- **200.000 CPU-segundos/mês**

### Firestore (Gratuito)
- **1 GB de armazenamento**
- **50.000 leituras/dia**
- **20.000 escritas/dia**

## 🛠️ Solução de Problemas

### Erro: "Function failed to load"
- Verifique se todas as dependências estão instaladas
- Verifique se o Node.js está na versão 18+

### Erro: "Timeout"
- Functions têm timeout de 60 segundos (gratuito)
- Para processamento longo, considere usar Cloud Run

### Erro: "Memory limit exceeded"
- Limite gratuito: 256 MB
- Para processamento pesado, considere upgrade

## 📞 Suporte

- [Documentação Firebase Functions](https://firebase.google.com/docs/functions)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase CLI](https://firebase.google.com/docs/cli)

## 🎯 Próximos Passos

1. ✅ Deploy no Firebase Functions
2. 🔧 Configurar variáveis de ambiente
3. 📱 Configurar webhook do WhatsApp
4. 🧪 Testar todos os endpoints
5. 📊 Monitorar logs e performance
6. 🔒 Configurar regras de segurança
7. �� Usar em produção!

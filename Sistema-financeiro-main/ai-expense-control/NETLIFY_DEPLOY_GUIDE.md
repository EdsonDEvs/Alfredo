# 🚀 Deploy no Netlify - Guia Completo

## 🌟 **Por que Netlify?**

✅ **100% Gratuito** (sem cartão de crédito)  
✅ **Deploy automático**  
✅ **HTTPS automático**  
✅ **Mais simples que Firebase**  
✅ **Functions serverless**  

## 📋 **Pré-requisitos**

1. **Conta no Netlify** (gratuita)
2. **Conta no GitHub** (para conectar o repositório)
3. **Projeto no GitHub** (com o código)

## 🔧 **Passo a Passo**

### **1. Preparar o Repositório**

Certifique-se de que seu projeto está no GitHub com a seguinte estrutura:

```
ai-expense-control/
├── netlify.toml          # Configuração do Netlify
├── public/
│   └── index.html        # Página inicial
├── functions/
│   ├── package.json      # Dependências
│   └── aiExpenseControl.js # Código das functions
└── README.md
```

### **2. Fazer Push para GitHub**

```bash
git add .
git commit -m "Preparando para deploy no Netlify"
git push origin main
```

### **3. Conectar ao Netlify**

1. **Acesse**: https://app.netlify.com/
2. **Faça login** (pode usar GitHub)
3. **Clique em "New site from Git"**
4. **Selecione GitHub**
5. **Escolha seu repositório**
6. **Configure o deploy**:
   - **Build command**: `npm install` (ou deixe vazio)
   - **Publish directory**: `public`
   - **Functions directory**: `functions`

### **4. Configurar Variáveis de Ambiente**

No painel do Netlify:

1. Vá para **Site settings** > **Environment variables**
2. Adicione as seguintes variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `OPENAI_API_KEY` | Chave da API do OpenAI | `sk-...` |
| `N8N_WEBHOOK_URL` | URL do webhook do n8n (opcional) | `https://...` |
| `WHATSAPP_VERIFY_TOKEN` | Token de verificação do WhatsApp | `SantosDrumont` |

### **5. Configurar Firebase**

Para conectar ao Firebase, você precisa:

1. **Baixar a chave de serviço** do Firebase Console
2. **Converter para base64** e adicionar como variável de ambiente
3. **Ou usar variáveis de ambiente** do Firebase

**Opção 1: Chave de Serviço**
```bash
# Converter arquivo JSON para base64
base64 -i firebase-service-account.json
```

Adicione como variável: `FIREBASE_SERVICE_ACCOUNT_BASE64`

**Opção 2: Variáveis Individuais**
```
FIREBASE_PROJECT_ID=seu-projeto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@seu-projeto.iam.gserviceaccount.com
```

## 🚀 **Deploy Automático**

Após conectar o GitHub, o Netlify fará deploy automático sempre que você fizer push!

### **URLs Geradas**

- **Site**: `https://seu-site.netlify.app`
- **Functions**: `https://seu-site.netlify.app/.netlify/functions/aiExpenseControl`

### **Endpoints Disponíveis**

| Endpoint | URL |
|----------|-----|
| Health Check | `/.netlify/functions/aiExpenseControl/health` |
| WhatsApp Webhook | `/.netlify/functions/aiExpenseControl/whatsapp/webhook` |
| Processar Texto | `/.netlify/functions/aiExpenseControl/ingest/text` |
| Processar Foto | `/.netlify/functions/aiExpenseControl/ingest/photo` |
| Processar Áudio | `/.netlify/functions/aiExpenseControl/ingest/audio` |

## 📱 **Configurar WhatsApp**

### **1. No Meta for Developers**

- **URL de callback**: `https://seu-site.netlify.app/.netlify/functions/aiExpenseControl/whatsapp/webhook`
- **Verificar token**: `SantosDrumont`

### **2. Testar Webhook**

```bash
curl "https://seu-site.netlify.app/.netlify/functions/aiExpenseControl/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=SantosDrumont&hub.challenge=teste123"
```

## 🧪 **Testar o Sistema**

### **1. Health Check**
```bash
curl "https://seu-site.netlify.app/.netlify/functions/aiExpenseControl/health"
```

### **2. Processar Texto**
```bash
curl -X POST "https://seu-site.netlify.app/.netlify/functions/aiExpenseControl/ingest/text" \
  -H "Content-Type: application/json" \
  -d '{"text": "Gastei R$ 50 no mercado hoje", "userId": "teste"}'
```

### **3. Interface Web**

Acesse: `https://seu-site.netlify.app`

## 📊 **Monitoramento**

### **1. Logs das Functions**
- Vá para **Functions** no painel do Netlify
- Clique em **View function logs**

### **2. Métricas**
- **Analytics** > **Functions**
- Veja invocações, erros, latência

### **3. Deploy Status**
- **Deploys** > Veja histórico de deploys
- **Functions** > Status das functions

## 🔒 **Segurança**

### **1. Variáveis de Ambiente**
- Nunca commite chaves no código
- Use variáveis de ambiente do Netlify

### **2. CORS**
- Configurado para aceitar requisições de qualquer origem
- Para produção, configure origens específicas

### **3. Rate Limiting**
- Netlify tem limites automáticos
- Gratuito: 125.000 invocações/mês

## 💰 **Custos**

### **Netlify (Gratuito)**
- **100 GB de bandwidth/mês**
- **125.000 function invocations/mês**
- **300 build minutes/mês**
- **Sem cobrança automática**

### **Firebase (Gratuito)**
- **1 GB de armazenamento**
- **50.000 leituras/dia**
- **20.000 escritas/dia**

## 🛠️ **Solução de Problemas**

### **Erro: "Function not found"**
- Verifique se o arquivo está em `functions/`
- Verifique se o nome do arquivo está correto

### **Erro: "Environment variable not found"**
- Verifique se as variáveis estão configuradas no Netlify
- Faça um novo deploy após adicionar variáveis

### **Erro: "Firebase connection failed"**
- Verifique as credenciais do Firebase
- Teste localmente primeiro

### **Erro: "Timeout"**
- Functions têm timeout de 10 segundos (gratuito)
- Para processamento longo, considere upgrade

## 📞 **Suporte**

- [Documentação Netlify](https://docs.netlify.com/)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Netlify Community](https://community.netlify.com/)

## 🎯 **Próximos Passos**

1. ✅ Fazer push para GitHub
2. 🔗 Conectar ao Netlify
3. 🔧 Configurar variáveis de ambiente
4. 📱 Configurar webhook do WhatsApp
5. 🧪 Testar todos os endpoints
6. 📊 Monitorar logs e performance
7. 🚀 Usar em produção!

## 🎉 **Vantagens do Netlify**

- **Mais simples** que Firebase
- **Gratuito** sem cartão de crédito
- **Deploy automático** do GitHub
- **HTTPS automático**
- **CDN global**
- **Interface amigável**
- **Logs detalhados**
- **Rollback fácil**

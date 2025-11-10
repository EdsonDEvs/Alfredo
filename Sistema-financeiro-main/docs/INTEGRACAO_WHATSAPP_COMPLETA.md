# 📱 Integração WhatsApp Completa - Alfredo

## 🎯 **Visão Geral**

Este documento explica como integrar o WhatsApp com o Alfredo através do n8n, permitindo:

- ✅ **Criação de conta via WhatsApp**
- ✅ **Envio de comprovantes por foto**
- ✅ **Registro de transações por áudio**
- ✅ **Processamento automático com IA**
- ✅ **Integração completa com Firebase e Asaas**

## 🔄 **Fluxos Principais**

### **1. Criação de Conta via WhatsApp**
```
Usuário → WhatsApp → n8n → Firebase → Asaas → Pagamento
```

### **2. Processamento de Comprovantes**
```
Foto/Audio → WhatsApp → n8n → IA (OCR/STT) → Firebase → Confirmação
```

## 📋 **Workflows Disponíveis**

| Workflow | Endpoint | Função |
|----------|----------|--------|
| `alfredo-whatsapp-integration.json` | `/webhook/alfredo-whatsapp-webhook` | Criação de conta e onboarding |
| `alfredo-media-processing.json` | `/webhook/alfredo-media-webhook` | Processamento de mídia |
| `alfredo-user-creation.json` | `/webhook/alfredo-user-creation` | Criação via web |
| `alfredo-payment-confirmation.json` | `/webhook/alfredo-payment-confirmation` | Confirmação pagamento |

## 🚀 **Setup Rápido**

### **1. Configurar WhatsApp Business API**

```bash
# Variáveis necessárias
WHATSAPP_ACCESS_TOKEN=seu_token_aqui
WHATSAPP_PHONE_NUMBER_ID=seu_phone_id
OPENAI_API_KEY=sua_chave_openai
```

### **2. Importar Workflows**

1. Acesse `http://localhost:5678`
2. Vá em **Workflows** > **Import from File**
3. Importe os arquivos da pasta `workflows/`
4. Configure as variáveis de ambiente

### **3. Configurar Webhooks do WhatsApp**

No painel do WhatsApp Business API:
- **URL Principal**: `https://seu-n8n.com/webhook/alfredo-whatsapp-webhook`
- **URL Mídia**: `https://seu-n8n.com/webhook/alfredo-media-webhook`

## 💬 **Fluxo de Criação de Conta**

### **Conversa Exemplo**

```
Usuário: "criar conta"

Alfredo: "Olá! 👋

Vou te ajudar a criar sua conta no Alfredo!

Para começar, me diga seu nome completo:"

Usuário: "João Silva"

Alfredo: "Perfeito! Agora me informe seu email:"

Usuário: "joao@email.com"

Alfredo: "Ótimo! Agora crie uma senha (mínimo 6 caracteres):"

Usuário: "123456"

Alfredo: "Excelente! Agora vamos configurar seu perfil financeiro.

Qual é sua renda mensal? (ex: R$ 5000)"

[... continua com questionário completo ...]
```

### **Passos do Onboarding**

1. **Nome completo**
2. **Email**
3. **Senha**
4. **Renda mensal**
5. **Gastos com moradia**
6. **Gastos com transporte**
7. **Gastos com alimentação**
8. **Gastos com saúde**
9. **Gastos com educação**
10. **Gastos com lazer**
11. **Meta de economia**
12. **Objetivo financeiro**
13. **Nível de experiência**
14. **Seleção de plano**

## 📸 **Processamento de Mídia**

### **Comprovantes por Foto**

```
Usuário: [envia foto do comprovante]

Alfredo: "✅ Transação registrada com sucesso!

📋 **Detalhes:**
• Valor: R$ 45,80
• Estabelecimento: Supermercado ABC
• Categoria: Alimentação
• Data: 15/01/2025

💡 **Dica:** Envie mais comprovantes para manter seu controle financeiro atualizado!"
```

### **Transações por Áudio**

```
Usuário: [envia áudio: "gastei 25 reais no Uber hoje"]

Alfredo: "✅ Áudio processado!

📝 **Transcrição:**
"gastei 25 reais no Uber hoje"

💡 **Dica:** Para melhor precisão, envie uma imagem do comprovante."
```

## 🤖 **Integração com IA**

### **OCR para Imagens**
- **Modelo**: GPT-4 Vision
- **Extrai**: valor, estabelecimento, data, categoria
- **Formato**: JSON estruturado

### **STT para Áudio**
- **Modelo**: Whisper-1
- **Idioma**: Português
- **Formato**: Texto transcrito

## 🔧 **Configuração Avançada**

### **Variáveis de Ambiente**

```bash
# WhatsApp
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_PHONE_NUMBER_ID=123456789

# OpenAI
OPENAI_API_KEY=sk-...

# Firebase
FIREBASE_PROJECT_ID=alfredo-app
FIREBASE_API_KEY=AIza...
FIREBASE_ID_TOKEN=eyJ...

# Asaas
ASAAS_API_KEY=seu_token_asaas
ASAAS_ENVIRONMENT=sandbox

# n8n
N8N_BASE_URL=https://seu-n8n.com
N8N_ENCRYPTION_KEY=chave_criptografia
```

### **Estrutura de Dados**

#### **Usuário (Firestore)**
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "phone": "5511999999999",
  "status": "pending",
  "createdVia": "whatsapp",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

#### **Transação (Firestore)**
```json
{
  "userId": "user123",
  "valor": 45.80,
  "estabelecimento": "Supermercado ABC",
  "categoria": "Alimentação",
  "descricao": "Compras do mês",
  "tipo": "image",
  "status": "pending",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

## 🧪 **Testes**

### **1. Teste de Criação de Conta**

```bash
curl -X POST https://seu-n8n.com/webhook/alfredo-whatsapp-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "test123",
            "from": "5511999999999",
            "text": { "body": "criar conta" },
            "timestamp": "1705312200"
          }],
          "contacts": [{
            "wa_id": "5511999999999",
            "profile": { "name": "João Silva" }
          }]
        }
      }]
    }]
  }'
```

### **2. Teste de Processamento de Mídia**

```bash
curl -X POST https://seu-n8n.com/webhook/alfredo-media-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "id": "test456",
            "from": "5511999999999",
            "type": "image",
            "image": {
              "id": "media123",
              "mime_type": "image/jpeg",
              "sha256": "abc123"
            },
            "timestamp": "1705312200"
          }],
          "contacts": [{
            "wa_id": "5511999999999",
            "profile": { "name": "João Silva" }
          }]
        }
      }]
    }]
  }'
```

## 📊 **Monitoramento**

### **Métricas Importantes**

- ✅ **Taxa de conversão** de criação de conta
- ✅ **Taxa de sucesso** no processamento de mídia
- ✅ **Tempo médio** de resposta
- ✅ **Precisão** do OCR/STT
- ✅ **Taxa de erro** nos webhooks

### **Logs do n8n**

Acesse `http://localhost:5678` e vá em:
- **Executions** - Ver execuções
- **Workflows** - Ver workflows ativos
- **Settings** - Configurações

## 🚨 **Troubleshooting**

### **Problemas Comuns**

| Problema | Solução |
|----------|---------|
| Webhook não responde | Verificar se workflow está ativo |
| Erro de autenticação | Verificar tokens do WhatsApp |
| IA não processa | Verificar chave da OpenAI |
| Firebase não salva | Verificar credenciais Firebase |
| Asaas não cria pagamento | Verificar token Asaas |

### **Logs de Debug**

```bash
# Ver logs do n8n
n8n start --debug

# Testar conectividade
curl https://seu-n8n.com/healthz

# Verificar webhooks
curl -X GET https://graph.facebook.com/v17.0/webhook
```

## 🎯 **Próximos Passos**

1. **Implementar retry logic** para falhas
2. **Adicionar validações** mais robustas
3. **Criar dashboard** de monitoramento
4. **Implementar analytics** avançados
5. **Adicionar suporte** a mais idiomas
6. **Implementar cache** para dados temporários

## 📞 **Suporte**

- 📧 **Email**: suporte@alfredo.com.br
- 📱 **WhatsApp**: (11) 99999-9999
- 📖 **Documentação**: `/docs/INTEGRACAO_N8N_COMPLETA.md`

---

**Status**: ✅ Pronto para Produção  
**Versão**: 2.0  
**Última Atualização**: Janeiro 2025

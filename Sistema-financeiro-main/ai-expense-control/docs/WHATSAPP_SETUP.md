# 📱 Guia de Configuração do WhatsApp Business API

## 🎯 Visão Geral

Este sistema permite que usuários enviem mensagens, áudios e fotos pelo WhatsApp para registrar despesas automaticamente. A IA processa os dados e os salva no seu sistema de controle financeiro.

## 📋 Pré-requisitos

1. **Conta do Facebook Business**
2. **WhatsApp Business API** (via Meta for Developers)
3. **Número de telefone verificado**
4. **Domínio público** (para webhooks)

## 🔧 Configuração Passo a Passo

### 1. Criar App no Meta for Developers

1. Acesse [Meta for Developers](https://developers.facebook.com/)
2. Clique em "Criar App"
3. Selecione "Business" como tipo
4. Preencha as informações básicas

### 2. Configurar WhatsApp Business API

1. No seu app, vá para "Produtos"
2. Adicione o produto "WhatsApp"
3. Clique em "Configurar"

### 3. Configurar Número de Telefone

1. Vá para "WhatsApp" > "Getting Started"
2. Clique em "Add phone number"
3. Siga o processo de verificação
4. Anote o **Phone Number ID**

### 4. Gerar Token de Acesso

1. Vá para "WhatsApp" > "API Setup"
2. Clique em "Generate token"
3. Copie o **Access Token**
4. ⚠️ **IMPORTANTE**: Guarde este token com segurança!

### 5. Configurar Webhook

1. Vá para "WhatsApp" > "Configuration"
2. Em "Webhook", clique em "Configure"
3. Configure:
   - **Webhook URL**: `https://seu-dominio.com/api/whatsapp/webhook`
   - **Verify token**: Crie um token personalizado (ex: `meu-token-secreto-123`)
   - **Webhook fields**: Selecione `messages`

### 6. Configurar Variáveis de Ambiente

Edite o arquivo `.env`:

```env
# WhatsApp Business API
WHATSAPP_API_TOKEN=seu-access-token-aqui
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id-aqui
WHATSAPP_WEBHOOK_URL=https://seu-dominio.com/api/whatsapp/webhook
WHATSAPP_VERIFY_TOKEN=meu-token-secreto-123
```

## 🧪 Testando a Integração

### 1. Verificar Webhook

```bash
curl "https://seu-dominio.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=meu-token-secreto-123&hub.challenge=teste"
```

### 2. Enviar Mensagem de Teste

```bash
curl -X POST "https://seu-dominio.com/api/whatsapp/send" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "5511999999999",
    "message": "Teste de integração"
  }'
```

### 3. Testar Processamento

Envie uma mensagem para o número do WhatsApp Business:

**Exemplos de mensagens:**
- `Gastei R$ 50 no mercado hoje`
- `Paguei R$ 25 de uber ontem`
- `Recebi R$ 1000 de salário`

## 📱 Como Funciona

### 1. **Mensagem de Texto**
```
Usuário: "Gastei R$ 50 no mercado hoje"
IA: Processa e extrai: valor=R$50, estabelecimento=mercado, data=hoje
Sistema: Salva no Firebase e envia confirmação
```

### 2. **Mensagem de Áudio**
```
Usuário: Envia áudio dizendo "Paguei R$ 25 de uber ontem"
IA: Converte áudio → texto → processa dados
Sistema: Salva e confirma
```

### 3. **Mensagem de Imagem**
```
Usuário: Envia foto de um comprovante
IA: OCR extrai texto → processa dados
Sistema: Salva e confirma
```

## 🔄 Fluxo de Processamento

1. **Recebimento**: Webhook recebe mensagem do WhatsApp
2. **Identificação**: Determina tipo (texto/áudio/imagem)
3. **Processamento**: 
   - Texto: Processamento direto
   - Áudio: STT → Processamento
   - Imagem: OCR → Processamento
4. **Categorização**: IA categoriza automaticamente
5. **Salvamento**: Salva no Firebase
6. **Integração**: Envia para n8n (se configurado)
7. **Confirmação**: Envia resposta para o usuário

## 📊 Estrutura de Dados

### Mensagem Recebida
```json
{
  "object": "whatsapp_business_account",
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "5511999999999",
          "timestamp": "1234567890",
          "text": {
            "body": "Gastei R$ 50 no mercado"
          }
        }]
      }
    }]
  }]
}
```

### Dados Processados
```json
{
  "valor": 50.00,
  "estabelecimento": "mercado",
  "data": "2025-08-18",
  "categoria": "Alimentação",
  "tipo": "despesa",
  "userid": "5511999999999"
}
```

## 🛠️ Solução de Problemas

### Erro 403 no Webhook
- Verifique se o `verify_token` está correto
- Confirme se a URL está acessível publicamente

### Erro 401 no Envio
- Verifique se o `WHATSAPP_API_TOKEN` está correto
- Confirme se o token não expirou

### Mensagens não processadas
- Verifique os logs do servidor
- Confirme se o webhook está configurado corretamente
- Teste com mensagens simples primeiro

## 🔒 Segurança

1. **Tokens**: Nunca compartilhe tokens de acesso
2. **Webhook**: Use HTTPS obrigatoriamente
3. **Validação**: Sempre valide dados recebidos
4. **Rate Limiting**: Implemente limites de requisições
5. **Logs**: Monitore logs para atividades suspeitas

## 📞 Suporte

- [Documentação WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Meta for Developers](https://developers.facebook.com/)
- [WhatsApp Business Platform](https://business.whatsapp.com/)

## 🚀 Próximos Passos

1. Configure o webhook no Meta for Developers
2. Teste com mensagens simples
3. Configure categorias personalizadas
4. Integre com seu sistema n8n
5. Monitore logs e performance

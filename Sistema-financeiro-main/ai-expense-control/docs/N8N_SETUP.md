# 🔧 Guia de Configuração do N8N

Este guia mostra como configurar o N8N para receber dados do sistema de IA de controle de gastos e criar automações personalizadas.

## 📋 Pré-requisitos

- N8N instalado e configurado
- Acesso ao painel administrativo do N8N
- URL do webhook configurada no sistema de IA

## 🚀 Configuração Básica

### 1. Criar Novo Workflow

1. Acesse o painel do N8N
2. Clique em **"New Workflow"**
3. Dê um nome ao workflow: `"IA Controle de Gastos"`

### 2. Configurar Webhook

1. Arraste um nó **"Webhook"** para o canvas
2. Configure o webhook:
   - **HTTP Method**: `POST`
   - **Path**: `expense-control`
   - **Response Mode**: `Respond to Webhook`

3. Copie a URL do webhook (ex: `https://seu-n8n.com/webhook/expense-control`)
4. Adicione a URL no arquivo `.env` do sistema de IA:
   ```env
   N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/expense-control
   ```

### 3. Testar Conexão

1. Clique em **"Test step"** no nó webhook
2. Verifique se recebe dados de teste
3. Se funcionar, o webhook está configurado corretamente

## 📊 Estrutura de Dados Recebidos

O N8N receberá dados no seguinte formato:

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "ai-expense-control",
  "version": "1.0.0",
  "data": {
    "transaction": {
      "id": "abc123",
      "userid": "user123",
      "quando": "2024-01-15T10:30:00.000Z",
      "estabelecimento": "Supermercado ABC",
      "valor": 150.50,
      "detalhes": "Compras do mês",
      "tipo": "despesa",
      "category_id": "Alimentação",
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "processing": {
      "categoria_detectada": "keywords",
      "processed_by": "ai-expense-control",
      "confidence": 95.5,
      "original_text": "Texto extraído do OCR/STT"
    },
    "metadata": {
      "source_type": "photo",
      "file_path": "/uploads/image-123.jpg",
      "processing_time": 2500,
      "ai_model": "tesseract-ocr"
    }
  }
}
```

## 🔄 Exemplos de Workflows

### 1. Notificação via Telegram

**Objetivo**: Enviar notificação no Telegram quando um gasto for processado.

**Configuração**:

1. **Webhook** (já configurado)
2. **HTTP Request** - Telegram Bot
   - **Method**: `POST`
   - **URL**: `https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/sendMessage`
   - **Body**:
     ```json
     {
       "chat_id": "{{$env.TELEGRAM_CHAT_ID}}",
       "text": "💰 Novo gasto detectado!\n\n🏪 Estabelecimento: {{$json.data.transaction.estabelecimento}}\n💵 Valor: R$ {{$json.data.transaction.valor}}\n📅 Data: {{$json.data.transaction.quando}}\n🏷️ Categoria: {{$json.data.transaction.category_id}}\n\n📝 Detalhes: {{$json.data.transaction.detalhes}}",
       "parse_mode": "HTML"
     }
     ```

### 2. Notificação via WhatsApp

**Objetivo**: Enviar notificação no WhatsApp usando API externa.

**Configuração**:

1. **Webhook** (já configurado)
2. **HTTP Request** - WhatsApp API
   - **Method**: `POST`
   - **URL**: `https://api.whatsapp.com/send`
   - **Body**:
     ```json
     {
       "phone": "{{$env.WHATSAPP_PHONE}}",
       "message": "💰 Gasto registrado!\n\n🏪 {{$json.data.transaction.estabelecimento}}\n💵 R$ {{$json.data.transaction.valor}}\n🏷️ {{$json.data.transaction.category_id}}"
     }
     ```

### 3. Salvar no Google Sheets

**Objetivo**: Manter um registro dos gastos no Google Sheets.

**Configuração**:

1. **Webhook** (já configurado)
2. **Google Sheets** - Append
   - **Operation**: `Append`
   - **Sheet ID**: `{{$env.GOOGLE_SHEET_ID}}`
   - **Range**: `A:G`
   - **Values**:
     ```
     [
       "{{$json.data.transaction.quando}}",
       "{{$json.data.transaction.estabelecimento}}",
       "{{$json.data.transaction.valor}}",
       "{{$json.data.transaction.tipo}}",
       "{{$json.data.transaction.category_id}}",
       "{{$json.data.transaction.detalhes}}",
       "{{$json.data.processing.categoria_detectada}}"
     ]
     ```

### 4. Análise de Gastos

**Objetivo**: Analisar gastos e enviar alertas quando ultrapassar limites.

**Configuração**:

1. **Webhook** (já configurado)
2. **IF** - Verificar valor
   - **Condition**: `{{$json.data.transaction.valor > 1000}}`
3. **HTTP Request** - Alerta (se verdadeiro)
   - **URL**: `https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/sendMessage`
   - **Body**:
     ```json
     {
       "chat_id": "{{$env.TELEGRAM_CHAT_ID}}",
       "text": "⚠️ ALERTA: Gasto alto detectado!\n\n💵 Valor: R$ {{$json.data.transaction.valor}}\n🏪 {{$json.data.transaction.estabelecimento}}"
     }
     ```

### 5. Categorização Inteligente

**Objetivo**: Melhorar categorização baseada em histórico.

**Configuração**:

1. **Webhook** (já configurado)
2. **IF** - Verificar categoria
   - **Condition**: `{{$json.data.processing.categoria_detectada == "default"}}`
3. **HTTP Request** - OpenAI (se categoria padrão)
   - **URL**: `https://api.openai.com/v1/chat/completions`
   - **Headers**:
     ```
     Authorization: Bearer {{$env.OPENAI_API_KEY}}
     Content-Type: application/json
     ```
   - **Body**:
     ```json
     {
       "model": "gpt-3.5-turbo",
       "messages": [
         {
           "role": "system",
           "content": "Categorize este gasto financeiro em uma das categorias: Alimentação, Transporte, Moradia, Saúde, Educação, Lazer, Vestuário, Tecnologia, Serviços, Investimentos"
         },
         {
           "role": "user",
           "content": "Estabelecimento: {{$json.data.transaction.estabelecimento}}\nValor: R$ {{$json.data.transaction.valor}}\nDetalhes: {{$json.data.transaction.detalhes}}"
         }
       ]
     }
     ```

## 🔧 Variáveis de Ambiente

Configure estas variáveis no N8N:

```env
# Telegram
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_CHAT_ID=seu_chat_id_aqui

# WhatsApp
WHATSAPP_PHONE=5511999999999

# Google Sheets
GOOGLE_SHEET_ID=seu_sheet_id_aqui

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_app
```

## 📱 Exemplo Completo: Workflow de Notificação

### Estrutura do Workflow:

```
[Webhook] → [IF: Valor > 500] → [Telegram: Alerta] → [Email: Relatório]
     ↓
[IF: Categoria = Default] → [OpenAI: Categorizar] → [Firebase: Atualizar]
     ↓
[Google Sheets: Registrar] → [Slack: Notificar]
```

### Configuração Detalhada:

#### 1. Nó Webhook
```json
{
  "httpMethod": "POST",
  "path": "expense-control",
  "responseMode": "respondToWebhook"
}
```

#### 2. Nó IF - Verificar Valor Alto
```json
{
  "conditions": {
    "number": [
      {
        "value1": "={{$json.data.transaction.valor}}",
        "operation": "gt",
        "value2": 500
      }
    ]
  }
}
```

#### 3. Nó Telegram - Alerta
```json
{
  "url": "https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/sendMessage",
  "method": "POST",
  "sendBody": true,
  "bodyParameters": {
    "parameters": [
      {
        "name": "chat_id",
        "value": "{{$env.TELEGRAM_CHAT_ID}}"
      },
      {
        "name": "text",
        "value": "⚠️ GASTO ALTO DETECTADO!\n\n💵 R$ {{$json.data.transaction.valor}}\n🏪 {{$json.data.transaction.estabelecimento}}\n📅 {{$json.data.transaction.quando}}\n🏷️ {{$json.data.transaction.category_id}}"
      },
      {
        "name": "parse_mode",
        "value": "HTML"
      }
    ]
  }
}
```

#### 4. Nó Email - Relatório
```json
{
  "fromEmail": "{{$env.SMTP_USER}}",
  "toEmail": "seu-email@exemplo.com",
  "subject": "💰 Relatório de Gasto - {{$json.data.transaction.estabelecimento}}",
  "text": "Novo gasto registrado:\n\nEstabelecimento: {{$json.data.transaction.estabelecimento}}\nValor: R$ {{$json.data.transaction.valor}}\nData: {{$json.data.transaction.quando}}\nCategoria: {{$json.data.transaction.category_id}}\n\nProcessado por: {{$json.data.processing.processed_by}}"
}
```

## 🎯 Casos de Uso Avançados

### 1. Análise de Tendências
- Calcular média de gastos por categoria
- Detectar padrões de gastos
- Enviar relatórios semanais/mensais

### 2. Controle de Orçamento
- Comparar gastos com limites definidos
- Enviar alertas quando ultrapassar orçamento
- Sugerir cortes de gastos

### 3. Integração com Sistemas Externos
- Enviar dados para planilhas
- Integrar com sistemas de contabilidade
- Conectar com apps de investimento

### 4. Automação de Categorização
- Usar IA para melhorar categorização
- Aprender com correções manuais
- Sugerir categorias baseadas em histórico

## 🔍 Debug e Monitoramento

### 1. Logs do N8N
```bash
# Ver logs em tempo real
docker logs -f n8n

# Filtrar por workflow específico
docker logs n8n | grep "expense-control"
```

### 2. Teste de Webhook
```bash
curl -X POST https://seu-n8n.com/webhook/expense-control \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "2024-01-15T10:30:00.000Z",
    "source": "ai-expense-control",
    "data": {
      "transaction": {
        "estabelecimento": "Teste",
        "valor": 100.00,
        "category_id": "Alimentação"
      }
    }
  }'
```

### 3. Monitoramento de Performance
- Verificar tempo de resposta dos webhooks
- Monitorar falhas de entrega
- Acompanhar uso de recursos

## 🚀 Deploy em Produção

### 1. Configuração de Segurança
```bash
# Usar HTTPS
# Configurar autenticação
# Limitar acesso por IP
```

### 2. Backup de Workflows
```bash
# Exportar workflows
# Configurar backup automático
# Versionar configurações
```

### 3. Monitoramento
```bash
# Configurar alertas
# Monitorar performance
# Logs centralizados
```

## 📞 Suporte

- **Documentação N8N**: https://docs.n8n.io/
- **Comunidade**: https://community.n8n.io/
- **GitHub**: https://github.com/n8n-io/n8n

---

**Configurado com ❤️ para automatizar seu controle financeiro**

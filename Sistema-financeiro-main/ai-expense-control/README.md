# 🤖 IA de Controle de Gastos

Sistema inteligente para processamento automático de gastos através de fotos, áudios e mensagens de texto, integrado com Firebase e N8N.

## 🚀 Funcionalidades

### 📸 **Processamento de Fotos (OCR)**
- Extração automática de texto de comprovantes
- Reconhecimento de valores, datas e estabelecimentos
- Pré-processamento de imagem para melhor precisão
- Suporte a múltiplos formatos (JPEG, PNG, WebP)

### 🎤 **Processamento de Áudio (STT)**
- Conversão de voz para texto usando OpenAI Whisper
- Suporte a português brasileiro
- Processamento de áudios em múltiplos formatos
- Contexto específico para gastos financeiros

### 💬 **Processamento de Texto**
- Análise inteligente de mensagens
- Extração de dados usando regex e heurísticas
- Suporte a mensagens de WhatsApp, Telegram e outros apps
- Detecção automática de tipo (receita/despesa)

### 🏷️ **Categorização Automática**
- Categorização por palavras-chave
- Integração com OpenAI GPT para categorização avançada
- 10 categorias pré-definidas (Alimentação, Transporte, Moradia, etc.)
- Sistema de aprendizado para melhorar precisão

### 📱 **Integração WhatsApp**
- Recebe mensagens, áudios e fotos via WhatsApp Business API
- Processamento automático e resposta em tempo real
- Confirmação de dados processados
- Suporte a múltiplos usuários

### 🔄 **Integração Completa**
- **Firebase**: Armazenamento de dados e autenticação
- **N8N**: Automação e workflows personalizados
- **API REST**: Endpoints para integração externa
- **Logs detalhados**: Monitoramento completo do sistema

## 📋 Pré-requisitos

- Node.js 16+ 
- NPM ou Yarn
- Conta no Firebase
- Conta no OpenAI (opcional, para STT e categorização avançada)
- N8N (opcional, para automação)

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd ai-expense-control
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Configurações do Servidor
PORT=3001
NODE_ENV=development

# Firebase Admin SDK
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com

# OpenAI API (opcional)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# N8N Webhook (opcional)
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/expense-control

# WhatsApp Business API (opcional)
WHATSAPP_API_TOKEN=seu-token-do-whatsapp-business
WHATSAPP_PHONE_NUMBER_ID=seu-phone-number-id
WHATSAPP_WEBHOOK_URL=https://seu-dominio.com/api/whatsapp/webhook
WHATSAPP_VERIFY_TOKEN=seu-verify-token-personalizado

# Configurações de Processamento
MAX_FILE_SIZE=10485760
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp
ALLOWED_AUDIO_TYPES=audio/mpeg,audio/wav,audio/ogg

# Configurações de Categorização
DEFAULT_CATEGORY=Outros
AUTO_CATEGORIZE=true

# Configurações de Log
LOG_LEVEL=info
LOG_FILE=logs/ai-expense-control.log
```

### 4. Configure o Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou use um existente
3. Vá para **Configurações do Projeto** > **Contas de serviço**
4. Clique em **Gerar nova chave privada**
5. Baixe o arquivo JSON e copie as credenciais para o `.env`

### 5. Configure o OpenAI (opcional)

1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta e obtenha sua API key
3. Adicione a chave no arquivo `.env`

### 6. Configure o N8N (opcional)

1. Instale e configure o N8N
2. Crie um webhook node
3. Copie a URL do webhook para o `.env`

## 🚀 Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm start
```

O servidor estará disponível em `http://localhost:3001`

## 📡 Endpoints da API

### POST `/api/ingest/photo`
Processa foto de comprovante usando OCR.

**Request:**
```bash
curl -X POST http://localhost:3001/api/ingest/photo \
  -F "image=@comprovante.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Gasto processado com sucesso!",
  "data": {
    "id": "abc123",
    "userid": "user123",
    "quando": "2024-01-15T10:30:00.000Z",
    "estabelecimento": "Supermercado ABC",
    "valor": 150.50,
    "detalhes": "Compras do mês",
    "tipo": "despesa",
    "category_id": "Alimentação",
    "categoria_detectada": "keywords"
  },
  "n8n_status": "success"
}
```

### POST `/api/ingest/audio`
Processa áudio de voz usando STT.

**Request:**
```bash
curl -X POST http://localhost:3001/api/ingest/audio \
  -F "audio=@mensagem.mp3"
```

### POST `/api/ingest/text`
Processa mensagem de texto.

**Request:**
```bash
curl -X POST http://localhost:3001/api/ingest/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Gastei R$ 50 no mercado hoje"}'
```

### GET `/api/health`
Verifica o status do sistema.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "ocr": "active",
    "stt": "active",
    "categorizer": "active",
    "firebase": "active",
    "n8n": "active"
  }
}
```

## 🎯 Exemplos de Uso

### Processamento de Foto
```javascript
const formData = new FormData();
formData.append('image', file);

const response = await fetch('/api/ingest/photo', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Gasto processado:', result.data);
```

### Processamento de Áudio
```javascript
const formData = new FormData();
formData.append('audio', audioFile);

const response = await fetch('/api/ingest/audio', {
  method: 'POST',
  body: formData
});

const result = await response.json();
console.log('Áudio processado:', result.data);
```

### Processamento de Texto
```javascript
const response = await fetch('/api/ingest/text', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Paguei R$ 25 por uber hoje'
  })
});

const result = await response.json();
console.log('Texto processado:', result.data);
```

## 🔧 Configuração do N8N

### Workflow Básico
1. Crie um novo workflow no N8N
2. Adicione um **Webhook** node
3. Configure o webhook para receber dados do sistema
4. Adicione um **HTTP Request** node para enviar notificações
5. Configure ações baseadas nos dados recebidos

### Exemplo de Workflow
```json
{
  "nodes": [
    {
      "id": "webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [100, 100],
      "parameters": {
        "httpMethod": "POST",
        "path": "expense-control"
      }
    },
    {
      "id": "notification",
      "type": "n8n-nodes-base.httpRequest",
      "position": [300, 100],
      "parameters": {
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
              "value": "💰 Novo gasto detectado!\n\nEstabelecimento: {{$json.data.transaction.estabelecimento}}\nValor: R$ {{$json.data.transaction.valor}}\nCategoria: {{$json.data.transaction.category_id}}"
            }
          ]
        }
      }
    }
  ]
}
```

## 📊 Estrutura de Dados

### Transação
```typescript
interface Transacao {
  id?: string;
  userid: string;
  quando: string;
  estabelecimento: string;
  valor: number;
  detalhes: string;
  tipo: 'receita' | 'despesa';
  category_id: string;
  created_at: string;
  processed_by: string;
  categoria_detectada: string;
}
```

### Payload para N8N
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

## 🏷️ Categorias Disponíveis

- **Alimentação**: Restaurantes, supermercados, padarias
- **Transporte**: Uber, combustível, transporte público
- **Moradia**: Aluguel, contas, internet
- **Saúde**: Farmácias, médicos, exames
- **Educação**: Cursos, livros, material escolar
- **Lazer**: Cinema, shows, viagens
- **Vestuário**: Roupas, calçados, acessórios
- **Tecnologia**: Eletrônicos, apps, software
- **Serviços**: Manicure, cabeleireiro, limpeza
- **Investimentos**: Ações, fundos, criptomoedas

## 🔍 Logs e Monitoramento

O sistema gera logs detalhados em `logs/ai-expense-control.log`:

```bash
# Ver logs em tempo real
tail -f logs/ai-expense-control.log

# Buscar erros
grep "ERROR" logs/ai-expense-control.log

# Ver estatísticas
npm run logs:stats
```

## 🚀 Deploy

### Docker
```bash
# Build da imagem
docker build -t ai-expense-control .

# Executar container
docker run -p 3001:3001 --env-file .env ai-expense-control
```

### PM2
```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start src/server.js --name "ai-expense-control"

# Monitorar
pm2 monit
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

- **Documentação**: [Wiki do projeto](link-para-wiki)
- **Issues**: [GitHub Issues](link-para-issues)
- **Email**: seu-email@exemplo.com

## 📱 Integração WhatsApp

### Como Funciona
O sistema recebe mensagens do WhatsApp Business API e processa automaticamente:

1. **Mensagem de Texto**: "Gastei R$ 50 no mercado hoje"
2. **Mensagem de Áudio**: Grave uma mensagem de voz
3. **Mensagem de Imagem**: Envie foto de um comprovante

### Configuração
Veja o guia completo em [WHATSAPP_SETUP.md](docs/WHATSAPP_SETUP.md)

### Exemplos de Uso
```
Usuário: "Paguei R$ 25 de uber ontem"
Sistema: ✅ Despesa processada com sucesso!
         💰 Valor: R$ 25.00
         🏪 Estabelecimento: uber
         📅 Data: 2025-08-17
         🏷️ Categoria: Transporte
```

## 🔮 Roadmap

- [x] Integração com WhatsApp Business API
- [ ] Processamento em lote de múltiplos arquivos
- [ ] Dashboard web para visualização de dados
- [ ] Machine Learning para melhorar categorização
- [ ] Suporte a múltiplos idiomas
- [ ] Integração com outros sistemas financeiros
- [ ] API GraphQL
- [ ] Cache Redis para melhor performance

---

**Desenvolvido com ❤️ para facilitar o controle financeiro**

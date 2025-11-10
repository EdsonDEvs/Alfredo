# 🚀 Início Rápido - IA de Controle de Gastos

Guia rápido para começar a usar o sistema de IA de controle de gastos em 5 minutos!

## ⚡ Setup Rápido

### 1. Instalação Automática (Windows)
```bash
# Execute o script de setup
setup.bat
```

### 2. Instalação Manual
```bash
# Clone o projeto
git clone <seu-repositorio>
cd ai-expense-control

# Instale dependências
npm install

# Configure variáveis de ambiente
cp env.example .env
# Edite o arquivo .env com suas credenciais

# Inicie o servidor
npm run dev
```

### 3. Acesse a Interface
Abra seu navegador e acesse: `http://localhost:3001`

## 🎯 Teste Rápido

### 1. Teste de Texto
1. Vá para a aba "💬 Texto"
2. Digite: `Gastei R$ 50 no mercado hoje`
3. Clique em "Processar Texto"
4. Veja o resultado!

### 2. Teste de Foto
1. Vá para a aba "📸 Foto"
2. Faça uma foto de um comprovante
3. Clique em "Processar Foto"
4. Veja a extração automática!

### 3. Teste de Áudio
1. Vá para a aba "🎤 Áudio"
2. Grave uma mensagem de voz
3. Clique em "Processar Áudio"
4. Veja a transcrição!

## 🔧 Configuração Mínima

### Firebase (Obrigatório)
```env
FIREBASE_PROJECT_ID=seu-projeto
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com
```

### OpenAI (Opcional - para STT e categorização avançada)
```env
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### N8N (Opcional - para automação)
```env
N8N_WEBHOOK_URL=https://seu-n8n.com/webhook/expense-control
```

## 📡 Endpoints Principais

### Processar Texto
```bash
curl -X POST http://localhost:3001/api/ingest/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Gastei R$ 50 no mercado"}'
```

### Processar Foto
```bash
curl -X POST http://localhost:3001/api/ingest/photo \
  -F "image=@comprovante.jpg"
```

### Verificar Status
```bash
curl http://localhost:3001/api/health
```

## 🧪 Testes Automáticos

```bash
# Executar todos os testes
node test-system.js

# Teste de performance
node test-system.js --performance
```

## 🔄 Integração com Seu Sistema

### React/JavaScript
```javascript
import { AIExpenseIntegration } from './examples/integration-example.js';

const ai = new AIExpenseIntegration();

// Processar texto
const result = await ai.processTextAndSave('Gastei R$ 50 no mercado', userId);
console.log('Gasto processado:', result.savedTransaction);
```

### WhatsApp/Telegram
```javascript
// Processar mensagem recebida
const result = await ai.processTextAndSave(message, userId);
await sendConfirmation(result.savedTransaction);
```

## 📊 Estrutura de Dados

### Dados Processados
```json
{
  "estabelecimento": "Supermercado ABC",
  "valor": 150.50,
  "quando": "2024-01-15T10:30:00.000Z",
  "tipo": "despesa",
  "category_id": "Alimentação",
  "categoria_detectada": "keywords"
}
```

### Payload para N8N
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "source": "ai-expense-control",
  "data": {
    "transaction": { /* dados da transação */ },
    "processing": { /* metadados do processamento */ }
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

## 🚀 Deploy Rápido

### Docker
```bash
docker build -t ai-expense-control .
docker run -p 3001:3001 --env-file .env ai-expense-control
```

### PM2
```bash
npm install -g pm2
pm2 start src/server.js --name "ai-expense-control"
pm2 monit
```

## 🔍 Troubleshooting

### Erro: "Firebase não configurado"
- Verifique se as credenciais do Firebase estão corretas no `.env`
- Certifique-se de que o projeto Firebase existe

### Erro: "OpenAI API não configurada"
- Adicione sua chave da OpenAI no `.env`
- Ou deixe vazio para usar apenas categorização por palavras-chave

### Erro: "N8N não configurado"
- Configure a URL do webhook do N8N no `.env`
- Ou deixe vazio para pular o envio para N8N

### Erro: "Porta 3001 em uso"
- Mude a porta no `.env`: `PORT=3002`
- Ou pare outros serviços usando a porta 3001

## 📞 Suporte

- **Documentação completa**: [README.md](README.md)
- **Configuração N8N**: [docs/N8N_SETUP.md](docs/N8N_SETUP.md)
- **Exemplos de integração**: [examples/integration-example.js](examples/integration-example.js)

## 🎉 Próximos Passos

1. **Configure o Firebase** com suas credenciais
2. **Teste a interface web** em `http://localhost:3001`
3. **Integre com seu sistema** usando os exemplos
4. **Configure o N8N** para automações
5. **Personalize as categorias** conforme necessário

---

**🎯 Em 5 minutos você terá um sistema de IA funcionando para controle de gastos!**

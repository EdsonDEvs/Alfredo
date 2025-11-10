const axios = require('axios');

console.log('🧪 Testando webhook do WhatsApp localmente...\n');

const baseUrl = 'http://localhost:3001';

// Teste 1: Verificar se o servidor está rodando
async function testarServidor() {
  try {
    console.log('1️⃣ Testando servidor...');
    const response = await axios.get(`${baseUrl}/api/health`);
    console.log('✅ Servidor está rodando!');
    console.log('Status:', response.data.status);
    return true;
  } catch (error) {
    console.log('❌ Servidor não está rodando!');
    console.log('Erro:', error.message);
    console.log('\n💡 Execute: npm start');
    return false;
  }
}

// Teste 2: Verificar webhook de verificação
async function testarWebhookVerificacao() {
  try {
    console.log('\n2️⃣ Testando webhook de verificação...');
    const response = await axios.get(`${baseUrl}/api/whatsapp/webhook`, {
      params: {
        'hub.mode': 'subscribe',
        'hub.verify_token': 'SantosDrumont',
        'hub.challenge': 'teste123'
      }
    });
    
    console.log('✅ Webhook de verificação funcionando!');
    console.log('Challenge retornado:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Erro no webhook de verificação!');
    console.log('Erro:', error.message);
    return false;
  }
}

// Teste 3: Simular mensagem do WhatsApp
async function testarMensagemWhatsApp() {
  try {
    console.log('\n3️⃣ Testando processamento de mensagem...');
    
    const mensagemTeste = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '5511999999999',
              timestamp: Date.now().toString(),
              text: {
                body: 'Gastei R$ 50 no mercado hoje'
              }
            }]
          }
        }]
      }]
    };

    const response = await axios.post(`${baseUrl}/api/whatsapp/webhook`, mensagemTeste);
    console.log('✅ Mensagem processada com sucesso!');
    console.log('Status:', response.status);
    return true;
  } catch (error) {
    console.log('❌ Erro ao processar mensagem!');
    console.log('Erro:', error.message);
    return false;
  }
}

// Executar todos os testes
async function executarTestes() {
  console.log('🚀 Iniciando testes do sistema WhatsApp...\n');
  
  const servidorOk = await testarServidor();
  if (!servidorOk) return;
  
  const webhookOk = await testarWebhookVerificacao();
  if (!webhookOk) return;
  
  await testarMensagemWhatsApp();
  
  console.log('\n🎉 Testes concluídos!');
  console.log('\n📋 Próximos passos:');
  console.log('1. Se todos os testes passaram, configure um túnel público (ngrok, serveo, etc)');
  console.log('2. Use a URL pública + /api/whatsapp/webhook no Meta for Developers');
  console.log('3. Use o verify token: SantosDrumont');
}

// Executar
executarTestes().catch(console.error);

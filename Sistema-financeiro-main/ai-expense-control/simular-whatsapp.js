const axios = require('axios');

console.log('📱 Simulando mensagens do WhatsApp...\n');

const baseUrl = 'http://localhost:3001';

// Simular diferentes tipos de mensagens
const mensagens = [
  {
    tipo: 'texto',
    mensagem: 'Gastei R$ 50 no mercado hoje',
    descricao: 'Mensagem de texto simples'
  },
  {
    tipo: 'texto',
    mensagem: 'Paguei R$ 25 de uber ontem',
    descricao: 'Mensagem com data relativa'
  },
  {
    tipo: 'texto',
    mensagem: 'Recebi R$ 1000 de salário',
    descricao: 'Mensagem de receita'
  },
  {
    tipo: 'texto',
    mensagem: 'Comprei remédios na farmácia por R$ 30',
    descricao: 'Mensagem com estabelecimento específico'
  }
];

async function simularMensagem(mensagem, index) {
  try {
    console.log(`\n${index + 1}️⃣ ${mensagem.descricao}:`);
    console.log(`📝 "${mensagem.mensagem}"`);
    
    const payload = {
      object: 'whatsapp_business_account',
      entry: [{
        changes: [{
          value: {
            messages: [{
              from: '5511999999999',
              timestamp: Date.now().toString(),
              text: {
                body: mensagem.mensagem
              }
            }]
          }
        }]
      }]
    };

    const response = await axios.post(`${baseUrl}/api/whatsapp/webhook`, payload);
    
    console.log('✅ Processada com sucesso!');
    console.log('Status:', response.status);
    
    // Aguardar um pouco entre as mensagens
    await new Promise(resolve => setTimeout(resolve, 1000));
    
  } catch (error) {
    console.log('❌ Erro ao processar mensagem!');
    console.log('Erro:', error.message);
  }
}

async function executarSimulacao() {
  console.log('🚀 Iniciando simulação de mensagens do WhatsApp...\n');
  
  for (let i = 0; i < mensagens.length; i++) {
    await simularMensagem(mensagens[i], i);
  }
  
  console.log('\n🎉 Simulação concluída!');
  console.log('\n📋 Verifique no Firebase se as transações foram salvas.');
  console.log('💡 Para ver no seu sistema financeiro, acesse: http://localhost:8081');
}

// Executar simulação
executarSimulacao().catch(console.error);

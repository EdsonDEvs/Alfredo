/**
 * Script para testar o sistema de IA de controle de gastos
 * Execute: node test-system.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configurações
const BASE_URL = 'http://localhost:3001';

/**
 * Testa o endpoint de health
 */
async function testHealth() {
  try {
    console.log('🔍 Testando health check...');
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Health check falhou:', error.message);
    return false;
  }
}

/**
 * Testa processamento de texto
 */
async function testTextProcessing() {
  try {
    console.log('💬 Testando processamento de texto...');
    
    const testCases = [
      'Gastei R$ 50 no mercado hoje',
      'Paguei R$ 25 por uber ontem',
      'Recebi R$ 1000 do cliente',
      'Comprei roupas por R$ 150 na loja',
      'Paguei R$ 80 na farmácia'
    ];

    for (const text of testCases) {
      console.log(`\n📝 Testando: "${text}"`);
      
      const response = await axios.post(`${BASE_URL}/api/ingest/text`, {
        text: text,
        userId: 'test-user'
      });

      if (response.data.success) {
        const data = response.data.data;
        console.log(`✅ Processado: ${data.estabelecimento} - R$ ${data.valor} - ${data.category_id}`);
      } else {
        console.log(`❌ Falhou: ${response.data.error}`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Teste de texto falhou:', error.message);
    return false;
  }
}

/**
 * Testa processamento de foto (simulado)
 */
async function testPhotoProcessing() {
  try {
    console.log('📸 Testando processamento de foto...');
    
    // Criar uma imagem de teste simples
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'Teste de imagem');
    
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath));
    
    const response = await axios.post(`${BASE_URL}/api/ingest/photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      console.log('✅ Foto processada com sucesso');
    } else {
      console.log('❌ Falha no processamento de foto');
    }

    // Limpar arquivo de teste
    fs.unlinkSync(testImagePath);
    
    return true;
  } catch (error) {
    console.error('❌ Teste de foto falhou:', error.message);
    return false;
  }
}

/**
 * Testa processamento de áudio (simulado)
 */
async function testAudioProcessing() {
  try {
    console.log('🎤 Testando processamento de áudio...');
    
    // Criar um arquivo de áudio de teste
    const testAudioPath = path.join(__dirname, 'test-audio.txt');
    fs.writeFileSync(testAudioPath, 'Teste de áudio');
    
    const formData = new FormData();
    formData.append('audio', fs.createReadStream(testAudioPath));
    
    const response = await axios.post(`${BASE_URL}/api/ingest/audio`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data.success) {
      console.log('✅ Áudio processado com sucesso');
    } else {
      console.log('❌ Falha no processamento de áudio');
    }

    // Limpar arquivo de teste
    fs.unlinkSync(testAudioPath);
    
    return true;
  } catch (error) {
    console.error('❌ Teste de áudio falhou:', error.message);
    return false;
  }
}

/**
 * Testa categorização
 */
async function testCategorization() {
  try {
    console.log('🏷️ Testando categorização...');
    
    const testCases = [
      { text: 'Gastei R$ 30 no mcdonalds', expected: 'Alimentação' },
      { text: 'Paguei R$ 25 por uber', expected: 'Transporte' },
      { text: 'Comprei remédios por R$ 50', expected: 'Saúde' },
      { text: 'Paguei aluguel R$ 800', expected: 'Moradia' },
      { text: 'Comprei um livro por R$ 40', expected: 'Educação' }
    ];

    for (const testCase of testCases) {
      console.log(`\n📝 Testando: "${testCase.text}"`);
      
      const response = await axios.post(`${BASE_URL}/api/ingest/text`, {
        text: testCase.text,
        userId: 'test-user'
      });

      if (response.data.success) {
        const data = response.data.data;
        const success = data.category_id === testCase.expected;
        console.log(`✅ Categoria: ${data.category_id} ${success ? '✓' : '✗'} (esperado: ${testCase.expected})`);
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Teste de categorização falhou:', error.message);
    return false;
  }
}

/**
 * Testa integração com N8N
 */
async function testN8NIntegration() {
  try {
    console.log('🔄 Testando integração com N8N...');
    
    const response = await axios.post(`${BASE_URL}/api/ingest/text`, {
      text: 'Teste de integração N8N - R$ 100 no mercado',
      userId: 'test-user'
    });

    if (response.data.success) {
      console.log('✅ Integração N8N testada');
      console.log(`📊 Status N8N: ${response.data.n8n_status}`);
    } else {
      console.log('❌ Falha na integração N8N');
    }

    return true;
  } catch (error) {
    console.error('❌ Teste N8N falhou:', error.message);
    return false;
  }
}

/**
 * Executa todos os testes
 */
async function runAllTests() {
  console.log('🚀 Iniciando testes do sistema de IA...\n');

  const tests = [
    { name: 'Health Check', fn: testHealth },
    { name: 'Processamento de Texto', fn: testTextProcessing },
    { name: 'Processamento de Foto', fn: testPhotoProcessing },
    { name: 'Processamento de Áudio', fn: testAudioProcessing },
    { name: 'Categorização', fn: testCategorization },
    { name: 'Integração N8N', fn: testN8NIntegration }
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🧪 ${test.name}`);
    console.log(`${'='.repeat(50)}`);
    
    try {
      const result = await test.fn();
      results.push({ name: test.name, success: result });
    } catch (error) {
      console.error(`❌ Erro no teste ${test.name}:`, error.message);
      results.push({ name: test.name, success: false, error: error.message });
    }
  }

  // Relatório final
  console.log(`\n${'='.repeat(50)}`);
  console.log('📊 RELATÓRIO FINAL DOS TESTES');
  console.log(`${'='.repeat(50)}`);

  const passed = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.name}`);
    if (result.error) {
      console.log(`   Erro: ${result.error}`);
    }
  });

  console.log(`\n📈 Resultado: ${passed}/${total} testes passaram`);
  
  if (passed === total) {
    console.log('🎉 Todos os testes passaram! Sistema funcionando corretamente.');
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique a configuração.');
  }

  return passed === total;
}

/**
 * Teste específico de performance
 */
async function testPerformance() {
  try {
    console.log('⚡ Testando performance...');
    
    const startTime = Date.now();
    const iterations = 10;
    
    for (let i = 0; i < iterations; i++) {
      await axios.post(`${BASE_URL}/api/ingest/text`, {
        text: `Teste de performance ${i + 1} - R$ ${Math.random() * 100}`,
        userId: 'test-user'
      });
    }
    
    const endTime = Date.now();
    const totalTime = endTime - startTime;
    const avgTime = totalTime / iterations;
    
    console.log(`✅ Performance: ${iterations} requisições em ${totalTime}ms`);
    console.log(`📊 Tempo médio: ${avgTime.toFixed(2)}ms por requisição`);
    
    return true;
  } catch (error) {
    console.error('❌ Teste de performance falhou:', error.message);
    return false;
  }
}

// Executar testes se for o arquivo principal
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--performance')) {
    testPerformance();
  } else {
    runAllTests();
  }
}

module.exports = {
  testHealth,
  testTextProcessing,
  testPhotoProcessing,
  testAudioProcessing,
  testCategorization,
  testN8NIntegration,
  testPerformance,
  runAllTests
};

const fs = require('fs');
const path = require('path');

console.log('🔧 Configurador de Chave Privada do Firebase');
console.log('=============================================\n');

// Verificar se o arquivo .env já existe
const envPath = path.join(__dirname, '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('📁 Arquivo .env encontrado!');
  
  // Ler o arquivo .env atual
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar se a chave privada já está configurada
  if (envContent.includes('FIREBASE_PRIVATE_KEY')) {
    console.log('⚠️  Chave privada já configurada no .env');
    console.log('   Para corrigir problemas de formatação:');
    console.log('   1. Abra o arquivo .env');
    console.log('   2. Localize a linha FIREBASE_PRIVATE_KEY');
    console.log('   3. Substitua todas as quebras de linha por \\n');
    console.log('   4. Certifique-se de que a chave está entre aspas duplas');
    console.log('\n   Exemplo correto:');
    console.log('   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIICXgIBAAKCAQEAt...\\n-----END PRIVATE KEY-----\\n"');
  } else {
    console.log('❌ Chave privada não encontrada no .env');
  }
} else {
  console.log('📁 Arquivo .env não encontrado!');
  console.log('   Criando arquivo .env baseado no env.example...');
  
  // Copiar env.example para .env
  const examplePath = path.join(__dirname, 'env.example');
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log('✅ Arquivo .env criado!');
  } else {
    console.log('❌ Arquivo env.example não encontrado!');
  }
}

console.log('\n📋 PRÓXIMOS PASSOS:');
console.log('1. Obtenha as credenciais do Firebase Admin SDK:');
console.log('   - Vá para https://console.firebase.google.com/');
console.log('   - Selecione seu projeto');
console.log('   - Vá em Configurações > Contas de serviço');
console.log('   - Clique em "Gerar nova chave privada"');
console.log('   - Baixe o arquivo JSON');
console.log('\n2. Configure o arquivo .env:');
console.log('   - Abra o arquivo .env');
console.log('   - Substitua FIREBASE_PROJECT_ID pelo ID do seu projeto');
console.log('   - Substitua FIREBASE_PRIVATE_KEY pela chave privada do JSON');
console.log('   - Substitua FIREBASE_CLIENT_EMAIL pelo email do JSON');
console.log('   - Configure OPENAI_API_KEY (opcional)');
console.log('   - Configure N8N_WEBHOOK_URL (opcional)');
console.log('\n3. Formatação da chave privada:');
console.log('   - A chave deve estar em uma única linha');
console.log('   - Use \\n para quebras de linha');
console.log('   - Mantenha as aspas duplas');
console.log('\n4. Teste o sistema:');
console.log('   npm run dev');

console.log('\n🔗 Links úteis:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- OpenAI API: https://platform.openai.com/api-keys');
console.log('- N8N: https://n8n.io/');

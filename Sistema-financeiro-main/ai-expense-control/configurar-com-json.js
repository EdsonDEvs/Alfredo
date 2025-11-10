const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando .env com arquivo JSON do Firebase');
console.log('================================================\n');

// Caminho do arquivo JSON do Firebase
const jsonPath = 'C:\\Users\\Pc-76\\Downloads\\alfredo-dc71e-firebase-adminsdk-fbsvc-e2fbdd045e.json';
const envPath = path.join(__dirname, '.env');

// Verificar se o arquivo JSON existe
if (!fs.existsSync(jsonPath)) {
  console.log('❌ Arquivo JSON do Firebase não encontrado!');
  console.log(`   Procurando em: ${jsonPath}`);
  process.exit(1);
}

// Ler o arquivo JSON
console.log('📄 Lendo arquivo JSON do Firebase...');
const jsonContent = fs.readFileSync(jsonPath, 'utf8');
const firebaseConfig = JSON.parse(jsonContent);

console.log('✅ Arquivo JSON lido com sucesso!');
console.log(`   Project ID: ${firebaseConfig.project_id}`);
console.log(`   Client Email: ${firebaseConfig.client_email}`);

// Verificar se o arquivo .env existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('   Execute primeiro: .\\configurar-env.bat');
  process.exit(1);
}

// Ler o arquivo .env atual
console.log('\n📄 Lendo arquivo .env atual...');
const envContent = fs.readFileSync(envPath, 'utf8');

// Preparar a chave privada formatada corretamente
const privateKey = firebaseConfig.private_key.replace(/\n/g, '\\n');

// Substituir as variáveis
let newEnvContent = envContent
  .replace(/FIREBASE_PROJECT_ID=.*/g, `FIREBASE_PROJECT_ID=${firebaseConfig.project_id}`)
  .replace(/FIREBASE_PRIVATE_KEY=.*/g, `FIREBASE_PRIVATE_KEY="${privateKey}"`)
  .replace(/FIREBASE_CLIENT_EMAIL=.*/g, `FIREBASE_CLIENT_EMAIL=${firebaseConfig.client_email}`);

// Salvar o arquivo .env atualizado
console.log('\n💾 Salvando arquivo .env atualizado...');
fs.writeFileSync(envPath, newEnvContent);

console.log('✅ Arquivo .env atualizado com sucesso!');

console.log('\n📋 Configurações aplicadas:');
console.log(`   FIREBASE_PROJECT_ID=${firebaseConfig.project_id}`);
console.log(`   FIREBASE_CLIENT_EMAIL=${firebaseConfig.client_email}`);
console.log(`   FIREBASE_PRIVATE_KEY=*** (configurado)`);

console.log('\n🧪 Testando configuração...');
console.log('='.repeat(40));

// Executar o teste de configuração
const { execSync } = require('child_process');
try {
  const result = execSync('node test-firebase-config.js', { encoding: 'utf8' });
  console.log(result);
} catch (error) {
  console.log('❌ Erro no teste:');
  console.log(error.stdout);
  console.log(error.stderr);
}

console.log('\n🎉 Configuração concluída!');
console.log('   Você pode iniciar o servidor com: npm run dev');

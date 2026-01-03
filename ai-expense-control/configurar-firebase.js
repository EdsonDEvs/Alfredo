const fs = require('fs');
const path = require('path');

console.log('🔧 Configurador de Firebase - Variáveis Restantes');
console.log('==================================================\n');

// Verificar arquivo .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  console.log('   Execute primeiro: .\\configurar-env.bat');
  process.exit(1);
}

// Ler arquivo .env atual
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('📋 Status atual das variáveis do Firebase:\n');

// Verificar cada variável
const vars = [
  { name: 'FIREBASE_PROJECT_ID', pattern: /FIREBASE_PROJECT_ID=(.+)/ },
  { name: 'FIREBASE_PRIVATE_KEY', pattern: /FIREBASE_PRIVATE_KEY=(.+)/ },
  { name: 'FIREBASE_CLIENT_EMAIL', pattern: /FIREBASE_CLIENT_EMAIL=(.+)/ }
];

let missingVars = [];

vars.forEach(variable => {
  const match = envContent.match(variable.pattern);
  if (match) {
    const value = match[1].trim();
    if (value === 'seu-projeto-firebase' || value.includes('xxxxx')) {
      console.log(`❌ ${variable.name}: Valor padrão (precisa ser configurado)`);
      missingVars.push(variable.name);
    } else {
      console.log(`✅ ${variable.name}: Configurado`);
    }
  } else {
    console.log(`❌ ${variable.name}: Não encontrado`);
    missingVars.push(variable.name);
  }
});

console.log();

if (missingVars.length === 0) {
  console.log('🎉 Todas as variáveis do Firebase estão configuradas!');
  console.log('   Você pode testar com: node test-firebase-config.js');
  process.exit(0);
}

console.log('⚠️  Variáveis que precisam ser configuradas:');
missingVars.forEach(varName => console.log(`   - ${varName}`));

console.log('\n📋 INSTRUÇÕES PARA CONFIGURAR:');
console.log('\n1. Obtenha as credenciais do Firebase:');
console.log('   - Acesse: https://console.firebase.google.com/');
console.log('   - Selecione seu projeto');
console.log('   - Vá em Configurações > Contas de serviço');
console.log('   - Clique em "Gerar nova chave privada"');
console.log('   - Baixe o arquivo JSON');

console.log('\n2. Abra o arquivo JSON baixado e anote:');
console.log('   - "project_id" → FIREBASE_PROJECT_ID');
console.log('   - "client_email" → FIREBASE_CLIENT_EMAIL');

console.log('\n3. Configure o arquivo .env:');
console.log('   - Abra o arquivo .env na pasta ai-expense-control');
console.log('   - Substitua os valores padrão pelos valores reais');

console.log('\n4. Exemplo de configuração:');
console.log('   FIREBASE_PROJECT_ID=lfredo-finance');
console.log('   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lfredo-finance.iam.gserviceaccount.com');

console.log('\n5. Teste a configuração:');
console.log('   node test-firebase-config.js');

console.log('\n🔗 Links úteis:');
console.log('- Firebase Console: https://console.firebase.google.com/');
console.log('- Guia detalhado: GUIA_CHAVE_FIREBASE.md');

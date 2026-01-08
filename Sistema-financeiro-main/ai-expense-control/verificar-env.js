const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando conteúdo do arquivo .env');
console.log('=======================================\n');

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  console.log('❌ Arquivo .env não encontrado!');
  process.exit(1);
}

// Ler o arquivo .env
const envContent = fs.readFileSync(envPath, 'utf8');

console.log('📄 Conteúdo do arquivo .env:\n');
console.log('='.repeat(50));

// Mostrar apenas as linhas do Firebase
const lines = envContent.split('\n');
lines.forEach((line, index) => {
  if (line.includes('FIREBASE_') || line.includes('OPENAI_') || line.includes('N8N_')) {
    console.log(`${index + 1}: ${line}`);
  }
});

console.log('='.repeat(50));

console.log('\n🔧 Verificação detalhada:');

// Verificar cada variável específica
const firebaseVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY', 
  'FIREBASE_CLIENT_EMAIL'
];

firebaseVars.forEach(varName => {
  const pattern = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(pattern);
  
  if (match) {
    const value = match[1].trim();
    console.log(`\n${varName}:`);
    console.log(`  Valor: ${value}`);
    console.log(`  Tamanho: ${value.length} caracteres`);
    
    if (value === 'seu-projeto-firebase' || value.includes('xxxxx')) {
      console.log(`  Status: ❌ Valor padrão (precisa ser configurado)`);
    } else {
      console.log(`  Status: ✅ Configurado`);
    }
  } else {
    console.log(`\n${varName}:`);
    console.log(`  Status: ❌ Não encontrado`);
  }
});

console.log('\n💡 Dicas:');
console.log('- Certifique-se de que não há espaços extras');
console.log('- Verifique se as aspas estão corretas');
console.log('- Confirme se salvou o arquivo após editar');

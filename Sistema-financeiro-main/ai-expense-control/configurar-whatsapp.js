const fs = require('fs');
const path = require('path');

console.log('📱 Configurando WhatsApp Business API...\n');

// Dados da sua configuração
const config = {
  WHATSAPP_PHONE_NUMBER_ID: '766671313191899',
  WHATSAPP_BUSINESS_ACCOUNT_ID: '796070689660148',
  WHATSAPP_API_TOKEN: 'EAASCD7lGkusBPGZBf4kIZCNoHCm4yVuAhgdtvDZBtPWv5P8TL7tsUzs8cccurNKduCZAsZAFRrSLf1IEwkbZAru5DKFqXxyIuH37ITnf1geYmE0HXowU75gu2I4hM02sMRczUytZBIYkqk5ZCZAz6ijflNGYelZAdilg8iq7SGS4Knas9WLI8FuruM2nPsZAyHnyaZAZCSHo0sp8jKDrcbpKLcqO9Pw0ZBBXBcbIoFpDMv9B1EMCLFLgZDZD', // Você precisa gerar este token
  WHATSAPP_WEBHOOK_URL: 'https://sistemafinanceiro.loca.lt/api/whatsapp/webhook', // Substitua pelo seu domínio
  WHATSAPP_VERIFY_TOKEN: 'SantosDrumont' // Token que você está usando
};

console.log('🔧 Dados da sua configuração:');
console.log(`📞 Phone Number ID: ${config.WHATSAPP_PHONE_NUMBER_ID}`);
console.log(`🏢 Business Account ID: ${config.WHATSAPP_BUSINESS_ACCOUNT_ID}`);
console.log(`🔗 Webhook URL: ${config.WHATSAPP_WEBHOOK_URL}`);
console.log(`🔐 Verify Token: ${config.WHATSAPP_VERIFY_TOKEN}\n`);

console.log('⚠️  ATENÇÃO: Você precisa:');
console.log('1. Gerar o Access Token na página do Meta for Developers');
console.log('2. Substituir "seu-dominio.com" pela URL real do seu servidor');
console.log('3. Configurar o webhook na aba "Configuração"\n');

// Ler arquivo .env atual
const envPath = path.join(__dirname, '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Adicionar ou atualizar variáveis do WhatsApp
const whatsappVars = [
  `# WhatsApp Business API`,
  `WHATSAPP_API_TOKEN=${config.WHATSAPP_API_TOKEN}`,
  `WHATSAPP_PHONE_NUMBER_ID=${config.WHATSAPP_PHONE_NUMBER_ID}`,
  `WHATSAPP_WEBHOOK_URL=${config.WHATSAPP_WEBHOOK_URL}`,
  `WHATSAPP_VERIFY_TOKEN=${config.WHATSAPP_VERIFY_TOKEN}`,
  ``
].join('\n');

// Verificar se já existe seção do WhatsApp
if (envContent.includes('WHATSAPP_API_TOKEN')) {
  // Atualizar seção existente
  const lines = envContent.split('\n');
  const newLines = [];
  let inWhatsAppSection = false;
  
  for (const line of lines) {
    if (line.startsWith('# WhatsApp')) {
      inWhatsAppSection = true;
      newLines.push(whatsappVars);
    } else if (inWhatsAppSection && line.startsWith('#')) {
      inWhatsAppSection = false;
      newLines.push(line);
    } else if (!inWhatsAppSection) {
      newLines.push(line);
    }
  }
  
  envContent = newLines.join('\n');
} else {
  // Adicionar nova seção
  envContent += '\n' + whatsappVars;
}

// Salvar arquivo .env
fs.writeFileSync(envPath, envContent);

console.log('✅ Arquivo .env atualizado!');
console.log('\n📋 Próximos passos:');
console.log('1. Gere o Access Token no Meta for Developers');
console.log('2. Cole o token no arquivo .env (WHATSAPP_API_TOKEN=)');
console.log('3. Configure o webhook na aba "Configuração"');
console.log('4. Teste a integração com: npm run test-whatsapp');

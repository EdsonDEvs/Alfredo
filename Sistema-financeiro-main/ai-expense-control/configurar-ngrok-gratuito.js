const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando ngrok gratuito...\n');

// Verificar se ngrok está instalado
function verificarNgrok() {
  try {
    const { execSync } = require('child_process');
    execSync('ngrok version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Instruções para configurar ngrok
function mostrarInstrucoes() {
  console.log('📋 Passos para configurar ngrok (GRATUITO):');
  console.log('');
  console.log('1. Vá para: https://dashboard.ngrok.com/signup');
  console.log('2. Crie uma conta GRATUITA');
  console.log('3. Vá para: https://dashboard.ngrok.com/get-started/your-authtoken');
  console.log('4. Copie seu authtoken');
  console.log('5. Execute: ngrok config add-authtoken SEU_TOKEN_AQUI');
  console.log('6. Execute: ngrok http 3001');
  console.log('');
  console.log('💡 Alternativa: Use Cloudflare Tunnel (também gratuito)');
  console.log('   1. Baixe cloudflared: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/');
  console.log('   2. Execute: cloudflared tunnel --url http://localhost:3001');
  console.log('');
}

// Verificar se o servidor está rodando
async function verificarServidor() {
  try {
    const axios = require('axios');
    await axios.get('http://localhost:3001/api/health');
    console.log('✅ Servidor está rodando na porta 3001');
    return true;
  } catch (error) {
    console.log('❌ Servidor não está rodando!');
    console.log('💡 Execute primeiro: npm start');
    return false;
  }
}

// Função principal
async function main() {
  console.log('🔍 Verificando servidor...');
  const servidorOk = await verificarServidor();
  
  if (!servidorOk) {
    console.log('\n🚨 Primeiro inicie o servidor:');
    console.log('   npm start');
    console.log('\nDepois execute este script novamente.');
    return;
  }
  
  console.log('\n🔍 Verificando ngrok...');
  const ngrokOk = verificarNgrok();
  
  if (!ngrokOk) {
    console.log('❌ ngrok não está instalado');
    console.log('\n📥 Para instalar ngrok:');
    console.log('1. Baixe em: https://ngrok.com/download');
    console.log('2. Extraia ngrok.exe para esta pasta');
    console.log('3. Execute este script novamente');
  } else {
    console.log('✅ ngrok está instalado');
  }
  
  console.log('\n');
  mostrarInstrucoes();
  
  console.log('\n🎯 Para testar o webhook do WhatsApp:');
  console.log('1. Configure o túnel público (ngrok ou cloudflared)');
  console.log('2. Use a URL gerada + /api/whatsapp/webhook');
  console.log('3. Use o verify token: SantosDrumont');
  console.log('4. Teste com: node testar-webhook-local.js');
}

main().catch(console.error);

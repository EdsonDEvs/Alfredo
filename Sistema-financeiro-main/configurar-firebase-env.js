#!/usr/bin/env node

/**
 * Configurador de variáveis de ambiente do Firebase
 * A partir do arquivo JSON do Service Account
 */

import fs from 'fs';
import path from 'path';

function configurarFirebaseEnv() {
  console.log('🔥 Configurando variáveis de ambiente do Firebase...\n');
  
  // Verificar se o arquivo existe
  const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.log('❌ Arquivo serviceAccountKey.json não encontrado!');
    console.log('\n📋 Passos para obter o arquivo:');
    console.log('1. Acesse: https://console.firebase.google.com/project/alfredo-dc71e');
    console.log('2. Vá em "Project Settings" (ícone de engrenagem)');
    console.log('3. Aba "Service accounts"');
    console.log('4. Clique em "Generate new private key"');
    console.log('5. Baixe o arquivo JSON');
    console.log('6. Renomeie para "serviceAccountKey.json"');
    console.log('7. Coloque na raiz do projeto');
    console.log('8. Execute este script novamente');
    return;
  }
  
  try {
    // Ler arquivo JSON
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    // Ler .env atual
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Configurações do Firebase
    const firebaseConfig = `
# Firebase Admin SDK Configuration
FIREBASE_PRIVATE_KEY_ID=${serviceAccount.private_key_id}
FIREBASE_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"
FIREBASE_CLIENT_EMAIL=${serviceAccount.client_email}
FIREBASE_CLIENT_ID=${serviceAccount.client_id}
FIREBASE_CLIENT_CERT_URL=${serviceAccount.client_x509_cert_url}
FIREBASE_PROJECT_ID=${serviceAccount.project_id}
`;
    
    // Adicionar ao .env se não existir
    if (!envContent.includes('FIREBASE_PRIVATE_KEY_ID')) {
      fs.appendFileSync(envPath, firebaseConfig);
      console.log('✅ Variáveis do Firebase adicionadas ao .env!');
    } else {
      console.log('✅ Variáveis do Firebase já existem no .env!');
    }
    
    console.log('\n📋 Configuração concluída!');
    console.log('🔧 Próximos passos:');
    console.log('1. Execute: node get-firebase-token.js');
    console.log('2. Use o token gerado no n8n');
    console.log('3. Configure os nós HTTP Request');
    
  } catch (error) {
    console.error('❌ Erro ao processar arquivo:', error.message);
  }
}

configurarFirebaseEnv();

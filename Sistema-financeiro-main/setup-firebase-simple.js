#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔥 Configurando Firebase...\n');

try {
  // Ler arquivo JSON
  const serviceAccount = JSON.parse(fs.readFileSync('serviceAccountKey.json', 'utf8'));
  
  console.log('✅ Arquivo JSON lido com sucesso!');
  console.log(`📋 Projeto: ${serviceAccount.project_id}`);
  console.log(`📧 Email: ${serviceAccount.client_email}\n`);
  
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
  
  // Adicionar ao .env
  fs.appendFileSync('.env', firebaseConfig);
  console.log('✅ Variáveis do Firebase adicionadas ao .env!');
  
  console.log('\n📋 Configuração concluída!');
  console.log('🔧 Próximos passos:');
  console.log('1. Execute: node get-firebase-token.js');
  console.log('2. Use o token gerado no n8n');
  console.log('3. Configure os nós HTTP Request');
  
} catch (error) {
  console.error('❌ Erro:', error.message);
}

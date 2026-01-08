#!/usr/bin/env node

/**
 * Gerador de Access Token para Firebase
 * Para usar com n8n e REST API
 */

import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Configuração do Firebase Admin
const serviceAccount = {
  type: "service_account",
  project_id: "alfredo-dc71e",
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
};

async function generateAccessToken() {
  try {
    console.log('🔥 Inicializando Firebase Admin...');
    
    // Inicializar Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: 'alfredo-dc71e'
    });
    
    console.log('✅ Firebase Admin inicializado!\n');
    
    // Gerar Access Token
    console.log('🔑 Gerando Access Token...');
    const token = await admin.auth().createCustomToken('n8n-service');
    
    console.log('✅ Access Token gerado!\n');
    console.log('📋 Token para usar no n8n:');
    console.log(`Bearer ${token}\n`);
    
    // Testar conexão com Firestore
    console.log('🧪 Testando conexão com Firestore...');
    const db = admin.firestore();
    const collections = await db.listCollections();
    
    console.log('✅ Conexão com Firestore estabelecida!');
    console.log('📁 Coleções encontradas:');
    collections.forEach(collection => {
      console.log(`  - ${collection.id}`);
    });
    
    console.log('\n🔧 Para usar no n8n:');
    console.log('1. Use o token acima no header Authorization');
    console.log('2. Formato: Bearer <token>');
    console.log('3. URLs das coleções:');
    console.log('   https://firestore.googleapis.com/v1/projects/alfredo-dc71e/databases/(default)/documents/<collection>');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.log('\n🔧 Verifique se as variáveis de ambiente estão configuradas:');
    console.log('- FIREBASE_PRIVATE_KEY_ID');
    console.log('- FIREBASE_PRIVATE_KEY');
    console.log('- FIREBASE_CLIENT_EMAIL');
    console.log('- FIREBASE_CLIENT_ID');
    console.log('- FIREBASE_CLIENT_CERT_URL');
  }
}

generateAccessToken();

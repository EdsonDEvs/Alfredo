const admin = require('firebase-admin');
require('dotenv').config();

async function testFirebaseConfig() {
  console.log('🧪 Testando Configuração do Firebase');
  console.log('=====================================\n');

  // Verificar variáveis de ambiente
  console.log('📋 Verificando variáveis de ambiente:');

  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL'
  ];

  let allVarsPresent = true;

  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value && value !== 'seu-projeto-firebase' && !value.includes('xxxxx')) {
      console.log(`✅ ${varName}: Configurado`);
    } else {
      console.log(`❌ ${varName}: Não configurado ou valor padrão`);
      allVarsPresent = false;
    }
  });

  console.log();

  if (!allVarsPresent) {
    console.log('⚠️  Configure as variáveis de ambiente no arquivo .env');
    console.log('   Consulte o arquivo GUIA_CHAVE_FIREBASE.md para instruções');
    process.exit(1);
  }

  // Testar inicialização do Firebase
  console.log('🔥 Testando inicialização do Firebase Admin SDK...');

  try {
    // Verificar se já foi inicializado
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }

    console.log('✅ Firebase Admin SDK inicializado com sucesso!');
    
    // Testar conexão com Firestore
    console.log('📊 Testando conexão com Firestore...');
    const db = admin.firestore();
    
    // Tentar fazer uma operação simples
    const testDoc = db.collection('test').doc('connection-test');
    await testDoc.set({
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      test: true
    });
    
    console.log('✅ Conexão com Firestore estabelecida!');
    
    // Limpar documento de teste
    await testDoc.delete();
    console.log('🧹 Documento de teste removido');
    
    console.log('\n🎉 Configuração do Firebase está funcionando perfeitamente!');
    console.log('   Você pode iniciar o servidor com: npm run dev');
    
  } catch (error) {
    console.log('❌ Erro ao inicializar Firebase:');
    console.log(`   ${error.message}`);
    
    if (error.message.includes('Failed to parse private key')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('   1. Verifique se a chave privada está formatada corretamente');
      console.log('   2. Substitua todas as quebras de linha por \\n');
      console.log('   3. Mantenha as aspas duplas');
      console.log('   4. Consulte GUIA_CHAVE_FIREBASE.md para detalhes');
    } else if (error.message.includes('project not found')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('   1. Verifique se o FIREBASE_PROJECT_ID está correto');
      console.log('   2. Confirme se o projeto existe no Firebase Console');
    } else if (error.message.includes('invalid_grant')) {
      console.log('\n🔧 SOLUÇÃO:');
      console.log('   1. Verifique se o FIREBASE_CLIENT_EMAIL está correto');
      console.log('   2. Confirme se a conta de serviço tem permissões adequadas');
    }
    
    process.exit(1);
  }
}

// Executar o teste
testFirebaseConfig().catch(console.error);

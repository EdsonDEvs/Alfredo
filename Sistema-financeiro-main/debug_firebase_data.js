// Script para debug dos dados no Firebase
// Execute no console do navegador

console.log('🔍 Debug Firebase Data')

// Verificar se o Firebase está inicializado
if (typeof window !== 'undefined' && window.firebase) {
  console.log('✅ Firebase disponível')
} else {
  console.log('❌ Firebase não disponível')
}

// Verificar dados do usuário
const user = JSON.parse(localStorage.getItem('firebase:authUser:AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx:web:xxxxxxxxxxxxxxxxxxxxxxxx') || '{}')
console.log('👤 Usuário:', user)

// Verificar dados das transações
if (user.uid) {
  console.log('🔍 Verificando transações para usuário:', user.uid)
  
  // Aqui você pode adicionar código para buscar dados diretamente do Firestore
  // Por enquanto, vamos verificar o localStorage
  console.log('📦 LocalStorage keys:', Object.keys(localStorage))
}

// =====================================================
// CONFIGURAÇÃO DO FIREBASE
// Substitui o Supabase como backend
// =====================================================

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Configuração do Firebase
// Você precisará substituir essas credenciais pelas suas do Firebase Console
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "sua-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "seu-projeto",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Inicializar Firebase
console.log('🔥 Firebase: Inicializando com config:', {
  apiKey: firebaseConfig.apiKey ? '✅ Configurado' : '❌ Não configurado',
  authDomain: firebaseConfig.authDomain ? '✅ Configurado' : '❌ Não configurado',
  projectId: firebaseConfig.projectId ? '✅ Configurado' : '❌ Não configurado'
})

const app = initializeApp(firebaseConfig)

// Inicializar serviços
export const auth = getAuth(app)
export const db = getFirestore(app)

console.log('🔥 Firebase: Serviços inicializados com sucesso')

export default app

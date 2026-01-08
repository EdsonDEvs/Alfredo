// =====================================================
// SERVIÇOS DO FIREBASE
// Operações de autenticação e banco de dados
// =====================================================

import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseAuthUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
import { auth, db } from './config'
import type { Transacao, Categoria, Lembrete, Profile, FirebaseUser } from './types'

// =====================================================
// AUTENTICAÇÃO
// =====================================================

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signUp = async (email: string, password: string, fullName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    
    // Criar perfil do usuário
    const profile: Profile = {
      id: userCredential.user.uid,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await addDoc(collection(db, 'profiles'), profile)
    
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)
    
    // Verificar se o perfil já existe
    const profileQuery = query(
      collection(db, 'profiles'),
      where('id', '==', userCredential.user.uid)
    )
    const profileSnapshot = await getDocs(profileQuery)
    
    // Se não existir, criar o perfil
    if (profileSnapshot.empty) {
      const profile: Profile = {
        id: userCredential.user.uid,
        email: userCredential.user.email || '',
        full_name: userCredential.user.displayName || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      await addDoc(collection(db, 'profiles'), profile)
    }
    
    return { user: userCredential.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const signOutUser = async () => {
  try {
    await signOut(auth)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const onAuthChange = (callback: (user: FirebaseAuthUser | null) => void) => {
  return onAuthStateChanged(auth, callback)
}

// =====================================================
// TRANSAÇÕES
// =====================================================

export const getTransacoes = async (userId: string) => {
  try {
    console.log('🔥 Firebase: Buscando transações para usuário:', userId);
    
    const q = query(
      collection(db, 'transacoes'),
      where('userid', '==', userId),
      orderBy('quando', 'desc')
    )
    
    const querySnapshot = await getDocs(q)
    const transacoes: Transacao[] = []
    
    console.log('🔥 Firebase: Documentos encontrados:', querySnapshot.docs.length);
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as Transacao
      transacoes.push({ ...data, id: doc.id })
    }
    
    console.log('🔥 Firebase: Transações processadas:', transacoes.length);
    return { data: transacoes, error: null }
  } catch (error: any) {
    console.error('❌ Firebase: Erro ao buscar transações:', error.message);
    return { data: [], error: error.message }
  }
}

export const addTransacao = async (transacao: Omit<Transacao, 'id' | 'created_at'>) => {
  try {
    const docRef = await addDoc(collection(db, 'transacoes'), {
      ...transacao,
      created_at: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const updateTransacao = async (id: string, transacao: Partial<Transacao>) => {
  try {
    const docRef = doc(db, 'transacoes', id)
    await updateDoc(docRef, {
      ...transacao,
      updated_at: serverTimestamp()
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteTransacao = async (id: string) => {
  try {
    const docRef = doc(db, 'transacoes', id)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// =====================================================
// CATEGORIAS
// =====================================================

export const getCategorias = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'Categoria'),
      where('userid', '==', userId),
      orderBy('nome')
    )
    
    const querySnapshot = await getDocs(q)
    const categorias: Categoria[] = []
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as Categoria
      categorias.push({ ...data, id: doc.id })
    }
    
    return { data: categorias, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export const addCategoria = async (categoria: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    const docRef = await addDoc(collection(db, 'Categoria'), {
      ...categoria,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const updateCategoria = async (id: string, categoria: Partial<Categoria>) => {
  try {
    const docRef = doc(db, 'Categoria', id)
    await updateDoc(docRef, {
      ...categoria,
      updated_at: serverTimestamp()
    })
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteCategoria = async (id: string) => {
  try {
    const docRef = doc(db, 'Categoria', id)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// =====================================================
// LEMBRETES
// =====================================================

export const getLembretes = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'Lembretes'),
      where('userid', '==', userId),
      orderBy('data', 'asc')
    )
    
    const querySnapshot = await getDocs(q)
    const lembretes: Lembrete[] = []
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data() as Lembrete
      lembretes.push({ ...data, id: doc.id })
    }
    
    return { data: lembretes, error: null }
  } catch (error: any) {
    return { data: [], error: error.message }
  }
}

export const addLembrete = async (lembrete: Omit<Lembrete, 'id' | 'created_at'>) => {
  try {
    const docRef = await addDoc(collection(db, 'Lembretes'), {
      ...lembrete,
      created_at: serverTimestamp()
    })
    return { id: docRef.id, error: null }
  } catch (error: any) {
    return { id: null, error: error.message }
  }
}

export const updateLembrete = async (id: string, lembrete: Partial<Lembrete>) => {
  try {
    const docRef = doc(db, 'Lembretes', id)
    await updateDoc(docRef, lembrete)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

export const deleteLembrete = async (id: string) => {
  try {
    const docRef = doc(db, 'Lembretes', id)
    await deleteDoc(docRef)
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

// =====================================================
// PERFIL
// =====================================================

export const getProfile = async (userId: string) => {
  try {
    const q = query(
      collection(db, 'profiles'),
      where('id', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return { data: null, error: 'Perfil não encontrado' }
    }
    
    const doc = querySnapshot.docs[0]
    const data = doc.data() as Profile
    
    return { data: { ...data, id: doc.id }, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export const updateProfile = async (userId: string, profile: Partial<Profile>) => {
  try {
    const q = query(
      collection(db, 'profiles'),
      where('id', '==', userId)
    )
    
    const querySnapshot = await getDocs(q)
    if (querySnapshot.empty) {
      return { error: 'Perfil não encontrado' }
    }
    
    const docRef = doc(db, 'profiles', querySnapshot.docs[0].id)
    await updateDoc(docRef, {
      ...profile,
      updated_at: serverTimestamp()
    })
    
    return { error: null }
  } catch (error: any) {
    return { error: error.message }
  }
}

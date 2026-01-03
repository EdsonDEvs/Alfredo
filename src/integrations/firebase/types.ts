// =====================================================
// TIPOS DO FIREBASE
// Definições de tipos para o Firestore
// =====================================================

export interface FirebaseUser {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface Transacao {
  id?: string
  userid: string
  quando: string
  estabelecimento: string
  valor: number
  detalhes: string
  tipo: 'receita' | 'despesa'
  category_id: string
  created_at: string
  categorias?: {
    id: string
    nome: string
  }
}

export interface Categoria {
  id?: string
  userid: string
  nome: string
  tags: string
  created_at: string
  updated_at: string
}

export interface Lembrete {
  id?: string
  userid: string
  descricao: string
  data: string
  valor: number
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  whatsapp?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

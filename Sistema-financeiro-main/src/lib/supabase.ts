import { createClient } from '@supabase/supabase-js'

// LIMPEZA AUTOMÁTICA: Remover dados do banco antigo
if (typeof window !== 'undefined') {
  const oldProjectIds = ['yjtsyuibemnkjfyonfjt', 'onezabszpxqdjqerrjxo']
  const keys = Object.keys(localStorage)
  let cleaned = false
  
  keys.forEach(key => {
    try {
      const value = localStorage.getItem(key)
      if (value && (oldProjectIds.some(id => value.includes(id)) || key.includes('yjtsyuibemnkjfyonfjt') || key.includes('onezabszpxqdjqerrjxo'))) {
        localStorage.removeItem(key)
        cleaned = true
        console.log('🔴 Removido do localStorage (banco antigo):', key)
      }
    } catch (e) {
      // Ignorar erros
    }
  })
  
  if (cleaned) {
    console.log('✅ Limpeza automática concluída - dados do banco antigo removidos')
  }
}

// Usar variáveis de ambiente ou valores padrão
// IMPORTANTE: O Project ID correto é qgyjfzsihoxtrvrheqvc
// Para obter a chave anônima correta, vá em Settings → API no Supabase Dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgyjfzsihoxtrvrheqvc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'SUBSTITUA_PELA_CHAVE_ANONIMA_DO_SEU_PROJETO'

// Debug: verificar se as variáveis estão sendo carregadas
console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Configurada' : '❌ Não configurada',
  key: supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada',
  usingEnv: !!import.meta.env.VITE_SUPABASE_URL,
  actualUrl: supabaseUrl // Mostrar a URL real sendo usada
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  throw new Error('Variáveis de ambiente do Supabase não configuradas!')
}

// Criar storage customizado para garantir que não há cache do banco antigo
const customStorage = typeof window !== 'undefined' ? {
  getItem: (key: string) => {
    // Verificar se a chave não é do banco antigo
    const value = window.localStorage.getItem(key)
    if (value) {
      try {
        const parsed = JSON.parse(value)
        // Se contém URL do banco antigo, retornar null para forçar nova sessão
        if (JSON.stringify(parsed).includes('yjtsyuibemnkjfyonfjt') || 
            JSON.stringify(parsed).includes('onezabszpxqdjqerrjxo')) {
          console.warn('🔴 Sessão do banco antigo detectada, removendo...')
          window.localStorage.removeItem(key)
          return null
        }
      } catch (e) {
        // Não é JSON, verificar se é string
        if (value.includes('yjtsyuibemnkjfyonfjt') || value.includes('onezabszpxqdjqerrjxo')) {
          console.warn('🔴 Dados do banco antigo detectados, removendo...')
          window.localStorage.removeItem(key)
          return null
        }
      }
    }
    return value
  },
  setItem: (key: string, value: string) => {
    window.localStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    window.localStorage.removeItem(key)
  }
} : undefined

// Criar cliente com configurações de autenticação adequadas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export interface User {
  id: string
  email: string
  created_at: string
  updated_at: string
  full_name?: string
  avatar_url?: string
  subscription_status?: string
  subscription_plan?: string
}

export interface Categoria {
  id: string;
  userid: string;
  nome: string;
  tags: string;
  parent_id?: string; // ID da categoria pai (para subcategorias)
  is_main_category?: boolean; // Se é categoria principal
  icon?: string; // Ícone da categoria
  color?: string; // Cor da categoria
  created_at: string;
  updated_at: string;
  subcategorias?: Categoria[]; // Para categorias com subcategorias
}

export interface Transacao {
  id: number;
  created_at: string;
  quando: string;
  estabelecimento: string;
  valor: number;
  detalhes: string;
  tipo: string;
  userid: string;
  category_id: string;
  categoria: string;
  categorias?: { // Updated to include joined category data with new fields
    id: string;
    nome: string;
    parent_id?: string;
    is_main_category?: boolean;
    icon?: string;
    color?: string;
  };
}

export interface Profile {
  id: string;
  nome?: string | null; // Nome do usuário (coluna real na tabela)
  email?: string | null;
  phone?: string | null; // Telefone (coluna real na tabela)
  whatsapp?: string | null;
  avatar_url?: string | null;
  subscription_status?: string | null;
  subscription_end_date?: string | null;
  currency?: 'BRL' | 'USD' | 'EUR'; // Moeda preferida do usuário
  locale?: string; // Locale preferido do usuário
  created_at: string;
  updated_at: string;
}

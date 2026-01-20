// VERSAO FINAL CORRIGIDA - FORCANDO UPDATE
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isValidSupabaseUrl = (() => {
  if (!supabaseUrl) return false
  try {
    new URL(supabaseUrl)
    return true
  } catch {
    return false
  }
})()

export const isSupabaseConfigured = Boolean(isValidSupabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error('Variáveis de ambiente do Supabase não configuradas ou inválidas.')
}

const resolvedUrl = isValidSupabaseUrl ? supabaseUrl : 'http://localhost:54321'
const resolvedKey = supabaseAnonKey || 'invalid-supabase-anon-key'

export const supabase = createClient(resolvedUrl, resolvedKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured
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

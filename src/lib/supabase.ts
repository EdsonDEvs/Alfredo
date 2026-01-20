import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured) {
  console.error('Variáveis de ambiente do Supabase não configuradas.')
}

const resolvedUrl = supabaseUrl || 'http://localhost:54321'
const resolvedKey = supabaseAnonKey || 'invalid-supabase-anon-key'

export const supabase = createClient(resolvedUrl, resolvedKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
  },
})

export interface Categoria {
  id: string
  userid: string
  nome: string
  tags: string | null
  created_at: string
  updated_at: string
  parent_id?: string | null
  is_main_category?: boolean | null
  icon?: string | null
  color?: string | null
  subcategorias?: Categoria[]
}

export interface Transacao {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  userid: string
  category_id: string
  categoria?: string | null
  external_id?: string | null
  categorias?: {
    id: string
    nome: string
    parent_id?: string | null
    is_main_category?: boolean | null
    icon?: string | null
    color?: string | null
  }
}

export interface Profile {
  id: string
  email?: string | null
  nome?: string | null
  username?: string | null
  phone?: string | null
  whatsapp?: string | null
  avatar_url?: string | null
  assinaturaid?: string | null
  customerid?: string | null
  stripe_customer_id?: string | null
  subscription_id?: string | null
  subscription_status?: string | null
  subscription_end_date?: string | null
  bank_connection_id?: string | null
  phone_number?: string | null
  ativo?: boolean | null
  currency?: 'BRL' | 'USD' | 'EUR' | string | null
  locale?: string | null
  created_at: string
  updated_at: string
}

export interface Lembrete {
  id: number
  userid: string | null
  descricao: string | null
  data: string | null
  valor: number | null
  created_at: string
}

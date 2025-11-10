import { createClient } from '@supabase/supabase-js'

// Variáveis hardcoded temporariamente para teste
const supabaseUrl = 'https://yjtsyuibemnkjfyonfjt.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHN5dWliZW1ua2pmeW9uZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.YTvf5T80OMwhZYgK0vnWULnalBvtGUd68Z2g1LiI0kI'

// Debug: verificar se as variáveis estão sendo carregadas
console.log('🔧 Supabase Config:', {
  url: supabaseUrl ? '✅ Configurada' : '❌ Não configurada',
  key: supabaseAnonKey ? '✅ Configurada' : '❌ Não configurada'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  throw new Error('Variáveis de ambiente do Supabase não configuradas!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
  userid: string;
  full_name?: string;
  avatar_url?: string;
  subscription_status?: string;
  subscription_plan?: string;
  phone_number?: string; // Campo para identificação WhatsApp
  created_at: string;
  updated_at: string;
}

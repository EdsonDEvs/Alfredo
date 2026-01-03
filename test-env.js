// Script para testar variáveis de ambiente
console.log('🧪 Testando variáveis de ambiente...')

// Simular o que o Vite faz
const env = {
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
}

console.log('📋 Variáveis encontradas:')
console.log('VITE_SUPABASE_URL:', env.VITE_SUPABASE_URL ? '✅ Presente' : '❌ Ausente')
console.log('VITE_SUPABASE_ANON_KEY:', env.VITE_SUPABASE_ANON_KEY ? '✅ Presente' : '❌ Ausente')

if (env.VITE_SUPABASE_URL) {
  console.log('🔗 URL Preview:', env.VITE_SUPABASE_URL.substring(0, 30) + '...')
}

if (env.VITE_SUPABASE_ANON_KEY) {
  console.log('🔑 Key Preview:', env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...')
}

// Validações
if (!env.VITE_SUPABASE_URL) {
  console.error('❌ VITE_SUPABASE_URL não configurada!')
}

if (!env.VITE_SUPABASE_ANON_KEY) {
  console.error('❌ VITE_SUPABASE_ANON_KEY não configurada!')
}

if (env.VITE_SUPABASE_URL && !env.VITE_SUPABASE_URL.includes('supabase.co')) {
  console.error('❌ VITE_SUPABASE_URL parece inválida!')
}

if (env.VITE_SUPABASE_ANON_KEY && !env.VITE_SUPABASE_ANON_KEY.startsWith('eyJ')) {
  console.error('❌ VITE_SUPABASE_ANON_KEY parece inválida!')
}

console.log('✅ Teste concluído!')

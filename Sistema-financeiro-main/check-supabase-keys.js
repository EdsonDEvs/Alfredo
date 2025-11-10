// Script para testar chaves do Supabase
const { createClient } = require('@supabase/supabase-js')

// Chave atual
const currentKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqdHN5dWliZW1ua2pmeW9uZmp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwMjEwMDAsImV4cCI6MjA3MDU5NzAwMH0.YTvf5T80OMwhZYgK0vnWULnalBvtGUd68Zg1LiI0kI'

console.log('🔍 Testando chave do Supabase...')
console.log('URL:', 'https://yjtsyuibemnkjfyonfjt.supabase.co')
console.log('Chave:', currentKey.substring(0, 50) + '...')

try {
  const supabase = createClient(
    'https://yjtsyuibemnkjfyonfjt.supabase.co',
    currentKey
  )
  
  console.log('✅ Cliente Supabase criado com sucesso!')
  
  // Testar conexão
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('❌ Erro ao conectar:', error.message)
    } else {
      console.log('✅ Conexão com Supabase funcionando!')
    }
  })
  
} catch (error) {
  console.error('❌ Erro ao criar cliente:', error.message)
}

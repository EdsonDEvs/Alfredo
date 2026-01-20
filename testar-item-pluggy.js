// Script para testar sincronização com itemId específico
import { createClient } from '@supabase/supabase-js'

const itemId = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9'

// Carregar variáveis de ambiente
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qgyjfzsihoxtrvrheqvc.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Testando Item Pluggy:', itemId)
console.log('📊 Verificando no banco de dados...\n')

// Buscar usuários com este itemId
const { data: profiles, error: profilesError } = await supabase
  .from('profiles')
  .select('id, nome, email, bank_connection_id')
  .eq('bank_connection_id', itemId)

if (profilesError) {
  console.error('❌ Erro ao buscar profiles:', profilesError)
  process.exit(1)
}

if (profiles && profiles.length > 0) {
  console.log('✅ ItemId encontrado no banco!')
  profiles.forEach(profile => {
    console.log(`   👤 Usuário: ${profile.nome || profile.email || profile.id}`)
    console.log(`   🔗 ItemId: ${profile.bank_connection_id}`)
    
    // Buscar transações deste usuário que vieram da Pluggy
    supabase
      .from('transacoes')
      .select('id, estabelecimento, valor, tipo, quando, external_id')
      .eq('userid', profile.id)
      .not('external_id', 'is', null)
      .limit(5)
      .then(({ data: transacoes, error: transError }) => {
        if (transError) {
          console.error('   ❌ Erro ao buscar transações:', transError)
          return
        }
        
        if (transacoes && transacoes.length > 0) {
          console.log(`   📊 Transações sincronizadas: ${transacoes.length}`)
          transacoes.forEach(t => {
            console.log(`      - ${t.estabelecimento}: R$ ${t.valor} (${t.tipo}) - ${t.quando}`)
          })
        } else {
          console.log('   ⚠️  Nenhuma transação sincronizada ainda')
          console.log('   💡 Execute a sincronização no Dashboard')
        }
      })
  })
} else {
  console.log('⚠️  ItemId não encontrado no banco de dados')
  console.log('📝 Isso pode significar:')
  console.log('   1. A conexão ainda não foi salva')
  console.log('   2. O itemId está diferente')
  console.log('   3. Não há usuário logado')
  console.log('\n💡 Solução:')
  console.log('   1. Vá para o Dashboard')
  console.log('   2. Clique em "Conectar Conta Bancária" novamente')
  console.log('   3. Ou sincronize manualmente')
}

console.log('\n📋 Próximos passos:')
console.log('   1. Verifique se este itemId está salvo em profiles.bank_connection_id')
console.log('   2. Execute "Sincronizar Agora" no Dashboard')
console.log('   3. Verifique as transações no banco de dados')





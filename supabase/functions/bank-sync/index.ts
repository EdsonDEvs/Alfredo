import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, itemId } = await req.json()
    
    // Configuração do Supabase Client (usa o token do usuário logado)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Pegar credenciais da Pluggy
    const clientId = Deno.env.get('PLUGGY_CLIENT_ID')
    const clientSecret = Deno.env.get('PLUGGY_CLIENT_SECRET')

    // 1. Autenticar na Pluggy para pegar API Key
    const authRes = await fetch('https://api.pluggy.ai/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId, clientSecret })
    })
    const { apiKey } = await authRes.json()

    // --- AÇÃO: CRIAR TOKEN DE CONEXÃO (Para abrir o Widget) ---
    if (action === 'create_token') {
      const tokenRes = await fetch('https://api.pluggy.ai/connect_tokens', {
        method: 'POST',
        headers: { 'X-API-KEY': apiKey, 'Content-Type': 'application/json' }
      })
      const data = await tokenRes.json()
      return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // --- AÇÃO: SINCRONIZAR TRANSAÇÕES ---
    if (action === 'sync_transactions' && itemId) {
      // 1. Salvar o itemId no perfil se ainda não tiver
      const { data: { user } } = await supabaseClient.auth.getUser()
      if (user) {
         await supabaseClient.from('profiles').update({ pluggy_item_id: itemId }).eq('id', user.id)
      }

      // 2. Buscar transações na Pluggy (últimos 30 dias)
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 30);
      const fromString = fromDate.toISOString().split('T')[0]; // YYYY-MM-DD

      const transRes = await fetch(`https://api.pluggy.ai/transactions?accountId=${itemId}&from=${fromString}`, { // Nota: na prática precisa buscar as accounts primeiro, simplifiquei aqui
        headers: { 'X-API-KEY': apiKey }
      })
      
      // Nota: A API real da Pluggy requer listar contas (accounts) primeiro, depois transações por conta.
      // Simplificando o fluxo: Busca Accounts -> Loop nas Accounts -> Busca Transactions
      
      const accountsRes = await fetch(`https://api.pluggy.ai/accounts?itemId=${itemId}`, { headers: { 'X-API-KEY': apiKey } })
      const accountsData = await accountsRes.json()
      
      let allTransactions = []
      
      for (const account of accountsData.results) {
         const trRes = await fetch(`https://api.pluggy.ai/transactions?accountId=${account.id}&from=${fromString}`, { headers: { 'X-API-KEY': apiKey } })
         const trData = await trRes.json()
         allTransactions.push(...trData.results)
      }

      // 3. Inserir no Supabase
      // Precisamos de uma categoria padrão. Pegue o ID da primeira categoria do usuário ou crie uma "Banco/Importado"
      const { data: categoria } = await supabaseClient.from('categorias').select('id').eq('userid', user?.id).limit(1).single()
      const defaultCategoryId = categoria?.id

      if (!defaultCategoryId) throw new Error("Usuário não tem categorias para vincular")

      const transacoesParaInserir = allTransactions.map((t: any) => ({
        userid: user?.id,
        category_id: defaultCategoryId, // Idealmente mapear categorias da Pluggy para as suas
        valor: Math.abs(t.amount),
        tipo: t.amount >= 0 ? 'receita' : 'despesa',
        estabelecimento: t.description,
        detalhes: `Importado via Open Finance (Banco: ${t.providerName || 'N/A'})`,
        quando: new Date(t.date).toISOString(),
        external_id: t.id
      }))

      // Upsert (Inserir ou Atualizar se external_id já existir)
      const { error } = await supabaseClient.from('transacoes').upsert(transacoesParaInserir, { onConflict: 'external_id' })

      if (error) throw error

      return new Response(JSON.stringify({ success: true, count: transacoesParaInserir.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: 'Ação inválida' }), { status: 400, headers: corsHeaders })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders })
  }
})
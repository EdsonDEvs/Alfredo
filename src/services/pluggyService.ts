import { supabase } from '@/lib/supabase'

// Tipos da API Pluggy
interface PluggyTransaction {
  id: string
  description: string
  amount: number
  date: string
  category?: string
  subcategory?: string
  accountId?: string
  type?: 'INCOME' | 'EXPENSE' | 'TRANSFER'
}

interface PluggyAccount {
  id: string
  name: string
  type: string
  balance: number
}

interface PluggyItem {
  id: string
  connector: {
    id: number
    name: string
    primaryColor?: string
    institutionUrl?: string
    country?: string
    type?: string
    imageUrl?: string
    hasMFA?: boolean
    isSandbox?: boolean
    isOpenFinance?: boolean
  }
  createdAt: string
  updatedAt?: string
  status: 'UPDATED' | 'UPDATING' | 'LOGIN_ERROR' | 'WAITING_USER_INPUT' | 'OUTDATED' | 'USER_INPUT_ERROR'
  executionStatus?: 'SUCCESS' | 'CREATED' | 'PARTIAL_SUCCESS' | 'FAILED'
  lastUpdatedAt?: string
  error?: {
    code?: string
    message?: string
  } | null
  clientUserId?: string
  products?: string[]
}

export class PluggyService {
  private static readonly PLUGGY_API_URL = 'https://api.pluggy.ai'
  private static apiKey: string | null = null
  private static clientId: string | null = null
  private static clientSecret: string | null = null
  private static accessToken: string | null = null
  private static tokenExpiresAt: number = 0

  // Obter credenciais das variáveis de ambiente
  private static getCredentials(): { apiKey?: string; clientId: string; clientSecret: string } {
    // Debug: verificar variáveis de ambiente
    console.log('🔍 Debug Pluggy - Verificando variáveis de ambiente:')
    console.log('  VITE_PLUGGY_API_KEY:', import.meta.env.VITE_PLUGGY_API_KEY ? '✅ Configurada' : '❌ Não configurada')
    console.log('  VITE_PLUGGY_CLIENT_ID:', import.meta.env.VITE_PLUGGY_CLIENT_ID ? '✅ Configurada' : '❌ Não configurada')
    console.log('  VITE_PLUGGY_CLIENT_SECRET:', import.meta.env.VITE_PLUGGY_CLIENT_SECRET ? '✅ Configurada' : '❌ Não configurada')

    // Tentar API Key primeiro (método antigo)
    const envApiKey = import.meta.env.VITE_PLUGGY_API_KEY
    if (envApiKey && envApiKey !== 'pk_test_sua_chave_aqui' && envApiKey.trim() !== '') {
      console.log('✅ Usando API Key para autenticação')
      return { apiKey: envApiKey, clientId: '', clientSecret: '' }
    }

    // Usar Client ID e Client Secret (método novo)
    const envClientId = import.meta.env.VITE_PLUGGY_CLIENT_ID
    const envClientSecret = import.meta.env.VITE_PLUGGY_CLIENT_SECRET

    if (envClientId && envClientSecret && envClientId.trim() !== '' && envClientSecret.trim() !== '') {
      console.log('✅ Usando Client ID e Client Secret para autenticação')
      return { clientId: envClientId, clientSecret: envClientSecret }
    }

    console.error('❌ Nenhuma credencial Pluggy encontrada!')
    console.error('📝 Verifique se o arquivo .env.local existe e contém:')
    console.error('   VITE_PLUGGY_CLIENT_ID=seu_client_id')
    console.error('   VITE_PLUGGY_CLIENT_SECRET=seu_client_secret')
    console.error('📝 Após adicionar, REINICIE o servidor (Ctrl+C e depois npm run dev)')

    throw new Error(
      'Credenciais Pluggy não configuradas. Configure VITE_PLUGGY_CLIENT_ID e VITE_PLUGGY_CLIENT_SECRET no .env.local e reinicie o servidor.'
    )
  }

  // Gerar API Key temporária usando Client ID e Client Secret
  private static async getAccessToken(): Promise<string> {
    // Se já temos um token válido, retornar
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    const credentials = this.getCredentials()

    // Se tem API Key, usar diretamente
    if (credentials.apiKey) {
      return credentials.apiKey
    }

    // Gerar API Key temporária com Client ID e Secret
    // Conforme documentação oficial: https://docs.pluggy.ai/docs/use-our-sdks-to-authenticate
    // A API Key expira em 2 horas, vamos renovar 10 minutos antes
    try {
      console.log('🔄 Autenticando na Pluggy com Client ID e Secret...')
      
      const response = await fetch(`${this.PLUGGY_API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let errorMessage = response.statusText
        
        try {
          const errorJson = JSON.parse(errorText)
          errorMessage = errorJson.message || errorJson.error || errorMessage
        } catch {
          errorMessage = errorText || errorMessage
        }
        
        console.error('❌ Erro na resposta da API:', {
          status: response.status,
          statusText: response.statusText,
          message: errorMessage
        })
        
        throw new Error(`Erro ao gerar API Key: ${errorMessage} (Status: ${response.status})`)
      }

      const data = await response.json()
      
      // Conforme documentação, a resposta contém 'apiKey'
      this.accessToken = data.apiKey
      
      if (!this.accessToken) {
        console.error('❌ Resposta da API:', data)
        throw new Error('Resposta da API não contém apiKey válida. Verifique suas credenciais.')
      }

      // API Key expira em 2 horas (7200 segundos), renovar 10 minutos antes (600 segundos)
      // Total: 6600 segundos = 110 minutos
      this.tokenExpiresAt = Date.now() + 6600 * 1000

      console.log('✅ API Key temporária gerada com sucesso (expira em 2 horas)')
      return this.accessToken
    } catch (error: any) {
      console.error('❌ Erro ao gerar API Key:', error)
      
      // Mensagens de erro mais específicas
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Credenciais Pluggy inválidas. Verifique CLIENT_ID e CLIENT_SECRET no .env.local')
      }
      
      throw new Error(`Não foi possível autenticar na Pluggy: ${error.message || 'Erro desconhecido'}`)
    }
  }

  // Obter header de autenticação
  private static async getAuthHeader(): Promise<string> {
    const credentials = this.getCredentials()
    
    // Se tem API Key, usar diretamente
    if (credentials.apiKey) {
      return credentials.apiKey
    }

    // Caso contrário, gerar access token
    return await this.getAccessToken()
  }

  // Configurar credenciais manualmente (opcional)
  static setCredentials(apiKey?: string, clientId?: string, clientSecret?: string) {
    if (apiKey) this.apiKey = apiKey
    if (clientId) this.clientId = clientId
    if (clientSecret) this.clientSecret = clientSecret
  }

  // Gerar connect token (deve ser feito no backend por segurança)
  // Por enquanto, vamos usar uma função que pode ser chamada do frontend
  // mas em produção, isso deve ser feito em uma Edge Function do Supabase
  static async generateConnectToken(userId: string): Promise<string> {
    const authHeader = await this.getAuthHeader()

    try {
      const response = await fetch(`${this.PLUGGY_API_URL}/connect_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': authHeader,
        },
        body: JSON.stringify({
          clientUserId: userId, // ID do usuário no seu sistema
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(`Erro ao gerar connect token: ${error.message || response.statusText}`)
      }

      const data = await response.json()
      return data.connectToken
    } catch (error: any) {
      console.error('Erro ao gerar connect token:', error)
      throw error
    }
  }

  // Salvar o itemId (ID da conexão) no perfil do usuário
  static async saveConnectionId(userId: string, itemId: string): Promise<void> {
    console.log('💾 Salvando itemId no banco de dados...')
    console.log('   UserId:', userId)
    console.log('   ItemId:', itemId)
    
    const { data, error } = await supabase
      .from('profiles')
      .update({ bank_connection_id: itemId })
      .eq('id', userId)
      .select()

    if (error) {
      console.error('❌ Erro ao salvar connection ID:', error)
      throw new Error(`Não foi possível salvar a conexão bancária: ${error.message}`)
    }

    if (data && data.length > 0) {
      console.log('✅ ItemId salvo com sucesso no banco de dados!')
      console.log('   Perfil atualizado:', data[0].nome || data[0].email || data[0].id)
    } else {
      console.warn('⚠️ Nenhum perfil foi atualizado. Verifique se o userId está correto.')
    }
  }

  // Buscar o itemId do perfil do usuário
  static async getConnectionId(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('bank_connection_id')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Erro ao buscar connection ID:', error)
      return null
    }

    return data?.bank_connection_id || null
  }

  // Buscar transações da Pluggy para um itemId
  static async fetchTransactions(
    itemId: string,
    from?: string,
    to?: string
  ): Promise<PluggyTransaction[]> {
    const authHeader = await this.getAuthHeader()

    try {
      // Buscar contas primeiro
      const accountsResponse = await fetch(
        `${this.PLUGGY_API_URL}/accounts?itemId=${itemId}`,
        {
          headers: {
            'X-API-KEY': authHeader,
          },
        }
      )

      if (!accountsResponse.ok) {
        throw new Error('Erro ao buscar contas')
      }

      const accountsData = await accountsResponse.json()
      const accounts: PluggyAccount[] = accountsData.results || []

      if (accounts.length === 0) {
        console.warn('Nenhuma conta encontrada para este itemId')
        return []
      }

      // Buscar transações de todas as contas
      const allTransactions: PluggyTransaction[] = []

      for (const account of accounts) {
        let url = `${this.PLUGGY_API_URL}/transactions?accountId=${account.id}`
        
        if (from) {
          url += `&from=${from}`
        }
        if (to) {
          url += `&to=${to}`
        }

        const transactionsResponse = await fetch(url, {
          headers: {
            'X-API-KEY': authHeader,
          },
        })

        if (transactionsResponse.ok) {
          const transactionsData = await transactionsResponse.json()
          const transactions: PluggyTransaction[] = transactionsData.results || []
          allTransactions.push(...transactions)
        }
      }

      return allTransactions
    } catch (error: any) {
      console.error('Erro ao buscar transações da Pluggy:', error)
      throw error
    }
  }

  // Sincronizar transações da Pluggy para o Supabase
  static async syncTransactions(userId: string): Promise<{ success: number; errors: string[] }> {
    console.log('🔄 Iniciando sincronização de transações...')
    console.log('👤 UserId:', userId)
    
    const itemId = await this.getConnectionId(userId)

    if (!itemId) {
      console.error('❌ Nenhum itemId encontrado no perfil do usuário')
      throw new Error('Nenhuma conexão bancária encontrada. Conecte uma conta primeiro.')
    }

    console.log('✅ ItemId encontrado:', itemId)

    // Buscar transações dos últimos 90 dias
    const to = new Date().toISOString().split('T')[0]
    const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    console.log(`📅 Buscando transações de ${from} até ${to}`)

    const pluggyTransactions = await this.fetchTransactions(itemId, from, to)

    console.log(`📊 Total de transações encontradas na Pluggy: ${pluggyTransactions.length}`)

    if (pluggyTransactions.length === 0) {
      console.log('⚠️ Nenhuma transação encontrada no período dos últimos 90 dias')
      return { success: 0, errors: [] }
    }

    // Buscar categoria padrão
    const { data: categorias } = await supabase
      .from('categorias')
      .select('id')
      .eq('userid', userId)
      .limit(1)

    let defaultCategoryId: string
    if (categorias && categorias.length > 0) {
      defaultCategoryId = categorias[0].id
    } else {
      // Criar categoria padrão se não existir
      const { data: newCategory, error: createError } = await supabase
        .from('categorias')
        .insert({
          userid: userId,
          nome: 'Geral',
        })
        .select()
        .single()

      if (createError || !newCategory) {
        throw new Error('Não foi possível criar categoria padrão')
      }

      defaultCategoryId = newCategory.id
    }

    // Mapear transações da Pluggy para o formato do sistema
    const transacoesToImport = pluggyTransactions.map((t) => {
      // Determinar tipo baseado no amount e type
      let tipo = 'despesa'
      if (t.type === 'INCOME' || (t.amount > 0 && !t.type)) {
        tipo = 'receita'
      } else if (t.amount < 0) {
        tipo = 'despesa'
        // Converter para positivo para despesas
      }

      const valor = Math.abs(t.amount)

      return {
        userid: userId,
        external_id: t.id, // ID da Pluggy para evitar duplicatas
        category_id: defaultCategoryId,
        estabelecimento: t.description || 'Transação bancária',
        detalhes: t.subcategory || t.category || '',
        valor: valor,
        tipo: tipo,
        quando: t.date.split('T')[0], // Apenas a data (YYYY-MM-DD)
      }
    })

    console.log(`📊 Sincronizando ${transacoesToImport.length} transação(ões) para o Supabase...`)

    // Verificar se já existem transações com esses external_ids para evitar duplicatas
    const externalIds = transacoesToImport.map(t => t.external_id).filter(Boolean)
    let existingExternalIds: string[] = []
    
    if (externalIds.length > 0) {
      const { data: existing } = await supabase
        .from('transacoes')
        .select('external_id')
        .eq('userid', userId)
        .in('external_id', externalIds)
      
      existingExternalIds = existing?.map(t => t.external_id).filter(Boolean) || []
      console.log(`📋 Transações já existentes: ${existingExternalIds.length} de ${externalIds.length}`)
    }

    // Filtrar transações que já existem
    const transacoesNovas = transacoesToImport.filter(t => 
      !t.external_id || !existingExternalIds.includes(t.external_id)
    )

    if (transacoesNovas.length === 0) {
      console.log('✅ Todas as transações já estão sincronizadas')
      return { success: 0, errors: [] }
    }

    console.log(`📤 Inserindo ${transacoesNovas.length} nova(s) transação(ões)...`)

    // Inserir transações (sem upsert, já filtramos duplicatas)
    // Dividir em lotes de 1000 (limite do Supabase)
    const batchSize = 1000
    let totalSuccess = 0
    const errors: string[] = []

    for (let i = 0; i < transacoesNovas.length; i += batchSize) {
      const batch = transacoesNovas.slice(i, i + batchSize)
      
      const { data, error } = await supabase
        .from('transacoes')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Erro ao inserir lote ${Math.floor(i / batchSize) + 1}:`, error)
        console.error('❌ Detalhes:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
      } else {
        totalSuccess += data?.length || 0
        console.log(`✅ Lote ${Math.floor(i / batchSize) + 1}: ${data?.length || 0} transação(ões) inserida(s)`)
      }
    }

    if (totalSuccess === 0 && errors.length > 0) {
      throw new Error(`Erro ao sincronizar transações: ${errors.join('; ')}`)
    }

    console.log(`✅ ${totalSuccess} transação(ões) sincronizada(s) com sucesso no Supabase`)

    return {
      success: totalSuccess,
      errors: errors.length > 0 ? errors : [],
    }
  }

  // Verificar status da conexão
  static async checkConnectionStatus(itemId: string): Promise<PluggyItem | null> {
    const authHeader = await this.getAuthHeader()

    try {
      const response = await fetch(`${this.PLUGGY_API_URL}/items/${itemId}`, {
        headers: {
          'X-API-KEY': authHeader,
        },
      })

      if (!response.ok) {
        return null
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao verificar status da conexão:', error)
      return null
    }
  }

  // Remover conexão bancária
  static async removeConnection(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ bank_connection_id: null })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao remover conexão:', error)
      throw new Error(`Não foi possível remover a conexão: ${error.message}`)
    }
  }
}


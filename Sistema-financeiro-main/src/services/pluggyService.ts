import { supabase } from '@/lib/supabase'

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

  private static getCredentials(): { apiKey?: string; clientId: string; clientSecret: string } {
    const envApiKey = import.meta.env.VITE_PLUGGY_API_KEY
    if (envApiKey && envApiKey !== 'pk_test_sua_chave_aqui' && envApiKey.trim() !== '') {
      return { apiKey: envApiKey, clientId: '', clientSecret: '' }
    }

    const envClientId = import.meta.env.VITE_PLUGGY_CLIENT_ID
    const envClientSecret = import.meta.env.VITE_PLUGGY_CLIENT_SECRET

    if (envClientId && envClientSecret && envClientId.trim() !== '' && envClientSecret.trim() !== '') {
      return { clientId: envClientId, clientSecret: envClientSecret }
    }

    throw new Error(
      'Credenciais Pluggy não configuradas. Configure VITE_PLUGGY_CLIENT_ID e VITE_PLUGGY_CLIENT_SECRET.'
    )
  }

  private static async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken
    }

    const credentials = this.getCredentials()

    if (credentials.apiKey) {
      return credentials.apiKey
    }

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

      throw new Error(`Erro ao gerar API Key: ${errorMessage} (Status: ${response.status})`)
    }

    const data = await response.json()
    this.accessToken = data.apiKey

    if (!this.accessToken) {
      throw new Error('Resposta da API não contém apiKey válida. Verifique suas credenciais.')
    }

    this.tokenExpiresAt = Date.now() + 6600 * 1000
    return this.accessToken
  }

  private static async getAuthHeader(): Promise<string> {
    const credentials = this.getCredentials()
    if (credentials.apiKey) {
      return credentials.apiKey
    }
    return await this.getAccessToken()
  }

  static setCredentials(apiKey?: string, clientId?: string, clientSecret?: string) {
    if (apiKey) this.apiKey = apiKey
    if (clientId) this.clientId = clientId
    if (clientSecret) this.clientSecret = clientSecret
  }

  static async generateConnectToken(userId: string): Promise<string> {
    const authHeader = await this.getAuthHeader()

    const response = await fetch(`${this.PLUGGY_API_URL}/connect_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': authHeader,
      },
      body: JSON.stringify({
        clientUserId: userId,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Erro ao gerar connect token: ${error.message || response.statusText}`)
    }

    const data = await response.json()
    return data.connectToken
  }

  static async saveConnectionId(userId: string, itemId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ bank_connection_id: itemId })
      .eq('id', userId)

    if (error) {
      throw new Error(`Não foi possível salvar a conexão bancária: ${error.message}`)
    }
  }

  static async getConnectionId(userId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('bank_connection_id')
      .eq('id', userId)
      .single()

    if (error) {
      return null
    }

    return data?.bank_connection_id || null
  }

  static async fetchTransactions(
    itemId: string,
    from?: string,
    to?: string
  ): Promise<PluggyTransaction[]> {
    const authHeader = await this.getAuthHeader()

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
      return []
    }

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
  }

  static async syncTransactions(userId: string): Promise<{ success: number; errors: string[] }> {
    const itemId = await this.getConnectionId(userId)

    if (!itemId) {
      throw new Error('Nenhuma conexão bancária encontrada. Conecte uma conta primeiro.')
    }

    const to = new Date().toISOString().split('T')[0]
    const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const pluggyTransactions = await this.fetchTransactions(itemId, from, to)

    if (pluggyTransactions.length === 0) {
      return { success: 0, errors: [] }
    }

    const { data: categorias } = await supabase
      .from('categorias')
      .select('id')
      .eq('userid', userId)
      .limit(1)

    let defaultCategoryId: string
    if (categorias && categorias.length > 0) {
      defaultCategoryId = categorias[0].id
    } else {
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

    const transacoesToImport = pluggyTransactions.map((t) => {
      let tipo = 'despesa'
      if (t.type === 'INCOME' || (t.amount > 0 && !t.type)) {
        tipo = 'receita'
      } else if (t.amount < 0) {
        tipo = 'despesa'
      }

      const valor = Math.abs(t.amount)

      return {
        userid: userId,
        external_id: t.id,
        category_id: defaultCategoryId,
        estabelecimento: t.description || 'Transação bancária',
        detalhes: t.subcategory || t.category || '',
        valor: valor,
        tipo: tipo,
        quando: t.date.split('T')[0],
      }
    })

    const externalIds = transacoesToImport.map(t => t.external_id).filter(Boolean)
    let existingExternalIds: string[] = []

    if (externalIds.length > 0) {
      const { data: existing } = await supabase
        .from('transacoes')
        .select('external_id')
        .eq('userid', userId)
        .in('external_id', externalIds)

      existingExternalIds = existing?.map(t => t.external_id).filter(Boolean) || []
    }

    const transacoesNovas = transacoesToImport.filter(t =>
      !t.external_id || !existingExternalIds.includes(t.external_id)
    )

    if (transacoesNovas.length === 0) {
      return { success: 0, errors: [] }
    }

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
        errors.push(`Lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
      } else {
        totalSuccess += data?.length || 0
      }
    }

    if (totalSuccess === 0 && errors.length > 0) {
      throw new Error(`Erro ao sincronizar transações: ${errors.join('; ')}`)
    }

    return {
      success: totalSuccess,
      errors: errors.length > 0 ? errors : [],
    }
  }

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

  static async removeConnection(userId: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ bank_connection_id: null })
      .eq('id', userId)

    if (error) {
      throw new Error(`Não foi possível remover a conexão: ${error.message}`)
    }
  }
}

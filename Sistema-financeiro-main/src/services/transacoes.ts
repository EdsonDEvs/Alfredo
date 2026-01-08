import { supabase, Transacao, Categoria } from '@/lib/supabase'

export class TransacoesService {
  // Buscar todas as transações do usuário com categorias hierárquicas
  static async getTransacoes(userId: string): Promise<Transacao[]> {
    console.log('📊 TransacoesService: Buscando transações para userId:', userId)
    console.log('📊 TransacoesService: Tipo do userId:', typeof userId, 'Comprimento:', userId?.length)
    
    try {
      // Buscar transações SEM CACHE - sempre buscar dados frescos do servidor
      const { data: transacoesData, error: transacoesError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('userid', userId)
        .order('created_at', { ascending: false })
      
      if (transacoesError) {
        console.error('❌ TransacoesService: Erro ao buscar transações:', transacoesError)
        console.error('❌ TransacoesService: Detalhes do erro:', {
          message: transacoesError.message,
          details: transacoesError.details,
          hint: transacoesError.hint,
          code: transacoesError.code
        })
        throw transacoesError
      }
      
      console.log('📊 TransacoesService: Transações encontradas (sem join):', transacoesData?.length || 0)
      
      if (transacoesData && transacoesData.length > 0) {
        console.log('📊 TransacoesService: Primeira transação (raw):', transacoesData[0])
      }
      
      // Se não há transações, retornar vazio
      if (!transacoesData || transacoesData.length === 0) {
        console.log('⚠️ TransacoesService: Nenhuma transação encontrada para userId:', userId)
        return []
      }
      
      // Buscar categorias separadamente e fazer join manual
      const categoryIds = [...new Set(transacoesData.map(t => t.category_id).filter(Boolean))]
      console.log('📊 TransacoesService: Category IDs encontrados:', categoryIds)
      
      let categoriasMap: Record<string, { id: string; nome: string }> = {}
      
      if (categoryIds.length > 0) {
        const { data: categoriasData, error: categoriasError } = await supabase
          .from('categorias')
          .select('id, nome')
          .in('id', categoryIds)
        
        if (categoriasError) {
          console.warn('⚠️ TransacoesService: Erro ao buscar categorias (continuando sem categorias):', categoriasError)
        } else if (categoriasData) {
          categoriasMap = categoriasData.reduce((acc, cat) => {
            acc[cat.id] = { id: cat.id, nome: cat.nome }
            return acc
          }, {} as Record<string, { id: string; nome: string }>)
          console.log('📊 TransacoesService: Categorias carregadas:', Object.keys(categoriasMap).length)
        }
      }
      
      // Adicionar categorias às transações
      const data = transacoesData.map(transacao => ({
        ...transacao,
        categorias: transacao.category_id ? categoriasMap[transacao.category_id] : undefined
      }))

      console.log('✅ TransacoesService: Transações processadas:', data?.length || 0)
      if (data && data.length > 0) {
        console.log('📊 TransacoesService: Primeira transação (final):', data[0])
      }

      return data || []
    } catch (error: any) {
      console.error('❌ TransacoesService: Erro inesperado:', error)
      throw error
    }
  }

  // Buscar transações por período com categorias hierárquicas
  static async getTransacoesPorPeriodo(
    userId: string,
    dataInicio: string,
    dataFim: string
  ): Promise<Transacao[]> {
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        categorias (
          id,
          nome
        )
      `)
      .eq('userid', userId)
      .gte('created_at', dataInicio)
      .lte('created_at', dataFim)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar transações por período:', error)
      throw error
    }

    return data || []
  }

  // Adicionar nova transação
  static async addTransacao(transacao: Omit<Transacao, 'id' | 'created_at'>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .insert([transacao])
      .select()
      .single()

    if (error) {
      console.error('Erro ao adicionar transação:', error)
      throw error
    }

    return data
  }

  // Atualizar transação
  static async updateTransacao(id: number, updates: Partial<Transacao>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar transação:', error)
      throw error
    }

    return data
  }

  // Deletar transação
  static async deleteTransacao(id: number): Promise<void> {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar transação:', error)
      throw error
    }
  }

  // Buscar categorias hierárquicas do usuário
  static async getCategorias(userId: string): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('userid', userId)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar categorias:', error)
      throw error
    }

    // Organizar em estrutura hierárquica
    const categorias = data || []
    const mainCategories = categorias.filter(cat => cat.is_main_category)
    
    mainCategories.forEach(mainCat => {
      mainCat.subcategorias = categorias.filter(subCat => 
        subCat.parent_id === mainCat.id && !subCat.is_main_category
      )
    })

    return mainCategories
  }

  // Buscar apenas categorias principais
  static async getMainCategories(userId: string): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('userid', userId)
      .eq('is_main_category', true)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar categorias principais:', error)
      throw error
    }

    return data || []
  }

  // Buscar subcategorias de uma categoria principal
  static async getSubCategories(userId: string, parentId: string): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('userid', userId)
      .eq('parent_id', parentId)
      .eq('is_main_category', false)
      .order('nome')

    if (error) {
      console.error('Erro ao buscar subcategorias:', error)
      throw error
    }

    return data || []
  }

  // Importar múltiplas transações em lote
  static async importTransacoes(
    userId: string,
    transacoes: Omit<Transacao, 'id' | 'created_at'>[]
  ): Promise<{ success: number; errors: string[] }> {
    if (transacoes.length === 0) {
      return { success: 0, errors: ['Nenhuma transação para importar'] }
    }

    // Buscar ou criar uma categoria padrão (obrigatório - banco não aceita null)
    let defaultCategoryId: string
    
    try {
      // Tentar buscar categorias existentes
      const categorias = await this.getMainCategories(userId)
      
      if (categorias.length > 0) {
        // Usar primeira categoria disponível
        defaultCategoryId = categorias[0].id
      } else {
        // Criar categoria padrão "Geral" se não existir nenhuma
        console.log('Nenhuma categoria encontrada, criando categoria padrão...')
        console.log('🔍 Tentando criar categoria com userId:', userId, 'Tipo:', typeof userId)
        
        // Garantir que userId é string (RLS pode exigir tipo específico)
        const userIdString = String(userId).trim()
        
        // Inserir apenas campos obrigatórios (userid e nome)
        // Não incluir tags, parent_id, is_main_category, icon, color pois podem não existir no banco
        const { data: newCategory, error: createError } = await supabase
          .from('categorias')
          .insert({
            userid: userIdString,
            nome: 'Geral',
          })
          .select()
          .single()

        if (createError) {
          console.error('❌ Erro ao criar categoria:', createError)
          console.error('❌ Detalhes do erro:', {
            message: createError.message,
            details: createError.details,
            hint: createError.hint,
            code: createError.code
          })
          
          // Se for erro de RLS, fornecer mensagem mais clara
          if (createError.message?.includes('row-level security') || createError.message?.includes('RLS')) {
            throw new Error(`Erro de segurança: Não foi possível criar categoria. Verifique se as políticas RLS estão configuradas corretamente no Supabase. Erro: ${createError.message}`)
          }
          
          throw new Error(`Não foi possível criar categoria padrão: ${createError?.message || 'Erro desconhecido'}`)
        }
        
        if (!newCategory) {
          throw new Error('Categoria não foi criada (sem erro, mas sem dados retornados)')
        }
        
        defaultCategoryId = newCategory.id
        console.log('✅ Categoria padrão criada:', defaultCategoryId)
      }
    } catch (error: any) {
      console.error('Erro ao buscar/criar categoria padrão:', error)
      throw new Error(`Não foi possível garantir categoria para importação: ${error.message || 'Erro desconhecido'}`)
    }

    // Adicionar userid e category_id padrão a todas as transações
    // IMPORTANTE: category_id é obrigatório (NOT NULL no banco)
    const transacoesComUserId = transacoes.map(t => {
      // Garantir que category_id seja sempre um UUID válido
      let finalCategoryId: string = defaultCategoryId
      
      // Se a transação já tem um category_id válido, usar esse
      if (t.category_id && t.category_id.trim() !== '' && t.category_id !== 'null' && t.category_id !== 'undefined') {
        // Validar se é um UUID válido
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(t.category_id)) {
          finalCategoryId = t.category_id
        }
      }
      
      return {
        ...t,
        userid: userId,
        category_id: finalCategoryId // Sempre um UUID válido
      }
    })

    // Inserir em lotes (Supabase tem limite de 1000 por vez)
    const batchSize = 1000
    let successCount = 0
    const errors: string[] = []

    for (let i = 0; i < transacoesComUserId.length; i += batchSize) {
      const batch = transacoesComUserId.slice(i, i + batchSize)
      
      try {
        const { data, error } = await supabase
          .from('transacoes')
          .insert(batch)
          .select()

        if (error) {
          errors.push(`Erro no lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
          console.error('Erro ao importar lote:', error)
        } else {
          successCount += data?.length || 0
        }
      } catch (error: any) {
        errors.push(`Erro no lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        console.error('Erro ao importar lote:', error)
      }
    }

    return { success: successCount, errors }
  }
}

import { supabase, Transacao, Categoria, Lembrete } from '@/lib/supabase'

type NovaTransacao = Omit<Transacao, 'id' | 'created_at' | 'categorias' | 'category_id'> & {
  category_id?: string
}
type NovaCategoria = Omit<Categoria, 'id' | 'created_at' | 'updated_at' | 'subcategorias'>
type NovoLembrete = Omit<Lembrete, 'id' | 'created_at'>

export class TransacoesService {
  static async getTransacoes(userId: string): Promise<Transacao[]> {
    let transacoesData: Transacao[] | null = null

    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .eq('userid', userId)
      .order('quando', { ascending: false })

    if (error?.code === '42703') {
      const fallback = await supabase
        .from('transacoes')
        .select('*')
        .eq('userid', userId)
        .order('created_at', { ascending: false })

      if (fallback.error) {
        throw fallback.error
      }

      transacoesData = fallback.data || []
    } else if (error) {
      throw error
    } else {
      transacoesData = data || []
    }

    if (!transacoesData || transacoesData.length === 0) {
      return []
    }

    const categorias = await this.getCategoriasFlat(userId)
    const categoriasMap = categorias.reduce<Record<string, Categoria>>((acc, categoria) => {
      acc[categoria.id] = categoria
      return acc
    }, {})

    return transacoesData.map(transacao => ({
      ...transacao,
      categorias: transacao.category_id ? categoriasMap[transacao.category_id] : undefined,
    }))
  }

  static async getTransacoesPorPeriodo(
    userId: string,
    dataInicio: string,
    dataFim: string
  ): Promise<Transacao[]> {
    const { data, error } = await supabase
      .from('transacoes')
      .select('*')
      .eq('userid', userId)
      .gte('quando', dataInicio)
      .lte('quando', dataFim)
      .order('quando', { ascending: false })

    if (error?.code === '42703') {
      const fallback = await supabase
        .from('transacoes')
        .select('*')
        .eq('userid', userId)
        .gte('created_at', dataInicio)
        .lte('created_at', dataFim)
        .order('created_at', { ascending: false })

      if (fallback.error) {
        throw fallback.error
      }

      return fallback.data || []
    }

    if (error) {
      throw error
    }

    return data || []
  }

  static async addTransacao(transacao: NovaTransacao): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .insert(transacao)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateTransacao(id: number, updates: Partial<Transacao>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transacoes')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async deleteTransacao(id: number): Promise<void> {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  static async getCategoriasFlat(userId: string): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('userid', userId)
      .order('nome')

    if (error) {
      throw error
    }

    return data || []
  }

  static async getCategorias(userId: string): Promise<Categoria[]> {
    const categorias = await this.getCategoriasFlat(userId)

    const hasHierarchy = categorias.some(
      categoria => categoria.is_main_category !== undefined || categoria.parent_id
    )

    if (!hasHierarchy) {
      return categorias
    }

    const mainCategories = categorias.filter(cat =>
      cat.is_main_category === true || (!cat.is_main_category && !cat.parent_id)
    )

    mainCategories.forEach(mainCat => {
      mainCat.subcategorias = categorias.filter(subCat => subCat.parent_id === mainCat.id)
    })

    return mainCategories
  }

  static async getMainCategories(userId: string): Promise<Categoria[]> {
    const categorias = await this.getCategorias(userId)
    const hasHierarchy = categorias.some(categoria => Array.isArray(categoria.subcategorias))

    if (!hasHierarchy) {
      return categorias
    }

    return categorias
  }

  static async getSubCategories(userId: string, parentId: string): Promise<Categoria[]> {
    const categorias = await this.getCategoriasFlat(userId)
    const hasHierarchy = categorias.some(categoria => categoria.parent_id !== undefined)

    if (!hasHierarchy) {
      return []
    }

    return categorias.filter(cat => cat.parent_id === parentId)
  }

  static async addCategoria(categoria: NovaCategoria): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .insert({
        ...categoria,
        tags: categoria.tags ?? null,
      })
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateCategoria(id: string, updates: Partial<Categoria>): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async deleteCategoria(id: string): Promise<void> {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  static async getLembretes(userId: string): Promise<Lembrete[]> {
    const { data, error } = await supabase
      .from('lembretes')
      .select('*')
      .eq('userid', userId)
      .order('data', { ascending: true })

    if (error) {
      throw error
    }

    return data || []
  }

  static async addLembrete(lembrete: NovoLembrete): Promise<Lembrete> {
    const { data, error } = await supabase
      .from('lembretes')
      .insert(lembrete)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async updateLembrete(id: number, updates: Partial<Lembrete>): Promise<Lembrete> {
    const { data, error } = await supabase
      .from('lembretes')
      .update(updates)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return data
  }

  static async deleteLembrete(id: number): Promise<void> {
    const { error } = await supabase
      .from('lembretes')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }
  }

  static async importTransacoes(
    userId: string,
    transacoes: NovaTransacao[]
  ): Promise<{ success: number; errors: string[] }> {
    if (transacoes.length === 0) {
      return { success: 0, errors: ['Nenhuma transação para importar'] }
    }

    let defaultCategoryId: string

    try {
      const categorias = await this.getCategoriasFlat(userId)

      if (categorias.length > 0) {
        defaultCategoryId = categorias[0].id
      } else {
        const { data: newCategory, error: createError } = await supabase
          .from('categorias')
          .insert({
            userid: userId,
            nome: 'Geral',
          })
          .select('*')
          .single()

        if (createError) {
          throw createError
        }

        if (!newCategory) {
          throw new Error('Categoria não foi criada (sem dados retornados)')
        }

        defaultCategoryId = newCategory.id
      }
    } catch (error: any) {
      throw new Error(`Não foi possível garantir categoria para importação: ${error.message || 'Erro desconhecido'}`)
    }

    const transacoesComUserId = transacoes.map(t => {
      let finalCategoryId: string = defaultCategoryId

      if (t.category_id && t.category_id.trim() !== '' && t.category_id !== 'null' && t.category_id !== 'undefined') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
        if (uuidRegex.test(t.category_id)) {
          finalCategoryId = t.category_id
        }
      }

      return {
        ...t,
        userid: userId,
        category_id: finalCategoryId,
      }
    })

    const batchSize = 1000
    let successCount = 0
    const errors: string[] = []

    for (let i = 0; i < transacoesComUserId.length; i += batchSize) {
      const batch = transacoesComUserId.slice(i, i + batchSize)

      try {
        const { data, error } = await supabase
          .from('transacoes')
          .insert(batch)
          .select('*')

        if (error) {
          errors.push(`Erro no lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        } else {
          successCount += data?.length || 0
        }
      } catch (error: any) {
        errors.push(`Erro no lote ${Math.floor(i / batchSize) + 1}: ${error.message}`)
      }
    }

    return { success: successCount, errors }
  }
}

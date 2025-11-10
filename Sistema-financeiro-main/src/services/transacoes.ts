import { supabase, Transacao, Categoria } from '@/lib/supabase'

export class TransacoesService {
  // Buscar todas as transações do usuário com categorias hierárquicas
  static async getTransacoes(userId: string): Promise<Transacao[]> {
    const { data, error } = await supabase
      .from('transacoes')
      .select(`
        *,
        categorias (
          id,
          nome,
          parent_id,
          is_main_category,
          icon,
          color
        )
      `)
      .eq('userid', userId)
      .order('quando', { ascending: false })

    if (error) {
      console.error('Erro ao buscar transações:', error)
      throw error
    }

    return data || []
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
          nome,
          parent_id,
          is_main_category,
          icon,
          color
        )
      `)
      .eq('userid', userId)
      .gte('quando', dataInicio)
      .lte('quando', dataFim)
      .order('quando', { ascending: false })

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
        const { data: newCategory, error: createError } = await supabase
          .from('categorias')
          .insert({
            userid: userId,
            nome: 'Geral',
            tags: 'importacao',
            // is_main_category pode não existir na tabela, então não incluímos
          })
          .select()
          .single()

        if (createError || !newCategory) {
          throw new Error(`Não foi possível criar categoria padrão: ${createError?.message || 'Erro desconhecido'}`)
        }
        
        defaultCategoryId = newCategory.id
        console.log('Categoria padrão criada:', defaultCategoryId)
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

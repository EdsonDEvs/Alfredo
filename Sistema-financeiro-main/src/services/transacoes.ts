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
}

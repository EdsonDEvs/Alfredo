import { supabase } from '@/lib/supabase'
import type { Meta, MetaProgresso, MetaEstatisticas } from '@/types/meta'

export class MetasService {
  static async getMetas(userId: string): Promise<Meta[]> {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erro ao buscar metas:', error)
      throw error
    }
  }

  static async getMeta(id: string): Promise<Meta | null> {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao buscar meta:', error)
      throw error
    }
  }

  static async createMeta(meta: Omit<Meta, 'id' | 'created_at' | 'updated_at'>): Promise<Meta> {
    try {
      const { data, error } = await supabase
        .from('metas')
        .insert({
          ...meta,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao criar meta:', error)
      throw error
    }
  }

  static async updateMeta(id: string, updates: Partial<Meta>): Promise<Meta> {
    try {
      const { data, error } = await supabase
        .from('metas')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      throw error
    }
  }

  static async deleteMeta(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('metas')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
      throw error
    }
  }

  static async updateProgresso(id: string, valor_atual: number): Promise<Meta> {
    try {
      const { data, error } = await supabase
        .from('metas')
        .update({
          valor_atual,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error)
      throw error
    }
  }

  static calcularProgresso(meta: Meta): MetaProgresso {
    const percentual_concluido = Math.min((meta.valor_atual / meta.valor_meta) * 100, 100)
    const valor_restante = Math.max(meta.valor_meta - meta.valor_atual, 0)
    
    const dataFim = new Date(meta.data_fim)
    const hoje = new Date()
    const dias_restantes = Math.ceil((dataFim.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    
    let status_progresso: MetaProgresso['status_progresso'] = 'no_prazo'
    if (percentual_concluido >= 100) {
      status_progresso = 'concluido'
    } else if (dias_restantes < 0) {
      status_progresso = 'atrasado'
    } else if (percentual_concluido > (100 - (dias_restantes / 365) * 100)) {
      status_progresso = 'adiantado'
    }

    return {
      meta,
      percentual_concluido,
      dias_restantes,
      valor_restante,
      status_progresso
    }
  }

  static async getEstatisticas(userId: string): Promise<MetaEstatisticas> {
    try {
      const metas = await this.getMetas(userId)
      
      const total_metas = metas.length
      const metas_ativas = metas.filter(m => m.status === 'ativa').length
      const metas_concluidas = metas.filter(m => m.status === 'concluida').length
      const valor_total_metas = metas.reduce((acc, m) => acc + m.valor_meta, 0)
      const valor_total_economizado = metas.reduce((acc, m) => acc + m.valor_atual, 0)
      const percentual_geral_concluido = valor_total_metas > 0 ? (valor_total_economizado / valor_total_metas) * 100 : 0
      
      const hoje = new Date()
      const trinta_dias = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
      const metas_vencendo_em_30_dias = metas.filter(m => {
        const dataFim = new Date(m.data_fim)
        return dataFim <= trinta_dias && m.status === 'ativa'
      }).length

      // Categoria mais ativa
      const categorias = metas
        .filter(m => m.status === 'ativa')
        .reduce((acc, m) => {
          const cat = m.categoria || 'Sem categoria'
          acc[cat] = (acc[cat] || 0) + 1
          return acc
        }, {} as Record<string, number>)
      
      const categoria_mais_ativa = Object.entries(categorias)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Nenhuma'

      return {
        total_metas,
        metas_ativas,
        metas_concluidas,
        valor_total_metas,
        valor_total_economizado,
        percentual_geral_concluido,
        metas_vencendo_em_30_dias,
        categoria_mais_ativa
      }
    } catch (error) {
      console.error('Erro ao calcular estatísticas:', error)
      throw error
    }
  }
}

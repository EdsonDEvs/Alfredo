export interface Meta {
  id: string
  user_id: string
  titulo: string
  descricao?: string
  valor_meta: number
  valor_atual: number
  tipo: 'economia' | 'investimento' | 'compra' | 'viagem' | 'educacao' | 'outro'
  categoria?: string
  data_inicio: string
  data_fim: string
  status: 'ativa' | 'concluida' | 'cancelada' | 'pausada'
  prioridade: 'baixa' | 'media' | 'alta'
  cor?: string
  icone?: string
  lembretes_ativos: boolean
  created_at: string
  updated_at: string
}

export interface MetaProgresso {
  meta: Meta
  percentual_concluido: number
  dias_restantes: number
  valor_restante: number
  projecao_conclusao?: string
  status_progresso: 'no_prazo' | 'atrasado' | 'adiantado' | 'concluido'
}

export interface MetaCategoria {
  id: string
  nome: string
  cor: string
  icone: string
  total_metas: number
  metas_concluidas: number
}

export interface MetaEstatisticas {
  total_metas: number
  metas_ativas: number
  metas_concluidas: number
  valor_total_metas: number
  valor_total_economizado: number
  percentual_geral_concluido: number
  metas_vencendo_em_30_dias: number
  categoria_mais_ativa: string
}

export type TipoMeta = 'economia' | 'investimento' | 'compra' | 'viagem' | 'educacao' | 'outro'
export type StatusMeta = 'ativa' | 'concluida' | 'cancelada' | 'pausada'
export type PrioridadeMeta = 'baixa' | 'media' | 'alta'

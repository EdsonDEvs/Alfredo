import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/currency'
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  DollarSign,
  BarChart3
} from 'lucide-react'
import type { MetaEstatisticas } from '@/types/meta'

interface MetaStatsProps {
  estatisticas: MetaEstatisticas
}

export function MetaStats({ estatisticas }: MetaStatsProps) {
  const {
    total_metas,
    metas_ativas,
    metas_concluidas,
    valor_total_metas,
    valor_total_economizado,
    percentual_geral_concluido,
    metas_vencendo_em_30_dias,
    categoria_mais_ativa
  } = estatisticas

  const cards = [
    {
      title: 'Total de Metas',
      value: total_metas.toString(),
      icon: <Target className="h-4 w-4" />,
      description: 'Metas criadas',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Metas Ativas',
      value: metas_ativas.toString(),
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Em andamento',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Metas Concluídas',
      value: metas_concluidas.toString(),
      icon: <CheckCircle className="h-4 w-4" />,
      description: 'Objetivos alcançados',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Vencendo em 30 dias',
      value: metas_vencendo_em_30_dias.toString(),
      icon: <AlertCircle className="h-4 w-4" />,
      description: 'Atenção necessária',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{card.title}</p>
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">{card.description}</p>
                </div>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <div className={card.color}>
                    {card.icon}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progresso geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Progresso Geral das Metas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso Total</span>
            <span className="text-sm text-muted-foreground">
              {percentual_geral_concluido.toFixed(1)}%
            </span>
          </div>
          <Progress value={percentual_geral_concluido} className="h-3" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Meta: {formatCurrency(valor_total_metas)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                Economizado: {formatCurrency(valor_total_economizado)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações adicionais */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-orange-600">
                {metas_vencendo_em_30_dias}
              </p>
              <p className="text-sm text-muted-foreground">
                metas vencendo nos próximos 30 dias
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Categoria Mais Ativa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-xl font-semibold">
                {categoria_mais_ativa}
              </p>
              <p className="text-sm text-muted-foreground">
                categoria com mais metas ativas
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

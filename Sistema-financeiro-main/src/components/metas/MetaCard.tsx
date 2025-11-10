import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Edit, 
  Trash2, 
  CheckCircle,
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'
import type { Meta, MetaProgresso } from '@/types/meta'

interface MetaCardProps {
  progresso: MetaProgresso
  onEdit: (meta: Meta) => void
  onDelete: (id: string) => void
  onUpdateProgress: (id: string, valor: number) => void
}

const getStatusIcon = (status: MetaProgresso['status_progresso']) => {
  switch (status) {
    case 'concluido':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'atrasado':
      return <AlertCircle className="h-4 w-4 text-red-600" />
    case 'adiantado':
      return <Zap className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-blue-600" />
  }
}

const getStatusColor = (status: MetaProgresso['status_progresso']) => {
  switch (status) {
    case 'concluido':
      return 'bg-green-100 text-green-800 border-green-200'
    case 'atrasado':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'adiantado':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    default:
      return 'bg-blue-100 text-blue-800 border-blue-200'
  }
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case 'economia':
      return <TrendingUp className="h-4 w-4" />
    case 'investimento':
      return <Target className="h-4 w-4" />
    case 'compra':
      return <Target className="h-4 w-4" />
    case 'viagem':
      return <Target className="h-4 w-4" />
    case 'educacao':
      return <Target className="h-4 w-4" />
    default:
      return <Target className="h-4 w-4" />
  }
}

export function MetaCard({ progresso, onEdit, onDelete, onUpdateProgress }: MetaCardProps) {
  const { meta, percentual_concluido, dias_restantes, valor_restante, status_progresso } = progresso

  const handleQuickUpdate = () => {
    const novoValor = Math.min(meta.valor_atual + (meta.valor_meta * 0.1), meta.valor_meta)
    onUpdateProgress(meta.id, novoValor)
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${meta.cor ? `bg-${meta.cor}-100` : 'bg-blue-100'}`}>
              {getTipoIcon(meta.tipo)}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{meta.titulo}</h3>
              <p className="text-sm text-muted-foreground capitalize">{meta.tipo}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(status_progresso)}
            <Badge variant="outline" className={getStatusColor(status_progresso)}>
              {status_progresso === 'concluido' && 'Concluída'}
              {status_progresso === 'atrasado' && 'Atrasada'}
              {status_progresso === 'adiantado' && 'Adiantada'}
              {status_progresso === 'no_prazo' && 'No Prazo'}
            </Badge>
          </div>
        </div>

        {meta.descricao && (
          <p className="text-sm text-muted-foreground mb-4">{meta.descricao}</p>
        )}

        {/* Progresso */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progresso</span>
            <span className="text-sm text-muted-foreground">
              {percentual_concluido.toFixed(1)}%
            </span>
          </div>
          <Progress value={percentual_concluido} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {formatCurrency(meta.valor_atual)} de {formatCurrency(meta.valor_meta)}
            </span>
            <span className="text-muted-foreground">
              Faltam {formatCurrency(valor_restante)}
            </span>
          </div>
        </div>

        {/* Informações adicionais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {dias_restantes > 0 ? `${dias_restantes} dias` : 'Vencida'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {formatDate(meta.data_fim)}
            </span>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleQuickUpdate}
            disabled={percentual_concluido >= 100}
            className="flex-1"
          >
            +10% Progresso
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(meta)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(meta.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

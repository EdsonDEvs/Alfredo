import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate, formatDateTime, formatTime, formatRelativeTime, formatDateWithDay } from '@/utils/date'

export function DateFormatExamples() {
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exemplos de Formatação de Data</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium">Data Simples</h4>
            <p className="text-sm text-muted-foreground">
              {formatDate(now)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Data com Hora</h4>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(now)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Apenas Hora</h4>
            <p className="text-sm text-muted-foreground">
              {formatTime(now)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Data com Dia da Semana</h4>
            <p className="text-sm text-muted-foreground">
              {formatDateWithDay(now)}
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Tempo Relativo</h4>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Agora: {formatRelativeTime(now)}
              </p>
              <p className="text-sm text-muted-foreground">
                Ontem: {formatRelativeTime(yesterday)}
              </p>
              <p className="text-sm text-muted-foreground">
                Semana passada: {formatRelativeTime(lastWeek)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Filter, Calendar } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardFiltersProps {
  filterMonth: string
  filterYear: string
  setFilterMonth: (month: string) => void
  setFilterYear: (year: string) => void
  filterMode: 'month' | 'period'
  setFilterMode: (mode: 'month' | 'period') => void
  startDate: string
  endDate: string
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
  transactionCount: number
}

export function DashboardFilters({ 
  filterMonth, 
  filterYear, 
  setFilterMonth, 
  setFilterYear,
  filterMode,
  setFilterMode,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  transactionCount 
}: DashboardFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">
                Visão geral das suas finanças pessoais
                {transactionCount > 0 && ` • ${transactionCount} transações encontradas`}
              </p>
            </div>
            
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterMode} onValueChange={(value) => setFilterMode(value as 'month' | 'period')}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Mês/Ano</SelectItem>
                  <SelectItem value="period">Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filterMode === 'month' ? (
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      {new Date(0, i).toLocaleDateString('pt-BR', { month: 'long' })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 2 + i
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex-1">
                <Label htmlFor="startDate">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="endDate">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1"
                  min={startDate}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

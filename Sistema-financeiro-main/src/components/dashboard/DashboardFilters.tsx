
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
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Visão geral das suas finanças pessoais
                {transactionCount > 0 && (
                  <span className="block sm:inline">
                    {transactionCount > 0 && ` • ${transactionCount} transações encontradas`}
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <Select value={filterMode} onValueChange={(value) => setFilterMode(value as 'month' | 'period')}>
                <SelectTrigger className="w-full sm:w-32 text-xs sm:text-sm">
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
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground hidden sm:block" />
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger className="w-full sm:w-40 text-xs sm:text-sm">
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
                <SelectTrigger className="w-full sm:w-24 text-xs sm:text-sm">
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
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-end">
              <div className="flex-1 w-full">
                <Label htmlFor="startDate" className="text-xs sm:text-sm">Data Inicial</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 text-xs sm:text-sm"
                />
              </div>
              <div className="flex-1 w-full">
                <Label htmlFor="endDate" className="text-xs sm:text-sm">Data Final</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 text-xs sm:text-sm"
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

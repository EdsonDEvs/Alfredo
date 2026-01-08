
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, Filter, X, Calendar, DollarSign } from 'lucide-react'
import { useCategories } from '@/hooks/useCategories'

interface TransactionFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  categoryFilter: string
  onCategoryFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  minValue: string
  onMinValueChange: (value: string) => void
  maxValue: string
  onMaxValueChange: (value: string) => void
  onClearFilters: () => void
}

export function TransactionFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  dateFilter,
  onDateFilterChange,
  minValue,
  onMinValueChange,
  maxValue,
  onMaxValueChange,
  onClearFilters
}: TransactionFiltersProps) {
  const { categories, isLoading } = useCategories()
  const hasFilters = searchTerm || typeFilter || categoryFilter || dateFilter || minValue || maxValue

  const handleTypeChange = (value: string) => {
    onTypeFilterChange(value === 'all' ? '' : value)
  }

  const handleCategoryChange = (value: string) => {
    onCategoryFilterChange(value === 'all' ? '' : value)
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Primeira linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar por estabelecimento..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={typeFilter || 'all'} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="receita">Receitas</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter || 'all'} onValueChange={handleCategoryChange} disabled={isLoading}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={isLoading ? "Carregando..." : "Categoria"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas categorias</SelectItem>
            {categories?.map((categoria) => (
              <SelectItem key={categoria.id} value={categoria.id}>
                {categoria.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={dateFilter || 'all'} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os períodos</SelectItem>
            <SelectItem value="today">Hoje</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mês</SelectItem>
            <SelectItem value="year">Este ano</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button variant="outline" onClick={onClearFilters} size="icon">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Segunda linha de filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 sm:max-w-[200px]">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="number"
            placeholder="Valor mínimo"
            value={minValue}
            onChange={(e) => onMinValueChange(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="relative flex-1 sm:max-w-[200px]">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="number"
            placeholder="Valor máximo"
            value={maxValue}
            onChange={(e) => onMaxValueChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
    </div>
  )
}

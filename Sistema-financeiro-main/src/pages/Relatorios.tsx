
import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useTransacoesSync } from '@/hooks/useTransacoesSync'
import { useFormattedCurrency } from '@/hooks/useFormattedCurrency'
import type { Transacao } from '@/lib/supabase'
import { usePlanAccess } from '@/hooks/usePlanAccess'
import { useNavigate } from 'react-router-dom'

export default function Relatorios() {
  const { transacoes: transactions, loading: isLoading } = useTransacoesSync()
  const { format } = useFormattedCurrency()
  const { hasAccess, loading: planLoading } = usePlanAccess()
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    categoryId: 'all'
  })

  const availableYears = useMemo(() => {
    const years = new Set<number>()
    transactions.forEach((transaction) => {
      const rawDate = transaction.quando || transaction.created_at
      if (!rawDate) return
      const parsed = new Date(rawDate)
      if (!Number.isNaN(parsed.getTime())) {
        years.add(parsed.getFullYear())
      }
    })
    if (years.size === 0) {
      years.add(new Date().getFullYear())
    }
    return Array.from(years).sort((a, b) => b - a)
  }, [transactions])

  const [irYear, setIrYear] = useState<string>(() => `${new Date().getFullYear()}`)
  const [deducoes, setDeducoes] = useState('0')
  const [irRetido, setIrRetido] = useState('0')

  const parseAmount = (value: string) => {
    const normalized = value.replace(',', '.')
    const parsed = Number(normalized)
    return Number.isFinite(parsed) ? parsed : 0
  }

  const rendaTributavel = useMemo(() => {
    const selectedYear = Number(irYear)
    return transactions
      .filter((transaction) => transaction.tipo === 'receita')
      .filter((transaction) => {
        const rawDate = transaction.quando || transaction.created_at
        if (!rawDate) return false
        const parsed = new Date(rawDate)
        return !Number.isNaN(parsed.getTime()) && parsed.getFullYear() === selectedYear
      })
      .reduce((acc, transaction) => acc + (transaction.valor || 0), 0)
  }, [transactions, irYear])

  const IRPF_TABLE = [
    { limit: 22847.76, rate: 0, deduction: 0 },
    { limit: 33919.8, rate: 0.075, deduction: 1713.58 },
    { limit: 45012.6, rate: 0.15, deduction: 4257.57 },
    { limit: 55976.16, rate: 0.225, deduction: 7633.51 },
    { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduction: 10432.32 },
  ]

  const baseCalculo = Math.max(0, rendaTributavel - parseAmount(deducoes))
  const faixa = IRPF_TABLE.find((entry) => baseCalculo <= entry.limit) || IRPF_TABLE[IRPF_TABLE.length - 1]
  const impostoDevido = Math.max(0, baseCalculo * faixa.rate - faixa.deduction)
  const saldo = impostoDevido - parseAmount(irRetido)

  // Filtrar transações
  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filters.type === 'all' || transaction.tipo === filters.type
    const matchesCategory = filters.categoryId === 'all' || transaction.category_id === filters.categoryId
    return matchesType && matchesCategory
  })

  // Calcular resumo
  const receitas = filteredTransactions
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + (t.valor || 0), 0)
  
  const despesas = filteredTransactions
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + (t.valor || 0), 0)
  
  const saldo = receitas - despesas

  // Agrupar por categoria
  const byCategory = filteredTransactions.reduce((acc, transaction) => {
    const categoryName = transaction.categorias?.nome || transaction.category_id || 'Sem categoria'
    const valor = transaction.valor || 0
    
    if (!acc[categoryName]) {
      acc[categoryName] = { receitas: 0, despesas: 0, total: 0 }
    }
    
    if (transaction.tipo === 'receita') {
      acc[categoryName].receitas += valor
    } else {
      acc[categoryName].despesas += valor
    }
    
    acc[categoryName].total = acc[categoryName].receitas - acc[categoryName].despesas
    
    return acc
  }, {} as Record<string, { receitas: number; despesas: number; total: number }>)

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      type: 'all',
      categoryId: 'all'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Relatórios Financeiros</h1>
          <p className="text-gray-600">Análises personalizadas das suas transações</p>
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Limpar Filtros
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={filters.type} onValueChange={(value) => setFilters({...filters, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="categoryId">Categoria</Label>
              <Select value={filters.categoryId} onValueChange={(value) => setFilters({...filters, categoryId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {Object.keys(byCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resumo Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">{format(receitas)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">{format(despesas)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {format(saldo)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Imposto de Renda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Imposto de Renda (Pro)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!planLoading && !hasAccess('pro') ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Este recurso está disponível apenas no plano Pro ou superior.
              </p>
              <Button onClick={() => navigate('/plano')}>Ver planos</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Ano-base</Label>
                <Select value={irYear} onValueChange={setIrYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={`${year}`}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rendimentos tributáveis (ano)</Label>
                <Input value={format(rendaTributavel)} disabled />
              </div>

              <div className="space-y-2">
                <Label>Deduções totais (ano)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={deducoes}
                  onChange={(event) => setDeducoes(event.target.value)}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label>IR retido na fonte</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={irRetido}
                  onChange={(event) => setIrRetido(event.target.value)}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <Label>Base de cálculo</Label>
                <Input value={format(baseCalculo)} disabled />
              </div>

              <div className="space-y-2">
                <Label>Imposto devido (estimado)</Label>
                <Input value={format(impostoDevido)} disabled />
              </div>

              <div className="md:col-span-2 flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo</p>
                  <p className="text-lg font-semibold">
                    {saldo >= 0 ? 'A pagar' : 'A restituir'}: {format(Math.abs(saldo))}
                  </p>
                </div>
                <Badge variant={saldo >= 0 ? 'destructive' : 'default'}>
                  {saldo >= 0 ? 'Imposto devido' : 'Restituição'}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground md:col-span-2">
                Estimativa baseada na tabela anual padrão. Revise a tabela vigente e suas deduções com um contador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(byCategory).map(([category, data]) => (
              <div key={category} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{category}</h3>
                  <div className="flex space-x-4 text-sm text-gray-600">
                    <span>Receitas: {format(data.receitas)}</span>
                    <span>Despesas: {format(data.despesas)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${data.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {format(data.total)}
                  </p>
                  <Badge variant={data.total >= 0 ? 'default' : 'destructive'}>
                    {data.total >= 0 ? 'Positivo' : 'Negativo'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Transações ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transaction.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transaction.tipo === 'receita' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.estabelecimento}</p>
                      <p className="text-sm text-gray-600">{transaction.quando}</p>
                      <Badge variant="outline">
                        {transaction.categorias?.nome || 'Sem categoria'}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.tipo === 'receita' ? '+' : '-'}{format(transaction.valor)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { FileText, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { formatCurrency } from '@/utils/currency'
import { toast } from '@/hooks/use-toast'
import type { Transacao } from '@/lib/supabase'

export default function Relatorios() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    type: 'all',
    categoryId: 'all'
  })

  // Carregar transações
  const fetchTransactions = async () => {
    try {
      setIsLoading(true)
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const data = await TransacoesService.getTransacoes(user.id)
      setTransactions(data || [])
    } catch (error: any) {
      console.error('Erro ao carregar transações:', error)
      toast({
        title: "Erro ao carregar transações",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchTransactions()
    }
  }, [user])

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
                <p className="text-2xl font-bold text-green-600">{formatCurrency(receitas)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
              <TrendingDown className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(despesas)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(saldo)}
                </p>
              </div>
            </div>
          </div>
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
                    <span>Receitas: {formatCurrency(data.receitas)}</span>
                    <span>Despesas: {formatCurrency(data.despesas)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${data.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(data.total)}
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
                      {transaction.tipo === 'receita' ? '+' : '-'}{formatCurrency(transaction.valor)}
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

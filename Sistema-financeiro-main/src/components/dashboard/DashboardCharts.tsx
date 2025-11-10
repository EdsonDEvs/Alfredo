
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/utils/currency'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import type { Categoria } from '@/lib/supabase'
import { TransacoesService } from '@/services/transacoes'

interface DashboardChartsProps {
  transacoes: any[]
}

const COLORS = ['#4361ee', '#7209b7', '#f72585', '#4cc9f0', '#4895ef', '#4361ee']

export function DashboardCharts({ transacoes }: DashboardChartsProps) {
  const { user } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // Buscar categorias do usuário via Supabase
  useEffect(() => {
    const fetchCategorias = async () => {
      if (!user?.id) return
      try {
        const data = await TransacoesService.getMainCategories(user.id)
        setCategorias(data)
      } catch (error) {
        console.error('Erro ao buscar categorias:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategorias()
  }, [user?.id])

  const getChartData = () => {
    const categoriasMap: { [key: string]: number } = {}

    transacoes.forEach((t: any) => {
      if (t.valor && t.tipo === 'despesa') {
        // Buscar o nome da categoria pelo category_id (relacionamento carregado via service)
        const categoriaNome = t?.categorias?.nome || 'Sem Categoria'
        categoriasMap[categoriaNome] = (categoriasMap[categoriaNome] || 0) + Math.abs(t.valor)
      }
    })

    return Object.entries(categoriasMap).map(([categoria, valor]) => ({
      categoria,
      valor
    }))
  }

  const getPieData = () => {
    const receitas = transacoes.filter((t: any) => t.tipo === 'receita').reduce((sum: number, t: any) => sum + (t.valor || 0), 0)
    const despesas = transacoes.filter((t: any) => t.tipo === 'despesa').reduce((sum: number, t: any) => sum + (t.valor || 0), 0)

    return [
      { name: 'Receitas', value: receitas },
      { name: 'Despesas', value: Math.abs(despesas) }
    ]
  }

  const totalReceitas = transacoes.filter((t: any) => t.tipo === 'receita').reduce((sum: number, t: any) => sum + (t.valor || 0), 0)
  const totalDespesas = transacoes.filter((t: any) => t.tipo === 'despesa').reduce((sum: number, t: any) => sum + (t.valor || 0), 0)
  const saldo = totalReceitas - totalDespesas

  const stats = {
    totalReceitas,
    totalDespesas,
    saldo,
    transacoesCount: transacoes.length,
    lembretesCount: 0
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="md:col-span-2 lg:col-span-1">
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
          <CardDescription>
            Distribuição dos seus gastos no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Carregando categorias...</p>
                </div>
              </div>
            ) : getChartData().length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="mt-2 text-sm">Nenhum gasto encontrado</p>
                  <p className="text-xs">Adicione transações de despesa para ver o gráfico</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="categoria" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="valor" fill="#4361ee" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
          <CardDescription>
            Proporção entre receitas e despesas do período
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieData()}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                >
                  {getPieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Resumo do Período</CardTitle>
          <CardDescription>
            Estatísticas detalhadas do período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Receitas</span>
              <span className="text-green-600 font-semibold">
                {formatCurrency(stats.totalReceitas)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Despesas</span>
              <span className="text-red-600 font-semibold">
                {formatCurrency(stats.totalDespesas)}
              </span>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Saldo</span>
                <span className={`font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(saldo)}
                </span>
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span>Total de Transações</span>
                <span className="font-semibold">{transacoes.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { toast } from '@/hooks/use-toast'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import type { Transacao } from '@/lib/supabase'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'

export default function Dashboard() {
  console.log('📊 Dashboard: Componente sendo renderizado')
  
  const { user } = useAuth()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados dos filtros - Configurar para mostrar dados mais recentes
  const [filterMonth, setFilterMonth] = useState('7') // Agosto (0-11, então 7 = agosto)
  const [filterYear, setFilterYear] = useState('2025')

  // Função para buscar dados
  const fetchData = async () => {
    try {
      console.log('📊 Dashboard: Iniciando fetchData...')
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      console.log('📊 Dashboard: Buscando transações para usuário:', user.id)
      // Buscar transações usando Supabase
      const transacoesData = await TransacoesService.getTransacoes(user.id)

      console.log('📊 Dashboard: Transações carregadas:', transacoesData)
      setTransacoes(transacoesData || [])
      
    } catch (error: any) {
      console.error('📊 Dashboard: Erro detalhado:', error)
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      console.log('📊 Dashboard: fetchData finalizado, loading:', false)
      setLoading(false)
    }
  }

  // Carregar dados quando o componente montar
  useEffect(() => {
    console.log('📊 Dashboard: Estado atual:', {
      user: user?.id,
      loading,
      transacoesCount: transacoes.length,
      filterMonth,
      filterYear
    })
    
    if (user?.id) {
      fetchData()
    }
  }, [user, filterMonth, filterYear])

  // Filtrar transações por mês e ano
  const filteredTransacoes = useMemo(() => {
    if (!transacoes.length) return []
    
    return transacoes.filter(transacao => {
      const transacaoDate = new Date(transacao.quando)
      const transacaoMonth = transacaoDate.getMonth().toString()
      const transacaoYear = transacaoDate.getFullYear().toString()
      
      const matches = transacaoMonth === filterMonth && transacaoYear === filterYear
      
      console.log('📊 Dashboard: Filtrando transação:', 
                  'Data:', transacao.quando, 
                  'Mês:', transacaoMonth, 
                  'Ano:', transacaoYear, 
                  'Matches:', matches)
      
      return matches
    })
  }, [transacoes, filterMonth, filterYear])

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalReceitas = filteredTransacoes
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const totalDespesas = filteredTransacoes
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const saldo = totalReceitas - totalDespesas
    
    return {
      totalReceitas,
      totalDespesas,
      saldo,
      transacoesCount: filteredTransacoes.length,
      lembretesCount: 0 // Lembretes removidos, então sempre 0
    }
  }, [filteredTransacoes])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DashboardFilters 
        filterMonth={filterMonth}
        filterYear={filterYear}
        setFilterMonth={setFilterMonth}
        setFilterYear={setFilterYear}
        transactionCount={filteredTransacoes.length}
      />
      
      <DashboardStats stats={stats} />

      {/* Gráficos do período */}
      <DashboardCharts transacoes={filteredTransacoes} />
      
      <div className="text-center text-gray-500">
        <p>Dashboard funcionando com Supabase!</p>
        <p>Transações encontradas: {transacoes.length}</p>
        <p>Transações filtradas: {filteredTransacoes.length}</p>
      </div>
    </div>
  )
}

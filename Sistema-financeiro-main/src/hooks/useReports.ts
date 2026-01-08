
import { useState, useMemo, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import type { Transacao } from '@/lib/supabase'

export interface ReportTransaction {
  id: number
  created_at: string
  quando: string | null
  estabelecimento: string | null
  valor: number | null
  detalhes: string | null
  tipo: string | null
  category_id: string
  categorias?: {
    id: string
    nome: string
  }
}

export interface ReportFilters {
  startDate: string
  endDate: string
  type: string
  categoryId: string
  period: 'day' | 'month' | 'year' | 'custom'
}

export function useReports() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState<ReportFilters>({
    startDate: '',
    endDate: '',
    type: '',
    categoryId: '',
    period: 'year' // Mudar para 'year' para mostrar todos os dados
  })

  // Buscar transações do Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        console.log('📊 useReports: Buscando transações para usuário:', user.id)
        setIsLoading(true)
        
        const data = await TransacoesService.getTransacoes(user.id)
        
        console.log('📊 useReports: Transações carregadas:', data)
        setTransactions(data || [])
      } catch (error) {
        console.error('📊 useReports: Erro ao buscar transações:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [user?.id])

  // Filtrar transações baseado nos filtros
  const filteredTransactions = useMemo(() => {
    console.log('📊 useReports: Filtrando transações...')
    console.log('📊 useReports: Total de transações:', transactions.length)
    console.log('📊 useReports: Filtros atuais:', filters)
    
    return transactions.filter(transaction => {
      // Filtro de tipo
      if (filters.type && transaction.tipo !== filters.type) {
        console.log('📊 useReports: Transação filtrada por tipo:', transaction.estabelecimento)
        return false
      }
      
      // Filtro de categoria
      if (filters.categoryId && transaction.category_id !== filters.categoryId) {
        console.log('📊 useReports: Transação filtrada por categoria:', transaction.estabelecimento)
        return false
      }
      
      // Filtro de data - Temporariamente desabilitado para debug
      /*
      if (transaction.quando) {
        const transactionDate = new Date(transaction.quando)
        const now = new Date()
        
        switch (filters.period) {
          case 'day':
            if (transactionDate.toDateString() !== now.toDateString()) return false
            break
          case 'month':
            if (transactionDate.getMonth() !== now.getMonth() || 
                transactionDate.getFullYear() !== now.getFullYear()) return false
            break
          case 'year':
            if (transactionDate.getFullYear() !== now.getFullYear()) return false
            break
          case 'custom':
            if (filters.startDate && filters.endDate) {
              const startDate = new Date(filters.startDate)
              const endDate = new Date(filters.endDate)
              if (transactionDate < startDate || transactionDate > endDate) return false
            }
            break
        }
      }
      */
      
      console.log('📊 useReports: Transação incluída:', transaction.estabelecimento, transaction.quando)
      return true
    })
  }, [transactions, filters])

  // Calculate summary data
  const summaryData = useMemo(() => {
    console.log('📊 useReports: Calculando resumo com', filteredTransactions.length, 'transações filtradas')
    
    const receitas = filteredTransactions
      .filter(t => t.tipo === 'receita')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const despesas = filteredTransactions
      .filter(t => t.tipo === 'despesa')
      .reduce((acc, t) => acc + (t.valor || 0), 0)
    
    const saldo = receitas - despesas

    console.log('📊 useReports: Resumo calculado - Receitas:', receitas, 'Despesas:', despesas, 'Saldo:', saldo)

    // Group by category
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

    // Group by type for chart data
    const chartData = [
      { name: 'Receitas', value: receitas, color: '#22c55e' },
      { name: 'Despesas', value: despesas, color: '#ef4444' }
    ]

    return {
      receitas,
      despesas,
      saldo,
      byCategory,
      chartData,
      totalTransactions: filteredTransactions.length
    }
  }, [filteredTransactions])

  return {
    transactions: filteredTransactions,
    isLoading,
    filters,
    setFilters,
    summaryData
  }
}

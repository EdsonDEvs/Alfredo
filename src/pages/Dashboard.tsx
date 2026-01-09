
import { useState, useMemo, useEffect } from 'react'
import { useTransacoesSync } from '@/hooks/useTransacoesSync'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { ExcelImporter } from '@/components/dashboard/ExcelImporter'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { BankConnector } from '@/components/dashboard/BankConnector'
import { Button } from '@/components/ui/button'
import { RefreshCw, Download } from 'lucide-react'
import { exportToExcel } from '@/services/excelImporter'
import { toast } from '@/hooks/use-toast'

export default function Dashboard() {
  const { transacoes, loading, refresh, lastUpdate } = useTransacoesSync()
  
  // Estados dos filtros - Usar mês e ano atual por padrão
  const now = new Date()
  const [filterMode, setFilterMode] = useState<'month' | 'period'>('month')
  const [filterMonth, setFilterMonth] = useState(now.getMonth().toString())
  const [filterYear, setFilterYear] = useState(now.getFullYear().toString())
  
  // Estados para filtro por período
  const [startDate, setStartDate] = useState(() => {
    // Data inicial padrão: primeiro dia do mês atual
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
    return firstDay.toISOString().split('T')[0]
  })
  const [endDate, setEndDate] = useState(() => {
    // Data final padrão: último dia do mês atual
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    return lastDay.toISOString().split('T')[0]
  })
  
  // Recarregar quando lastUpdate mudar (dados foram atualizados)
  useEffect(() => {
    // Não precisa fazer nada, o useMemo já vai recalcular automaticamente
  }, [lastUpdate])

  // Filtrar transações por mês/ano ou período
  const filteredTransacoes = useMemo(() => {
    if (!transacoes.length) return []
    
    return transacoes.filter(transacao => {
      if (!transacao.quando) return false
      
      const transacaoDate = new Date(transacao.quando)
      if (isNaN(transacaoDate.getTime())) return false
      
      if (filterMode === 'month') {
        // Filtro por mês/ano
        const transacaoMonth = transacaoDate.getMonth().toString()
        const transacaoYear = transacaoDate.getFullYear().toString()
        return transacaoMonth === filterMonth && transacaoYear === filterYear
      } else {
        // Filtro por período
        if (!startDate || !endDate) return true // Se não houver datas, mostrar todas
        
        const transacaoDateStr = transacaoDate.toISOString().split('T')[0]
        const start = new Date(startDate)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999) // Incluir o dia inteiro da data final
        
        return transacaoDate >= start && transacaoDate <= end
      }
    })
  }, [transacoes, filterMode, filterMonth, filterYear, startDate, endDate])

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
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho com botão de importação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">
            Visão geral das suas finanças pessoais
            {filteredTransacoes.length > 0 && ` • ${filteredTransacoes.length} transações encontradas`}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Total: {transacoes.length} transações | Atualizado: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              try {
                exportToExcel(filteredTransacoes)
                toast({
                  title: "Exportação concluída",
                  description: `Planilha com ${filteredTransacoes.length} transação(ões) foi baixada com sucesso!`,
                })
              } catch (error: any) {
                toast({
                  title: "Erro ao exportar",
                  description: error.message || "Ocorreu um erro ao exportar as transações",
                  variant: "destructive",
                })
              }
            }}
            disabled={loading || filteredTransacoes.length === 0}
            className="flex-1 sm:flex-initial text-xs sm:text-sm"
          >
            <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Exportar</span>
            <span className="sm:hidden">Exportar</span>
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
            <span className="sm:hidden">Atualizar</span>
          </Button>
          <ExcelImporter onImportComplete={refresh} />
        </div>
      </div>

      <DashboardFilters 
        filterMonth={filterMonth}
        filterYear={filterYear}
        setFilterMonth={setFilterMonth}
        setFilterYear={setFilterYear}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        transactionCount={filteredTransacoes.length}
      />
      
      {/* Informação sobre filtros */}
      {transacoes.length > 0 && filteredTransacoes.length === 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Nenhuma transação encontrada para o período selecionado.
            {filterMode === 'month' ? (
              <> Você tem {transacoes.length} transação(ões) no total. Tente alterar o filtro de mês/ano.</>
            ) : (
              <> Você tem {transacoes.length} transação(ões) no total. Tente alterar o período de datas.</>
            )}
          </p>
        </div>
      )}
      
      {/* Validação de período */}
      {filterMode === 'period' && startDate && endDate && startDate > endDate && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-800 dark:text-red-200">
            ⚠️ A data inicial não pode ser maior que a data final. Por favor, corrija as datas.
          </p>
        </div>
      )}

      {/* Conectar Conta Bancária - Movido para antes das estatísticas para maior visibilidade */}
      {(() => {
        console.log('🔍 Dashboard: Tentando renderizar BankConnector')
        return <BankConnector />
      })()}
      
      <DashboardStats stats={stats} />

      {/* Gráficos do período */}
      <DashboardCharts transacoes={filteredTransacoes} />
      
    </div>
  )
}

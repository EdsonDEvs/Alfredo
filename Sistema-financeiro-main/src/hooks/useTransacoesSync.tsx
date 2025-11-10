/**
 * Hook para sincronizar transações entre componentes
 * Permite que mudanças em uma página sejam refletidas em outras
 */

import { createContext, useContext, useCallback, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from './useAuth'
import { TransacoesService } from '@/services/transacoes'
import type { Transacao } from '@/lib/supabase'

interface TransacoesSyncContextType {
  transacoes: Transacao[]
  loading: boolean
  refresh: () => Promise<void>
  lastUpdate: number
}

const TransacoesSyncContext = createContext<TransacoesSyncContextType | undefined>(undefined)

export function TransacoesSyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setTransacoes([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await TransacoesService.getTransacoes(user.id)
      setTransacoes(data || [])
      setLastUpdate(Date.now())
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      setTransacoes([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Carregar dados inicialmente
  useEffect(() => {
    refresh()
  }, [refresh])

  // Recarregar quando a página recebe foco (usuário volta de outra aba/janela)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Página ficou visível, recarregar dados
        refresh()
      }
    }

    const handleFocus = () => {
      refresh()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [refresh])

  // Escutar eventos customizados de atualização
  useEffect(() => {
    const handleTransacoesUpdate = () => {
      refresh()
    }

    window.addEventListener('transacoes:updated', handleTransacoesUpdate)

    return () => {
      window.removeEventListener('transacoes:updated', handleTransacoesUpdate)
    }
  }, [refresh])

  // Recarregar quando navegar para páginas que usam transações
  useEffect(() => {
    const pagesWithTransactions = ['/', '/dashboard', '/transacoes', '/relatorios']
    if (pagesWithTransactions.includes(location.pathname)) {
      // Delay maior para evitar múltiplos recarregamentos
      const timeoutId = setTimeout(() => {
        refresh()
      }, 300)

      return () => clearTimeout(timeoutId)
    }
  }, [location.pathname, refresh])

  // Polling periódico para manter dados atualizados (a cada 30 segundos)
  useEffect(() => {
    if (!user?.id) return

    const intervalId = setInterval(() => {
      refresh()
    }, 30000) // 30 segundos

    return () => clearInterval(intervalId)
  }, [user?.id, refresh])

  return (
    <TransacoesSyncContext.Provider value={{ transacoes, loading, refresh, lastUpdate }}>
      {children}
    </TransacoesSyncContext.Provider>
  )
}

export function useTransacoesSync() {
  const context = useContext(TransacoesSyncContext)
  if (context === undefined) {
    throw new Error('useTransacoesSync must be used within a TransacoesSyncProvider')
  }
  return context
}

/**
 * Dispara evento para atualizar transações em todas as páginas
 */
export function notifyTransacoesUpdate() {
  window.dispatchEvent(new CustomEvent('transacoes:updated'))
}


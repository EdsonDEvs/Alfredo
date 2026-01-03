/**
 * Hook para sincronizar transações entre componentes
 * Permite que mudanças em uma página sejam refletidas em outras
 */

import { createContext, useContext, useCallback, useEffect, useState } from 'react'
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
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  const refresh = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ useTransacoesSync: Usuário não autenticado, limpando transações')
      setTransacoes([])
      setLoading(false)
      return
    }

    try {
      console.log('🔄 useTransacoesSync: Iniciando busca de transações para userId:', user.id)
      setLoading(true)
      // Sempre buscar dados frescos do servidor (sem cache)
      const data = await TransacoesService.getTransacoes(user.id)
      console.log('✅ useTransacoesSync: Transações carregadas:', data?.length || 0)
      // Atualizar estado com dados frescos
      setTransacoes(data || [])
      setLastUpdate(Date.now())
    } catch (error) {
      console.error('❌ useTransacoesSync: Erro ao carregar transações:', error)
      setTransacoes([])
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Carregar dados inicialmente apenas uma vez
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]) // Apenas quando o usuário mudar

  // Escutar eventos customizados de atualização (apenas quando explicitamente chamado)
  useEffect(() => {
    const handleTransacoesUpdate = () => {
      refresh()
    }

    window.addEventListener('transacoes:updated', handleTransacoesUpdate)

    return () => {
      window.removeEventListener('transacoes:updated', handleTransacoesUpdate)
    }
  }, [refresh])

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


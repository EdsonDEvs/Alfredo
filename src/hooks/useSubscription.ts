import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'

export interface Subscription {
  id: string
  userId: string
  status: 'active' | 'inactive' | 'cancelled' | 'pending'
  plan: string
  startDate: string
  endDate: string | null
  paymentMethod?: string | null
  amount: number
  currency: string
  autoRenew: boolean
  createdAt?: string
  updatedAt?: string
}

const normalizeStatus = (status?: string | null): Subscription['status'] => {
  if (!status) return 'inactive'
  if (status === 'canceled') return 'cancelled'
  if (status === 'cancelled') return 'cancelled'
  if (status === 'pending') return 'pending'
  if (status === 'active') return 'active'
  return 'inactive'
}

export function useSubscription() {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSubscription = async (userId: string) => {
    const { data, error: fetchError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      throw fetchError
    }

    if (!data) {
      return null
    }

    return {
      id: data.id,
      userId: data.user_id,
      status: normalizeStatus(data.status),
      plan: data.plan_name || 'premium',
      startDate: data.start_date || data.created_at,
      endDate: data.next_payment_date || null,
      paymentMethod: data.payment_method || null,
      amount: Number(data.amount || 0),
      currency: data.currency || 'BRL',
      autoRenew: data.status === 'active',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } satisfies Subscription
  }

  useEffect(() => {
    if (!user?.id) {
      setSubscription(null)
      setLoading(false)
      return
    }

    let isMounted = true

    const init = async () => {
      try {
        setLoading(true)
        const data = await loadSubscription(user.id)
        if (isMounted) {
          setSubscription(data)
          setError(null)
        }
      } catch (err) {
        console.error('Erro ao buscar assinatura:', err)
        if (isMounted) {
          setError('Erro ao carregar dados da assinatura')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    init()

    const channel = supabase
      .channel(`subscriptions:${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'subscriptions', filter: `user_id=eq.${user.id}` },
        async () => {
          try {
            const data = await loadSubscription(user.id)
            if (isMounted) {
              setSubscription(data)
              setError(null)
            }
          } catch (err) {
            console.error('Erro ao atualizar assinatura:', err)
          }
        }
      )
      .subscribe()

    return () => {
      isMounted = false
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const isSubscribed = subscription?.status === 'active'
  const isPending = subscription?.status === 'pending'
  const isCancelled = subscription?.status === 'cancelled'

  return {
    subscription,
    isSubscribed,
    isPending,
    isCancelled,
    loading,
    error,
  }
}

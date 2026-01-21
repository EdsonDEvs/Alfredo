import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export type PlanTier = 'basic' | 'pro' | 'premium'

const PLAN_ORDER: Record<PlanTier, number> = {
  basic: 1,
  pro: 2,
  premium: 3,
}

const TRIAL_DAYS = 30

const normalizePlanName = (planName?: string | null): PlanTier => {
  const normalized = (planName || '').toLowerCase()
  if (normalized.includes('premium')) return 'premium'
  if (normalized.includes('pro')) return 'pro'
  return 'basic'
}

const hasTierAccess = (current: PlanTier, required: PlanTier) =>
  PLAN_ORDER[current] >= PLAN_ORDER[required]

export function usePlanAccess() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<PlanTier>('basic')
  const [status, setStatus] = useState<'active' | 'trial' | 'inactive'>('inactive')

  useEffect(() => {
    let isMounted = true

    const loadPlan = async () => {
      if (!user?.id) {
        if (isMounted) {
          setPlan('basic')
          setStatus('inactive')
          setLoading(false)
        }
        return
      }

      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('plan_name, status, next_payment_date, start_date')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          throw error
        }

        if (data?.status === 'active') {
          const nextPaymentDate = data.next_payment_date ? new Date(data.next_payment_date) : null
          const isValid = !nextPaymentDate || nextPaymentDate.getTime() > Date.now()
          if (isValid) {
            if (isMounted) {
              setPlan(normalizePlanName(data.plan_name))
              setStatus('active')
              setLoading(false)
            }
            return
          }
        }

        const createdAt = user.created_at ? new Date(user.created_at) : null
        const isTrial =
          createdAt && Date.now() - createdAt.getTime() <= TRIAL_DAYS * 24 * 60 * 60 * 1000

        if (isMounted) {
          setPlan('basic')
          setStatus(isTrial ? 'trial' : 'inactive')
          setLoading(false)
        }
      } catch (err) {
        console.error('Erro ao carregar plano:', err)
        if (isMounted) {
          setPlan('basic')
          setStatus('inactive')
          setLoading(false)
        }
      }
    }

    loadPlan()

    return () => {
      isMounted = false
    }
  }, [user?.id, user?.created_at])

  const hasAccess = (required: PlanTier) => {
    if (status === 'inactive') return false
    return hasTierAccess(plan, required)
  }

  return {
    loading,
    plan,
    status,
    isTrial: status === 'trial',
    hasAccess,
  }
}

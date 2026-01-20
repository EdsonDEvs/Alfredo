import { supabase } from '@/lib/supabase'

export interface SubscriptionRecord {
  id?: string
  user_id: string
  subscription_id: string
  status?: string | null
  plan_name?: string | null
  amount?: number | null
  currency?: string | null
  cycle?: string | null
  start_date?: string | null
  next_payment_date?: string | null
  payment_method?: string | null
  card_last_four?: string | null
  card_brand?: string | null
}

export const createOrUpdateSubscription = async (
  userId: string,
  subscriptionData: Partial<SubscriptionRecord>
) => {
  try {
    const now = new Date()
    const subscriptionId = subscriptionData.subscription_id || 'manual'

    const payload: SubscriptionRecord = {
      user_id: userId,
      subscription_id: subscriptionId,
      status: subscriptionData.status || 'active',
      plan_name: subscriptionData.plan_name || 'premium',
      amount: subscriptionData.amount ?? 0.01,
      currency: subscriptionData.currency || 'BRL',
      cycle: subscriptionData.cycle || 'monthly',
      start_date: subscriptionData.start_date || now.toISOString(),
      next_payment_date:
        subscriptionData.next_payment_date || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      payment_method: subscriptionData.payment_method || 'asaas',
      card_last_four: subscriptionData.card_last_four || null,
      card_brand: subscriptionData.card_brand || null,
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .upsert(payload, { onConflict: 'user_id,subscription_id' })
      .select('*')
      .single()

    if (error) {
      throw error
    }

    return { data, error: null }
  } catch (error: any) {
    console.error('❌ Erro ao criar/atualizar assinatura:', error.message)
    return { data: null, error: error.message }
  }
}

export const getSubscription = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      throw error
    }

    return { data: data || null, error: null }
  } catch (error: any) {
    console.error('❌ Erro ao buscar assinatura:', error.message)
    return { data: null, error: error.message }
  }
}

export const cancelSubscription = async (userId: string) => {
  try {
    const { data: subscription, error } = await getSubscription(userId)
    if (error || !subscription) {
      throw new Error(error || 'Assinatura não encontrada')
    }

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscription.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('❌ Erro ao cancelar assinatura:', error.message)
    return { success: false, error: error.message }
  }
}

export const renewSubscription = async (userId: string) => {
  try {
    const { data: subscription, error } = await getSubscription(userId)
    if (error || !subscription) {
      throw new Error(error || 'Assinatura não encontrada')
    }

    const nextPaymentDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({ status: 'active', next_payment_date: nextPaymentDate })
      .eq('id', subscription.id)

    if (updateError) {
      throw updateError
    }

    return { success: true, error: null }
  } catch (error: any) {
    console.error('❌ Erro ao renovar assinatura:', error.message)
    return { success: false, error: error.message }
  }
}

export const isSubscriptionActive = async (userId: string) => {
  try {
    const { data: subscription } = await getSubscription(userId)

    if (!subscription) {
      return false
    }

    const now = new Date()
    const endDate = subscription.next_payment_date ? new Date(subscription.next_payment_date) : null

    return subscription.status === 'active' && (!endDate || endDate > now)
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error)
    return false
  }
}

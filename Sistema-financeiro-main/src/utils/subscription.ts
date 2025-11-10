
import { supabase } from '@/integrations/supabase/client'
import type { SubscriptionData, ExternalSubscriptionData } from '@/types/subscription'

export const fetchUserSubscriptionId = async (userId: string): Promise<string | null> => {
  // Database tables don't exist yet
  return null
}

export const fetchSubscriptionInfoWithJWT = async (): Promise<ExternalSubscriptionData> => {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.access_token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await fetch('https://n8n.controlenozap.com/webhook-test/assinatura/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('USUARIO:SENHA')
    },
    body: new URLSearchParams({})
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar informações da assinatura')
  }

  return await response.json()
}

export const fetchSubscriptionInfo = async (subscriptionId: string): Promise<ExternalSubscriptionData> => {
  const response = await fetch('https://n8n.controlenozap.com/webhook-test/assinatura/info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa('USUARIO:SENHA')
    },
    body: new URLSearchParams({
      subscription: subscriptionId
    })
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar informações da assinatura')
  }

  return await response.json()
}

// Funções para trabalhar com dados locais
export const fetchLocalSubscriptionData = async (userId: string): Promise<SubscriptionData | null> => {
  // Database tables don't exist yet
  return null
}

export const syncSubscriptionData = async (): Promise<void> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    throw new Error('Usuário não autenticado')
  }

  const response = await supabase.functions.invoke('sync-subscription', {
    headers: {
      'Authorization': `Bearer ${session.access_token}`
    }
  })

  if (response.error) {
    throw response.error
  }
}

export const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Não informado'
  return new Date(dateString).toLocaleDateString('pt-BR')
}

export const formatCurrency = (value: number | null): string => {
  if (!value) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export const getCycleLabel = (cycle: string | null): string => {
  if (!cycle) return 'Não informado'
  switch (cycle.toLowerCase()) {
    case 'monthly':
      return 'Plano Mensal'
    case 'yearly':
      return 'Plano Anual'
    case 'quarterly':
      return 'Plano Trimestral'
    default:
      return cycle
  }
}

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { supabase } from '@/lib/supabase'
import { getExchangeRates, convertCurrencySync, type Currency as CurrencyType } from '@/services/currencyConverter'

export type Currency = 'BRL' | 'USD' | 'EUR'
export type Locale = 'pt-BR' | 'en-US' | 'en-GB' | 'de-DE' | 'fr-FR' | 'es-ES' | 'it-IT' | 'pt-PT'

interface CurrencyContextType {
  currency: Currency
  locale: Locale
  setCurrency: (currency: Currency) => Promise<void>
  setLocale: (locale: Locale) => Promise<void>
  loading: boolean
  convertValue: (value: number, fromCurrency?: Currency) => number
  exchangeRatesLoading: boolean
  refreshRates: () => Promise<void>
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Mapeamento de moedas para locales padrão
const currencyToLocale: Record<Currency, Locale> = {
  BRL: 'pt-BR',
  USD: 'en-US',
  EUR: 'en-GB', // ou 'de-DE', 'fr-FR', etc. dependendo da preferência
}

// Mapeamento de locales para moedas padrão (quando locale é definido primeiro)
const localeToCurrency: Partial<Record<Locale, Currency>> = {
  'pt-BR': 'BRL',
  'en-US': 'USD',
  'en-GB': 'USD',
  'de-DE': 'EUR',
  'fr-FR': 'EUR',
  'es-ES': 'EUR',
  'it-IT': 'EUR',
  'pt-PT': 'EUR',
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [currency, setCurrencyState] = useState<Currency>('BRL')
  const [locale, setLocaleState] = useState<Locale>('pt-BR')
  const [loading, setLoading] = useState(true)
  const [exchangeRatesLoading, setExchangeRatesLoading] = useState(false)

  // Carregar taxas de câmbio ao montar
  useEffect(() => {
    const loadExchangeRates = async () => {
      setExchangeRatesLoading(true)
      try {
        await getExchangeRates()
      } catch (error) {
        console.error('Erro ao carregar taxas de câmbio:', error)
      } finally {
        setExchangeRatesLoading(false)
      }
    }

    loadExchangeRates()
    
    // Atualizar taxas a cada hora
    const interval = setInterval(loadExchangeRates, 60 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Carregar preferências do usuário
  useEffect(() => {
    const loadUserPreferences = async () => {
      if (!user?.id) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('currency, locale')
          .eq('id', user.id)
          .single()

        // Se as colunas não existem (migration não executada), usar padrão
        if (error) {
          if (error.code === 'PGRST116') {
            // Registro não encontrado - usar padrão
            console.log('Perfil não encontrado, usando moeda padrão BRL')
          } else if (error.message?.includes('column') || error.message?.includes('does not exist')) {
            // Colunas não existem - migration não executada
            console.warn('Colunas currency/locale não existem. Execute a migration primeiro.')
            console.warn('Usando moeda padrão BRL até que a migration seja executada.')
          } else {
            console.error('Erro ao carregar preferências de moeda:', error)
          }
          // Continuar com valores padrão
          setLoading(false)
          return
        }

        if (data) {
          if (data.currency) {
            const newCurrency = data.currency as Currency
            setCurrencyState(newCurrency)
            // Se não houver locale, usar o padrão da moeda
            if (!data.locale) {
              const defaultLocale = currencyToLocale[newCurrency]
              setLocaleState(defaultLocale)
              // Atualizar funções de formatação
              const { setDefaultCurrency } = await import('@/utils/currency')
              setDefaultCurrency(newCurrency, defaultLocale)
            } else {
              const newLocale = data.locale as Locale
              setLocaleState(newLocale)
              // Atualizar funções de formatação
              const { setDefaultCurrency } = await import('@/utils/currency')
              setDefaultCurrency(newCurrency, newLocale)
            }
          } else if (data.locale) {
            // Se houver locale mas não moeda, inferir moeda do locale
            const newLocale = data.locale as Locale
            setLocaleState(newLocale)
            const inferredCurrency = localeToCurrency[newLocale] || 'USD'
            setCurrencyState(inferredCurrency)
            // Atualizar funções de formatação
            const { setDefaultCurrency } = await import('@/utils/currency')
            setDefaultCurrency(inferredCurrency, newLocale)
          }
        }
      } catch (error: any) {
        // Tratar erros de schema (colunas não existem)
        if (error?.message?.includes('column') || error?.message?.includes('does not exist')) {
          console.warn('Colunas currency/locale não existem. Execute a migration primeiro.')
        } else {
          console.error('Erro ao carregar preferências:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadUserPreferences()
  }, [user?.id])

  // Atualizar funções de formatação quando a moeda ou locale mudar
  useEffect(() => {
    const updateFormatter = async () => {
      const { setDefaultCurrency } = await import('@/utils/currency')
      setDefaultCurrency(currency, locale)
    }
    updateFormatter()
  }, [currency, locale])

  // Atualizar moeda
  const setCurrency = async (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    
    // Atualizar locale se necessário (usar padrão da moeda se locale não estiver definido)
    const defaultLocale = currencyToLocale[newCurrency]
    if (!locale || locale === 'pt-BR' && newCurrency !== 'BRL') {
      setLocaleState(defaultLocale)
    }

    // Atualizar funções de formatação imediatamente
    const { setDefaultCurrency } = await import('@/utils/currency')
    const localeToUse = (!locale || locale === 'pt-BR' && newCurrency !== 'BRL') ? defaultLocale : locale
    setDefaultCurrency(newCurrency, localeToUse)

    if (!user?.id) return

    try {
      const updates: { currency: Currency; locale?: Locale } = { currency: newCurrency }
      
      // Se o locale atual não é compatível com a nova moeda, atualizar também
      if (!locale || (newCurrency === 'USD' && locale === 'pt-BR') || (newCurrency === 'EUR' && locale === 'pt-BR')) {
        updates.locale = defaultLocale
        setLocaleState(defaultLocale)
        setDefaultCurrency(newCurrency, defaultLocale)
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        // Se as colunas não existem, avisar mas não reverter (permite usar mesmo sem migration)
        if (error.message?.includes('column') || error.message?.includes('does not exist')) {
          console.warn('Colunas currency/locale não existem. Execute a migration para salvar preferências.')
          console.warn('A moeda será usada apenas nesta sessão.')
          // Não reverter - manter a mudança na sessão atual
        } else {
          console.error('Erro ao atualizar moeda:', error)
          // Reverter em caso de erro real
          setCurrencyState(currency)
          setDefaultCurrency(currency, locale)
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar moeda:', error)
      setCurrencyState(currency)
      const { setDefaultCurrency } = await import('@/utils/currency')
      setDefaultCurrency(currency, locale)
    }
  }

  // Atualizar locale
  const setLocale = async (newLocale: Locale) => {
    setLocaleState(newLocale)

    if (!user?.id) return

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ locale: newLocale })
        .eq('id', user.id)

      if (error) {
        console.error('Erro ao atualizar locale:', error)
        setLocaleState(locale)
      }
    } catch (error) {
      console.error('Erro ao atualizar locale:', error)
      setLocaleState(locale)
    }
  }

  // Converter valor de BRL (padrão) para a moeda atual do usuário
  const convertValue = (value: number, fromCurrency: Currency = 'BRL'): number => {
    if (fromCurrency === currency) {
      return value
    }
    
    try {
      return convertCurrencySync(value, fromCurrency, currency)
    } catch (error) {
      console.error('Erro ao converter valor:', error)
      return value
    }
  }

  // Atualizar taxas de câmbio manualmente
  const refreshRates = async () => {
    setExchangeRatesLoading(true)
    try {
      const { refreshExchangeRates } = await import('@/services/currencyConverter')
      await refreshExchangeRates()
    } catch (error) {
      console.error('Erro ao atualizar taxas:', error)
    } finally {
      setExchangeRatesLoading(false)
    }
  }

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        locale,
        setCurrency,
        setLocale,
        loading,
        convertValue,
        exchangeRatesLoading,
        refreshRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}


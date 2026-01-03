
import type { Currency, Locale } from '@/hooks/useCurrency'

// Função auxiliar para obter a moeda padrão (para casos onde o hook não está disponível)
let defaultCurrency: Currency = 'BRL'
let defaultLocale: Locale = 'pt-BR'

export function setDefaultCurrency(currency: Currency, locale: Locale) {
  defaultCurrency = currency
  defaultLocale = locale
}

/**
 * Formata um valor monetário
 * Se currency e locale não forem fornecidos, usa os valores padrão do contexto
 */
export const formatCurrency = (
  value: number | string,
  currency?: Currency,
  locale?: Locale
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  
  if (isNaN(numValue)) {
    // Retornar valor padrão baseado na moeda
    const curr = currency || defaultCurrency
    const loc = locale || defaultLocale
    return new Intl.NumberFormat(loc, {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(0)
  }
  
  const curr = currency || defaultCurrency
  const loc = locale || defaultLocale
  
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numValue)
}

/**
 * Hook wrapper para formatCurrency com conversão automática
 * Use este hook dentro de componentes React para conversão automática
 */
export function useFormatCurrency() {
  // Importar dinamicamente para evitar dependência circular
  const { useCurrency } = require('@/hooks/useCurrency')
  const { useFormattedCurrency } = require('@/hooks/useFormattedCurrency')
  
  try {
    return useFormattedCurrency()
  } catch {
    // Fallback se hook não estiver disponível
    const { currency, locale } = useCurrency()
    return {
      format: (value: number | string) => formatCurrency(value, currency, locale),
      currency,
      locale
    }
  }
}

export const parseCurrency = (value: string, locale?: Locale): number => {
  // Remove caracteres não numéricos, exceto vírgula e ponto
  const cleaned = value.replace(/[^\d,.-]/g, '')
  
  // Detectar formato baseado no locale
  const loc = locale || defaultLocale
  const usesComma = loc.includes('pt') || loc.includes('de') || loc.includes('fr') || loc.includes('es') || loc.includes('it')
  
  if (usesComma) {
    // Formato europeu: 1.234,56 (ponto para milhar, vírgula para decimal)
    const normalized = cleaned.replace(/\./g, '').replace(',', '.')
    return parseFloat(normalized) || 0
  } else {
    // Formato americano: 1,234.56 (vírgula para milhar, ponto para decimal)
    const normalized = cleaned.replace(/,/g, '')
    return parseFloat(normalized) || 0
  }
}

export const formatCurrencyInput = (
  value: string,
  currency?: Currency,
  locale?: Locale
): string => {
  // Remove tudo exceto números
  const numbers = value.replace(/\D/g, '')
  
  if (!numbers) return ''
  
  // Converte para centavos/cents
  const cents = parseInt(numbers)
  const amount = cents / 100
  
  const curr = currency || defaultCurrency
  const loc = locale || defaultLocale
  
  return new Intl.NumberFormat(loc, {
    style: 'currency',
    currency: curr,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

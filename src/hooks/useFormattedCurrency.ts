import { useCurrency } from './useCurrency'
import { formatCurrency } from '@/utils/currency'

/**
 * Hook para formatar valores com conversão automática de moeda
 * Converte valores de BRL (padrão) para a moeda atual do usuário
 */
export function useFormattedCurrency() {
  const { currency, locale, convertValue } = useCurrency()

  /**
   * Formata um valor convertendo da moeda original para a moeda atual
   * @param value Valor em BRL (ou moeda especificada)
   * @param fromCurrency Moeda original do valor (padrão: BRL)
   * @returns String formatada com o valor convertido
   */
  const format = (value: number | string, fromCurrency?: 'BRL' | 'USD' | 'EUR'): string => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    
    if (isNaN(numValue)) {
      return formatCurrency(0, currency, locale)
    }

    // Converter valor para a moeda atual
    const convertedValue = convertValue(numValue, fromCurrency || 'BRL')
    
    // Formatar com a moeda atual
    return formatCurrency(convertedValue, currency, locale)
  }

  return { format, currency, locale, convertValue }
}


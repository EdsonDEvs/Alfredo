/**
 * Serviço de conversão de moedas
 * Usa ExchangeRate-API (gratuita) para obter taxas de câmbio
 */

export type Currency = 'BRL' | 'USD' | 'EUR'

interface ExchangeRates {
  BRL: number // Taxa de conversão para BRL (1 USD = X BRL)
  USD: number // Taxa de conversão para USD (1 BRL = X USD)
  EUR: number // Taxa de conversão para EUR (1 BRL = X EUR)
  base: Currency
  timestamp: number
}

// Cache de taxas de câmbio (válido por 1 hora)
let exchangeRatesCache: ExchangeRates | null = null
let cacheExpiry: number = 0

const CACHE_DURATION = 60 * 60 * 1000 // 1 hora em millisegundos

/**
 * Obtém taxas de câmbio da API
 * Usa API gratuita do ExchangeRate-API
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Usar API gratuita do ExchangeRate-API
    // Você pode criar uma conta gratuita em https://www.exchangerate-api.com/
    // Ou usar a API pública (limitada)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/BRL')
    
    if (!response.ok) {
      throw new Error('Falha ao buscar taxas de câmbio')
    }

    const data = await response.json()

    // A API retorna taxas onde a base é BRL
    // data.rates.USD = quantos USD valem 1 BRL
    // data.rates.EUR = quantos EUR valem 1 BRL
    // Então podemos usar diretamente
    return {
      BRL: 1, // Base
      USD: data.rates.USD || 0.20, // 1 BRL = X USD (ex: 0.20 USD)
      EUR: data.rates.EUR || 0.18, // 1 BRL = X EUR (ex: 0.18 EUR)
      base: 'BRL',
      timestamp: Date.now()
    }
  } catch (error) {
    console.error('Erro ao buscar taxas de câmbio:', error)
    
    // Usar taxas aproximadas como fallback
    // Essas são estimativas e devem ser atualizadas periodicamente
    return {
      BRL: 1,
      USD: 0.20, // Aproximadamente 1 BRL = 0.20 USD
      EUR: 0.18, // Aproximadamente 1 BRL = 0.18 EUR
      base: 'BRL',
      timestamp: Date.now()
    }
  }
}

/**
 * Obtém taxas de câmbio (com cache)
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = Date.now()

  // Verificar se o cache é válido
  if (exchangeRatesCache && now < cacheExpiry) {
    return exchangeRatesCache
  }

  // Buscar novas taxas
  const rates = await fetchExchangeRates()
  
  // Atualizar cache
  exchangeRatesCache = rates
  cacheExpiry = now + CACHE_DURATION

  return rates
}

/**
 * Converte um valor de uma moeda para outra
 */
export async function convertCurrency(
  value: number,
  from: Currency,
  to: Currency
): Promise<number> {
  if (from === to) {
    return value
  }

  if (value === 0) {
    return 0
  }

  const rates = await getExchangeRates()

  // As taxas são: 1 BRL = X USD, 1 BRL = X EUR
  // rates.USD = quantos USD valem 1 BRL
  // rates.EUR = quantos EUR valem 1 BRL

  // Converter para BRL primeiro (moeda base)
  let valueInBRL: number
  if (from === 'BRL') {
    valueInBRL = value
  } else if (from === 'USD') {
    // Se temos USD, dividir pela taxa para obter BRL
    // 1 USD = 1/rates.USD BRL
    valueInBRL = value / rates.USD
  } else if (from === 'EUR') {
    // Se temos EUR, dividir pela taxa para obter BRL
    // 1 EUR = 1/rates.EUR BRL
    valueInBRL = value / rates.EUR
  } else {
    valueInBRL = value
  }

  // Converter de BRL para a moeda de destino
  if (to === 'BRL') {
    return valueInBRL
  } else if (to === 'USD') {
    // Multiplicar pela taxa: BRL * rates.USD = USD
    return valueInBRL * rates.USD
  } else if (to === 'EUR') {
    // Multiplicar pela taxa: BRL * rates.EUR = EUR
    return valueInBRL * rates.EUR
  }

  return valueInBRL
}

/**
 * Converte um valor de uma moeda para outra (síncrono, usa cache)
 * Use esta função quando já tiver as taxas em cache
 */
export function convertCurrencySync(
  value: number,
  from: Currency,
  to: Currency,
  rates?: ExchangeRates
): number {
  if (from === to) {
    return value
  }

  if (value === 0) {
    return 0
  }

  // Usar taxas fornecidas ou do cache
  const exchangeRates = rates || exchangeRatesCache

  if (!exchangeRates) {
    console.warn('Taxas de câmbio não disponíveis, usando valor original')
    return value
  }

  // As taxas são: 1 BRL = X USD, 1 BRL = X EUR
  // exchangeRates.USD = quantos USD valem 1 BRL
  // exchangeRates.EUR = quantos EUR valem 1 BRL

  // Converter para BRL primeiro (moeda base)
  let valueInBRL: number
  if (from === 'BRL') {
    valueInBRL = value
  } else if (from === 'USD') {
    // Se temos USD, dividir pela taxa para obter BRL
    // Exemplo: 5 USD / 0.20 = 25 BRL
    valueInBRL = value / exchangeRates.USD
  } else if (from === 'EUR') {
    // Se temos EUR, dividir pela taxa para obter BRL
    // Exemplo: 5 EUR / 0.18 = 27.78 BRL
    valueInBRL = value / exchangeRates.EUR
  } else {
    valueInBRL = value
  }

  // Converter de BRL para a moeda de destino
  if (to === 'BRL') {
    return valueInBRL
  } else if (to === 'USD') {
    // Multiplicar pela taxa: BRL * rates.USD = USD
    // Exemplo: 25 BRL * 0.20 = 5 USD
    return valueInBRL * exchangeRates.USD
  } else if (to === 'EUR') {
    // Multiplicar pela taxa: BRL * rates.EUR = EUR
    // Exemplo: 25 BRL * 0.18 = 4.5 EUR
    return valueInBRL * exchangeRates.EUR
  }

  return valueInBRL
}

/**
 * Formata valor convertido com informação de conversão
 */
export function formatConvertedValue(
  originalValue: number,
  convertedValue: number,
  from: Currency,
  to: Currency
): string {
  if (from === to) {
    return ''
  }

  const difference = Math.abs(convertedValue - originalValue)
  const percentDifference = ((difference / Math.abs(originalValue)) * 100).toFixed(2)

  return `(≈ ${percentDifference}% de diferença)`
}

/**
 * Atualiza o cache de taxas de câmbio
 */
export async function refreshExchangeRates(): Promise<ExchangeRates> {
  exchangeRatesCache = null
  cacheExpiry = 0
  return await getExchangeRates()
}


/**
 * Serviço para importação de planilhas Excel
 */

// @ts-ignore - xlsx não tem tipos completos
import * as XLSX from 'xlsx'
import type { Transacao } from '@/lib/supabase'

export interface ExcelRow {
  [key: string]: any
}

export interface ImportResult {
  success: boolean
  imported: number
  errors: string[]
  skipped: number
}

export interface ParsedTransaction {
  quando: string
  estabelecimento: string
  valor: number
  detalhes?: string
  tipo: 'receita' | 'despesa'
  category_id?: string
}

/**
 * Mapeia nomes de colunas comuns para o formato do sistema
 * Expandido para aceitar qualquer variação de nome
 */
const columnMappings: Record<string, string> = {
  // Data - muitas variações
  'data': 'quando',
  'date': 'quando',
  'quando': 'quando',
  'dia': 'quando',
  'datatransacao': 'quando',
  'datatransacão': 'quando',
  'datatransaction': 'quando',
  'dataoperacao': 'quando',
  'dataoperação': 'quando',
  'dataoperation': 'quando',
  'dataentrada': 'quando',
  'datasaida': 'quando',
  'datasaída': 'quando',
  'datapagamento': 'quando',
  'datavencimento': 'quando',
  'dt': 'quando',
  'dt_transacao': 'quando',
  'dt_transacão': 'quando',
  
  // Estabelecimento - muitas variações
  'estabelecimento': 'estabelecimento',
  'local': 'estabelecimento',
  'loja': 'estabelecimento',
  'descrição': 'estabelecimento',
  'descricao': 'estabelecimento',
  'description': 'estabelecimento',
  'desc': 'estabelecimento',
  'nome': 'estabelecimento',
  'name': 'estabelecimento',
  'fornecedor': 'estabelecimento',
  'supplier': 'estabelecimento',
  'vendedor': 'estabelecimento',
  'seller': 'estabelecimento',
  'comercio': 'estabelecimento',
  'comércio': 'estabelecimento',
  'comerciante': 'estabelecimento',
  'empresa': 'estabelecimento',
  'company': 'estabelecimento',
  'onde': 'estabelecimento',
  'where': 'estabelecimento',
  'origem': 'estabelecimento',
  'origin': 'estabelecimento',
  'destino': 'estabelecimento',
  'destination': 'estabelecimento',
  
  // Valor - muitas variações
  'valor': 'valor',
  'value': 'valor',
  'amount': 'valor',
  'preço': 'valor',
  'preco': 'valor',
  'price': 'valor',
  'vlr': 'valor',
  'vl': 'valor',
  'val': 'valor',
  'montante': 'valor',
  'total': 'valor',
  'sum': 'valor',
  'quantia': 'valor',
  'dinheiro': 'valor',
  'money': 'valor',
  'cash': 'valor',
  'saldo': 'valor',
  'balance': 'valor',
  'importancia': 'valor',
  'valor_transacao': 'valor',
  'valor_transaction': 'valor',
  'valor_operacao': 'valor',
  'valor_operation': 'valor',
  
  // Tipo - muitas variações
  'tipo': 'tipo',
  'type': 'tipo',
  'categoria': 'tipo',
  'category': 'tipo',
  'cat': 'tipo',
  'classificacao': 'tipo',
  'classificação': 'tipo',
  'classification': 'tipo',
  'natureza': 'tipo',
  'nature': 'tipo',
  'entrada': 'tipo',
  'saida': 'tipo',
  'saída': 'tipo',
  'receita': 'tipo',
  'despesa': 'tipo',
  'income': 'tipo',
  'expense': 'tipo',
  'gasto': 'tipo',
  'spend': 'tipo',
  'ganho': 'tipo',
  'gain': 'tipo',
  'credito': 'tipo',
  'crédito': 'tipo',
  'credit': 'tipo',
  'debito': 'tipo',
  'débito': 'tipo',
  'debit': 'tipo',
  
  // Detalhes - muitas variações
  'detalhes': 'detalhes',
  'details': 'detalhes',
  'observação': 'detalhes',
  'observacao': 'detalhes',
  'notes': 'detalhes',
  'notas': 'detalhes',
  'obs': 'detalhes',
  'observacoes': 'detalhes',
  'observações': 'detalhes',
  'comentario': 'detalhes',
  'comentário': 'detalhes',
  'comment': 'detalhes',
  'comentarios': 'detalhes',
  'comentários': 'detalhes',
  'comments': 'detalhes',
  'info': 'detalhes',
  'informacao': 'detalhes',
  'informação': 'detalhes',
  'information': 'detalhes',
  'descricao_detalhada': 'detalhes',
  'descrição_detalhada': 'detalhes',
  'detailed_description': 'detalhes',
}

/**
 * Normaliza nome de coluna (remove acentos, espaços, etc)
 */
function normalizeColumnName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/\s+/g, '') // Remove espaços
}

/**
 * Detecta automaticamente qual coluna corresponde a cada campo
 * Usa heurísticas inteligentes para encontrar a coluna correta
 */
function detectColumnType(header: string, sampleValues: any[], existingMapping: Record<string, string>): string | null {
  const normalized = normalizeColumnName(header)
  
  // Verificar mapeamento direto primeiro
  if (columnMappings[normalized]) {
    return columnMappings[normalized]
  }
  
  // Heurísticas para detecção automática
  
  // Detectar Data: valores que parecem datas
  if (sampleValues.length > 0 && !existingMapping['quando']) {
    const firstValue = sampleValues[0]
    const datePatterns = [
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}-\d{2}-\d{4}$/, // DD-MM-YYYY
      /^\d{2}\/\d{2}\/\d{2}$/, // DD/MM/YY
      /^\d{4}\/\d{2}\/\d{2}$/, // YYYY/MM/DD
      /^\d{1,2}\/\d{1,2}\/\d{4}$/, // D/M/YYYY ou DD/MM/YYYY
      /^\d{4}\.\d{2}\.\d{2}$/, // YYYY.MM.DD
      /^\d{2}\.\d{2}\.\d{4}$/, // DD.MM.YYYY
    ]
    
    // Verificar se parece com data
    const looksLikeDate = datePatterns.some(pattern => pattern.test(String(firstValue))) ||
                         (typeof firstValue === 'number' && firstValue > 40000 && firstValue < 50000) || // Excel date serial
                         (typeof firstValue === 'string' && !isNaN(Date.parse(firstValue)) && firstValue.length >= 8) // ISO ou outros formatos
    
    if (looksLikeDate) {
      return 'quando'
    }
  }
  
  // Detectar Valor: valores numéricos (incluindo formatos monetários)
  if (!existingMapping['valor'] && sampleValues.length > 0) {
    const looksLikeNumber = sampleValues.some(v => {
      if (typeof v === 'number') return true
      if (typeof v === 'string') {
        // Remove símbolos monetários (R$, $, €, £, etc) e outros caracteres não numéricos
        const cleaned = v.replace(/[R$€£¥₹₽₩¢\s]/g, '').replace(/[^\d,.-]/g, '')
        const parsed = parseFloat(cleaned.replace(',', '.'))
        // Deve ser um número válido e maior que 0 (ou negativo)
        return !isNaN(parsed) && (parsed !== 0 || cleaned.includes('0'))
      }
      return false
    })
    
    // Verificar se o header também sugere que é valor
    const headerSuggestsValue = /valor|value|amount|preço|preco|price|total|montante|quantia|dinheiro|money|cash|saldo|balance/i.test(header)
    
    if (looksLikeNumber || headerSuggestsValue) {
      return 'valor'
    }
  }
  
  // Detectar Tipo: valores que são receita/despesa
  if (!existingMapping['tipo'] && sampleValues.length > 0) {
    const looksLikeType = sampleValues.some(v => {
      const str = String(v).toLowerCase().trim()
      const typeKeywords = [
        'receita', 'despesa', 'income', 'expense', 'entrada', 'saída', 'saida',
        'ganho', 'gasto', 'gain', 'spend', 'crédito', 'credito', 'credit',
        'débito', 'debito', 'debit', 'in', 'out', 'entrada', 'saida', 'saída',
        'pagamento', 'payment', 'pago', 'paid', 'recebido', 'received'
      ]
      return typeKeywords.includes(str)
    })
    
    // Verificar se o header também sugere que é tipo
    const headerSuggestsType = /tipo|type|categoria|category|natureza|nature|classificacao|classification/i.test(header)
    
    if (looksLikeType || headerSuggestsType) {
      return 'tipo'
    }
  }
  
  // Detectar Estabelecimento: valores de texto que não são data, número ou tipo
  if (!existingMapping['estabelecimento'] && sampleValues.length > 0) {
    const looksLikeText = sampleValues.some(v => {
      if (typeof v === 'string' && v.trim().length > 0) {
        // Não é data, não é número, não é tipo
        const isDate = /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/.test(v) || !isNaN(Date.parse(v))
        const cleaned = v.replace(/[R$€£¥₹₽₩¢\s]/g, '').replace(/[^\d,.-]/g, '')
        const isNumber = !isNaN(parseFloat(cleaned.replace(',', '.'))) && cleaned.length > 0
        const isType = ['receita', 'despesa', 'income', 'expense', 'entrada', 'saída', 'saida'].includes(v.toLowerCase().trim())
        return !isDate && !isNumber && !isType && v.trim().length > 1
      }
      return false
    })
    
    // Verificar se o header também sugere que é estabelecimento
    const headerSuggestsEstablishment = /estabelecimento|local|loja|descrição|descricao|description|nome|name|onde|where|origem|origin|destino|destination|fornecedor|supplier|vendedor|seller|comercio|comércio|empresa|company/i.test(header)
    
    if (looksLikeText || headerSuggestsEstablishment) {
      return 'estabelecimento'
    }
  }
  
  return null
}

/**
 * Analisa o conteúdo de uma coluna e retorna um score de confiança para cada tipo
 */
function analyzeColumnContent(header: string, sampleValues: any[]): Record<string, number> {
  const scores: Record<string, number> = {
    quando: 0,
    estabelecimento: 0,
    valor: 0,
    tipo: 0,
    detalhes: 0
  }
  
  if (sampleValues.length === 0) return scores
  
  // Analisar cada valor da amostra
  sampleValues.forEach(value => {
    const strValue = String(value).trim()
    
    // Score para DATA
    const datePatterns = [
      /^\d{2}\/\d{2}\/\d{4}$/, /^\d{4}-\d{2}-\d{2}$/, /^\d{2}-\d{2}-\d{4}$/,
      /^\d{2}\/\d{2}\/\d{2}$/, /^\d{4}\/\d{2}\/\d{2}$/, /^\d{1,2}\/\d{1,2}\/\d{4}$/,
      /^\d{4}\.\d{2}\.\d{2}$/, /^\d{2}\.\d{2}\.\d{4}$/
    ]
    if (datePatterns.some(p => p.test(strValue)) || 
        (typeof value === 'number' && value > 40000 && value < 50000) ||
        (!isNaN(Date.parse(strValue)) && strValue.length >= 8)) {
      scores.quando += 10
    }
    
    // Score para VALOR
    if (typeof value === 'number') {
      scores.valor += 10
    } else if (typeof value === 'string') {
      const cleaned = value.replace(/[R$€£¥₹₽₩¢\s]/g, '').replace(/[^\d,.-]/g, '')
      const parsed = parseFloat(cleaned.replace(',', '.'))
      if (!isNaN(parsed) && cleaned.length > 0) {
        scores.valor += 10
      }
    }
    
    // Score para TIPO
    const normalized = strValue.toLowerCase()
    const typeKeywords = [
      'receita', 'despesa', 'income', 'expense', 'entrada', 'saída', 'saida',
      'ganho', 'gasto', 'gain', 'spend', 'crédito', 'credito', 'credit',
      'débito', 'debito', 'debit', 'pagamento', 'payment'
    ]
    if (typeKeywords.some(kw => normalized.includes(kw))) {
      scores.tipo += 10
    }
    
    // Score para ESTABELECIMENTO (texto que não é data, número ou tipo)
    if (typeof value === 'string' && strValue.length > 1) {
      const isDate = /^\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}$/.test(strValue) || !isNaN(Date.parse(strValue))
      const cleaned = strValue.replace(/[R$€£¥₹₽₩¢\s]/g, '').replace(/[^\d,.-]/g, '')
      const isNumber = !isNaN(parseFloat(cleaned.replace(',', '.'))) && cleaned.length > 0
      const isType = typeKeywords.some(kw => normalized.includes(kw))
      
      if (!isDate && !isNumber && !isType) {
        // Se parece com nome de lugar/estabelecimento (não muito curto, não muito longo)
        if (strValue.length >= 2 && strValue.length <= 100) {
          let establishmentScore = 10
          
          // Bônus se contém palavras comuns de estabelecimentos
          const establishmentKeywords = [
            'supermercado', 'farmácia', 'farmacia', 'loja', 'restaurante', 'posto', 'padaria',
            'shopping', 'mercado', 'banco', 'hospital', 'clínica', 'clinica', 'escola',
            'universidade', 'cinema', 'hotel', 'aeroporto', 'estação', 'estacao',
            'supermarket', 'pharmacy', 'store', 'restaurant', 'gas', 'station', 'bank',
            'hospital', 'clinic', 'school', 'university', 'cinema', 'hotel', 'airport'
          ]
          
          if (establishmentKeywords.some(kw => normalized.includes(kw))) {
            establishmentScore += 5 // Bônus extra
          }
          
          // Bônus se parece com nome próprio (começa com maiúscula, tem espaços)
          if (/^[A-ZÁÉÍÓÚÇ][a-záéíóúç]+/.test(strValue) || strValue.includes(' ')) {
            establishmentScore += 3
          }
          
          scores.estabelecimento += establishmentScore
        }
      }
    }
  })
  
  // Ajustar scores baseado no nome do header (mas com peso menor)
  const normalizedHeader = normalizeColumnName(header)
  
  // Se o header sugere um tipo, dar bônus mas não decisivo
  if (columnMappings[normalizedHeader]) {
    const suggestedType = columnMappings[normalizedHeader]
    scores[suggestedType] += 2 // Bônus pequeno, conteúdo tem prioridade
  }
  
  return scores
}

/**
 * Mapeia colunas da planilha para o formato do sistema
 * Agora com análise profunda de conteúdo, ignorando nomes quando necessário
 */
function mapColumns(headers: string[], sampleData: ExcelRow[] = []): Record<string, string> {
  const mapping: Record<string, string> = {}
  
  // PASSO 1: Analisar TODAS as colunas pelo conteúdo (ignorando nomes)
  const columnScores: Record<string, Record<string, number>> = {}
  
  headers.forEach((header) => {
    // Pegar mais amostras para análise mais precisa (até 20 linhas ou todas se houver menos)
    const sampleValues = sampleData.slice(0, Math.min(20, sampleData.length))
      .map(row => row[header])
      .filter(v => v !== undefined && v !== null && v !== '')
    
    if (sampleValues.length > 0) {
      columnScores[header] = analyzeColumnContent(header, sampleValues)
    }
  })
  
  // PASSO 2: Mapear cada campo necessário para a coluna com maior score
  // Priorizar conteúdo sobre nomes de colunas
  const requiredFields = ['quando', 'estabelecimento', 'valor']
  const optionalFields = ['tipo', 'detalhes']
  
  // Mapear campos obrigatórios primeiro
  requiredFields.forEach(field => {
    let bestColumn: string | null = null
    let bestScore = 0
    
    headers.forEach(header => {
      // Score baseado no conteúdo (prioridade alta)
      const contentScore = columnScores[header]?.[field] || 0
      
      // Score baseado no nome (prioridade baixa, apenas se conteúdo não for claro)
      let nameScore = 0
      const normalized = normalizeColumnName(header)
      if (columnMappings[normalized] === field) {
        nameScore = 2 // Pequeno bônus, mas conteúdo tem prioridade
      }
      
      const totalScore = contentScore + nameScore
      
      // Só considerar se não foi mapeada para outro campo
      if (totalScore > bestScore && !Object.values(mapping).includes(header)) {
        bestScore = totalScore
        bestColumn = header
      }
    })
    
    // Se encontrou uma coluna com score razoável, usar ela
    // Reduzir threshold para aceitar mais casos
    if (bestColumn && bestScore > 0) {
      mapping[field] = bestColumn
    }
  })
  
  // PASSO 3: Se ainda faltam campos, tentar mapeamento por nome (fallback)
  requiredFields.forEach(field => {
    if (!mapping[field]) {
      headers.forEach((header) => {
        if (Object.values(mapping).includes(header)) return // Já mapeada
        
        const normalized = normalizeColumnName(header)
        const mappedColumn = columnMappings[normalized]
        
        if (mappedColumn === field) {
          mapping[field] = header
        }
      })
    }
  })
  
  // PASSO 4: Se ainda faltam campos, usar detecção automática tradicional
  if (!mapping['quando'] || !mapping['estabelecimento'] || !mapping['valor']) {
    headers.forEach((header) => {
      if (mapping['quando'] && mapping['estabelecimento'] && mapping['valor']) {
        return // Já temos tudo
      }
      
      if (Object.values(mapping).includes(header)) return // Já mapeada
      
      const sampleValues = sampleData.slice(0, 5).map(row => row[header]).filter(v => v !== undefined && v !== null)
      
      if (sampleValues.length > 0) {
        const detected = detectColumnType(header, sampleValues, mapping)
        if (detected && !mapping[detected]) {
          mapping[detected] = header
        }
      }
    })
  }
  
  // PASSO 5: Mapear campos opcionais
  optionalFields.forEach(field => {
    if (!mapping[field]) {
      let bestColumn: string | null = null
      let bestScore = 0
      
      headers.forEach(header => {
        if (Object.values(mapping).includes(header)) return // Já mapeada
        
        const score = columnScores[header]?.[field] || 0
        if (score > bestScore) {
          bestScore = score
          bestColumn = header
        }
      })
      
      if (bestColumn && bestScore > 0) {
        mapping[field] = bestColumn
      }
    }
  })
  
  return mapping
}

/**
 * Converte valor para número
 */
function parseValue(value: any): number {
  if (typeof value === 'number') {
    return value
  }
  
  if (typeof value === 'string') {
    // Remove símbolos monetários (R$, $, €, £, etc) e espaços
    let cleaned = value.replace(/[R$€£¥₹₽₩¢\s]/g, '')
    // Remove caracteres não numéricos exceto ponto, vírgula e sinal negativo
    cleaned = cleaned.replace(/[^\d,.-]/g, '')
    
    // Se tem vírgula e ponto, assume que vírgula é decimal (formato brasileiro: 1.234,56)
    if (cleaned.includes(',') && cleaned.includes('.')) {
      // Remove pontos (milhares) e substitui vírgula por ponto
      cleaned = cleaned.replace(/\./g, '').replace(',', '.')
    } else {
      // Substitui vírgula por ponto (assume formato decimal)
      cleaned = cleaned.replace(',', '.')
    }
    
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

/**
 * Converte data para formato YYYY-MM-DD
 * Aceita múltiplos formatos de data
 */
function parseDate(value: any): string {
  if (!value) return ''
  
  // Se já está no formato correto
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }
  
  // Se é um número (Excel date serial)
  if (typeof value === 'number') {
    // Excel date serial number (dias desde 1900-01-01)
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000)
    return date.toISOString().split('T')[0]
  }
  
  // Se é uma string de data
  if (typeof value === 'string') {
    const trimmed = value.trim()
    
    // Tenta vários formatos
    const formats = [
      { pattern: /(\d{2})\/(\d{2})\/(\d{4})/, handler: (m: RegExpMatchArray) => `${m[3]}-${m[2]}-${m[1]}` }, // DD/MM/YYYY
      { pattern: /(\d{4})-(\d{2})-(\d{2})/, handler: (m: RegExpMatchArray) => trimmed }, // YYYY-MM-DD
      { pattern: /(\d{2})-(\d{2})-(\d{4})/, handler: (m: RegExpMatchArray) => `${m[3]}-${m[2]}-${m[1]}` }, // DD-MM-YYYY
      { pattern: /(\d{2})\/(\d{2})\/(\d{2})/, handler: (m: RegExpMatchArray) => {
        const year = parseInt(m[3]) < 50 ? `20${m[3]}` : `19${m[3]}`
        return `${year}-${m[2]}-${m[1]}`
      }}, // DD/MM/YY
      { pattern: /(\d{4})\/(\d{2})\/(\d{2})/, handler: (m: RegExpMatchArray) => trimmed }, // YYYY/MM/DD
      { pattern: /(\d{4})\.(\d{2})\.(\d{2})/, handler: (m: RegExpMatchArray) => `${m[1]}-${m[2]}-${m[3]}` }, // YYYY.MM.DD
      { pattern: /(\d{2})\.(\d{2})\.(\d{4})/, handler: (m: RegExpMatchArray) => `${m[3]}-${m[2]}-${m[1]}` }, // DD.MM.YYYY
      { pattern: /(\d{1,2})\/(\d{1,2})\/(\d{4})/, handler: (m: RegExpMatchArray) => {
        const day = m[1].padStart(2, '0')
        const month = m[2].padStart(2, '0')
        return `${m[3]}-${month}-${day}`
      }}, // D/M/YYYY ou DD/MM/YYYY
    ]
    
    for (const format of formats) {
      const match = trimmed.match(format.pattern)
      if (match) {
        const result = format.handler(match)
        // Validar se a data é válida
        const date = new Date(result)
        if (!isNaN(date.getTime())) {
          return result
        }
      }
    }
    
    // Tenta parse direto (ISO, etc)
    const date = new Date(trimmed)
    if (!isNaN(date.getTime())) {
      return date.toISOString().split('T')[0]
    }
  }
  
  // Se é um objeto Date
  if (value instanceof Date) {
    return value.toISOString().split('T')[0]
  }
  
  return ''
}

/**
 * Determina o tipo (receita/despesa) baseado no valor ou texto
 */
function parseType(value: any, valor: number): 'receita' | 'despesa' {
  if (!value) {
    // Se não especificado, assume despesa se negativo, receita se positivo
    return valor < 0 ? 'despesa' : 'receita'
  }
  
  const normalized = String(value).toLowerCase().trim()
  
  // Palavras-chave para receita
  const receitaKeywords = [
    'receita', 'income', 'entrada', 'ganho', 'gain', 'crédito', 'credito', 'credit',
    '+', 'in', 'recebido', 'received', 'pago', 'paid', 'salário', 'salario', 'salary',
    'renda', 'venda', 'sale', 'vendas', 'sales'
  ]
  if (receitaKeywords.some(keyword => normalized.includes(keyword))) {
    return 'receita'
  }
  
  // Palavras-chave para despesa
  const despesaKeywords = [
    'despesa', 'expense', 'saída', 'saida', 'gasto', 'spend', 'débito', 'debito', 'debit',
    '-', 'out', 'pago', 'paid', 'pagamento', 'payment', 'compra', 'purchase', 'compras', 'purchases'
  ]
  if (despesaKeywords.some(keyword => normalized.includes(keyword))) {
    return 'despesa'
  }
  
  // Se o valor começa com + ou -, usar isso como indicador
  const strValue = String(value).trim()
  if (strValue.startsWith('+')) {
    return 'receita'
  }
  if (strValue.startsWith('-')) {
    return 'despesa'
  }
  
  // Padrão: despesa se negativo, receita se positivo
  return valor < 0 ? 'despesa' : 'receita'
}

/**
 * Processa uma linha da planilha
 */
function parseRow(row: ExcelRow, columnMapping: Record<string, string>): ParsedTransaction | null {
  try {
    // Obter valores mapeados (pode ser undefined se não mapeado)
    const dataValue = columnMapping['quando'] ? row[columnMapping['quando']] : undefined
    const estabelecimentoValue = columnMapping['estabelecimento'] ? row[columnMapping['estabelecimento']] : undefined
    const valorValue = columnMapping['valor'] ? row[columnMapping['valor']] : undefined
    const tipoValue = columnMapping['tipo'] ? row[columnMapping['tipo']] : undefined
    const detalhesValue = columnMapping['detalhes'] ? row[columnMapping['detalhes']] : undefined
    
    // Validar campos obrigatórios (mais tolerante)
    if (!dataValue || !estabelecimentoValue || valorValue === undefined || valorValue === null) {
      return null
    }
    
    // Parse dos valores
    const quando = parseDate(dataValue)
    const estabelecimento = String(estabelecimentoValue).trim()
    let valor = parseValue(valorValue)
    
    // Se valor é negativo, pode indicar despesa
    const isNegative = valor < 0
    valor = Math.abs(valor)
    
    // Determinar tipo: se não especificado e valor era negativo, assume despesa
    let tipo = parseType(tipoValue, isNegative ? -valor : valor)
    if (!tipoValue && isNegative) {
      tipo = 'despesa'
    }
    
    const detalhes = detalhesValue ? String(detalhesValue).trim() : undefined
    
    // Validar se parse foi bem-sucedido (mais tolerante - permite valor 0 se for explícito)
    if (!quando || !estabelecimento || (valor === 0 && valorValue !== 0 && valorValue !== '0')) {
      return null
    }
    
    return {
      quando,
      estabelecimento,
      valor,
      tipo,
      detalhes,
    }
  } catch (error) {
    console.error('Erro ao processar linha:', error, row)
    return null
  }
}

/**
 * Lê arquivo Excel e retorna dados processados
 */
export function readExcelFile(file: File): Promise<ParsedTransaction[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          reject(new Error('Erro ao ler arquivo'))
          return
        }
        
        const workbook = XLSX.read(data, { type: 'binary' })
        
        // Pegar primeira planilha
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]
        
        // Converter para JSON
        const jsonData: ExcelRow[] = XLSX.utils.sheet_to_json(worksheet)
        
        if (jsonData.length === 0) {
          reject(new Error('Planilha vazia'))
          return
        }
        
        // Mapear colunas com detecção automática usando dados de exemplo
        const headers = Object.keys(jsonData[0])
        const columnMapping = mapColumns(headers, jsonData)
        
        // Validar se temos pelo menos data, estabelecimento e valor
        if (!columnMapping['quando'] || !columnMapping['estabelecimento'] || !columnMapping['valor']) {
          const missing = []
          const found = []
          
          if (!columnMapping['quando']) {
            missing.push('Data')
          } else {
            found.push(`Data: "${columnMapping['quando']}"`)
          }
          
          if (!columnMapping['estabelecimento']) {
            missing.push('Estabelecimento')
          } else {
            found.push(`Estabelecimento: "${columnMapping['estabelecimento']}"`)
          }
          
          if (!columnMapping['valor']) {
            missing.push('Valor')
          } else {
            found.push(`Valor: "${columnMapping['valor']}"`)
          }
          
          let errorMsg = `Colunas obrigatórias não encontradas: ${missing.join(', ')}.`
          
          if (found.length > 0) {
            errorMsg += `\n\nColunas detectadas: ${found.join(', ')}.`
          }
          
          errorMsg += `\n\nO sistema analisou o conteúdo de todas as colunas mas não conseguiu identificar ${missing.length === 1 ? 'esta coluna' : 'estas colunas'}.`
          errorMsg += `\n\nDicas:`
          errorMsg += `\n- Certifique-se de que há uma coluna com datas (qualquer formato)`
          errorMsg += `\n- Certifique-se de que há uma coluna com nomes de lugares/estabelecimentos (texto)`
          errorMsg += `\n- Certifique-se de que há uma coluna com valores monetários (números)`
          errorMsg += `\n- O sistema identifica pelo conteúdo, não apenas pelo nome da coluna`
          
          reject(new Error(errorMsg))
          return
        }
        
        // Processar linhas
        const transactions: ParsedTransaction[] = []
        
        jsonData.forEach((row, index) => {
          const parsed = parseRow(row, columnMapping)
          if (parsed) {
            transactions.push(parsed)
          }
        })
        
        if (transactions.length === 0) {
          reject(new Error('Nenhuma transação válida encontrada na planilha'))
          return
        }
        
        resolve(transactions)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'))
    }
    
    reader.readAsBinaryString(file)
  })
}

/**
 * Cria template de planilha Excel para download
 */
export function createExcelTemplate(): void {
  const templateData = [
    {
      'Data': '2025-01-15',
      'Estabelecimento': 'Supermercado',
      'Valor': 150.50,
      'Tipo': 'Despesa',
      'Detalhes': 'Compras do mês'
    },
    {
      'Data': '2025-01-16',
      'Estabelecimento': 'Salário',
      'Valor': 5000.00,
      'Tipo': 'Receita',
      'Detalhes': 'Salário mensal'
    },
    {
      'Data': '2025-01-17',
      'Estabelecimento': 'Posto de Gasolina',
      'Valor': 200.00,
      'Tipo': 'Despesa',
      'Detalhes': 'Abastecimento'
    }
  ]
  
  const worksheet = XLSX.utils.json_to_sheet(templateData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações')
  
  // Ajustar largura das colunas
  const colWidths = [
    { wch: 12 }, // Data
    { wch: 20 }, // Estabelecimento
    { wch: 12 }, // Valor
    { wch: 12 }, // Tipo
    { wch: 30 }  // Detalhes
  ]
  worksheet['!cols'] = colWidths
  
  XLSX.writeFile(workbook, 'template_transacoes.xlsx')
}

/**
 * Exporta transações para planilha Excel
 */
export function exportToExcel(transacoes: Transacao[]): void {
  if (!transacoes || transacoes.length === 0) {
    throw new Error('Nenhuma transação para exportar')
  }

  // Formatar dados para exportação
  const exportData = transacoes.map(transacao => {
    // Formatar data (quando está no formato YYYY-MM-DD)
    let dataFormatada = transacao.quando
    if (transacao.quando && transacao.quando.includes('-')) {
      const [ano, mes, dia] = transacao.quando.split('-')
      dataFormatada = `${dia}/${mes}/${ano}`
    }

    // Formatar tipo
    const tipoFormatado = transacao.tipo === 'receita' ? 'Receita' : 'Despesa'

    // Valor como número para o Excel poder fazer cálculos
    const valorNumerico = typeof transacao.valor === 'number' 
      ? transacao.valor
      : parseFloat(String(transacao.valor || 0))

    return {
      'Data': dataFormatada,
      'Estabelecimento': transacao.estabelecimento || '',
      'Valor': valorNumerico,
      'Tipo': tipoFormatado,
      'Categoria': transacao.categorias?.nome || 'Sem categoria',
      'Detalhes': transacao.detalhes || '',
      'Data de Criação': transacao.created_at 
        ? new Date(transacao.created_at).toLocaleString('pt-BR')
        : ''
    }
  })

  // Criar planilha
  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações')

  // Ajustar largura das colunas
  const colWidths = [
    { wch: 12 }, // Data
    { wch: 25 }, // Estabelecimento
    { wch: 15 }, // Valor
    { wch: 12 }, // Tipo
    { wch: 20 }, // Categoria
    { wch: 40 }, // Detalhes
    { wch: 20 }  // Data de Criação
  ]
  worksheet['!cols'] = colWidths

  // Gerar nome do arquivo com data atual
  const hoje = new Date()
  const dataFormatada = hoje.toLocaleDateString('pt-BR').replace(/\//g, '-')
  const nomeArquivo = `transacoes_${dataFormatada}.xlsx`

  // Fazer download
  XLSX.writeFile(workbook, nomeArquivo)
}


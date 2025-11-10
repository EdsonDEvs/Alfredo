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
  'importância': 'valor',
  'importancia': 'valor',
  'valor_transacao': 'valor',
  'valor_transacão': 'valor',
  'valor_transaction': 'valor',
  'valor_operacao': 'valor',
  'valor_operação': 'valor',
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
    ]
    
    const looksLikeDate = datePatterns.some(pattern => pattern.test(String(firstValue))) ||
                         (typeof firstValue === 'number' && firstValue > 40000 && firstValue < 50000) // Excel date serial
    
    if (looksLikeDate) {
      return 'quando'
    }
  }
  
  // Detectar Valor: valores numéricos
  if (!existingMapping['valor'] && sampleValues.length > 0) {
    const looksLikeNumber = sampleValues.some(v => {
      if (typeof v === 'number') return true
      if (typeof v === 'string') {
        const cleaned = v.replace(/[^\d,.-]/g, '')
        return !isNaN(parseFloat(cleaned.replace(',', '.')))
      }
      return false
    })
    
    if (looksLikeNumber) {
      return 'valor'
    }
  }
  
  // Detectar Tipo: valores que são receita/despesa
  if (!existingMapping['tipo'] && sampleValues.length > 0) {
    const looksLikeType = sampleValues.some(v => {
      const str = String(v).toLowerCase()
      return ['receita', 'despesa', 'income', 'expense', 'entrada', 'saída', 'saida'].includes(str)
    })
    
    if (looksLikeType) {
      return 'tipo'
    }
  }
  
  // Detectar Estabelecimento: valores de texto que não são data, número ou tipo
  if (!existingMapping['estabelecimento'] && sampleValues.length > 0) {
    const looksLikeText = sampleValues.some(v => {
      if (typeof v === 'string' && v.trim().length > 0) {
        // Não é data, não é número, não é tipo
        const isDate = /^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(v)
        const isNumber = !isNaN(parseFloat(v.replace(/[^\d,.-]/g, '').replace(',', '.')))
        const isType = ['receita', 'despesa', 'income', 'expense'].includes(v.toLowerCase())
        return !isDate && !isNumber && !isType
      }
      return false
    })
    
    if (looksLikeText) {
      return 'estabelecimento'
    }
  }
  
  return null
}

/**
 * Mapeia colunas da planilha para o formato do sistema
 * Agora com detecção automática inteligente
 */
function mapColumns(headers: string[], sampleData: ExcelRow[] = []): Record<string, string> {
  const mapping: Record<string, string> = {}
  
  // Primeiro, tentar mapeamento direto
  headers.forEach((header) => {
    const normalized = normalizeColumnName(header)
    const mappedColumn = columnMappings[normalized]
    
    if (mappedColumn && !mapping[mappedColumn]) {
      mapping[mappedColumn] = header
    }
  })
  
  // Se faltam campos obrigatórios, usar detecção automática
  if (!mapping['quando'] || !mapping['estabelecimento'] || !mapping['valor']) {
    headers.forEach((header) => {
      if (mapping['quando'] && mapping['estabelecimento'] && mapping['valor']) {
        return // Já temos tudo
      }
      
      // Pegar valores de exemplo desta coluna
      const sampleValues = sampleData.slice(0, 5).map(row => row[header]).filter(v => v !== undefined && v !== null)
      
      if (sampleValues.length > 0) {
        const detected = detectColumnType(header, sampleValues, mapping)
        if (detected && !mapping[detected]) {
          mapping[detected] = header
        }
      }
    })
  }
  
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
    // Remove caracteres não numéricos exceto ponto e vírgula
    const cleaned = value.replace(/[^\d,.-]/g, '')
    // Substitui vírgula por ponto
    const normalized = cleaned.replace(',', '.')
    const parsed = parseFloat(normalized)
    return isNaN(parsed) ? 0 : parsed
  }
  
  return 0
}

/**
 * Converte data para formato YYYY-MM-DD
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
    // Tenta vários formatos
    const formats = [
      /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
      /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
      /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
    ]
    
    for (const format of formats) {
      const match = value.match(format)
      if (match) {
        if (format === formats[0]) {
          // DD/MM/YYYY
          return `${match[3]}-${match[2]}-${match[1]}`
        } else if (format === formats[1]) {
          // YYYY-MM-DD
          return value
        } else if (format === formats[2]) {
          // DD-MM-YYYY
          return `${match[3]}-${match[2]}-${match[1]}`
        }
      }
    }
    
    // Tenta parse direto
    const date = new Date(value)
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
  if (['receita', 'income', 'entrada', 'ganho', 'gain', 'crédito', 'credito', 'credit', '+'].includes(normalized)) {
    return 'receita'
  }
  
  // Palavras-chave para despesa
  if (['despesa', 'expense', 'saída', 'saida', 'gasto', 'spend', 'débito', 'debito', 'debit', '-'].includes(normalized)) {
    return 'despesa'
  }
  
  // Padrão: despesa
  return 'despesa'
}

/**
 * Processa uma linha da planilha
 */
function parseRow(row: ExcelRow, columnMapping: Record<string, string>): ParsedTransaction | null {
  try {
    // Obter valores mapeados
    const dataValue = row[columnMapping['quando']]
    const estabelecimentoValue = row[columnMapping['estabelecimento']]
    const valorValue = row[columnMapping['valor']]
    const tipoValue = row[columnMapping['tipo']]
    const detalhesValue = row[columnMapping['detalhes']]
    
    // Validar campos obrigatórios
    if (!dataValue || !estabelecimentoValue || valorValue === undefined || valorValue === null) {
      return null
    }
    
    // Parse dos valores
    const quando = parseDate(dataValue)
    const estabelecimento = String(estabelecimentoValue).trim()
    const valor = parseValue(valorValue)
    const tipo = parseType(tipoValue, valor)
    const detalhes = detalhesValue ? String(detalhesValue).trim() : undefined
    
    // Validar se parse foi bem-sucedido
    if (!quando || !estabelecimento || valor === 0) {
      return null
    }
    
    return {
      quando,
      estabelecimento,
      valor: Math.abs(valor), // Sempre positivo
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
          if (!columnMapping['quando']) missing.push('Data')
          if (!columnMapping['estabelecimento']) missing.push('Estabelecimento')
          if (!columnMapping['valor']) missing.push('Valor')
          
          reject(new Error(`Colunas obrigatórias não encontradas: ${missing.join(', ')}. O sistema tentou detectar automaticamente mas não conseguiu. Verifique se sua planilha contém essas informações.`))
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


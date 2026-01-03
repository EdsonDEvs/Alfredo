const moment = require('moment');
const { logger } = require('../utils/logger');

// Configurar moment para português
moment.locale('pt-br');

/**
 * Processa texto e extrai dados de gastos
 * @param {string} text - Texto a ser processado
 * @param {string} userId - ID do usuário (opcional)
 * @returns {Promise<Object>} - Dados estruturados do gasto
 */
async function processText(text, userId = null) {
  try {
    logger.info(`💬 Processando texto: ${text.substring(0, 100)}...`);

    // Normalizar texto
    const normalizedText = normalizeText(text);
    
    // Extrair dados usando regex e heurísticas
    const extractedData = extractExpenseData(normalizedText);
    
    // Validar e completar dados
    const validatedData = await validateAndCompleteData(extractedData, userId);
    
    logger.info(`✅ Texto processado com sucesso`);
    logger.debug(`📊 Dados extraídos:`, validatedData);

    return validatedData;

  } catch (error) {
    logger.error('❌ Erro ao processar texto:', error);
    throw new Error(`Falha no processamento de texto: ${error.message}`);
  }
}

/**
 * Normaliza texto para processamento
 * @param {string} text - Texto original
 * @returns {string} - Texto normalizado
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ') // Múltiplos espaços para um
    .replace(/[^\w\s.,$R]/g, '') // Remove caracteres especiais
    .trim();
}

/**
 * Extrai dados de gastos do texto
 * @param {string} text - Texto normalizado
 * @returns {Object} - Dados extraídos
 */
function extractExpenseData(text) {
  const data = {
    valor: null,
    data: null,
    estabelecimento: null,
    categoria: null,
    tipo: 'despesa',
    detalhes: text,
    quando: new Date().toISOString()
  };

  // Padrões para valores monetários
  const valorPatterns = [
    /r?\$?\s*(\d+[.,]\d{2})/gi,
    /(\d+[.,]\d{2})\s*reais?/gi,
    /valor\s*:?\s*r?\$?\s*(\d+[.,]\d{2})/gi,
    /paguei\s*r?\$?\s*(\d+[.,]\d{2})/gi,
    /gastei\s*r?\$?\s*(\d+[.,]\d{2})/gi,
    /(\d+[.,]\d{2})\s*no\s*/gi
  ];

  // Padrões para datas
  const dataPatterns = [
    /(\d{2}\/\d{2}\/\d{4})/g,
    /(\d{2}-\d{2}-\d{4})/g,
    /(\d{4}-\d{2}-\d{2})/g,
    /hoje/gi,
    /ontem/gi,
    /(\d{1,2})\s*(?:de\s*)?(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)/gi
  ];

  // Padrões para estabelecimentos
  const estabelecimentoPatterns = [
    /no\s+([a-z\s]+?)(?:\s+por|\s+com|\s+valor|\s+r\$)/gi,
    /em\s+([a-z\s]+?)(?:\s+por|\s+com|\s+valor|\s+r\$)/gi,
    /na\s+([a-z\s]+?)(?:\s+por|\s+com|\s+valor|\s+r\$)/gi,
    /([a-z\s]+?)\s+por\s+r\$/gi
  ];

  // Padrões para categorias
  const categoriaPatterns = [
    /(?:categoria|categoria)\s*:?\s*([a-z\s]+)/gi,
    /(?:tipo|tipo)\s*:?\s*([a-z\s]+)/gi
  ];

  // Extrair valor
  for (const pattern of valorPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.valor = parseFloat(match[1].replace(',', '.'));
      break;
    }
  }

  // Extrair data
  for (const pattern of dataPatterns) {
    const match = text.match(pattern);
    if (match) {
      if (match[1] === 'hoje') {
        data.data = moment().format('YYYY-MM-DD');
      } else if (match[1] === 'ontem') {
        data.data = moment().subtract(1, 'day').format('YYYY-MM-DD');
      } else {
        data.data = parseDate(match[1]);
      }
      break;
    }
  }

  // Extrair estabelecimento
  for (const pattern of estabelecimentoPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.estabelecimento = match[1].trim();
      break;
    }
  }

  // Extrair categoria
  for (const pattern of categoriaPatterns) {
    const match = text.match(pattern);
    if (match) {
      data.categoria = match[1].trim();
      break;
    }
  }

  // Detectar tipo (receita/despesa)
  if (text.includes('recebi') || text.includes('ganhei') || text.includes('salário') || text.includes('pagamento')) {
    data.tipo = 'receita';
  }

  return data;
}

/**
 * Valida e completa dados extraídos
 * @param {Object} data - Dados extraídos
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} - Dados validados e completos
 */
async function validateAndCompleteData(data, userId) {
  const validatedData = { ...data };

  // Validar valor
  if (!validatedData.valor || validatedData.valor <= 0) {
    throw new Error('Valor não encontrado ou inválido no texto');
  }

  // Validar data
  if (!validatedData.data) {
    validatedData.data = moment().format('YYYY-MM-DD');
  }

  // Validar estabelecimento
  if (!validatedData.estabelecimento) {
    validatedData.estabelecimento = 'Estabelecimento não identificado';
  }

  // Formatar data para ISO
  if (validatedData.data) {
    validatedData.quando = moment(validatedData.data).toISOString();
  }

  // Adicionar userid se fornecido
  if (userId) {
    validatedData.userid = userId;
  }

  // Adicionar timestamp de criação
  validatedData.created_at = new Date().toISOString();

  return validatedData;
}

/**
 * Converte string de data para formato ISO
 * @param {string} dateStr - String da data
 * @returns {string} - Data no formato YYYY-MM-DD
 */
function parseDate(dateStr) {
  try {
    // Tentar diferentes formatos
    const formats = [
      'DD/MM/YYYY',
      'DD-MM-YYYY',
      'YYYY-MM-DD',
      'DD/MM/YY',
      'DD-MM-YY'
    ];

    for (const format of formats) {
      const parsed = moment(dateStr, format, true);
      if (parsed.isValid()) {
        return parsed.format('YYYY-MM-DD');
      }
    }

    // Se não conseguir parsear, usar data atual
    return moment().format('YYYY-MM-DD');

  } catch (error) {
    logger.warn(`⚠️ Erro ao parsear data: ${dateStr}`, error);
    return moment().format('YYYY-MM-DD');
  }
}

/**
 * Extrai informações específicas de mensagens de WhatsApp/Telegram
 * @param {string} text - Texto da mensagem
 * @returns {Object} - Dados estruturados
 */
function extractMessageData(text) {
  // Padrões específicos para mensagens de apps
  const patterns = {
    // Padrão: "Gastei R$ 50 no mercado"
    gasto: /gastei\s+r?\$?\s*(\d+[.,]\d{2})\s+(?:no|na|em)\s+([a-z\s]+)/gi,
    
    // Padrão: "Recebi R$ 1000 do cliente"
    receita: /recebi\s+r?\$?\s*(\d+[.,]\d{2})\s+(?:do|da|de)\s+([a-z\s]+)/gi,
    
    // Padrão: "Paguei R$ 25 por uber"
    pagamento: /paguei\s+r?\$?\s*(\d+[.,]\d{2})\s+por\s+([a-z\s]+)/gi
  };

  for (const [tipo, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      return {
        valor: parseFloat(match[1].replace(',', '.')),
        estabelecimento: match[2].trim(),
        tipo: tipo === 'receita' ? 'receita' : 'despesa'
      };
    }
  }

  return null;
}

module.exports = {
  processText,
  normalizeText,
  extractExpenseData,
  validateAndCompleteData,
  parseDate,
  extractMessageData
};

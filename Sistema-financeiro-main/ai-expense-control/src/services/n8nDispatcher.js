const axios = require('axios');
const { logger } = require('../utils/logger');

/**
 * Envia dados processados para o N8N
 * @param {Object} expenseData - Dados do gasto processado
 * @returns {Promise<Object>} - Resposta do N8N
 */
async function sendToN8N(expenseData) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nUrl) {
      logger.warn('⚠️ URL do N8N não configurada, pulando envio');
      return { status: 'skipped', reason: 'N8N_URL_NOT_CONFIGURED' };
    }

    logger.info(`🚀 Enviando dados para N8N: ${expenseData.estabelecimento} - R$ ${expenseData.valor}`);

    // Preparar payload para N8N
    const payload = {
      timestamp: new Date().toISOString(),
      source: 'ai-expense-control',
      version: '1.0.0',
      data: {
        // Dados da transação
        transaction: {
          id: expenseData.id,
          userid: expenseData.userid,
          quando: expenseData.quando,
          estabelecimento: expenseData.estabelecimento,
          valor: expenseData.valor,
          detalhes: expenseData.detalhes,
          tipo: expenseData.tipo,
          category_id: expenseData.category_id,
          created_at: expenseData.created_at
        },
        
        // Metadados do processamento
        processing: {
          categoria_detectada: expenseData.categoria_detectada,
          processed_by: expenseData.processed_by || 'ai-expense-control',
          confidence: expenseData.confidence || null,
          original_text: expenseData.original_text || null
        },
        
        // Dados adicionais para N8N
        metadata: {
          source_type: expenseData.source_type || 'unknown', // photo, audio, text
          file_path: expenseData.file_path || null,
          processing_time: expenseData.processing_time || null,
          ai_model: expenseData.ai_model || null
        }
      }
    };

    // Configurações da requisição
    const config = {
      timeout: 10000, // 10 segundos
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Expense-Control/1.0.0'
      }
    };

    // Enviar para N8N
    const response = await axios.post(n8nUrl, payload, config);

    logger.info(`✅ Dados enviados para N8N com sucesso - Status: ${response.status}`);
    logger.debug(`📊 Resposta do N8N:`, response.data);

    return {
      status: 'success',
      n8n_status: response.status,
      n8n_response: response.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar para N8N:', error.message);
    
    // Retornar erro detalhado
    return {
      status: 'error',
      error: error.message,
      n8n_status: error.response?.status || 'unknown',
      n8n_response: error.response?.data || null,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Envia dados em lote para o N8N
 * @param {Array<Object>} expensesData - Array de dados de gastos
 * @returns {Promise<Object>} - Resultado do envio em lote
 */
async function sendBatchToN8N(expensesData) {
  try {
    logger.info(`📦 Enviando lote de ${expensesData.length} gastos para N8N`);

    const results = [];
    const batchPayload = {
      timestamp: new Date().toISOString(),
      source: 'ai-expense-control',
      version: '1.0.0',
      batch_size: expensesData.length,
      data: expensesData.map(expense => ({
        transaction: {
          id: expense.id,
          userid: expense.userid,
          quando: expense.quando,
          estabelecimento: expense.estabelecimento,
          valor: expense.valor,
          detalhes: expense.detalhes,
          tipo: expense.tipo,
          category_id: expense.category_id,
          created_at: expense.created_at
        },
        processing: {
          categoria_detectada: expense.categoria_detectada,
          processed_by: expense.processed_by || 'ai-expense-control'
        }
      }))
    };

    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nUrl) {
      logger.warn('⚠️ URL do N8N não configurada, pulando envio em lote');
      return { status: 'skipped', reason: 'N8N_URL_NOT_CONFIGURED' };
    }

    const response = await axios.post(n8nUrl, batchPayload, {
      timeout: 30000, // 30 segundos para lote
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Expense-Control/1.0.0'
      }
    });

    logger.info(`✅ Lote enviado para N8N com sucesso - Status: ${response.status}`);

    return {
      status: 'success',
      batch_size: expensesData.length,
      n8n_status: response.status,
      n8n_response: response.data,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar lote para N8N:', error.message);
    
    return {
      status: 'error',
      batch_size: expensesData.length,
      error: error.message,
      n8n_status: error.response?.status || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Testa a conexão com o N8N
 * @returns {Promise<Object>} - Resultado do teste
 */
async function testN8NConnection() {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nUrl) {
      return {
        status: 'error',
        message: 'URL do N8N não configurada',
        config_required: true
      };
    }

    logger.info(`🔍 Testando conexão com N8N: ${n8nUrl}`);

    const testPayload = {
      timestamp: new Date().toISOString(),
      source: 'ai-expense-control',
      type: 'connection_test',
      message: 'Teste de conexão do sistema de IA de controle de gastos'
    };

    const response = await axios.post(n8nUrl, testPayload, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Expense-Control/1.0.0'
      }
    });

    logger.info(`✅ Conexão com N8N testada com sucesso - Status: ${response.status}`);

    return {
      status: 'success',
      n8n_url: n8nUrl,
      n8n_status: response.status,
      response_time: response.headers['x-response-time'] || 'unknown',
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('❌ Erro no teste de conexão com N8N:', error.message);
    
    return {
      status: 'error',
      n8n_url: process.env.N8N_WEBHOOK_URL,
      error: error.message,
      n8n_status: error.response?.status || 'unknown',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Envia notificação de erro para o N8N
 * @param {Object} errorData - Dados do erro
 * @returns {Promise<Object>} - Resultado do envio
 */
async function sendErrorToN8N(errorData) {
  try {
    const n8nUrl = process.env.N8N_WEBHOOK_URL;
    
    if (!n8nUrl) {
      logger.warn('⚠️ URL do N8N não configurada, não é possível enviar erro');
      return { status: 'skipped', reason: 'N8N_URL_NOT_CONFIGURED' };
    }

    const errorPayload = {
      timestamp: new Date().toISOString(),
      source: 'ai-expense-control',
      type: 'error_notification',
      severity: errorData.severity || 'error',
      error: {
        message: errorData.message,
        stack: errorData.stack,
        context: errorData.context,
        user_id: errorData.user_id,
        file_path: errorData.file_path
      }
    };

    const response = await axios.post(n8nUrl, errorPayload, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'AI-Expense-Control/1.0.0'
      }
    });

    logger.info(`✅ Erro enviado para N8N - Status: ${response.status}`);

    return {
      status: 'success',
      n8n_status: response.status,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('❌ Erro ao enviar notificação de erro para N8N:', error.message);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

module.exports = {
  sendToN8N,
  sendBatchToN8N,
  testN8NConnection,
  sendErrorToN8N
};

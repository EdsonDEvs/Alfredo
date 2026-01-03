const admin = require('firebase-admin');
const { logger } = require('../utils/logger');

// Inicializar Firebase Admin SDK
let db;

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });

  db = admin.firestore();
  logger.info('✅ Firebase Admin SDK inicializado com sucesso');

} catch (error) {
  logger.error('❌ Erro ao inicializar Firebase Admin SDK:', error);
  throw error;
}

/**
 * Salva dados de gasto no Firebase
 * @param {Object} expenseData - Dados do gasto
 * @returns {Promise<Object>} - Dados salvos
 */
async function saveToFirebase(expenseData) {
  try {
    logger.info(`💾 Salvando gasto no Firebase: ${expenseData.estabelecimento} - R$ ${expenseData.valor}`);

    // Preparar dados para salvar
    const transactionData = {
      userid: expenseData.userid || 'default-user',
      quando: expenseData.quando || new Date().toISOString(),
      estabelecimento: expenseData.estabelecimento,
      valor: expenseData.valor,
      detalhes: expenseData.detalhes || '',
      tipo: expenseData.tipo || 'despesa',
      category_id: expenseData.category_id || '',
      created_at: new Date().toISOString(),
      processed_by: 'ai-expense-control',
      categoria_detectada: expenseData.categoria_detectada || 'manual'
    };

    // Salvar na coleção de transações
    const docRef = await db.collection('transacoes').add(transactionData);
    
    logger.info(`✅ Gasto salvo com ID: ${docRef.id}`);

    // Retornar dados salvos com ID
    return {
      id: docRef.id,
      ...transactionData
    };

  } catch (error) {
    logger.error('❌ Erro ao salvar no Firebase:', error);
    throw new Error(`Falha ao salvar no Firebase: ${error.message}`);
  }
}

/**
 * Busca categorias do usuário no Firebase
 * @param {string} userId - ID do usuário
 * @returns {Promise<Array>} - Lista de categorias
 */
async function getUserCategories(userId) {
  try {
    logger.info(`🔍 Buscando categorias do usuário: ${userId}`);

    const snapshot = await db.collection('Categoria')
      .where('userid', '==', userId)
      .get();

    const categories = [];
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    logger.info(`✅ ${categories.length} categorias encontradas`);
    return categories;

  } catch (error) {
    logger.error('❌ Erro ao buscar categorias:', error);
    return [];
  }
}

/**
 * Busca transações do usuário no Firebase
 * @param {string} userId - ID do usuário
 * @param {Object} filters - Filtros opcionais
 * @returns {Promise<Array>} - Lista de transações
 */
async function getUserTransactions(userId, filters = {}) {
  try {
    logger.info(`🔍 Buscando transações do usuário: ${userId}`);

    let query = db.collection('transacoes').where('userid', '==', userId);

    // Aplicar filtros
    if (filters.tipo) {
      query = query.where('tipo', '==', filters.tipo);
    }

    if (filters.category_id) {
      query = query.where('category_id', '==', filters.category_id);
    }

    // Ordenar por data
    query = query.orderBy('quando', 'desc');

    const snapshot = await query.get();

    const transactions = [];
    snapshot.forEach(doc => {
      transactions.push({
        id: doc.id,
        ...doc.data()
      });
    });

    logger.info(`✅ ${transactions.length} transações encontradas`);
    return transactions;

  } catch (error) {
    logger.error('❌ Erro ao buscar transações:', error);
    return [];
  }
}

/**
 * Atualiza uma transação existente
 * @param {string} transactionId - ID da transação
 * @param {Object} updateData - Dados para atualizar
 * @returns {Promise<Object>} - Transação atualizada
 */
async function updateTransaction(transactionId, updateData) {
  try {
    logger.info(`🔄 Atualizando transação: ${transactionId}`);

    const updatePayload = {
      ...updateData,
      updated_at: new Date().toISOString()
    };

    await db.collection('transacoes').doc(transactionId).update(updatePayload);

    logger.info(`✅ Transação atualizada: ${transactionId}`);
    return { id: transactionId, ...updatePayload };

  } catch (error) {
    logger.error('❌ Erro ao atualizar transação:', error);
    throw new Error(`Falha ao atualizar transação: ${error.message}`);
  }
}

/**
 * Deleta uma transação
 * @param {string} transactionId - ID da transação
 * @returns {Promise<boolean>} - Sucesso da operação
 */
async function deleteTransaction(transactionId) {
  try {
    logger.info(`🗑️ Deletando transação: ${transactionId}`);

    await db.collection('transacoes').doc(transactionId).delete();

    logger.info(`✅ Transação deletada: ${transactionId}`);
    return true;

  } catch (error) {
    logger.error('❌ Erro ao deletar transação:', error);
    throw new Error(`Falha ao deletar transação: ${error.message}`);
  }
}

/**
 * Salva log de processamento
 * @param {Object} logData - Dados do log
 * @returns {Promise<Object>} - Log salvo
 */
async function saveProcessingLog(logData) {
  try {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...logData
    };

    await db.collection('processing_logs').add(logEntry);
    
    logger.debug(`📝 Log salvo: ${logData.type}`);

  } catch (error) {
    logger.warn('⚠️ Erro ao salvar log:', error);
  }
}

/**
 * Verifica se o Firebase está conectado
 * @returns {Promise<boolean>} - Status da conexão
 */
async function checkFirebaseConnection() {
  try {
    // Tentar fazer uma operação simples
    await db.collection('test').limit(1).get();
    return true;
  } catch (error) {
    logger.error('❌ Erro na conexão com Firebase:', error);
    return false;
  }
}

/**
 * Obtém estatísticas do Firebase
 * @param {string} userId - ID do usuário
 * @returns {Promise<Object>} - Estatísticas
 */
async function getFirebaseStats(userId) {
  try {
    const [transactionsSnapshot, categoriesSnapshot] = await Promise.all([
      db.collection('transacoes').where('userid', '==', userId).get(),
      db.collection('Categoria').where('userid', '==', userId).get()
    ]);

    const stats = {
      total_transactions: transactionsSnapshot.size,
      total_categories: categoriesSnapshot.size,
      last_updated: new Date().toISOString()
    };

    return stats;

  } catch (error) {
    logger.error('❌ Erro ao obter estatísticas:', error);
    return {
      total_transactions: 0,
      total_categories: 0,
      last_updated: new Date().toISOString()
    };
  }
}

module.exports = {
  saveToFirebase,
  getUserCategories,
  getUserTransactions,
  updateTransaction,
  deleteTransaction,
  saveProcessingLog,
  checkFirebaseConnection,
  getFirebaseStats,
  db
};

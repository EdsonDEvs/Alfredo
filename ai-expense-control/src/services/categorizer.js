const OpenAI = require('openai');
const { logger } = require('../utils/logger');

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Dicionário de categorias com palavras-chave
const categoryKeywords = {
  'Alimentação': [
    'restaurante', 'lanche', 'pizza', 'hambúrguer', 'sushi', 'mcdonalds', 'burger king',
    'subway', 'starbucks', 'café', 'padaria', 'confeitaria', 'doceria', 'sorveteria',
    'supermercado', 'mercado', 'feira', 'hortifruti', 'açougue', 'peixaria'
  ],
  'Transporte': [
    'uber', '99', 'taxi', 'onibus', 'metro', 'trem', 'combustível', 'gasolina',
    'etanol', 'diesel', 'posto', 'ipva', 'seguro', 'manutenção', 'estacionamento',
    'pedágio', 'uber eats', 'rappi', 'ifood'
  ],
  'Moradia': [
    'aluguel', 'condomínio', 'iptu', 'luz', 'energia', 'água', 'gás', 'internet',
    'telefone', 'tv', 'netflix', 'spotify', 'youtube premium', 'amazon prime'
  ],
  'Saúde': [
    'farmácia', 'médico', 'dentista', 'exame', 'consulta', 'medicamento', 'remédio',
    'plano de saúde', 'hospital', 'laboratório', 'fisioterapia', 'psicólogo'
  ],
  'Educação': [
    'escola', 'faculdade', 'universidade', 'curso', 'livro', 'material escolar',
    'mensalidade', 'matrícula', 'apostila', 'tutoria', 'inglês', 'espanhol'
  ],
  'Lazer': [
    'cinema', 'teatro', 'show', 'concerto', 'festival', 'bar', 'balada', 'pub',
    'viagem', 'hotel', 'airbnb', 'passagem', 'ingresso', 'jogo', 'videogame'
  ],
  'Vestuário': [
    'roupa', 'sapato', 'tenis', 'bolsa', 'mochila', 'acessório', 'joia', 'relógio',
    'perfume', 'cosmético', 'maquiagem', 'shopping', 'loja', 'outlet'
  ],
  'Tecnologia': [
    'celular', 'smartphone', 'computador', 'notebook', 'tablet', 'fone', 'cabo',
    'carregador', 'app', 'software', 'hardware', 'apple', 'samsung', 'xiaomi'
  ],
  'Serviços': [
    'manicure', 'cabeleireiro', 'barbeiro', 'limpeza', 'lavanderia', 'costura',
    'encanador', 'eletricista', 'pintor', 'pedreiro', 'jardineiro'
  ],
  'Investimentos': [
    'ações', 'fundos', 'tesouro', 'cdb', 'lci', 'lca', 'cripto', 'bitcoin',
    'ethereum', 'corretora', 'banco', 'poupança', 'investimento'
  ]
};

/**
 * Categoriza automaticamente um gasto
 * @param {Object} expenseData - Dados do gasto
 * @returns {Promise<Object>} - Dados com categoria atribuída
 */
async function categorizeExpense(expenseData) {
  try {
    logger.info(`🏷️ Categorizando gasto: ${expenseData.estabelecimento} - R$ ${expenseData.valor}`);

    // Primeiro, tentar categorização por palavras-chave
    const keywordCategory = categorizeByKeywords(expenseData);
    
    if (keywordCategory) {
      logger.info(`✅ Categoria encontrada por palavras-chave: ${keywordCategory}`);
      return {
        ...expenseData,
        category_id: keywordCategory,
        categoria_detectada: 'keywords'
      };
    }

    // Se não encontrou por palavras-chave, usar IA
    if (process.env.OPENAI_API_KEY) {
      const aiCategory = await categorizeByAI(expenseData);
      if (aiCategory) {
        logger.info(`✅ Categoria encontrada por IA: ${aiCategory}`);
        return {
          ...expenseData,
          category_id: aiCategory,
          categoria_detectada: 'ai'
        };
      }
    }

    // Categoria padrão se não conseguir categorizar
    logger.info(`⚠️ Usando categoria padrão: ${process.env.DEFAULT_CATEGORY || 'Outros'}`);
    return {
      ...expenseData,
      category_id: process.env.DEFAULT_CATEGORY || 'Outros',
      categoria_detectada: 'default'
    };

  } catch (error) {
    logger.error('❌ Erro na categorização:', error);
    
    // Retornar com categoria padrão em caso de erro
    return {
      ...expenseData,
      category_id: process.env.DEFAULT_CATEGORY || 'Outros',
      categoria_detectada: 'error'
    };
  }
}

/**
 * Categoriza usando palavras-chave
 * @param {Object} expenseData - Dados do gasto
 * @returns {string|null} - Categoria encontrada ou null
 */
function categorizeByKeywords(expenseData) {
  const text = `${expenseData.estabelecimento} ${expenseData.detalhes}`.toLowerCase();
  
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        return category;
      }
    }
  }
  
  return null;
}

/**
 * Categoriza usando IA (OpenAI)
 * @param {Object} expenseData - Dados do gasto
 * @returns {Promise<string|null>} - Categoria encontrada ou null
 */
async function categorizeByAI(expenseData) {
  try {
    const prompt = `
Analise o seguinte gasto e categorize-o em uma das categorias disponíveis:

Estabelecimento: ${expenseData.estabelecimento}
Valor: R$ ${expenseData.valor}
Detalhes: ${expenseData.detalhes}
Tipo: ${expenseData.tipo}

Categorias disponíveis:
- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Vestuário
- Tecnologia
- Serviços
- Investimentos

Responda apenas com o nome da categoria mais apropriada, sem explicações adicionais.
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em categorização de gastos financeiros. Responda apenas com o nome da categoria.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    });

    const category = response.choices[0].message.content.trim();
    
    // Validar se a categoria é válida
    if (Object.keys(categoryKeywords).includes(category)) {
      return category;
    }
    
    return null;

  } catch (error) {
    logger.error('❌ Erro na categorização por IA:', error);
    return null;
  }
}

/**
 * Aprende com categorizações manuais para melhorar futuras categorizações
 * @param {Object} expenseData - Dados do gasto
 * @param {string} correctCategory - Categoria correta
 */
function learnFromManualCategorization(expenseData, correctCategory) {
  try {
    // Adicionar palavras-chave do estabelecimento à categoria
    if (expenseData.estabelecimento && categoryKeywords[correctCategory]) {
      const newKeyword = expenseData.estabelecimento.toLowerCase();
      
      // Verificar se a palavra-chave já existe
      if (!categoryKeywords[correctCategory].includes(newKeyword)) {
        categoryKeywords[correctCategory].push(newKeyword);
        logger.info(`📚 Aprendizado: "${newKeyword}" adicionado à categoria "${correctCategory}"`);
      }
    }
  } catch (error) {
    logger.error('❌ Erro no aprendizado:', error);
  }
}

/**
 * Obtém estatísticas de categorização
 * @returns {Object} - Estatísticas
 */
function getCategorizationStats() {
  const stats = {
    total_categories: Object.keys(categoryKeywords).length,
    total_keywords: Object.values(categoryKeywords).reduce((sum, keywords) => sum + keywords.length, 0),
    categories: Object.keys(categoryKeywords),
    keywords_by_category: categoryKeywords
  };
  
  return stats;
}

/**
 * Adiciona nova categoria
 * @param {string} categoryName - Nome da categoria
 * @param {Array<string>} keywords - Palavras-chave da categoria
 */
function addCategory(categoryName, keywords = []) {
  if (!categoryKeywords[categoryName]) {
    categoryKeywords[categoryName] = keywords;
    logger.info(`➕ Nova categoria adicionada: "${categoryName}" com ${keywords.length} palavras-chave`);
  } else {
    logger.warn(`⚠️ Categoria "${categoryName}" já existe`);
  }
}

/**
 * Adiciona palavras-chave a uma categoria existente
 * @param {string} categoryName - Nome da categoria
 * @param {Array<string>} keywords - Novas palavras-chave
 */
function addKeywordsToCategory(categoryName, keywords) {
  if (categoryKeywords[categoryName]) {
    categoryKeywords[categoryName].push(...keywords);
    logger.info(`➕ ${keywords.length} palavras-chave adicionadas à categoria "${categoryName}"`);
  } else {
    logger.warn(`⚠️ Categoria "${categoryName}" não encontrada`);
  }
}

module.exports = {
  categorizeExpense,
  categorizeByKeywords,
  categorizeByAI,
  learnFromManualCategorization,
  getCategorizationStats,
  addCategory,
  addKeywordsToCategory,
  categoryKeywords
};

const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { logger } = require('../utils/logger');

/**
 * Processa imagem de comprovante usando OCR
 * @param {string} imagePath - Caminho da imagem
 * @returns {Promise<Object>} - Resultado do OCR
 */
async function processImage(imagePath) {
  try {
    logger.info(`🔍 Processando OCR da imagem: ${imagePath}`);

    // Pré-processar a imagem para melhorar OCR
    const processedImagePath = await preprocessImage(imagePath);
    
    // Configurações do Tesseract para português
    const result = await Tesseract.recognize(
      processedImagePath,
      'por', // Português
      {
        logger: m => logger.debug(`OCR Progress: ${m.progress * 100}%`),
        errorHandler: err => logger.error('OCR Error:', err)
      }
    );

    const extractedText = result.data.text;
    const confidence = result.data.confidence;

    logger.info(`✅ OCR concluído - Confiança: ${confidence}%`);
    logger.debug(`📝 Texto extraído: ${extractedText.substring(0, 200)}...`);

    // Limpar arquivo temporário
    await fs.unlink(processedImagePath).catch(err => 
      logger.warn('Erro ao deletar arquivo temporário:', err)
    );

    return {
      text: extractedText,
      confidence: confidence,
      originalPath: imagePath,
      processed: true
    };

  } catch (error) {
    logger.error('❌ Erro no processamento OCR:', error);
    throw new Error(`Falha no OCR: ${error.message}`);
  }
}

/**
 * Pré-processa imagem para melhorar qualidade do OCR
 * @param {string} imagePath - Caminho da imagem original
 * @returns {Promise<string>} - Caminho da imagem processada
 */
async function preprocessImage(imagePath) {
  try {
    const outputPath = imagePath.replace(/\.[^/.]+$/, '_processed.png');
    
    await sharp(imagePath)
      .resize(2000, null, { withoutEnlargement: true }) // Redimensionar se muito grande
      .sharpen() // Melhorar nitidez
      .normalize() // Normalizar contraste
      .threshold(128) // Converter para preto e branco
      .png()
      .toFile(outputPath);

    logger.debug(`🖼️ Imagem pré-processada salva em: ${outputPath}`);
    return outputPath;

  } catch (error) {
    logger.warn('⚠️ Erro no pré-processamento, usando imagem original:', error);
    return imagePath;
  }
}

/**
 * Extrai informações específicas de comprovantes
 * @param {string} text - Texto extraído do OCR
 * @returns {Object} - Dados estruturados
 */
function extractReceiptData(text) {
  const data = {
    valor: null,
    data: null,
    estabelecimento: null,
    itens: [],
    total: null
  };

  // Padrões para valores monetários
  const valorPatterns = [
    /R?\$?\s*(\d+[.,]\d{2})/gi,
    /total\s*:?\s*R?\$?\s*(\d+[.,]\d{2})/gi,
    /valor\s*:?\s*R?\$?\s*(\d+[.,]\d{2})/gi
  ];

  // Padrões para datas
  const dataPatterns = [
    /(\d{2}\/\d{2}\/\d{4})/g,
    /(\d{2}-\d{2}-\d{4})/g,
    /(\d{4}-\d{2}-\d{2})/g
  ];

  // Padrões para estabelecimentos
  const estabelecimentoPatterns = [
    /(?:estabelecimento|loja|empresa)\s*:?\s*([^\n]+)/gi,
    /^([A-Z][A-Z\s]+(?:LTDA|ME|EPP|SA))/gm
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
      data.data = match[1];
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

  return data;
}

module.exports = {
  processImage,
  preprocessImage,
  extractReceiptData
};

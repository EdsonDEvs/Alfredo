const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');
const { logger } = require('../utils/logger');

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Processa áudio de voz usando STT
 * @param {string} audioPath - Caminho do arquivo de áudio
 * @returns {Promise<Object>} - Resultado do STT
 */
async function processAudio(audioPath) {
  try {
    logger.info(`🎤 Processando áudio: ${audioPath}`);

    // Verificar se o arquivo existe
    await fs.access(audioPath);

    // Ler o arquivo de áudio
    const audioBuffer = await fs.readFile(audioPath);
    
    // Converter áudio para texto usando OpenAI Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([audioBuffer], { type: 'audio/mpeg' }),
      model: 'whisper-1',
      language: 'pt', // Português
      response_format: 'text'
    });

    const extractedText = transcription;
    
    logger.info(`✅ STT concluído`);
    logger.debug(`📝 Texto extraído: ${extractedText}`);

    return {
      text: extractedText,
      originalPath: audioPath,
      processed: true,
      model: 'whisper-1'
    };

  } catch (error) {
    logger.error('❌ Erro no processamento STT:', error);
    
    // Fallback: tentar com outras configurações
    if (error.message.includes('language')) {
      logger.info('🔄 Tentando sem especificar idioma...');
      return await processAudioFallback(audioPath);
    }
    
    throw new Error(`Falha no STT: ${error.message}`);
  }
}

/**
 * Fallback para processamento de áudio
 * @param {string} audioPath - Caminho do arquivo de áudio
 * @returns {Promise<Object>} - Resultado do STT
 */
async function processAudioFallback(audioPath) {
  try {
    const audioBuffer = await fs.readFile(audioPath);
    
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([audioBuffer], { type: 'audio/mpeg' }),
      model: 'whisper-1',
      response_format: 'text'
    });

    return {
      text: transcription,
      originalPath: audioPath,
      processed: true,
      model: 'whisper-1-fallback'
    };

  } catch (error) {
    logger.error('❌ Erro no fallback STT:', error);
    throw new Error(`Falha no STT (fallback): ${error.message}`);
  }
}

/**
 * Processa áudio usando OpenAI com prompt específico para gastos
 * @param {string} audioPath - Caminho do arquivo de áudio
 * @returns {Promise<Object>} - Resultado do STT com contexto
 */
async function processAudioWithContext(audioPath) {
  try {
    logger.info(`🎤 Processando áudio com contexto: ${audioPath}`);

    const audioBuffer = await fs.readFile(audioPath);
    
    // Usar Whisper com prompt específico para gastos
    const transcription = await openai.audio.transcriptions.create({
      file: new Blob([audioBuffer], { type: 'audio/mpeg' }),
      model: 'whisper-1',
      language: 'pt',
      response_format: 'text',
      prompt: 'Esta é uma mensagem sobre gastos financeiros, compras, despesas, valores, estabelecimentos, datas e categorias de despesas.'
    });

    const extractedText = transcription;
    
    logger.info(`✅ STT com contexto concluído`);
    logger.debug(`📝 Texto extraído: ${extractedText}`);

    return {
      text: extractedText,
      originalPath: audioPath,
      processed: true,
      model: 'whisper-1-context',
      hasContext: true
    };

  } catch (error) {
    logger.error('❌ Erro no STT com contexto:', error);
    // Fallback para STT normal
    return await processAudio(audioPath);
  }
}

/**
 * Valida se o arquivo de áudio é suportado
 * @param {string} audioPath - Caminho do arquivo
 * @returns {boolean} - Se é suportado
 */
function isAudioSupported(audioPath) {
  const supportedFormats = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];
  const ext = path.extname(audioPath).toLowerCase();
  return supportedFormats.includes(ext);
}

/**
 * Converte áudio para formato suportado se necessário
 * @param {string} audioPath - Caminho do arquivo original
 * @returns {Promise<string>} - Caminho do arquivo convertido
 */
async function convertAudioIfNeeded(audioPath) {
  // Por enquanto, retorna o caminho original
  // Implementar conversão se necessário
  return audioPath;
}

module.exports = {
  processAudio,
  processAudioWithContext,
  processAudioFallback,
  isAudioSupported,
  convertAudioIfNeeded
};

const axios = require('axios');
const { processImage } = require('./ocrService');
const { processAudio } = require('./sttService');
const { processText } = require('./textProcessor');
const { categorizeExpense } = require('./categorizer');
const { saveToFirebase } = require('./firebaseService');
const { sendToN8N } = require('./n8nDispatcher');
const { logger } = require('../utils/logger');

class WhatsAppService {
  constructor() {
    this.webhookUrl = process.env.WHATSAPP_WEBHOOK_URL;
    this.apiToken = process.env.WHATSAPP_API_TOKEN;
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  }

  // Processar mensagem recebida do WhatsApp
  async processWhatsAppMessage(messageData) {
    try {
      logger.info('📱 Processando mensagem do WhatsApp:', {
        type: messageData.type,
        from: messageData.from,
        timestamp: messageData.timestamp
      });

      let processedData = null;

      switch (messageData.type) {
        case 'text':
          processedData = await this.processTextMessage(messageData);
          break;
        case 'audio':
          processedData = await this.processAudioMessage(messageData);
          break;
        case 'image':
          processedData = await this.processImageMessage(messageData);
          break;
        default:
          await this.sendReply(messageData.from, 'Desculpe, só posso processar mensagens de texto, áudio ou imagem.');
          return;
      }

      if (processedData) {
        // Salvar no Firebase
        const savedData = await saveToFirebase(processedData);
        
        // Enviar para n8n
        await sendToN8N(processedData);

        // Enviar confirmação para o usuário
        await this.sendConfirmation(messageData.from, processedData);
      }

    } catch (error) {
      logger.error('❌ Erro ao processar mensagem do WhatsApp:', error);
      await this.sendReply(messageData.from, 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.');
    }
  }

  // Processar mensagem de texto
  async processTextMessage(messageData) {
    logger.info('📝 Processando mensagem de texto');
    
    const text = messageData.text.body;
    const userId = messageData.from; // Usar o número do WhatsApp como ID do usuário
    
    const processedData = await processText(text, userId);
    
    logger.info('✅ Texto processado:', processedData);
    return processedData;
  }

  // Processar mensagem de áudio
  async processAudioMessage(messageData) {
    logger.info('🎤 Processando mensagem de áudio');
    
    try {
      // Baixar o arquivo de áudio
      const audioUrl = await this.downloadMedia(messageData.audio.id);
      const userId = messageData.from;
      
      // Processar o áudio
      const transcribedText = await processAudio(audioUrl);
      
      // Processar o texto transcrito
      const processedData = await processText(transcribedText, userId);
      
      logger.info('✅ Áudio processado:', processedData);
      return processedData;
      
    } catch (error) {
      logger.error('❌ Erro ao processar áudio:', error);
      throw error;
    }
  }

  // Processar mensagem de imagem
  async processImageMessage(messageData) {
    logger.info('📸 Processando mensagem de imagem');
    
    try {
      // Baixar a imagem
      const imageUrl = await this.downloadMedia(messageData.image.id);
      const userId = messageData.from;
      
      // Processar a imagem com OCR
      const extractedText = await processImage(imageUrl);
      
      // Processar o texto extraído
      const processedData = await processText(extractedText, userId);
      
      logger.info('✅ Imagem processada:', processedData);
      return processedData;
      
    } catch (error) {
      logger.error('❌ Erro ao processar imagem:', error);
      throw error;
    }
  }

  // Baixar mídia do WhatsApp
  async downloadMedia(mediaId) {
    try {
      // Fazer requisição para obter a URL da mídia
      const mediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${mediaId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`
          }
        }
      );

      const mediaUrl = mediaResponse.data.url;
      
      // Baixar o arquivo
      const fileResponse = await axios.get(mediaUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`
        },
        responseType: 'arraybuffer'
      });

      // Salvar o arquivo temporariamente
      const fs = require('fs');
      const path = require('path');
      const fileName = `whatsapp_media_${Date.now()}.${this.getFileExtension(mediaResponse.data.mime_type)}`;
      const filePath = path.join(__dirname, '../../uploads', fileName);
      
      fs.writeFileSync(filePath, fileResponse.data);
      
      return filePath;
      
    } catch (error) {
      logger.error('❌ Erro ao baixar mídia:', error);
      throw error;
    }
  }

  // Obter extensão do arquivo baseado no MIME type
  getFileExtension(mimeType) {
    const extensions = {
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
      'audio/ogg': 'ogg',
      'audio/mpeg': 'mp3',
      'audio/wav': 'wav'
    };
    return extensions[mimeType] || 'bin';
  }

  // Enviar resposta para o WhatsApp
  async sendReply(to, message) {
    try {
      await axios.post(
        `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: to,
          type: 'text',
          text: { body: message }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      logger.info('✅ Resposta enviada para:', to);
      
    } catch (error) {
      logger.error('❌ Erro ao enviar resposta:', error);
    }
  }

  // Enviar confirmação de processamento
  async sendConfirmation(to, processedData) {
    const message = `✅ Despesa processada com sucesso!

💰 Valor: R$ ${processedData.valor?.toFixed(2) || 'N/A'}
🏪 Estabelecimento: ${processedData.estabelecimento || 'N/A'}
📅 Data: ${processedData.data || 'N/A'}
🏷️ Categoria: ${processedData.categoria || 'N/A'}

Os dados foram salvos no seu sistema de controle financeiro!`;

    await this.sendReply(to, message);
  }

  // Verificar se o webhook é válido (para configuração inicial)
  async verifyWebhook(mode, token, challenge) {
    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }
    throw new Error('Webhook verification failed');
  }
}

module.exports = { WhatsAppService };

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const { processImage } = require('./services/ocrService');
const { processAudio } = require('./services/sttService');
const { processText } = require('./services/textProcessor');
const { categorizeExpense } = require('./services/categorizer');
const { sendToN8N } = require('./services/n8nDispatcher');
const { saveToFirebase } = require('./services/firebaseService');
const { WhatsAppService } = require('./services/whatsappService');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir arquivos estáticos
app.use(express.static('public'));

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = process.env.ALLOWED_IMAGE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'image/webp'];
    const allowedAudioTypes = process.env.ALLOWED_AUDIO_TYPES?.split(',') || ['audio/mpeg', 'audio/wav', 'audio/ogg'];
    
    if (allowedImageTypes.includes(file.mimetype) || allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado'), false);
    }
  }
});

// =====================================================
// ENDPOINTS PRINCIPAIS
// =====================================================

// POST /api/ingest/photo - Processar foto de comprovante
app.post('/api/ingest/photo', upload.single('image'), async (req, res) => {
  try {
    logger.info('📸 Processando foto de comprovante');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    // Extrair texto da imagem usando OCR
    const ocrResult = await processImage(req.file.path);
    logger.info('OCR Result:', ocrResult);

    // Processar e extrair dados do gasto
    const expenseData = await processText(ocrResult.text);
    logger.info('Dados extraídos:', expenseData);

    // Categorizar automaticamente
    const categorizedData = await categorizeExpense(expenseData);
    logger.info('Dados categorizados:', categorizedData);

    // Salvar no Firebase
    const savedData = await saveToFirebase(categorizedData);
    logger.info('Dados salvos no Firebase:', savedData);

    // Enviar para N8N
    const n8nResponse = await sendToN8N(categorizedData);
    logger.info('Enviado para N8N:', n8nResponse);

    res.json({
      success: true,
      message: 'Gasto processado com sucesso!',
      data: categorizedData,
      n8n_status: n8nResponse.status
    });

  } catch (error) {
    logger.error('Erro ao processar foto:', error);
    res.status(500).json({ 
      error: 'Erro ao processar foto', 
      details: error.message 
    });
  }
});

// POST /api/ingest/audio - Processar áudio de voz
app.post('/api/ingest/audio', upload.single('audio'), async (req, res) => {
  try {
    logger.info('🎤 Processando áudio de voz');
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum áudio enviado' });
    }

    // Converter áudio para texto usando STT
    const sttResult = await processAudio(req.file.path);
    logger.info('STT Result:', sttResult);

    // Processar e extrair dados do gasto
    const expenseData = await processText(sttResult.text);
    logger.info('Dados extraídos:', expenseData);

    // Categorizar automaticamente
    const categorizedData = await categorizeExpense(expenseData);
    logger.info('Dados categorizados:', categorizedData);

    // Salvar no Firebase
    const savedData = await saveToFirebase(categorizedData);
    logger.info('Dados salvos no Firebase:', savedData);

    // Enviar para N8N
    const n8nResponse = await sendToN8N(categorizedData);
    logger.info('Enviado para N8N:', n8nResponse);

    res.json({
      success: true,
      message: 'Gasto processado com sucesso!',
      data: categorizedData,
      n8n_status: n8nResponse.status
    });

  } catch (error) {
    logger.error('Erro ao processar áudio:', error);
    res.status(500).json({ 
      error: 'Erro ao processar áudio', 
      details: error.message 
    });
  }
});

// POST /api/ingest/text - Processar mensagem de texto
app.post('/api/ingest/text', async (req, res) => {
  try {
    logger.info('💬 Processando mensagem de texto');
    
    const { text, userId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }

    // Processar e extrair dados do gasto
    const expenseData = await processText(text, userId);
    logger.info('Dados extraídos:', expenseData);

    // Categorizar automaticamente
    const categorizedData = await categorizeExpense(expenseData);
    logger.info('Dados categorizados:', categorizedData);

    // Salvar no Firebase
    const savedData = await saveToFirebase(categorizedData);
    logger.info('Dados salvos no Firebase:', savedData);

    // Enviar para N8N
    const n8nResponse = await sendToN8N(categorizedData);
    logger.info('Enviado para N8N:', n8nResponse);

    res.json({
      success: true,
      message: 'Gasto processado com sucesso!',
      data: categorizedData,
      n8n_status: n8nResponse.status
    });

  } catch (error) {
    logger.error('Erro ao processar texto:', error);
    res.status(500).json({ 
      error: 'Erro ao processar texto', 
      details: error.message 
    });
  }
});

// GET /api/health - Verificar status do sistema
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    services: {
      ocr: 'active',
      stt: 'active',
      categorizer: 'active',
      firebase: 'active',
      n8n: 'active',
      whatsapp: process.env.WHATSAPP_API_TOKEN ? 'configured' : 'not configured'
    }
  });
});

// =====================================================
// ENDPOINTS DO WHATSAPP
// =====================================================

const whatsappService = new WhatsAppService();

// Webhook para verificação do WhatsApp
app.get('/api/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  try {
    const result = whatsappService.verifyWebhook(mode, token, challenge);
    res.status(200).send(result);
  } catch (error) {
    logger.error('❌ Erro na verificação do webhook:', error);
    res.status(403).send('Forbidden');
  }
});

// Webhook para receber mensagens do WhatsApp
app.post('/api/whatsapp/webhook', async (req, res) => {
  try {
    const body = req.body;
    
    // Verificar se é uma mensagem válida
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (value?.messages && value.messages.length > 0) {
        const message = value.messages[0];
        
        // Determinar o tipo de mensagem
        let messageData = {
          from: message.from,
          timestamp: message.timestamp,
          type: 'text'
        };

        if (message.text) {
          messageData.type = 'text';
          messageData.text = message.text;
        } else if (message.audio) {
          messageData.type = 'audio';
          messageData.audio = message.audio;
        } else if (message.image) {
          messageData.type = 'image';
          messageData.image = message.image;
        }

        // Processar a mensagem
        await whatsappService.processWhatsAppMessage(messageData);
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    logger.error('❌ Erro no webhook do WhatsApp:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint para enviar mensagem manual (para testes)
app.post('/api/whatsapp/send', async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'to e message são obrigatórios' });
    }

    await whatsappService.sendReply(to, message);
    res.json({ success: true, message: 'Mensagem enviada com sucesso' });
  } catch (error) {
    logger.error('❌ Erro ao enviar mensagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Middleware de tratamento de erros
app.use((error, req, res, next) => {
  logger.error('Erro não tratado:', error);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    details: process.env.NODE_ENV === 'development' ? error.message : 'Erro interno'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor de IA de Controle de Gastos rodando na porta ${PORT}`);
  logger.info(`📊 Health check: http://localhost:${PORT}/api/health`);
  logger.info(`📸 Upload de fotos: http://localhost:${PORT}/api/ingest/photo`);
  logger.info(`🎤 Upload de áudio: http://localhost:${PORT}/api/ingest/audio`);
  logger.info(`💬 Processar texto: http://localhost:${PORT}/api/ingest/text`);
});

module.exports = app;

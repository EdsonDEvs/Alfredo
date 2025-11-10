const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const multer = require('multer');

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Configuração do Multer para upload de arquivos
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// =====================================================
// SERVIÇOS
// =====================================================

// Serviço de OCR
async function processImage(imageBuffer) {
  try {
    const Tesseract = require('tesseract.js');
    const sharp = require('sharp');
    
    // Processar imagem com Sharp
    const processedImage = await sharp(imageBuffer)
      .resize(800, 600, { fit: 'inside' })
      .sharpen()
      .normalize()
      .threshold(128)
      .toBuffer();
    
    // OCR com Tesseract
    const result = await Tesseract.recognize(processedImage, 'por', {
      logger: m => console.log(m)
    });
    
    return {
      text: result.data.text,
      confidence: result.data.confidence
    };
  } catch (error) {
    console.error('Erro no OCR:', error);
    throw error;
  }
}

// Serviço de STT (Speech-to-Text)
async function processAudio(audioBuffer) {
  try {
    const OpenAI = require('openai');
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Converter buffer para arquivo temporário
    const fs = require('fs');
    const tempFile = `/tmp/audio_${Date.now()}.wav`;
    fs.writeFileSync(tempFile, audioBuffer);
    
    // Transcrever com OpenAI Whisper
    const transcript = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFile),
      model: 'whisper-1',
      language: 'pt'
    });
    
    // Limpar arquivo temporário
    fs.unlinkSync(tempFile);
    
    return {
      text: transcript.text,
      language: transcript.language
    };
  } catch (error) {
    console.error('Erro no STT:', error);
    throw error;
  }
}

// Processador de texto
async function processText(text, userId = 'default') {
  try {
    const moment = require('moment');
    moment.locale('pt-br');
    
    // Regex para extrair dados
    const valorRegex = /R?\$?\s*(\d+[.,]\d+|\d+)/gi;
    const dataRegex = /(hoje|ontem|amanhã|(\d{1,2}\/\d{1,2}\/\d{4})|(\d{1,2}-\d{1,2}-\d{4}))/gi;
    const estabelecimentoRegex = /(no|na|em|por)\s+([a-zA-ZÀ-ÿ\s]+?)(?=\s+(?:R?\$|hoje|ontem|amanhã|\d{1,2}))/gi;
    
    // Extrair valor
    const valorMatch = text.match(valorRegex);
    const valor = valorMatch ? parseFloat(valorMatch[0].replace(/[R$\s]/g, '').replace(',', '.')) : 0;
    
    // Extrair data
    let data = new Date().toISOString();
    const dataMatch = text.match(dataRegex);
    if (dataMatch) {
      if (dataMatch[0].toLowerCase() === 'hoje') {
        data = moment().toISOString();
      } else if (dataMatch[0].toLowerCase() === 'ontem') {
        data = moment().subtract(1, 'day').toISOString();
      } else if (dataMatch[0].toLowerCase() === 'amanhã') {
        data = moment().add(1, 'day').toISOString();
      } else {
        data = moment(dataMatch[0], ['DD/MM/YYYY', 'DD-MM-YYYY']).toISOString();
      }
    }
    
    // Extrair estabelecimento
    let estabelecimento = 'Desconhecido';
    const estabelecimentoMatch = text.match(estabelecimentoRegex);
    if (estabelecimentoMatch) {
      estabelecimento = estabelecimentoMatch[0].replace(/^(no|na|em|por)\s+/i, '').trim();
    }
    
    // Determinar tipo
    const tipo = text.toLowerCase().includes('recebi') || text.toLowerCase().includes('ganhei') ? 'receita' : 'despesa';
    
    // Categorizar
    const categoria = await categorizeExpense(text, estabelecimento);
    
    return {
      userid: userId,
      quando: data,
      estabelecimento: estabelecimento,
      valor: valor,
      detalhes: text,
      tipo: tipo,
      category_id: categoria,
      created_at: new Date().toISOString(),
      processed_by: 'netlify-functions'
    };
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    throw error;
  }
}

// Categorizador
async function categorizeExpense(text, estabelecimento) {
  const textLower = text.toLowerCase();
  const estabelecimentoLower = estabelecimento.toLowerCase();
  
  const categorias = {
    'Alimentação': ['mercado', 'supermercado', 'restaurante', 'padaria', 'lanche', 'comida', 'alimento'],
    'Transporte': ['uber', '99', 'taxi', 'ônibus', 'metrô', 'combustível', 'gasolina', 'posto'],
    'Saúde': ['farmácia', 'médico', 'hospital', 'consulta', 'exame', 'remédio'],
    'Educação': ['curso', 'livro', 'escola', 'universidade', 'material'],
    'Lazer': ['cinema', 'show', 'teatro', 'viagem', 'passeio'],
    'Moradia': ['aluguel', 'conta', 'luz', 'água', 'internet'],
    'Vestuário': ['roupa', 'calçado', 'loja', 'shopping'],
    'Tecnologia': ['eletrônico', 'celular', 'computador', 'software'],
    'Serviços': ['manicure', 'cabeleireiro', 'limpeza'],
    'Investimentos': ['ação', 'fundo', 'cripto', 'investimento']
  };
  
  for (const [categoria, palavras] of Object.entries(categorias)) {
    for (const palavra of palavras) {
      if (textLower.includes(palavra) || estabelecimentoLower.includes(palavra)) {
        return categoria;
      }
    }
  }
  
  return 'Outros';
}

// Salvar no Firestore
async function saveToFirebase(data) {
  try {
    const db = admin.firestore();
    const docRef = await db.collection('transacoes').add(data);
    console.log('Transação salva com ID:', docRef.id);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Erro ao salvar no Firebase:', error);
    throw error;
  }
}

// Enviar para n8n (se configurado)
async function sendToN8N(data) {
  try {
    if (!process.env.N8N_WEBHOOK_URL) {
      console.log('N8N não configurado, pulando...');
      return { status: 'not_configured' };
    }
    
    const axios = require('axios');
    const response = await axios.post(process.env.N8N_WEBHOOK_URL, {
      timestamp: new Date().toISOString(),
      source: 'netlify-functions',
      data: data
    });
    
    return { status: 'success', response: response.data };
  } catch (error) {
    console.error('Erro ao enviar para N8N:', error);
    return { status: 'error', error: error.message };
  }
}

// =====================================================
// ENDPOINTS
// =====================================================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'netlify-functions',
    version: '1.0.0'
  });
});

// Processar foto
app.post('/ingest/photo', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }
    
    console.log('📸 Processando foto...');
    
    // OCR
    const ocrResult = await processImage(req.file.buffer);
    console.log('OCR Result:', ocrResult);
    
    // Processar texto
    const expenseData = await processText(ocrResult.text, req.body.userId);
    console.log('Dados extraídos:', expenseData);
    
    // Salvar no Firebase
    const savedData = await saveToFirebase(expenseData);
    
    // Enviar para N8N
    const n8nResponse = await sendToN8N(savedData);
    
    res.json({
      success: true,
      message: 'Foto processada com sucesso!',
      data: savedData,
      ocr: ocrResult,
      n8n_status: n8nResponse.status
    });
    
  } catch (error) {
    console.error('Erro ao processar foto:', error);
    res.status(500).json({ 
      error: 'Erro ao processar foto', 
      details: error.message 
    });
  }
});

// Processar áudio
app.post('/ingest/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum áudio enviado' });
    }
    
    console.log('🎤 Processando áudio...');
    
    // STT
    const sttResult = await processAudio(req.file.buffer);
    console.log('STT Result:', sttResult);
    
    // Processar texto
    const expenseData = await processText(sttResult.text, req.body.userId);
    console.log('Dados extraídos:', expenseData);
    
    // Salvar no Firebase
    const savedData = await saveToFirebase(expenseData);
    
    // Enviar para N8N
    const n8nResponse = await sendToN8N(savedData);
    
    res.json({
      success: true,
      message: 'Áudio processado com sucesso!',
      data: savedData,
      stt: sttResult,
      n8n_status: n8nResponse.status
    });
    
  } catch (error) {
    console.error('Erro ao processar áudio:', error);
    res.status(500).json({ 
      error: 'Erro ao processar áudio', 
      details: error.message 
    });
  }
});

// Processar texto
app.post('/ingest/text', async (req, res) => {
  try {
    const { text, userId } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Texto não fornecido' });
    }
    
    console.log('💬 Processando texto...');
    
    // Processar texto
    const expenseData = await processText(text, userId);
    console.log('Dados extraídos:', expenseData);
    
    // Salvar no Firebase
    const savedData = await saveToFirebase(expenseData);
    
    // Enviar para N8N
    const n8nResponse = await sendToN8N(savedData);
    
    res.json({
      success: true,
      message: 'Texto processado com sucesso!',
      data: savedData,
      n8n_status: n8nResponse.status
    });
    
  } catch (error) {
    console.error('Erro ao processar texto:', error);
    res.status(500).json({ 
      error: 'Erro ao processar texto', 
      details: error.message 
    });
  }
});

// =====================================================
// ENDPOINTS DO WHATSAPP
// =====================================================

// Webhook de verificação do WhatsApp
app.get('/whatsapp/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || 'SantosDrumont';
  
  if (mode === 'subscribe' && token === verifyToken) {
    console.log('✅ Webhook verificado com sucesso');
    res.status(200).send(challenge);
  } else {
    console.log('❌ Falha na verificação do webhook');
    res.status(403).send('Forbidden');
  }
});

// Webhook para receber mensagens do WhatsApp
app.post('/whatsapp/webhook', async (req, res) => {
  try {
    const body = req.body;
    
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (value?.messages && value.messages.length > 0) {
        const message = value.messages[0];
        
        console.log('📱 Mensagem recebida do WhatsApp:', message);
        
        let processedData = null;
        
        if (message.text) {
          // Processar mensagem de texto
          processedData = await processText(message.text.body, message.from);
        } else if (message.audio) {
          // TODO: Implementar processamento de áudio do WhatsApp
          console.log('🎤 Áudio recebido (não implementado ainda)');
        } else if (message.image) {
          // TODO: Implementar processamento de imagem do WhatsApp
          console.log('📸 Imagem recebida (não implementado ainda)');
        }
        
        if (processedData) {
          // Salvar no Firebase
          const savedData = await saveToFirebase(processedData);
          
          // Enviar para N8N
          await sendToN8N(savedData);
          
          console.log('✅ Mensagem processada e salva');
        }
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Erro no webhook do WhatsApp:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Exportar para Netlify Functions
exports.handler = app;

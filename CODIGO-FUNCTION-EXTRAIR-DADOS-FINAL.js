// ============================================
// Node Function: Extrair Dados da Evolution API
// Cole este código no node "Function" do n8n
// Posicione ANTES do node "Organiza Dados"
// ============================================

// Extrair dados da Evolution API
const input = $input.first().json;

// Verificar se os dados estão em body (webhook) ou direto
const body = input.body || input;
const event = body.event || input.event || '';

// Se for presence.update, retornar dados vazios (não processar)
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: 'Usuário',
      userId: null,
      skip: true,
      event: event
    }
  };
}

// Para messages.upsert, extrair dados
const data = body.data || {};

// Extrair número do WhatsApp (número do CLIENTE que enviou)
let whatsapp = '';
if (data.key && data.key.remoteJid) {
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .trim();
}

// Se não encontrou, retornar vazio (não usar body.sender - pode ser número do bot)
if (!whatsapp) {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'unknown',
      messageId: '',
      firstname: 'Usuário',
      userId: null,
      skip: true,
      event: event
    }
  };
}

// Extrair mensagem
let mensagem = '';
if (data.message && data.message.conversation) {
  mensagem = data.message.conversation;
} else if (data.message && data.message.extendedTextMessage && data.message.extendedTextMessage.text) {
  mensagem = data.message.extendedTextMessage.text;
}

// Extrair nome
const firstname = data.pushName || data.notifyName || 'Usuário';

// Extrair tipo
let tipo = 'text';
if (data.messageType) {
  tipo = data.messageType;
} else if (data.message && data.message.imageMessage) {
  tipo = 'image';
} else if (data.message && data.message.audioMessage) {
  tipo = 'audio';
} else if (data.message && data.message.videoMessage) {
  tipo = 'video';
} else if (mensagem) {
  tipo = 'text';
}

// Extrair ID da mensagem
const messageId = (data.key && data.key.id) || data.id || '';

// Retornar dados extraídos
return {
  json: {
    whatsapp: whatsapp,
    mensagem: mensagem,
    tipo: tipo,
    messageId: messageId,
    firstname: firstname,
    userId: null,
    event: event,
    skip: false
  }
};



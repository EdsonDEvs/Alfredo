// ============================================
// Node Function: Normalizar Dados - Estrutura Real
// Cole este código no node "Function" do n8n
// ============================================

// Normalizar dados da Evolution API - Estrutura real identificada
const input = $input.first().json;

// Verificar se os dados estão em body (webhook) ou direto
const body = input.body || input;
const event = body.event || input.event || '';

// Se for evento de presença, pular (não tem mensagem)
if (event === 'presence.update') {
  return {
    json: {
      whatsapp: '',
      mensagem: '',
      tipo: 'presence',
      messageId: '',
      firstname: '',
      userId: null,
      skip: true,
      event: event
    }
  };
}

// Para eventos de mensagem (messages.upsert)
const data = body.data || input.data || body;

// Extrair número do WhatsApp
let whatsapp = '';
if (data?.key?.remoteJid) {
  // Estrutura: messages.upsert - body.data.key.remoteJid
  whatsapp = String(data.key.remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .trim();
} else if (input.sender) {
  // Estrutura: presence.update (fallback - não deveria chegar aqui)
  whatsapp = String(input.sender)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .trim();
}

// Extrair mensagem
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data?.messageText) {
  mensagem = data.messageText;
}

// Extrair nome
const firstname = data?.pushName || data?.notifyName || data?.name || 'Usuário';

// Extrair tipo de mensagem
let tipo = 'text';
if (data?.message?.imageMessage) tipo = 'image';
else if (data?.message?.audioMessage) tipo = 'audio';
else if (data?.message?.videoMessage) tipo = 'video';
else if (data?.message?.documentMessage) tipo = 'document';
else if (data?.messageType) tipo = data.messageType;
else if (mensagem) tipo = 'text';

// Extrair ID da mensagem
const messageId = data?.key?.id || data?.id || data?.messageId || '';

// Retornar dados normalizados
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


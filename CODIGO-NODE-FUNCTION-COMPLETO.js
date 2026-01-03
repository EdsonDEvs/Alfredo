// ============================================
// Node Function: Normalizar Dados da Evolution API
// Cole este código no node "Function" do n8n
// ============================================

// Normalizar dados da Evolution API - Funciona com qualquer estrutura
const input = $input.first().json;

// Encontrar os dados (funciona com qualquer estrutura)
function findData(obj) {
  // Tentar diferentes caminhos comuns
  if (obj?.body?.data?.key?.remoteJid) return obj.body.data;
  if (obj?.body?.data?.sender) return obj.body.data;
  if (obj?.body?.data?.message) return obj.body.data;
  if (obj?.data?.key?.remoteJid) return obj.data;
  if (obj?.data?.sender) return obj.data;
  if (obj?.key?.remoteJid) return obj;
  if (obj?.sender) return obj;
  return obj;
}

const data = findData(input);
const body = input.body || {};

// Verificar evento
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

// Extrair número do WhatsApp (tentar todos os caminhos possíveis)
let whatsapp = '';
const remoteJid = data?.key?.remoteJid || data?.sender || data?.remoteJid || data?.from || '';
if (remoteJid) {
  whatsapp = String(remoteJid)
    .replace('@s.whatsapp.net', '')
    .replace('@g.us', '')
    .replace('@c.us', '')
    .replace('@', '')
    .trim();
}

// Extrair mensagem (tentar todos os caminhos possíveis)
let mensagem = '';
if (data?.message?.conversation) {
  mensagem = data.message.conversation;
} else if (data?.message?.extendedTextMessage?.text) {
  mensagem = data.message.extendedTextMessage.text;
} else if (data?.messageText) {
  mensagem = data.messageText;
} else if (data?.text) {
  mensagem = data.text;
} else if (data?.body) {
  mensagem = data.body;
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


# 🔧 Ajustes para Uazapi - Workflow n8n

## ✅ Correções Aplicadas

### 1. **Node "Organiza Dados"** ✅

**Problema:** 
- Estava tentando referenciar `$('InicioChat')` que não estava conectado no fluxo
- Estrutura de dados do uazapi é diferente da Evolution API

**Solução:**
- ✅ Alterado para usar `$json` diretamente (dados do node anterior)
- ✅ Adicionado suporte para múltiplas estruturas de dados (uazapi, Evolution API, etc.)
- ✅ Expressões flexíveis que funcionam com diferentes formatos

**Expressões Corrigidas:**

#### Campo: `whatsapp`
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### Campo: `mensagem`
```javascript
{{ $json.body?.message || $json.body?.text || $json.body?.data?.message?.conversation || $json.body?.data?.message?.extendedTextMessage?.text || $json.message || $json.text || '' }}
```

#### Campo: `tipo`
```javascript
{{ $json.body?.type || $json.body?.messageType || $json.body?.data?.messageType || ($json.body?.image || $json.image ? 'imageMessage' : ($json.body?.audio || $json.audio ? 'audioMessage' : 'conversation')) }}
```

#### Campo: `messageId`
```javascript
{{ $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

#### Campo: `firstname`
```javascript
{{ $json.body?.name || $json.body?.pushName || $json.body?.data?.pushName || $json.name || $json.pushName || 'Usuário' }}
```

---

### 2. **Node "Auth"** ✅

**Problema:**
- Estava usando estrutura específica da Evolution API

**Solução:**
- ✅ Atualizado para usar a mesma lógica flexível do "Organiza Dados"

**Filtro Corrigido:**
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

---

### 3. **Nodes de Busca de Mídia** ✅

**Problema:**
- Estavam usando `$('InicioChat')` que não estava conectado

**Solução:**
- ✅ Alterado para usar `$json` diretamente

**URL Corrigida:**
```javascript
https://SEU_SERVIDOR_EVOLUTION_API/chat/getMedia/Alfredoo/{{ $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

---

## 📋 Estrutura de Dados do Uazapi

### Formato Esperado (Exemplos)

#### Mensagem de Texto:
```json
{
  "body": {
    "phone": "553172242378",
    "message": "Gastei 50 reais no mercado",
    "type": "text",
    "id": "message_id_123",
    "name": "Nome do Usuário"
  }
}
```

#### Mensagem de Imagem:
```json
{
  "body": {
    "phone": "553172242378",
    "image": "base64_data",
    "type": "image",
    "id": "message_id_123"
  }
}
```

#### Mensagem de Áudio:
```json
{
  "body": {
    "phone": "553172242378",
    "audio": "base64_data",
    "type": "audio",
    "id": "message_id_123"
  }
}
```

---

## ✅ Vantagens das Correções

1. **✅ Compatível com múltiplas APIs** - Funciona com uazapi, Evolution API, etc.
2. **✅ Não depende de conexão específica** - Usa `$json` do node anterior
3. **✅ Expressões flexíveis** - Tenta múltiplos caminhos de dados
4. **✅ Tratamento de erros** - Retorna valores vazios se não encontrar dados
5. **✅ Normalização automática** - Remove sufixos do WhatsApp automaticamente

---

## 🔍 Como Verificar

### Passo 1: Testar o Webhook

1. Envie uma mensagem para o número conectado
2. Verifique se o webhook recebe os dados
3. Veja a estrutura dos dados no OUTPUT do webhook

### Passo 2: Verificar Node "Organiza Dados"

1. Execute o workflow
2. Veja o OUTPUT do node "Organiza Dados"
3. Verifique se os campos estão preenchidos corretamente:
   - `whatsapp`: Número sem sufixos
   - `mensagem`: Texto da mensagem
   - `tipo`: Tipo da mensagem
   - `messageId`: ID da mensagem
   - `firstname`: Nome do usuário

### Passo 3: Ajustar se Necessário

Se os dados não estiverem sendo extraídos corretamente:

1. **Veja a estrutura real** dos dados no OUTPUT do webhook
2. **Ajuste as expressões** no node "Organiza Dados" conforme necessário
3. **Teste novamente**

---

## 📝 Exemplo de Estrutura Real do Uazapi

Se você puder compartilhar um exemplo real da estrutura de dados que o uazapi envia, posso ajustar as expressões para serem mais específicas e eficientes.

**Para obter a estrutura:**
1. Execute o workflow
2. Abra o node Webhook
3. Veja o OUTPUT
4. Copie a estrutura JSON completa

---

## ⚠️ Importante

- ⚠️ **Teste após cada mudança** - Verifique se os dados estão sendo extraídos corretamente
- ⚠️ **Ajuste conforme necessário** - Se a estrutura do uazapi for diferente, ajuste as expressões
- ⚠️ **Mantenha compatibilidade** - As expressões tentam múltiplos formatos para manter compatibilidade

---

**Data das Correções:** 2025-01-11  
**Status:** ✅ Correções aplicadas  
**Próximo Passo:** Testar com dados reais do uazapi


# 📋 Passos para Corrigir Workflow

## 🎯 Problema

**O workflow funcionava com o número antigo, mas após mudança há problemas:**
1. Node "Organiza Dados" tenta acessar `$('Auth').item.json.id` causando erro
2. Número do WhatsApp não está sendo normalizado (remove `@s.whatsapp.net`)
3. Node "Verifica Usuario" verifica campo que não existe

## ✅ Solução Passo a Passo

### Passo 1: Corrigir Node "Organiza Dados"

1. **Abrir node "Organiza Dados"** no n8n
2. **Remover campo `userId`** completamente
3. **Ajustar campo `whatsapp`** para:
   ```
   {{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
   ```
4. **Ajustar campo `mensagem`** para:
   ```
   {{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
   ```
5. **Ajustar campo `tipo`** para:
   ```
   {{ $('InicioChat').item.json.body.data.messageType || 'text' }}
   ```
6. **Ajustar campo `messageId`** para:
   ```
   {{ $('InicioChat').item.json.body.data.key.id || '' }}
   ```
7. **Ajustar campo `firstname`** para:
   ```
   {{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
   ```
8. **Salvar** o node

### Passo 2: Corrigir Node "Auth"

1. **Abrir node "Auth"** no n8n
2. **Ajustar filtro `whatsapp`** para:
   ```
   {{ ($json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
   ```
3. **Manter filtro `ativo`** como `TRUE`
4. **Salvar** o node

### Passo 3: Corrigir Node "Verifica Usuario"

1. **Abrir node "Verifica Usuario"** no n8n
2. **Ajustar condição** para:
   ```
   {{ $('Auth').item.json.id }}
   ```
3. **Operador:** `notEmpty` (não está vazio)
4. **Salvar** o node

### Passo 4: Verificar Números no Supabase

1. **Abrir Supabase SQL Editor**
2. **Executar consulta:**
   ```sql
   SELECT id, nome, whatsapp, phone, ativo
   FROM profiles
   WHERE whatsapp IS NOT NULL;
   ```
3. **Verificar** se os números estão normalizados (sem `@s.whatsapp.net`)
4. **Se necessário, normalizar:**
   ```sql
   UPDATE profiles
   SET whatsapp = REPLACE(REPLACE(whatsapp, '@s.whatsapp.net', ''), '@g.us', '')
   WHERE whatsapp LIKE '%@%';
   ```

### Passo 5: Testar Workflow

1. **Enviar mensagem** no WhatsApp para o bot
2. **Verificar** se o webhook chega no n8n
3. **Verificar** se o node "Auth" encontra o usuário
4. **Verificar** se o node "Organiza Dados" extrai os dados corretamente
5. **Verificar** se o workflow continua corretamente

## 📋 Expressões Completas

### Node "Organiza Dados"

**Campo: `whatsapp`**
```
{{ ($('InicioChat').item.json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Campo: `mensagem`**
```
{{ $('InicioChat').item.json.body.data.message.conversation || $('InicioChat').item.json.body.data.message.extendedTextMessage.text || '' }}
```

**Campo: `tipo`**
```
{{ $('InicioChat').item.json.body.data.messageType || 'text' }}
```

**Campo: `messageId`**
```
{{ $('InicioChat').item.json.body.data.key.id || '' }}
```

**Campo: `firstname`**
```
{{ $('InicioChat').item.json.body.data.pushName || 'Usuário' }}
```

**Campo: `userId`**
```
REMOVER ESTE CAMPO
```

### Node "Auth"

**Filtro: `whatsapp`**
```
{{ ($json.body.data.key.remoteJid || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '') }}
```

**Filtro: `ativo`**
```
TRUE
```

### Node "Verifica Usuario"

**Condição:**
```
{{ $('Auth').item.json.id }}
```

**Operador:**
```
notEmpty
```

## 🔍 Verificações

### 1. Verificar Estrutura do Webhook

**Evento `messages.upsert` (mensagem real):**
- `body.event` = `"messages.upsert"`
- `body.data.key.remoteJid` = `"553172242378@s.whatsapp.net"` (número do cliente)
- `body.data.message.conversation` = `"Gastei 10 reais na sorveteria"`

**Evento `presence.update` (digitando):**
- `body.event` = `"presence.update"`
- `body.data.key.remoteJid` = não existe
- `body.sender` = `"553197599924@s.whatsapp.net"` (número do bot - NÃO usar)

### 2. Verificar Número do Bot

**Número do Bot:** `553197599924`
- Este é o número que **recebe** mensagens
- **NÃO usar** para identificar clientes

**Número do Cliente:** `body.data.key.remoteJid` (em `messages.upsert`)
- Este é o número que **envia** mensagens
- **USAR** para identificar clientes

### 3. Verificar Tabela `profiles` no Supabase

**Estrutura esperada:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  nome TEXT,
  whatsapp VARCHAR(20),  -- Número normalizado (sem @s.whatsapp.net)
  phone VARCHAR(20),
  ativo BOOLEAN DEFAULT TRUE
);
```

**Consulta para verificar:**
```sql
SELECT id, nome, whatsapp, phone, ativo
FROM profiles
WHERE whatsapp IS NOT NULL;
```

**Normalizar números se necessário:**
```sql
UPDATE profiles
SET whatsapp = REPLACE(REPLACE(whatsapp, '@s.whatsapp.net', ''), '@g.us', '')
WHERE whatsapp LIKE '%@%';
```

## ✅ Checklist

- [ ] Node "Organiza Dados": Campo `userId` removido
- [ ] Node "Organiza Dados": Campo `whatsapp` normaliza número
- [ ] Node "Organiza Dados": Expressões ajustadas com fallbacks
- [ ] Node "Auth": Filtro `whatsapp` normaliza número
- [ ] Node "Verifica Usuario": Verifica `$('Auth').item.json.id`
- [ ] Números no Supabase estão normalizados
- [ ] Workflow testado com mensagem real

## 🚨 Problemas Comuns

### Problema 1: "No execution data available"

**Causa:** Campo `userId` no "Organiza Dados" tenta acessar "Auth" antes de executar

**Solução:** Remover campo `userId` do "Organiza Dados"

### Problema 2: Usuário não encontrado no "Auth"

**Causa:** Número no Supabase está com `@s.whatsapp.net` ou formato diferente

**Solução:** Normalizar números no Supabase e ajustar filtro no "Auth"

### Problema 3: Campo `whatsapp` vazio

**Causa:** Evento `presence.update` não tem `remoteJid`

**Solução:** Workflow deve processar apenas `messages.upsert` (adicionar IF se necessário)

---

**Última atualização:** 2025-01-11

**Conclusão:** O workflow precisa ser ajustado para normalizar números e remover campo `userId` do "Organiza Dados".





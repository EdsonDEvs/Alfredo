# 🔍 Identificar Erro: Fluxo Parou Após Trocar Número

## 🎯 Problema

**Antes**: Fluxo funcionava normalmente  
**Depois**: Após trocar número na Evolution API, fluxo parou de funcionar  
**Sintoma**: Campos retornam `undefined` no node "Organiza Dados"

## 🔍 Diagnóstico: O Que Mudou?

### Possível Causa 1: Estrutura dos Dados Mudou

**Verificar:**
1. A Evolution API pode estar enviando dados em formato diferente
2. O webhook pode estar recebendo estrutura diferente
3. As expressões podem estar apontando para caminho errado

### Possível Causa 2: Eventos Diferentes Estão Chegando

**Antes:** Apenas `messages.upsert` chegava  
**Agora:** `presence.update` também está chegando (e não tem mensagem)

### Possível Causa 3: Caminho JSON Mudou

**Verificar se o caminho mudou:**
- Antes: `body.data.key.remoteJid` ✅
- Agora: Pode ser diferente?

## ✅ Solução: Verificar Estrutura Real dos Dados

### Passo 1: Ver Dados que Estão Chegando Agora

**No n8n:**
1. **Clique no node "InicioChat"**
2. **Veja o OUTPUT** (lado direito)
3. **Clique na aba "JSON"** (não "Schema")
4. **Expanda todos os campos**
5. **Anote a estrutura completa**

### Passo 2: Comparar com Estrutura Antiga

**Estrutura que você mostrou (antes):**
```json
{
  "body": {
    "event": "messages.upsert",
    "data": {
      "key": {
        "remoteJid": "553172242378@s.whatsapp.net"
      },
      "message": {
        "conversation": "texto"
      }
    }
  }
}
```

**Estrutura atual (presence.update):**
```json
{
  "event": "presence.update",
  "sender": "553197599924@s.whatsapp.net",
  "data": {
    "id": "...",
    "presences": {...}
  }
}
```

### Passo 3: Identificar Diferenças

**Diferenças encontradas:**
1. **Evento `presence.update`**: Não tem `body.data.key.remoteJid`, tem `sender` no nível raiz
2. **Evento `messages.upsert`**: Tem `body.data.key.remoteJid` (estrutura antiga)
3. **Expressões atuais**: Procuram `body.data.key.remoteJid` (só funciona para `messages.upsert`)

## 🔧 Correção: Ajustar Expressões para Funcionar com Ambos

### Expressões Corrigidas para "Organiza Dados"

**Ajuste as expressões para funcionar com ambos os formatos:**

```
whatsapp: {{ $('InicioChat').item.json.body?.data?.key?.remoteJid || $('InicioChat').item.json.sender || '' }}
mensagem: {{ $('InicioChat').item.json.body?.data?.message?.conversation || $('InicioChat').item.json.body?.data?.message?.extendedTextMessage?.text || '' }}
tipo: {{ $('InicioChat').item.json.body?.data?.messageType || 'text' }}
messageId: {{ $('InicioChat').item.json.body?.data?.key?.id || $('InicioChat').item.json.data?.id || '' }}
firstname: {{ $('InicioChat').item.json.body?.data?.pushName || 'Usuário' }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

### Explicação das Mudanças

**Campo `whatsapp`:**
- Tenta: `body.data.key.remoteJid` (messages.upsert)
- Ou: `sender` (presence.update)
- Fallback: `''` (vazio)

**Campo `mensagem`:**
- Tenta: `body.data.message.conversation` (messages.upsert)
- Fallback: `''` (vazio - presence.update não tem mensagem)

**Uso do operador `?.` (optional chaining):**
- Evita erro se o campo não existir
- Retorna `undefined` em vez de erro

## 🧪 Testar

### Teste 1: Verificar Se Expressões Funcionam

1. **No node "Organiza Dados"**, ajuste as expressões acima
2. **Execute o node** manualmente
3. **Verifique se os campos** não estão mais `undefined`
4. **Para `messages.upsert`**: Deve preencher todos os campos
5. **Para `presence.update`**: `mensagem` ficará vazia (normal)

### Teste 2: Verificar Com Mensagem Real

1. **Envie uma mensagem REAL** no WhatsApp (não apenas digite)
2. **Aguarde o evento `messages.upsert`**
3. **Verifique se os dados são extraídos corretamente**
4. **Teste o workflow completo**

## 🐛 Se Ainda Não Funcionar

### Problema: Expressões Ainda Retornam `undefined`

**Solução:**
1. **Verifique a estrutura real** no node "InicioChat" (aba JSON)
2. **Anote o caminho completo** até os dados
3. **Ajuste as expressões** com o caminho correto

### Problema: Apenas `presence.update` Chega

**Solução:**
1. **Verifique se o webhook está configurado** para receber `MESSAGES_UPSERT`
2. **Verifique se os eventos estão habilitados** na Evolution API
3. **Envie uma mensagem REAL** (não apenas digite)

### Problema: Estrutura É Diferente

**Solução:**
1. **Veja a estrutura completa** no node "InicioChat"
2. **Compare com a estrutura antiga**
3. **Ajuste as expressões** para a estrutura atual

## 📋 Checklist de Diagnóstico

- [ ] Vi a estrutura real no node "InicioChat" (aba JSON)
- [ ] Comparei com a estrutura antiga
- [ ] Identifiquei diferenças
- [ ] Ajustei as expressões no "Organiza Dados"
- [ ] Testei com mensagem real (`messages.upsert`)
- [ ] Testei o workflow completo

## 🚀 Próximo Passo

**Depois de identificar o problema:**
1. **Ajuste as expressões** no "Organiza Dados"
2. **Teste com mensagem real** no WhatsApp
3. **Verifique se o workflow funciona** completamente

---

**Última atualização:** 2025-01-11

**Conclusão:** O problema provavelmente é que as expressões estão procurando apenas `body.data.key.remoteJid`, mas agora também chegam eventos `presence.update` com estrutura diferente (`sender` no nível raiz). Use expressões com `?.` (optional chaining) e fallbacks para funcionar com ambos.


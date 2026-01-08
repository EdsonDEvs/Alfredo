# 👀 Como Ver os Dados do Node "InicioChat" no n8n

## 🎯 Objetivo

Ver a estrutura real dos dados que chegam no node "InicioChat" para corrigir as expressões no "Organiza Dados".

## ✅ Passo a Passo

### Passo 1: Abrir o Node "InicioChat"

**No n8n:**
1. **Abra o workflow**
2. **Clique no node "InicioChat"** (node vermelho com ícone de raio)
3. **O painel do node** abrirá no centro

### Passo 2: Ver o OUTPUT do Node

**No painel do node "InicioChat":**
1. **Veja o lado direito** do painel (seção "OUTPUT")
2. **Clique na aba "JSON"** (não "Schema" ou "Table")
3. **Expanda todos os campos** clicando nas setas `▶`
4. **Veja a estrutura completa** dos dados

### Passo 3: Procurar os Dados de Mensagem

**Procure por estes campos:**
- `remoteJid` ou `sender` (número do WhatsApp)
- `message` ou `messageText` (texto da mensagem)
- `pushName` ou `notifyName` (nome do usuário)
- `id` ou `messageId` (ID da mensagem)

### Passo 4: Anotar o Caminho Completo

**Anote o caminho completo até os dados. Exemplos:**

**Se encontrar:**
```json
{
  "json": {
    "body": {
      "data": {
        "key": {
          "remoteJid": "5531999999999@s.whatsapp.net"
        }
      }
    }
  }
}
```

**O caminho é:** `json.body.data.key.remoteJid`

**Se encontrar:**
```json
{
  "json": {
    "body": {
      "data": {
        "sender": "5531999999999@s.whatsapp.net"
      }
    }
  }
}
```

**O caminho é:** `json.body.data.sender`

### Passo 5: Usar o Caminho nas Expressões

**No node "Organiza Dados", use o caminho que encontrou:**

**Exemplo 1: Se o caminho for `json.body.data.key.remoteJid`**
```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid.replace('@s.whatsapp.net', '') }}
```

**Exemplo 2: Se o caminho for `json.body.data.sender`**
```
whatsapp: {{ $('InicioChat').item.json.body.data.sender.replace('@s.whatsapp.net', '') }}
```

**Exemplo 3: Se o caminho for `json.key.remoteJid`**
```
whatsapp: {{ $('InicioChat').item.json.key.remoteJid.replace('@s.whatsapp.net', '') }}
```

## 🔍 Se Não Ver Dados no OUTPUT

### Problema: OUTPUT está vazio

**Solução:**
1. **Envie uma mensagem REAL** no WhatsApp
2. **Aguarde o workflow executar**
3. **Veja a execução** em "Executions"
4. **Abra a execução** e clique no node "InicioChat"
5. **Veja o OUTPUT** dessa execução

### Problema: Não há execuções

**Solução:**
1. **Verifique se o workflow está ATIVO**
2. **Verifique se o webhook está configurado** na Evolution API
3. **Envie uma mensagem** no WhatsApp
4. **Aguarde alguns segundos**
5. **Verifique se aparece uma execução** no n8n

## 🧪 Teste Rápido: Ver Toda a Estrutura

### Método 1: Adicionar Campo Debug no "Organiza Dados"

**No node "Organiza Dados":**
1. **Adicione um campo temporário:**
   - **Nome:** `debug`
   - **Tipo:** String
   - **Expressão:** `{{ JSON.stringify($('InicioChat').item.json) }}`
2. **Execute o node**
3. **Veja o valor de `debug`** no OUTPUT
4. **Copie e cole em um editor JSON** para ver a estrutura formatada

### Método 2: Usar Node "Set" para Debug

1. **Adicione um node "Set"** após "InicioChat"
2. **Adicione um campo:**
   - **Nome:** `debug`
   - **Valor:** `{{ $json }}`
3. **Execute o node**
4. **Veja o OUTPUT** - mostrará toda a estrutura

## 📋 Checklist

- [ ] Abri o node "InicioChat"
- [ ] Vi o OUTPUT (aba JSON)
- [ ] Expandi todos os campos
- [ ] Encontrei os dados de mensagem
- [ ] Anotei o caminho completo
- [ ] Ajustei as expressões no "Organiza Dados"
- [ ] Testei e funcionou

## 🚀 Próximo Passo

**Depois de ver a estrutura:**
1. **Use o caminho correto** nas expressões do "Organiza Dados"
2. **Teste o workflow** novamente
3. **Verifique se os campos** não estão mais `undefined`

---

**Última atualização:** 2025-01-11

**Dica:** Se não conseguir ver a estrutura, use o node "Function" com o código que funciona com qualquer estrutura (arquivo `CODIGO-NODE-FUNCTION-COMPLETO.js`).


# 🔍 Descobrir Estrutura Real dos Dados no n8n

## 🎯 Problema

Todas as expressões no node "Organiza Dados" estão retornando `undefined`:
- `{{ $('InicioChat').item.json.body.data.key.remoteJid }}` = `undefined`
- `{{ $('InicioChat').item.json.body.data.message.conversation }}` = `undefined`
- Todos os outros campos também = `undefined`

## ✅ Solução: Descobrir Estrutura Real

### Passo 1: Ver Dados do Node "InicioChat"

**No n8n:**
1. **Clique no node "InicioChat"** (node vermelho)
2. **Veja o painel OUTPUT** (lado direito)
3. **Clique na aba "JSON"** (não "Schema" ou "Table")
4. **Veja a estrutura completa** dos dados
5. **Expanda todos os campos** para ver onde estão os dados reais

### Passo 2: Verificar Caminho Correto

**Os dados podem estar em diferentes lugares. Verifique:**

#### Opção 1: Dados diretos no `json`
```json
{
  "json": {
    "key": {
      "remoteJid": "5531999999999@s.whatsapp.net"
    },
    "message": {
      "conversation": "mensagem"
    }
  }
}
```
**Expressão:** `{{ $('InicioChat').item.json.key.remoteJid }}`

#### Opção 2: Dados em `json.body`
```json
{
  "json": {
    "body": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net"
      }
    }
  }
}
```
**Expressão:** `{{ $('InicioChat').item.json.body.key.remoteJid }}`

#### Opção 3: Dados em `json.body.data`
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
**Expressão:** `{{ $('InicioChat').item.json.body.data.key.remoteJid }}`

#### Opção 4: Dados em `json.body.data.sender` (para eventos de presença)
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
**Expressão:** `{{ $('InicioChat').item.json.body.data.sender }}`

### Passo 3: Testar Expressões no Node "Organiza Dados"

**Teste estas expressões uma de cada vez:**

#### Teste 1: Dados diretos
```
whatsapp: {{ $('InicioChat').item.json.key.remoteJid }}
```

#### Teste 2: Dados em body
```
whatsapp: {{ $('InicioChat').item.json.body.key.remoteJid }}
```

#### Teste 3: Dados em body.data
```
whatsapp: {{ $('InicioChat').item.json.body.data.key.remoteJid }}
```

#### Teste 4: Dados em body.data.sender
```
whatsapp: {{ $('InicioChat').item.json.body.data.sender }}
```

#### Teste 5: Dados em data
```
whatsapp: {{ $('InicioChat').item.json.data.key.remoteJid }}
```

**Quando uma expressão funcionar (não retornar `undefined`), use esse caminho para os outros campos!**

## 🔧 Solução Rápida: Adicionar Node Function

**Se não conseguir descobrir a estrutura, adicione um node "Function" que funciona com qualquer estrutura:**

### Como Fazer:

1. **Adicione um node "Function"** entre "InicioChat" e "Organiza Dados"
2. **Nomeie como "Normalizar Dados"**
3. **Cole o código** do arquivo `CODIGO-NODE-FUNCTION-COMPLETO.js`
4. **Conecte:** "InicioChat" → "Normalizar Dados" → "Organiza Dados"
5. **Ajuste "Organiza Dados"** para usar expressões simples:

```
whatsapp: {{ $json.whatsapp }}
mensagem: {{ $json.mensagem }}
tipo: {{ $json.tipo }}
messageId: {{ $json.messageId }}
firstname: {{ $json.firstname }}
userId: {{ $('Verifica Usuario').item.json.user_id || null }}
```

## 🧪 Teste Rápido

### Método 1: Ver JSON Completo

**No node "Organiza Dados", adicione um campo temporário:**
```
debug: {{ $('InicioChat').item.json }}
```

**Execute o node e veja o valor de `debug`** - isso mostrará toda a estrutura!

### Método 2: Usar Node "Set" para Debug

1. **Adicione um node "Set"** após "InicioChat"
2. **Adicione um campo:**
   - **Nome:** `debug`
   - **Valor:** `{{ $json }}`
3. **Execute o node**
4. **Veja o OUTPUT** - isso mostrará toda a estrutura dos dados

## 📋 Checklist

- [ ] Vi a estrutura completa no node "InicioChat" (aba JSON)
- [ ] Testei diferentes expressões no "Organiza Dados"
- [ ] Encontrei o caminho correto (não retorna `undefined`)
- [ ] Ajustei todas as expressões no "Organiza Dados"
- [ ] Ou adicionei node "Function" para normalizar
- [ ] Testei e os campos não estão mais `null`

## 🚀 Próximo Passo

**Depois de descobrir a estrutura:**
1. **Ajuste as expressões** no "Organiza Dados" com o caminho correto
2. **Teste o workflow** novamente
3. **Verifique se os campos** não estão mais `null`
4. **Teste o workflow completo**

---

**Última atualização:** 2025-01-11

**Dica:** A forma mais rápida é adicionar o node "Function" com o código que funciona com qualquer estrutura. Mas se preferir, descubra a estrutura real e ajuste as expressões diretamente.


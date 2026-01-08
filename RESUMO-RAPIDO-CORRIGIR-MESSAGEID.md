# ⚡ Resumo Rápido: Corrigir Erro "Message not found"

## 🎯 Problema

O node "Caso não recebemos o Base64 consultamos no EVOAPI" está retornando:
```
400 - {"status":400,"error":"Bad Request","response":{"message":["Message not found"]}}
```

## ✅ Solução Rápida

### No node "Caso não recebemos o Base64 consultamos no EVOAPI":

**Campo: ID Da Mensagem**

Substitua a expressão atual por:

```javascript
{{ $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

**OU se você tem um node "Organiza Dados" conectado:**

```javascript
{{ $('Organiza Dados').item.json.messageId || $json.body?.message?.messageId || $json.body?.message?.messageid || $json.body?.message?.id || $json.body?.id || $json.body?.key?.id || $json.body?.data?.key?.id || $json.id || $json.messageId || '' }}
```

---

## 📋 Passo a Passo

1. **Abra o node** "Caso não recebemos o Base64 consultamos no EVOAPI"
2. **Vá na aba "Parameters"**
3. **Encontre o campo** "ID Da Mensagem"
4. **Substitua a expressão** pela expressão acima
5. **Salve** o node
6. **Teste** enviando uma mensagem de áudio novamente

---

## 🔍 Se Ainda Não Funcionar

1. **Verifique o OUTPUT do webhook** para ver a estrutura real dos dados
2. **Procure pelo messageId** na estrutura JSON
3. **Ajuste a expressão** conforme o caminho real encontrado

---

**Documentação Completa:** Veja `SOLUCAO-ERRO-MESSAGE-NOT-FOUND.md` para mais detalhes.


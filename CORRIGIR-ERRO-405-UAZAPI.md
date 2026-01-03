# 🔧 Corrigir Erro 405 - Method Not Allowed (Uazapi)

## 🚨 Erro Atual

**Erro 405 - Method Not Allowed:**
```
405 - {"code":405,"message":"Method Not Allowed.","data":{}}
URL: https://aldredoiacombr.uazapi.com/enviar-mensagem
```

**Causa:** O endpoint `/enviar-mensagem` não existe ou não aceita POST.

---

## ✅ Soluções

### Opção 1: Endpoint Correto da Uazapi

Segundo a documentação da uazapi, o endpoint correto geralmente é:

**Tente:**
```
POST https://aldredoiacombr.uazapi.com/api/send-message
```

**OU:**
```
POST https://aldredoiacombr.uazapi.com/send-message
```

**OU (com instância):**
```
POST https://aldredoiacombr.uazapi.com/SUA_INSTANCIA/send-message
```

### Opção 2: Verificar Documentação

A uazapi tem documentação no:
- **Postman:** https://www.postman.com/augustofcs/documentation/...
- **GitHub:** https://github.com/uazapi/uazapi
- **n8n Tools:** https://n8ntools.io/nodes/uazapi

**Acesse e veja o endpoint exato para enviar mensagens.**

### Opção 3: Usar Node n8n da Uazapi

Se disponível, use o node oficial da uazapi no n8n:
- Procure por "uazapi" nos nodes disponíveis
- Pode estar em "Community Nodes" ou "n8n Tools"

---

## 🔧 Como Corrigir no n8n

### Passo 1: Testar Endpoints Alternativos

**No campo "URL", tente cada uma:**

1. `https://aldredoiacombr.uazapi.com/api/send-message`
2. `https://aldredoiacombr.uazapi.com/send-message`
3. `https://aldredoiacombr.uazapi.com/message/send`
4. `https://aldredoiacombr.uazapi.com/api/message/send`

### Passo 2: Verificar se Precisa de Instância

**Se sua API usa instâncias, tente:**
```
https://aldredoiacombr.uazapi.com/SUA_INSTANCIA/send-message
```

**OU:**
```
https://aldredoiacombr.uazapi.com/api/SUA_INSTANCIA/send-message
```

### Passo 3: Verificar Estrutura do Body

**Mantenha o body atual:**
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Sua mensagem aqui"
}
```

**OU tente formato alternativo:**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Sua mensagem aqui"
}
```

---

## 📋 Configuração Recomendada

### URL (teste estas opções):
```
https://aldredoiacombr.uazapi.com/api/send-message
```

### Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer Vb33rGlYjWr1HSpeidktlXKkc5hcuWl2V7VbXo0uWyKgcR2ZI3"
}
```

### Body:
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

---

## 🔍 Recursos para Encontrar o Endpoint Correto

### 1. Documentação Postman
- Acesse: https://www.postman.com/augustofcs/documentation/...
- Veja exemplos de requisições
- Copie o endpoint exato

### 2. GitHub Uazapi
- Acesse: https://github.com/uazapi/uazapi
- Veja a documentação da API
- Encontre o endpoint de envio

### 3. n8n Tools
- Acesse: https://n8ntools.io/nodes/uazapi
- Veja exemplos de uso
- Use o node oficial se disponível

### 4. Painel Uazapi
- Acesse o painel de controle da uazapi
- Veja a documentação da API
- Encontre o endpoint correto

---

## ✅ Checklist

- [ ] Testei `/api/send-message`
- [ ] Testei `/send-message`
- [ ] Verifiquei documentação Postman
- [ ] Verifiquei GitHub uazapi
- [ ] Testei com instância na URL
- [ ] Endpoint correto encontrado

---

## 🚀 Próximos Passos

1. **Acessar documentação** da uazapi (Postman ou GitHub)
2. **Encontrar endpoint exato** para enviar mensagens
3. **Testar no Postman** primeiro
4. **Aplicar no n8n** quando funcionar

---

**Status:** ⚠️ Erro 405 - Endpoint incorreto  
**Solução:** Verificar documentação uazapi e testar endpoints alternativos

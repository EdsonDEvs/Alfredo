# ✅ Configuração Final - Uazapi

## 🎯 Estrutura Correta da Uazapi

Baseado na documentação visual, a estrutura correta é:

### URL:
```
https://free.uazapi.com/send/text
```
**Nota:** O subdomain `free` pode variar conforme sua conta.

### Headers:
```json
{
  "Content-Type": "application/json",
  "token": "SEU_TOKEN_UAZAPI_AQUI"
}
```
**Importante:** O token vai no header `token`, não `Authorization Bearer`.

### Body:
```json
{
  "number": "5511999999999",
  "text": "Sua mensagem aqui"
}
```
**Importante:** Usa `number` e `text`, não `phone` e `message`.

---

## ✅ Correções Aplicadas no Workflow

### Nodes Corrigidos:

1. **"Responde o Cliente"** ✅
2. **"RespondeCliente"** ✅
3. **"RespondeClienteConsulta"** ✅
4. **"Enviar texto"** ✅

### Configuração Aplicada:

**URL:**
```
https://free.uazapi.com/send/text
```

**Headers:**
```json
{
  "Content-Type": "application/json",
  "token": "SEU_TOKEN_UAZAPI_AQUI"
}
```

**Body:**
```json
{
  "number": "{{ $('Organiza Dados').item.json.whatsapp }}",
  "text": "{{ $json.output }}"
}
```

---

## ⚙️ Configuração Necessária

### 1. Substituir Token

**Em todos os nodes de envio de mensagem, substitua:**
```
SEU_TOKEN_UAZAPI_AQUI
```

**Por seu token real da uazapi.**

### 2. Verificar Subdomain

**Se seu subdomain não for "free", ajuste a URL:**
```
https://SEU_SUBDOMAIN.uazapi.com/send/text
```

**Exemplos:**
- `https://free.uazapi.com/send/text`
- `https://pro.uazapi.com/send/text`
- `https://seu-subdomain.uazapi.com/send/text`

---

## 📋 Nodes que Precisam de Ajuste Manual

### 1. "MensagemErro"
- Verifique se está usando a estrutura correta
- Ajuste token e subdomain se necessário

### 2. "EnviaWhatsapp"
- Verifique se está usando a estrutura correta
- Ajuste token e subdomain se necessário

### 3. "Enviar texto1"
- Verifique se está usando a estrutura correta
- Ajuste token e subdomain se necessário

---

## 🔧 Como Configurar no n8n

### Passo 1: Abrir Node

1. Abra o node de envio de mensagem
2. Vá em "Parameters"

### Passo 2: Configurar URL

**No campo "URL":**
```
https://free.uazapi.com/send/text
```

**OU (se seu subdomain for diferente):**
```
https://SEU_SUBDOMAIN.uazapi.com/send/text
```

### Passo 3: Configurar Headers

**No campo "JSON (Headers)":**
```json
{
  "Content-Type": "application/json",
  "token": "SEU_TOKEN_REAL_AQUI"
}
```

### Passo 4: Configurar Body

**No campo "JSON (Body)":**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Sua mensagem aqui"
}
```

**OU (usando dados do workflow):**
```json
{
  "number": "{{ $('Organiza Dados').item.json.whatsapp }}",
  "text": "{{ $json.output }}"
}
```

---

## ✅ Checklist

- [ ] Token configurado em todos os nodes
- [ ] Subdomain correto na URL (free ou outro)
- [ ] Headers usando `token` (não Authorization Bearer)
- [ ] Body usando `number` e `text` (não phone e message)
- [ ] Testado e funcionando

---

## 🧪 Como Testar

### Passo 1: Configurar um Node

1. Configure URL, token e body conforme acima
2. Salve o node

### Passo 2: Executar Teste

1. Execute o workflow
2. Envie uma mensagem de teste
3. Verifique se a mensagem é enviada

### Passo 3: Verificar Resultado

1. Veja o OUTPUT do node
2. Se funcionar, deve retornar sucesso
3. Se ainda der erro, verifique:
   - Token está correto?
   - Subdomain está correto?
   - Body está no formato certo?

---

## 📝 Exemplo Completo

### Node HTTP Request:

**Method:** POST  
**URL:** `https://free.uazapi.com/send/text`  
**Headers (JSON):**
```json
{
  "Content-Type": "application/json",
  "token": "Vb33rGlYjWr1HSpeidktlXKkc5hcuWl2V7VbXo0uWyKgcR2ZI3"
}
```

**Body (JSON):**
```json
{
  "number": "{{ $json.whatsapp }}",
  "text": "Sua mensagem aqui"
}
```

---

**Status:** ✅ Estrutura correta aplicada  
**Próximo Passo:** Configurar token e subdomain em todos os nodes




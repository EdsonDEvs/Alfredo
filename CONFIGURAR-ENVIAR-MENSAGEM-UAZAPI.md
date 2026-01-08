# ✅ Configurar Node "Enviar mensagem" - Uazapi

## 🎯 Configuração Atual

Vejo que você já configurou:
- ✅ URL: `https://aldredoiacombr.uazapi.com/enviar-mensagem`
- ✅ Headers: Content-Type e Authorization
- ✅ Body: phone e message

## ⚠️ Ajustes Necessários

### 1. **Token de Autorização**

**No header "Authorization", substitua:**
```
Bearer SEU_TOKEN_UAZAPI
```

**Por seu token real da uazapi:**
```
Bearer seu-token-real-aqui
```

### 2. **Body com Dados Dinâmicos**

**Atual (valores fixos):**
```json
{
  "phone": "553172242378",
  "message": "Sua mensagem aqui"
}
```

**Correto (usando dados do workflow):**
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

---

## 🔧 Como Configurar no n8n

### Passo 1: Configurar Token

1. No campo **"JSON (Headers)"**, encontre:
   ```json
   "Authorization": "Bearer SEU_TOKEN_UAZAPI"
   ```
2. Substitua `SEU_TOKEN_UAZAPI` pelo seu token real
3. Exemplo:
   ```json
   "Authorization": "Bearer abc123xyz456..."
   ```

### Passo 2: Configurar Body com Expressões

1. No campo **"JSON (Body)"**, altere de:
   ```json
   {
     "phone": "553172242378",
     "message": "Sua mensagem aqui"
   }
   ```

2. Para:
   ```json
   {
     "phone": "{{ $json.whatsapp }}",
     "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
   }
   ```

**Importante:**
- `{{ $json.whatsapp }}` pega o número do WhatsApp do node anterior
- A mensagem pode ser fixa ou também dinâmica

---

## 📋 Estrutura Completa

### Headers (JSON):
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer SEU_TOKEN_REAL_AQUI"
}
```

### Body (JSON):
```json
{
  "phone": "{{ $json.whatsapp }}",
  "message": "Notamos que você ainda não possui cadastro. Acesse o link para adquirir assinar um plano:\nhttps://alfredoo.online"
}
```

---

## ✅ Verificação

Após configurar:

1. **Token configurado?** ✅
   - Não deve ter "SEU_TOKEN_UAZAPI"
   - Deve ter seu token real

2. **Body usando expressões?** ✅
   - `phone` deve usar `{{ $json.whatsapp }}`
   - `message` pode ser fixa ou dinâmica

3. **Testar:**
   - Execute o node
   - Verifique se a mensagem é enviada
   - Veja se não há erros

---

## 🔍 Se Ainda Der Erro

### Erro: "401 Unauthorized"
- **Causa:** Token incorreto
- **Solução:** Verifique o token no header Authorization

### Erro: "400 Bad Request"
- **Causa:** Formato do body incorreto
- **Solução:** Verifique se o body está em JSON válido

### Erro: "Connection Closed"
- **Causa:** URL incorreta ou servidor não acessível
- **Solução:** Verifique a URL do servidor

---

## 📝 Exemplo Completo

### Headers:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

**Status:** ⚠️ Precisa configurar token e ajustar body  
**Próximo Passo:** Substituir token e usar expressões no body




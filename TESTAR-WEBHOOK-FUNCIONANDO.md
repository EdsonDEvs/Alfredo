# 🧪 Testar se o Webhook Está Funcionando

## ✅ Configuração Atual do Webhook

- **Enabled**: ✅ Ligado (verde)
- **URL**: `https://n8n.alfredoo.online/webhook-test/agente-financeiro` ✅
- **Webhook by Events**: ❌ Desligado (cinza)
- **Webhook Base64**: ✅ Ligado (verde)
- **Eventos Habilitados**: `MESSAGES_UPSERT` ✅, `PRESENCE_UPDATE` ✅

## 🧪 Teste 1: Enviar Mensagem Real

### Passo a Passo:

1. **Envie uma mensagem REAL** para o número conectado no WhatsApp
2. **Não apenas digite** - envie a mensagem completa (pressione Enter)
3. **Aguarde 5-10 segundos**
4. **Verifique no n8n**:
   - Acesse: `https://n8n.alfredoo.online`
   - Vá em **"Executions"** (Execuções)
   - Procure por execuções recentes
   - Verifique se há uma nova execução

## 🔍 Teste 2: Verificar Execuções no n8n

### Como Verificar:

1. **Acesse o n8n**: `https://n8n.alfredoo.online`
2. **Clique em "Executions"** no menu lateral
3. **Procure por execuções recentes** (últimos minutos)
4. **Clique em uma execução** para ver os detalhes
5. **Verifique**:
   - Se o evento é `messages.upsert` ✅
   - Se os dados estão chegando
   - Se há erros

## 🔍 Teste 3: Ver OUTPUT do Node "InicioChat"

### Como Verificar:

1. **Abra o workflow** no n8n
2. **Clique no node "InicioChat"**
3. **Veja as execuções recentes**:
   - Clique no ícone de "execuções" no node
   - Ou veja em "Executions" e clique no node
4. **Verifique o OUTPUT**:
   - Se o evento é `messages.upsert` ✅
   - Se a estrutura dos dados está correta
   - Se os campos estão preenchidos

## 📋 Estrutura Esperada para `messages.upsert`

Quando uma mensagem real chegar, você deve ver:

```json
{
  "body": {
    "event": "messages.upsert",
    "instance": "Alfredoo",
    "data": {
      "key": {
        "remoteJid": "5531999999999@s.whatsapp.net",
        "id": "message_id",
        "fromMe": false
      },
      "message": {
        "conversation": "texto da mensagem"
      },
      "pushName": "Nome do Usuário",
      "messageTimestamp": 1705312200
    }
  }
}
```

## 🐛 Problemas Possíveis

### Problema 1: Nenhuma Execução Aparece

**Causa**: Mensagens não estão chegando no n8n

**Solução**:
1. Verifique se o número está conectado na Evolution API
2. Verifique se o status está "Connected" (verde)
3. Teste enviando uma mensagem de outro número
4. Verifique os logs da Evolution API (se disponível)

### Problema 2: Apenas `presence.update` Aparece

**Causa**: Eventos de presença estão chegando, mas mensagens não

**Solução**:
1. Verifique se `MESSAGES_UPSERT` está habilitado ✅ (já está)
2. Envie uma mensagem REAL (não apenas digite)
3. Aguarde alguns segundos após enviar
4. Verifique se o evento `messages.upsert` aparece

### Problema 3: Eventos Chegam, mas Campos Estão Null

**Causa**: Estrutura dos dados é diferente do esperado

**Solução**:
1. Veja a estrutura real dos dados no OUTPUT
2. Ajuste as expressões no node "Organiza Dados"
3. Ou adicione um node Function para normalizar os dados

## ✅ Checklist de Teste

- [ ] Enviei uma mensagem REAL (não apenas digitei)
- [ ] Aguarde 5-10 segundos após enviar
- [ ] Verifiquei as execuções no n8n
- [ ] Verifiquei se o evento é `messages.upsert`
- [ ] Verifiquei a estrutura dos dados no OUTPUT
- [ ] Verifiquei se os campos estão preenchidos

## 🚀 Próximo Passo

**Envie uma mensagem real** e verifique:

1. ✅ Se aparece uma nova execução no n8n
2. ✅ Se o evento é `messages.upsert` (não `presence.update`)
3. ✅ Qual é a estrutura real dos dados
4. ✅ Se as expressões no "Organiza Dados" estão corretas

## 📞 Se Não Funcionar

Se após enviar uma mensagem real:

1. **Nenhuma execução aparece**: Verifique se o webhook está recebendo eventos
2. **Apenas `presence.update` aparece**: Envie uma mensagem REAL (não apenas digite)
3. **Campos estão null**: Veja a estrutura real e ajuste as expressões

---

**Última atualização:** 2025-01-11

**Dica:** O evento `presence.update` aparece quando você está digitando. Para processar mensagens, você precisa enviar a mensagem completa (pressionar Enter) para receber o evento `messages.upsert`.


# 🔍 Descobrir Por Que messages.upsert Não Chega

## 🎯 Situação

**Antes**: Funcionava sem node IF (mensagens chegavam normalmente)  
**Agora**: Apenas `presence.update` chega, `messages.upsert` não chega

## 🔍 Possíveis Causas

### 1. Mensagens Não Estão Sendo Enviadas/Recebidas

**Verificar**:
- Você está enviando mensagens REAIS (pressionando Enter)?
- O número está conectado corretamente?
- Há algum bloqueio ou restrição no número novo?

### 2. Evento `messages.upsert` Não Está Sendo Disparado

**Verificar**:
- O evento `MESSAGES_UPSERT` está habilitado ✅ (já verificamos)
- A Evolution API está processando mensagens?
- Há algum erro nos logs da Evolution API?

### 3. Problema na Instância Após Trocar Número

**Verificar**:
- A instância "Alfredoo" está funcionando corretamente?
- Há algum problema com a conexão do número novo?
- A instância precisa ser reiniciada?

### 4. Webhook Não Está Recebendo Todos os Eventos

**Verificar**:
- O webhook está configurado corretamente?
- Há algum filtro ou bloqueio?
- Os eventos estão sendo enviados pela Evolution API?

## ✅ Verificações Necessárias

### Verificação 1: Testar Envio de Mensagem Real

1. **Envie uma mensagem REAL** para o número conectado
2. **Não apenas digite** - pressione Enter para enviar
3. **Aguarde 10-15 segundos**
4. **Verifique no n8n** se aparece `messages.upsert`

### Verificação 2: Verificar Logs da Evolution API

1. **No painel da Evolution API**, procure por "Logs" ou "Events"
2. **Verifique** se há eventos `messages.upsert` sendo gerados
3. **Verifique** se há erros ao processar mensagens

### Verificação 3: Verificar Status da Instância

1. **No painel da Evolution API**, verifique a instância "Alfredoo"
2. **Verifique** se está "Connected" (verde)
3. **Verifique** se há algum erro ou aviso
4. **Tente reiniciar** a instância se necessário

### Verificação 4: Testar com Outro Número

1. **Envie uma mensagem** de outro número WhatsApp
2. **Verifique** se `messages.upsert` chega no n8n
3. **Compare** com o número anterior

## 🐛 Problemas Comuns Após Trocar Número

### Problema 1: Número Novo Tem Restrições

**Sintoma**: Mensagens não são processadas

**Solução**:
1. Verifique se o número novo está ativo no WhatsApp
2. Verifique se há restrições ou bloqueios
3. Teste enviando mensagens de outros números

### Problema 2: Instância Precisa Ser Reiniciada

**Sintoma**: Após trocar número, nada funciona

**Solução**:
1. Reinicie a instância "Alfredoo" na Evolution API
2. Reconecte o número se necessário
3. Aguarde alguns minutos para estabilizar

### Problema 3: Webhook Não Está Recebendo Eventos

**Sintoma**: Eventos não chegam no n8n

**Solução**:
1. Verifique se o webhook está configurado corretamente
2. Teste o webhook manualmente
3. Verifique se há bloqueios de firewall ou rede

### Problema 4: Eventos Estão Sendo Filtrados

**Sintoma**: Apenas alguns eventos chegam

**Solução**:
1. Verifique quais eventos estão habilitados
2. Certifique-se de que `MESSAGES_UPSERT` está habilitado
3. Reconfigure o webhook se necessário

## 🧪 Teste Completo

### Passo 1: Enviar Mensagem Real

1. **Envie uma mensagem REAL** (pressione Enter)
2. **Aguarde 10-15 segundos**
3. **Verifique no n8n** se aparece nova execução

### Passo 2: Verificar Evento

1. **Abra a execução** no n8n
2. **Verifique o evento**:
   - Se for `messages.upsert` ✅ = Mensagem chegou
   - Se for `presence.update` ❌ = Apenas digitando

### Passo 3: Verificar Logs

1. **Verifique os logs** da Evolution API (se disponível)
2. **Verifique** se há eventos `messages.upsert` sendo gerados
3. **Verifique** se há erros

## 🔧 Solução: Reiniciar Instância

Se nada funcionar, tente reiniciar a instância:

### Via Painel:

1. **No painel da Evolution API**, encontre a instância "Alfredoo"
2. **Clique em "RESTART"** (botão verde)
3. **Aguarde** alguns segundos
4. **Verifique** se o status volta para "Connected"
5. **Teste** enviando uma mensagem

### Via API:

```bash
curl -X POST \
  'https://api.alfredoo.online/instance/restart/Alfredoo' \
  -H 'apikey: 9262493C1311-4C8E-B6A1-84F123F1501B'
```

## 📋 Checklist de Diagnóstico

- [ ] Enviei uma mensagem REAL (pressionei Enter)
- [ ] Aguarde 10-15 segundos após enviar
- [ ] Verifiquei execuções no n8n
- [ ] Verifiquei se o evento é `messages.upsert`
- [ ] Verifiquei logs da Evolution API (se disponível)
- [ ] Verifiquei status da instância (Connected)
- [ ] Testei com outro número
- [ ] Reiniciei a instância (se necessário)

## 🚀 Próximos Passos

1. **Envie uma mensagem REAL** e aguarde
2. **Verifique se `messages.upsert`** aparece no n8n
3. **Se não aparecer**, verifique os logs da Evolution API
4. **Se necessário**, reinicie a instância
5. **Teste novamente** após reiniciar

---

**Última atualização:** 2025-01-11

**Conclusão:** Se funcionava antes sem IF, não precisa adicionar. O problema é que `messages.upsert` não está chegando. Verifique por que as mensagens reais não estão sendo processadas pela Evolution API.


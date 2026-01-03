# ✅ Verificar Se Mensagens Reais Estão Chegando

## 🎯 Objetivo

Descobrir por que `messages.upsert` não está chegando no n8n, mesmo com o webhook configurado corretamente.

## 🔍 Verificações

### 1. Você Está Enviando Mensagens Reais?

**Importante**: 
- ❌ **Apenas digitar** = Gera apenas `presence.update`
- ✅ **Enviar mensagem** (pressionar Enter) = Gera `messages.upsert`

### 2. Verificar Execuções no n8n

1. **Acesse**: `https://n8n.alfredoo.online`
2. **Vá em "Executions"**
3. **Procure por execuções** dos últimos minutos
4. **Verifique o evento** de cada execução:
   - `presence.update` = Apenas digitando
   - `messages.upsert` = Mensagem real ✅

### 3. Verificar Logs da Evolution API

Se a Evolution API tiver logs:

1. **Acesse o painel** da Evolution API
2. **Procure por "Logs" ou "Events"**
3. **Verifique** se há eventos `messages.upsert` sendo gerados
4. **Verifique** se há erros ao processar mensagens

### 4. Testar Com Outro Número

1. **Peça para alguém** enviar uma mensagem para o número
2. **Ou use outro WhatsApp** para enviar mensagem
3. **Verifique** se `messages.upsert` chega no n8n
4. **Compare** com o comportamento anterior

## 🧪 Teste Prático

### Teste 1: Enviar Mensagem Real

1. **Abra o WhatsApp** no celular
2. **Envie uma mensagem** para o número conectado
3. **Pressione Enter** para enviar (não apenas digite)
4. **Aguarde 10-15 segundos**
5. **Verifique no n8n** se aparece nova execução

### Teste 2: Verificar Evento

1. **No n8n**, vá em "Executions"
2. **Encontre a execução** mais recente
3. **Verifique o evento**:
   - Se for `messages.upsert` ✅ = Funcionando!
   - Se for `presence.update` ❌ = Apenas digitando

### Teste 3: Ver Estrutura dos Dados

1. **Abra o workflow** no n8n
2. **Clique no node "InicioChat"**
3. **Veja a execução** mais recente
4. **Verifique o OUTPUT**:
   - Se `event` = `messages.upsert` ✅
   - Se tem `message.conversation` ✅
   - Se tem `key.remoteJid` ✅

## 🐛 Se Ainda Não Funcionar

### Problema: Apenas `presence.update` Aparece

**Possíveis Causas**:
1. Você está apenas digitando, não enviando
2. Mensagens não estão sendo processadas pela Evolution API
3. Há algum problema na instância após trocar número

**Solução**:
1. Envie uma mensagem REAL (pressione Enter)
2. Aguarde 10-15 segundos
3. Verifique se `messages.upsert` aparece
4. Se não aparecer, reinicie a instância

### Problema: Nenhuma Execução Aparece

**Possíveis Causas**:
1. Webhook não está recebendo eventos
2. n8n não está acessível
3. Há algum bloqueio de rede

**Solução**:
1. Verifique se o webhook está configurado
2. Verifique se o n8n está acessível
3. Teste o webhook manualmente

### Problema: Mensagens Chegam, mas Campos Estão Null

**Possíveis Causas**:
1. Estrutura dos dados mudou
2. Expressões estão incorretas
3. Dados não estão no caminho esperado

**Solução**:
1. Veja a estrutura real dos dados
2. Ajuste as expressões no "Organiza Dados"
3. Ou adicione um node Function para normalizar

## 🔧 Solução: Reiniciar Instância

Se nada funcionar, tente reiniciar a instância:

1. **No painel da Evolution API**, encontre "Alfredoo"
2. **Clique em "RESTART"** (botão verde)
3. **Aguarde** alguns segundos
4. **Verifique** se volta para "Connected"
5. **Teste** enviando uma mensagem

## 📋 Resumo

**Se funcionava antes sem IF**, o problema não é o workflow - é que `messages.upsert` não está chegando.

**Verifique**:
1. ✅ Você está enviando mensagens REAIS (pressionando Enter)?
2. ✅ O evento `messages.upsert` está aparecendo no n8n?
3. ✅ A instância está funcionando corretamente?
4. ✅ Há algum erro nos logs da Evolution API?

**Próximo passo**: Envie uma mensagem REAL e verifique se `messages.upsert` aparece no n8n.

---

**Última atualização:** 2025-01-11

**Nota:** O evento `presence.update` é normal quando você está digitando. Para processar mensagens, você precisa enviar a mensagem completa (pressionar Enter) para receber `messages.upsert`.


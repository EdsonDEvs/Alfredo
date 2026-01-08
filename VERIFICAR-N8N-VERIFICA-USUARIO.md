# 🔍 Verificar Node "Verifica Usuario" no n8n

## 🎯 Objetivo

Verificar se o node "Verifica Usuario" no n8n está configurado corretamente para buscar usuários no Supabase usando a função `get_user_by_phone`.

## ✅ Configuração Esperada

### Node "Verifica Usuario" (HTTP Request)

**Configuração:**
- **Method:** `POST`
- **URL:** `https://SEU_SUPABASE_URL/rest/v1/rpc/get_user_by_phone`
  - Exemplo: `https://yjtsyuibemnkjfyonfjt.supabase.co/rest/v1/rpc/get_user_by_phone`
- **Headers:**
  - `apikey`: `SUA_CHAVE_ANON_SUPABASE`
  - `Authorization`: `Bearer SUA_CHAVE_ANON_SUPABASE`
  - `Content-Type`: `application/json`
- **Body (JSON):**
  ```json
  {
    "phone_input": "{{$json.whatsapp}}"
  }
  ```

### Dados de Entrada Esperados

O node "Verifica Usuario" deve receber do node anterior (ex: "Organiza Dados") um campo `whatsapp` com o número no formato:
- `553198632243` (apenas números)
- Ou `553198632243@s.whatsapp.net` (com sufixo)

**Ambos devem funcionar** porque a função normaliza automaticamente.

## 🔍 Como Verificar

### Passo 1: Verificar URL do Supabase

1. **No n8n**, abra o node "Verifica Usuario"
2. **Verifique** se a URL está correta:
   - Deve ser: `https://SEU_PROJECT_ID.supabase.co/rest/v1/rpc/get_user_by_phone`
   - Substitua `SEU_PROJECT_ID` pelo ID do seu projeto Supabase

### Passo 2: Verificar Headers

1. **Verifique** se os headers estão configurados:
   - `apikey`: Chave anônima do Supabase
   - `Authorization`: `Bearer SUA_CHAVE_ANON`
   - `Content-Type`: `application/json`

### Passo 3: Verificar Body

1. **Verifique** se o body está usando o campo correto:
   - `{{$json.whatsapp}}` (deve vir do node anterior)
   - Ou `{{$json.phone}}` (se o campo for diferente)

### Passo 4: Verificar Dados de Entrada

1. **Execute o workflow** manualmente (ou aguarde uma mensagem)
2. **Abra o node "Verifica Usuario"**
3. **Veja o INPUT** (dados que entram no node)
4. **Verifique** se o campo `whatsapp` está presente e com o número correto

### Passo 5: Verificar Dados de Saída

1. **Veja o OUTPUT** do node "Verifica Usuario"
2. **Verifique** se retorna:
   - `user_id`: UUID do usuário
   - `full_name`: Nome do usuário
   - `subscription_status`: Status da assinatura

## 🐛 Problemas Comuns

### Problema 1: Erro 404 (Função Não Encontrada)

**Sintoma:** Erro 404 ao chamar a função

**Solução:**
1. Verifique se a URL está correta
2. Verifique se a função existe no Supabase:
   ```sql
   SELECT routine_name
   FROM information_schema.routines
   WHERE routine_schema = 'public'
     AND routine_name = 'get_user_by_phone';
   ```
3. Verifique se o endpoint RPC está correto: `/rest/v1/rpc/get_user_by_phone`

### Problema 2: Erro 401 (Não Autorizado)

**Sintoma:** Erro 401 (Unauthorized)

**Solução:**
1. Verifique se as chaves do Supabase estão corretas
2. Verifique se está usando a chave `anon` (não a `service_role`)
3. Verifique se os headers estão configurados corretamente

### Problema 3: Número Não Encontrado

**Sintoma:** Função retorna vazio (nenhum usuário encontrado)

**Solução:**
1. Verifique qual número está sendo enviado:
   - Veja o INPUT do node "Verifica Usuario"
   - Verifique o campo `whatsapp`
2. Verifique se o número está cadastrado no banco:
   ```sql
   SELECT * FROM public.profiles 
   WHERE whatsapp LIKE '%553198632243%';
   ```
3. Teste a função manualmente no Supabase:
   ```sql
   SELECT * FROM get_user_by_phone('553198632243');
   ```
4. Compare os números (podem ter diferenças de formato)

### Problema 4: Campo `whatsapp` Está Null

**Sintoma:** Campo `whatsapp` está `null` no INPUT do node "Verifica Usuario"

**Solução:**
1. **O problema está no node anterior** (ex: "Organiza Dados")
2. Verifique se o node "Organiza Dados" está extraindo o número corretamente
3. Verifique a expressão usada para extrair o número:
   - Deve ser: `{{$json.whatsapp}}` ou `{{$('InicioChat').item.json.body.data.key.remoteJid}}`
4. Veja o guia: `CORRIGIR-NODE-ORGANIZA-DADOS.md`

### Problema 5: Formato do Número Diferente

**Sintoma:** Número está sendo enviado em formato diferente

**Solução:**
1. A função normaliza automaticamente, mas você pode normalizar antes:
   ```javascript
   // No node "Organiza Dados" ou em um node Function antes de "Verifica Usuario"
   const whatsapp = $input.first().json.whatsapp;
   const normalized = whatsapp.replace(/[^0-9]/g, '');
   return { json: { whatsapp: normalized } };
   ```

## 🧪 Teste Manual no n8n

### Teste 1: Executar Workflow Manualmente

1. **No n8n**, clique em "Execute Workflow"
2. **Veja** os dados em cada node
3. **Verifique** se o node "Verifica Usuario" está recebendo o número correto
4. **Verifique** se o node está retornando os dados do usuário

### Teste 2: Usar Node "HTTP Request" para Testar

1. **Crie um node "HTTP Request"** temporário
2. **Configure** igual ao node "Verifica Usuario"
3. **No body**, use um número fixo:
   ```json
   {
     "phone_input": "553198632243"
   }
   ```
4. **Execute** e veja se retorna os dados do usuário

### Teste 3: Testar com Dados Reais

1. **Envie uma mensagem** do WhatsApp para o número conectado
2. **Aguarde** o workflow executar
3. **Verifique** se o node "Verifica Usuario" encontrou o usuário
4. **Verifique** se os dados estão corretos

## ✅ Checklist de Verificação

- [ ] URL do Supabase está correta
- [ ] Headers estão configurados (apikey, Authorization)
- [ ] Body está usando o campo correto (`{{$json.whatsapp}}`)
- [ ] Campo `whatsapp` não está `null` no INPUT
- [ ] Função retorna dados corretos quando testada manualmente
- [ ] Node "Verifica Usuario" retorna dados do usuário
- [ ] Dados retornados têm `user_id`, `full_name`, `subscription_status`

## 🚀 Próximos Passos

Depois de verificar que o node "Verifica Usuario" está funcionando:

1. **Verifique** o node seguinte (que usa os dados do usuário)
2. **Teste** o fluxo completo enviando uma mensagem
3. **Verifique** se o sistema identifica o usuário corretamente
4. **Verifique** se as ações são executadas para o usuário correto

---

**Última atualização:** 2025-01-11

**Conclusão:** Verifique se o node "Verifica Usuario" está configurado corretamente e se está recebendo o número do WhatsApp do node anterior. Se o campo `whatsapp` estiver `null`, o problema está no node "Organiza Dados".


# ✅ Testar Função get_user_by_phone Corretamente

## 🎯 Situação Atual

✅ **Função criada com sucesso!**  
✅ **Campos de telefone adicionados!**  
✅ **Usuários têm números cadastrados:**
- **apolo**: `553198632243`
- **Edson**: `553172242378`

## 🧪 Como Testar a Função

### Teste 1: Testar com Número do Apolo

```sql
SELECT * FROM get_user_by_phone('553198632243');
```

**Resultado esperado:**
- `user_id`: `fa039d56-e7a3-4118-a423-9c5cc9ef7d30`
- `full_name`: `apolo`
- `subscription_status`: `inactive`

### Teste 2: Testar com Número do Edson

```sql
SELECT * FROM get_user_by_phone('553172242378');
```

**Resultado esperado:**
- `user_id`: `18b4bff7-0eb0-40e9-8d98-0f12bf8afdb0`
- `full_name`: `Edson`
- `subscription_status`: `inactive`

### Teste 3: Testar com Número com @s.whatsapp.net

A função deve normalizar e funcionar mesmo com o sufixo:

```sql
SELECT * FROM get_user_by_phone('553198632243@s.whatsapp.net');
SELECT * FROM get_user_by_phone('553172242378@s.whatsapp.net');
```

**Ambos devem retornar os mesmos resultados** dos testes anteriores.

### Teste 4: Testar com Número que Não Existe

```sql
SELECT * FROM get_user_by_phone('5531999999999');
```

**Resultado esperado:**
- Nenhuma linha retornada (vazio)

## 🔍 Verificar Dados no Banco

### Ver Todos os Usuários com Telefone

```sql
SELECT 
  id,
  nome,
  whatsapp,
  phone_number
FROM public.profiles
WHERE whatsapp IS NOT NULL 
   OR phone_number IS NOT NULL;
```

### Ver Formato dos Números

```sql
SELECT 
  nome,
  whatsapp,
  REGEXP_REPLACE(whatsapp, '[^0-9]', '', 'g') as whatsapp_normalized
FROM public.profiles
WHERE whatsapp IS NOT NULL;
```

## ⚠️ Observações Importantes

### 1. Formato dos Números no Banco

Os números estão salvos com `@s.whatsapp.net`:
- `553198632243@s.whatsapp.net`
- `553172242378@s.whatsapp.net`

**Isso está correto!** A função normaliza automaticamente, então funciona com:
- `553198632243` (apenas números)
- `553198632243@s.whatsapp.net` (com sufixo)

### 2. Números que o n8n Recebe

Quando o n8n recebe uma mensagem do WhatsApp, o número vem no formato:
- `553198632243@s.whatsapp.net` (da Evolution API)

A função `get_user_by_phone` vai normalizar e encontrar o usuário corretamente!

### 3. Se a Função Não Retornar Dados

**Problema:** Número não encontrado

**Solução:**
1. Verifique se o número está cadastrado:
   ```sql
   SELECT * FROM public.profiles WHERE whatsapp LIKE '%553198632243%';
   ```

2. Verifique se o formato está correto:
   ```sql
   SELECT 
     nome,
     whatsapp,
     REGEXP_REPLACE(whatsapp, '[^0-9]', '', 'g') as normalized
   FROM public.profiles;
   ```

3. Teste a função com o número normalizado:
   ```sql
   SELECT * FROM get_user_by_phone(REGEXP_REPLACE('553198632243@s.whatsapp.net', '[^0-9]', '', 'g'));
   ```

## ✅ Checklist de Verificação

- [ ] Função `get_user_by_phone` existe
- [ ] Função retorna dados corretos para Apolo
- [ ] Função retorna dados corretos para Edson
- [ ] Função funciona com números com `@s.whatsapp.net`
- [ ] Função funciona com números sem `@s.whatsapp.net`
- [ ] Números estão cadastrados no banco
- [ ] Formato dos números está correto

## 🚀 Próximo Passo: Testar no n8n

Depois de confirmar que a função está funcionando:

1. **No n8n**, verifique o node "Verifica Usuario"
2. **Verifique** se está chamando a função corretamente:
   - URL: `https://SEU_SUPABASE_URL/rest/v1/rpc/get_user_by_phone`
   - Method: `POST`
   - Body: `{"phone_input": "{{$json.whatsapp}}"}`
3. **Teste** enviando uma mensagem do WhatsApp
4. **Verifique** se o usuário é encontrado corretamente

## 🐛 Se Não Funcionar no n8n

### Problema 1: Node "Verifica Usuario" Não Encontra Usuário

**Solução:**
1. Verifique se o número está sendo passado corretamente
2. Verifique se o número está no formato correto (apenas números ou com `@s.whatsapp.net`)
3. Teste a função manualmente no Supabase com o mesmo número

### Problema 2: Erro de Permissão

**Solução:**
1. Verifique as políticas RLS da tabela `profiles`
2. Verifique se a função tem permissão para ler a tabela
3. Teste com as chaves corretas do Supabase no n8n

### Problema 3: Número Não Correspondente

**Solução:**
1. Verifique qual número está sendo enviado pelo n8n
2. Verifique qual número está cadastrado no banco
3. Compare os números (podem ter diferenças de formato)

---

**Última atualização:** 2025-01-11

**Conclusão:** A função está funcionando! Agora teste no n8n para verificar se o node "Verifica Usuario" está encontrando os usuários corretamente.


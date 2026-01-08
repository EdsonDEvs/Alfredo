# 🚀 Instruções Rápidas: Executar Script no Supabase

## ✅ Passo a Passo

### 1. Acessar o Supabase SQL Editor

1. **Acesse** o painel do Supabase: https://supabase.com
2. **Faça login** na sua conta
3. **Selecione** seu projeto
4. **Clique** em "SQL Editor" no menu lateral

### 2. Executar o Script

1. **Abra** o arquivo `CORRIGIR-PROFILES-VERSÃO-FINAL.sql`
2. **Copie** todo o conteúdo do arquivo
3. **Cole** no SQL Editor do Supabase
4. **Clique** em "Run" (ou pressione Ctrl+Enter)

### 3. Verificar Resultados

Após executar, você verá:

1. **Resultado 1:** Lista de colunas de telefone (deve mostrar `phone`, `whatsapp`, `phone_number`)
2. **Resultado 2:** Confirmação de que a função foi criada
3. **Resultado 3:** Lista de todos os usuários

### 4. Adicionar Números aos Usuários

**IMPORTANTE:** Você precisa adicionar números aos usuários existentes!

#### No SQL Editor, execute:

```sql
-- Adicionar número ao usuário "edson"
UPDATE public.profiles 
SET whatsapp = '553197599924'  -- ⚠️ SUBSTITUA pelo número real
WHERE nome = 'edson';

-- Adicionar número ao usuário "apolo"
UPDATE public.profiles 
SET whatsapp = '5511999999999'  -- ⚠️ SUBSTITUA pelo número real
WHERE nome = 'apolo';
```

### 5. Testar a Função

```sql
-- Testar com um número real
SELECT * FROM get_user_by_phone('553197599924');
```

**Resultado esperado:**
- `user_id`: UUID do usuário
- `full_name`: Nome do usuário (ex: "edson")
- `subscription_status`: "inactive"

### 6. Verificar no Table Editor

1. **Acesse** "Table Editor" no Supabase
2. **Selecione** a tabela `profiles`
3. **Recarregue** a página (F5)
4. **Verifique** se as colunas `phone` e `whatsapp` aparecem
5. **Verifique** se os números foram adicionados aos usuários

## 🔍 Verificações

### Verificar se os Campos Foram Adicionados

```sql
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%');
```

### Verificar se a Função Existe

```sql
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';
```

### Verificar Usuários com Telefone

```sql
SELECT id, nome, whatsapp
FROM public.profiles
WHERE whatsapp IS NOT NULL;
```

## 🚨 Problemas Comuns

### Problema 1: Campos Não Aparecem no Table Editor

**Solução:**
1. Recarregue a página (F5)
2. Verifique via SQL se os campos existem
3. Limpe o cache do navegador

### Problema 2: Função Não Encontra Usuário

**Solução:**
1. Verifique se o número está cadastrado:
   ```sql
   SELECT * FROM public.profiles WHERE whatsapp = '553197599924';
   ```
2. Verifique o formato do número (deve ser apenas números)
3. Teste a função novamente

### Problema 3: Erro ao Executar Script

**Solução:**
1. Verifique se você está no projeto correto do Supabase
2. Verifique se tem permissões de administrador
3. Execute o script em partes (seção por seção)

## ✅ Checklist

- [ ] Script executado com sucesso
- [ ] Campos `phone` e `whatsapp` adicionados
- [ ] Função `get_user_by_phone` criada
- [ ] Números adicionados aos usuários existentes
- [ ] Função testada e funcionando
- [ ] Campos visíveis no Table Editor

## 🚀 Próximo Passo

Depois de executar o script e adicionar números:

1. **Teste no n8n:** Verifique se o node "Verifica Usuario" funciona
2. **Envie uma mensagem** no WhatsApp
3. **Verifique** se o sistema identifica o usuário corretamente

---

**Última atualização:** 2025-01-11

**Arquivo a executar:** `CORRIGIR-PROFILES-VERSÃO-FINAL.sql`


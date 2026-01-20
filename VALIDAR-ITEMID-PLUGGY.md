# ✅ Validar ItemId Pluggy

## 🔍 Seu ItemId

```
6ce26775-dba7-4c31-aee9-ac7d0baf6ec9
```

## 📋 Passos para Validar

### 1️⃣ Verificar se está salvo no Banco de Dados

Execute no **Supabase SQL Editor**:

```sql
-- Verificar se o itemId está salvo no seu perfil
SELECT 
  id,
  nome,
  email,
  bank_connection_id,
  created_at
FROM public.profiles
WHERE bank_connection_id = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9';
```

**Resultado esperado:**
- Deve retornar 1 linha com seu perfil
- O campo `bank_connection_id` deve conter: `6ce26775-dba7-4c31-aee9-ac7d0baf6ec9`

### 2️⃣ Se não encontrar, verificar todos os perfis com conexão

```sql
-- Listar todos os perfis com conexão bancária
SELECT 
  id,
  nome,
  email,
  bank_connection_id
FROM public.profiles
WHERE bank_connection_id IS NOT NULL;
```

### 3️⃣ Verificar transações sincronizadas

Após encontrar seu `userid` na consulta anterior, execute:

```sql
-- Substitua 'SEU_USER_ID_AQUI' pelo id retornado acima
SELECT 
  id,
  estabelecimento,
  valor,
  tipo,
  quando,
  external_id,
  created_at
FROM public.transacoes
WHERE userid = 'SEU_USER_ID_AQUI'
  AND external_id IS NOT NULL
ORDER BY quando DESC
LIMIT 20;
```

## 🔧 Se o ItemId NÃO está salvo

### Solução 1: Re-conectar

1. Vá para o Dashboard
2. Clique em **"Conectar Conta Bancária"**
3. O itemId será salvo automaticamente

### Solução 2: Salvar manualmente via SQL

```sql
-- Substitua 'SEU_USER_ID' pelo ID do seu usuário (da tabela auth.users)
UPDATE public.profiles
SET bank_connection_id = '6ce26775-dba7-4c31-aee9-ac7d0baf6ec9'
WHERE id = 'SEU_USER_ID';
```

## 🧪 Testar Sincronização

Após validar que o itemId está salvo:

1. **No Dashboard**, role até **"Conectar Conta Bancária"**
2. Clique em **"Sincronizar Agora"**
3. Verifique o console do navegador (F12) — deve mostrar:
   ```
   ✅ ItemId encontrado: 6ce26775-dba7-4c31-aee9-ac7d0baf6ec9
   📊 Total de transações encontradas na Pluggy: X
   ✅ X transação(ões) sincronizada(s) com sucesso
   ```

## 📊 Verificar Resultado

Após sincronizar, execute:

```sql
-- Contar transações sincronizadas
SELECT 
  COUNT(*) as total,
  COUNT(DISTINCT external_id) as unicas,
  SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END) as receitas,
  SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END) as despesas
FROM public.transacoes
WHERE userid = 'SEU_USER_ID'
  AND external_id IS NOT NULL;
```

## ✅ Checklist

- [ ] ItemId está salvo em `profiles.bank_connection_id`
- [ ] Sincronização executada com sucesso
- [ ] Transações aparecem na tabela `transacoes`
- [ ] Transações aparecem no Dashboard
- [ ] Sem duplicatas (verificar `external_id`)

## 🆘 Problemas Comuns

### "Nenhuma conexão bancária encontrada"

**Causa:** ItemId não está salvo no perfil

**Solução:**
1. Re-conecte a conta bancária no Dashboard
2. Ou salve manualmente via SQL (veja acima)

### "Nenhuma transação encontrada"

**Causa:** Não há transações nos últimos 90 dias ou erro na API

**Solução:**
1. Verifique o console para erros
2. Verifique se a conta Pluggy tem transações
3. Tente aumentar o período de busca (modificar código)

### "Transações não aparecem no Dashboard"

**Causa:** Filtros de data ou cache

**Solução:**
1. Verifique os filtros de mês/ano
2. Limpe o cache (Ctrl+Shift+R)
3. Recarregue a página





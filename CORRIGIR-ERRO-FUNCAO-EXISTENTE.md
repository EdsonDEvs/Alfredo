# 🔧 Corrigir Erro: Função Já Existe

## 🚨 Erro Encontrado

```
ERRO: 42P13: não é possível alterar o tipo de retorno da função existente.
DETALHE: O tipo de linha definido pelos parâmetros OUT é diferente.
DICA: Use DROP FUNCTION get_user_by_phone(character varying) primeiro.
```

## ✅ Solução

O PostgreSQL não permite alterar o tipo de retorno de uma função existente usando `CREATE OR REPLACE`. É necessário fazer `DROP FUNCTION` primeiro.

### Script Corrigido

O script `CORRIGIR-PROFILES-VERSÃO-FINAL.sql` foi atualizado para incluir:

```sql
-- Remover função antiga se existir
DROP FUNCTION IF EXISTS get_user_by_phone(character varying);
DROP FUNCTION IF EXISTS get_user_by_phone(VARCHAR);

-- Criar função nova
CREATE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
-- ... código da função ...
$$ LANGUAGE plpgsql;
```

## 🚀 Como Executar

### Opção 1: Executar Script Corrigido

1. **Abra** o arquivo `CORRIGIR-PROFILES-VERSÃO-FINAL.sql` (já corrigido)
2. **Execute** no Supabase SQL Editor
3. **A função será removida e recriada** automaticamente

### Opção 2: Executar Manualmente

Se preferir, execute apenas estas linhas primeiro:

```sql
-- Remover função antiga
DROP FUNCTION IF EXISTS get_user_by_phone(character varying);
DROP FUNCTION IF EXISTS get_user_by_phone(VARCHAR);
```

Depois execute o resto do script normalmente.

## 🔍 Verificar se Funcionou

Após executar, teste a função:

```sql
-- Testar função
SELECT * FROM get_user_by_phone('553197599924');
```

**Resultado esperado:**
- `user_id`: UUID do usuário
- `full_name`: Nome do usuário
- `subscription_status`: "inactive"

## 📋 Checklist

- [ ] Função antiga removida com sucesso
- [ ] Função nova criada sem erros
- [ ] Função testada e funcionando
- [ ] Campos de telefone adicionados
- [ ] Números adicionados aos usuários

## 🚨 Se Ainda Der Erro

Se ainda aparecer erro, execute este comando para ver todas as versões da função:

```sql
-- Ver todas as versões da função
SELECT 
  routine_name,
  routine_type,
  data_type,
  routine_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';
```

Depois remova todas as versões:

```sql
-- Remover todas as versões possíveis
DROP FUNCTION IF EXISTS get_user_by_phone(character varying);
DROP FUNCTION IF EXISTS get_user_by_phone(VARCHAR);
DROP FUNCTION IF EXISTS get_user_by_phone(text);
```

E então crie a função novamente.

---

**Última atualização:** 2025-01-11

**Conclusão:** O script foi corrigido para remover a função antiga antes de criar a nova. Execute o script atualizado no Supabase.


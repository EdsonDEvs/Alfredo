# 🔍 Resposta: Tem a Ver com o Supabase?

## ❌ NÃO - O Problema Principal NÃO É o Supabase

O problema principal é que os eventos `messages.upsert` não estão chegando no n8n, ou os dados estão `null` no node "Organiza Dados".

**Fluxo do Problema:**
```
Evolution API → Webhook → InicioChat → Organiza Dados → Verifica Usuario (Supabase)
                                                          ↑
                                                    PROBLEMA PRINCIPAL
                                                    está AQUI (antes)
```

Se os campos estão `null` no "Organiza Dados", o problema está na **extração dos dados do webhook**, não no Supabase.

## ✅ MAS - O Supabase Pode Estar Bloqueando o Fluxo

Se o node "Verifica Usuario" está falhando, isso pode impedir que o workflow continue.

**Verificações:**

### 1. O Node "Verifica Usuario" Está Funcionando?

**No n8n:**
1. Abra o workflow
2. Veja o node "Verifica Usuario"
3. Verifique se há erros nas execuções
4. Veja se o node está retornando dados ou falhando

### 2. A Função `get_user_by_phone` Existe?

**No Supabase SQL Editor, execute:**

```sql
-- Verificar se a função existe
SELECT routine_name
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_user_by_phone';

-- Testar a função (substitua pelo número real)
SELECT * FROM get_user_by_phone('553197599924');
```

### 3. O Campo de Telefone Existe?

**No Supabase SQL Editor, execute:**

```sql
-- Verificar campos de telefone
SELECT column_name
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'profiles'
  AND (column_name LIKE '%phone%' OR column_name LIKE '%whatsapp%');
```

### 4. Há Usuários no Banco?

**No Supabase SQL Editor, execute:**

```sql
-- Verificar usuários com telefone
SELECT id, nome, phone, whatsapp, phone_number
FROM public.profiles
WHERE phone IS NOT NULL 
   OR whatsapp IS NOT NULL 
   OR phone_number IS NOT NULL;
```

## 🔧 Como Corrigir Problemas no Supabase

### Problema 1: Função Não Existe

**Solução:** Execute no Supabase SQL Editor:

```sql
CREATE OR REPLACE FUNCTION get_user_by_phone(phone_input VARCHAR)
RETURNS TABLE (
  user_id UUID,
  full_name VARCHAR,
  subscription_status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id::UUID,
    COALESCE(p.nome, p.full_name, 'Usuário')::VARCHAR,
    COALESCE(p.subscription_status, 'inactive')::VARCHAR
  FROM public.profiles p
  WHERE p.phone = phone_input
     OR p.whatsapp = phone_input
     OR p.phone_number = phone_input
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;
```

### Problema 2: Campo Não Existe

**Solução:** Execute no Supabase SQL Editor:

```sql
-- Adicionar campos se não existirem
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20);

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
```

### Problema 3: RLS Bloqueando

**Solução:** Execute no Supabase SQL Editor:

```sql
-- Permitir busca pública (se necessário para n8n)
CREATE POLICY "Allow public read for phone lookup"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);
```

## 🎯 Ordem de Prioridade

### 1. PRIMEIRO: Corrigir Extração dos Dados

**Problema:** Campos `null` no "Organiza Dados"

**Solução:**
1. Envie uma mensagem REAL (pressione Enter)
2. Verifique o OUTPUT do "InicioChat"
3. Veja se o evento é `messages.upsert`
4. Ajuste as expressões no "Organiza Dados"

### 2. DEPOIS: Verificar Supabase

**Problema:** Node "Verifica Usuario" falhando

**Solução:**
1. Execute o script `SCRIPT-VERIFICAR-SUPABASE.sql`
2. Verifique se a função existe
3. Verifique se há usuários no banco
4. Corrija problemas encontrados

## 📋 Checklist Completo

### Problema Principal (Extração de Dados)

- [ ] Campos não estão `null` no "Organiza Dados"
- [ ] Evento é `messages.upsert` (não `presence.update`)
- [ ] Estrutura dos dados está correta
- [ ] Expressões estão corretas

### Supabase (Depois)

- [ ] Função `get_user_by_phone` existe
- [ ] Campo `phone` ou `whatsapp` existe
- [ ] Políticas RLS estão corretas
- [ ] Há usuários com o número no banco
- [ ] Função retorna dados corretamente
- [ ] Node "Verifica Usuario" não está falhando

## 🚀 Próximos Passos

1. **Execute o script** `SCRIPT-VERIFICAR-SUPABASE.sql` no Supabase
2. **Verifique os resultados** e corrija problemas encontrados
3. **Teste a função** manualmente com um número real
4. **Verifique no n8n** se o node "Verifica Usuario" está funcionando
5. **Se ainda não funcionar**, o problema está na extração dos dados (não no Supabase)

## 💡 Conclusão

- **Problema Principal:** Extração dos dados do webhook (campos `null`)
- **Problema Secundário:** Supabase pode estar bloqueando se o node "Verifica Usuario" falhar
- **Solução:** Primeiro corrija a extração dos dados, depois verifique o Supabase

---

**Última atualização:** 2025-01-11

**Resposta Direta:** O problema principal NÃO é o Supabase, mas o Supabase pode estar bloqueando o fluxo se o node "Verifica Usuario" estiver falhando. Execute o script de verificação para identificar problemas.


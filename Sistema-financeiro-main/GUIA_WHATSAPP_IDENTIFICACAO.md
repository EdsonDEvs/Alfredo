# 📱 Guia: Identificação WhatsApp no N8N

## 🎯 Como o Assistente Identifica Usuários

### **Fluxo de Identificação:**

1. **Usuário envia mensagem** no WhatsApp
2. **N8N recebe** o número de telefone (ex: 5511999999999)
3. **Sistema busca** o usuário pelo telefone no Supabase
4. **Processa a transação** para o usuário correto

## 🛠️ Configuração Necessária

### **1. Execute no Supabase SQL Editor:**

```sql
-- Adicionar campo de telefone
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);

-- Criar índice para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number 
ON public.profiles(phone_number);
```

### **2. Cadastrar Usuário com Telefone:**

**Opção A: Via Frontend**
- Usuário se cadastra normalmente
- Adiciona telefone no perfil
- Formato: `5511999999999` (sem +)

**Opção B: Via SQL**
```sql
UPDATE public.profiles 
SET phone_number = '5511999999999' 
WHERE full_name = 'Nome do Usuário';
```

### **3. Configurar N8N:**

**No seu workflow N8N, adicione:**

1. **Node HTTP Request** para buscar usuário:
   ```
   URL: https://yjtsyuibemnkjfyonfjt.supabase.co/rest/v1/rpc/get_user_by_phone
   Method: POST
   Headers: 
     - apikey: [SUA_CHAVE_ANON]
     - Authorization: Bearer [SUA_CHAVE_ANON]
   Body:
   {
     "phone_input": "{{$json.from}}"
   }
   ```

2. **Node Switch** para verificar se usuário existe:
   - Se encontrou: Processa transação
   - Se não encontrou: Envia mensagem de cadastro

## 📋 Exemplo de Fluxo N8N

### **1. Receber Mensagem WhatsApp**
```
Trigger: WhatsApp Message
→ Extrair número: {{$json.from}}
```

### **2. Buscar Usuário**
```
HTTP Request: get_user_by_phone
→ Input: {{$json.from}}
→ Output: user_data
```

### **3. Verificar Usuário**
```
Switch Node:
- Case 1: user_data.length > 0 → Processar Transação
- Case 2: user_data.length = 0 → Enviar Mensagem de Cadastro
```

### **4. Processar Transação**
```
HTTP Request: Inserir Transação
→ user_id: {{user_data[0].user_id}}
→ valor: {{extrair_valor($json.text)}}
→ categoria: {{identificar_categoria($json.text)}}
```

## 🔧 Função SQL para Busca

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
    p.userid::UUID,
    p.full_name,
    p.subscription_status
  FROM public.profiles p
  WHERE p.phone_number = phone_input;
END;
$$ LANGUAGE plpgsql;
```

## 📱 Formato do Número

**Importante:** O WhatsApp envia números no formato:
- `5511999999999` (com código do país, sem +)
- Sem espaços ou caracteres especiais

**Exemplo:**
- Número: +55 11 99999-9999
- WhatsApp envia: `5511999999999`
- Salvar no banco: `5511999999999`

## 🚀 Teste Rápido

### **1. Cadastrar Usuário de Teste:**
```sql
INSERT INTO public.profiles (
  userid,
  full_name,
  phone_number,
  subscription_status
) VALUES (
  'test-user-id',
  'Usuário Teste',
  '5511999999999',
  'active'
);
```

### **2. Testar Busca:**
```sql
SELECT * FROM get_user_by_phone('5511999999999');
```

### **3. Enviar Mensagem WhatsApp:**
- Número: 5511999999999
- Mensagem: "Gastei 50 reais com gasolina"
- Verificar se processa corretamente

## ✅ Checklist

- [ ] Campo `phone_number` adicionado na tabela `profiles`
- [ ] Índice criado para busca rápida
- [ ] Função `get_user_by_phone` criada
- [ ] Usuário cadastrado com telefone
- [ ] N8N configurado para buscar por telefone
- [ ] Teste realizado com sucesso

## 🆘 Troubleshooting

### **Usuário não encontrado:**
1. Verificar formato do número
2. Confirmar se está salvo no banco
3. Testar função SQL diretamente

### **Erro de permissão:**
1. Verificar RLS policies
2. Confirmar chaves do Supabase
3. Testar com usuário autenticado

---

**🎯 Com essa configuração, o assistente identificará automaticamente o usuário pelo número do WhatsApp!**

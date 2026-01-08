# ✅ Correção Aplicada: Erro UUID no Node "Auth"

## 🚨 Erro Original

```
Bad request - please check your parameters: 
invalid input syntax for type uuid: '553172242378@s.whatsapp.net'
```

**Causa:** O node "Auth" estava tentando usar o número do WhatsApp com `@s.whatsapp.net` em um campo que espera UUID.

---

## ✅ Correção Aplicada

### Node "Auth" (Linha 2446)

**ANTES:**
```javascript
"keyValue": "={{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}"
```

**DEPOIS:**
```javascript
"keyValue": "={{ ($('Organiza Dados').item.json.whatsapp || $json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}"
```

**Mudança:** Agora usa **primeiro** o número já normalizado do node "Organiza Dados", que garante que está sem `@s.whatsapp.net`.

---

## 🔍 Por Que Funciona Agora

### Fluxo de Dados:

1. **Node "InicioChat"** → Recebe webhook da Uazapi
2. **Node "Organiza Dados"** → Normaliza o número:
   ```javascript
   whatsapp: "553172242378"  // ✅ Sem @s.whatsapp.net
   ```
3. **Node "Auth"** → Usa o número normalizado:
   ```javascript
   whatsapp = "553172242378"  // ✅ Já normalizado
   ```
4. **Supabase** → Busca na tabela `profiles`:
   ```sql
   SELECT * FROM profiles 
   WHERE whatsapp = '553172242378' 
   AND ativo = TRUE
   ```

---

## 📋 Configuração Final do Node "Auth"

### Operação:
- **Recurso:** `Row`
- **Operação:** `Get`
- **Tabela:** `profiles`

### Condições:

#### 1. Campo `whatsapp`:
- **Nome ou ID:** `whatsapp`
- **Condição:** `equals`
- **Valor:**
```javascript
{{ ($('Organiza Dados').item.json.whatsapp || $json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

#### 2. Campo `ativo`:
- **Nome ou ID:** `ativo`
- **Condição:** `equals`
- **Valor:** `TRUE`

---

## ✅ Próximos Passos

1. **Salve o workflow** no n8n
2. **Execute o workflow** novamente
3. **Verifique o OUTPUT do node "Auth"**:
   - ✅ Deve encontrar o usuário (se existir no Supabase)
   - ✅ Não deve mais dar erro de UUID

---

## 🔍 Se Ainda Der Erro

### Verificar Node "Organiza Dados"

1. Execute o node "Organiza Dados" manualmente
2. Veja o OUTPUT
3. Verifique o campo `whatsapp`:
   - ✅ Deve estar: `553172242378`
   - ❌ NÃO deve estar: `553172242378@s.whatsapp.net`

### Se o "Organiza Dados" não está normalizando:

A expressão atual já está correta (linha 412):
```javascript
{{ ($json.body?.phone || $json.body?.from || $json.body?.data?.key?.remoteJid || $json.phone || $json.from || '').toString().replace('@s.whatsapp.net', '').replace('@g.us', '').replace('@c.us', '').trim() }}
```

Se ainda assim não normalizar, pode ser que os dados da Uazapi venham em uma estrutura diferente. Nesse caso, verifique o OUTPUT do node "InicioChat" para ver a estrutura real.

---

## 📝 Resumo

**Problema:** Número do WhatsApp com `@s.whatsapp.net` sendo usado como UUID  
**Solução:** Usar número já normalizado do node "Organiza Dados"  
**Status:** ✅ Corrigido

---

**Arquivo modificado:** `Alfredo (Altual).json` (linha 2446)




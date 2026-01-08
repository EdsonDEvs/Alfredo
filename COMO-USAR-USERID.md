# 📋 Como Usar o `userId` no Workflow

## 🎯 Resposta Rápida

**No node "Organiza Dados":**
- ❌ **NÃO adicione** o campo `userId`
- ✅ O `userId` vem automaticamente do node **"Auth"** depois

**Para usar o `userId` em outros nodes:**
```javascript
{{ $('Auth').item.json.id }}
```

---

## 📊 Fluxo do `userId`

### Como Funciona:

```
1. Webhook (InicioChat) → Recebe dados do uazapi
   ↓
2. Auth → Busca usuário no Supabase pelo whatsapp
   ↓ Retorna: { id: "uuid-do-usuario", nome: "...", whatsapp: "..." }
   ↓
3. Verifica Usuario → Verifica se encontrou usuário
   ↓ Usa: {{ $('Auth').item.json.id }}
   ↓
4. Resto do workflow → Usa userId quando necessário
   ↓ Usa: {{ $('Auth').item.json.id }}
```

---

## ✅ Onde o `userId` é Usado

### 1. **Node "Verifica Usuario"**
```javascript
{{ $('Auth').item.json.id }}
```
Verifica se o usuário existe e está ativo.

### 2. **Tools do Assistente Financeiro**
- Tool `add` (adicionar transação)
- Tool `edit` (editar transação)
- Tool `categorias` (buscar categorias)
- Tool `addCategoria` (criar categoria)

**Expressão usada:**
```javascript
{{ $('Auth').item.json.id }}
```

### 3. **Tools do Agente de Consulta**
- Tool `transacoes` (buscar transações)
- Tool `lembretes` (buscar lembretes)
- Tool `consultaCategorias` (buscar categorias)

**Expressão usada:**
```javascript
{{ $('Auth').item.json.id }}
```

### 4. **Tool salvaLembrete**
**Expressão usada:**
```javascript
{{ $('Auth').item.json.id }}
```

---

## ❌ O que NÃO Fazer

### ❌ NÃO adicione `userId` no node "Organiza Dados"

**Errado:**
```javascript
{
  "name": "userId",
  "value": "={{ $('Auth').item.json.id }}"
}
```

**Por quê?**
- O node "Auth" ainda não foi executado quando "Organiza Dados" roda
- Causa erro: `[ERROR: No path back to node]`

---

## ✅ Solução Correta

### Opção 1: Usar `$('Auth').item.json.id` diretamente

**Em qualquer node após "Auth", use:**
```javascript
{{ $('Auth').item.json.id }}
```

**Exemplo no node "Set" após "Verifica Usuario":**
```javascript
{
  "name": "userId",
  "value": "={{ $('Auth').item.json.id }}"
}
```

### Opção 2: O workflow já está configurado corretamente

**Todas as tools e nodes já usam:**
```javascript
{{ $('Auth').item.json.id }}
```

**Você não precisa adicionar nada!** ✅

---

## 🔍 Verificar se Está Funcionando

### Passo 1: Verificar Node "Auth"

1. Execute o workflow
2. Abra o node "Auth"
3. Veja o OUTPUT
4. Deve mostrar: `{ id: "uuid", nome: "...", whatsapp: "..." }`

### Passo 2: Verificar Node "Verifica Usuario"

1. Veja o OUTPUT do node "Verifica Usuario"
2. Deve mostrar TRUE se encontrou usuário
3. Deve mostrar FALSE se não encontrou

### Passo 3: Verificar Tools

1. Execute uma ação que use o userId (ex: adicionar transação)
2. Verifique se a transação é salva com o userId correto
3. Veja no Supabase se o `userid` está preenchido

---

## 📝 Exemplo Completo

### Se você precisar adicionar `userId` em um novo node:

**Node "Set" (após "Verifica Usuario"):**
```javascript
{
  "assignments": {
    "assignments": [
      {
        "name": "whatsapp",
        "value": "={{ $('Organiza Dados').item.json.whatsapp }}"
      },
      {
        "name": "mensagem",
        "value": "={{ $('Organiza Dados').item.json.mensagem }}"
      },
      {
        "name": "userId",
        "value": "={{ $('Auth').item.json.id }}"
      }
    ]
  }
}
```

---

## ✅ Resumo

1. **No "Organiza Dados":** ❌ NÃO adicione `userId`
2. **Em outros nodes:** ✅ Use `{{ $('Auth').item.json.id }}`
3. **O workflow já está correto:** ✅ Todas as tools já usam o userId do Auth
4. **Não precisa fazer nada:** ✅ Tudo já está configurado!

---

**Status:** ✅ Workflow já configurado corretamente  
**Próximo Passo:** Testar e verificar se está funcionando


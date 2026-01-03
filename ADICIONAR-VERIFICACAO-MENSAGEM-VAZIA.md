# ✅ Adicionar Verificação: Processar Apenas Quando Há Mensagem

## 🎯 Problema

**Workflow está tentando processar eventos `presence.update` mesmo quando os campos estão vazios.**

**Resultado:** Node "Enviar texto" recebe `whatsapp: null` e falha com erro "Invalid format"

## ✅ Solução: Adicionar Verificação

### Opção 1: Node "IF" Após "Organiza Dados" (Recomendada)

**Adicione um node "IF" após "Organiza Dados":**

#### Configuração:

1. **Condição:**
```
{{ $json.mensagem && $json.mensagem !== '' && $json.whatsapp && $json.whatsapp !== '' }}
```

2. **Quando TRUE:** Conecte para "Verifica Usuario" (processa mensagem)
3. **Quando FALSE:** Não conecte nada (não processa)

#### Fluxo:

```
Organiza Dados → IF (Verifica se tem mensagem) → Verifica Usuario → Enviar texto
                                    ↓ (FALSE - sem mensagem)
                              (Não processa)
```

### Opção 2: Verificar no Node "Verifica Usuario"

**No node "Verifica Usuario", adicione condição:**

**Se for node HTTP Request:**
- **URL:** Use expressão condicional
- **Ou:** Adicione verificação no body

**Exemplo:**
```
{{ $json.whatsapp && $json.whatsapp !== '' ? 'https://...' : '' }}
```

### Opção 3: Verificar Campo `skip` (Se Usar Node Function)

**Se você adicionou um node Function que retorna `skip: true`:**

**Condição no node IF:**
```
{{ $json.skip === false }}
```

**Quando TRUE:** Processa (tem mensagem)  
**Quando FALSE:** Não processa (presence.update)

## 🔧 Implementação: Node IF

### Passo a Passo:

1. **Adicione um node "IF"** após "Organiza Dados"
2. **Nomeie como "Verificar Mensagem"**
3. **Configure a condição:**
   - **Campo 1:** `{{ $json.mensagem }}`
   - **Operador:** `is not empty` ou `!== ''`
   - **Campo 2:** `{{ $json.whatsapp }}`
   - **Operador:** `is not empty` ou `!== ''`

**Ou use expressão:**
```
{{ $json.mensagem && $json.mensagem !== '' && $json.whatsapp && $json.whatsapp !== '' }}
```

4. **Conecte:**
   - **Quando TRUE:** "Verifica Usuario"
   - **Quando FALSE:** (não conecte nada)

## 🧪 Testar

### Teste 1: Evento `presence.update`

1. **Workflow recebe `presence.update`**
2. **Node "Organiza Dados"** retorna campos vazios
3. **Node "IF"** verifica: `mensagem === ''` → FALSE
4. **Workflow NÃO processa** (correto) ✅

### Teste 2: Evento `messages.upsert`

1. **Envie uma mensagem REAL** no WhatsApp
2. **Workflow recebe `messages.upsert`**
3. **Node "Organiza Dados"** retorna campos preenchidos
4. **Node "IF"** verifica: `mensagem !== ''` → TRUE
5. **Workflow processa normalmente** ✅

## 📋 Checklist

- [ ] Node "IF" adicionado após "Organiza Dados"
- [ ] Condição configurada para verificar se há mensagem
- [ ] Conectado corretamente (TRUE → Verifica Usuario)
- [ ] Teste com `presence.update` (não processa)
- [ ] Teste com `messages.upsert` (processa)
- [ ] Node "Enviar texto" não recebe `whatsapp: null`

## 🚀 Próximo Passo

**Depois de adicionar a verificação:**
1. **Teste com mensagem real** no WhatsApp
2. **Verifique se o workflow processa apenas mensagens reais**
3. **Verifique se o node "Enviar texto" funciona corretamente**

---

**Última atualização:** 2025-01-11

**Conclusão:** Adicione um node "IF" após "Organiza Dados" para verificar se há mensagem antes de processar. Isso evita que o workflow tente processar eventos `presence.update` (que não têm mensagem).





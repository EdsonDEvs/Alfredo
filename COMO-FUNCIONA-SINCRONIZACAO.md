# 🔄 Como Funciona a Sincronização Pluggy → Supabase → Dashboard

## 📊 Fluxo Completo

### 1️⃣ Conectar Conta Bancária

Quando você clica em **"Conectar Conta Bancária"**:

1. Widget Pluggy abre
2. Você escolhe o banco e faz login
3. Pluggy retorna um `itemId` (ID da conexão)
4. O `itemId` é salvo no banco de dados na tabela `profiles` (coluna `bank_connection_id`)

### 2️⃣ Sincronização Automática

Após conectar, a sincronização acontece automaticamente:

1. **Buscar transações da Pluggy**
   - Usa o `itemId` salvo no perfil
   - Busca transações dos últimos 90 dias
   - Obtém dados de todas as contas (corrente, poupança, cartão de crédito)

2. **Mapear para o formato do sistema**
   - Converte transações da Pluggy para o formato do seu banco
   - Determina se é receita ou despesa
   - Usa `external_id` (ID da Pluggy) para evitar duplicatas

3. **Salvar no Supabase**
   - Insere/atualiza na tabela `transacoes`
   - Usa `upsert` com `external_id` como chave única
   - Evita duplicatas automaticamente

4. **Atualizar Dashboard**
   - Sistema recarrega as transações
   - Aparece automaticamente no Dashboard e na aba Transações

---

## 🗄️ Estrutura no Banco de Dados

### Tabela `profiles`
```sql
bank_connection_id: "a2a6eb4f-efab-4518-879d-141b915afdb6"  -- ID da conexão Pluggy
```

### Tabela `transacoes`
```sql
id: 123
userid: "seu-user-id"
external_id: "pluggy-transaction-id-123"  -- ID da transação na Pluggy
estabelecimento: "Nubank - Compra no Supermercado"
valor: 150.00
tipo: "despesa"
quando: "2026-01-08"
category_id: "uuid-da-categoria"
detalhes: "Alimentação"
```

**Importante:** O campo `external_id` garante que a mesma transação não seja importada duas vezes.

---

## 🔍 Como Verificar se Está Funcionando

### 1. Verificar no Console do Navegador

Ao clicar em **"Sincronizar Agora"**, você deve ver:

```
🔄 Autenticando na Pluggy com Client ID e Secret...
✅ API Key temporária gerada com sucesso
📊 Buscando transações da Pluggy...
✅ X transação(ões) encontrada(s)
✅ Sincronização concluída: X transação(ões) sincronizada(s)
```

### 2. Verificar no Supabase

1. Acesse o Supabase Dashboard
2. Vá em **Table Editor** → **transacoes**
3. Filtre por seu `userid`
4. Verifique se há transações com `external_id` preenchido

### 3. Verificar no Dashboard

1. Vá para o Dashboard
2. As transações devem aparecer automaticamente
3. Verifique os filtros (mês/ano) se necessário

---

## 🔧 Sincronização Manual

Se as transações não aparecerem automaticamente:

1. **No Dashboard**, role até a seção **"Conectar Conta Bancária"**
2. Clique em **"Sincronizar Agora"**
3. Aguarde a mensagem de sucesso
4. As transações devem aparecer

---

## 📋 O Que é Sincronizado

### ✅ Dados Importados

- **Transações bancárias** (últimos 90 dias)
- **Valor** (convertido para positivo)
- **Data** da transação
- **Descrição** (nome do estabelecimento)
- **Tipo** (receita ou despesa, baseado no valor)
- **Categoria** (atribuída automaticamente à categoria "Geral" se não houver)

### ❌ Dados NÃO Importados (ainda)

- Categorias automáticas da Pluggy (precisa mapear manualmente)
- Saldos das contas (apenas transações)
- Investimentos (precisa implementar separadamente)

---

## 🐛 Troubleshooting

### "Nenhuma transação encontrada"

**Possíveis causas:**
1. Conta conectada mas sem transações no período (últimos 90 dias)
2. Erro na autenticação da Pluggy
3. `itemId` não salvo corretamente

**Solução:**
- Verifique o console do navegador para erros
- Verifique se o `itemId` está salvo em `profiles.bank_connection_id`
- Tente sincronizar manualmente

### "Transações não aparecem no Dashboard"

**Possíveis causas:**
1. Filtros de data muito restritivos
2. Cache do navegador
3. Erro ao buscar do Supabase

**Solução:**
- Verifique os filtros de mês/ano no Dashboard
- Limpe o cache do navegador (Ctrl+Shift+R)
- Verifique o console para erros
- Recarregue a página

### "Transações duplicadas"

**Solução:**
- O sistema usa `external_id` para evitar duplicatas
- Se aparecerem duplicatas, verifique se o campo `external_id` está sendo preenchido
- Execute a migração SQL se ainda não executou: `ADICIONAR-COLUNAS-OPEN-FINANCE.sql`

---

## 🔄 Sincronização Automática Futura

Para sincronização automática (sem clicar em "Sincronizar"):

1. **Webhooks da Pluggy** - Configure webhooks para receber notificações quando houver novas transações
2. **Cron Job** - Configure um job que sincroniza periodicamente (ex: a cada hora)
3. **Edge Function** - Crie uma Supabase Edge Function para sincronizar automaticamente

---

## 📚 Referências

- [Documentação Pluggy - Items](https://docs.pluggy.ai/docs/item)
- [Documentação Pluggy - Transactions](https://docs.pluggy.ai/docs/transaction)
- [Documentação Pluggy - Webhooks](https://docs.pluggy.ai/docs/webhook)

---

## ✅ Checklist

- [ ] Conta bancária conectada na Pluggy
- [ ] `itemId` salvo em `profiles.bank_connection_id`
- [ ] Migração SQL executada (`ADICIONAR-COLUNAS-OPEN-FINANCE.sql`)
- [ ] Sincronização manual testada
- [ ] Transações aparecem no Dashboard
- [ ] Transações aparecem na aba Transações
- [ ] Sem duplicatas (verificar `external_id`)


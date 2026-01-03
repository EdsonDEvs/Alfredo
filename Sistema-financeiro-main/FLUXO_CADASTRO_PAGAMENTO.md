# 🔄 Fluxo Completo de Cadastro e Pagamento

## 📋 Visão Geral

Este documento explica o fluxo completo desde a landing page até a criação automática da conta após o pagamento confirmado.

## 🚀 Fluxo Completo

### 1. **Landing Page (`/landing`)**

- Página profissional de vendas
- Apresenta funcionalidades, planos e depoimentos
- Botão "Começar Agora" leva para `/cadastro`

### 2. **Página de Cadastro (`/cadastro`)**

O cliente preenche:
- ✅ Nome Completo
- ✅ Email
- ✅ Telefone
- ✅ WhatsApp (apenas números com DDD)
- ✅ CPF (opcional)
- ✅ Plano selecionado

**O que acontece ao clicar em "Continuar para Pagamento":**

1. **Validação dos dados** (nome, email, telefone, WhatsApp obrigatórios)
2. **Salvar no Supabase** (tabela `leads` com status `pending` - **✅ AGORA FUNCIONA!**)
   - Os dados são salvos na tabela `leads` que não requer autenticação
   - Isso garante que os dados sejam persistidos mesmo antes do pagamento
3. **Salvar no localStorage** (backup para uso após pagamento)
4. **Enviar para n8n** (webhook `createUser` - opcional neste momento)
5. **Redirecionar para gateway de pagamento** (Asaas ou outro)

### 3. **Gateway de Pagamento**

- Cliente completa o pagamento no gateway (Asaas)
- Gateway processa o pagamento
- Após confirmação, redireciona para `/payment-success`

### 4. **Página de Sucesso (`/payment-success`)**

**O que acontece automaticamente:**

1. **Recupera dados** do localStorage ou state
2. **Envia webhook para n8n** (`confirmPayment`)
   - URL: `https://n8n.alfredoo.online/webhook-test/confirma-pagamento`
   - Método: POST
   - Payload:
     ```json
     {
       "nome": "João Silva",
       "email": "joao@email.com",
       "phone": "(11) 99999-9999",
       "whatsapp": "5511999999999",
       "plan": "premium",
       "paymentId": "pay_123456",
       "paymentStatus": "confirmed",
       "timestamp": "2025-01-27T10:00:00Z"
     }
     ```

3. **n8n processa o webhook:**
   - Filtra dados recebidos
   - Verifica número WhatsApp
   - Gera senha aleatória
   - Cria conta no Supabase
   - Atualiza informações do usuário
   - Envia WhatsApp com credenciais
   - Envia Email com credenciais

4. **Atualiza assinatura** no Supabase (se usuário já estiver logado)

5. **Mostra mensagem de sucesso** ao cliente

## 🔗 Integração com n8n

### Webhook de Confirmação de Pagamento

**URL do Webhook:**
```
https://n8n.alfredoo.online/webhook-test/confirma-pagamento
```

**Método:** POST

**Payload Esperado:**
```json
{
  "nome": "string",
  "email": "string",
  "phone": "string",
  "whatsapp": "string",
  "plan": "basico|premium|profissional",
  "paymentId": "string (opcional)",
  "paymentStatus": "confirmed",
  "timestamp": "ISO 8601"
}
```

**Resposta Esperada:**
```json
{
  "success": true,
  "message": "Conta criada com sucesso",
  "userId": "uuid-do-usuario"
}
```

### Workflow n8n

O workflow "Cria conta usuário" no n8n deve:

1. **ConfirmaPagamento** (Webhook) - Recebe os dados do pagamento
2. **BuscaLead** (Opcional) - Busca dados na tabela `leads` do Supabase usando email
3. **FiltraDados** - Processa e valida os dados
4. **DadosCliente** - Prepara dados do cliente (do webhook ou da tabela `leads`)
5. **VerificaNumeroWhats** - Valida número WhatsApp
6. **GeraSenhaAleatoria** - Gera senha segura
7. **CriaConta** - Cria conta no Supabase via API (auth.users)
8. **AtualizaInfoUser** - Atualiza perfil do usuário na tabela `profiles`
9. **AtualizaLead** - Atualiza o lead com `user_id` e `subscription_status = 'confirmed'`
10. **EnviaWhatsapp** - Envia credenciais via WhatsApp
11. **EnviaEmail** - Envia credenciais via Email

**Nota:** O n8n pode buscar dados da tabela `leads` usando o email do webhook, garantindo que todos os dados do cadastro sejam usados na criação da conta.

## 📊 Estrutura de Dados

### Tabela `leads` (Supabase) - Pré-cadastros

```sql
{
  "id": "uuid",
  "nome": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "whatsapp": "5511999999999",
  "cpf": "000.000.000-00",
  "plan": "premium",
  "subscription_status": "pending",
  "payment_id": null,
  "user_id": null,
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "processed_at": null
}
```

**Status possíveis:**
- `pending`: Aguardando pagamento
- `confirmed`: Pagamento confirmado, conta criada
- `failed`: Pagamento falhou

### Tabela `profiles` (Supabase) - Usuários criados após pagamento

```sql
{
  "id": "uuid (auth.users.id)",
  "nome": "João Silva",
  "email": "joao@email.com",
  "phone": "(11) 99999-9999",
  "whatsapp": "5511999999999",
  "subscription_status": "active",
  "currency": "BRL",
  "locale": "pt-BR",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 🔐 Segurança

1. **Dados sensíveis** não são expostos no frontend
2. **Senha** é gerada pelo n8n (não enviada do frontend)
3. **Webhook** deve validar origem (em produção)
4. **Dados** são criptografados no Supabase

## 🧪 Testando o Fluxo

### 1. Teste Local

```bash
# 1. Acesse a landing page
http://localhost:8080/landing

# 2. Clique em "Começar Agora"
# 3. Preencha o formulário
# 4. Clique em "Continuar para Pagamento"
# 5. Verifique no console do navegador os logs
# 6. Verifique no Supabase se os dados foram salvos
```

### 2. Teste com n8n

```bash
# 1. Certifique-se que o n8n está rodando
# 2. Verifique a URL do webhook no n8n
# 3. Configure a variável de ambiente:
VITE_N8N_WEBHOOK_URL=https://n8n.alfredoo.online/webhook-test/confirma-pagamento

# 4. Execute o fluxo completo
# 5. Verifique os logs do n8n
# 6. Verifique se a conta foi criada no Supabase
# 7. Verifique se WhatsApp e Email foram enviados
```

## 📝 Variáveis de Ambiente

Adicione no `.env` ou na Vercel:

```env
VITE_N8N_BASE_URL=https://n8n.alfredoo.online
VITE_N8N_WEBHOOK_URL=https://n8n.alfredoo.online/webhook-test/confirma-pagamento
```

## ✅ Checklist de Implementação

- [x] Landing page criada
- [x] Página de cadastro criada
- [x] Integração com Supabase (salvar dados)
- [x] Integração com n8n (webhook de confirmação)
- [x] Página de sucesso atualizada
- [x] Rotas adicionadas no App.tsx
- [ ] Configurar gateway de pagamento real (Asaas)
- [ ] Testar fluxo completo end-to-end
- [ ] Configurar variáveis de ambiente na Vercel

## 🐛 Troubleshooting

### Problema: Dados não são salvos no Supabase

**Solução:**
1. Execute a migração SQL para criar a tabela `leads`:
   ```sql
   -- Execute o arquivo: supabase/migrations/20250111000000_create_leads_table.sql
   ```
2. Verifique se a tabela `leads` existe e tem as políticas RLS corretas
3. Verifique os logs do console do navegador
4. A tabela `leads` permite inserção sem autenticação (pública)

### Problema: Webhook n8n não é chamado

**Solução:**
1. Verifique a URL do webhook no n8n
2. Verifique a variável `VITE_N8N_WEBHOOK_URL`
3. Verifique os logs do console do navegador
4. Teste o webhook manualmente com Postman/curl

### Problema: Conta não é criada após pagamento

**Solução:**
1. Verifique os logs do n8n
2. Verifique se o workflow está ativo
3. Verifique se a API do Supabase está configurada corretamente no n8n
4. Verifique se os dados estão sendo enviados corretamente

---

**Última atualização:** 2025-01-27


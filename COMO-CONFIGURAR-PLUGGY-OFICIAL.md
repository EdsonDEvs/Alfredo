# 🔧 Configuração Pluggy - Seguindo Documentação Oficial

Baseado na [documentação oficial da Pluggy](https://docs.pluggy.ai/docs/quick-pluggy-introduction), este guia mostra como configurar corretamente.

## 📋 Passo a Passo Oficial

### 1️⃣ Criar Conta e Aplicação

1. Acesse: https://dashboard.pluggy.ai
2. Crie uma conta e faça login
3. Vá para **"Aplicações"** (Applications)
4. Clique em **"Nova"** (New) para criar uma aplicação
5. Você receberá:
   - **CLIENT_ID**: `c5fd14a9-f1ac-444c-a208-fcd3d5029e9e`
   - **CLIENT_SECRET**: `3f7db9a7-7d55-4a3f-94be-ce87aa47c788`

### 2️⃣ Configurar Credenciais no Projeto

Adicione no arquivo `.env.local` (na raiz do projeto):

```env
# Pluggy Open Finance
VITE_PLUGGY_CLIENT_ID=c5fd14a9-f1ac-444c-a208-fcd3d5029e9e
VITE_PLUGGY_CLIENT_SECRET=3f7db9a7-7d55-4a3f-94be-ce87aa47c788
```

**⚠️ IMPORTANTE:**
- Use o prefixo `VITE_` para que o Vite reconheça as variáveis
- Não deixe espaços antes ou depois do `=`
- Use seus valores reais do dashboard

### 3️⃣ Como Funciona a Autenticação

Conforme a [documentação oficial](https://docs.pluggy.ai/docs/use-our-sdks-to-authenticate):

1. **Client ID e Secret** → Autenticar na API Pluggy
2. **Endpoint `/auth`** → Gera uma `apiKey` temporária (expira em 2 horas)
3. **apiKey** → Usada no header `X-API-KEY` para todas as requisições

```javascript
// 1. Autenticar
POST https://api.pluggy.ai/auth
Body: { clientId, clientSecret }
Response: { apiKey }

// 2. Usar apiKey em todas as requisições
GET https://api.pluggy.ai/items
Headers: { "X-API-KEY": apiKey }
```

### 4️⃣ Reiniciar o Servidor

Após configurar as credenciais:

```bash
# Pare o servidor (Ctrl+C)
# Reinicie
npm run dev
```

### 5️⃣ Testar

1. Abra o Dashboard
2. Clique em "Conectar Conta Bancária"
3. Verifique o console - deve aparecer:
   ```
   ✅ Usando Client ID e Client Secret para autenticação
   🔄 Autenticando na Pluggy com Client ID e Secret...
   ✅ API Key temporária gerada com sucesso
   ```

## 🔒 Segurança

Conforme a documentação oficial, é recomendado:
- ✅ Manter Client ID e Secret no backend (não expor no frontend)
- ✅ Gerar apiKey no backend usando uma Edge Function
- ⚠️ **ATENÇÃO**: No nosso caso, estamos usando no frontend apenas para desenvolvimento

Para produção, você deve criar uma Supabase Edge Function para gerar a apiKey no backend.

## 📚 Referências

- [Documentação Oficial Pluggy](https://docs.pluggy.ai/docs/quick-pluggy-introduction)
- [Obter API Keys](https://docs.pluggy.ai/docs/get-your-api-keys)
- [Autenticação com SDKs](https://docs.pluggy.ai/docs/use-our-sdks-to-authenticate)
- [Pluggy Connect Widget](https://docs.pluggy.ai/docs/pluggy-connect-introduction)

## ✅ Checklist

- [ ] Conta criada no dashboard Pluggy
- [ ] Aplicação criada (CLIENT_ID e CLIENT_SECRET obtidos)
- [ ] Variáveis configuradas no `.env.local` com prefixo `VITE_`
- [ ] Servidor reiniciado após adicionar variáveis
- [ ] Teste de conexão realizado com sucesso


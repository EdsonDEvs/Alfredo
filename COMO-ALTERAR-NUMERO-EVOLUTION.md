# 📱 Como Alterar o Número na Evolution API

## 🎯 Visão Geral

Este guia explica como alterar o número do WhatsApp conectado na Evolution API através do painel do Alfredoo.

## 🔄 Método 1: Desconectar e Reconectar (Recomendado)

### Passo 1: Desconectar o Número Atual

1. **Acesse o painel da Evolution API** (onde você vê o status "Connected")
2. **Clique no botão "DISCONNECT"** (botão vermelho no canto inferior direito)
3. **Aguarde a confirmação** de que o número foi desconectado
4. O status mudará de "Connected" (verde) para "Disconnected"

### Passo 2: Conectar um Novo Número

1. **Após desconectar**, você verá opções para conectar um novo número
2. **Clique em "CONNECT"** ou similar
3. **Escaneie o QR Code** com seu WhatsApp:
   - Abra o WhatsApp no celular
   - Vá em **Configurações** > **Aparelhos conectados** > **Conectar um aparelho**
   - Escaneie o QR Code exibido no painel
4. **Aguarde a conexão** - o status mudará para "Connected"

## 🔄 Método 2: Usar o Botão RESTART

Se você quiser reiniciar a conexão com o mesmo número:

1. **Clique no botão "RESTART"** (botão verde)
2. **Aguarde** alguns segundos
3. Se necessário, **escaneie o QR Code novamente**
4. O número será reconectado

## 🔄 Método 3: Alterar via API (Avançado)

Se você tem acesso à API da Evolution, pode alterar via requisições HTTP:

### Desconectar o Número Atual

```bash
curl -X DELETE \
  'https://sua-evolution-api.com/instance/disconnect/NOME_DA_INSTANCIA' \
  -H 'apikey: SUA_API_KEY'
```

### Criar Nova Instância com Novo Número

```bash
curl -X POST \
  'https://sua-evolution-api.com/instance/create' \
  -H 'Content-Type: application/json' \
  -H 'apikey: SUA_API_KEY' \
  -d '{
    "instanceName": "alfredoo",
    "token": "SEU_TOKEN",
    "qrcode": true
  }'
```

### Conectar via QR Code

1. **Obter o QR Code**:
```bash
curl -X GET \
  'https://sua-evolution-api.com/instance/connect/alfredoo' \
  -H 'apikey: SUA_API_KEY'
```

2. **Escaneie o QR Code** com o WhatsApp
3. **Aguarde a conexão**

## 📋 Verificar Status da Conexão

Para verificar se o número foi alterado com sucesso:

1. **Verifique o status** no painel (deve estar "Connected")
2. **Verifique o número** exibido (ex: `553171935641@s.whatsapp.net`)
3. **Teste enviando uma mensagem** para o número conectado

## ⚠️ Importantes Considerações

### Antes de Alterar o Número

- ✅ **Backup dos dados**: Certifique-se de que os dados importantes estão salvos
- ✅ **Notificar usuários**: Se o número for público, notifique os usuários sobre a mudança
- ✅ **Atualizar configurações**: Atualize todas as configurações que usam o número antigo

### Após Alterar o Número

- ✅ **Atualizar webhooks**: Atualize os webhooks no n8n (se aplicável)
- ✅ **Atualizar variáveis de ambiente**: Atualize as variáveis que referenciam o número
- ✅ **Testar integração**: Teste todas as funcionalidades que usam o WhatsApp

## 🔧 Atualizar Configurações no Projeto

Após alterar o número na Evolution API, você pode precisar atualizar:

### 1. Variáveis de Ambiente

Se você usa variáveis de ambiente para o número:

```env
# .env ou variáveis de ambiente
WHATSAPP_NUMBER=5531999999999
WHATSAPP_INSTANCE=alfredoo
EVOLUTION_API_KEY=sua_api_key
EVOLUTION_API_URL=https://sua-evolution-api.com
```

### 2. Configurações no n8n

Se você usa n8n para integração:

1. Acesse o workflow do n8n
2. Atualize o número nas configurações do WhatsApp
3. Teste o workflow

### 3. Código do Projeto

Se o número está hardcoded no código, procure por:

```typescript
// Exemplo de onde pode estar
const whatsappNumber = '553171935641';
const whatsappId = '553171935641@s.whatsapp.net';
```

## 🐛 Solução de Problemas

### Problema: Não consigo desconectar

**Solução:**
1. Verifique se você tem permissões de administrador
2. Tente usar o botão "RESTART" primeiro
3. Se não funcionar, reinicie a instância da Evolution API

### Problema: QR Code não aparece

**Solução:**
1. Verifique se a instância foi criada corretamente
2. Limpe o cache do navegador
3. Tente gerar um novo QR Code

### Problema: Não consegue escanear o QR Code

**Solução:**
1. Certifique-se de que o WhatsApp está atualizado
2. Verifique se o celular tem conexão com a internet
3. Tente gerar um novo QR Code (eles expiram após alguns minutos)

### Problema: Número não conecta

**Solução:**
1. Verifique se o número não está conectado em outro dispositivo
2. Verifique se a Evolution API está rodando corretamente
3. Verifique os logs da Evolution API para erros

## 📞 Formato do Número

O número deve estar no formato:
- **Com código do país**: `553171935641` (55 = Brasil, 31 = DDD, 71935641 = número)
- **Sem caracteres especiais**: Sem espaços, parênteses ou hífens
- **Com @s.whatsapp.net**: Quando conectado, aparecerá como `553171935641@s.whatsapp.net`

## 🔐 Segurança

- ✅ **Nunca compartilhe sua API Key** publicamente
- ✅ **Use HTTPS** para todas as conexões
- ✅ **Mantenha o token seguro** e não o exponha no código
- ✅ **Revise as permissões** antes de conectar um número

## 📚 Referências

- [Documentação da Evolution API](https://doc.evolution-api.com/)
- [Guia de Integração WhatsApp](docs/INTEGRACAO_WHATSAPP_COMPLETA.md)
- [Configuração do n8n](docs/INTEGRACAO_N8N_COMPLETA.md)

---

**Última atualização:** 2025-01-11

**Nota:** Este guia é baseado na interface padrão da Evolution API. Se sua instalação tiver diferenças, ajuste os passos conforme necessário.


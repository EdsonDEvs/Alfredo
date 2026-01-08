# ⚡ Guia Rápido: Alterar Número na Evolution API

## 🎯 Método Mais Simples (Interface Web)

### Passo 1: Desconectar o Número Atual

1. **No painel da Evolution API**, localize o botão **"DISCONNECT"** (vermelho, canto inferior direito)
2. **Clique em "DISCONNECT"**
3. **Aguarde** a confirmação - o status mudará de "Connected" (verde) para "Disconnected"

### Passo 2: Conectar Novo Número

1. **Após desconectar**, você verá opções para conectar
2. **Gere um novo QR Code** (se necessário, clique em "RESTART" ou similar)
3. **Escaneie o QR Code** com o WhatsApp:
   - Abra o WhatsApp no celular
   - Vá em **Configurações** → **Aparelhos conectados** → **Conectar um aparelho**
   - Escaneie o QR Code exibido no painel
4. **Aguarde** - O status mudará para "Connected" (verde)
5. **Verifique** o número exibido (ex: `5531999999999@s.whatsapp.net`)

## 🔄 Alternativa: Usar RESTART

Se você só quer reconectar o mesmo número:

1. **Clique no botão "RESTART"** (verde)
2. **Aguarde** alguns segundos
3. Se necessário, **escaneie o QR Code novamente**

## 📱 Formato do Número

O número deve estar no formato:
- **Com código do país**: `5531999999999` (55 = Brasil)
- **Sem caracteres especiais**: Sem espaços, parênteses ou hífens
- **Quando conectado**: Aparecerá como `5531999999999@s.whatsapp.net`

## ⚠️ Importante

### Antes de Alterar:
- ✅ Certifique-se de que não há mensagens importantes pendentes
- ✅ Notifique usuários se o número for público
- ✅ Anote o número antigo caso precise

### Após Alterar:
- ✅ Verifique se o status está "Connected"
- ✅ Teste enviando uma mensagem de teste
- ✅ Atualize configurações que referenciam o número antigo

## 🐛 Problemas Comuns

### QR Code não aparece
- Limpe o cache do navegador
- Tente gerar um novo QR Code
- Verifique se a instância está rodando

### Não consegue escanear
- Certifique-se de que o WhatsApp está atualizado
- Verifique a conexão com a internet
- Gere um novo QR Code (eles expiram)

### Número não conecta
- Verifique se o número não está conectado em outro dispositivo
- Verifique os logs da Evolution API
- Tente desconectar e conectar novamente

## 📞 Número Atual

Com base na imagem, seu número atual é:
- **Número**: `553171935641`
- **Formato completo**: `553171935641@s.whatsapp.net`
- **Status**: Connected (verde)

## 🔐 Segurança da API Key

- ⚠️ **Nunca compartilhe** sua API Key publicamente
- ⚠️ **Não exponha** o token no código
- ⚠️ **Use HTTPS** para todas as conexões

---

**Dica:** Se você precisar alterar o número frequentemente, considere usar a API da Evolution para automatizar o processo.


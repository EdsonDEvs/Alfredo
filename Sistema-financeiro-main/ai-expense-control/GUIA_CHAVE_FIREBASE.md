# 🔧 Guia para Configurar a Chave Privada do Firebase

## ❌ Problema Atual
O erro `FirebaseAppError: Failed to parse private key: Error: Invalid PEM formatted message.` indica que a chave privada do Firebase não está formatada corretamente no arquivo `.env`.

## ✅ Solução Passo a Passo

### 1. Obter as Credenciais do Firebase

1. **Acesse o Firebase Console:**
   - Vá para https://console.firebase.google.com/
   - Selecione seu projeto

2. **Gerar Nova Chave Privada:**
   - Clique na engrenagem ⚙️ (Configurações do projeto)
   - Vá para a aba "Contas de serviço"
   - Clique em "Gerar nova chave privada"
   - Baixe o arquivo JSON

3. **Extrair as Informações:**
   - Abra o arquivo JSON baixado
   - Anote:
     - `project_id`
     - `private_key`
     - `client_email`

### 2. Configurar o Arquivo .env

1. **Abra o arquivo `.env`** na pasta `ai-expense-control`

2. **Substitua as seguintes linhas:**

```env
# Antes (exemplo)
FIREBASE_PROJECT_ID=seu-projeto-firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@seu-projeto.iam.gserviceaccount.com

# Depois (com seus dados reais)
FIREBASE_PROJECT_ID=lfredo-finance
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIICXgIBAAKCAQEAt...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@lfredo-finance.iam.gserviceaccount.com
```

### 3. Formatação Correta da Chave Privada

**⚠️ IMPORTANTE:** A chave privada precisa de formatação especial:

1. **Copie a chave privada completa** do arquivo JSON (incluindo `-----BEGIN PRIVATE KEY-----` e `-----END PRIVATE KEY-----`)

2. **Substitua todas as quebras de linha reais por `\\n`**

3. **Mantenha as aspas duplas**

**Exemplo de formatação:**

```env
# ❌ ERRADO (quebras de linha reais)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIICXgIBAAKCAQEAt...
-----END PRIVATE KEY-----"

# ✅ CORRETO (\\n para quebras de linha)
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nMIICXgIBAAKCAQEAt...\\n-----END PRIVATE KEY-----\\n"
```

### 4. Script de Formatação Automática

Execute o script para formatar automaticamente:

```bash
node fix-firebase-key.js
```

### 5. Testar a Configuração

1. **Salve o arquivo `.env`**

2. **Teste o servidor:**
```bash
npm run dev
```

3. **Verifique se não há erros de Firebase**

## 🔍 Verificação

Se tudo estiver correto, você verá:
```
✅ Firebase Admin SDK inicializado
🚀 Servidor rodando na porta 3001
```

Se ainda houver erro, verifique:
- A chave privada está completa?
- As quebras de linha foram substituídas por `\\n`?
- As aspas duplas estão presentes?

## 📞 Suporte

Se ainda tiver problemas:
1. Verifique se o projeto Firebase está ativo
2. Confirme se a conta de serviço tem permissões adequadas
3. Teste com uma nova chave privada

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/)
- [Documentação Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Guia de Configuração](https://firebase.google.com/docs/admin/setup#initialize-sdk)

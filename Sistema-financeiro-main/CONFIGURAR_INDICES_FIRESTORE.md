# 🔥 Configurar Índices do Firestore

## Problema
O erro "The query requires an index" indica que o Firestore precisa de índices compostos para as consultas que usam `where` + `orderBy`.

## Solução

### 1. Acesse o Firebase Console
- Vá para: https://console.firebase.google.com/
- Selecione seu projeto: `alfredo-dc3`

### 2. Configure os Índices
1. No menu lateral, clique em **"Firestore Database"**
2. Clique na aba **"Índices"**
3. Clique em **"Criar índice"**

### 3. Crie os Índices Necessários

#### Índice 1: Transações
- **Coleção:** `transacoes`
- **Campos:**
  - `userid` (Ascending)
  - `quando` (Descending)
- **Clique em "Criar"**

#### Índice 2: Categorias
- **Coleção:** `categorias`
- **Campos:**
  - `userid` (Ascending)
  - `nome` (Ascending)
- **Clique em "Criar"**

#### Índice 3: Lembretes
- **Coleção:** `lembretes`
- **Campos:**
  - `userid` (Ascending)
  - `data` (Ascending)
- **Clique em "Criar"**

### 4. Aguarde a Criação
- Os índices levam alguns minutos para serem criados
- Você verá o status "Criando" → "Ativo"

### 5. Teste a Aplicação
- Recarregue a página do Dashboard
- Clique em "Inserir Dados de Exemplo"
- Os gráficos devem aparecer com dados!

## Alternativa Rápida
Se preferir, você pode clicar diretamente no link do erro no Dashboard para criar o índice automaticamente.

## Resultado Esperado
Após criar os índices, o Dashboard deve:
- ✅ Carregar dados sem erros
- ✅ Mostrar gráficos com dados de exemplo
- ✅ Permitir inserção de novos dados


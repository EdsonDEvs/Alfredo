# 📊 Importação de Planilhas Excel

## 📋 Visão Geral

Sistema completo de importação de planilhas Excel para migração de dados financeiros. Permite que usuários importem suas transações de planilhas Excel (.xlsx, .xls) ou CSV diretamente para o sistema.

## ✨ Funcionalidades

### 1. **Importação de Planilhas**
   - Suporte para arquivos Excel (.xlsx, .xls) e CSV
   - Validação automática de dados
   - Mapeamento inteligente de colunas
   - Importação em lote (até 1000 transações por vez)

### 2. **Template de Planilha**
   - Template disponível para download
   - Formato padronizado
   - Exemplos de dados incluídos

### 3. **Validação e Processamento**
   - Validação de campos obrigatórios
   - Conversão automática de formatos
   - Tratamento de erros robusto
   - Feedback visual do progresso

## 🚀 Como Usar

### 1. **Acessar Importação**
   - No Dashboard, clique no botão **"Importar Planilha"**
   - Um diálogo será aberto

### 2. **Baixar Template (Opcional)**
   - Clique em **"Baixar Template"** para ver o formato esperado
   - O arquivo `template_transacoes.xlsx` será baixado

### 3. **Preparar Planilha**
   - Organize seus dados no formato:
     - **Data**: Data da transação (DD/MM/YYYY ou YYYY-MM-DD)
     - **Estabelecimento**: Nome do local/estabelecimento
     - **Valor**: Valor da transação (número)
     - **Tipo**: Receita ou Despesa (opcional)
     - **Detalhes**: Observações adicionais (opcional)

### 4. **Importar**
   - Clique em **"Selecionar Arquivo"**
   - Escolha sua planilha
   - Aguarde o processamento
   - Veja o resultado da importação

## 📝 Formato da Planilha

### Colunas Aceitas

O sistema reconhece automaticamente várias variações de nomes de colunas:

#### Data
- `Data`, `Date`, `quando`, `Dia`

#### Estabelecimento
- `Estabelecimento`, `Local`, `Loja`, `Descrição`, `Descricao`, `Description`

#### Valor
- `Valor`, `Value`, `Amount`, `Preço`, `Preco`, `Price`

#### Tipo
- `Tipo`, `Type`, `Categoria`, `Category`

#### Detalhes
- `Detalhes`, `Details`, `Observação`, `Observacao`, `Notes`, `Notas`

### Exemplo de Planilha

| Data | Estabelecimento | Valor | Tipo | Detalhes |
|------|----------------|-------|------|----------|
| 2025-01-15 | Supermercado | 150.50 | Despesa | Compras do mês |
| 2025-01-16 | Salário | 5000.00 | Receita | Salário mensal |
| 2025-01-17 | Posto de Gasolina | 200.00 | Despesa | Abastecimento |

## 🔧 Detalhes Técnicos

### Processamento de Dados

1. **Leitura do Arquivo**
   - Arquivo é lido usando biblioteca `xlsx`
   - Primeira planilha é processada
   - Dados são convertidos para JSON

2. **Mapeamento de Colunas**
   - Nomes de colunas são normalizados (sem acentos, espaços)
   - Mapeamento automático para formato do sistema
   - Validação de colunas obrigatórias

3. **Validação e Conversão**
   - **Data**: Converte vários formatos para YYYY-MM-DD
   - **Valor**: Remove caracteres não numéricos, converte para número
   - **Tipo**: Detecta receita/despesa automaticamente
   - **Estabelecimento**: Valida que não está vazio

4. **Importação**
   - Transações são importadas em lotes de 1000
   - Cada lote é processado separadamente
   - Erros são coletados e reportados

### Tratamento de Erros

- **Arquivo inválido**: Formato não suportado
- **Colunas faltando**: Data, Estabelecimento ou Valor não encontrados
- **Dados inválidos**: Linhas com dados incorretos são ignoradas
- **Erros de importação**: Erros são coletados e exibidos ao usuário

## 📊 Interface do Usuário

### Componente ExcelImporter

- **Dialog**: Modal para importação
- **Template Download**: Botão para baixar template
- **File Upload**: Seleção de arquivo
- **Progress Bar**: Indicador de progresso
- **Result Display**: Resultado da importação com estatísticas

### Feedback Visual

- ✅ **Sucesso**: Transações importadas com sucesso
- ⚠️ **Avisos**: Erros durante importação
- ❌ **Erros**: Falhas críticas

## 🎯 Casos de Uso

### Migração de Dados
- Cliente que organizava gastos no Excel
- Importar histórico completo de transações
- Migrar para o sistema sem perder dados

### Backup e Restauração
- Exportar dados do Excel
- Importar de volta no sistema
- Manter sincronização entre sistemas

### Integração com Outros Sistemas
- Exportar de outros softwares
- Importar no sistema
- Unificar dados financeiros

## 🔍 Validações Implementadas

### Campos Obrigatórios
- ✅ Data (não pode estar vazia)
- ✅ Estabelecimento (não pode estar vazio)
- ✅ Valor (deve ser um número válido)

### Conversões Automáticas
- ✅ Data: DD/MM/YYYY, YYYY-MM-DD, Excel serial
- ✅ Valor: Remove símbolos, converte vírgula para ponto
- ✅ Tipo: Detecta receita/despesa por palavras-chave

### Limites
- ✅ Máximo 1000 transações por lote
- ✅ Múltiplos lotes processados automaticamente
- ✅ Sem limite total de transações

## 📝 Exemplo de Código

### Usar o Componente

```tsx
import { ExcelImporter } from '@/components/dashboard/ExcelImporter'

function MyComponent() {
  const handleImportComplete = () => {
    // Atualizar lista de transações
    fetchData()
  }

  return (
    <ExcelImporter onImportComplete={handleImportComplete} />
  )
}
```

### Usar o Serviço Diretamente

```tsx
import { readExcelFile } from '@/services/excelImporter'
import { TransacoesService } from '@/services/transacoes'

async function importFile(file: File, userId: string) {
  // Ler arquivo
  const transactions = await readExcelFile(file)
  
  // Importar
  const result = await TransacoesService.importTransacoes(userId, transactions)
  
  console.log(`Importadas: ${result.success}`)
  console.log(`Erros: ${result.errors.length}`)
}
```

## 🐛 Troubleshooting

### Arquivo não é reconhecido
- Verifique se o arquivo é .xlsx, .xls ou .csv
- Certifique-se de que a primeira planilha contém os dados

### Colunas não encontradas
- Verifique os nomes das colunas
- Use o template como referência
- O sistema aceita variações de nomes

### Dados não importados
- Verifique se Data, Estabelecimento e Valor estão preenchidos
- Verifique formato de data (DD/MM/YYYY ou YYYY-MM-DD)
- Verifique se valores são números válidos

### Erros durante importação
- Verifique conexão com banco de dados
- Verifique permissões do usuário
- Verifique logs no console

## ✨ Próximas Melhorias

1. **Preview de Dados**: Visualizar dados antes de importar
2. **Mapeamento Manual**: Permitir mapear colunas manualmente
3. **Validação Avançada**: Validações mais específicas
4. **Importação Incremental**: Atualizar apenas transações novas
5. **Suporte a Mais Formatos**: JSON, XML, etc.

## 🎉 Conclusão

Sistema de importação de planilhas **totalmente funcional**!

- ✅ Suporte a Excel e CSV
- ✅ Mapeamento automático de colunas
- ✅ Validação robusta
- ✅ Importação em lote
- ✅ Feedback visual completo
- ✅ Template disponível

**Agora você pode migrar seus dados do Excel para o sistema facilmente!** 📊


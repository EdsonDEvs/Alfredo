# 🌍 Internacionalização e Suporte a Múltiplas Moedas

## 📋 Visão Geral

O sistema agora suporta múltiplas moedas (BRL, USD, EUR) permitindo que usuários de diferentes países utilizem o sistema com suas moedas locais.

## ✨ Funcionalidades Implementadas

### 1. **Suporte a Múltiplas Moedas**
   - 🇧🇷 Real Brasileiro (BRL) - Padrão
   - 🇺🇸 US Dollar (USD)
   - 🇪🇺 Euro (EUR)

### 2. **Formatação Automática**
   - Todos os valores são formatados automaticamente conforme a moeda selecionada
   - Suporte a diferentes formatos de número (vírgula/ponto decimal)
   - Locale automático baseado na moeda

### 3. **Persistência de Preferências**
   - A moeda preferida do usuário é salva no banco de dados
   - As preferências são carregadas automaticamente ao fazer login
   - Mudanças são sincronizadas em tempo real

## 🗄️ Estrutura do Banco de Dados

### Migration: `20250110000000_add_currency_locale_to_profiles.sql`

Adiciona os campos `currency` e `locale` na tabela `profiles`:

```sql
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'BRL' CHECK (currency IN ('BRL', 'USD', 'EUR')),
ADD COLUMN IF NOT EXISTS locale TEXT DEFAULT 'pt-BR' CHECK (locale IN ('pt-BR', 'en-US', 'en-GB', 'de-DE', 'fr-FR', 'es-ES', 'it-IT', 'pt-PT'));
```

## 🚀 Como Usar

### 1. **Executar a Migration**

Execute a migration no Supabase SQL Editor:

```sql
-- Execute o arquivo: supabase/migrations/20250110000000_add_currency_locale_to_profiles.sql
```

### 2. **Configurar Moeda no Perfil**

1. Acesse a página de **Perfil**
2. Role até a seção **"Moeda e Localização"**
3. Selecione sua moeda preferida
4. A mudança é salva automaticamente

### 3. **Uso em Componentes**

Os componentes que usam `formatCurrency` automaticamente utilizam a moeda do usuário:

```tsx
import { formatCurrency } from '@/utils/currency'
import { useCurrency } from '@/hooks/useCurrency'

function MeuComponente() {
  const { currency, locale } = useCurrency()
  const valor = 1234.56
  
  // Formatação automática com a moeda do usuário
  return <div>{formatCurrency(valor)}</div>
}
```

### 4. **CurrencyInput Component**

O componente `CurrencyInput` automaticamente adapta-se à moeda do usuário:

```tsx
import { CurrencyInput } from '@/components/ui/currency-input'

function MeuFormulario() {
  const [valor, setValor] = useState(0)
  
  return (
    <CurrencyInput
      value={valor}
      onChange={(value) => setValor(value)}
      // Placeholder e formatação automáticos baseados na moeda
    />
  )
}
```

## 🔧 Arquitetura

### Hook: `useCurrency`

Gerencia o estado da moeda do usuário:

```tsx
const { currency, locale, setCurrency, setLocale, loading } = useCurrency()
```

### Context: `CurrencyProvider`

Wrapper que fornece o contexto de moeda para toda a aplicação.

### Utils: `currency.ts`

Funções de formatação que utilizam a moeda do contexto:

- `formatCurrency(value, currency?, locale?)` - Formata valores
- `parseCurrency(value, locale?)` - Converte strings para números
- `formatCurrencyInput(value, currency?, locale?)` - Formata input de moeda

## 📱 Componentes Atualizados

### ✅ Componentes que Funcionam Automaticamente

Todos os componentes que usam `formatCurrency` já estão funcionando com múltiplas moedas:

- ✅ Dashboard
- ✅ Transações
- ✅ Relatórios
- ✅ Metas
- ✅ Lembretes
- ✅ Gráficos
- ✅ Resumos financeiros

### 🆕 Novos Componentes

- **CurrencySelector** - Seletor de moeda no perfil
- **CurrencyProvider** - Provider de contexto de moeda

## 🌐 Locales Suportados

| Locale | Moeda Padrão | Formato |
|--------|-------------|---------|
| pt-BR | BRL | R$ 1.234,56 |
| en-US | USD | $1,234.56 |
| en-GB | USD | $1,234.56 |
| de-DE | EUR | 1.234,56 € |
| fr-FR | EUR | 1 234,56 € |
| es-ES | EUR | 1.234,56 € |
| it-IT | EUR | 1.234,56 € |
| pt-PT | EUR | 1.234,56 € |

## ⚠️ Importante

### Conversão de Valores

**⚠️ ATENÇÃO**: O sistema não faz conversão automática de valores entre moedas. Os valores são apenas formatados conforme a moeda selecionada.

Se um usuário brasileiro cadastra uma transação de R$ 100,00 e depois muda para USD, o valor será exibido como $100.00 (sem conversão).

### Valores Existentes

Valores já cadastrados no banco de dados continuam com seus valores numéricos originais. Apenas a formatação de exibição muda.

## 🧪 Testando

1. **Login como usuário**
2. **Acesse Perfil > Moeda e Localização**
3. **Altere a moeda para USD ou EUR**
4. **Navegue pelo sistema** e verifique se todos os valores estão formatados corretamente
5. **Crie uma nova transação** e verifique se o input de moeda usa o formato correto

## 🔄 Próximos Passos (Opcional)

1. **Conversão de Moedas**: Implementar API de conversão de moedas
2. **Mais Moedas**: Adicionar suporte a mais moedas (GBP, JPY, etc.)
3. **Detecção Automática**: Detectar moeda baseada na localização do usuário
4. **Histórico de Conversão**: Manter histórico de valores em moedas diferentes

## 📝 Notas Técnicas

- A moeda é salva no perfil do usuário no Supabase
- As funções de formatação são atualizadas automaticamente quando a moeda muda
- O sistema usa `Intl.NumberFormat` para formatação nativa do navegador
- Suporte a diferentes formatos de entrada (vírgula/ponto decimal)

## 🐛 Troubleshooting

### Moeda não está sendo salva
- Verifique se a migration foi executada
- Verifique as permissões RLS na tabela profiles
- Verifique o console do navegador para erros

### Formatação incorreta
- Verifique se o CurrencyProvider está envolvendo a aplicação
- Verifique se o hook useCurrency está sendo usado corretamente
- Limpe o cache do navegador

### Valores não aparecem formatados
- Verifique se está usando `formatCurrency` dos utils
- Verifique se o componente está dentro do CurrencyProvider
- Recarregue a página após alterar a moeda


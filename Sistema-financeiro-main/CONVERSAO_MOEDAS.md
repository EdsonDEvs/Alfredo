# 💱 Conversão Automática de Moedas

## 📋 Visão Geral

O sistema agora possui conversão automática de moedas em tempo real! Quando você seleciona uma moeda diferente (USD ou EUR), todos os valores armazenados em BRL são automaticamente convertidos e exibidos na moeda selecionada usando taxas de câmbio atualizadas.

## ✨ Funcionalidades

### 1. **Conversão Automática**
   - Valores armazenados em BRL são automaticamente convertidos para a moeda selecionada
   - Taxas de câmbio são atualizadas automaticamente a cada hora
   - Cache de taxas para melhor performance

### 2. **API de Conversão**
   - Usa ExchangeRate-API (gratuita)
   - Taxas atualizadas em tempo real
   - Fallback para taxas aproximadas em caso de erro

### 3. **Componentes Atualizados**
   - Dashboard: Estatísticas convertidas automaticamente
   - Gráficos: Valores convertidos nos gráficos
   - Transações: Valores exibidos na moeda selecionada
   - Relatórios: Todos os relatórios com conversão automática

## 🔧 Como Funciona

### Fluxo de Conversão

1. **Valores no Banco**: Todos os valores são armazenados em BRL (moeda padrão)
2. **Seleção de Moeda**: Usuário seleciona USD ou EUR no perfil
3. **Conversão Automática**: Sistema converte valores de BRL para a moeda selecionada
4. **Exibição**: Valores são formatados e exibidos na moeda selecionada

### Serviço de Conversão

O serviço `currencyConverter.ts` gerencia:
- Busca de taxas de câmbio da API
- Cache de taxas (válido por 1 hora)
- Conversão de valores entre moedas
- Atualização automática de taxas

### Hook useCurrency

O hook `useCurrency` fornece:
- `currency`: Moeda atual do usuário
- `locale`: Locale atual
- `convertValue(value, fromCurrency)`: Converte um valor
- `exchangeRatesLoading`: Status de carregamento das taxas
- `refreshRates()`: Atualiza taxas manualmente

### Hook useFormattedCurrency

O hook `useFormattedCurrency` fornece:
- `format(value, fromCurrency)`: Formata e converte um valor
- `convertValue(value, fromCurrency)`: Converte um valor
- `currency`: Moeda atual
- `locale`: Locale atual

## 📊 Exemplo de Uso

### Em Componentes

```tsx
import { useFormattedCurrency } from '@/hooks/useFormattedCurrency'

function MyComponent() {
  const { format, convertValue } = useFormattedCurrency()
  
  // Valor em BRL (do banco)
  const valorBRL = 1000
  
  // Formatar com conversão automática
  const valorFormatado = format(valorBRL) // Converte e formata
  
  // Converter sem formatar
  const valorConvertido = convertValue(valorBRL, 'BRL') // Retorna número
  
  return <div>{valorFormatado}</div>
}
```

### Em Gráficos

```tsx
import { useFormattedCurrency } from '@/hooks/useFormattedCurrency'

function ChartComponent({ transacoes }) {
  const { format, convertValue } = useFormattedCurrency()
  
  // Converter valores antes de exibir
  const dados = transacoes.map(t => ({
    ...t,
    valor: convertValue(t.valor, 'BRL') // Converte de BRL para moeda atual
  }))
  
  return (
    <BarChart data={dados}>
      <Tooltip formatter={(value) => format(value)} />
    </BarChart>
  )
}
```

## 🔄 Atualização de Taxas

### Automática
- Taxas são atualizadas automaticamente a cada hora
- Cache válido por 1 hora
- Atualização em background (não bloqueia a UI)

### Manual
```tsx
import { useCurrency } from '@/hooks/useCurrency'

function MyComponent() {
  const { refreshRates, exchangeRatesLoading } = useCurrency()
  
  const handleRefresh = async () => {
    await refreshRates()
  }
  
  return (
    <button onClick={handleRefresh} disabled={exchangeRatesLoading}>
      {exchangeRatesLoading ? 'Atualizando...' : 'Atualizar Taxas'}
    </button>
  )
}
```

## 🎯 Componentes Atualizados

### ✅ Dashboard
- `DashboardStats`: Estatísticas convertidas
- `DashboardCharts`: Gráficos com valores convertidos
- `DashboardFilters`: Filtros funcionando com conversão

### ✅ Transações
- Lista de transações com valores convertidos
- Formulário de transações (valores são salvos em BRL)

### ✅ Relatórios
- Relatórios com valores convertidos
- Gráficos com conversão automática

## 📝 Notas Importantes

### Valores no Banco
- **Todos os valores são armazenados em BRL**
- A conversão é feita apenas na exibição
- Valores não são alterados no banco de dados

### Taxas de Câmbio
- Taxas são atualizadas a cada hora
- Cache de 1 hora para melhor performance
- Fallback para taxas aproximadas em caso de erro

### Performance
- Conversão é síncrona (usa cache)
- Não há delay na exibição
- Taxas são carregadas em background

## 🚀 Próximos Passos

### Melhorias Futuras
1. **Histórico de Taxas**: Armazenar histórico de taxas
2. **Notificações**: Alertar sobre mudanças significativas nas taxas
3. **Múltiplas Moedas**: Permitir transações em diferentes moedas
4. **API Premium**: Usar API premium para taxas mais precisas

### Configuração
1. **API Key**: Adicionar suporte para API key (opcional)
2. **Taxas Customizadas**: Permitir definir taxas manualmente
3. **Cache Persistente**: Salvar cache no localStorage

## 🐛 Troubleshooting

### Taxas não atualizam
- Verifique conexão com a internet
- Verifique se a API está acessível
- Verifique o console para erros

### Valores não convertem
- Verifique se a moeda foi selecionada no perfil
- Verifique se o hook está sendo usado corretamente
- Verifique o console para erros

### Performance
- Cache está funcionando? (verificar console)
- Taxas estão sendo carregadas? (verificar network tab)
- Muitas conversões simultâneas? (otimizar com useMemo)


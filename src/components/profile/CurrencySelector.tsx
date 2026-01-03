import { useCurrency } from '@/hooks/useCurrency'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Globe } from 'lucide-react'

export function CurrencySelector() {
  const { currency, locale, setCurrency, loading } = useCurrency()

  const currencies = [
    { value: 'BRL' as const, label: 'Real Brasileiro (R$)', flag: '🇧🇷', locale: 'pt-BR' as const },
    { value: 'USD' as const, label: 'US Dollar ($)', flag: '🇺🇸', locale: 'en-US' as const },
    { value: 'EUR' as const, label: 'Euro (€)', flag: '🇪🇺', locale: 'en-GB' as const },
  ]

  const handleCurrencyChange = async (newCurrency: 'BRL' | 'USD' | 'EUR') => {
    await setCurrency(newCurrency)
  }

  const currentCurrency = currencies.find(c => c.value === currency)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <CardTitle>Moeda e Localização</CardTitle>
        </div>
        <CardDescription>
          Configure sua moeda preferida para exibição de valores financeiros
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <Select
            value={currency}
            onValueChange={handleCurrencyChange}
            disabled={loading}
          >
            <SelectTrigger id="currency">
              <SelectValue>
                {currentCurrency && (
                  <div className="flex items-center gap-2">
                    <span>{currentCurrency.flag}</span>
                    <span>{currentCurrency.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {currencies.map((curr) => (
                <SelectItem key={curr.value} value={curr.value}>
                  <div className="flex items-center gap-2">
                    <span>{curr.flag}</span>
                    <span>{curr.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Todos os valores serão convertidos e exibidos nesta moeda usando taxas de câmbio em tempo real.
          </p>
        </div>

        <div className="rounded-md bg-muted p-4">
          <p className="text-sm font-medium mb-2">Exemplo de formatação:</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: currency,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(1234.56)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Valor de exemplo: 1234.56
          </p>
        </div>
      </CardContent>
    </Card>
  )
}


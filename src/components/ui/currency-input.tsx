
import React, { forwardRef } from 'react'
import { Input } from '@/components/ui/input'
import { formatCurrencyInput, parseCurrency } from '@/utils/currency'
import { useCurrency } from '@/hooks/useCurrency'
import { cn } from '@/lib/utils'

interface CurrencyInputProps extends Omit<React.ComponentProps<"input">, "onChange" | "value"> {
  value?: string | number
  onChange?: (value: number) => void
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const { currency, locale } = useCurrency()
    const [displayValue, setDisplayValue] = React.useState('')

    React.useEffect(() => {
      if (value !== undefined) {
        const numValue = typeof value === 'string' ? parseFloat(value) : value
        if (!isNaN(numValue)) {
          setDisplayValue(formatCurrencyInput((numValue * 100).toString(), currency, locale))
        }
      }
    }, [value, currency, locale])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formatted = formatCurrencyInput(inputValue, currency, locale)
      setDisplayValue(formatted)
      
      if (onChange) {
        const numericValue = parseCurrency(formatted, locale)
        onChange(numericValue)
      }
    }

    // Gerar placeholder baseado na moeda
    const placeholder = React.useMemo(() => {
      return formatCurrencyInput('0', currency, locale)
    }, [currency, locale])

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        className={cn(className)}
        placeholder={placeholder}
      />
    )
  }
)

CurrencyInput.displayName = "CurrencyInput"

export { CurrencyInput }

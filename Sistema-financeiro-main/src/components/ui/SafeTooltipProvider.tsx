import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { TooltipProvider as RadixTooltipProvider } from '@radix-ui/react-tooltip'

interface SafeTooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
  skipDelayDuration?: number
}

/**
 * Wrapper seguro para TooltipProvider que previne erros de DOM
 * durante mudanças de rota e desmontagem de componentes
 */
export function SafeTooltipProvider({
  children,
  delayDuration = 300,
  skipDelayDuration = 0,
}: SafeTooltipProviderProps) {
  const location = useLocation()
  const [key, setKey] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Forçar remontagem do provider quando a rota muda
  // Isso garante que todos os tooltips sejam limpos antes da nova rota
  useEffect(() => {
    // Limpar timeout anterior se existir
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Pequeno delay para garantir que tooltips sejam fechados antes da mudança
    timeoutRef.current = setTimeout(() => {
      setKey(prev => prev + 1)
    }, 50)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [location.pathname])

  // Interceptar erros globais relacionados a removeChild
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      // Verificar se é o erro específico que estamos tentando evitar
      if (
        event.error instanceof DOMException &&
        event.error.name === 'NotFoundError' &&
        event.error.message?.includes('removeChild')
      ) {
        // Prevenir que o erro seja propagado e quebre a aplicação
        event.preventDefault()
        event.stopPropagation()
        console.warn('Tooltip: Erro de DOM interceptado e suprimido', event.error)
        return false
      }
    }

    window.addEventListener('error', handleError, true)

    return () => {
      window.removeEventListener('error', handleError, true)
    }
  }, [])

  return (
    <RadixTooltipProvider
      key={`tooltip-provider-${key}`}
      delayDuration={delayDuration}
      skipDelayDuration={skipDelayDuration}
    >
      {children}
    </RadixTooltipProvider>
  )
}

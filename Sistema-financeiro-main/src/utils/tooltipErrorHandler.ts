/**
 * Handler global para erros de tooltip do Radix UI
 * Previne que erros de DOM relacionados a tooltips quebrem a aplicação
 */

let isHandlerInstalled = false

export function installTooltipErrorHandler() {
  if (isHandlerInstalled) return

  // Interceptar erros não capturados relacionados a tooltips
  const originalErrorHandler = window.onerror
  window.onerror = function (message, source, lineno, colno, error) {
    // Verificar se é o erro específico de tooltip
    if (
      error instanceof DOMException &&
      error.name === 'NotFoundError' &&
      (error.message?.includes('removeChild') ||
        error.message?.includes('not a child'))
    ) {
      console.warn('Tooltip Error Handler: Erro de DOM suprimido', error.message)
      return true // Prevenir que o erro seja propagado
    }

    // Para outros erros, usar o handler original
    if (originalErrorHandler) {
      return originalErrorHandler.call(this, message, source, lineno, colno, error)
    }

    return false
  }

  // Interceptar rejeições de promises não tratadas
  const originalUnhandledRejection = window.onunhandledrejection
  window.onunhandledrejection = function (event) {
    const error = event.reason
    if (
      error instanceof DOMException &&
      error.name === 'NotFoundError' &&
      (error.message?.includes('removeChild') ||
        error.message?.includes('not a child'))
    ) {
      console.warn('Tooltip Error Handler: Rejeição de promise suprimida', error.message)
      event.preventDefault()
      return
    }

    // Para outras rejeições, usar o handler original
    if (originalUnhandledRejection) {
      return originalUnhandledRejection.call(this, event)
    }
  }

  isHandlerInstalled = true
}


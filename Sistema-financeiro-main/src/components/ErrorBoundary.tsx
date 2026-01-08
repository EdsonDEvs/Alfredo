import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    // Ignorar erros específicos de DOM relacionados a tooltips
    if (
      error.name === 'NotFoundError' &&
      (error.message?.includes('removeChild') ||
        error.message?.includes('not a child') ||
        error.message?.includes('The node to be removed'))
    ) {
      console.warn('ErrorBoundary: Erro de tooltip ignorado (não crítico)', error.message)
      // Não definir hasError para erros de tooltip
      return { hasError: false, error: null }
    }

    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Ignorar erros de tooltip (já tratados em getDerivedStateFromError)
    if (
      error.name === 'NotFoundError' &&
      (error.message?.includes('removeChild') ||
        error.message?.includes('not a child') ||
        error.message?.includes('The node to be removed'))
    ) {
      return
    }

    console.error('ErrorBoundary capturou um erro:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-4">
            <h1 className="text-2xl font-bold text-destructive">Algo deu errado</h1>
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado. Por favor, recarregue a página.
            </p>
            {this.state.error && (
              <details className="text-left text-sm text-muted-foreground bg-muted p-4 rounded">
                <summary className="cursor-pointer font-medium">Detalhes do erro</summary>
                <pre className="mt-2 whitespace-pre-wrap">{this.state.error.toString()}</pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}


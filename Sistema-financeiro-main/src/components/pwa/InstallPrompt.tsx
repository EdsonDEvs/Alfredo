import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePWAInstall } from '@/hooks/usePWAInstall'
import { Download, X } from 'lucide-react'
import { useState, useEffect } from 'react'

/**
 * Componente que exibe um prompt para instalar o PWA
 */
export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWAInstall()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Verificar se o usuário já dispensou o prompt
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      setDismissed(true)
      return
    }

    // Mostrar o prompt se for instalável e não estiver instalado
    if (isInstallable && !isInstalled) {
      // Aguardar um pouco antes de mostrar
      const timer = setTimeout(() => {
        setShow(true)
      }, 3000) // Mostrar após 3 segundos

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      setShow(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!show || dismissed || isInstalled || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-bottom-5">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Instalar ALFREDO
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm mt-1">
                Instale o app para acesso rápido e uso offline
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={handleDismiss}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-2">
            <Button
              onClick={handleInstall}
              className="flex-1 text-sm"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Instalar Agora
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="text-sm"
              size="sm"
            >
              Depois
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


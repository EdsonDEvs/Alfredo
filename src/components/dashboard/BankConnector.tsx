import { useState, useEffect } from 'react'
import { PluggyConnect } from 'react-pluggy-connect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/useAuth'
import { PluggyService } from '@/services/pluggyService'
import { useTransacoesSync } from '@/hooks/useTransacoesSync'
import { toast } from '@/hooks/use-toast'
import { Landmark, RefreshCw, X, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function BankConnector() {
  // LOG INICIAL - Sempre executar para verificar se o componente está sendo chamado
  if (typeof window !== 'undefined') {
    console.log('🔍 BankConnector: Componente iniciado')
  }

  const { user } = useAuth()
  const { refresh } = useTransacoesSync()
  
  // LOG após pegar user do useAuth
  if (typeof window !== 'undefined') {
    console.log('🔍 BankConnector: useAuth retornou', { 
      user: user ? '✅ Existe' : '❌ null/undefined',
      userId: user?.id,
      email: user?.email 
    })
  }
  
  const [connectToken, setConnectToken] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [hasConnection, setHasConnection] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showRemoveDialog, setShowRemoveDialog] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<{
    status?: string
    executionStatus?: string
    connectorName?: string
    lastUpdated?: string
  } | null>(null)

  // Verificar se o usuário já tem uma conexão
  useEffect(() => {
    if (user?.id) {
      checkExistingConnection()
    }
  }, [user?.id])

  // Atualizar status periodicamente se houver conexão
  useEffect(() => {
    if (!hasConnection || !user?.id) return

    const interval = setInterval(async () => {
      try {
        const itemId = await PluggyService.getConnectionId(user.id)
        if (itemId) {
          const status = await PluggyService.checkConnectionStatus(itemId)
          if (status) {
            setConnectionStatus({
              status: status.status,
              executionStatus: status.executionStatus,
              connectorName: status.connector?.name,
              lastUpdated: status.lastUpdatedAt || status.updatedAt,
            })
          }
        }
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
      }
    }, 30000) // Atualizar a cada 30 segundos

    return () => clearInterval(interval)
  }, [hasConnection, user?.id])

  const checkExistingConnection = async () => {
    if (!user?.id) return

    try {
      const itemId = await PluggyService.getConnectionId(user.id)
      const hasConn = !!itemId
      setHasConnection(hasConn)
      
      // Se tem conexão, buscar status detalhado
      if (hasConn && itemId) {
        const status = await PluggyService.checkConnectionStatus(itemId)
        if (status) {
          setConnectionStatus({
            status: status.status,
            executionStatus: status.executionStatus,
            connectorName: status.connector?.name,
            lastUpdated: status.lastUpdatedAt || status.updatedAt,
          })
        }
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error)
    }
  }

  const handleOpenConnect = async () => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado para conectar uma conta',
        variant: 'destructive',
      })
      return
    }

    if (!hasPluggyCredentials()) {
      toast({
        title: 'Configuração necessária',
        description: 'As credenciais Pluggy não estão configuradas. Configure as variáveis de ambiente no Vercel.',
        variant: 'destructive',
      })
      return
    }

    setIsConnecting(true)

    try {
      // Gerar connect token
      const token = await PluggyService.generateConnectToken(user.id)
      setConnectToken(token)
    } catch (error: any) {
      console.error('Erro ao gerar connect token:', error)
      toast({
        title: 'Erro ao conectar',
        description: error.message || 'Não foi possível iniciar a conexão',
        variant: 'destructive',
      })
      setIsConnecting(false)
    }
  }

  const handleSuccess = async (payload: { itemId: string }) => {
    if (!user?.id) return

    try {
      // Salvar o itemId no perfil do usuário
      await PluggyService.saveConnectionId(user.id, payload.itemId)
      
      setHasConnection(true)
      setConnectToken(null)
      setIsConnecting(false)

      // Buscar status da conexão
      const status = await PluggyService.checkConnectionStatus(payload.itemId)
      if (status) {
        setConnectionStatus({
          status: status.status,
          executionStatus: status.executionStatus,
          connectorName: status.connector?.name,
          lastUpdated: status.lastUpdatedAt || status.updatedAt,
        })
      }

      toast({
        title: 'Conta conectada!',
        description: 'Sua conta bancária foi conectada com sucesso',
      })

      // Sincronizar transações automaticamente após conectar
      await handleSync()
    } catch (error: any) {
      console.error('Erro ao salvar conexão:', error)
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível salvar a conexão',
        variant: 'destructive',
      })
    }
  }

  const handleError = (error: any) => {
    console.error('Erro no Pluggy Connect:', error)
    setIsConnecting(false)
    setConnectToken(null)
    
    toast({
      title: 'Erro na conexão',
      description: error.message || 'Ocorreu um erro ao conectar sua conta',
      variant: 'destructive',
    })
  }

  const handleSync = async () => {
    if (!user?.id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar logado',
        variant: 'destructive',
      })
      return
    }

    setIsSyncing(true)

    try {
      const result = await PluggyService.syncTransactions(user.id)
      
      toast({
        title: 'Sincronização concluída',
        description: `${result.success} transação(ões) sincronizada(s) com sucesso`,
      })

      // Atualizar lista de transações
      await refresh()
      
      // Atualizar status da conexão após sincronizar
      if (user?.id) {
        const itemId = await PluggyService.getConnectionId(user.id)
        if (itemId) {
          const status = await PluggyService.checkConnectionStatus(itemId)
          if (status) {
            setConnectionStatus({
              status: status.status,
              executionStatus: status.executionStatus,
              connectorName: status.connector?.name,
              lastUpdated: status.lastUpdatedAt || status.updatedAt,
            })
          }
        }
      }
    } catch (error: any) {
      console.error('Erro ao sincronizar:', error)
      toast({
        title: 'Erro na sincronização',
        description: error.message || 'Não foi possível sincronizar as transações',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const handleRemoveConnection = async () => {
    if (!user?.id) return

    try {
      await PluggyService.removeConnection(user.id)
      setHasConnection(false)
      
      toast({
        title: 'Conexão removida',
        description: 'Sua conta bancária foi desconectada',
      })
    } catch (error: any) {
      console.error('Erro ao remover conexão:', error)
      toast({
        title: 'Erro',
        description: error.message || 'Não foi possível remover a conexão',
        variant: 'destructive',
      })
    } finally {
      setShowRemoveDialog(false)
    }
  }

  // Verificar se as credenciais Pluggy estão configuradas
  const hasPluggyCredentials = () => {
    const apiKey = import.meta.env.VITE_PLUGGY_API_KEY
    const clientId = import.meta.env.VITE_PLUGGY_CLIENT_ID
    const clientSecret = import.meta.env.VITE_PLUGGY_CLIENT_SECRET
    
    // Verificar se API Key está configurada e não é placeholder
    if (apiKey && apiKey !== 'pk_test_sua_chave_aqui' && apiKey.trim() !== '') {
      return true
    }
    
    // Verificar se Client ID e Secret estão configurados
    if (clientId && clientSecret && clientId.trim() !== '' && clientSecret.trim() !== '') {
      return true
    }
    
    return false
  }

  const credentialsConfigured = hasPluggyCredentials()

  // LOG antes da verificação final
  if (typeof window !== 'undefined') {
    console.log('🔍 BankConnector: Antes da verificação final', {
      user: user ? '✅ Existe' : '❌ null/undefined',
      userId: user?.id,
      credentialsConfigured,
      hasConnection,
    })
  }

  // Debug: verificar estado do componente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🔍 BankConnector: useEffect executado', {
        user: user ? '✅ Logado' : '❌ Não logado',
        userId: user?.id,
        credentialsConfigured,
        hasConnection,
      })
    }
  }, [user, credentialsConfigured, hasConnection])

  // Se não tiver usuário, ainda renderizar o Card para garantir que seja incluído no bundle
  // Isso evita tree-shaking em produção
  if (!user) {
    if (typeof window !== 'undefined') {
      console.log('⚠️ BankConnector: Usuário não encontrado, renderizando mensagem')
    }
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5" />
            <CardTitle>Conectar Conta Bancária</CardTitle>
          </div>
          <CardDescription>
            Faça login para conectar sua conta bancária
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (typeof window !== 'undefined') {
    console.log('✅ BankConnector: Renderizando componente (usuário encontrado)')
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Landmark className="h-5 w-5" />
              <CardTitle>Conectar Conta Bancária</CardTitle>
            </div>
            {hasConnection && connectionStatus && (
              <div className={`flex items-center gap-2 ${
                connectionStatus.executionStatus === 'SUCCESS' 
                  ? 'text-green-600' 
                  : connectionStatus.status === 'UPDATING'
                  ? 'text-yellow-600'
                  : 'text-orange-600'
              }`}>
                {connectionStatus.executionStatus === 'SUCCESS' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : connectionStatus.status === 'UPDATING' ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <span className="text-sm">
                  {connectionStatus.executionStatus === 'SUCCESS' 
                    ? 'Conectado' 
                    : connectionStatus.status === 'UPDATING'
                    ? 'Sincronizando...'
                    : 'Atenção'}
                </span>
              </div>
            )}
          </div>
          <CardDescription>
            Conecte sua conta bancária para importar transações automaticamente via Open Finance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!credentialsConfigured ? (
            <div className="space-y-2">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                  ⚠️ Integração Pluggy não configurada
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  Para usar a integração com bancos, configure as variáveis de ambiente no Vercel:
                </p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 list-disc list-inside space-y-1">
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">VITE_PLUGGY_CLIENT_ID</code></li>
                  <li><code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">VITE_PLUGGY_CLIENT_SECRET</code></li>
                </ul>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                  Consulte a documentação em <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">COMO-CONFIGURAR-PLUGGY-OFICIAL.md</code>
                </p>
              </div>
            </div>
          ) : !hasConnection ? (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Conecte sua conta bancária de forma segura usando Open Finance. 
                Suas credenciais nunca são armazenadas em nosso sistema.
              </p>
              <Button
                onClick={handleOpenConnect}
                disabled={isConnecting || !credentialsConfigured}
                className="w-full"
              >
                <Landmark className="h-4 w-4 mr-2" />
                {isConnecting ? 'Conectando...' : 'Conectar Conta Bancária'}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sua conta bancária está conectada. Você pode sincronizar transações manualmente 
                  ou elas serão atualizadas automaticamente.
                </p>
                {connectionStatus && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    {connectionStatus.connectorName && (
                      <p>Banco: <span className="font-medium">{connectionStatus.connectorName}</span></p>
                    )}
                    {connectionStatus.lastUpdated && (
                      <p>Última atualização: {new Date(connectionStatus.lastUpdated).toLocaleString('pt-BR')}</p>
                    )}
                    {connectionStatus.status && connectionStatus.status !== 'UPDATED' && (
                      <p className="text-yellow-600 dark:text-yellow-400">
                        Status: {connectionStatus.status}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSync}
                  disabled={isSyncing}
                  variant="default"
                  className="flex-1"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
                </Button>
                <Button
                  onClick={() => setShowRemoveDialog(true)}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Desconectar
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Widget Pluggy Connect */}
      {connectToken && (
        <PluggyConnect
          connectToken={connectToken}
          includeSandbox={true}
          onSuccess={handleSuccess}
          onError={handleError}
          onClose={() => {
            setConnectToken(null)
            setIsConnecting(false)
          }}
        />
      )}

      {/* Dialog de confirmação para remover conexão */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Desconectar conta bancária?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja desconectar sua conta bancária? 
              As transações já importadas não serão removidas, mas novas transações 
              não serão mais sincronizadas automaticamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConnection}>
              Desconectar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


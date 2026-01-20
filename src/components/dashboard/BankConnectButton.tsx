import { useState } from 'react'
import { PluggyConnect } from 'react-pluggy-connect'
import { Button } from '@/components/ui/button'
import { supabase } from '@/integrations/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Building2, Loader2 } from 'lucide-react'

interface BankConnectButtonProps {
  onSyncComplete: () => void
}

export function BankConnectButton({ onSyncComplete }: BankConnectButtonProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectToken, setConnectToken] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  // 1. Pedir token para o backend para abrir o widget
  const handleStartConnection = async () => {
    try {
      setIsConnecting(true)
      
      // Chama a Edge Function 'bank-sync' (que você precisa criar no Supabase)
      // Se ainda não criou a function, isso vai falhar.
      // Para TESTE RÁPIDO: Comente a chamada da function e use um token falso ou pule esta etapa
      
      const { data, error } = await supabase.functions.invoke('bank-sync', {
        body: { action: 'create_token' }
      })

      if (error) throw error
      setConnectToken(data.accessToken)
      
    } catch (error: any) {
      console.error(error)
      toast({ 
        title: "Erro ao conectar", 
        description: "Verifique se a Edge Function 'bank-sync' está criada.", 
        variant: "destructive" 
      })
      setIsConnecting(false)
    }
  }

  const handleSuccess = async (payload: { itemId: string }) => {
    setConnectToken(null)
    setIsConnecting(false)
    setIsSyncing(true)

    toast({ title: "Conta Conectada!", description: "Sincronizando transações..." })

    try {
      const { data, error } = await supabase.functions.invoke('bank-sync', {
        body: { action: 'sync_transactions', itemId: payload.itemId }
      })

      if (error) throw error

      toast({ 
        title: "Sincronização Concluída", 
        description: `${data?.count || 0} transações importadas.` 
      })
      
      onSyncComplete()
    } catch (error) {
      console.error(error)
      toast({ title: "Erro na Sincronização", description: "Falha ao baixar transações.", variant: "destructive" })
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleStartConnection} 
        disabled={isConnecting || isSyncing}
        className="gap-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200"
      >
        {isConnecting || isSyncing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Building2 className="h-4 w-4" />
        )}
        {isSyncing ? 'Sincronizando...' : 'Conectar Banco'}
      </Button>

      {connectToken && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
           <div className="bg-white rounded-lg w-full max-w-lg h-[600px] relative overflow-hidden shadow-xl">
             <button 
               onClick={() => { setConnectToken(null); setIsConnecting(false); }}
               className="absolute top-2 right-2 z-10 p-2 bg-gray-100 rounded-full hover:bg-gray-200"
             >
               ✕
             </button>
             <PluggyConnect
                connectToken={connectToken}
                includeSandbox={true}
                onSuccess={handleSuccess}
                onError={(err) => console.error(err)}
              />
           </div>
        </div>
      )}
    </>
  )
}
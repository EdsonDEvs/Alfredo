
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { cancelSubscription, renewSubscription } from '@/integrations/firebase/subscriptionService'
import { toast } from '@/hooks/use-toast'
import { CreditCard, RefreshCw, AlertCircle, CheckCircle, XCircle, Calendar, DollarSign } from 'lucide-react'
import { formatDate } from '@/utils/date'
import { useNavigate } from 'react-router-dom'

export function SubscriptionInfo() {
  const { user } = useAuth()
  const { subscription, isSubscribed, isPending, isCancelled, loading } = useSubscription()
  const navigate = useNavigate()
  const [syncing, setSyncing] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [renewing, setRenewing] = useState(false)

  const syncSubscriptionData = async () => {
    try {
      setSyncing(true)
      const credentials = btoa('apolo22:123456');
      
      const response = await fetch('https://n8n.alfredoo.online/webhook-test/assinatura/info', {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao sincronizar dados da assinatura');
      }

      const data = await response.json();
      
      toast({
        title: "Sincronização concluída",
        description: "Dados da assinatura atualizados com sucesso",
      })
    } catch (error: any) {
      console.error('Erro na sincronização:', error)
      toast({
        title: "Erro na sincronização",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSyncing(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!user?.uid) return;

    try {
      setCancelling(true);
      const { success, error } = await cancelSubscription(user.uid);
      
      if (success) {
        toast({
          title: "Assinatura cancelada",
          description: "Sua assinatura foi cancelada com sucesso",
        });
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao cancelar assinatura",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCancelling(false);
    }
  };

  const handleRenewSubscription = async () => {
    if (!user?.uid) return;

    try {
      setRenewing(true);
      const { success, error } = await renewSubscription(user.uid);
      
      if (success) {
        toast({
          title: "Assinatura renovada",
          description: "Sua assinatura foi renovada com sucesso",
        });
      } else {
        throw new Error(error);
      }
    } catch (error: any) {
      toast({
        title: "Erro ao renovar assinatura",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setRenewing(false);
    }
  };



  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Informações da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 space-y-4">
            <CreditCard className="h-12 w-12 text-muted-foreground mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Nenhuma assinatura ativa</h3>
              <p className="text-muted-foreground">
                Você ainda não possui uma assinatura ativa
              </p>
            </div>
                         <Button onClick={() => navigate('/plano')} className="w-full md:w-auto">
               Assinar agora - R$ 0,01/mês
             </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Status da Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Status:</span>
              <Badge 
                variant={isSubscribed ? "default" : isPending ? "secondary" : "destructive"}
                className="flex items-center gap-1"
              >
                {isSubscribed && <CheckCircle className="h-3 w-3" />}
                {isCancelled && <XCircle className="h-3 w-3" />}
                {isSubscribed ? 'Ativa' : isPending ? 'Pendente' : 'Cancelada'}
              </Badge>
            </div>

            {/* Plano */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Plano:</span>
              <span className="text-sm text-muted-foreground capitalize">{subscription.plan}</span>
            </div>

            {/* Valor */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Valor:</span>
              <span className="text-sm font-semibold flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                R$ {subscription.amount.toFixed(2)}/{subscription.currency}
              </span>
            </div>

            {/* Data de início */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Início:</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(subscription.startDate)}
              </span>
            </div>

            {/* Data de término */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Término:</span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(subscription.endDate)}
              </span>
            </div>

            {/* Renovação automática */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Renovação automática:</span>
              <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                {subscription.autoRenew ? 'Ativada' : 'Desativada'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <Card>
        <CardHeader>
          <CardTitle>Ações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {isSubscribed && (
              <Button 
                variant="destructive" 
                onClick={handleCancelSubscription}
                disabled={cancelling}
                className="w-full"
              >
                {cancelling ? 'Cancelando...' : 'Cancelar Assinatura'}
              </Button>
            )}

            {isCancelled && (
              <Button 
                onClick={handleRenewSubscription}
                disabled={renewing}
                className="w-full"
              >
                {renewing ? 'Renovando...' : 'Renovar Assinatura'}
              </Button>
            )}

            <Button 
              onClick={syncSubscriptionData} 
              disabled={syncing} 
              variant="outline" 
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar Dados'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CreditCard, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionRequiredProps {
  children: React.ReactNode;
}

export function SubscriptionRequired({ children }: SubscriptionRequiredProps) {
  const { user } = useAuth();
  const { isSubscribed, loading } = useSubscription();
  const navigate = useNavigate();

  // Se não está logado, redireciona para login
  if (!user) {
    navigate('/auth');
    return null;
  }

  // Se está carregando, mostra loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Verificando assinatura...</p>
        </div>
      </div>
    );
  }

  // Se tem assinatura ativa, mostra o conteúdo
  if (isSubscribed) {
    return <>{children}</>;
  }

  // Se não tem assinatura, mostra tela de upgrade
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Assinatura Necessária</CardTitle>
          <CardDescription>
            Para acessar esta funcionalidade, você precisa de uma assinatura ativa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Benefícios */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Zap className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Registre gastos automaticamente</p>
                <p className="text-sm text-muted-foreground">Via WhatsApp, foto ou áudio</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Controle total das finanças</p>
                <p className="text-sm text-muted-foreground">Dashboard completo e relatórios</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Lembretes inteligentes</p>
                <p className="text-sm text-muted-foreground">Nunca mais esqueça de pagar contas</p>
              </div>
            </div>
          </div>

                     {/* Preço */}
           <div className="bg-muted/50 rounded-lg p-4 text-center">
             <div className="flex items-baseline justify-center gap-2 mb-1">
               <span className="text-2xl font-bold text-primary">R$ 0,01</span>
               <span className="text-muted-foreground">/mês</span>
             </div>
             <p className="text-sm text-muted-foreground">
               Valor promocional para testes
             </p>
           </div>

          {/* Botões */}
          <div className="space-y-3">
                         <Button 
               onClick={() => navigate('/plano')} 
               className="w-full"
             >
               Assinar agora - R$ 0,01/mês
             </Button>
            
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Voltar ao Dashboard
            </Button>
          </div>

          {/* Garantia */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
            <p className="text-sm text-green-700 dark:text-green-300">
              <Shield className="h-4 w-4 inline mr-1" />
              7 dias de garantia - Cancelamento a qualquer momento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

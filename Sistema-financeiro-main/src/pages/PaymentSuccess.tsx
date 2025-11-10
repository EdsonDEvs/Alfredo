import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { createOrUpdateSubscription } from '@/integrations/firebase/subscriptionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signUp, signIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const processPaymentSuccess = async () => {
      try {
        console.log('🔄 Processando retorno do pagamento...');
        
        // Capturar dados da URL (se houver)
        const customerId = searchParams.get('customerId');
        const email = searchParams.get('email');
        const paymentId = searchParams.get('paymentId');
        const status = searchParams.get('status');
        
        console.log('📋 Dados capturados:', { customerId, email, paymentId, status });
        
                 // Se não há dados na URL, tentar capturar do localStorage
         const storedData = localStorage.getItem('alfredo_payment_data');
         if (storedData) {
           const parsedData = JSON.parse(storedData);
           setUserData(parsedData);
           
           console.log('📋 Dados do usuário recuperados:', parsedData);
           
                       // Se não está logado, tentar fazer login com os dados armazenados
            if (!user && parsedData.email && parsedData.password) {
              console.log('🔐 Tentando fazer login com dados armazenados...');
              
              const { error: signInError } = await signIn(parsedData.email, parsedData.password);
              
              if (signInError) {
                console.error('Erro ao fazer login:', signInError);
                toast({
                  title: "Erro ao fazer login",
                  description: "Tente fazer login manualmente na página de autenticação",
                  variant: "destructive",
                });
              } else {
                console.log('✅ Login realizado com sucesso');
                toast({
                  title: "Login realizado com sucesso!",
                  description: "Bem-vindo ao Alfredo!",
                });
              }
            }
         }
        
        // Simular processamento de pagamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Atualizar assinatura se o usuário estiver logado
        if (user?.uid) {
          const { data: subscription, error } = await createOrUpdateSubscription(user.uid, {
            status: 'active',
            amount: 0.01,
            paymentMethod: 'asaas',
            asaasPaymentId: paymentId || 'manual'
          });
          
          if (error) {
            console.error('Erro ao criar assinatura:', error);
          } else {
            console.log('✅ Assinatura criada:', subscription);
          }
        }
        
        setIsSuccess(true);
        toast({
          title: "Pagamento processado com sucesso!",
          description: "Sua assinatura foi ativada. Bem-vindo ao Alfredo!",
        });
        
      } catch (error: any) {
        console.error('Erro ao processar pagamento:', error);
        toast({
          title: "Erro ao processar pagamento",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, user, signUp, signIn]);

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToLogin = () => {
    navigate('/auth');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <CardTitle>Processando pagamento...</CardTitle>
            <CardDescription>
              Aguarde enquanto processamos sua assinatura
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-green-600">Pagamento Confirmado!</CardTitle>
          <CardDescription>
            Sua assinatura foi ativada com sucesso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Detalhes da assinatura */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Detalhes da Assinatura</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Plano:</span>
                <span className="font-medium">Alfredo Premium</span>
              </div>
              <div className="flex justify-between">
                <span>Valor:</span>
                <span className="font-medium">R$ 0,01/mês</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-medium text-green-600">Ativo</span>
              </div>
            </div>
          </div>

          {/* Benefícios */}
          <div className="space-y-3">
            <h3 className="font-semibold">O que você tem acesso:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Registre gastos via WhatsApp</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Dashboard completo</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Relatórios detalhados</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">Lembretes inteligentes</span>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="space-y-3">
            {user ? (
              <Button 
                onClick={handleGoToDashboard} 
                className="w-full"
              >
                Ir para o Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleGoToLogin} 
                className="w-full"
              >
                Fazer Login
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            
                         <Button 
               variant="outline" 
               onClick={() => window.open('https://sandbox.asaas.com/c/g5su9rr5jw5b2f4h', '_blank')}
               className="w-full"
             >
               Ver Fatura
             </Button>
          </div>

          {/* Informações adicionais */}
          <div className="text-center text-sm text-muted-foreground">
            <p>Você receberá um email de confirmação em breve.</p>
            <p>Em caso de dúvidas, entre em contato conosco.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, ArrowRight, ArrowLeft } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: 'monthly' | 'yearly';
  features: string[];
  popular?: boolean;
  recommended?: boolean;
  savings?: number;
}

interface PlanSelectionProps {
  onSelectPlan: (plan: Plan) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Básico',
    price: 0.01,
    period: 'monthly',
    features: [
      'Dashboard básico',
      'Registro de transações',
      'Categorização automática',
      'Relatórios simples',
      'Suporte por email'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 0.01,
    period: 'monthly',
    features: [
      'Tudo do plano Básico',
      'Integração WhatsApp',
      'Relatórios avançados',
      'Lembretes inteligentes',
      'Metas financeiras',
      'Suporte prioritário',
      'Backup automático'
    ],
    popular: true,
    recommended: true
  },
  {
    id: 'pro',
    name: 'Profissional',
    price: 0.01,
    period: 'monthly',
    features: [
      'Tudo do plano Premium',
      'Múltiplas contas',
      'Análise de investimentos',
      'Consultoria personalizada',
      'API de integração',
      'Suporte 24/7',
      'Relatórios customizados'
    ]
  }
];

export function PlanSelection({ onSelectPlan, onBack, isLoading = false }: PlanSelectionProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const handleSelectPlan = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    if (plan) {
      onSelectPlan(plan);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Escolha seu Plano</h1>
          <p className="text-lg text-muted-foreground">
            Selecione o plano ideal para suas necessidades financeiras
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-200 ${
                selectedPlan === plan.id 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    <Star className="h-3 w-3 mr-1" />
                    Mais Popular
                  </Badge>
                </div>
              )}

              {/* Recommended Badge */}
              {plan.recommended && (
                <div className="absolute -top-3 right-4">
                  <Badge variant="secondary" className="px-2 py-1 text-xs">
                    <Crown className="h-3 w-3 mr-1" />
                    Recomendado
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  {plan.id === 'basic' && <Zap className="h-5 w-5" />}
                  {plan.id === 'premium' && <Star className="h-5 w-5" />}
                  {plan.id === 'pro' && <Crown className="h-5 w-5" />}
                  {plan.name}
                </CardTitle>
                
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl font-bold">R$ {plan.price.toFixed(2)}</span>
                  <span className="text-muted-foreground">/mês</span>
                </div>

                {plan.savings && (
                  <div className="text-sm text-green-600 font-medium">
                    Economia de R$ {plan.savings}/ano
                  </div>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Selection Indicator */}
                {selectedPlan === plan.id && (
                  <div className="absolute top-4 right-4">
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-8"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={handleSelectPlan}
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                Continuar para Pagamento
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>✅ Todos os planos incluem 7 dias de garantia</p>
          <p>✅ Cancelamento a qualquer momento</p>
          <p>✅ Atualização gratuita entre planos</p>
        </div>
      </div>
    </div>
  );
}

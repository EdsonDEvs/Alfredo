
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useTheme } from '@/hooks/useTheme';
import { Check, CreditCard, Shield, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Plano() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleBackToLogin = () => {
    navigate('/auth');
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };
  
  const benefits = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: 'Registre gastos automaticamente',
      description: 'Via WhatsApp, foto ou áudio'
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: 'Controle total das finanças',
      description: 'Dashboard completo e relatórios'
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      title: 'Lembretes inteligentes',
      description: 'Nunca mais esqueça de pagar contas'
    }
  ];

  const plans = [
    {
      name: 'Básico',
      price: '30 dias grátis',
      subtitle: 'Depois R$ 19,90/mês',
      description: 'Ideal para começar e organizar o básico',
      highlight: false,
      features: [
        'Lançar dados básicos',
        'Registro via WhatsApp',
        'Visão simples de entradas e saídas'
      ],
      cta: 'Começar teste grátis'
    },
    {
      name: 'Pro',
      price: 'R$ 49,90/mês',
      subtitle: 'Controle total do seu dia e do seu dinheiro',
      description: 'Para quem quer mais clareza e produtividade',
      highlight: true,
      features: [
        'Controle total de gastos e receitas',
        'Agenda e compromissos',
        'Metas financeiras inteligentes',
        'Relatórios visuais completos'
      ],
      cta: 'Assinar Pro'
    },
    {
      name: 'Premium',
      price: 'R$ 79,90/mês',
      subtitle: 'Experiência completa',
      description: 'Tudo para automatizar sua vida financeira',
      highlight: false,
      features: [
        'Tudo do plano Pro',
        'Open Finance integrado',
        'Importar e exportar planilhas',
        'Cálculo de imposto de renda'
      ],
      cta: 'Assinar Premium'
    }
  ];

  // Array de fotos de usuários para simular perfis
  const userProfiles = [
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1485833077593-4278bba3f11f?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1441057206919-63d19fac2369?w=100&h=100&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=100&h=100&fit=crop&crop=face'
  ];

  return (
    <div className="min-h-screen flex bg-background p-4 sm:p-6">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden rounded-3xl">
        <img 
          src="/lovable-uploads/e73af031-b391-404d-a839-c9cbe548576b.png" 
          alt="Finance Management" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-primary/20" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Agora ficou fácil!</h2>
          </div>
          <p className="text-base sm:text-lg opacity-90 mb-6">
            Gerencie suas finanças de forma simples e inteligente
          </p>
          
          {/* Seção de usuários */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <p className="text-sm font-medium mb-3">
              Mais de 500 usuários já usam nossa plataforma
            </p>
            
            {/* Fotos dos usuários */}
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {userProfiles.map((profile, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-white/20"
                  >
                    <img 
                      src={profile} 
                      alt={`Usuário ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback para caso a imagem não carregue
                        const target = e.target as HTMLImageElement;
                        target.style.backgroundColor = '#6366f1';
                        target.style.display = 'flex';
                        target.style.alignItems = 'center';
                        target.style.justifyContent = 'center';
                        target.innerHTML = `<span style="color: white; font-size: 10px; font-weight: bold;">${String.fromCharCode(65 + index)}</span>`;
                      }}
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-white/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">+500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Plan Info */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
        {/* Header with Logo and Theme Toggle */}
        <div className="absolute top-4 left-4 right-4 flex justify-end items-center">
          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md lg:max-w-lg mt-4 sm:mt-8 lg:mt-16 space-y-4">
          <div>
            <img 
              src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
              alt="ALFREDO" 
              className="h-8 sm:h-10 w-auto" 
            />
          </div>
          
          <div className="w-full mx-auto">
            <div className="text-start py-4 sm:py-6 lg:py-8">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 dark:text-slate-300">
                ALFREDO - Assistente Financeiro
              </h1>
              
              <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                Seu assistente financeiro inteligente para organizar suas finanças!
              </p>

              {/* Benefits List */}
              <div className="space-y-4 mb-6 sm:mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="bg-primary rounded-full p-1.5 mt-0.5 flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{benefit.title}</p>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Planos */}
              <div className="space-y-4 mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                  Planos de assinatura
                </h2>
                <div className="grid gap-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`rounded-xl border p-4 sm:p-5 ${
                        plan.highlight
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">
                          {plan.name}
                        </h3>
                        {plan.highlight && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                            Mais popular
                          </span>
                        )}
                      </div>
                      <p className="text-lg sm:text-xl font-bold text-foreground">
                        {plan.price}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {plan.subtitle}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        {plan.description}
                      </p>
                      <ul className="space-y-2 mb-4">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                            <Check className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full h-11 ${
                          plan.highlight
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        onClick={user ? handleGoToDashboard : handleBackToLogin}
                      >
                        {plan.cta}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Garantia */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800 dark:text-green-200">7 dias de garantia</span>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Se não gostar, devolvemos seu dinheiro em até 7 dias
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <Button 
                  variant="outline" 
                  onClick={user ? handleGoToDashboard : handleBackToLogin} 
                  className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base sm:text-lg"
                >
                  {user ? 'Ir para o Dashboard' : 'Voltar ao login'}
                </Button>
              </div>

              {/* Informações adicionais */}
              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  Em breve: Página de vendas com planos e preços
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

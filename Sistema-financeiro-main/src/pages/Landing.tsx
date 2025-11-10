import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowRight, 
  Check, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3,
  Smartphone,
  CreditCard,
  Bell,
  FileText,
  Users,
  Star,
  ChevronRight
} from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Registre Gastos Automaticamente',
      description: 'Envie uma foto, áudio ou mensagem via WhatsApp e o Alfredo registra automaticamente'
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: 'Dashboard Completo',
      description: 'Visualize todas suas receitas e despesas em gráficos intuitivos e relatórios detalhados'
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: 'Lembretes Inteligentes',
      description: 'Nunca mais esqueça de pagar uma conta. Receba lembretes automáticos no WhatsApp'
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: 'Múltiplas Moedas',
      description: 'Gerencie suas finanças em BRL, USD ou EUR com conversão automática em tempo real'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Importação de Planilhas',
      description: 'Importe suas transações do Excel ou CSV com detecção automática de colunas'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: '100% Seguro',
      description: 'Seus dados são protegidos com criptografia de ponta e armazenados com segurança'
    }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Empresária',
      content: 'O Alfredo transformou minha vida financeira. Agora sei exatamente para onde vai cada centavo!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Freelancer',
      content: 'A melhor ferramenta que já usei. Simples, rápida e muito eficiente.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Estudante',
      content: 'Finalmente consegui organizar minhas finanças. O dashboard é incrível!',
      rating: 5
    }
  ]

  const plans = [
    {
      name: 'Básico',
      price: 'R$ 29,90',
      period: '/mês',
      features: [
        'Registro ilimitado de transações',
        'Dashboard completo',
        'Relatórios mensais',
        'Suporte por email',
        '1 moeda (BRL)'
      ],
      popular: false
    },
    {
      name: 'Premium',
      price: 'R$ 49,90',
      period: '/mês',
      features: [
        'Tudo do plano Básico',
        'Lembretes automáticos',
        'Múltiplas moedas (BRL, USD, EUR)',
        'Importação de planilhas',
        'Suporte prioritário',
        'Metas financeiras'
      ],
      popular: true
    },
    {
      name: 'Profissional',
      price: 'R$ 79,90',
      period: '/mês',
      features: [
        'Tudo do plano Premium',
        'Integração WhatsApp',
        'Relatórios avançados',
        'API de integração',
        'Suporte 24/7',
        'Análise preditiva'
      ],
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
                alt="ALFREDO" 
                className="h-8 w-auto" 
              />
              <span className="text-xl font-bold">ALFREDO</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/auth')}>
                Entrar
              </Button>
              <Button onClick={() => navigate('/cadastro')}>
                Começar Agora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4" variant="secondary">
            🎉 Mais de 500 usuários já confiam no Alfredo
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Seu Assistente Financeiro
            <span className="text-primary"> Inteligente</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Gerencie suas finanças de forma simples e automática. 
            Registre gastos via WhatsApp, visualize tudo no dashboard e nunca mais esqueça de pagar uma conta.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/cadastro')} className="text-lg px-8">
              Começar Grátis por 7 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8">
              Já tenho conta
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            ✅ Sem cartão de crédito • ✅ Cancele quando quiser • ✅ 7 dias de garantia
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Funcionalidades poderosas para transformar sua relação com o dinheiro
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="p-6">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-primary">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-muted/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative border-2 ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Mais Popular
                </Badge>
              )}
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => navigate('/cadastro', { state: { plan: plan.name.toLowerCase() } })}
                >
                  Escolher Plano
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-xl text-muted-foreground">
            Mais de 500 pessoas já transformaram suas finanças com o Alfredo
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="bg-primary text-primary-foreground border-0">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto para transformar suas finanças?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Comece hoje mesmo e tenha controle total das suas finanças em minutos
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              onClick={() => navigate('/cadastro')}
              className="text-lg px-8"
            >
              Começar Agora - Grátis por 7 Dias
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm mt-4 opacity-75">
              Sem cartão de crédito • Cancele quando quiser
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
                  alt="ALFREDO" 
                  className="h-6 w-auto" 
                />
                <span className="font-bold">ALFREDO</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seu assistente financeiro inteligente
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-foreground">Preços</a></li>
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
                <li><a href="#" className="hover:text-foreground">Termos</a></li>
                <li><a href="#" className="hover:text-foreground">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 ALFREDO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


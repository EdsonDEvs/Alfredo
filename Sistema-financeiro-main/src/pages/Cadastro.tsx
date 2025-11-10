import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Check, ArrowLeft, Shield, CreditCard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { n8nService } from '@/integrations/n8n/webhookService'
import { toast } from '@/hooks/use-toast'

interface FormData {
  nome: string
  email: string
  phone: string
  whatsapp: string
  cpf: string
  plan: string
}

export default function Cadastro() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    phone: '',
    whatsapp: '',
    cpf: '',
    plan: location.state?.plan || 'premium'
  })

  const plans = {
    basico: { name: 'Básico', price: 29.90, features: ['Registro ilimitado', 'Dashboard completo', 'Relatórios mensais'] },
    premium: { name: 'Premium', price: 49.90, features: ['Tudo do Básico', 'Lembretes automáticos', 'Múltiplas moedas', 'Importação de planilhas'] },
    profissional: { name: 'Profissional', price: 79.90, features: ['Tudo do Premium', 'Integração WhatsApp', 'Relatórios avançados', 'API de integração'] }
  }

  const selectedPlan = plans[formData.plan as keyof typeof plans] || plans.premium

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim()
    }
    return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim()
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatWhatsApp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
  }

  const validateForm = () => {
    if (!formData.nome.trim()) {
      toast({ title: 'Erro', description: 'Nome é obrigatório', variant: 'destructive' })
      return false
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({ title: 'Erro', description: 'Email válido é obrigatório', variant: 'destructive' })
      return false
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      toast({ title: 'Erro', description: 'Telefone válido é obrigatório', variant: 'destructive' })
      return false
    }
    if (!formData.whatsapp.trim() || formData.whatsapp.replace(/\D/g, '').length < 10) {
      toast({ title: 'Erro', description: 'WhatsApp válido é obrigatório', variant: 'destructive' })
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      // 1. Tentar salvar dados no Supabase (opcional - pode falhar se RLS bloquear)
      // Não é crítico, pois o n8n criará a conta após o pagamento
      try {
        const { error: leadError } = await supabase
          .from('profiles')
          .insert({
            nome: formData.nome,
            email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            subscription_status: 'pending',
          })

        if (leadError) {
          // Ignorar erros de RLS ou duplicata - não é crítico
          if (leadError.code !== '23505' && !leadError.message?.includes('RLS')) {
            console.warn('Aviso ao salvar pré-cadastro:', leadError.message)
          }
        }
      } catch (error) {
        // Ignorar erros ao salvar pré-cadastro - não é crítico
        console.warn('Não foi possível salvar pré-cadastro (não crítico):', error)
      }

      // 2. Tentar enviar dados para n8n (opcional - pode não estar disponível)
      // Não é crítico, pois o n8n será chamado após o pagamento confirmado
      try {
        const n8nResponse = await n8nService.createUser({
          name: formData.nome,
          email: formData.email,
          phone: formData.whatsapp.replace(/\D/g, ''),
          password: '' // Senha será gerada pelo n8n
        })

        if (!n8nResponse.success) {
          // Não é crítico - o n8n será chamado após pagamento
          console.log('n8n não disponível agora (será chamado após pagamento):', n8nResponse.error)
        }
      } catch (error) {
        // Ignorar erros de conexão com n8n - não é crítico
        console.log('n8n não disponível agora (será chamado após pagamento)')
      }

      // 3. Salvar dados no localStorage para uso após pagamento
      localStorage.setItem('alfredo_cadastro_data', JSON.stringify({
        nome: formData.nome,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        plan: formData.plan,
        timestamp: new Date().toISOString()
      }))

      // 4. Redirecionar para página de pagamento (Asaas ou outro gateway)
      toast({
        title: 'Cadastro realizado!',
        description: 'Redirecionando para o pagamento...',
      })

      // Em produção, você redirecionaria para a URL real do gateway de pagamento
      // Exemplo: window.location.href = 'https://sandbox.asaas.com/c/g5su9rr5jw5b2f4h'
      
      // Por enquanto, vamos simular o redirecionamento
      // Após pagamento confirmado, o webhook do n8n criará a conta
      setTimeout(() => {
        navigate('/payment-success', {
          state: {
            nome: formData.nome,
            email: formData.email,
            phone: formData.phone,
            whatsapp: formData.whatsapp,
            plan: formData.plan
          }
        })
      }, 2000)

    } catch (error: any) {
      console.error('Erro no cadastro:', error)
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao processar cadastro. Tente novamente.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/landing')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
              alt="ALFREDO" 
              className="h-6 w-auto" 
            />
            <span className="font-bold">ALFREDO</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete seu cadastro</CardTitle>
                <CardDescription>
                  Preencha seus dados para começar a usar o Alfredo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Nome */}
                <div>
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => handleInputChange('nome', e.target.value)}
                    placeholder="Seu nome completo"
                    disabled={loading}
                  />
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    disabled={loading}
                  />
                </div>

                {/* Telefone */}
                <div>
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhone(e.target.value))}
                    placeholder="(11) 99999-9999"
                    disabled={loading}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', formatWhatsApp(e.target.value))}
                    placeholder="5511999999999"
                    disabled={loading}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Apenas números, com DDD (ex: 5511999999999)
                  </p>
                </div>

                {/* CPF (Opcional) */}
                <div>
                  <Label htmlFor="cpf">CPF (Opcional)</Label>
                  <Input
                    id="cpf"
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', formatCPF(e.target.value))}
                    placeholder="000.000.000-00"
                    maxLength={14}
                    disabled={loading}
                  />
                </div>

                {/* Botão de Submit */}
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      Continuar para Pagamento
                      <CreditCard className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Seus dados estão seguros. Após o pagamento confirmado, sua conta será criada automaticamente.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Plano */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo do Plano</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{selectedPlan.name}</span>
                    <span className="text-2xl font-bold">R$ {selectedPlan.price.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">por mês</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Inclui:</p>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Total</span>
                    <span className="font-bold text-lg">R$ {selectedPlan.price.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cobrança mensal • Cancele quando quiser
                  </p>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    7 dias de garantia. Se não gostar, devolvemos seu dinheiro.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


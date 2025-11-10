import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface RegisterFormProps {
  onBackToLogin: () => void
}

export function RegisterForm({ onBackToLogin }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validações
    if (password !== confirmPassword) {
      toast({
        title: "Erro na validação",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    if (password.length < 6) {
      toast({
        title: "Erro na validação",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive",
      })
      setLoading(false)
      return
    }

    try {
      console.log('Attempting registration for:', email)
      const { error } = await signUp(email, password, fullName)

      if (error) {
        console.error('Registration error:', error)
        let errorMessage = 'Erro ao criar conta'
        
        if (error.includes('email-already-in-use')) {
          errorMessage = 'Este email já está em uso'
        } else if (error.includes('weak-password')) {
          errorMessage = 'A senha é muito fraca'
        } else if (error.includes('invalid-email')) {
          errorMessage = 'Email inválido'
        }
        
        toast({
          title: "Erro no registro",
          description: errorMessage,
          variant: "destructive",
        })
      } else {
        console.log('Registration successful')
        toast({
          title: "Conta criada com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Unexpected registration error:', error)
      toast({
        title: "Erro no registro",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive",
      })
    }

    setLoading(false)
  }

  return (
    <div className="w-full mx-auto">
      <div className="text-start mb-8">
        <h1 className="text-2xl font-bold mb-2" style={{ color: '#0d0f1a' }}>
          Criar conta
        </h1>
        <p className="text-base" style={{ color: '#888' }}>
          Comece sua jornada financeira hoje
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium" style={{ color: '#0d0f1a' }}>
            Nome completo
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Seu nome completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium" style={{ color: '#0d0f1a' }}>
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium" style={{ color: '#0d0f1a' }}>
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium" style={{ color: '#0d0f1a' }}>
            Confirmar senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 border-gray-300 focus:border-primary focus:ring-primary"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar conta'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm" style={{ color: '#888' }}>
          Já tem uma conta?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="text-primary hover:underline font-medium"
          >
            Fazer login
          </button>
        </p>
      </div>
    </div>
  )
}

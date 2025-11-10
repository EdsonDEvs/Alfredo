
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LoginFormProps {
  onForgotPassword: () => void
  onRegister: () => void
}

export function LoginForm({ onForgotPassword, onRegister }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('Attempting login for:', email)
      const { error } = await signIn(email, password)

      if (error) {
        console.error('Login error:', error)
        toast({
          title: "Erro no login",
          description: error.message === 'Invalid login credentials' 
            ? 'Email ou senha incorretos' 
            : error.message,
          variant: "destructive",
        })
      } else {
        console.log('Login successful')
        toast({
          title: "Login realizado com sucesso!",
          description: "Redirecionando para o dashboard...",
        })
        navigate('/dashboard')
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error)
      toast({
        title: "Erro no login",
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
          Bem-vindo de volta
        </h1>
        <p className="text-base" style={{ color: '#888' }}>
          Entre na sua conta para continuar
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <Button
          type="submit"
          className="w-full h-12 text-white font-semibold hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: '#0d0f1a' }}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Entrando...
            </>
          ) : (
            'Entrar'
          )}
        </Button>
      </form>
      
      <div className="mt-6 space-y-4 text-center">
        <div className="space-y-2">
          <Button
            variant="link"
            onClick={onForgotPassword}
            className="text-sm hover:text-primary transition-colors duration-200"
            style={{ color: '#888' }}
          >
            Esqueceu sua senha?
          </Button>
          

        </div>
      </div>
    </div>
  )
}

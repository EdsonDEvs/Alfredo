
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signInWithGoogle: () => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔐 AuthProvider: Iniciando listener de autenticação Supabase...')
    
    // Obter sessão atual
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        console.log('🔐 AuthProvider: Sessão encontrada:', session.user.email)
        setUser(session.user)
      }
      setLoading(false)
    }

    getSession()

    // Configurar listener de mudança de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 AuthProvider: Evento de autenticação:', event, session?.user?.email)
        
        if (session?.user) {
          console.log('🔐 AuthProvider: Usuário logado:', session.user.email)
          setUser(session.user)
        } else {
          console.log('🔐 AuthProvider: Usuário não logado')
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 Tentando login com Supabase:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('🔐 Erro no login Supabase:', error)
        return { error }
      }

      console.log('🔐 Login Supabase bem-sucedido:', data.user?.email)
      return { error: null }
    } catch (error: any) {
      console.error('🔐 Erro inesperado no login:', error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('🔐 Tentando cadastro com Supabase:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      })

      if (error) {
        console.error('🔐 Erro no cadastro Supabase:', error)
        return { error }
      }

      console.log('🔐 Cadastro Supabase bem-sucedido:', data.user?.email)
      return { error: null }
    } catch (error: any) {
      console.error('🔐 Erro inesperado no cadastro:', error)
      return { error }
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log('🔐 Tentando login Google com Supabase')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('🔐 Erro no login Google Supabase:', error)
        return { error }
      }

      console.log('🔐 Login Google Supabase iniciado')
      return { error: null }
    } catch (error: any) {
      console.error('🔐 Erro inesperado no login Google:', error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      console.log('🔐 Fazendo logout do Supabase')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('🔐 Erro no logout:', error)
      } else {
        console.log('🔐 Logout bem-sucedido')
        setUser(null)
      }
    } catch (error) {
      console.error('🔐 Erro inesperado no logout:', error)
    }
  }

  const resetPassword = async (email: string) => {
    try {
      console.log('🔐 Tentando reset de senha:', email)
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        console.error('🔐 Erro no reset de senha:', error)
        return { error }
      }

      console.log('🔐 Email de reset enviado')
      return { error: null }
    } catch (error: any) {
      console.error('🔐 Erro inesperado no reset de senha:', error)
      return { error }
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

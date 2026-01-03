
import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: any }>
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
      
      // Verificar conectividade básica
      if (!navigator.onLine) {
        const offlineError = new Error('Sem conexão com a internet')
        console.error('🔐 Erro: Sem conexão', offlineError)
        return { error: offlineError }
      }

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
      
      // Melhorar mensagem de erro para "Failed to fetch"
      if (error?.message?.includes('Failed to fetch') || error?.name === 'AuthRetryableFetchError') {
        const networkError = new Error('Erro de conexão. Verifique sua internet e tente novamente.')
        return { error: networkError }
      }
      
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string, phone?: string) => {
    try {
      console.log('🔐 Tentando cadastro com Supabase:', email)
      console.log('🔐 Verificando configuração do Supabase...')
      
      // Normalizar telefone: remover todos os caracteres não numéricos
      const normalizedPhone = phone ? phone.replace(/\D/g, '') : null
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: normalizedPhone,
          }
        }
      })

      if (error) {
        console.error('🔐 Erro no cadastro Supabase:', error)
        
        // Se o erro for "User already registered", informar ao usuário para fazer login
        // O perfil deveria ter sido criado pelo trigger, mas pode não existir
        // Neste caso, o usuário deve fazer login e depois podemos criar o perfil se necessário
        const errorMessage = error?.message || ''
        if (errorMessage.includes('already registered') || errorMessage.includes('email-already-in-use')) {
          console.log('🔐 Usuário já existe no banco. O perfil deveria existir, mas pode estar faltando.')
          console.log('🔐 Se o perfil não existir, execute o script CRIAR-PERFIS-FALTANTES.sql no Supabase.')
        }
        
        return { error }
      }

      // Garantir que o perfil existe (trigger pode não ter executado)
      if (data.user) {
        // Primeiro, verificar se o perfil existe
        const { data: existingProfile, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single()

        if (!existingProfile && checkError?.code === 'PGRST116') {
          // Perfil não existe, criar manualmente
          console.log('🔐 Perfil não encontrado, criando manualmente...')
          
          // Preparar dados do perfil (sem phone se a coluna não existir)
          const profileData: any = {
            id: data.user.id,
            email: data.user.email || email,
            nome: fullName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          
          // Adicionar phone apenas se tiver valor (o banco pode não ter a coluna)
          if (normalizedPhone) {
            profileData.phone = normalizedPhone
          }
          
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(profileData)

          if (insertError) {
            console.error('🔐 Erro ao criar perfil:', insertError)
            // Se o erro for por coluna phone não existir, tentar sem phone
            if (insertError.message?.includes("phone")) {
              console.log('🔐 Tentando criar perfil sem coluna phone...')
              const { error: insertError2 } = await supabase
                .from('profiles')
                .insert({
                  id: data.user.id,
                  email: data.user.email || email,
                  nome: fullName,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              
              if (insertError2) {
                console.error('🔐 Erro ao criar perfil (sem phone):', insertError2)
              } else {
                console.log('🔐 Perfil criado com sucesso (sem phone). Execute ADICIONAR-COLUNA-PHONE.sql no Supabase.')
              }
            }
          } else {
            console.log('🔐 Perfil criado com sucesso')
          }
        } else if (existingProfile && normalizedPhone) {
          // Perfil existe, atualizar com telefone se fornecido
          const updateData: any = {
            nome: fullName,
            updated_at: new Date().toISOString()
          }
          
          // Adicionar phone apenas se tiver valor
          if (normalizedPhone) {
            updateData.phone = normalizedPhone
          }
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('id', data.user.id)

          if (updateError) {
            console.error('🔐 Erro ao atualizar perfil com telefone:', updateError)
            // Se o erro for por coluna phone não existir, atualizar sem phone
            if (updateError.message?.includes("phone")) {
              console.log('🔐 Coluna phone não existe. Atualizando apenas nome...')
              const { error: updateError2 } = await supabase
                .from('profiles')
                .update({ 
                  nome: fullName,
                  updated_at: new Date().toISOString()
                })
                .eq('id', data.user.id)
              
              if (updateError2) {
                console.error('🔐 Erro ao atualizar perfil:', updateError2)
              } else {
                console.log('🔐 Perfil atualizado (sem phone). Execute ADICIONAR-COLUNA-PHONE.sql no Supabase.')
              }
            }
          } else {
            console.log('🔐 Telefone salvo no perfil:', normalizedPhone)
          }
        }
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

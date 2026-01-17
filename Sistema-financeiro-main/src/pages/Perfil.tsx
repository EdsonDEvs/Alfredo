import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Camera, User, Trash2, Settings, CreditCard, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { CurrencySelector } from '@/components/profile/CurrencySelector'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Perfil() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [creatingUser, setCreatingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    userId: '',
    email: '',
    nome: '',
    plan: 'basic',
    status: 'active',
    endDate: '',
  })

  const [formData, setFormData] = useState({
    nome: '',
    phone: '',
    whatsapp: '',
    subscription_status: 'active'
  })

  useEffect(() => {
    if (user?.id) {
      fetchProfile()
    }
  }, [user?.id])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (data) {
        setProfile(data)
        setFormData({
          nome: data.nome || '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          subscription_status: data.subscription_status || 'active'
        })
      }
    } catch (error: any) {
      console.error('Erro ao carregar perfil:', error)
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  const fallbackAdmins = ['edsons@gmail.com']
  const allowedAdmins = adminEmails.length ? adminEmails : fallbackAdmins
  const isAdmin = !!user?.email && allowedAdmins.includes(user.email.toLowerCase())

  const handleCreateSimpleUser = async () => {
    if (!newUser.userId || !newUser.email || !newUser.nome) {
      toast({
        title: "Preencha todos os campos",
        description: "userId, email e nome são obrigatórios.",
        variant: "destructive",
      })
      return
    }

    setCreatingUser(true)
    try {
      const now = new Date().toISOString()
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: newUser.userId,
          email: newUser.email,
          nome: newUser.nome,
          subscription_status: newUser.status,
          updated_at: now,
        })

      if (profileError) {
        throw new Error(profileError.message)
      }

      const endDate = newUser.endDate ? new Date(newUser.endDate).toISOString() : null
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          id: crypto.randomUUID(),
          user_id: newUser.userId,
          status: newUser.status,
          plan_name: newUser.plan,
          start_date: now,
          end_date: endDate,
          created_at: now,
          updated_at: now,
        })

      if (subscriptionError) {
        throw new Error(subscriptionError.message)
      }

      toast({
        title: "Usuário criado",
        description: "Perfil e assinatura salvos com sucesso.",
      })

      setNewUser({
        userId: '',
        email: '',
        nome: '',
        plan: 'basic',
        status: 'active',
        endDate: '',
      })
    } catch (error: any) {
      toast({
        title: "Erro ao criar usuário",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setCreatingUser(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          nome: formData.nome,
          phone: formData.phone,
          whatsapp: formData.whatsapp,
          subscription_status: formData.subscription_status,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!",
      })

      // Recarregar perfil
      fetchProfile()
      
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error)
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Deletar perfil
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)

      if (error) {
        throw new Error(error.message)
      }

      // Fazer logout
      await signOut()
      navigate('/auth')
      
      toast({
        title: "Conta deletada",
        description: "Sua conta foi removida com sucesso.",
      })
      
    } catch (error: any) {
      console.error('Erro ao deletar conta:', error)
      toast({
        title: "Erro ao deletar conta",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Perfil</h1>
          <p className="text-sm sm:text-base text-gray-600">Gerencie suas informações pessoais</p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Informações do Perfil */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-sm sm:text-base">
                      {profile?.nome?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{profile?.nome || user?.email || 'Usuário'}</p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{user?.email}</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="nome" className="text-xs sm:text-sm">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    placeholder="Seu nome completo"
                    className="text-xs sm:text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-xs sm:text-sm">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+55 11 99999-9999"
                    className="text-xs sm:text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp" className="text-xs sm:text-sm">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="5511999999999"
                    className="text-xs sm:text-sm mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Formato: 5511999999999 (sem +)
                  </p>
                </div>

                <Button type="submit" disabled={saving} className="w-full sm:w-auto text-sm sm:text-base">
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Seletor de Moeda */}
          <CurrencySelector />

          {/* Admin: criação simples de usuário */}
          {isAdmin && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  Admin - Criar usuário simples
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="newUserId" className="text-xs sm:text-sm">User ID (Auth)</Label>
                    <Input
                      id="newUserId"
                      value={newUser.userId}
                      onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
                      placeholder="uuid do usuário"
                      className="text-xs sm:text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserEmail" className="text-xs sm:text-sm">Email</Label>
                    <Input
                      id="newUserEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="email@dominio.com"
                      className="text-xs sm:text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserNome" className="text-xs sm:text-sm">Nome</Label>
                    <Input
                      id="newUserNome"
                      value={newUser.nome}
                      onChange={(e) => setNewUser({ ...newUser, nome: e.target.value })}
                      placeholder="Nome completo"
                      className="text-xs sm:text-sm mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Plano</Label>
                    <Select
                      value={newUser.plan}
                      onValueChange={(value) => setNewUser({ ...newUser, plan: value })}
                    >
                      <SelectTrigger className="text-xs sm:text-sm mt-1">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Básico</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm">Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                    >
                      <SelectTrigger className="text-xs sm:text-sm mt-1">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="newUserEndDate" className="text-xs sm:text-sm">Fim da assinatura (opcional)</Label>
                    <Input
                      id="newUserEndDate"
                      type="date"
                      value={newUser.endDate}
                      onChange={(e) => setNewUser({ ...newUser, endDate: e.target.value })}
                      className="text-xs sm:text-sm mt-1"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateSimpleUser}
                  disabled={creatingUser}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  {creatingUser ? 'Criando...' : 'Criar usuário'}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Esse formulário cria/atualiza o perfil e registra a assinatura do usuário.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-4">
          {/* Status da Assinatura */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5" />
                Assinatura
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Status:</span>
                  <Badge variant={profile?.subscription_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                    {profile?.subscription_status || 'active'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-gray-600">Email:</span>
                  <span className="text-xs sm:text-sm font-medium truncate ml-2">{profile?.email || user?.email || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                Ações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-4 sm:p-6 pt-0">
              <Button variant="outline" className="w-full text-sm sm:text-base" onClick={() => signOut()}>
                Sair
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full text-sm sm:text-base">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    Deletar Conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-[95vw] sm:max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg sm:text-xl">Deletar Conta</AlertDialogTitle>
                    <AlertDialogDescription className="text-xs sm:text-sm">
                      Esta ação não pode ser desfeita. Isso irá remover permanentemente sua conta e todos os dados associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                    <AlertDialogCancel className="w-full sm:w-auto text-sm">Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-red-600 hover:bg-red-700 w-full sm:w-auto text-sm"
                      disabled={deleting}
                    >
                      {deleting ? 'Deletando...' : 'Deletar Conta'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

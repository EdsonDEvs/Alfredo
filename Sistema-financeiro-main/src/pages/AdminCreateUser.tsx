import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const getAllowedAdmins = () => {
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
  const fallbackAdmins = ['edsons@gmail.com', 'edson@gmail.com']
  return adminEmails.length ? adminEmails : fallbackAdmins
}

export default function AdminCreateUser() {
  const { user } = useAuth()
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    userId: '',
    email: '',
    nome: '',
    plan: 'basic',
    status: 'active',
    endDate: '',
  })

  const isAdmin = !!user?.email && getAllowedAdmins().includes(user.email.toLowerCase())

  useEffect(() => {
    if (!form.userId) {
      setForm((prev) => ({ ...prev, userId: crypto.randomUUID() }))
    }
  }, [form.userId])

  const handleCreate = async () => {
    if (!form.userId || !form.email || !form.nome) {
      toast({
        title: 'Preencha todos os campos',
        description: 'userId, email e nome são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const now = new Date().toISOString()
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: form.userId,
          email: form.email,
          nome: form.nome,
          subscription_status: form.status,
          updated_at: now,
        })

      if (profileError) {
        throw new Error(profileError.message)
      }

      const endDate = form.endDate ? new Date(form.endDate).toISOString() : null
      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert({
          id: crypto.randomUUID(),
          user_id: form.userId,
          status: form.status,
          plan_name: form.plan,
          start_date: now,
          end_date: endDate,
          created_at: now,
          updated_at: now,
        })

      if (subscriptionError) {
        throw new Error(subscriptionError.message)
      }

      toast({
        title: 'Usuário criado',
        description: 'Perfil e assinatura salvos com sucesso.',
      })

      setForm({
        userId: '',
        email: '',
        nome: '',
        plan: 'basic',
        status: 'active',
        endDate: '',
      })
    } catch (error: any) {
      toast({
        title: 'Erro ao criar usuário',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setCreating(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground">Acesso restrito.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Criar usuário simples</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados básicos e salve no banco.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados do usuário</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="userId">User ID (Auth)</Label>
              <div className="flex gap-2">
                <Input
                  id="userId"
                  value={form.userId}
                  onChange={(e) => setForm({ ...form, userId: e.target.value })}
                  placeholder="uuid do usuário"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setForm({ ...form, userId: crypto.randomUUID() })}
                >
                  Gerar ID
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@dominio.com"
              />
            </div>
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label>Plano</Label>
              <Select
                value={form.plan}
                onValueChange={(value) => setForm({ ...form, plan: value })}
              >
                <SelectTrigger>
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
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger>
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
              <Label htmlFor="endDate">Fim da assinatura (opcional)</Label>
              <Input
                id="endDate"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? 'Criando...' : 'Criar usuário'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

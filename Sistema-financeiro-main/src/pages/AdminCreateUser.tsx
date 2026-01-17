import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

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
    password: '',
    whatsapp: '',
  })

  const isAdmin = !!user?.email && getAllowedAdmins().includes(user.email.toLowerCase())

  useEffect(() => {
    if (!form.userId) {
      setForm((prev) => ({ ...prev, userId: crypto.randomUUID() }))
    }
  }, [form.userId])

  const handleCreate = async () => {
    if (!form.email || !form.nome || !form.password || !form.whatsapp) {
      toast({
        title: 'Preencha todos os campos',
        description: 'Nome, email, senha e WhatsApp são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setCreating(true)
    try {
      const { data, error } = await supabase.functions.invoke('create-user-simple', {
        body: {
          nome: form.nome,
          email: form.email,
          password: form.password,
          whatsapp: form.whatsapp,
        },
      })

      if (error) {
        throw error
      }

      if (data?.error) {
        throw new Error(data.error)
      }

      toast({
        title: 'Usuário criado',
        description: 'Usuário criado no Auth e perfil salvo.',
      })

      setForm({
        email: '',
        nome: '',
        password: '',
        whatsapp: '',
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
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Senha do usuário"
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="5511999999999"
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

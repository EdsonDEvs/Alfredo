import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'

export default function PublicCreateUser() {
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({
    email: '',
    nome: '',
    password: '',
    whatsapp: '',
  })

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
        description: 'Conta criada com sucesso.',
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Criar usuário simples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="publicEmail">Email</Label>
              <Input
                id="publicEmail"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@dominio.com"
              />
            </div>
            <div>
              <Label htmlFor="publicNome">Nome</Label>
              <Input
                id="publicNome"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="publicPassword">Senha</Label>
              <Input
                id="publicPassword"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Senha do usuário"
              />
            </div>
            <div>
              <Label htmlFor="publicWhatsapp">WhatsApp</Label>
              <Input
                id="publicWhatsapp"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="5511999999999"
              />
            </div>
          </div>
          <Button onClick={handleCreate} disabled={creating} className="w-full">
            {creating ? 'Criando...' : 'Criar usuário'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

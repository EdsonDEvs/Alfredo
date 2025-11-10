
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Bell, Calendar, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { formatDate } from '@/utils/date'
import { supabase } from '@/lib/supabase'

interface Lembrete {
  id: string
  titulo: string
  descricao?: string
  valor?: number
  data_vencimento: string
  status: 'pendente' | 'pago' | 'atrasado'
  user_id: string
  created_at: string
  updated_at: string
}

export default function Lembretes() {
  const { user } = useAuth()
  const [lembretes, setLembretes] = useState<Lembrete[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLembrete, setEditingLembrete] = useState<Lembrete | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    valor: 0,
    data_vencimento: '',
    status: 'pendente' as 'pendente' | 'pago' | 'atrasado'
  })

  // Carregar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar lembretes
      const { data, error } = await supabase
        .from('lembretes')
        .select('*')
        .eq('user_id', user.id)
        .order('data_vencimento', { ascending: true })

      if (error) {
        throw new Error(error.message)
      }

      setLembretes(data || [])
      
    } catch (error: any) {
      console.error('Erro ao carregar lembretes:', error)
      toast({
        title: "Erro ao carregar lembretes",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar dados quando o componente montar
  useEffect(() => {
    if (user?.id) {
      fetchData()
    }
  }, [user])

  // Organizar lembretes por status
  const lembretesPendentes = lembretes.filter(l => l.status === 'pendente')
  const lembretesPagos = lembretes.filter(l => l.status === 'pago')
  const lembretesAtrasados = lembretes.filter(l => l.status === 'atrasado')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      if (editingLembrete) {
        // Atualizar lembrete existente
        const { error } = await supabase
          .from('lembretes')
          .update({
            titulo: formData.titulo,
            descricao: formData.descricao,
            valor: formData.valor,
            data_vencimento: formData.data_vencimento,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingLembrete.id)

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Lembrete atualizado",
          description: "Lembrete foi atualizado com sucesso!",
        })
      } else {
        // Criar novo lembrete
        const { error } = await supabase
          .from('lembretes')
          .insert({
            titulo: formData.titulo,
            descricao: formData.descricao,
            valor: formData.valor,
            data_vencimento: formData.data_vencimento,
            status: formData.status,
            user_id: user.id
          })

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Lembrete criado",
          description: "Novo lembrete foi criado com sucesso!",
        })
      }

      setDialogOpen(false)
      setEditingLembrete(null)
      setFormData({ titulo: '', descricao: '', valor: 0, data_vencimento: '', status: 'pendente' })
      fetchData()
      
    } catch (error: any) {
      console.error('Erro ao salvar lembrete:', error)
      toast({
        title: "Erro ao salvar lembrete",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (lembrete: Lembrete) => {
    setEditingLembrete(lembrete)
    setFormData({
      titulo: lembrete.titulo,
      descricao: lembrete.descricao || '',
      valor: lembrete.valor || 0,
      data_vencimento: lembrete.data_vencimento,
      status: lembrete.status
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este lembrete?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('lembretes')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Lembrete excluído",
        description: "Lembrete foi removido com sucesso!",
      })
      fetchData()
    } catch (error: any) {
      console.error('Erro ao deletar lembrete:', error)
      toast({
        title: "Erro ao excluir lembrete",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, newStatus: 'pendente' | 'pago' | 'atrasado') => {
    try {
      const { error } = await supabase
        .from('lembretes')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Status atualizado",
        description: "Status do lembrete foi alterado!",
      })
      fetchData()
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      })
    }
  }



  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando lembretes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lembretes</h1>
          <p className="text-gray-600">Gerencie seus lembretes de pagamentos</p>
        </div>
        <Button onClick={() => {
          setEditingLembrete(null)
          setFormData({ titulo: '', descricao: '', valor: 0, data_vencimento: '', status: 'pendente' })
          setDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Lembrete
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{lembretesPendentes.length}</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{lembretesAtrasados.length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pagos</p>
                <p className="text-2xl font-bold text-green-600">{lembretesPagos.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de lembretes */}
      <div className="space-y-4">
        {lembretes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhum lembrete criado</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeiro lembrete
              </Button>
            </CardContent>
          </Card>
        ) : (
          lembretes.map((lembrete) => (
            <Card key={lembrete.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{lembrete.titulo}</h3>
                      <Badge 
                        variant={
                          lembrete.status === 'pago' ? 'default' :
                          lembrete.status === 'atrasado' ? 'destructive' : 'secondary'
                        }
                      >
                        {lembrete.status}
                      </Badge>
                    </div>
                    {lembrete.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{lembrete.descricao}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(lembrete.data_vencimento)}
                      </span>
                      {lembrete.valor && lembrete.valor > 0 && (
                        <span>{formatCurrency(lembrete.valor)}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(lembrete)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(lembrete.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog para criar/editar lembrete */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLembrete ? 'Editar Lembrete' : 'Novo Lembrete'}
            </DialogTitle>
            <DialogDescription>
              {editingLembrete 
                ? 'Faça as alterações necessárias no lembrete.' 
                : 'Crie um novo lembrete de pagamento.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                placeholder="Ex: Conta de luz, Aluguel..."
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Detalhes adicionais..."
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor (opcional)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                placeholder="0,00"
              />
            </div>

            <div>
              <Label htmlFor="data_vencimento">Data de Vencimento</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) => setFormData({...formData, data_vencimento: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                className="w-full p-2 border rounded-md"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
                <option value="atrasado">Atrasado</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {editingLembrete ? 'Atualizar' : 'Criar'} Lembrete
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

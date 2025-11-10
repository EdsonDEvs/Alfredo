
import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '@/utils/currency'
import { formatDate, formatTime } from '@/utils/date'
import type { Transacao } from '@/lib/supabase'

export default function Transacoes() {
  const { user } = useAuth()
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const [formData, setFormData] = useState({
    quando: '',
    estabelecimento: '',
    valor: 0,
    detalhes: '',
    tipo: '',
    category_id: '',
  })

  // Carregar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar transações
      const transacoesData = await TransacoesService.getTransacoes(user.id)
      setTransacoes(transacoesData || [])
      
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error)
      toast({
        title: "Erro ao carregar dados",
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

  // Transações filtradas
  const filteredTransacoes = transacoes.filter(transacao => {
    const matchesSearch = !searchTerm || 
      (transacao.estabelecimento?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesType = typeFilter === 'all' || transacao.tipo === typeFilter
    return matchesSearch && matchesType
  })

  // Cálculo dos totais
  const totalReceitas = filteredTransacoes
    .filter(t => t.tipo === 'receita')
    .reduce((acc, t) => acc + (t.valor || 0), 0)
  
  const totalDespesas = filteredTransacoes
    .filter(t => t.tipo === 'despesa')
    .reduce((acc, t) => acc + (t.valor || 0), 0)
  
  const saldo = totalReceitas - totalDespesas

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando transações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Transações</h1>
          <p className="text-gray-600">Gerencie suas receitas e despesas</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Receitas</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceitas)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Despesas</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalDespesas)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Saldo</p>
                <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(saldo)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por estabelecimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de transações */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {filteredTransacoes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              filteredTransacoes.map((transacao) => (
                <div key={transacao.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${transacao.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transacao.tipo === 'receita' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transacao.estabelecimento}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{formatDate(transacao.quando)}</span>
                        {transacao.created_at && (
                          <>
                            <span>•</span>
                            <span>{formatTime(transacao.created_at)}</span>
                          </>
                        )}
                      </div>
                      {transacao.detalhes && (
                        <p className="text-sm text-gray-500">{transacao.detalhes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'}{formatCurrency(transacao.valor)}
                    </p>
                    <Badge variant="outline" className="mt-1">
                      {transacao.categorias?.nome || 'Sem categoria'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para nova transação */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogDescription>
              Adicione uma nova receita ou despesa
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="quando">Data</Label>
              <Input
                id="quando"
                type="date"
                value={formData.quando}
                onChange={(e) => setFormData({...formData, quando: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="estabelecimento">Estabelecimento</Label>
              <Input
                id="estabelecimento"
                value={formData.estabelecimento}
                onChange={(e) => setFormData({...formData, estabelecimento: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="valor">Valor</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="detalhes">Detalhes</Label>
              <Textarea
                id="detalhes"
                value={formData.detalhes}
                onChange={(e) => setFormData({...formData, detalhes: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Funcionalidade em desenvolvimento",
                  description: "Criação de transações será implementada em breve",
                })
                setDialogOpen(false)
              }}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

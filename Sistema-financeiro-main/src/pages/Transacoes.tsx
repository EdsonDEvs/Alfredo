
import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useTransacoesSync, notifyTransacoesUpdate } from '@/hooks/useTransacoesSync'
import { TransacoesService } from '@/services/transacoes'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import { useFormattedCurrency } from '@/hooks/useFormattedCurrency'
import { formatDate, formatTime } from '@/utils/date'
import type { Transacao } from '@/lib/supabase'

export default function Transacoes() {
  const { transacoes, loading: isLoading, refresh, lastUpdate } = useTransacoesSync()
  const { format } = useFormattedCurrency()
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
    <div className="space-y-4 sm:space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold">Transações</h1>
          <p className="text-sm sm:text-base text-gray-600">Gerencie suas receitas e despesas</p>
          <p className="text-xs text-gray-400 mt-1">
            Total: {transacoes.length} | Atualizado: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading} className="flex-1 sm:flex-initial text-xs sm:text-sm">
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1 sm:flex-initial text-xs sm:text-sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Nova Transação</span>
                <span className="sm:hidden">Nova</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl">Nova Transação</DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Adicione uma nova receita ou despesa
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4">
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
      </div>

      {/* Cards de resumo */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Receitas</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">{format(totalReceitas)}</p>
              </div>
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Despesas</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-600">{format(totalDespesas)}</p>
              </div>
              <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Saldo</p>
                <p className={`text-lg sm:text-xl md:text-2xl font-bold ${saldo >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {format(saldo)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
            <div>
              <Label htmlFor="search" className="text-xs sm:text-sm">Buscar</Label>
              <Input
                id="search"
                placeholder="Buscar por estabelecimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-xs sm:text-sm mt-1"
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-xs sm:text-sm">Tipo</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="text-xs sm:text-sm mt-1">
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
        <CardContent className="p-3 sm:p-4">
          <div className="space-y-3 sm:space-y-4">
            {filteredTransacoes.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <p className="text-sm sm:text-base text-gray-500">Nenhuma transação encontrada</p>
              </div>
            ) : (
              filteredTransacoes.map((transacao) => (
                <div key={transacao.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                    <div className={`p-1.5 sm:p-2 rounded-full ${transacao.tipo === 'receita' ? 'bg-green-100' : 'bg-red-100'}`}>
                      {transacao.tipo === 'receita' ? (
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{transacao.estabelecimento}</p>
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                        <span>{formatDate(transacao.quando)}</span>
                        {transacao.created_at && (
                          <>
                            <span>•</span>
                            <span>{formatTime(transacao.created_at)}</span>
                          </>
                        )}
                      </div>
                      {transacao.detalhes && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{transacao.detalhes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-end sm:text-right gap-2 sm:gap-1">
                    <p className={`font-bold text-sm sm:text-base ${transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'}`}>
                      {transacao.tipo === 'receita' ? '+' : '-'}{format(transacao.valor)}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {transacao.categorias?.nome || 'Sem categoria'}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

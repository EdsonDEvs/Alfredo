import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { MetasService } from '@/services/metas'
import { toast } from '@/hooks/use-toast'
import { Plus, Target, Filter, Search } from 'lucide-react'
import { MetaCard } from '@/components/metas/MetaCard'
import { MetaForm } from '@/components/metas/MetaForm'
import { MetaStats } from '@/components/metas/MetaStats'
import type { Meta, MetaProgresso, MetaEstatisticas } from '@/types/meta'

export default function Metas() {
  const { user } = useAuth()
  const [metas, setMetas] = useState<Meta[]>([])
  const [progressos, setProgressos] = useState<MetaProgresso[]>([])
  const [estatisticas, setEstatisticas] = useState<MetaEstatisticas | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tipoFilter, setTipoFilter] = useState('all')

  // Carregar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      const [metasData, estatisticasData] = await Promise.all([
        MetasService.getMetas(user.id),
        MetasService.getEstatisticas(user.id)
      ])

      setMetas(metasData)
      setEstatisticas(estatisticasData)
      
      // Calcular progressos
      const progressosData = metasData.map(meta => MetasService.calcularProgresso(meta))
      setProgressos(progressosData)
      
    } catch (error: any) {
      console.error('Erro ao carregar metas:', error)
      toast({
        title: "Erro ao carregar metas",
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

  // Filtrar metas
  const filteredProgressos = progressos.filter(progresso => {
    const { meta } = progresso
    const matchesSearch = !searchTerm || 
      meta.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (meta.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    const matchesStatus = statusFilter === 'all' || meta.status === statusFilter
    const matchesTipo = tipoFilter === 'all' || meta.tipo === tipoFilter
    return matchesSearch && matchesStatus && matchesTipo
  })

  // Handlers
  const handleCreateMeta = async (metaData: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!user?.id) throw new Error('Usuário não autenticado')
      
      const novaMeta = await MetasService.createMeta({
        ...metaData,
        user_id: user.id
      })
      
      toast({
        title: "Meta criada",
        description: "Nova meta foi criada com sucesso!",
      })
      
      fetchData()
    } catch (error: any) {
      toast({
        title: "Erro ao criar meta",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateMeta = async (metaData: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!editingMeta) return
      
      await MetasService.updateMeta(editingMeta.id, metaData)
      
      toast({
        title: "Meta atualizada",
        description: "Meta foi atualizada com sucesso!",
      })
      
      fetchData()
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar meta",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleDeleteMeta = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) {
      return
    }

    try {
      await MetasService.deleteMeta(id)
      
      toast({
        title: "Meta excluída",
        description: "Meta foi removida com sucesso!",
      })
      
      fetchData()
    } catch (error: any) {
      toast({
        title: "Erro ao excluir meta",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleUpdateProgress = async (id: string, valor: number) => {
    try {
      await MetasService.updateProgresso(id, valor)
      
      toast({
        title: "Progresso atualizado",
        description: "Progresso da meta foi atualizado!",
      })
      
      fetchData()
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar progresso",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta)
    setFormOpen(true)
  }

  const handleFormSubmit = async (metaData: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) => {
    if (editingMeta) {
      await handleUpdateMeta(metaData)
    } else {
      await handleCreateMeta(metaData)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando metas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Metas Financeiras</h1>
          <p className="text-gray-600">Acompanhe seus objetivos financeiros</p>
        </div>
        <Button onClick={() => {
          setEditingMeta(null)
          setFormOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Meta
        </Button>
      </div>

      {/* Estatísticas */}
      {estatisticas && <MetaStats estatisticas={estatisticas} />}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Buscar</span>
              </div>
              <Input
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativa">Ativa</SelectItem>
                  <SelectItem value="concluida">Concluída</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Tipo</span>
              </div>
              <Select value={tipoFilter} onValueChange={setTipoFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="economia">Economia</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                  <SelectItem value="compra">Compra</SelectItem>
                  <SelectItem value="viagem">Viagem</SelectItem>
                  <SelectItem value="educacao">Educação</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de metas */}
      <div className="space-y-4">
        {filteredProgressos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">
                {metas.length === 0 
                  ? 'Nenhuma meta criada ainda' 
                  : 'Nenhuma meta encontrada com os filtros aplicados'}
              </p>
              {metas.length === 0 && (
                <Button onClick={() => setFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira meta
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProgressos.map((progresso) => (
              <MetaCard
                key={progresso.meta.id}
                progresso={progresso}
                onEdit={handleEdit}
                onDelete={handleDeleteMeta}
                onUpdateProgress={handleUpdateProgress}
              />
            ))}
          </div>
        )}
      </div>

      {/* Formulário */}
      <MetaForm
        open={formOpen}
        onOpenChange={setFormOpen}
        meta={editingMeta}
        onSubmit={handleFormSubmit}
      />
    </div>
  )
}

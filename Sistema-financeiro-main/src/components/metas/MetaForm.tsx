import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Target, TrendingUp, ShoppingCart, Plane, GraduationCap, Settings } from 'lucide-react'
import type { Meta, TipoMeta, PrioridadeMeta } from '@/types/meta'

interface MetaFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meta?: Meta | null
  onSubmit: (meta: Omit<Meta, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
}

const tiposMeta: { value: TipoMeta; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'economia', label: 'Economia', icon: <TrendingUp className="h-4 w-4" />, color: 'green' },
  { value: 'investimento', label: 'Investimento', icon: <Target className="h-4 w-4" />, color: 'blue' },
  { value: 'compra', label: 'Compra', icon: <ShoppingCart className="h-4 w-4" />, color: 'purple' },
  { value: 'viagem', label: 'Viagem', icon: <Plane className="h-4 w-4" />, color: 'orange' },
  { value: 'educacao', label: 'Educação', icon: <GraduationCap className="h-4 w-4" />, color: 'indigo' },
  { value: 'outro', label: 'Outro', icon: <Settings className="h-4 w-4" />, color: 'gray' }
]

const prioridades: { value: PrioridadeMeta; label: string; color: string }[] = [
  { value: 'baixa', label: 'Baixa', color: 'bg-green-100 text-green-800' },
  { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alta', label: 'Alta', color: 'bg-red-100 text-red-800' }
]

export function MetaForm({ open, onOpenChange, meta, onSubmit }: MetaFormProps) {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    valor_meta: 0,
    valor_atual: 0,
    tipo: '' as TipoMeta,
    categoria: '',
    data_inicio: '',
    data_fim: '',
    prioridade: 'media' as PrioridadeMeta,
    cor: '',
    icone: '',
    lembretes_ativos: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (meta) {
      setFormData({
        titulo: meta.titulo,
        descricao: meta.descricao || '',
        valor_meta: meta.valor_meta,
        valor_atual: meta.valor_atual,
        tipo: meta.tipo,
        categoria: meta.categoria || '',
        data_inicio: meta.data_inicio,
        data_fim: meta.data_fim,
        prioridade: meta.prioridade,
        cor: meta.cor || '',
        icone: meta.icone || '',
        lembretes_ativos: meta.lembretes_ativos
      })
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        valor_meta: 0,
        valor_atual: 0,
        tipo: '' as TipoMeta,
        categoria: '',
        data_inicio: new Date().toISOString().split('T')[0],
        data_fim: '',
        prioridade: 'media',
        cor: '',
        icone: '',
        lembretes_ativos: true
      })
    }
  }, [meta, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.titulo || !formData.valor_meta || !formData.tipo || !formData.data_fim) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        user_id: '', // Será preenchido pelo componente pai
        titulo: formData.titulo,
        descricao: formData.descricao,
        valor_meta: formData.valor_meta,
        valor_atual: formData.valor_atual,
        tipo: formData.tipo,
        categoria: formData.categoria,
        data_inicio: formData.data_inicio,
        data_fim: formData.data_fim,
        status: 'ativa',
        prioridade: formData.prioridade,
        cor: formData.cor,
        icone: formData.icone,
        lembretes_ativos: formData.lembretes_ativos
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar meta:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTipo = tiposMeta.find(t => t.value === formData.tipo)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {meta ? 'Editar Meta' : 'Nova Meta Financeira'}
          </DialogTitle>
          <DialogDescription>
            {meta 
              ? 'Faça as alterações necessárias na sua meta.' 
              : 'Crie uma nova meta financeira para acompanhar seus objetivos.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título da Meta *</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                placeholder="Ex: Comprar um carro, Fazer uma viagem..."
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                placeholder="Detalhes sobre sua meta..."
                rows={3}
              />
            </div>
          </div>

          {/* Tipo e categoria */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tipo">Tipo de Meta *</Label>
              <Select value={formData.tipo} onValueChange={(value: TipoMeta) => setFormData({...formData, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposMeta.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      <div className="flex items-center gap-2">
                        {tipo.icon}
                        {tipo.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="categoria">Categoria (opcional)</Label>
              <Input
                id="categoria"
                value={formData.categoria}
                onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                placeholder="Ex: Pessoal, Trabalho, Família..."
              />
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="valor_meta">Valor da Meta (R$) *</Label>
              <Input
                id="valor_meta"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_meta}
                onChange={(e) => setFormData({...formData, valor_meta: parseFloat(e.target.value) || 0})}
                placeholder="0,00"
                required
              />
            </div>

            <div>
              <Label htmlFor="valor_atual">Valor Atual (R$)</Label>
              <Input
                id="valor_atual"
                type="number"
                step="0.01"
                min="0"
                value={formData.valor_atual}
                onChange={(e) => setFormData({...formData, valor_atual: parseFloat(e.target.value) || 0})}
                placeholder="0,00"
              />
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data_inicio">Data de Início</Label>
              <Input
                id="data_inicio"
                type="date"
                value={formData.data_inicio}
                onChange={(e) => setFormData({...formData, data_inicio: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="data_fim">Data de Conclusão *</Label>
              <Input
                id="data_fim"
                type="date"
                value={formData.data_fim}
                onChange={(e) => setFormData({...formData, data_fim: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <Label>Prioridade</Label>
            <div className="flex gap-2 mt-2">
              {prioridades.map((prioridade) => (
                <Button
                  key={prioridade.value}
                  type="button"
                  variant={formData.prioridade === prioridade.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormData({...formData, prioridade: prioridade.value})}
                  className={formData.prioridade === prioridade.value ? prioridade.color : ''}
                >
                  {prioridade.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Preview do tipo selecionado */}
          {selectedTipo && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full bg-${selectedTipo.color}-100`}>
                  {selectedTipo.icon}
                </div>
                <div>
                  <h4 className="font-medium">{selectedTipo.label}</h4>
                  <p className="text-sm text-muted-foreground">
                    Tipo de meta selecionado
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : (meta ? 'Atualizar' : 'Criar')} Meta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

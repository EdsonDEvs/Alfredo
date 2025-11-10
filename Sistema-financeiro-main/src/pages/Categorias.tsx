
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { Plus, Edit, Trash2, Folder, FolderOpen } from 'lucide-react'
import type { Categoria } from '@/lib/supabase'

export default function Categorias() {
  const { user } = useAuth()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null)

  const [formData, setFormData] = useState({
    nome: '',
    parent_id: 'none',
    cor: '#3B82F6'
  })

  // Carregar dados
  const fetchData = async () => {
    try {
      setIsLoading(true)
      
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      // Buscar categorias
      const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('userid', user.id)
        .order('nome')

      if (error) {
        throw new Error(error.message)
      }

      setCategorias(data || [])
      
    } catch (error: any) {
      console.error('Erro ao carregar categorias:', error)
      toast({
        title: "Erro ao carregar categorias",
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

  // Organizar categorias em hierarquia
  const categoriasPrincipais = categorias.filter(cat => !cat.parent_id)
  const subcategorias = categorias.filter(cat => cat.parent_id)

  const getSubcategorias = (parentId: string) => {
    return subcategorias.filter(cat => cat.parent_id === parentId)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado')
      }

      if (editingCategory) {
        // Atualizar categoria existente
        const { error } = await supabase
          .from('categorias')
          .update({
            nome: formData.nome,
            parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
            cor: formData.cor
          })
          .eq('id', editingCategory.id)

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Categoria atualizada",
          description: "Categoria foi atualizada com sucesso!",
        })
      } else {
        // Criar nova categoria
        const { error } = await supabase
          .from('categorias')
          .insert({
            nome: formData.nome,
            parent_id: formData.parent_id === 'none' ? null : formData.parent_id,
            cor: formData.cor,
            userid: user.id
          })

        if (error) {
          throw new Error(error.message)
        }

        toast({
          title: "Categoria criada",
          description: "Nova categoria foi criada com sucesso!",
        })
      }

      setDialogOpen(false)
      setEditingCategory(null)
      setFormData({ nome: '', parent_id: 'none', cor: '#3B82F6' })
      fetchData()
      
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error)
      toast({
        title: "Erro ao salvar categoria",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleEdit = (categoria: Categoria) => {
    setEditingCategory(categoria)
    setFormData({
      nome: categoria.nome,
      parent_id: categoria.parent_id || 'none',
      cor: '#3B82F6' // Cor padrão
    })
    setDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('categorias')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }

      toast({
        title: "Categoria excluída",
        description: "Categoria foi removida com sucesso!",
      })
      fetchData()
    } catch (error: any) {
      console.error('Erro ao deletar categoria:', error)
      toast({
        title: "Erro ao excluir categoria",
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
          <p className="mt-2 text-gray-600">Carregando categorias...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Categorias</h1>
          <p className="text-gray-600">Organize suas transações por categorias</p>
        </div>
        <Button onClick={() => {
          setEditingCategory(null)
          setFormData({ nome: '', parent_id: 'none', cor: '#3B82F6' })
          setDialogOpen(true)
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {/* Lista de categorias */}
      <div className="grid gap-4">
        {categoriasPrincipais.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Folder className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nenhuma categoria criada</p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar primeira categoria
              </Button>
            </CardContent>
          </Card>
        ) : (
          categoriasPrincipais.map((categoria) => (
            <Card key={categoria.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: formData.cor }}
                    />
                    <div>
                      <h3 className="font-medium">{categoria.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {getSubcategorias(categoria.id).length} subcategorias
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(categoria)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(categoria.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Subcategorias */}
                {getSubcategorias(categoria.id).length > 0 && (
                  <div className="mt-4 ml-6 space-y-2">
                    {getSubcategorias(categoria.id).map((subcategoria) => (
                      <div key={subcategoria.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: formData.cor }}
                          />
                          <span className="text-sm">{subcategoria.nome}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(subcategoria)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(subcategoria.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialog para criar/editar categoria */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? 'Faça as alterações necessárias na categoria.' 
                : 'Crie uma nova categoria para organizar suas transações.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome da Categoria</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Ex: Alimentação, Transporte..."
                required
              />
            </div>

            <div>
              <Label htmlFor="parent_id">Categoria Pai (opcional)</Label>
              <Select 
                value={formData.parent_id} 
                onValueChange={(value) => setFormData({...formData, parent_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria pai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
                  {categoriasPrincipais.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cor">Cor</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="cor"
                  type="color"
                  value={formData.cor}
                  onChange={(e) => setFormData({...formData, cor: e.target.value})}
                  className="w-16 h-10"
                />
                <span className="text-sm text-gray-600">{formData.cor}</span>
              </div>
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
                {editingCategory ? 'Atualizar' : 'Criar'} Categoria
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

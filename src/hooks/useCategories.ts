
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { toast } from 'sonner'
import type { Categoria } from '@/lib/supabase'

export type Category = Categoria

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar categorias do usuário
  const fetchCategories = async () => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await TransacoesService.getCategoriasFlat(user.id)
      setCategories(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar categorias';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova categoria
  const createCategory = async (newCategory: { nome: string; tags?: string }) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const created = await TransacoesService.addCategoria({
        nome: newCategory.nome.trim(),
        tags: newCategory.tags?.trim() || null,
        userid: user.id,
      })

      setCategories(prev => [...prev, created])
      toast.success('Categoria criada com sucesso!')
      return created
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar categoria
  const updateCategory = async ({ id, updates }: { id: string; updates: { nome: string; tags?: string } }) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updated = await TransacoesService.updateCategoria(id, {
        nome: updates.nome.trim(),
        tags: updates.tags?.trim() || null,
      })

      setCategories(prev => prev.map(cat => (cat.id === id ? updated : cat)));
      toast.success('Categoria atualizada com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Deletar categoria
  const deleteCategory = async (id: string) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await TransacoesService.deleteCategoria(id)

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast.success('Categoria deletada com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar categoria';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Buscar categorias quando o usuário mudar
  useEffect(() => {
    if (user?.id) {
      fetchCategories();
    } else {
      setCategories([]);
      setError(null);
    }
  }, [user?.id]);

  // Função para limpar erros
  const clearError = () => setError(null);

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    fetchCategories,
    clearError,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

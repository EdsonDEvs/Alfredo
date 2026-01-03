
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getCategorias, addCategoria, updateCategoria, deleteCategoria } from '@/integrations/firebase/services';
import { toast } from 'sonner';

export interface Category {
  id: string;
  nome: string;
  tags: string | null;
  created_at: string;
  updated_at: string;
  userid: string;
}

export function useCategories() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar categorias do usuário
  const fetchCategories = async () => {
    if (!user?.uid) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getCategorias(user.uid);

      if (fetchError) {
        throw new Error(fetchError);
      }

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
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { id, error: createError } = await addCategoria({
        nome: newCategory.nome.trim(),
        tags: newCategory.tags?.trim() || null,
        userid: user.uid,
      });

      if (createError) {
        throw new Error(createError);
      }

      if (id) {
        const newCategoryData = {
          id,
          nome: newCategory.nome.trim(),
          tags: newCategory.tags?.trim() || null,
          userid: user.uid,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setCategories(prev => [...prev, newCategoryData]);
        toast.success('Categoria criada com sucesso!');
        return newCategoryData;
      }
      return null;
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
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const { error: updateError } = await updateCategoria(id, {
        nome: updates.nome.trim(),
        tags: updates.tags?.trim() || null,
      });

      if (updateError) {
        throw new Error(updateError);
      }

      setCategories(prev => prev.map(cat => 
        cat.id === id 
          ? { ...cat, nome: updates.nome.trim(), tags: updates.tags?.trim() || null, updated_at: new Date().toISOString() }
          : cat
      ));
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
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteCategoria(id);

      if (deleteError) {
        throw new Error(deleteError);
      }

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
    if (user?.uid) {
      fetchCategories();
    } else {
      setCategories([]);
      setError(null);
    }
  }, [user?.uid]);

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

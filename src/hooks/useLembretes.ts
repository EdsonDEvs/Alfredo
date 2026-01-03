import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getLembretes, addLembrete, updateLembrete, deleteLembrete } from '@/integrations/firebase/services';
import { toast } from 'sonner';
import type { Lembrete } from '@/integrations/firebase/types';

export function useLembretes() {
  const { user } = useAuth();
  const [lembretes, setLembretes] = useState<Lembrete[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar lembretes do usuário
  const fetchLembretes = async () => {
    if (!user?.uid) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getLembretes(user.uid);

      if (fetchError) {
        throw new Error(fetchError);
      }

      setLembretes(data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar lembretes';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar novo lembrete
  const createLembrete = async (newLembrete: { descricao: string; data: string; valor: number }) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { id, error: createError } = await addLembrete({
        descricao: newLembrete.descricao.trim(),
        data: newLembrete.data,
        valor: newLembrete.valor,
        userid: user.uid,
      });

      if (createError) {
        throw new Error(createError);
      }

      if (id) {
        const newLembreteData = {
          id,
          descricao: newLembrete.descricao.trim(),
          data: newLembrete.data,
          valor: newLembrete.valor,
          userid: user.uid,
          created_at: new Date().toISOString(),
        };
        setLembretes(prev => [...prev, newLembreteData]);
        toast.success('Lembrete criado com sucesso!');
        return newLembreteData;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar lembrete';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar lembrete
  const updateLembreteById = async ({ id, updates }: { id: string; updates: { descricao: string; data: string; valor: number } }) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const { error: updateError } = await updateLembrete(id, {
        descricao: updates.descricao.trim(),
        data: updates.data,
        valor: updates.valor,
      });

      if (updateError) {
        throw new Error(updateError);
      }

      setLembretes(prev => prev.map(lem => 
        lem.id === id 
          ? { ...lem, descricao: updates.descricao.trim(), data: updates.data, valor: updates.valor }
          : lem
      ));
      toast.success('Lembrete atualizado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar lembrete';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Deletar lembrete
  const deleteLembreteById = async (id: string) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteLembrete(id);

      if (deleteError) {
        throw new Error(deleteError);
      }

      setLembretes(prev => prev.filter(lem => lem.id !== id));
      toast.success('Lembrete deletado com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar lembrete';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Buscar lembretes quando o usuário mudar
  useEffect(() => {
    if (user?.uid) {
      fetchLembretes();
    } else {
      setLembretes([]);
      setError(null);
    }
  }, [user?.uid]); // fetchLembretes não precisa estar nas dependências pois é estável

  // Função para limpar erros
  const clearError = () => setError(null);

  return {
    lembretes,
    isLoading,
    error,
    createLembrete,
    updateLembrete: updateLembreteById,
    deleteLembrete: deleteLembreteById,
    fetchLembretes,
    clearError,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

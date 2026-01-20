import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { toast } from 'sonner'
import type { Lembrete } from '@/lib/supabase'

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
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await TransacoesService.getLembretes(user.id)
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
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const created = await TransacoesService.addLembrete({
        descricao: newLembrete.descricao.trim(),
        data: newLembrete.data,
        valor: newLembrete.valor,
        userid: user.id,
      })

      setLembretes(prev => [...prev, created])
      toast.success('Lembrete criado com sucesso!')
      return created
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
  const updateLembreteById = async ({ id, updates }: { id: number; updates: { descricao: string; data: string; valor: number } }) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updated = await TransacoesService.updateLembrete(id, {
        descricao: updates.descricao.trim(),
        data: updates.data,
        valor: updates.valor,
      })

      setLembretes(prev => prev.map(lem => (lem.id === id ? updated : lem)))
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
  const deleteLembreteById = async (id: number) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await TransacoesService.deleteLembrete(id)

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
    if (user?.id) {
      fetchLembretes();
    } else {
      setLembretes([]);
      setError(null);
    }
  }, [user?.id]); // fetchLembretes não precisa estar nas dependências pois é estável

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

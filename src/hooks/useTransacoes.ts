import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { TransacoesService } from '@/services/transacoes'
import { toast } from 'sonner'
import type { Transacao } from '@/lib/supabase'

export function useTransacoes() {
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar transações do usuário
  const fetchTransacoes = async () => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      return;
    }

    console.log('🔍 useTransacoes: Iniciando busca para usuário:', user.id);
    setIsLoading(true);
    setError(null);

    try {
      const data = await TransacoesService.getTransacoes(user.id)
      setTransacoes(data || []);
      console.log('🔍 useTransacoes: Transações definidas:', data?.length || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar transações';
      console.error('❌ useTransacoes: Erro:', errorMessage);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Criar nova transação
  const createTransacao = async (newTransacao: { 
    quando: string; 
    estabelecimento: string; 
    valor: number; 
    detalhes: string; 
    tipo: string; 
    category_id: string; 
  }) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const created = await TransacoesService.addTransacao({
        quando: newTransacao.quando,
        estabelecimento: newTransacao.estabelecimento.trim(),
        valor: newTransacao.valor,
        detalhes: newTransacao.detalhes.trim(),
        tipo: newTransacao.tipo,
        category_id: newTransacao.category_id,
        userid: user.id,
      })

      setTransacoes(prev => [...prev, created])
      toast.success('Transação criada com sucesso!')
      return created
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsCreating(false);
    }
  };

  // Atualizar transação
  const updateTransacaoById = async ({ id, updates }: { 
    id: number; 
    updates: { 
      quando: string; 
      estabelecimento: string; 
      valor: number; 
      detalhes: string; 
      tipo: string; 
      category_id: string; 
    } 
  }) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const updated = await TransacoesService.updateTransacao(id, {
        quando: updates.quando,
        estabelecimento: updates.estabelecimento.trim(),
        valor: updates.valor,
        detalhes: updates.detalhes.trim(),
        tipo: updates.tipo,
        category_id: updates.category_id,
      })

      setTransacoes(prev => prev.map(trans => (trans.id === id ? updated : trans)));
      toast.success('Transação atualizada com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsUpdating(false);
    }
  };

  // Deletar transação
  const deleteTransacaoById = async (id: number) => {
    if (!user?.id) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      await TransacoesService.deleteTransacao(id)

      setTransacoes(prev => prev.filter(trans => trans.id !== id));
      toast.success('Transação deletada com sucesso!');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  // Buscar transações quando o usuário mudar
  useEffect(() => {
    if (user?.id) {
      fetchTransacoes();
    } else {
      setTransacoes([]);
      setError(null);
    }
  }, [user?.id]); // fetchTransacoes não precisa estar nas dependências pois é estável

  // Função para limpar erros
  const clearError = () => setError(null);

  return {
    transacoes,
    isLoading,
    error,
    createTransacao,
    updateTransacao: updateTransacaoById,
    deleteTransacao: deleteTransacaoById,
    fetchTransacoes,
    clearError,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

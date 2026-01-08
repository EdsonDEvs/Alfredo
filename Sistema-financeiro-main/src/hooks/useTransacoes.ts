import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getTransacoes, addTransacao, updateTransacao, deleteTransacao } from '@/integrations/firebase/services';
import { toast } from 'sonner';
import type { Transacao } from '@/integrations/firebase/types';

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
    if (!user?.uid) {
      setError('Usuário não autenticado');
      return;
    }

    console.log('🔍 useTransacoes: Iniciando busca para usuário:', user.uid);
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getTransacoes(user.uid);

      console.log('🔍 useTransacoes: Resposta do Firebase:', { data: data?.length, error: fetchError });

      if (fetchError) {
        throw new Error(fetchError);
      }

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
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { id, error: createError } = await addTransacao({
        quando: newTransacao.quando,
        estabelecimento: newTransacao.estabelecimento.trim(),
        valor: newTransacao.valor,
        detalhes: newTransacao.detalhes.trim(),
        tipo: newTransacao.tipo,
        category_id: newTransacao.category_id,
        userid: user.uid,
      });

      if (createError) {
        throw new Error(createError);
      }

      if (id) {
        const newTransacaoData = {
          id,
          quando: newTransacao.quando,
          estabelecimento: newTransacao.estabelecimento.trim(),
          valor: newTransacao.valor,
          detalhes: newTransacao.detalhes.trim(),
          tipo: newTransacao.tipo,
          category_id: newTransacao.category_id,
          userid: user.uid,
          created_at: new Date().toISOString(),
        };
        setTransacoes(prev => [...prev, newTransacaoData]);
        toast.success('Transação criada com sucesso!');
        return newTransacaoData;
      }
      return null;
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
    id: string; 
    updates: { 
      quando: string; 
      estabelecimento: string; 
      valor: number; 
      detalhes: string; 
      tipo: string; 
      category_id: string; 
    } 
  }) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const { error: updateError } = await updateTransacao(id, {
        quando: updates.quando,
        estabelecimento: updates.estabelecimento.trim(),
        valor: updates.valor,
        detalhes: updates.detalhes.trim(),
        tipo: updates.tipo,
        category_id: updates.category_id,
      });

      if (updateError) {
        throw new Error(updateError);
      }

      setTransacoes(prev => prev.map(trans => 
        trans.id === id 
          ? { 
              ...trans, 
              quando: updates.quando,
              estabelecimento: updates.estabelecimento.trim(),
              valor: updates.valor,
              detalhes: updates.detalhes.trim(),
              tipo: updates.tipo,
              category_id: updates.category_id,
            }
          : trans
      ));
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
  const deleteTransacaoById = async (id: string) => {
    if (!user?.uid) {
      toast.error('Usuário não autenticado');
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const { error: deleteError } = await deleteTransacao(id);

      if (deleteError) {
        throw new Error(deleteError);
      }

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
    if (user?.uid) {
      fetchTransacoes();
    } else {
      setTransacoes([]);
      setError(null);
    }
  }, [user?.uid]); // fetchTransacoes não precisa estar nas dependências pois é estável

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

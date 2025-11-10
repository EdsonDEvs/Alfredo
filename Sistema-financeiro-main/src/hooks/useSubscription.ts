import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/integrations/firebase/config';

export interface Subscription {
  id: string;
  userId: string;
  status: 'active' | 'inactive' | 'cancelled' | 'pending';
  plan: 'premium';
  startDate: string;
  endDate: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'subscriptions', user.uid),
      (doc) => {
        if (doc.exists()) {
          setSubscription({ id: doc.id, ...doc.data() } as Subscription);
        } else {
          setSubscription(null);
        }
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Erro ao buscar assinatura:', error);
        setError('Erro ao carregar dados da assinatura');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  const isSubscribed = subscription?.status === 'active';
  const isPending = subscription?.status === 'pending';
  const isCancelled = subscription?.status === 'cancelled';

  return {
    subscription,
    isSubscribed,
    isPending,
    isCancelled,
    loading,
    error
  };
}

import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { Subscription } from '@/hooks/useSubscription';

// Criar ou atualizar assinatura
export const createOrUpdateSubscription = async (
  userId: string, 
  subscriptionData: Partial<Subscription>
) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    
    const subscription: Subscription = {
      id: userId,
      userId,
      status: 'active',
      plan: 'premium',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      paymentMethod: 'asaas',
             amount: 0.01,
      currency: 'BRL',
      autoRenew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...subscriptionData
    };

    await setDoc(subscriptionRef, subscription);
    
    console.log('✅ Assinatura criada/atualizada com sucesso');
    return { data: subscription, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao criar/atualizar assinatura:', error.message);
    return { data: null, error: error.message };
  }
};

// Buscar assinatura do usuário
export const getSubscription = async (userId: string) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    const subscriptionDoc = await getDoc(subscriptionRef);
    
    if (subscriptionDoc.exists()) {
      const subscription = { id: subscriptionDoc.id, ...subscriptionDoc.data() } as Subscription;
      return { data: subscription, error: null };
    } else {
      return { data: null, error: 'Assinatura não encontrada' };
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar assinatura:', error.message);
    return { data: null, error: error.message };
  }
};

// Cancelar assinatura
export const cancelSubscription = async (userId: string) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    
    await updateDoc(subscriptionRef, {
      status: 'cancelled',
      autoRenew: false,
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Assinatura cancelada com sucesso');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao cancelar assinatura:', error.message);
    return { success: false, error: error.message };
  }
};

// Renovar assinatura
export const renewSubscription = async (userId: string) => {
  try {
    const subscriptionRef = doc(db, 'subscriptions', userId);
    
    await updateDoc(subscriptionRef, {
      status: 'active',
      autoRenew: true,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 dias
      updatedAt: new Date().toISOString()
    });
    
    console.log('✅ Assinatura renovada com sucesso');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao renovar assinatura:', error.message);
    return { success: false, error: error.message };
  }
};

// Verificar se assinatura está ativa
export const isSubscriptionActive = async (userId: string) => {
  try {
    const { data: subscription } = await getSubscription(userId);
    
    if (!subscription) {
      return false;
    }
    
    const now = new Date();
    const endDate = new Date(subscription.endDate);
    
    return subscription.status === 'active' && endDate > now;
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error);
    return false;
  }
};

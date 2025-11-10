import { createOrUpdateSubscription } from './subscriptionService';
import { signIn } from './services';

// Configurações do Asaas
const ASAAS_API_URL = 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.VITE_ASAAS_API_KEY || '';

export interface AsaasCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: string;
  province: string;
  postalCode: string;
  cpfCnpj: string;
  personType: 'FISICA' | 'JURIDICA';
  deleted: boolean;
  additionalEmails: string;
  externalReference: string;
  notificationDisabled: boolean;
  observations: string;
}

export interface AsaasPayment {
  id: string;
  customer: string;
  subscription: string;
  installmentNumber: number;
  installmentDescription: string;
  installmentValue: number;
  installmentCount: number;
  installmentId: string;
  dueDate: string;
  originalDueDate: string;
  paymentDate: string;
  clientPaymentDate: string;
  installmentNumber: number;
  invoiceUrl: string;
  bankSlipUrl: string;
  transactionReceiptUrl: string;
  effectiveDate: string;
  situation: 'PENDING' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED' | 'RECEIVED_IN_CASH' | 'REMOVED_BY_RETENTION' | 'REMOVED_BY_PAYMENT_RECEIVED' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_RECEIVED' | 'DUNNING_REQUESTED';
  status: 'PENDING' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED' | 'RECEIVED' | 'RECEIVED_IN_CASH' | 'REMOVED_BY_RETENTION' | 'REMOVED_BY_PAYMENT_RECEIVED' | 'REFUND_REQUESTED' | 'CHARGEBACK_REQUESTED' | 'CHARGEBACK_DISPUTE' | 'AWAITING_CHARGEBACK_REVERSAL' | 'DUNNING_RECEIVED' | 'DUNNING_REQUESTED';
  value: number;
  netValue: number;
  originalValue: number;
  interestValue: number;
  description: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'TRANSFER' | 'DEPOSIT' | 'DEBIT_CARD';
  confirmedDate: string;
  paymentDate: string;
  clientPaymentDate: string;
  installmentNumber: number;
  invoiceUrl: string;
  bankSlipUrl: string;
  transactionReceiptUrl: string;
  effectiveDate: string;
  discount: {
    value: number;
    dueDateLimitDays: number;
    type: 'FIXED' | 'PERCENTAGE';
  };
  interest: {
    value: number;
  };
  fine: {
    value: number;
  };
  postalService: boolean;
  split: Array<{
    walletId: string;
    fixedValue: number;
    percentualValue: number;
    totalFixedValue: number;
    totalPercentualValue: number;
  }>;
}

// Criar cliente no Asaas
export const createAsaasCustomer = async (userData: {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
}) => {
  try {
    const response = await fetch(`${ASAAS_API_URL}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        cpfCnpj: userData.cpfCnpj || '',
        personType: 'FISICA'
      })
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar cliente no Asaas: ${response.statusText}`);
    }

    const customer = await response.json();
    return { data: customer, error: null };
  } catch (error: any) {
    console.error('Erro ao criar cliente no Asaas:', error);
    return { data: null, error: error.message };
  }
};

// Criar pagamento no Asaas
export const createAsaasPayment = async (paymentData: {
  customer: string;
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'TRANSFER' | 'DEPOSIT' | 'DEBIT_CARD';
  value: number;
  dueDate: string;
  description: string;
  externalReference?: string;
}) => {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      },
      body: JSON.stringify(paymentData)
    });

    if (!response.ok) {
      throw new Error(`Erro ao criar pagamento no Asaas: ${response.statusText}`);
    }

    const payment = await response.json();
    return { data: payment, error: null };
  } catch (error: any) {
    console.error('Erro ao criar pagamento no Asaas:', error);
    return { data: null, error: error.message };
  }
};

// Processar webhook do Asaas
export const processAsaasWebhook = async (webhookData: any) => {
  try {
    console.log('📦 Processando webhook do Asaas:', webhookData);

    const { event, payment } = webhookData;

    // Verificar se é um evento de pagamento
    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const customerId = payment.customer;
      const paymentId = payment.id;
      const paymentValue = payment.value;
      const paymentStatus = payment.status;

      console.log('💰 Pagamento confirmado:', {
        customerId,
        paymentId,
        paymentValue,
        paymentStatus
      });

      // Atualizar assinatura no Firebase
      const { data: subscription, error } = await createOrUpdateSubscription(customerId, {
        status: 'active',
        amount: paymentValue / 100, // Asaas envia valores em centavos
        paymentMethod: payment.billingType,
        asaasPaymentId: paymentId
      });

      if (error) {
        console.error('❌ Erro ao atualizar assinatura:', error);
        return { success: false, error };
      }

      console.log('✅ Assinatura atualizada com sucesso:', subscription);
      return { success: true, data: subscription };
    }

    // Outros eventos (pagamento cancelado, reembolso, etc.)
    if (event === 'PAYMENT_REFUNDED' || event === 'PAYMENT_CANCELLED') {
      const customerId = payment.customer;
      
      // Cancelar assinatura no Firebase
      const { success, error } = await createOrUpdateSubscription(customerId, {
        status: 'cancelled'
      });

      if (error) {
        console.error('❌ Erro ao cancelar assinatura:', error);
        return { success: false, error };
      }

      console.log('✅ Assinatura cancelada com sucesso');
      return { success: true };
    }

    return { success: true, message: 'Evento processado' };
  } catch (error: any) {
    console.error('❌ Erro ao processar webhook do Asaas:', error);
    return { success: false, error: error.message };
  }
};

// Verificar status de pagamento
export const checkPaymentStatus = async (paymentId: string) => {
  try {
    const response = await fetch(`${ASAAS_API_URL}/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'access_token': ASAAS_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Erro ao verificar pagamento: ${response.statusText}`);
    }

    const payment = await response.json();
    return { data: payment, error: null };
  } catch (error: any) {
    console.error('Erro ao verificar pagamento:', error);
    return { data: null, error: error.message };
  }
};

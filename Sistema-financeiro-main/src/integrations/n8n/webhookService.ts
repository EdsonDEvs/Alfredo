/**
 * Serviço de integração com n8n para automação de processos
 */

export interface UserCreationData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface FinancialQuestionnaireData {
  userId: string;
  salary: string;
  housingExpense: string;
  transportationExpense: string;
  foodExpense: string;
  healthExpense: string;
  educationExpense: string;
  entertainmentExpense: string;
  savingsGoal: string;
  financialGoal: 'save' | 'invest' | 'debt' | 'budget';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}

export interface PlanSelectionData {
  userId: string;
  name: string;
  email: string;
  phone: string;
  plan: 'basic' | 'premium' | 'professional';
}

export interface N8nResponse {
  success: boolean;
  message?: string;
  userId?: string;
  paymentUrl?: string;
  paymentId?: string;
  error?: string;
}

export class N8nWebhookService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';
  }

  /**
   * Cria um novo usuário através do webhook do n8n
   */
  async createUser(userData: UserCreationData): Promise<N8nResponse> {
    try {
      console.log('🔄 Enviando dados para criação de usuário:', userData);

      const response = await fetch(`${this.baseUrl}/webhook/alfredo-user-creation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Usuário criado com sucesso:', result);

      return result;
    } catch (error) {
      console.error('❌ Erro ao criar usuário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Envia dados do questionário financeiro
   */
  async submitFinancialQuestionnaire(data: FinancialQuestionnaireData): Promise<N8nResponse> {
    try {
      console.log('🔄 Enviando questionário financeiro:', data);

      const response = await fetch(`${this.baseUrl}/webhook/alfredo-financial-questionnaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Questionário processado com sucesso:', result);

      return result;
    } catch (error) {
      console.error('❌ Erro ao processar questionário:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Processa seleção de plano e cria pagamento
   */
  async selectPlan(data: PlanSelectionData): Promise<N8nResponse> {
    try {
      console.log('🔄 Processando seleção de plano:', data);

      const response = await fetch(`${this.baseUrl}/webhook/alfredo-plan-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Plano processado com sucesso:', result);

      return result;
    } catch (error) {
      console.error('❌ Erro ao processar plano:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Verifica status de um pagamento
   */
  async checkPaymentStatus(paymentId: string): Promise<N8nResponse> {
    try {
      console.log('🔄 Verificando status do pagamento:', paymentId);

      const response = await fetch(`${this.baseUrl}/webhook/alfredo-payment-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Status do pagamento:', result);

      return result;
    } catch (error) {
      console.error('❌ Erro ao verificar status do pagamento:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Testa conectividade com o n8n
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/healthz`, {
        method: 'GET',
      });

      return response.ok;
    } catch (error) {
      console.error('❌ Erro ao conectar com n8n:', error);
      return false;
    }
  }
}

// Instância singleton
export const n8nService = new N8nWebhookService();

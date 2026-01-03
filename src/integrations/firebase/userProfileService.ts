import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';

export interface FinancialProfile {
  userId: string;
  salary: number;
  housingExpense: number;
  transportationExpense: number;
  foodExpense: number;
  healthExpense: number;
  educationExpense: number;
  entertainmentExpense: number;
  savingsGoal: number;
  financialGoal: 'save' | 'invest' | 'debt' | 'budget';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  totalExpenses: number;
  availableForSavings: number;
  createdAt: string;
  updatedAt: string;
}

// Converter string de moeda para número
export const parseCurrencyString = (currencyString: string): number => {
  if (!currencyString) return 0;
  
  // Remove R$, espaços e pontos, mantém apenas números e vírgula
  const cleanString = currencyString
    .replace(/R\$\s*/g, '')
    .replace(/\./g, '')
    .replace(/,/g, '.');
  
  return parseFloat(cleanString) || 0;
};

// Salvar perfil financeiro do usuário
export const saveFinancialProfile = async (
  userId: string, 
  financialData: Omit<FinancialProfile, 'userId' | 'totalExpenses' | 'availableForSavings' | 'createdAt' | 'updatedAt'>
) => {
  try {
    console.log('💾 Salvando perfil financeiro para usuário:', userId);
    
    // Calcular totais
    const totalExpenses = 
      financialData.housingExpense +
      financialData.transportationExpense +
      financialData.foodExpense +
      financialData.healthExpense +
      financialData.educationExpense +
      financialData.entertainmentExpense;
    
    const availableForSavings = financialData.salary - totalExpenses;
    
    const profile: FinancialProfile = {
      userId,
      ...financialData,
      totalExpenses,
      availableForSavings,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const profileRef = doc(db, 'userProfiles', userId);
    await setDoc(profileRef, profile);
    
    console.log('✅ Perfil financeiro salvo com sucesso');
    return { data: profile, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao salvar perfil financeiro:', error.message);
    return { data: null, error: error.message };
  }
};

// Buscar perfil financeiro do usuário
export const getFinancialProfile = async (userId: string) => {
  try {
    const profileRef = doc(db, 'userProfiles', userId);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      const profile = profileDoc.data() as FinancialProfile;
      return { data: profile, error: null };
    } else {
      return { data: null, error: 'Perfil não encontrado' };
    }
  } catch (error: any) {
    console.error('❌ Erro ao buscar perfil financeiro:', error.message);
    return { data: null, error: error.message };
  }
};

// Atualizar perfil financeiro
export const updateFinancialProfile = async (
  userId: string, 
  updates: Partial<FinancialProfile>
) => {
  try {
    const profileRef = doc(db, 'userProfiles', userId);
    
    // Se há mudanças nos gastos, recalcular totais
    if (updates.salary || updates.housingExpense || updates.transportationExpense || 
        updates.foodExpense || updates.healthExpense || updates.educationExpense || 
        updates.entertainmentExpense) {
      
      const currentProfile = await getFinancialProfile(userId);
      if (currentProfile.data) {
        const updatedData = { ...currentProfile.data, ...updates };
        
        const totalExpenses = 
          updatedData.housingExpense +
          updatedData.transportationExpense +
          updatedData.foodExpense +
          updatedData.healthExpense +
          updatedData.educationExpense +
          updatedData.entertainmentExpense;
        
        const availableForSavings = updatedData.salary - totalExpenses;
        
        updates.totalExpenses = totalExpenses;
        updates.availableForSavings = availableForSavings;
      }
    }
    
    updates.updatedAt = new Date().toISOString();
    
    await updateDoc(profileRef, updates);
    
    console.log('✅ Perfil financeiro atualizado com sucesso');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao atualizar perfil financeiro:', error.message);
    return { success: false, error: error.message };
  }
};

// Criar categorias personalizadas baseadas no perfil
export const createPersonalizedCategories = async (userId: string) => {
  try {
    const profile = await getFinancialProfile(userId);
    if (!profile.data) {
      throw new Error('Perfil financeiro não encontrado');
    }
    
    const categories = [
      {
        nome: 'Moradia',
        cor: '#ef4444',
        icone: '🏠',
        limite: profile.data.housingExpense,
        userId
      },
      {
        nome: 'Transporte',
        cor: '#3b82f6',
        icone: '🚗',
        limite: profile.data.transportationExpense,
        userId
      },
      {
        nome: 'Alimentação',
        cor: '#10b981',
        icone: '🍽️',
        limite: profile.data.foodExpense,
        userId
      },
      {
        nome: 'Saúde',
        cor: '#f59e0b',
        icone: '🏥',
        limite: profile.data.healthExpense,
        userId
      },
      {
        nome: 'Educação',
        cor: '#8b5cf6',
        icone: '📚',
        limite: profile.data.educationExpense,
        userId
      },
      {
        nome: 'Lazer',
        cor: '#ec4899',
        icone: '🎮',
        limite: profile.data.entertainmentExpense,
        userId
      },
      {
        nome: 'Economias',
        cor: '#06b6d4',
        icone: '💰',
        limite: profile.data.savingsGoal,
        userId
      }
    ];
    
    // Salvar categorias no Firebase
    const { addCategoria } = await import('./services');
    
    for (const category of categories) {
      await addCategoria(category);
    }
    
    console.log('✅ Categorias personalizadas criadas');
    return { success: true, error: null };
  } catch (error: any) {
    console.error('❌ Erro ao criar categorias personalizadas:', error.message);
    return { success: false, error: error.message };
  }
};

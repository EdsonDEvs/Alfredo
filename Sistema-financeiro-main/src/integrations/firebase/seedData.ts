// =====================================================
// DADOS DE EXEMPLO PARA O FIREBASE
// Script para popular o banco com dados iniciais
// =====================================================

import { addCategoria, addTransacao, addLembrete, getCategorias } from './services'
import type { Categoria, Transacao, Lembrete } from './types'

export const seedCategories = async (userId: string) => {
  const defaultCategories: Omit<Categoria, 'id' | 'created_at' | 'updated_at'>[] = [
    { nome: 'Alimentação', tags: 'comida, restaurante, mercado', userid: userId },
    { nome: 'Transporte', tags: 'uber, gasolina, ônibus', userid: userId },
    { nome: 'Moradia', tags: 'aluguel, conta, manutenção', userid: userId },
    { nome: 'Saúde', tags: 'médico, farmácia, plano', userid: userId },
    { nome: 'Educação', tags: 'curso, livro, material', userid: userId },
    { nome: 'Lazer', tags: 'cinema, shopping, viagem', userid: userId },
    { nome: 'Vestuário', tags: 'roupa, sapato, acessório', userid: userId },
    { nome: 'Tecnologia', tags: 'celular, computador, software', userid: userId },
    { nome: 'Investimentos', tags: 'ações, poupança, cripto', userid: userId },
    { nome: 'Outros', tags: 'diversos, emergência', userid: userId },
  ]

  console.log('🌱 Inserindo categorias padrão...')
  
  for (const category of defaultCategories) {
    try {
      const { id, error } = await addCategoria(category)
      if (error) {
        console.error('❌ Erro ao criar categoria:', category.nome, error)
      } else {
        console.log('✅ Categoria criada:', category.nome, id)
      }
    } catch (error) {
      console.error('❌ Erro ao criar categoria:', category.nome, error)
    }
  }
}

export const seedTransactions = async (userId: string) => {
  // Primeiro, buscar as categorias existentes para associar às transações
  const { data: categorias } = await getCategorias(userId)
  
  if (!categorias || categorias.length === 0) {
    console.log('⚠️ Nenhuma categoria encontrada. Criando categorias primeiro...')
    await seedCategories(userId)
    const { data: categoriasNovas } = await getCategorias(userId)
    if (!categoriasNovas || categoriasNovas.length === 0) {
      console.error('❌ Não foi possível criar categorias')
      return
    }
  }

  // Mapear categorias por nome para facilitar a associação
  const categoriasMap = new Map()
  categorias?.forEach(cat => {
    categoriasMap.set(cat.nome, cat.id)
  })

  const defaultTransactions: Omit<Transacao, 'id' | 'created_at'>[] = [
    // Transações antigas (2024)
    {
      estabelecimento: 'Supermercado Extra',
      valor: 150.50,
      tipo: 'despesa',
      category_id: categoriasMap.get('Alimentação') || '',
      quando: new Date('2024-01-15').toISOString(),
      detalhes: 'Compra de alimentos para a semana',
      userid: userId
    },
    {
      estabelecimento: 'Salário Mensal',
      valor: 3000.00,
      tipo: 'receita',
      category_id: categoriasMap.get('Investimentos') || '',
      quando: new Date('2024-01-01').toISOString(),
      detalhes: 'Salário do mês de janeiro',
      userid: userId
    },
    {
      estabelecimento: 'Uber',
      valor: 25.00,
      tipo: 'despesa',
      category_id: categoriasMap.get('Transporte') || '',
      quando: new Date('2024-01-10').toISOString(),
      detalhes: 'Corrida para o trabalho',
      userid: userId
    },
    {
      estabelecimento: 'Netflix',
      valor: 39.90,
      tipo: 'despesa',
      category_id: categoriasMap.get('Lazer') || '',
      quando: new Date('2024-01-05').toISOString(),
      detalhes: 'Assinatura mensal',
      userid: userId
    },
    {
      estabelecimento: 'Farmácia São João',
      valor: 45.00,
      tipo: 'despesa',
      category_id: categoriasMap.get('Saúde') || '',
      quando: new Date('2024-01-12').toISOString(),
      detalhes: 'Medicamentos',
      userid: userId
    },
    // Transações recentes (2025)
    {
      estabelecimento: 'Freelance',
      valor: 200.00,
      tipo: 'receita',
      category_id: categoriasMap.get('Investimentos') || '',
      quando: new Date('2025-08-14').toISOString(),
      detalhes: 'Projeto de desenvolvimento web',
      userid: userId
    },
    {
      estabelecimento: 'Supermercado Extra',
      valor: 150.50,
      tipo: 'despesa',
      category_id: categoriasMap.get('Alimentação') || '',
      quando: new Date('2025-08-10').toISOString(),
      detalhes: 'Compra de alimentos para a semana',
      userid: userId
    },
    {
      estabelecimento: 'Salário Mensal',
      valor: 3200.00,
      tipo: 'receita',
      category_id: categoriasMap.get('Investimentos') || '',
      quando: new Date('2025-08-01').toISOString(),
      detalhes: 'Salário do mês de agosto',
      userid: userId
    }
  ]

  console.log('🌱 Dados de transações para inserir:')
  defaultTransactions.forEach((t, i) => {
    console.log(`🌱 ${i + 1}. ${t.estabelecimento} - ${t.tipo} - R$ ${t.valor} - ${t.quando}`)
  })

  console.log('🌱 Inserindo transações de exemplo...')
  console.log('🌱 Usuário ID:', userId)
  console.log('🌱 Número de transações para inserir:', defaultTransactions.length)
  
  for (const transaction of defaultTransactions) {
    try {
      console.log('🌱 Tentando inserir transação:', transaction.estabelecimento)
      const { id, error } = await addTransacao(transaction)
      if (error) {
        console.error('❌ Erro ao criar transação:', transaction.estabelecimento, error)
      } else {
        console.log('✅ Transação criada:', transaction.estabelecimento, 'ID:', id)
      }
    } catch (error) {
      console.error('❌ Erro ao criar transação:', transaction.estabelecimento, error)
    }
  }
  
  console.log('🌱 Finalizado inserção de transações')
}

export const seedReminders = async (userId: string) => {
  const defaultReminders: Omit<Lembrete, 'id' | 'created_at'>[] = [
    // Lembretes antigos (2024)
    {
      descricao: 'Pagar conta de luz - Vencimento da conta de energia elétrica',
      data: new Date('2024-01-25').toISOString(),
      valor: 150.00,
      userid: userId
    },
    {
      descricao: 'Consulta médica - Checkup anual no cardiologista',
      data: new Date('2024-01-30').toISOString(),
      valor: 200.00,
      userid: userId
    },
    {
      descricao: 'Aniversário da mãe - Comprar presente para o aniversário',
      data: new Date('2024-02-05').toISOString(),
      valor: 100.00,
      userid: userId
    },
    // Lembretes recentes (2025)
    {
      descricao: 'Pagar internet - Vencimento da conta de internet',
      data: new Date('2025-08-19').toISOString(),
      valor: 100.00,
      userid: userId
    },
    {
      descricao: 'Pagar conta de luz - Vencimento da conta de energia elétrica',
      data: new Date('2025-08-25').toISOString(),
      valor: 180.00,
      userid: userId
    }
  ]

  console.log('🌱 Inserindo lembretes de exemplo...')
  
  for (const reminder of defaultReminders) {
    try {
      const { id, error } = await addLembrete(reminder)
      if (error) {
        console.error('❌ Erro ao criar lembrete:', reminder.descricao, error)
      } else {
        console.log('✅ Lembrete criado:', reminder.descricao, id)
      }
    } catch (error) {
      console.error('❌ Erro ao criar lembrete:', reminder.descricao, error)
    }
  }
}

export const seedAllData = async (userId: string) => {
  console.log('🚀 Iniciando inserção de dados de exemplo...')
  
  await seedCategories(userId)
  await seedTransactions(userId)
  await seedReminders(userId)
  
  console.log('✅ Dados de exemplo inseridos com sucesso!')
}

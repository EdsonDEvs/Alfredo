# 🚀 Fluxo Completo de Onboarding - Alfredo

## 📋 **Visão Geral**

Este documento explica o novo fluxo completo de onboarding do sistema Alfredo, que inclui criação de usuário, questionário financeiro, seleção de plano e pagamento.

## 🔄 **Fluxo Completo**

### **1. Usuário Acessa a Página de Planos (`/plano`)**

- **Botão**: "Começar Agora - Gratuito"
- **Ação**: Inicia o processo de onboarding

### **2. Criação de Usuário (se não logado)**

#### **2.1 Formulário de Dados**
- Nome Completo
- Email
- Telefone
- Senha (mínimo 6 caracteres)

#### **2.2 Prévia dos Dados**
- Confirmação dos dados preenchidos
- Opção de editar ou continuar

#### **2.3 Criação da Conta**
- Conta criada no Firebase com dados reais
- Dados armazenados no localStorage
- Usuário já pode fazer login com email e senha

### **3. Questionário Financeiro**

#### **3.1 Perguntas Sequenciais**
1. **Renda Mensal** - Salário e outras receitas
2. **Gastos com Moradia** - Aluguel, condomínio, IPTU
3. **Gastos com Transporte** - Combustível, Uber, transporte público
4. **Gastos com Alimentação** - Mercado, restaurantes, delivery
5. **Gastos com Saúde** - Plano de saúde, medicamentos, consultas
6. **Gastos com Educação** - Cursos, livros, mensalidades
7. **Gastos com Lazer** - Cinema, shows, viagens, hobbies
8. **Meta de Economia** - Quanto quer guardar por mês
9. **Objetivo Financeiro** - Economizar, investir, pagar dívidas, controlar gastos
10. **Nível de Experiência** - Iniciante, intermediário, avançado

#### **3.2 Processamento dos Dados**
- Conversão de valores monetários
- Cálculo de totais
- Salvamento no perfil do usuário
- Criação de categorias personalizadas

### **4. Seleção de Plano**

#### **4.1 Planos Disponíveis**
- **Básico** - R$ 0,01/mês
- **Premium** - R$ 0,01/mês (Recomendado)
- **Profissional** - R$ 0,01/mês

#### **4.2 Recursos por Plano**
- **Básico**: Dashboard básico, registro de transações, categorização automática
- **Premium**: Tudo do básico + WhatsApp, relatórios avançados, lembretes
- **Profissional**: Tudo do premium + múltiplas contas, análise de investimentos

### **5. Pagamento**

#### **5.1 Redirecionamento**
- Link do Asaas: `https://sandbox.asaas.com/c/g5su9rr5jw5b2f4h`
- Dados do usuário preenchidos automaticamente

#### **5.2 Processamento**
- Pagamento processado no Asaas
- Redirecionamento para `/payment-success`
- Ativação da assinatura

## 🛠️ **Implementação Técnica**

### **Componentes Criados**

1. **`FinancialQuestionnaire`**: Questionário financeiro interativo
2. **`PlanSelection`**: Seleção de planos com comparação
3. **`UserDataForm`**: Formulário de dados do usuário
4. **`UserDataPreview`**: Prévia dos dados antes de confirmar

### **Serviços Criados**

1. **`userProfileService.ts`**: Gerenciamento de perfil financeiro
2. **`subscriptionService.ts`**: Gerenciamento de assinaturas
3. **`asaasService.ts`**: Integração com Asaas

### **Fluxo de Estados**

```typescript
// Estados da página de planos
const [showUserForm, setShowUserForm] = useState(false);
const [showDataPreview, setShowDataPreview] = useState(false);
const [showQuestionnaire, setShowQuestionnaire] = useState(false);
const [showPlanSelection, setShowPlanSelection] = useState(false);
```

## 📊 **Dados Coletados**

### **Dados do Usuário**
```typescript
{
  name: string;
  email: string;
  phone: string;
  password: string;
}
```

### **Perfil Financeiro**
```typescript
{
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
}
```

### **Categorias Personalizadas**
- Moradia (limite baseado nos gastos)
- Transporte (limite baseado nos gastos)
- Alimentação (limite baseado nos gastos)
- Saúde (limite baseado nos gastos)
- Educação (limite baseado nos gastos)
- Lazer (limite baseado nos gastos)
- Economias (meta definida pelo usuário)

## 🎯 **Benefícios do Novo Fluxo**

### **Para o Usuário**
✅ **Experiência personalizada** baseada em dados reais  
✅ **Categorias automáticas** com limites personalizados  
✅ **Metas financeiras** baseadas na realidade  
✅ **Fluxo simplificado** sem duplicação de dados  
✅ **Onboarding completo** em uma sessão  

### **Para o Sistema**
✅ **Dados qualificados** de usuários  
✅ **Categorização inteligente** baseada em gastos reais  
✅ **Metas realistas** baseadas na renda  
✅ **Maior conversão** com fluxo otimizado  
✅ **Dados para análise** e melhorias  

## 🔍 **Como Testar**

### **1. Teste Completo (Usuário Novo)**
1. Acesse `/plano` (sem estar logado)
2. Clique em "Começar Agora - Gratuito"
3. Preencha: Nome, Email, Telefone, Senha
4. Confirme os dados na prévia
5. Responda o questionário financeiro
6. Selecione um plano
7. Complete o pagamento no Asaas
8. Verifique se foi redirecionado para `/payment-success`

### **2. Teste Completo (Usuário Logado)**
1. Acesse `/plano` (já logado)
2. Clique em "Começar Agora - Gratuito"
3. Responda o questionário financeiro
4. Selecione um plano
5. Complete o pagamento no Asaas
6. Verifique se foi redirecionado para `/payment-success`

### **3. Verificação de Dados**
1. Acesse o Firebase Console
2. Verifique se a conta foi criada
3. Verifique se o perfil financeiro foi salvo
4. Verifique se as categorias foram criadas
5. Confirme se a assinatura está ativa

## ⚠️ **Pontos de Atenção**

### **Validações**
- Todos os campos obrigatórios devem ser preenchidos
- Valores monetários são formatados automaticamente
- Progresso é salvo durante o questionário
- Usuário pode pular o questionário se desejar

### **Tratamento de Erros**
- Se email já existe, tenta fazer login
- Se login falha, tenta criar conta
- Se tudo falha, mostra erro amigável
- Dados são preservados em caso de erro

### **Performance**
- Questionário é responsivo
- Progresso é mostrado em tempo real
- Dados são salvos incrementalmente
- Carregamento é otimizado

## 🚀 **Próximos Passos**

1. **Implementar webhook** do Asaas para confirmação automática
2. **Adicionar validações** mais robustas
3. **Implementar notificação** por email com credenciais
4. **Adicionar análise** de dados coletados
5. **Implementar A/B testing** para otimizar conversão
6. **Adicionar gamificação** no questionário
7. **Implementar sugestões** baseadas nos dados

---

**Status**: ✅ Implementado e Funcionando  
**Versão**: 2.0  
**Última Atualização**: Janeiro 2025

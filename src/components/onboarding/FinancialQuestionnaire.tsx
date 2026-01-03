import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Wallet, Home, Car, ShoppingCart, Heart, GraduationCap, Plane, DollarSign, ArrowRight, ArrowLeft } from 'lucide-react';

interface FinancialData {
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

interface FinancialQuestionnaireProps {
  onComplete: (data: FinancialData) => void;
  onBack: () => void;
  isLoading?: boolean;
}

const questions = [
  {
    id: 'salary',
    title: 'Qual é sua renda mensal?',
    description: 'Isso nos ajuda a personalizar suas categorias',
    icon: DollarSign,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'housingExpense',
    title: 'Quanto você gasta com moradia?',
    description: 'Aluguel, condomínio, IPTU, etc.',
    icon: Home,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'transportationExpense',
    title: 'Quanto você gasta com transporte?',
    description: 'Combustível, Uber, transporte público',
    icon: Car,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'foodExpense',
    title: 'Quanto você gasta com alimentação?',
    description: 'Mercado, restaurantes, delivery',
    icon: ShoppingCart,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'healthExpense',
    title: 'Quanto você gasta com saúde?',
    description: 'Plano de saúde, medicamentos, consultas',
    icon: Heart,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'educationExpense',
    title: 'Quanto você gasta com educação?',
    description: 'Cursos, livros, mensalidades',
    icon: GraduationCap,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'entertainmentExpense',
    title: 'Quanto você gasta com lazer?',
    description: 'Cinema, shows, viagens, hobbies',
    icon: Plane,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'savingsGoal',
    title: 'Qual sua meta de economia mensal?',
    description: 'Quanto você quer guardar por mês?',
    icon: Wallet,
    type: 'currency',
    placeholder: 'R$ 0,00'
  },
  {
    id: 'financialGoal',
    title: 'Qual seu principal objetivo financeiro?',
    description: 'Escolha o que mais importa para você',
    icon: DollarSign,
    type: 'select',
    options: [
      { value: 'save', label: 'Economizar dinheiro' },
      { value: 'invest', label: 'Investir e multiplicar' },
      { value: 'debt', label: 'Pagar dívidas' },
      { value: 'budget', label: 'Controlar gastos' }
    ]
  },
  {
    id: 'experienceLevel',
    title: 'Como você se considera em finanças pessoais?',
    description: 'Isso nos ajuda a personalizar o conteúdo',
    icon: GraduationCap,
    type: 'select',
    options: [
      { value: 'beginner', label: 'Iniciante - Estou aprendendo' },
      { value: 'intermediate', label: 'Intermediário - Já tenho alguma experiência' },
      { value: 'advanced', label: 'Avançado - Tenho bastante conhecimento' }
    ]
  }
];

export function FinancialQuestionnaire({ onComplete, onBack, isLoading = false }: FinancialQuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FinancialData>({
    salary: '',
    housingExpense: '',
    transportationExpense: '',
    foodExpense: '',
    healthExpense: '',
    educationExpense: '',
    entertainmentExpense: '',
    savingsGoal: '',
    financialGoal: 'save',
    experienceLevel: 'beginner'
  });

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleInputChange = (value: string) => {
    setData(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(data);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const formatCurrency = (value: string) => {
    // Remove tudo que não é número
    const numericValue = value.replace(/\D/g, '');
    
    if (numericValue === '') return '';
    
    // Converte para número e formata
    const number = parseInt(numericValue) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(number);
  };

  const parseCurrency = (value: string) => {
    return value.replace(/\D/g, '');
  };

  const isCurrentStepValid = () => {
    const currentValue = data[currentQuestion.id as keyof FinancialData];
    return currentValue && currentValue.toString().trim() !== '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <currentQuestion.icon className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
          <CardDescription className="text-base">
            {currentQuestion.description}
          </CardDescription>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Pergunta {currentStep + 1} de {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Input Field */}
          <div className="space-y-2">
            <Label htmlFor={currentQuestion.id} className="text-base font-medium">
              {currentQuestion.title}
            </Label>
            
            {currentQuestion.type === 'currency' ? (
              <Input
                id={currentQuestion.id}
                type="text"
                placeholder={currentQuestion.placeholder}
                value={data[currentQuestion.id as keyof FinancialData] as string}
                onChange={(e) => handleInputChange(formatCurrency(e.target.value))}
                className="text-lg h-12"
              />
            ) : currentQuestion.type === 'select' ? (
              <Select
                value={data[currentQuestion.id as keyof FinancialData] as string}
                onValueChange={handleInputChange}
              >
                <SelectTrigger className="text-lg h-12">
                  <SelectValue placeholder="Selecione uma opção" />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : null}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentStep === 0 ? 'Voltar' : 'Anterior'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid() || isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : currentStep === questions.length - 1 ? (
                <>
                  Finalizar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                <>
                  Próxima
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Skip Option */}
          {currentStep < questions.length - 1 && (
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => onComplete(data)}
                className="text-sm text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                Pular questionário e ir direto para o plano
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

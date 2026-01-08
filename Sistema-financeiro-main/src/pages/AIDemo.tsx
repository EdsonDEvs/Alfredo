import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SmartTextSuggestions } from '@/components/ai/SmartTextSuggestions';
import { MessageCircle, Bot, User, Sparkles, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'expense' | 'balance' | 'calendar' | 'help';
}

export default function AIDemo() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou o Alfredo, seu assistente financeiro inteligente! 👋\n\nComo posso te ajudar hoje?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'help'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simular IA processando mensagem
  const processMessage = async (text: string) => {
    setIsTyping(true);
    
    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const response = generateAIResponse(text);
    
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type
      }
    ]);
    
    setIsTyping(false);
  };

  const generateAIResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Detectar padrões de despesa
    const expensePattern = /(gastei|paguei|comprei)\s+(?:r\$?\s*)?([\d,]+(?:\.[\d]{2})?)\s+(?:reais?|real)?\s+(?:no|na|em|com|para|de)\s+(.+)/i;
    const expenseMatch = text.match(expensePattern);
    
    if (expenseMatch) {
      const [, action, value, place] = expenseMatch;
      const numValue = parseFloat(value.replace(',', '.'));
      
      // Categorização inteligente
      const category = getCategory(place);
      const emoji = getCategoryEmoji(category);
      
      return {
        text: `${emoji} Felipe Titto, registrei a transação como você pediu. O gasto de R$ ${numValue.toFixed(2)} ${place} foi registrado na categoria ${category}. ${emoji}`,
        type: 'expense' as const
      };
    }
    
    // Detectar consultas de saldo
    if (lowerText.includes('quanto') && lowerText.includes('gastei') && lowerText.includes('mês')) {
      return {
        text: `📊 Felipe Titto, aqui está seu resumo financeiro:\n\n💰 **Gastos do mês:** R$ 17.664,00\n💵 **Receitas do mês:** R$ 25.000,00\n\n✅ **Saldo:** R$ 7.336,00\n\n📅 Período: Abril 2025\n\n💡 **Dica:** Para mais detalhes e gráficos, você pode acessar seu painel em https://alfredo.com.br/dashboard`,
        type: 'balance' as const
      };
    }
    
    // Detectar consultas de calendário
    if (lowerText.includes('compromisso') && lowerText.includes('amanhã')) {
      return {
        text: `Felipe Titto, aqui estão seus compromissos para amanhã, 02/04/2025:\n\n1. Reunião com a empresa H das 12:00 às 12:45 🗓️\n2. Reunião com o Titto às 15:00\n3. Reunião na Tittanium às 13:00\n4. Reunião com o Felipe às 16:00\n5. Reunião com a Centauro às 17:30\n6. Reunião com o Sergio às 11:00\n\nSe precisar de algo mais, estou à disposição! 😊`,
        type: 'calendar' as const
      };
    }
    
    // Detectar pedidos de ajuda
    if (lowerText.includes('ajuda') || lowerText.includes('help') || lowerText.includes('como')) {
      return {
        text: `Olá Felipe Titto! 👋\n\nComo posso te ajudar hoje?\n\n📝 **Registrar despesas:**\n• "Gastei 50 reais no mercado"\n• "Paguei 30 reais de estacionamento"\n• "Comprei 25 reais de pizza"\n\n📊 **Consultar finanças:**\n• "Quanto gastei esse mês?"\n• "Meu resumo financeiro"\n• "Qual meu saldo?"\n\n📅 **Ver compromissos:**\n• "Tenho algum compromisso amanhã?"\n• "Meus compromissos de hoje"\n\n📱 **Outras opções:**\n• "Ajuda" - ver este menu\n• "Dashboard" - acessar painel completo\n\n💡 **Dica:** Você também pode enviar fotos de comprovantes para registro automático!`,
        type: 'help' as const
      };
    }
    
    // Resposta padrão
    return {
      text: `Entendi! "${text}"\n\nComo posso te ajudar com suas finanças? Você pode:\n• Registrar despesas\n• Consultar saldo\n• Ver compromissos\n• Pedir ajuda`,
      type: 'text' as const
    };
  };

  const getCategory = (place: string): string => {
    const lowerPlace = place.toLowerCase();
    
    if (lowerPlace.includes('posto') || lowerPlace.includes('gasolina') || lowerPlace.includes('combustível')) {
      return 'Transporte';
    }
    if (lowerPlace.includes('estacionamento') || lowerPlace.includes('parking')) {
      return 'Transporte';
    }
    if (lowerPlace.includes('ifood') || lowerPlace.includes('uber eats') || lowerPlace.includes('rappi')) {
      return 'Alimentação';
    }
    if (lowerPlace.includes('farmácia') || lowerPlace.includes('drogaria')) {
      return 'Saúde';
    }
    if (lowerPlace.includes('mercado') || lowerPlace.includes('supermercado')) {
      return 'Alimentação';
    }
    if (lowerPlace.includes('shopping') || lowerPlace.includes('loja')) {
      return 'Lazer';
    }
    
    return 'Outros';
  };

  const getCategoryEmoji = (category: string): string => {
    const emojis: Record<string, string> = {
      'Transporte': '🚗',
      'Alimentação': '🍽️',
      'Saúde': '💊',
      'Lazer': '🎮',
      'Educação': '📚',
      'Moradia': '🏠',
      'Outros': '💰'
    };
    
    return emojis[category] || '💰';
  };

  const handleSendMessage = (text: string) => {
    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Processar com IA
    processMessage(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            <Sparkles className="inline-block mr-2 text-purple-600" />
            Alfredo - IA Assistente Inteligente
          </h1>
          <p className="text-gray-600">
            Demonstração do sistema de IA conversacional similar ao meuassessor.com
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Alfredo - Oficial
                </CardTitle>
                <p className="text-sm opacity-90">Assistente Financeiro Inteligente</p>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'user'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === 'bot' && (
                            <Bot className="h-4 w-4 mt-1 text-purple-600" />
                          )}
                          <div className="flex-1">
                            <p className="whitespace-pre-wrap text-sm">{message.text}</p>
                            <p className={`text-xs mt-1 ${
                              message.sender === 'user' ? 'text-green-100' : 'text-gray-500'
                            }`}>
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Bot className="h-4 w-4 text-purple-600" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-gray-600">Alfredo está digitando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Input */}
                <div className="p-4 border-t">
                  <SmartTextSuggestions
                    onSendMessage={handleSendMessage}
                    placeholder="Digite sua mensagem..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Funcionalidades IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-full justify-start">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Categorização Automática
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Processamento de Linguagem Natural
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <Calendar className="h-3 w-3 mr-1" />
                    Integração com Calendário
                  </Badge>
                  <Badge variant="secondary" className="w-full justify-start">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Sugestões Inteligentes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exemplos de Comandos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => handleSendMessage('Gastei 17 reais no posto')}
                >
                  "Gastei 17 reais no posto"
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => handleSendMessage('E 30 reais de estacionamento')}
                >
                  "E 30 reais de estacionamento"
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => handleSendMessage('Tenho algum compromisso pra amanhã?')}
                >
                  "Tenho algum compromisso pra amanhã?"
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-2"
                  onClick={() => handleSendMessage('Quanto gastei esse mês?')}
                >
                  "Quanto gastei esse mês?"
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tecnologias Utilizadas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline">n8n Workflows</Badge>
                <Badge variant="outline">OpenAI GPT-4</Badge>
                <Badge variant="outline">WhatsApp Business API</Badge>
                <Badge variant="outline">Firebase Firestore</Badge>
                <Badge variant="outline">React + TypeScript</Badge>
                <Badge variant="outline">Processamento de Linguagem Natural</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

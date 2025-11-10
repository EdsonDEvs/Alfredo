import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

interface SmartTextSuggestionsProps {
  onSendMessage: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface Suggestion {
  text: string;
  confidence: number;
  type: 'correction' | 'completion' | 'suggestion';
}

export function SmartTextSuggestions({ 
  onSendMessage, 
  placeholder = "Digite sua mensagem...",
  disabled = false 
}: SmartTextSuggestionsProps) {
  const [message, setMessage] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Simular IA de sugestões inteligentes
  const generateSuggestions = (text: string): Suggestion[] => {
    const suggestions: Suggestion[] = [];
    
    // Detectar palavras comuns que podem ter erros de digitação
    const commonMistakes: Record<string, string[]> = {
      'famraci': ['farmácia', 'farmácias', 'farmacêutico'],
      'ifood': ['iFood', 'delivery', 'comida'],
      'posto': ['posto de gasolina', 'combustível', 'abastecimento'],
      'estacionamento': ['parking', 'zona azul', 'estacionar'],
      'mercado': ['supermercado', 'compras', 'alimentação'],
      'restaurante': ['lanche', 'refeição', 'alimentação'],
      'farmácia': ['medicamento', 'remédio', 'saúde'],
      'shopping': ['loja', 'compras', 'lazer'],
      'uber': ['Uber', 'transporte', 'táxi'],
      'pizza': ['lanche', 'alimentação', 'delivery']
    };

    // Verificar se há palavras com erros de digitação
    const words = text.toLowerCase().split(' ');
    words.forEach(word => {
      if (commonMistakes[word]) {
        suggestions.push({
          text: commonMistakes[word][0],
          confidence: 0.9,
          type: 'correction'
        });
      }
    });

    // Sugestões de completação baseadas no contexto
    if (text.toLowerCase().includes('gastei') || text.toLowerCase().includes('paguei')) {
      suggestions.push(
        { text: 'reais no', confidence: 0.8, type: 'completion' },
        { text: 'reais de', confidence: 0.7, type: 'completion' }
      );
    }

    if (text.toLowerCase().includes('quanto') || text.toLowerCase().includes('meu')) {
      suggestions.push(
        { text: 'gastei esse mês?', confidence: 0.9, type: 'suggestion' },
        { text: 'saldo atual?', confidence: 0.8, type: 'suggestion' }
      );
    }

    if (text.toLowerCase().includes('tenho') && text.toLowerCase().includes('compromisso')) {
      suggestions.push(
        { text: 'amanhã?', confidence: 0.9, type: 'suggestion' },
        { text: 'hoje?', confidence: 0.8, type: 'suggestion' }
      );
    }

    // Sugestões de despesas comuns
    if (text.length > 0 && !text.includes('reais')) {
      suggestions.push(
        { text: 'reais', confidence: 0.6, type: 'completion' }
      );
    }

    return suggestions.slice(0, 3); // Limitar a 3 sugestões
  };

  useEffect(() => {
    if (message.length > 2) {
      setIsTyping(true);
      const timeoutId = setTimeout(() => {
        const newSuggestions = generateSuggestions(message);
        setSuggestions(newSuggestions);
        setIsTyping(false);
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setIsTyping(false);
    }
  }, [message]);

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.type === 'correction') {
      // Substituir a palavra incorreta
      const words = message.split(' ');
      const correctedWords = words.map(word => {
        const lowerWord = word.toLowerCase();
        if (lowerWord === suggestion.text.toLowerCase()) {
          return suggestion.text;
        }
        return word;
      });
      setMessage(correctedWords.join(' '));
    } else {
      // Adicionar à mensagem atual
      setMessage(prev => prev + ' ' + suggestion.text);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Campo de entrada */}
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="pr-12"
            />
            <Button
              onClick={handleSendMessage}
              disabled={disabled || !message.trim()}
              size="sm"
              className="absolute right-1 top-1 h-8 w-8 p-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Sugestões inteligentes */}
          {suggestions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-3 w-3" />
                <span>Sugestões inteligentes:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant={suggestion.type === 'correction' ? 'destructive' : 'secondary'}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.text}
                    {suggestion.type === 'correction' && (
                      <span className="ml-1 text-xs">✏️</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Indicador de digitação */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span>IA analisando...</span>
            </div>
          )}

          {/* Exemplos de uso */}
          {!message && (
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                Exemplos de comandos:
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setMessage('Gastei 50 reais no mercado')}>
                  "Gastei 50 reais no mercado"
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setMessage('Quanto gastei esse mês?')}>
                  "Quanto gastei esse mês?"
                </Badge>
                <Badge variant="outline" className="text-xs cursor-pointer" onClick={() => setMessage('Tenho algum compromisso amanhã?')}>
                  "Tenho algum compromisso amanhã?"
                </Badge>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

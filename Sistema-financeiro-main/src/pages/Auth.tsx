
import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { ThemeToggle } from '@/components/ui/theme-toggle';

type AuthMode = 'login' | 'register' | 'forgot';

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>('login');
  
  console.log('🔐 Auth.tsx: Página de autenticação carregada, modo:', mode);

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - ALFREDO Logo */}
      <div className="hidden lg:flex lg:w-1/2 relative" style={{ backgroundColor: '#091526' }}>
        <div className="w-full h-full flex items-center justify-center p-8">
          <img 
            src="/lovable-uploads/c6b30591-3264-4c4f-b291-04b00be4d5a5.png" 
            alt="ALFREDO - Seu Assistente Financeiro" 
            className="max-w-full max-h-full object-contain" 
          />
        </div>
      </div>

      {/* Right side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative bg-white">
        {/* Header with Theme Toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-6">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <img 
              src="/lovable-uploads/d58baa4c-1273-42fb-83d0-950387ad313b.png" 
              alt="ALFREDO" 
              className="h-12 w-auto" 
            />
          </div>
          
          {mode === 'login' && (
            <>
              <LoginForm 
                onForgotPassword={() => setMode('forgot')} 
                onRegister={() => setMode('register')}
              />
            </>
          )}
          {mode === 'register' && (
            <>
              <RegisterForm onBackToLogin={() => setMode('login')} />
            </>
          )}
          {mode === 'forgot' && <ForgotPasswordForm onBack={() => setMode('login')} />}
        </div>
      </div>
    </div>
  );
}

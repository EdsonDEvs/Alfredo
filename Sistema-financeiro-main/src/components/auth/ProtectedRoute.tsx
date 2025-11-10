import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth' 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute:', {
    loading,
    isAuthenticated,
    user: user ? 'Usuário presente' : 'Sem usuário',
    requireAuth,
    pathname: location.pathname
  });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    console.log('🔒 ProtectedRoute: Mostrando loading...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // TEMPORÁRIO: Permitir acesso sem autenticação para testar
  // console.log('🔒 ProtectedRoute: Permitindo acesso temporário para teste');
  // return <>{children}</>;

  // Se requer autenticação e usuário não está autenticado
  if (requireAuth && !isAuthenticated) {
    console.log('🔒 ProtectedRoute: Redirecionando para auth - usuário não autenticado');
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Se não requer autenticação e usuário está autenticado, redirecionar para dashboard
  if (!requireAuth && isAuthenticated) {
    console.log('🔒 ProtectedRoute: Redirecionando para dashboard - usuário autenticado');
    return <Navigate to="/dashboard" replace />;
  }

  // Usuário autenticado e rota protegida, ou usuário não autenticado e rota pública
  console.log('🔒 ProtectedRoute: Permitindo acesso');
  return <>{children}</>;
}

// Componente específico para rotas que requerem autenticação
export function RequireAuth({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  );
}

// Componente para rotas públicas (não autenticadas)
export function PublicRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={false}>
      {children}
    </ProtectedRoute>
  );
}

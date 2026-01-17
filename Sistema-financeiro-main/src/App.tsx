// Updated: 2025-01-27 - Force redeploy with hierarchical categories system
// This comment forces Vercel to rebuild the application
// Hierarchical categories system is now active

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { AuthProvider } from '@/hooks/useAuth'
import { CurrencyProvider } from '@/hooks/useCurrency'
import { TransacoesSyncProvider } from '@/hooks/useTransacoesSync'
import { SafeTooltipProvider } from '@/components/ui/SafeTooltipProvider'
import { AppLayout } from '@/components/layout/AppLayout'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import Auth from '@/pages/Auth'
import Landing from '@/pages/Landing'
import Cadastro from '@/pages/Cadastro'
import PaymentSuccess from '@/pages/PaymentSuccess'
import PublicCreateUser from '@/pages/PublicCreateUser'
import Dashboard from '@/pages/Dashboard'
import Transacoes from '@/pages/Transacoes'
import Categorias from '@/pages/Categorias'
import Relatorios from '@/pages/Relatorios'
import Lembretes from '@/pages/Lembretes'
import Metas from '@/pages/Metas'
import Perfil from '@/pages/Perfil'
import AdminCreateUser from '@/pages/AdminCreateUser'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { SubscriptionRequired } from '@/components/auth/SubscriptionRequired'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <Router>
              <TransacoesSyncProvider>
                <SafeTooltipProvider delayDuration={300} skipDelayDuration={0}>
                  <Routes>
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/cadastro" element={<Cadastro />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/criar-usuario" element={<PublicCreateUser />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      <Route index element={<Dashboard />} />
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="transacoes" element={<Transacoes />} />
                      <Route path="categorias" element={<Categorias />} />
                      <Route
                        path="relatorios"
                        element={
                          <SubscriptionRequired requiredPlan="pro">
                            <Relatorios />
                          </SubscriptionRequired>
                        }
                      />
                      <Route
                        path="lembretes"
                        element={
                          <SubscriptionRequired requiredPlan="pro">
                            <Lembretes />
                          </SubscriptionRequired>
                        }
                      />
                      <Route
                        path="metas"
                        element={
                          <SubscriptionRequired requiredPlan="pro">
                            <Metas />
                          </SubscriptionRequired>
                        }
                      />
                      <Route path="perfil" element={<Perfil />} />
                      <Route path="admin/criar-usuario" element={<AdminCreateUser />} />
                    </Route>
                    <Route path="/dashboard" element={<Navigate to="/" replace />} />
                  </Routes>
                  {/* Prompt de instalação do PWA */}
                  <InstallPrompt />
                </SafeTooltipProvider>
              </TransacoesSyncProvider>
            </Router>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
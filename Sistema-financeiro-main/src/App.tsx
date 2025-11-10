// Updated: 2025-01-27 - Force redeploy with hierarchical categories system
// This comment forces Vercel to rebuild the application
// Hierarchical categories system is now active

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/hooks/useTheme'
import { AuthProvider } from '@/hooks/useAuth'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AppLayout } from '@/components/layout/AppLayout'
import Auth from '@/pages/Auth'
import Dashboard from '@/pages/Dashboard'
import Transacoes from '@/pages/Transacoes'
import Categorias from '@/pages/Categorias'
import Relatorios from '@/pages/Relatorios'
import Lembretes from '@/pages/Lembretes'
import Metas from '@/pages/Metas'
import Perfil from '@/pages/Perfil'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Router>
            <Routes>
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
            <Route path="relatorios" element={<Relatorios />} />
            <Route path="lembretes" element={<Lembretes />} />
            <Route path="metas" element={<Metas />} />
            <Route path="perfil" element={<Perfil />} />
              </Route>
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
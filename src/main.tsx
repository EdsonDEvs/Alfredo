import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installTooltipErrorHandler } from './utils/tooltipErrorHandler'
import { isSupabaseConfigured } from './lib/supabase'

// Instalar handler de erros de tooltip antes de renderizar
installTooltipErrorHandler()

// Desativar Service Worker para evitar cache antigo em produção/dev
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => registration.unregister())
    })
    if ('caches' in window) {
      caches.keys().then((cacheNames) => {
        cacheNames
          .filter((name) => name.startsWith('alfredo-'))
          .forEach((name) => caches.delete(name))
      })
    }
  })
}

const root = document.getElementById("root")!

if (!isSupabaseConfigured) {
  createRoot(root).render(
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'system-ui, -apple-system, Segoe UI, sans-serif',
      }}
    >
      <div style={{ maxWidth: '560px' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '12px' }}>
          Configuracao do Supabase ausente
        </h1>
        <p style={{ marginBottom: '12px', lineHeight: 1.5 }}>
          Defina as variaveis <strong>VITE_SUPABASE_URL</strong> e{' '}
          <strong>VITE_SUPABASE_ANON_KEY</strong> no ambiente e reinicie o app.
        </p>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          Depois do ajuste, recarregue a pagina.
        </p>
      </div>
    </div>
  )
} else {
  createRoot(root).render(<App />)
}

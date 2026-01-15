import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installTooltipErrorHandler } from './utils/tooltipErrorHandler'

// Instalar handler de erros de tooltip antes de renderizar
installTooltipErrorHandler()

// Registrar Service Worker apenas em produção para evitar cache no dev
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration.scope)
      })
      .catch((error) => {
        console.log('❌ Falha ao registrar Service Worker:', error)
      })
  })
} else if (import.meta.env.DEV && 'serviceWorker' in navigator) {
  // Garantir que não exista SW ativo durante o desenvolvimento
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister())
  })
}

createRoot(document.getElementById("root")!).render(<App />);

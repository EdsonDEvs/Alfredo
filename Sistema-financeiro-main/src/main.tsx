import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installTooltipErrorHandler } from './utils/tooltipErrorHandler'

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

createRoot(document.getElementById("root")!).render(<App />);

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installTooltipErrorHandler } from './utils/tooltipErrorHandler'

// Instalar handler de erros de tooltip antes de renderizar
installTooltipErrorHandler()

// Registrar Service Worker para PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado com sucesso:', registration.scope)
      })
      .catch((error) => {
        console.log('❌ Falha ao registrar Service Worker:', error)
      })
  })
}

createRoot(document.getElementById("root")!).render(<App />);

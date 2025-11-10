import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { installTooltipErrorHandler } from './utils/tooltipErrorHandler'

// Instalar handler de erros de tooltip antes de renderizar
installTooltipErrorHandler()

createRoot(document.getElementById("root")!).render(<App />);

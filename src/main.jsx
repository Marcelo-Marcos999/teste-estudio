import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext'

// Registra o service worker (PWA). O app é 100% client-side, então passa a
// funcionar offline após a primeira visita.
//  - Com o `vite-plugin-pwa` instalado, ele gera `/sw.js` (cache do workbox,
//    registerType 'autoUpdate').
//  - Sem o plugin, usamos o service worker manual `/sw-fallback.js`.
function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return

  const register = () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      navigator.serviceWorker.register('/sw-fallback.js').catch(() => {})
    })
  }

  if (document.readyState === 'complete') {
    register()
  } else {
    window.addEventListener('load', register, { once: true })
  }
}

registerServiceWorker()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
)

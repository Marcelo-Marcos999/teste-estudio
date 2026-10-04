import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { loadTheme } from './utils/storage'

export function applyTheme(theme) {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme)
  }
}

applyTheme(loadTheme())

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Entry point dell'applicazione React (generato da Vite). Monta il componente <App /> nel div#root del file index.html,


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router'
import { Proveedor } from './configuracion/Contexto.jsx'

createRoot(document.getElementById('root')).render(
  <Proveedor>
  <BrowserRouter>
    <App />
  </BrowserRouter>
  </Proveedor>
)

import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { locale } from './copyContext.js'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// El HTML ya llega generado (prerender). Si es del mismo idioma, React lo "hidrata" sin repintar.
if (root.hasChildNodes() && root.dataset.locale === locale) {
  hydrateRoot(root, app)
} else {
  root.textContent = ''
  createRoot(root).render(app)
}

import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { setLocale } from './copyContext.js'
import { copies, languages } from './copy.js'
import { tiers } from './pricing.js'

export { copies, languages, tiers }

export function render(locale) {
  setLocale(locale)
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

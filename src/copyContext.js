import { createContext, useContext } from 'react'
import { copies, detectLocale } from './copy.js'

export let locale = detectLocale()

// Solo lo usa el prerender (scripts/prerender.js) para generar cada idioma.
export function setLocale(value) {
  locale = value
}
export const CopyContext = createContext(copies[locale])

export function useCopy() {
  return useContext(CopyContext)
}

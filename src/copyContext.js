import { createContext, useContext } from 'react'
import { copies, detectLocale } from './copy.js'

export const locale = detectLocale()
export const CopyContext = createContext(copies[locale])

export function useCopy() {
  return useContext(CopyContext)
}

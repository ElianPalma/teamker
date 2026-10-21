import es from './i18n/es.js'
import en from './i18n/en.js'
import pt from './i18n/pt.js'

export const copies = {
  'es-ES': es,
  'es-MX': { ...es, meta: { ...es.meta, lang: 'es-MX' } },
  en,
  pt,
}

export const languages = [
  { code: 'es', locale: 'es-ES', label: 'España', short: 'ES' },
  { code: 'mx', locale: 'es-MX', label: 'México', short: 'MX' },
  { code: 'en', locale: 'en', label: 'English', short: 'EN' },
  { code: 'pt', locale: 'pt', label: 'Português', short: 'PT' },
]

export function detectLocale() {
  if (typeof window === 'undefined') return 'es-ES'
  const param = new URLSearchParams(window.location.search).get('lang')
  const byParam = languages.find((l) => l.code === param)
  if (byParam) return byParam.locale
  const byPath = languages.find((l) => l.code !== 'es' && window.location.pathname.startsWith(`/${l.code}`))
  if (byPath) return byPath.locale
  const nav = (window.navigator.language || '').toLowerCase()
  if (nav.startsWith('pt')) return 'pt'
  if (nav.startsWith('en')) return 'en'
  if (nav === 'es-mx') return 'es-MX'
  return 'es-ES'
}

export function langHref(code) {
  const params = new URLSearchParams(window.location.search)
  params.set('lang', code)
  return `?${params.toString()}${window.location.hash}`
}

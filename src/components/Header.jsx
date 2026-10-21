import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { locale, useCopy } from '../copyContext.js'
import { langHref, languages } from '../copy.js'
import { config } from '../config.js'
import { ButtonLink, EASE } from './ui.jsx'
import logo from '../assets/logo.webp'

const headerLanguages = languages.filter((l) => l.code !== 'mx')

function isCurrent(l) {
  return l.locale === locale || (l.code === 'es' && locale === 'es-MX')
}

function LanguageLinks({ label, className = '' }) {
  return (
    <div className={`flex items-center gap-0.5 ${className}`} role="group" aria-label={label}>
      {headerLanguages.map((l) => (
        <a
          key={l.code}
          href={langHref(l.code)}
          hrefLang={l.code}
          lang={l.code === 'en' ? 'en' : l.code === 'pt' ? 'pt' : 'es'}
          aria-current={isCurrent(l) ? 'true' : undefined}
          title={l.label}
          className={`rounded-full px-2.5 py-1.5 text-[13px] font-semibold transition-colors ${isCurrent(l) ? 'bg-ink-900 text-white' : 'text-ink-500 hover:text-ink-900'}`}
        >
          {l.short}
        </a>
      ))}
    </div>
  )
}

const sections = [
  { id: 'producto', key: 'product' },
  { id: 'precios', key: 'pricing' },
  { id: 'preguntas', key: 'faq' },
  { id: 'contacto', key: 'contact' },
]

export default function Header() {
  const t = useCopy()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState(null)
  const [open, setOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(y > 12)
    setHidden(y > prev && y > 400 && !open)
  })

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    const ids = ['inicio', 'problema', 'producto', 'fichajes', 'vacaciones', 'documentos', 'antes-despues', 'para-quien', 'confianza', 'futuro', 'precios', 'preguntas', 'contacto']
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  const productIds = ['producto', 'fichajes', 'vacaciones', 'documentos', 'antes-despues']
  const current = productIds.includes(active) ? 'producto' : active

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div
        className={`transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
          scrolled || open ? 'bg-white/80 shadow-[0_1px_0_0_#e2e8f0] backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8" aria-label={t.nav.main}>
          <a href="#inicio" aria-label={t.nav.home} className="shrink-0">
            <img src={logo} alt="Teamkers" className="h-7 w-auto md:h-8" />
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                  current === s.id ? 'text-ink-900' : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {current === s.id && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-violet-soft" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                {t.nav[s.key]}
              </a>
            ))}
            <LanguageLinks label={t.nav.language} className="ml-2" />
            <ButtonLink href={config.demoUrl} className="ml-2 !px-5 !py-2.5 !text-[15px]">
              {t.nav.demo}
            </ButtonLink>
          </div>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-bg-soft md:hidden"
            aria-label={t.nav.menu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span className="absolute h-0.5 w-5 rounded bg-ink-900" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} />
            <motion.span className="absolute h-0.5 w-5 rounded bg-ink-900" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} />
          </button>
        </nav>
        <AnimatePresence>
          {open && (
            <motion.div
              className="overflow-hidden md:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="flex flex-col gap-1 px-4 pb-5">
                {sections.map((s, i) => (
                  <motion.a
                    key={s.id}
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3 py-3 text-lg font-medium text-ink-900 hover:bg-bg-soft"
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.4, ease: EASE }}
                  >
                    {t.nav[s.key]}
                  </motion.a>
                ))}
                <LanguageLinks label={t.nav.language} className="mt-1 px-1" />
                <ButtonLink href={config.demoUrl} className="mt-2" onClick={() => setOpen(false)}>
                  {t.nav.demo}
                </ButtonLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.div className="bg-brand h-[3px] origin-left" style={{ scaleX: progress }} />
    </motion.header>
  )
}

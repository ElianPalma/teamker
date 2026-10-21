import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { config, whatsappHref } from '../config.js'
import { ButtonLink, Reveal, SplitWords, WhatsAppIcon } from './ui.jsx'
import logoWhite from '../assets/logo-white.webp'

export default function Close() {
  const copy = useCopy()
  const t = copy.close
  const mx = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 })
  const my = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 })
  const glow = useMotionTemplate`radial-gradient(700px circle at ${mx}% ${my}%, rgba(255,255,255,0.28), transparent 60%)`
  return (
    <section
      id="contacto"
      className="noise relative scroll-mt-16 overflow-hidden py-28 text-center text-white md:py-40"
      style={{ background: 'linear-gradient(120deg, #ff0be5 0%, #7d09ff 55%, #45c4f9 130%)' }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width) * 100)
        my.set(((e.clientY - r.top) / r.height) * 100)
      }}
    >
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
      <div className="blob drift-a -left-20 top-0 h-80 w-80" style={{ background: 'rgba(255,11,229,0.6)' }} />
      <div className="blob drift-b -right-20 bottom-0 h-96 w-96" style={{ background: 'rgba(69,196,249,0.55)' }} />
      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <Reveal>
          <img src={logoWhite} alt="Teamkers" className="mx-auto h-8 w-auto md:h-10" width="670" height="96" loading="lazy" decoding="async" />
        </Reveal>
        <SplitWords text={t.title} delay={0.1} className="mt-10 text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.04em]" />
        <Reveal delay={0.2}>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.1rem,2vw,1.4rem)] leading-snug text-white/90">{t.subtitle}</p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={config.demoUrl} variant="light">
              {t.demo}
            </ButtonLink>
            <ButtonLink href={config.trialUrl} variant="outlineLight">
              {t.trial}
            </ButtonLink>
            <ButtonLink href={whatsappHref(copy.whatsapp.message)} variant="textLight" target={config.whatsappNumber ? '_blank' : undefined} rel="noreferrer">
              <WhatsAppIcon className="h-5 w-5" />
              {t.whatsapp}
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-white/75">{t.note}</p>
        </Reveal>
      </div>
    </section>
  )
}

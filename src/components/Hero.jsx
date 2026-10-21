import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { config } from '../config.js'
import { ButtonLink, EASE, Icon, SplitWords } from './ui.jsx'
import hero from '../assets/hero.webp'
import heroMobile from '../assets/hero-mobile.webp'

export default function Hero() {
  const t = useCopy()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const rotateX = useTransform(scrollYProgress, [0, 0.35], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 0.35], [0.92, 1])
  const y = useTransform(scrollYProgress, [0, 0.35], [0, -40])

  return (
    <section id="inicio" ref={ref} className="relative overflow-hidden pt-32 md:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-fade absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-[70%]" style={{ background: 'radial-gradient(ellipse 60% 55% at 50% 0%, rgba(125,9,255,0.07), transparent 70%)' }} />
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
        <SplitWords
          as="h1"
          text={t.hero.title}
          highlightFrom={t.hero.highlightFrom}
          delay={0.1}
          stagger={0.09}
          className="text-[clamp(3rem,9vw,6.5rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink-900"
        />

        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ delay: 0.45, duration: 0.9, ease: EASE }}
          className="mx-auto mt-7 max-w-2xl text-[clamp(1.15rem,2.2vw,1.6rem)] leading-snug text-ink-700"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
          className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <ButtonLink href={config.demoUrl}>
            {t.hero.demo}
            <Icon name="arrow" className="h-4 w-4" strokeWidth={2.2} />
          </ButtonLink>
          <ButtonLink href={config.trialUrl} variant="ghost">
            {t.hero.trial}
          </ButtonLink>
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }} className="mt-4 text-[15px] text-ink-500">
          {t.hero.note}
        </motion.p>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-4 pb-24 md:mt-20 md:px-8" style={{ perspective: 1400 }}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.2, ease: EASE }}
        >
          <motion.div style={{ rotateX, scale, y, transformOrigin: 'center top' }} className="relative">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_40px_100px_-40px_rgba(15,23,42,0.35)] md:rounded-3xl">
              <div className="flex items-center gap-1.5 border-b border-line bg-bg-soft px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />              </div>
              <picture>
                <source media="(max-width: 640px)" srcSet={heroMobile} />
                <img src={hero} alt={t.hero.screenAlt} className="block w-full" width="1353" height="612" />
              </picture>
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { Reveal, SplitWords } from './ui.jsx'
import mark from '../assets/mark.webp'

export default function Future() {
  const t = useCopy().future
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.9])
  return (
    <section id="futuro" ref={ref} className="relative overflow-hidden bg-bg-soft py-28 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:gap-20 md:px-8">
        <motion.div style={{ rotate, scale }} className="relative shrink-0">
          <motion.div
            className="absolute inset-0 rounded-full bg-accent opacity-30 blur-3xl"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img
            src={mark}
            alt=""
            className="relative h-36 w-36 md:h-52 md:w-52"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
        <div className="text-center md:text-left">
          <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em]" />
          <Reveal delay={0.15}>
            <p className="mt-5 max-w-xl text-[18px] leading-relaxed text-ink-700">{t.text}</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

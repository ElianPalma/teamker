import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useCopy } from '../copyContext.js'

function Line({ progress, start, children }) {
  const opacity = useTransform(progress, [start - 0.08, start, 0.58, 0.66], [0.14, 1, 1, 0.3])
  const y = useTransform(progress, [start - 0.1, start], [18, 0])
  const blur = useTransform(progress, [start - 0.1, start], [6, 0])
  const filter = useTransform(blur, (v) => `blur(${v}px)`)
  return (
    <motion.p style={{ opacity, y, filter }} className="text-[clamp(2rem,5.4vw,4.4rem)] font-bold leading-[1.04] tracking-[-0.03em] text-white">
      {children}
    </motion.p>
  )
}

export default function Problem() {
  const t = useCopy()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const closingT = useTransform(scrollYProgress, (p) => Math.min(1, Math.max(0, (p - 0.58) / 0.1)))
  const closingOpacity = useTransform(closingT, (v) => v)
  const closingY = useTransform(closingT, (v) => 24 * (1 - v))
  const glowX = useTransform(scrollYProgress, [0, 0.7], ['20%', '80%'])
  const glow = useTransform(glowX, (x) => `radial-gradient(600px circle at ${x} 50%, rgba(125,9,255,0.35), transparent 65%)`)
  const starts = [0.1, 0.26, 0.42]

  return (
    <section id="problema" className="noise relative bg-night">
      <div ref={ref} className="relative h-[260vh]">
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <motion.div className="pointer-events-none absolute inset-0" style={{ background: glow }} />
          <div className="relative mx-auto flex max-w-5xl flex-col gap-6 px-4 text-center md:gap-8 md:px-8">
            {t.problem.lines.map((l, i) => (
              <Line key={i} progress={scrollYProgress} start={starts[i]}>
                {l}
              </Line>
            ))}
            <motion.p
              style={{ opacity: closingOpacity, y: closingY }}
              className="mt-4 text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-tight tracking-[-0.02em]"
            >
              <span className="text-gradient pb-[0.15em]">{t.problem.closing}</span>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  )
}

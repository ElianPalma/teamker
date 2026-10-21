import { motion } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { EASE, Reveal, SplitWords, Txt } from './ui.jsx'

function Stroke({ paths, delay }) {
  return (
    <motion.svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
      {paths.map((p, i) => (
        <motion.path
          key={i}
          d={p}
          variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 0.9, delay: delay + i * 0.12, ease: 'easeInOut' } } }}
        />
      ))}
    </motion.svg>
  )
}

function EuStars({ delay }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 - Math.PI / 2
    return { x: 12 + Math.cos(a) * 8, y: 12 + Math.sin(a) * 8 }
  })
  return (
    <motion.svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.5 }}>
      {stars.map((st, i) => (
        <motion.circle
          key={i}
          cx={st.x}
          cy={st.y}
          r="1.5"
          variants={{ hidden: { scale: 0, opacity: 0 }, show: { scale: 1, opacity: 1, transition: { delay: delay + i * 0.05, type: 'spring', stiffness: 400, damping: 15 } } }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      ))}
    </motion.svg>
  )
}

const exportPaths = ['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4', 'M14 3v5h5', 'M10 13h11', 'M18 10l3 3-3 3']
const eyeOffPaths = [
  'M10.73 5.08A10.74 10.74 0 0 1 21.94 11.65a1 1 0 0 1 0 .7 10.75 10.75 0 0 1-1.44 2.49',
  'M14.08 14.16a3 3 0 0 1-4.24-4.24',
  'M17.48 17.5A10.75 10.75 0 0 1 2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 4.45-5.14',
  'M2 2l20 20',
]

function PointIcon({ index, delay }) {
  if (index === 0) return <Stroke paths={exportPaths} delay={delay} />
  if (index === 1) return <EuStars delay={delay} />
  return <Stroke paths={eyeOffPaths} delay={delay} />
}

export default function Proof() {
  const t = useCopy().proof
  return (
    <section id="confianza" className="relative scroll-mt-16 overflow-hidden bg-white py-28 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-14 px-4 md:grid-cols-[1.25fr_1fr] md:gap-20 md:px-8">
        <div>
          <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-[clamp(2.6rem,5.6vw,4.4rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
          <Reveal delay={0.15}>
            <p className="mt-6 text-[18px] leading-relaxed text-ink-700">{t.text}</p>
          </Reveal>
          <Reveal delay={0.25}>
            <p className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-line px-5 py-3">
              <span className="text-2xl font-black tracking-tight text-mono">AIT</span>
              <span className="text-sm text-ink-500">{t.place}</span>
            </p>
          </Reveal>
        </div>
        <div className="flex flex-col divide-y divide-line">
          {t.points.map((p, i) => (
            <Reveal key={p.title} delay={0.1 + i * 0.12} className="flex items-center gap-4 py-6 first:pt-0">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-soft text-primary">
                <PointIcon index={i} delay={0.3 + i * 0.2} />
              </span>
              <div>
                <p className="text-lg font-bold text-ink-900">{p.title}</p>
                <p className="mt-1 text-[16px] text-ink-700">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-20 grid max-w-6xl grid-cols-2 gap-4 px-4 md:grid-cols-4 md:px-8">
        {t.stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="rounded-3xl bg-bg-soft p-6">
            <p className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-none tracking-[-0.03em] text-ink-900">
              <Txt>{s.value}</Txt>
            </p>
            <p className="mt-3 text-[15px] leading-snug text-ink-700">{s.label}</p>
          </Reveal>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-6xl px-4 md:px-8">
        <motion.figure
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="bg-brand relative overflow-hidden rounded-[2rem] p-8 text-white md:p-14"
        >
          <span className="pointer-events-none absolute -right-6 -top-16 select-none text-[16rem] font-black leading-none text-white/10" aria-hidden="true">
            “
          </span>
          <blockquote className="relative max-w-4xl text-[clamp(1.4rem,2.8vw,2.2rem)] font-semibold leading-snug">
            <Txt>{t.quote}</Txt>
          </blockquote>
          <figcaption className="relative mt-8 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-sm font-bold">AIT</span>
            <span>
              <span className="block font-bold">
                <Txt>{t.author}</Txt>
              </span>
              <span className="block text-white/80">
                <Txt>{t.role}</Txt>
              </span>
            </span>
          </figcaption>
        </motion.figure>
      </div>
    </section>
  )
}

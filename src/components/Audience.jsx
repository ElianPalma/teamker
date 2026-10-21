import { motion } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { EASE, Icon, Reveal, SplitWords } from './ui.jsx'

function Steps({ steps }) {
  return (
    <ol className="relative mt-8 flex flex-col gap-4">
      <motion.li
        aria-hidden="true"
        className="bg-brand absolute bottom-4 left-[15px] top-4 w-0.5 origin-top rounded"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, ease: EASE, delay: 0.2 }}
      />
      {steps.map((s, i) => (
        <motion.li
          key={s}
          className="relative flex items-center gap-4"
          initial={{ opacity: 0, x: -12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.3 + i * 0.35, duration: 0.6, ease: EASE }}
        >
          <motion.span
            className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary ring-2 ring-primary"
            initial={{ scale: 0.6 }}
            whileInView={{ scale: 1, backgroundColor: '#7d09ff', color: '#ffffff' }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ delay: 0.5 + i * 0.35, type: 'spring', stiffness: 300, damping: 18 }}
          >
            <Icon name="check" className="h-4 w-4" strokeWidth={3} />
          </motion.span>
          <span className="text-[17px] font-semibold text-ink-900">{s}</span>
        </motion.li>
      ))}
    </ol>
  )
}

function Pending({ items }) {
  const review = useCopy().audience.review
  const tones = ['bg-warning-soft text-warning', 'bg-violet-soft text-primary', 'bg-error-soft text-error']
  const icons = ['clock', 'plane', 'file']
  return (
    <div className="mt-8 flex flex-col gap-3">
      {items.map((it, i) => (
        <motion.div
          key={it}
          className="flex items-center gap-3 rounded-2xl border border-line bg-white p-3.5"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ delay: 0.25 + i * 0.15, duration: 0.6, ease: EASE }}
        >
          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[i]}`}>
            <Icon name={icons[i]} className="h-[18px] w-[18px]" />
          </span>
          <span className="flex-1 text-[15px] font-semibold text-ink-900">{it}</span>
          <span className="text-sm font-semibold text-primary">{review}</span>
        </motion.div>
      ))}
    </div>
  )
}

export default function Audience() {
  const t = useCopy().audience
  return (
    <section id="para-quien" className="relative scroll-mt-16 bg-bg-soft py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="mx-auto max-w-4xl text-center text-[clamp(2.4rem,5.4vw,4.2rem)] font-bold leading-[1.04] tracking-[-0.035em]" />
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2">
          {t.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12}>
              <div className="h-full rounded-[2rem] border border-line bg-white p-8 md:p-10">
                <h3 className="text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.02em] text-ink-900">{c.title}</h3>
                <p className="mt-4 text-[17px] leading-relaxed text-ink-700">{c.text}</p>
                {c.steps ? <Steps steps={c.steps} /> : <Pending items={c.pending} />}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

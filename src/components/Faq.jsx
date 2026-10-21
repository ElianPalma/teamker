import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { EASE, Reveal, SplitWords } from './ui.jsx'

export default function Faq() {
  const t = useCopy().faq
  const [open, setOpen] = useState(0)
  return (
    <section id="preguntas" className="relative scroll-mt-16 bg-bg-soft py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-center text-[clamp(2.4rem,5.4vw,4rem)] font-bold leading-[1.04] tracking-[-0.035em]" />
        <div className="mt-14 flex flex-col gap-3">
          {t.items.map((it, i) => {
            const isOpen = open === i
            return (
              <Reveal key={it.q} delay={i * 0.06}>
                <div className={`rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300 ${isOpen ? 'border-primary/40 shadow-[0_20px_50px_-30px_rgba(125,9,255,0.5)]' : 'border-line'}`}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 rounded-2xl bg-transparent px-6 py-5 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    <span className="text-lg font-semibold text-ink-900">{it.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0, backgroundColor: isOpen ? '#7d09ff' : '#f1e6ff', color: isOpen ? '#ffffff' : '#7d09ff' }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-[17px] leading-relaxed text-ink-700">{it.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

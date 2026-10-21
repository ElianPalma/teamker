import { useRef } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { useCopy } from '../copyContext.js'
import { Avatar, Badge, EASE, Icon, Reveal, SplitWords, Window, useLoop } from './ui.jsx'

function Folder({ active, examples }) {
  const t = useCopy().demo.docs
  const phase = useLoop([1400, 1600, 2600], active)
  const tones = ['violet', 'info']
  const docs = t.items.map((d, i) => ({ ...d, tone: tones[i] }))
  return (
    <Window className="w-full min-w-0 max-w-[860px]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-b border-line bg-bg-soft p-6 md:border-b-0 md:border-r">
          <Avatar initials="LG" color="#7d09ff" size="h-16 w-16 text-xl" />
          <p className="mt-4 text-lg font-bold text-ink-900">Lucía Gómez</p>
          <p className="text-sm text-ink-500">{t.place}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            <Badge tone="success">{t.active}</Badge>
            <Badge tone="gray">{t.fullTime}</Badge>
          </div>
          <div className="mt-6 hidden space-y-2 text-sm text-ink-700 md:block">
            {t.tabs.map((x, i) => (
              <div key={x} className={`rounded-lg px-3 py-2 ${i === t.tabs.length - 1 ? 'bg-white font-semibold text-primary shadow-sm' : ''}`}>{x}</div>
            ))}
          </div>
        </aside>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-lg font-bold text-ink-900">
              <Icon name="folder" className="h-5 w-5 text-primary" />
              {t.title}
            </p>
            <motion.span animate={{ scale: phase === 1 ? 0.95 : 1 }} className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-white">
              <Icon name="plus" className="h-4 w-4" strokeWidth={2.4} />
              {t.upload}
            </motion.span>
          </div>
          <ul className="mt-5 flex flex-col gap-2.5">
            <AnimatePresence initial={false}>
              {phase >= 1 && (
                <motion.li
                  key="nomina"
                  layout
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="relative overflow-hidden rounded-2xl border border-primary/30 bg-violet-soft/40 p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-sm">
                      <Icon name="file" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-ink-900">{examples[1]}</p>
                      <p className="text-xs text-ink-500">{phase === 1 ? t.uploading : t.justNow}</p>
                    </div>
                    {phase === 2 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                        <Badge tone="violet">{t.newBadge}</Badge>
                      </motion.span>
                    )}
                  </div>
                  {phase === 1 && (
                    <motion.div className="bg-brand absolute bottom-0 left-0 h-1" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.4, ease: 'easeInOut' }} />
                  )}
                </motion.li>
              )}
              {docs.map((d) => (
                <motion.li key={d.name} layout transition={{ duration: 0.6, ease: EASE }} className="flex items-center gap-3 rounded-2xl border border-line p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-soft text-ink-500">
                    <Icon name="file" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink-900">{d.name}</p>
                    <p className="text-xs text-ink-500">{d.meta}</p>
                  </div>
                  <Badge tone={d.tone}>{d.tag}</Badge>
                  <Icon name="download" className="hidden h-5 w-5 text-ink-400 sm:block" />
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <AnimatePresence>
            {phase === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
                className="mt-4 flex items-center gap-2 rounded-xl bg-success-soft px-4 py-3 text-sm font-semibold text-success"
              >
                <Icon name="bell" className="h-4 w-4" />
                {t.notice}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Window>
  )
}

export default function FeatureDocs() {
  const t = useCopy().feature.docs
  const ref = useRef(null)
  const inView = useInView(ref, { amount: 0.4 })
  return (
    <section id="documentos" className="relative scroll-mt-16 overflow-hidden bg-bg-soft py-28 md:py-36">
      <div className="mx-auto max-w-3xl px-4 text-center md:px-8">
        <Reveal>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-primary">{t.kicker}</p>
        </Reveal>
        <SplitWords text={t.title} highlightFrom={t.highlightFrom} className="text-[clamp(2.6rem,6vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.035em]" />
        <Reveal delay={0.15}>
          <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.1rem,1.8vw,1.35rem)] leading-snug text-ink-700">{t.subtitle}</p>
        </Reveal>
      </div>
      <div ref={ref} className="relative mx-auto mt-14 flex max-w-5xl justify-center px-4 md:mt-20 md:px-8">
        <Reveal className="w-full">
          <div className="flex justify-center">
            <Folder active={inView} examples={t.examples} />
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.1}>
        <p className="mt-12 text-center text-lg font-semibold text-ink-700">{t.note}</p>
      </Reveal>
    </section>
  )
}
